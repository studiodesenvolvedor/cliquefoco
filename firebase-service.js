import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {
  getAuth, setPersistence, browserLocalPersistence, signInAnonymously,
  signInWithEmailAndPassword, signOut, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import {
  getFirestore, collection, doc, query, where, onSnapshot, getDocFromServer,
  setDoc, runTransaction, serverTimestamp, Timestamp
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';
import { firebaseConfig, ADMIN_UID } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const SETTINGS = doc(db, 'settings', 'public');
const TIMES = ['10:00','12:00','14:00','16:00','18:00','20:00'];
const ready = setPersistence(auth, browserLocalPersistence).then(() => auth.authStateReady());
let dirtyEvent = Promise.resolve();
const eventSeen = new Set();

export function message(error) {
  const messages = {
    'permission-denied': 'Acesso bloqueado. Confira se publicou o arquivo firestore.rules no banco (default).',
    'unauthenticated': 'Entre novamente no sistema.',
    'auth/operation-not-allowed': 'Ative os métodos Anônimo e E-mail/senha no Firebase Authentication.',
    'auth/unauthorized-domain': 'Adicione o domínio deste site aos domínios autorizados do Firebase Authentication.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/invalid-email': 'Informe um e-mail válido.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde e tente novamente.',
    'auth/network-request-failed': 'Sem conexão com o Firebase. Verifique a internet.',
    'resource-exhausted': 'O limite de uso do Firebase foi atingido. Confira a aba Uso do projeto.',
    'unavailable': 'Sem conexão com o Firebase. Tente novamente.'
  };
  return messages[error?.code] || error?.message || 'Não foi possível concluir a operação.';
}

function user() {
  if (!auth.currentUser) throw new Error('Aguarde a conexão com o Firebase.');
  return auth.currentUser;
}
function admin() {
  if (user().uid !== ADMIN_UID) throw new Error('Acesso reservado ao administrador.');
}
export async function login(email, password) {
  await ready;
  const result = await signInWithEmailAndPassword(auth, email, password);
  if (result.user.uid !== ADMIN_UID) {
    await signOut(auth);
    throw new Error('Essa conta não é a administradora configurada para este site.');
  }
}
export async function logout() { await signOut(auth); }

// Applies this requested brand update once, including for a previously saved CMS document.
// The marker is saved alongside the next CMS publication; later admin edits remain respected.
export function applyBrandUpdate(settings) {
  if (settings.brandUpdateVersion === 'ceo-contact-20261015') return settings;
  return {
    ...settings,
    ceoPhoto: new URL('./ceo.jpeg', import.meta.url).href,
    whatsappNumber: '5586998264603',
    brandUpdateVersion: 'ceo-contact-20261015'
  };
}

export function subscribe({defaults, onSettings, onLeads, onSlots, onMetrics, onIdentity, onError, onReady}) {
  let unsub = [], closed = false, stopAuth = () => {};
  const report = e => { if (!closed) onError(message(e)); };
  ready.then(() => {
    if (closed) return;
    stopAuth = onAuthStateChanged(auth, async account => {
      unsub.forEach(fn => fn()); unsub = [];
      if (closed) return;
      if (!account) {
        if (location.hash === '#admin') { location.replace('./admin.html'); return; }
        try { await signInAnonymously(auth); } catch(e) { report(e); }
        return;
      }
      const isAdmin = account.uid === ADMIN_UID;
      if (location.hash === '#admin' && !isAdmin) { location.replace('./admin.html'); return; }
      onIdentity(isAdmin);
      let loaded = new Set();
      const done = kind => { loaded.add(kind); if (loaded.size === 3) onReady(); };
      unsub.push(onSnapshot(SETTINGS, {includeMetadataChanges:true}, snap => {
        if (snap.metadata.fromCache) return;
        const value = snap.exists() ? snap.data() : {data:defaults,revision:0};
        const effective = applyBrandUpdate({...defaults,...value.data});
        onSettings(effective, value.revision || 0);
        if (isAdmin && value.data?.brandUpdateVersion !== effective.brandUpdateVersion) {
          saveSettings(effective, value.revision || 0).catch(report);
        }
        done('settings');
      }, report));
      const leadsQuery = isAdmin ? collection(db,'leads') : query(collection(db,'leads'),where('ownerUid','==',account.uid));
      unsub.push(onSnapshot(leadsQuery, {includeMetadataChanges:true}, snap => {
        if (snap.metadata.fromCache || snap.metadata.hasPendingWrites) return;
        const leads = snap.docs.map(d => ({...d.data(), id:d.id})).map(l => ({...l, createdAt:l.createdAt?.toDate?.().toISOString() || ''}));
        onLeads(leads.sort((a,b) => b.createdAt.localeCompare(a.createdAt)), isAdmin);
        done('leads');
      }, report));
      unsub.push(onSnapshot(collection(db,'days'), {includeMetadataChanges:true}, snap => {
        if (snap.metadata.fromCache || snap.metadata.hasPendingWrites) return;
        onSlots(snap.docs.flatMap(d => Object.keys(d.data().slots || {}).map(time => ({date:d.id,time}))));
        done('slots');
      }, report));
      if (isAdmin) {
        unsub.push(onSnapshot(collection(db,'events'), snap => {
          const metrics = {};
          for (const d of snap.docs) for (const [k,v] of Object.entries(d.data().flags || {})) if (v === true) metrics[k] = (metrics[k] || 0)+1;
          onMetrics(metrics);
        }, report));
      } else track('visit');
    }, report);
  }).catch(report);
  return () => { closed = true; stopAuth(); unsub.forEach(fn => fn()); };
}

export async function saveSettings(settings, revision) {
  admin();
  const next = {...settings,videoType:'embed',videoFileData:null};
  next.videoUrl = normalizeVideoUrl(String(next.videoUrl || '').trim());
  for (const key of ['ceoPhoto','videoThumbnail']) if (next[key] && !/^https:\/\//i.test(next[key])) throw new Error('Use um endereço HTTPS para a imagem.');
  return runTransaction(db, async tx => {
    const snap = await tx.get(SETTINGS);
    const current = snap.exists() ? snap.data().revision : 0;
    if (current !== revision) throw new Error('Outro admin publicou alterações. Recarregue a página antes de editar novamente.');
    tx.set(SETTINGS,{data:next,revision:current+1,updatedAt:serverTimestamp()});
    return current+1;
  });
}

export function normalizeVideoUrl(value) {
  if (!value) return '';
  let url;
  try { url = new URL(value); } catch { throw new Error('Cole um link completo do YouTube ou Vimeo.'); }
  if (url.protocol !== 'https:') throw new Error('Use um link HTTPS do vídeo.');
  if (['youtu.be','www.youtu.be'].includes(url.hostname)) {
    const id = url.pathname.split('/')[1];
    if (/^[\w-]{11}$/.test(id || '')) return `https://www.youtube.com/embed/${id}`;
  }
  if (['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(url.hostname)) {
    const id = url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop();
    if (/^[\w-]{11}$/.test(id || '')) return `https://www.youtube.com/embed/${id}`;
  }
  if (['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(url.hostname)) {
    const id = url.pathname.split('/').filter(Boolean).pop();
    if (/^\d+$/.test(id || '')) return `https://player.vimeo.com/video/${id}`;
  }
  throw new Error('Esse endereço não é um link válido do YouTube ou Vimeo.');
}

export async function saveLead(incoming) {
  const account = user(), isAdmin = account.uid === ADMIN_UID;
  // The public questionnaire does not supply an ID, even when an admin tests it.
  const leadId = isAdmin ? (incoming.id || doc(collection(db,'leads')).id) : account.uid;
  const ref = doc(db,'leads',leadId);
  const snap = await getDocFromServer(ref);
  const previous = snap.exists() ? snap.data() : null;
  if (previous && !isAdmin) return ref.id; // one application per anonymous identity; safe retry
  const fields = ['name','email','phone','company','role','revenue','sector'];
  const lead = Object.fromEntries(fields.map(k => [k,String(incoming[k] || '').trim().slice(0,1000)]));
  if (!['name','email','phone','company'].every(k => lead[k])) throw new Error('Preencha nome, e-mail, telefone e empresa.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) throw new Error('Informe um e-mail válido.');
  if (lead.phone.replace(/\D/g,'').length < 10) throw new Error('Informe um telefone com DDD.');
  if (previous) {
    await runTransaction(db, async tx => {
      const fresh = await tx.get(ref);
      // Keep booking fields from the server so a parallel booking is never overwritten.
      const old = fresh.data();
      tx.update(ref,{...lead,status:incoming.status || old.status,updatedAt:serverTimestamp()});
    });
  } else {
    await setDoc(ref,{
      ...lead,ownerUid:account.uid,status:'NOVO',score:85,priority:'ALTA',
      answers: isAdmin ? {} : Object.fromEntries(fields.map(k => [k,lead[k]])),
      createdAt:serverTimestamp(),updatedAt:serverTimestamp()
    });
  }
  if (!isAdmin) track('completed');
  return ref.id;
}

export async function book(id, slot) {
  const account = user(), isAdmin = account.uid === ADMIN_UID;
  const start = new Date(`${slot.date}T${slot.time}:00-03:00`);
  const weekday = new Date(`${slot.date}T12:00:00-03:00`).getUTCDay();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(slot.date || '') || !TIMES.includes(slot.time) || ![2,3,4,5].includes(weekday) || !['online','presencial'].includes(slot.type) || !Number.isFinite(start.getTime()) || start <= new Date()) throw new Error('Escolha um horário futuro, de terça a sexta.');
  const leadRef = doc(db,'leads',id), dayRef = doc(db,'days',slot.date);
  await runTransaction(db, async tx => {
    const leadSnap = await tx.get(leadRef);
    if (!leadSnap.exists()) throw new Error('Cadastro não encontrado.');
    const lead = leadSnap.data();
    if (!isAdmin && lead.ownerUid !== account.uid) throw new Error('Esse cadastro não pertence a você.');
    const old = lead.appointment;
    if (old && old.date === slot.date && old.time === slot.time && old.type === slot.type) return;
    if (old && !isAdmin) throw new Error('Sua reunião já foi agendada. Entre em contato com a equipe para remarcar.');
    const daySnap = await tx.get(dayRef);
    const slots = {...(daySnap.exists() ? daySnap.data().slots : {})};
    const oldRef = old && old.date !== slot.date ? doc(db,'days',old.date) : null;
    const oldSnap = oldRef ? await tx.get(oldRef) : null;
    if (old && old.date === slot.date) delete slots[old.time];
    if (slots[slot.time] && slots[slot.time] !== id) throw new Error('Esse horário acabou de ser reservado. Escolha outro.');
    if (Object.keys(slots).length >= 3 && slots[slot.time] !== id) throw new Error('Esse dia atingiu o limite de três reuniões.');
    slots[slot.time] = id;
    if (oldRef && oldSnap.exists()) {
      const oldSlots = {...oldSnap.data().slots}; delete oldSlots[old.time];
      tx.set(oldRef,{slots:oldSlots});
    }
    tx.set(dayRef,{slots});
    tx.update(leadRef,{
      status:'REUNIÃO AGENDADA',
      appointment:{date:slot.date,time:slot.time,type:slot.type,startAt:Timestamp.fromDate(start)},
      updatedAt:serverTimestamp()
    });
  });
  if (!isAdmin) track('booked');
}

export function track(event) {
  if (!auth.currentUser || auth.currentUser.uid === ADMIN_UID || eventSeen.has(event)) return;
  const id = auth.currentUser.uid;
  if (!['visit','video','application','completed','booked'].includes(event)) return;
  eventSeen.add(event);
  dirtyEvent = dirtyEvent.catch(() => {}).then(() => setDoc(doc(db,'events',id),{flags:{[event]:true}},{merge:true})).catch(() => {eventSeen.delete(event);});
}
