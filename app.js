const {
  useState,
  useEffect,
  useRef
} = React;
const firebaseReady = import('./firebase-service.js');
function track(event) {
  firebaseReady.then(F => F.track(event)).catch(() => {});
}
function embedUrl(value) {
  try {
    const url = new URL(value);
    if (url.hostname === 'youtu.be') return 'https://www.youtube.com/embed/' + url.pathname.slice(1);
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) {
      const id = url.searchParams.get('v') || url.pathname.split('/').pop();
      return 'https://www.youtube.com/embed/' + encodeURIComponent(id);
    }
    if (['vimeo.com', 'www.vimeo.com'].includes(url.hostname)) return 'https://player.vimeo.com/video/' + url.pathname.split('/').pop();
    return value;
  } catch {
    return value;
  }
}

// --- ÍCONES SVG ---
const Icons = {
  Play: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-6 h-6 fill-current",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 5v14l11-7z"
  })),
  Calendar: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
  })),
  User: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
  })),
  Check: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M5 13l4 4L19 7"
  })),
  Shield: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 inline mr-1",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
  })),
  ArrowRight: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5 ml-2",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M14 5l7 7m0 0l-7 7m7-7H3"
  })),
  ArrowLeft: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5 mr-1",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M10 19l-7-7m0 0l7-7m-7 7h18"
  })),
  Settings: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
  }), /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
  })),
  BarChart: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
  })),
  Whatsapp: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5 fill-current",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.285-.143-1.686-.833-1.947-.928-.262-.095-.452-.143-.642.143-.19.285-.737.928-.903 1.118-.166.19-.333.214-.618.071-.285-.143-1.204-.444-2.293-1.415-.848-.756-1.42-1.689-1.587-1.975-.166-.285-.018-.439.125-.581.128-.128.285-.333.428-.5.143-.166.19-.285.285-.476.095-.19.048-.357-.024-.5-.071-.143-.642-1.547-.88-2.118-.232-.557-.468-.482-.642-.49-.166-.008-.357-.01-.547-.01-.19 0-.5.071-.761.357-.262.285-1 1-.977 1 2.428 0 1.428 1.023 2.809 2.476 4.111 1.744 1.565 2.808 2.213 3.189 2.378 1.143.498 1.619.444 2.213.357.666-.098 1.686-.689 1.924-1.355.238-.666.238-1.236.166-1.355-.071-.119-.262-.19-.547-.333z"
  })),
  Plus: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M12 4v16m8-8H4"
  })),
  Video: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
  })),
  Building: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
  })),
  Monitor: () => /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
  }))
};

// --- DADOS PADRÃO ---
const DEFAULT_SETTINGS = {
  agencyName: "Clique Foco",
  tagline: "MARKETING AUDIOVISUAL • CONTEÚDO QUE CONECTA",
  headline: "Conheça nossa metodologia e descubra como podemos ajudar sua empresa ou marca pessoal.",
  subheadline: "Conseguiu entender a nossa metodologia e sentiu que sua empresa precisa evoluir? Dê o próximo passo.",
  description: "Conteúdo estratégico e produção audiovisual que direcionam, criam e fazem acontecer o marketing de verdade da sua empresa.",
  buttonText: "INICIAR APLICAÇÃO",
  microcopy: "Processo direto, rápido e 100% confidencial",
  videoType: "embed",
  videoUrl: "",
  videoFileData: null,
  videoThumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  confirmationMessage: "Sua reunião foi agendada com sucesso. O primeiro passo foi dado. Agora vamos construir juntos o próximo passo.",
  whatsappNumber: "5586998264603",
  ceoName: "Anderson Medeiros",
  ceoRole: "Fundador & Diretor de Estratégia",
  ceoPhoto: "https://studiodesenvolvedor.github.io/cliquefoco/ceo.jpeg",
  ceoMessage: "Marketing não começa na divulgação, começa no entendimento. Antes de aplicar a estratégia de marketing, entendemos o momento da sua empresa. Identificamos suas lacunas e estruturamos o que precisa ser ajustado para que o marketing tenha uma base sólida."
};
const DEFAULT_QUESTIONS = [{
  id: 'name',
  label: 'Qual é o seu nome completo?',
  type: 'text',
  required: true
}, {
  id: 'email',
  label: 'Qual é o seu melhor e-mail corporativo?',
  type: 'email',
  required: true
}, {
  id: 'phone',
  label: 'Qual é o seu WhatsApp para contato?',
  type: 'phone',
  required: true
}, {
  id: 'company',
  label: 'Qual é o nome da sua empresa?',
  type: 'text',
  required: true
}, {
  id: 'role',
  label: 'Qual é o seu cargo na empresa?',
  type: 'select',
  required: true,
  options: ['Proprietário(a)', 'Sócio(a)', 'Diretor(a)', 'Gerente de Marketing', 'Outro']
}, {
  id: 'revenue',
  label: 'Qual foi o faturamento aproximado no último ano?',
  type: 'select',
  required: true,
  options: ['Até R$ 100 mil', 'R$ 100 mil a R$ 300 mil', 'R$ 300 mil a R$ 1 milhão', 'Acima de R$ 1 milhão']
}, {
  id: 'sector',
  label: 'Qual é o setor de atuação da sua empresa?',
  type: 'select',
  required: true,
  options: ['Serviços', 'Saúde & Estética', 'Varejo / E-commerce', 'Tecnologia', 'Outro']
}];
function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [settings, updateSettings] = useState(DEFAULT_SETTINGS);
  const [questions] = useState(DEFAULT_QUESTIONS);
  const [leads, updateLeads] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [currentLead, setCurrentLead] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [metrics, setMetrics] = useState({});
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('Conectando ao servidor…');
  const [dirty, setDirty] = useState(false);
  const dirtyRef = useRef(false),
    busyRef = useRef(false),
    revision = useRef(0);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    let stop = () => {},
      disposed = false;
    const timeout = setTimeout(() => setNotice('A conexão está demorando. Confira a internet e se publicou as regras do Firestore.'), 15000);
    firebaseReady.then(F => {
      if (disposed) return;
      stop = F.subscribe({
        defaults: DEFAULT_SETTINGS,
        onSettings: (data, rev) => {
          if (!dirtyRef.current) {
            updateSettings(data);
            revision.current = rev;
          }
        },
        onLeads: (data, admin) => {
          updateLeads(data);
          if (!admin) {
            setCurrentLead(data[0] || null);
            setSelectedAppointment(data[0]?.appointment || null);
          }
        },
        onSlots: setBookedSlots,
        onMetrics: setMetrics,
        onIdentity: admin => {
          setIsAdmin(admin);
          if (admin && location.hash === '#admin') setCurrentView('admin');
        },
        onError: error => {
          clearTimeout(timeout);
          setNotice(error);
        },
        onReady: () => {
          clearTimeout(timeout);
          setReady(true);
          setNotice('Conectado • atualizações automáticas');
        }
      });
    }).catch(() => {
      clearTimeout(timeout);
      setNotice('Não foi possível carregar o Firebase. Confira a internet e abra a página pelo link do GitHub Pages.');
    });
    const leave = event => {
      if (dirtyRef.current) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    const offline = () => setNotice('Sem internet. Os envios serão confirmados somente após conexão com o Firebase.');
    window.addEventListener('beforeunload', leave);
    window.addEventListener('offline', offline);
    return () => {
      disposed = true;
      clearTimeout(timeout);
      stop();
      window.removeEventListener('beforeunload', leave);
      window.removeEventListener('offline', offline);
    };
  }, []);
  const action = async fn => {
    if (busyRef.current) return false;
    busyRef.current = true;
    setBusy(true);
    setNotice('Salvando no Firebase…');
    try {
      await fn();
      setNotice('Salvo e sincronizado.');
      return true;
    } catch (e) {
      const F = await firebaseReady;
      const text = F.message(e);
      setNotice(text);
      alert(text);
      return false;
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };
  const setSettings = next => {
    dirtyRef.current = true;
    setDirty(true);
    updateSettings(next);
  };
  const saveSettings = () => action(async () => {
    const F = await firebaseReady;
    const rev = await F.saveSettings(settings, revision.current);
    revision.current = rev;
    dirtyRef.current = false;
    setDirty(false);
    updateSettings({
      ...settings,
      videoUrl: F.normalizeVideoUrl(settings.videoUrl || ''),
      videoType: 'embed',
      videoFileData: null
    });
  });
  const setLeads = async next => {
    const changed = next.find(item => JSON.stringify(item) !== JSON.stringify(leads.find(old => old.id === item.id)));
    if (!changed) return true;
    return action(async () => (await firebaseReady).saveLead(changed));
  };
  const bookForAdmin = (id, slot) => action(async () => (await firebaseReady).book(id, slot));
  const handleLogoClick = async () => {
    if (dirtyRef.current && !confirm('Há alterações não publicadas. Deseja sair?')) return;
    dirtyRef.current = false;
    if (isAdmin) await (await firebaseReady).logout();
    location.href = './index.html';
  };
  const formatPhone = value => {
    if (!value) return '';
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').substring(0, 15);
  };
  const handleApplicationComplete = async answers => {
    const ok = await action(async () => {
      const id = await (await firebaseReady).saveLead({
        ...answers,
        answers
      });
      setCurrentLead({
        id,
        ...answers,
        status: 'NOVO'
      });
    });
    if (ok) setCurrentView('booking');
  };
  const handleBookingComplete = async slot => {
    if (!currentLead) return;
    const ok = await action(async () => (await firebaseReady).book(currentLead.id, slot));
    if (ok) {
      setSelectedAppointment(slot);
      setCurrentView('confirmation');
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("header", {
    className: "sticky top-0 z-50 bg-[#F5E9D7]/90 backdrop-blur-md border-b border-[#683D2E]/10 px-4 py-3.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-5xl mx-auto flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2.5 cursor-pointer",
    onClick: handleLogoClick
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-8 h-8 rounded-lg bg-[#C04E2A] flex items-center justify-center font-bold text-[#F5E9D7] text-base shadow-sm"
  }, "C"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "font-extrabold text-base text-[#683D2E] tracking-tight"
  }, settings.agencyName), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center text-[10px] text-[#2E5E3E] font-bold"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-1.5 h-1.5 rounded-full bg-[#2E5E3E] animate-pulse mr-1"
  }), "AGENDA ABERTA")))), currentView === 'admin' && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleLogoClick,
    className: "block mx-auto text-xs underline p-2"
  }, "Sair do admin")), /*#__PURE__*/React.createElement("div", {
    role: "status",
    "aria-live": "polite",
    className: "px-4 py-2 text-center text-xs"
  }, busy ? 'Salvando…' : notice), !ready && /*#__PURE__*/React.createElement("p", {
    className: "text-center p-8"
  }, "Aguardando conexão. Abra esta página pelo endereço do GitHub Pages."), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 pb-12"
  }, /*#__PURE__*/React.createElement("fieldset", {
    disabled: busy,
    style: {
      border: 0,
      padding: 0,
      margin: 0,
      minWidth: 0
    }
  }, ready && /*#__PURE__*/React.createElement(React.Fragment, null, currentLead && !isAdmin && currentView !== 'admin' && /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto m-4 p-4 rounded-xl bg-white border text-sm space-y-2"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Seu atendimento:"), " ", currentLead.name, " • ", currentLead.company), /*#__PURE__*/React.createElement("p", null, currentLead.email, " • ", currentLead.phone), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Situação:"), " ", currentLead.status), currentLead.appointment && /*#__PURE__*/React.createElement("p", null, "Reunião: ", currentLead.appointment.date.split('-').reverse().join('/'), " às ", currentLead.appointment.time, " • ", currentLead.appointment.type), !currentLead.appointment && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "underline",
    onClick: () => setCurrentView('booking')
  }, "Escolher horário da reunião")), currentView === 'landing' && /*#__PURE__*/React.createElement(LandingPage, {
    settings: settings,
    onStart: () => {
      if (currentLead) setCurrentView(currentLead.appointment ? 'confirmation' : 'booking');else {
        track('application');
        setCurrentView('application');
      }
    }
  }), currentView === 'application' && /*#__PURE__*/React.createElement(ApplicationForm, {
    questions: questions,
    formatPhone: formatPhone,
    onComplete: handleApplicationComplete,
    onBack: () => setCurrentView('landing')
  }), currentView === 'booking' && /*#__PURE__*/React.createElement(BookingCalendar, {
    settings: settings,
    bookedSlots: bookedSlots,
    onSelectSlot: handleBookingComplete,
    leadName: currentLead?.name
  }), currentView === 'confirmation' && /*#__PURE__*/React.createElement(ConfirmationPage, {
    settings: settings,
    lead: currentLead,
    appointment: selectedAppointment,
    onRestart: () => setCurrentView('landing')
  }), currentView === 'admin' && isAdmin && /*#__PURE__*/React.createElement(AdminDashboard, {
    settings: settings,
    setSettings: setSettings,
    leads: leads,
    setLeads: setLeads,
    bookedSlots: bookedSlots,
    formatPhone: formatPhone,
    metrics: metrics,
    saveSettings: saveSettings,
    dirty: dirty,
    bookForAdmin: bookForAdmin
  })))), /*#__PURE__*/React.createElement("footer", {
    className: "border-t border-[#683D2E]/10 py-6 text-center text-xs text-[#683D2E]/60"
  }, /*#__PURE__*/React.createElement("p", null, "© 2026 ", settings.agencyName, " • Marketing Audiovisual")));
}

// ==========================================
// 01. LANDING PAGE
// ==========================================
function LandingPage({
  settings,
  onStart
}) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  useEffect(() => setIsVideoPlaying(false), [settings.videoUrl, settings.videoFileData]);
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto px-4 pt-6 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center space-y-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#E1B12C]/20 text-[#683D2E] border border-[#E1B12C]/40"
  }, settings.tagline)), /*#__PURE__*/React.createElement("div", {
    className: "text-center px-2"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg sm:text-xl font-bold text-[#683D2E] leading-relaxed"
  }, settings.headline)), settings.videoUrl && /*#__PURE__*/React.createElement("div", {
    className: "relative rounded-2xl overflow-hidden clean-card aspect-video group"
  }, !isVideoPlaying ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Assistir ao vídeo",
    className: "relative w-full h-full cursor-pointer",
    onClick: () => {
      track('video');
      setIsVideoPlaying(true);
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: settings.videoThumbnail,
    alt: "Apresentação",
    className: "w-full h-full object-cover"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-black/30 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rounded-full p-4 bg-[#C04E2A] text-white"
  }, /*#__PURE__*/React.createElement(Icons.Play, null)))) : /*#__PURE__*/React.createElement("iframe", {
    key: settings.videoUrl,
    src: embedUrl(settings.videoUrl) + '?autoplay=1',
    title: "Vídeo Explicativo",
    className: "w-full h-full border-0",
    allow: "autoplay; encrypted-media; picture-in-picture",
    allowFullScreen: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 pt-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center px-2"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-semibold text-[#683D2E]/90 leading-relaxed"
  }, settings.subheadline)), /*#__PURE__*/React.createElement("button", {
    onClick: onStart,
    className: "w-full py-4 px-6 rounded-xl bg-[#C04E2A] hover:bg-[#C04E2A]/90 text-white font-extrabold text-base flex items-center justify-center space-x-2 shadow-lg shadow-[#C04E2A]/20 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement("span", null, settings.buttonText), /*#__PURE__*/React.createElement(Icons.ArrowRight, null)), /*#__PURE__*/React.createElement("p", {
    className: "text-center text-xs text-[#683D2E]/60 flex items-center justify-center font-medium"
  }, /*#__PURE__*/React.createElement(Icons.Shield, null), settings.microcopy)), /*#__PURE__*/React.createElement("div", {
    className: "clean-card rounded-2xl p-5 text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[#683D2E]/90 text-sm leading-relaxed font-medium"
  }, settings.description)), settings.ceoName && /*#__PURE__*/React.createElement("div", {
    className: "clean-card p-5 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 text-center sm:text-left"
  }, /*#__PURE__*/React.createElement("img", {
    src: settings.ceoPhoto,
    alt: settings.ceoName,
    className: "w-16 h-16 rounded-full object-cover border-2 border-[#C04E2A] flex-shrink-0 shadow-sm"
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-xs space-y-2"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[#683D2E]/90 italic leading-relaxed"
  }, "\"", settings.ceoMessage, "\""), /*#__PURE__*/React.createElement("div", {
    className: "pt-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[#683D2E] font-bold text-sm"
  }, settings.ceoName), /*#__PURE__*/React.createElement("p", {
    className: "text-[#C04E2A] font-semibold text-[11px]"
  }, settings.ceoRole)))));
}

// ==========================================
// 02. FORMULÁRIO DE APLICAÇÃO
// ==========================================
function ApplicationForm({
  questions,
  formatPhone,
  onComplete,
  onBack
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const question = questions[currentStep];
  const totalSteps = questions.length;
  const handleNext = () => {
    const value = String(answers[question.id] || '').trim();
    if (question.required && !value) {
      alert('Preencha este campo para continuar.');
      return;
    }
    if (question.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      alert('Informe um e-mail válido.');
      return;
    }
    if (question.type === 'phone' && value.replace(/\D/g, '').length < 10) {
      alert('Informe um telefone com DDD.');
      return;
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(answers);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto px-4 pt-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "clean-card rounded-2xl p-6 sm:p-8 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center text-xs font-semibold text-[#683D2E]/60"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    className: "flex items-center text-[#C04E2A] font-bold"
  }, /*#__PURE__*/React.createElement(Icons.ArrowLeft, null), " Voltar"), /*#__PURE__*/React.createElement("span", null, "Etapa ", currentStep + 1, " de ", totalSteps)), /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-bold text-[#683D2E]"
  }, question.label), question.type === 'text' && /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: answers[question.id] || '',
    onChange: e => setAnswers({
      ...answers,
      [question.id]: e.target.value
    }),
    className: "w-full p-3.5 rounded-xl bg-[#F5E9D7]/40 border border-[#683D2E]/20 text-[#683D2E] focus:outline-none focus:border-[#C04E2A]",
    placeholder: "Sua resposta..."
  }), question.type === 'email' && /*#__PURE__*/React.createElement("input", {
    type: "email",
    value: answers[question.id] || '',
    onChange: e => setAnswers({
      ...answers,
      [question.id]: e.target.value
    }),
    className: "w-full p-3.5 rounded-xl bg-[#F5E9D7]/40 border border-[#683D2E]/20 text-[#683D2E] focus:outline-none focus:border-[#C04E2A]",
    placeholder: "seuemail@empresa.com"
  }), question.type === 'phone' && /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: answers[question.id] || '',
    onChange: e => setAnswers({
      ...answers,
      [question.id]: formatPhone(e.target.value)
    }),
    className: "w-full p-3.5 rounded-xl bg-[#F5E9D7]/40 border border-[#683D2E]/20 text-[#683D2E] focus:outline-none focus:border-[#C04E2A]",
    placeholder: "(86) 99999-8888"
  }), question.type === 'select' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, question.options.map((opt, idx) => /*#__PURE__*/React.createElement("button", {
    key: idx,
    type: "button",
    onClick: () => setAnswers({
      ...answers,
      [question.id]: opt
    }),
    className: `w-full p-3.5 rounded-xl text-left font-medium border transition ${answers[question.id] === opt ? 'bg-[#C04E2A] text-white border-[#C04E2A]' : 'bg-[#F5E9D7]/30 border-[#683D2E]/15 text-[#683D2E] hover:bg-[#F5E9D7]/70'}`
  }, opt))), /*#__PURE__*/React.createElement("button", {
    onClick: handleNext,
    className: "w-full py-4 rounded-xl bg-[#C04E2A] hover:bg-[#C04E2A]/90 text-white font-bold flex items-center justify-center space-x-2 transition shadow-md"
  }, /*#__PURE__*/React.createElement("span", null, "CONTINUAR"), /*#__PURE__*/React.createElement(Icons.ArrowRight, null))));
}

// ==========================================
// 03. AGENDAMENTO DE REUNIÃO (COM CALENDÁRIO VISUAL E REGRAS)
// ==========================================
function BookingCalendar({
  settings,
  bookedSlots,
  onSelectSlot,
  leadName
}) {
  const [meetingType, setMeetingType] = useState('online'); // 'presencial' ou 'online'
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1)); // Outubro de 2026 como padrão
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Gerar dias do mês atual para o calendário visual
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  // Horários disponíveis entre 10h e 22h (Duração de 2h)
  const allTimeSlots = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
  const getDayStatus = dayNum => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const dayOfWeek = new Date(year, month, dayNum).getDay(); // 0: Dom, 1: Seg, 2: Ter, 3: Qua, 4: Qui, 5: Sex, 6: Sáb

    // ⚪ Cinza: dia em que não realizamos atendimento (Segunda, Sábado, Domingo)
    if (new Date(year, month, dayNum + 1) <= new Date() || dayOfWeek === 0 || dayOfWeek === 1 || dayOfWeek === 6) {
      return 'gray';
    }

    // Verificar quantas reuniões já existem neste dia
    const dayBookingsCount = bookedSlots.filter(s => s.date === dateStr).length;

    // Limite máximo de 3 reuniões por dia
    if (dayBookingsCount >= 3) {
      return 'orange'; // 🟠 Laranja: dia com atendimento, mas totalmente preenchido
    }
    return 'green'; // 🟢 Verde: pelo menos um horário disponível
  };
  const handleDayClick = dayNum => {
    const status = getDayStatus(dayNum);
    if (status === 'gray' || status === 'orange') return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setSelectedTime(null);
  };
  const getAvailableTimesForDate = dateStr => {
    if (!dateStr) return [];
    const bookedTimesOnDate = bookedSlots.filter(s => s.date === dateStr).map(s => s.time);
    return allTimeSlots.filter(t => !bookedTimesOnDate.includes(t) && new Date(`${dateStr}T${t}:00-03:00`) > new Date());
  };
  const availableTimes = getAvailableTimesForDate(selectedDate);
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto px-4 pt-6 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "clean-card rounded-2xl p-6 sm:p-8 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center space-y-1"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl sm:text-2xl font-extrabold text-[#683D2E]"
  }, "Agende sua Reunião Estratégica"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-[#683D2E]/70 font-medium"
  }, "Duração de 2 horas para entendermos a fundo sua empresa.")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[#683D2E] uppercase"
  }, "Escolha a Modalidade:"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setMeetingType('online'),
    className: `p-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border transition ${meetingType === 'online' ? 'bg-[#C04E2A] text-white border-[#C04E2A]' : 'bg-[#F5E9D7]/40 text-[#683D2E] border-[#683D2E]/20 hover:bg-[#F5E9D7]'}`
  }, /*#__PURE__*/React.createElement(Icons.Monitor, null), /*#__PURE__*/React.createElement("span", null, "Reunião Online")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setMeetingType('presencial'),
    className: `p-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border transition ${meetingType === 'presencial' ? 'bg-[#C04E2A] text-white border-[#C04E2A]' : 'bg-[#F5E9D7]/40 text-[#683D2E] border-[#683D2E]/20 hover:bg-[#F5E9D7]'}`
  }, /*#__PURE__*/React.createElement(Icons.Building, null), /*#__PURE__*/React.createElement("span", null, "Reunião Presencial")))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold text-[#683D2E]/80 bg-[#F5E9D7]/30 p-2.5 rounded-xl border border-[#683D2E]/10"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center space-x-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-3 h-3 rounded-full bg-emerald-500 inline-block"
  }), /*#__PURE__*/React.createElement("span", null, "Disponível")), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center space-x-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-3 h-3 rounded-full bg-amber-500 inline-block"
  }), /*#__PURE__*/React.createElement("span", null, "Lotado (3/3)")), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center space-x-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-3 h-3 rounded-full bg-gray-300 inline-block"
  }), /*#__PURE__*/React.createElement("span", null, "Sem atendimento"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setCurrentMonthDate(new Date(year, month - 1, 1));
      setSelectedDate(null);
      setSelectedTime(null);
    }
  }, "←"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-sm text-[#683D2E]"
  }, monthNames[month], " ", year), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setCurrentMonthDate(new Date(year, month + 1, 1));
      setSelectedDate(null);
      setSelectedTime(null);
    }
  }, "→"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-[#C04E2A] font-bold"
  }, "Atendimento: Terça a Sexta (10h às 22h)")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-7 gap-1 text-center text-xs"
  }, ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "font-bold text-[#683D2E]/60 py-1"
  }, d)), Array.from({
    length: firstDayIndex
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: `empty-${i}`
  })), Array.from({
    length: totalDays
  }).map((_, i) => {
    const dayNum = i + 1;
    const status = getDayStatus(dayNum);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const isSelected = selectedDate === dateStr;
    let bgClass = "bg-gray-200 text-gray-400 cursor-not-allowed";
    if (status === 'green') {
      bgClass = isSelected ? "bg-[#C04E2A] text-white font-bold ring-2 ring-[#C04E2A]" : "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 cursor-pointer font-bold";
    } else if (status === 'orange') {
      bgClass = "bg-amber-100 text-amber-900 cursor-not-allowed opacity-75";
    }
    return /*#__PURE__*/React.createElement("button", {
      key: dayNum,
      type: "button",
      disabled: status === 'gray' || status === 'orange',
      onClick: () => handleDayClick(dayNum),
      className: `h-9 rounded-lg flex items-center justify-center text-xs transition ${bgClass}`
    }, dayNum);
  }))), selectedDate && /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 pt-2 border-t border-[#683D2E]/10 animate-fade-in"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[#683D2E] uppercase"
  }, "Horários disponíveis para ", selectedDate.split('-').reverse().join('/'), ":"), availableTimes.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-amber-700 font-semibold bg-amber-50 p-3 rounded-xl border border-amber-200 text-center"
  }, "Todos os horários deste dia já foram preenchidos (limite de 3 reuniões diárias atingido).") : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, availableTimes.map(time => /*#__PURE__*/React.createElement("button", {
    key: time,
    type: "button",
    onClick: () => setSelectedTime(time),
    className: `py-2.5 rounded-xl border text-xs font-bold transition ${selectedTime === time ? 'bg-[#2E5E3E] border-[#2E5E3E] text-white' : 'bg-[#F5E9D7]/40 border-[#683D2E]/15 text-[#683D2E] hover:bg-[#F5E9D7]'}`
  }, time, " (2h)")))), /*#__PURE__*/React.createElement("button", {
    disabled: !selectedDate || !selectedTime,
    onClick: () => onSelectSlot({
      date: selectedDate,
      time: selectedTime,
      type: meetingType
    }),
    className: `w-full py-4 rounded-xl font-bold transition shadow-md ${selectedDate && selectedTime ? 'bg-[#2E5E3E] hover:bg-[#2E5E3E]/90 text-white cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`
  }, "CONFIRMAR AGENDAMENTO DA REUNIÃO")));
}

// ==========================================
// 04. CONFIRMAÇÃO
// ==========================================
function ConfirmationPage({
  settings,
  lead,
  appointment,
  onRestart
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-xl mx-auto px-4 pt-6 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "clean-card rounded-2xl p-6 sm:p-8 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 rounded-full bg-[#2E5E3E]/15 text-[#2E5E3E] flex items-center justify-center mx-auto border border-[#2E5E3E]/30 shadow-sm"
  }, /*#__PURE__*/React.createElement(Icons.Check, null)), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-extrabold text-[#683D2E]"
  }, "Reunião Agendada!"), lead && /*#__PURE__*/React.createElement("p", {
    className: "text-sm"
  }, lead.name, " • Situação: ", lead.status), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-[#683D2E]/90 font-medium leading-relaxed max-w-md mx-auto"
  }, settings.confirmationMessage)), appointment && /*#__PURE__*/React.createElement("div", {
    className: "bg-[#F5E9D7]/40 p-4 rounded-xl border border-[#683D2E]/15 text-xs space-y-1 text-[#683D2E]"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Data:"), " ", appointment.date.split('-').reverse().join('/')), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Horário:"), " ", appointment.time, " (Duração: 2 horas)"), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Modalidade:"), " Reunião ", appointment.type === 'online' ? 'Online' : 'Presencial')), /*#__PURE__*/React.createElement("a", {
    href: `https://wa.me/${settings.whatsappNumber}`,
    target: "_blank",
    rel: "noreferrer",
    className: "w-full py-4 bg-[#2E5E3E] hover:bg-[#2E5E3E]/90 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md transition"
  }, /*#__PURE__*/React.createElement(Icons.Whatsapp, null), /*#__PURE__*/React.createElement("span", null, "Falar pelo WhatsApp")), /*#__PURE__*/React.createElement("button", {
    onClick: onRestart,
    className: "text-xs text-[#683D2E]/60 underline block mx-auto font-medium"
  }, "Voltar ao Início")));
}

// ==========================================
// 05. PAINEL ADMIN (MÉTRICAS & FUNIL MANTIDOS)
// ==========================================
function AdminDashboard({
  settings,
  setSettings,
  leads,
  setLeads,
  bookedSlots,
  formatPhone,
  metrics,
  saveSettings,
  dirty,
  bookForAdmin
}) {
  const [adminTab, setAdminTab] = useState('crm');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newLeadData, setNewLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: 'Proprietário(a)',
    revenue: 'R$ 300 mil a R$ 1 milhão'
  });
  const handleCreateLead = async e => {
    e.preventDefault();
    const existing = leads.find(l => l.id === editingId);
    const created = {
      ...existing,
      ...newLeadData,
      id: editingId || 'lead-' + (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)),
      status: existing?.status || 'NOVO'
    };
    if (await setLeads([created, ...leads.filter(l => l.id !== created.id)])) {
      setIsModalOpen(false);
      setEditingId(null);
      setNewLeadData({
        name: '',
        email: '',
        phone: '',
        company: '',
        role: 'Proprietário(a)',
        revenue: 'R$ 300 mil a R$ 1 milhão'
      });
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-6xl mx-auto px-4 pt-6 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-[#683D2E]/10 gap-3 shadow-sm"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-bold text-[#683D2E]"
  }, "Painel do Administrador"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setAdminTab('crm'),
    className: `px-3 py-1.5 rounded-lg text-xs font-bold transition ${adminTab === 'crm' ? 'bg-[#C04E2A] text-white' : 'bg-[#F5E9D7] text-[#683D2E]'}`
  }, "CRM Leads"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAdminTab('metrics'),
    className: `px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition ${adminTab === 'metrics' ? 'bg-[#C04E2A] text-white' : 'bg-[#F5E9D7] text-[#683D2E]'}`
  }, /*#__PURE__*/React.createElement(Icons.BarChart, null), /*#__PURE__*/React.createElement("span", null, "Métricas & Funil")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAdminTab('cms'),
    className: `px-3 py-1.5 rounded-lg text-xs font-bold transition ${adminTab === 'cms' ? 'bg-[#C04E2A] text-white' : 'bg-[#F5E9D7] text-[#683D2E]'}`
  }, "Editor CMS (Textos & CEO)"))), adminTab === 'crm' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-bold text-[#683D2E]"
  }, "Gestão de Leads"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setEditingId(null);
      setNewLeadData({
        name: '',
        email: '',
        phone: '',
        company: '',
        role: 'Proprietário(a)',
        revenue: 'R$ 300 mil a R$ 1 milhão'
      });
      setIsModalOpen(true);
    },
    className: "px-3 py-2 bg-[#2E5E3E] text-white font-bold text-xs rounded-xl flex items-center space-x-1 shadow-sm"
  }, /*#__PURE__*/React.createElement(Icons.Plus, null), /*#__PURE__*/React.createElement("span", null, "Novo Lead"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-4"
  }, ['NOVO', 'QUALIFICADO', 'REUNIÃO AGENDADA'].map(statusCat => /*#__PURE__*/React.createElement("div", {
    key: statusCat,
    className: "clean-card p-4 rounded-2xl space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-xs font-bold text-[#683D2E] pb-2 border-b border-[#683D2E]/10"
  }, /*#__PURE__*/React.createElement("span", null, statusCat), /*#__PURE__*/React.createElement("span", {
    className: "text-[#C04E2A]"
  }, leads.filter(l => l.status === statusCat).length)), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 max-h-[400px] overflow-y-auto"
  }, leads.filter(l => l.status === statusCat).map(lead => /*#__PURE__*/React.createElement("div", {
    key: lead.id,
    className: "p-3 bg-[#F5E9D7]/40 border border-[#683D2E]/10 rounded-xl space-y-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-bold text-sm text-[#683D2E]"
  }, lead.name), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-[#C04E2A] font-medium"
  }, lead.company, " (", lead.role, ")"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-[#2E5E3E] font-bold"
  }, lead.phone), /*#__PURE__*/React.createElement("p", {
    className: "text-xs"
  }, lead.email), /*#__PURE__*/React.createElement("details", {
    className: "text-xs"
  }, /*#__PURE__*/React.createElement("summary", null, "Respostas do formulário"), Object.entries(lead.answers || {}).map(([k, v]) => /*#__PURE__*/React.createElement("p", {
    key: k
  }, DEFAULT_QUESTIONS.find(q => q.id === k)?.label || k, ": ", v))), /*#__PURE__*/React.createElement("select", {
    "aria-label": "Situação do cliente",
    value: lead.status,
    onChange: e => setLeads(leads.map(l => l.id === lead.id ? {
      ...l,
      status: e.target.value
    } : l)),
    className: "w-full text-xs p-2"
  }, ['NOVO', 'QUALIFICADO', 'REUNIÃO AGENDADA'].map(s => /*#__PURE__*/React.createElement("option", {
    key: s
  }, s))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "text-xs underline",
    onClick: () => {
      setEditingId(lead.id);
      setNewLeadData(lead);
      setIsModalOpen(true);
    }
  }, "Editar cadastro"), /*#__PURE__*/React.createElement("details", {
    className: "text-xs"
  }, /*#__PURE__*/React.createElement("summary", null, "Agendar / remarcar"), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      const f = new FormData(e.currentTarget);
      bookForAdmin(lead.id, {
        date: f.get('date'),
        time: f.get('time'),
        type: f.get('type')
      });
    },
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("input", {
    required: true,
    type: "date",
    name: "date",
    defaultValue: lead.appointment?.date
  }), /*#__PURE__*/React.createElement("select", {
    name: "time",
    defaultValue: lead.appointment?.time
  }, ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map(t => /*#__PURE__*/React.createElement("option", {
    key: t
  }, t))), /*#__PURE__*/React.createElement("select", {
    name: "type",
    defaultValue: lead.appointment?.type
  }, /*#__PURE__*/React.createElement("option", {
    value: "online"
  }, "Online"), /*#__PURE__*/React.createElement("option", {
    value: "presencial"
  }, "Presencial")), /*#__PURE__*/React.createElement("button", {
    className: "p-2 bg-white rounded",
    type: "submit"
  }, "Salvar agendamento"))), lead.appointment && /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-[#683D2E]/70 pt-1 border-t border-[#683D2E]/10"
  }, "Reunião: ", lead.appointment.date, " às ", lead.appointment.time)))))))), adminTab === 'metrics' && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "clean-card p-4 rounded-xl space-y-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-[#683D2E]/70 font-semibold"
  }, "Total Visitantes"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-extrabold text-[#683D2E]"
  }, metrics.visit || 0), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-[#2E5E3E] font-bold"
  }, "Visitantes por sessão")), /*#__PURE__*/React.createElement("div", {
    className: "clean-card p-4 rounded-xl space-y-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-[#683D2E]/70 font-semibold"
  }, "Aplicações"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-extrabold text-[#C04E2A]"
  }, metrics.completed || 0), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-[#C04E2A]"
  }, "Formulários enviados")), /*#__PURE__*/React.createElement("div", {
    className: "clean-card p-4 rounded-xl space-y-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-[#683D2E]/70 font-semibold"
  }, "Leads Qualificados"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-extrabold text-[#E1B12C]"
  }, leads.filter(l => l.status === 'QUALIFICADO').length), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-[#683D2E]"
  }, "Alta Prioridade")), /*#__PURE__*/React.createElement("div", {
    className: "clean-card p-4 rounded-xl space-y-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-[#683D2E]/70 font-semibold"
  }, "Reuniões Agendadas"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-extrabold text-[#2E5E3E]"
  }, bookedSlots.length), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-[#2E5E3E] font-bold"
  }, "Agenda Ativa"))), /*#__PURE__*/React.createElement("div", {
    className: "clean-card p-6 rounded-2xl space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-bold text-[#683D2E]"
  }, "Funil de Conversão do Link da Bio"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, [{
    step: '1. Visitantes',
    val: metrics.visit || 0,
    pct: '100%',
    color: 'bg-[#C04E2A]'
  }, {
    step: '2. Clicaram para assistir ao vídeo',
    val: metrics.video || 0,
    pct: `${Math.round((metrics.video || 0) / Math.max(1, metrics.visit || 0) * 100)}%`,
    color: 'bg-[#E1B12C]'
  }, {
    step: '3. Iniciaram a Aplicação',
    val: metrics.application || 0,
    pct: `${Math.round((metrics.application || 0) / Math.max(1, metrics.visit || 0) * 100)}%`,
    color: 'bg-[#C04E2A]'
  }, {
    step: '4. Concluíram a Qualificação',
    val: metrics.completed || 0,
    pct: `${Math.round((metrics.completed || 0) / Math.max(1, metrics.visit || 0) * 100)}%`,
    color: 'bg-[#E1B12C]'
  }, {
    step: '5. Agendaram Reunião Comercial',
    val: bookedSlots.length,
    pct: `${Math.round(bookedSlots.length / Math.max(1, metrics.visit || 0) * 100)}%`,
    color: 'bg-[#2E5E3E]'
  }].map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-xs font-semibold text-[#683D2E]"
  }, /*#__PURE__*/React.createElement("span", null, f.step), /*#__PURE__*/React.createElement("span", null, f.val, " (", f.pct, ")")), /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-[#F5E9D7] rounded-full h-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: `${f.color} h-2.5 rounded-full`,
    style: {
      width: `${Math.min(100, parseFloat(f.pct))}%`
    }
  }))))))), adminTab === 'cms' && /*#__PURE__*/React.createElement("div", {
    className: "clean-card p-6 rounded-2xl space-y-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold text-[#683D2E] border-b border-[#683D2E]/10 pb-3"
  }, "Configurações de Textos & CEO"), /*#__PURE__*/React.createElement("div", {
    className: "grid gap-3 sm:grid-cols-2"
  }, [['agencyName', 'Nome da agência'], ['tagline', 'Slogan'], ['description', 'Descrição'], ['buttonText', 'Texto do botão'], ['microcopy', 'Texto de apoio'], ['confirmationMessage', 'Mensagem de confirmação'], ['whatsappNumber', 'WhatsApp (país + DDD + número)'], ['videoThumbnail', 'URL da capa do vídeo']].map(([key, label]) => /*#__PURE__*/React.createElement("label", {
    key: key,
    className: "text-xs font-bold"
  }, label, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: settings[key] || '',
    onChange: e => setSettings({
      ...settings,
      [key]: e.target.value
    }),
    className: "block w-full border rounded-xl p-2 mt-1 font-normal"
  })))), /*#__PURE__*/React.createElement("p", {
    className: "text-sm"
  }, dirty ? 'Alterações ainda não publicadas.' : 'Conteúdo publicado para todos os clientes.'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: !dirty,
    onClick: saveSettings,
    className: "p-3 bg-[#2E5E3E] text-white rounded-xl disabled:opacity-50"
  }, "Salvar e publicar alterações"), /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-[#F5E9D7]/30 rounded-xl border border-[#683D2E]/10 space-y-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[#C04E2A] uppercase"
  }, "Frases do Vídeo"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-[#683D2E]/70 mb-1"
  }, "Frase Acima do Vídeo:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: settings.headline,
    onChange: e => setSettings({
      ...settings,
      headline: e.target.value
    }),
    className: "w-full bg-white border border-[#683D2E]/20 rounded-xl p-2.5 text-xs text-[#683D2E]"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-[#683D2E]/70 mb-1"
  }, "Frase Abaixo do Vídeo:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: settings.subheadline,
    onChange: e => setSettings({
      ...settings,
      subheadline: e.target.value
    }),
    className: "w-full bg-white border border-[#683D2E]/20 rounded-xl p-2.5 text-xs text-[#683D2E]"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-[#F5E9D7]/30 rounded-xl border border-[#683D2E]/10 space-y-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[#C04E2A] uppercase flex items-center space-x-1"
  }, /*#__PURE__*/React.createElement(Icons.Video, null), /*#__PURE__*/React.createElement("span", null, "Vídeo Principal")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs"
  }, "Cole um link do YouTube ou Vimeo e clique em Salvar e publicar. Deixe o campo vazio para ocultar o vídeo.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-[#683D2E]/70 mb-1"
  }, "URL (YouTube / Vimeo):"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: settings.videoUrl,
    onChange: e => setSettings({
      ...settings,
      videoUrl: e.target.value,
      videoType: 'embed'
    }),
    className: "w-full bg-white border border-[#683D2E]/20 rounded-xl p-2 text-xs text-[#683D2E]"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-[#F5E9D7]/30 rounded-xl border border-[#683D2E]/10 space-y-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-[#C04E2A] uppercase"
  }, "Bloco CEO"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-[#683D2E]/70 mb-1"
  }, "Nome:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: settings.ceoName,
    onChange: e => setSettings({
      ...settings,
      ceoName: e.target.value
    }),
    className: "w-full bg-white border border-[#683D2E]/20 rounded-xl p-2 text-xs text-[#683D2E]"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-[#683D2E]/70 mb-1"
  }, "Cargo:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: settings.ceoRole,
    onChange: e => setSettings({
      ...settings,
      ceoRole: e.target.value
    }),
    className: "w-full bg-white border border-[#683D2E]/20 rounded-xl p-2 text-xs text-[#683D2E]"
  })), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-[#683D2E]/70 mb-1"
  }, "Foto:"), /*#__PURE__*/React.createElement("input", {
    type: "url",
    placeholder: "https://...",
    value: settings.ceoPhoto,
    onChange: e => setSettings({
      ...settings,
      ceoPhoto: e.target.value
    }),
    className: "w-full border rounded-xl p-2 text-xs"
  })), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-[#683D2E]/70 mb-1"
  }, "Fala / Mensagem do CEO:"), /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    value: settings.ceoMessage,
    onChange: e => setSettings({
      ...settings,
      ceoMessage: e.target.value
    }),
    className: "w-full bg-white border border-[#683D2E]/20 rounded-xl p-2 text-xs text-[#683D2E]"
  }))))), isModalOpen && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleCreateLead,
    className: "bg-white border border-[#683D2E]/20 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center border-b border-[#683D2E]/10 pb-2"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-bold text-[#683D2E] flex items-center space-x-1"
  }, /*#__PURE__*/React.createElement(Icons.Plus, null), /*#__PURE__*/React.createElement("span", null, editingId ? "Editar cliente" : "Adicionar Novo Lead")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setIsModalOpen(false),
    className: "text-[#683D2E]/60 font-bold"
  }, "✕")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[#683D2E]/70 mb-1"
  }, "Nome Completo:"), /*#__PURE__*/React.createElement("input", {
    required: true,
    type: "text",
    value: newLeadData.name,
    onChange: e => setNewLeadData({
      ...newLeadData,
      name: e.target.value
    }),
    className: "w-full p-2.5 rounded-lg bg-[#F5E9D7]/30 border border-[#683D2E]/20 text-[#683D2E]"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[#683D2E]/70 mb-1"
  }, "E-mail:"), /*#__PURE__*/React.createElement("input", {
    required: true,
    type: "email",
    value: newLeadData.email,
    onChange: e => setNewLeadData({
      ...newLeadData,
      email: e.target.value
    }),
    className: "w-full p-2.5 rounded-lg bg-[#F5E9D7]/30 border border-[#683D2E]/20 text-[#683D2E]"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[#683D2E]/70 mb-1"
  }, "WhatsApp:"), /*#__PURE__*/React.createElement("input", {
    required: true,
    type: "text",
    value: newLeadData.phone,
    onChange: e => setNewLeadData({
      ...newLeadData,
      phone: formatPhone(e.target.value)
    }),
    className: "w-full p-2.5 rounded-lg bg-[#F5E9D7]/30 border border-[#683D2E]/20 text-[#683D2E]"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[#683D2E]/70 mb-1"
  }, "Empresa:"), /*#__PURE__*/React.createElement("input", {
    required: true,
    type: "text",
    value: newLeadData.company,
    onChange: e => setNewLeadData({
      ...newLeadData,
      company: e.target.value
    }),
    className: "w-full p-2.5 rounded-lg bg-[#F5E9D7]/30 border border-[#683D2E]/20 text-[#683D2E]"
  }))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full py-3 bg-[#2E5E3E] text-white font-bold rounded-xl shadow-md"
  }, "Salvar Lead"))));
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(App, null));