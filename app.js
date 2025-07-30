// Egypt Crisis Command Dashboard - Fixed Navigation & Complete 8-Module Implementation
// React 18 UMD with localStorage persistence and full CRUD operations

const { useState, useEffect, useReducer, createContext, useContext, useRef } = React;

/*****************************************************************************************
 UTILITIES
*****************************************************************************************/
const genId = () => Math.random().toString(36).slice(2, 10);
const formatDate = (date) => new Date(date).toLocaleDateString();
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('localStorage not available');
  }
};
const loadFromStorage = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

/*****************************************************************************************
 INITIAL DATA
*****************************************************************************************/
const initialData = {
  delegates: [
    {id:1,portfolio:"Vice President",country:"U.S.A",strengths:"Executive experience, foreign policy background",weaknesses:"Limited military knowledge",usefulness:7},
    {id:2,portfolio:"Secretary of State",country:"U.S.A",vacant:true,strengths:"N/A",weaknesses:"Position vacant",usefulness:0},
    {id:3,portfolio:"Secretary of Defence",country:"U.S.A",strengths:"Military strategy, defense planning",weaknesses:"Hawkish tendencies",usefulness:8},
    {id:4,portfolio:"Chairman of the Joint Chiefs of Staff",country:"U.S.A",strengths:"Military coordination, tactical expertise",weaknesses:"Inter-service rivalries",usefulness:9},
    {id:5,portfolio:"Director of Central Intelligence",country:"U.S.A",strengths:"Intelligence networks, covert operations",weaknesses:"Political agenda",usefulness:6},
    {id:6,portfolio:"National Security Advisor",country:"U.S.A",strengths:"Policy coordination, presidential access",weaknesses:"Academic background",usefulness:7},
    {id:7,portfolio:"Chief of Staff of the US Air Force",country:"U.S.A",strengths:"Air power doctrine, strategic bombing",weaknesses:"Service bias",usefulness:5},
    {id:8,portfolio:"Chief of Staff of the US Army",country:"U.S.A",strengths:"Ground operations, logistics",weaknesses:"Limited air-naval integration",usefulness:6},
    {id:9,portfolio:"Chief of Naval Operations",country:"U.S.A",strengths:"Naval strategy, Mediterranean presence",weaknesses:"Limited ground knowledge",usefulness:4},
    {id:10,portfolio:"Director of National Security Agency",country:"U.S.A",strengths:"Signals intelligence, communications",weaknesses:"Bureaucratic",usefulness:5},
    {id:11,portfolio:"Deputy Prime Minister",country:"Israel",strengths:"Coalition building, diplomatic experience",weaknesses:"Internal politics",usefulness:6},
    {id:12,portfolio:"Minister of Foreign Affairs",country:"Israel",strengths:"Regional expertise, negotiation skills",weaknesses:"Rigid positions",usefulness:7},
    {id:13,portfolio:"Minister of Defence",country:"Israel",strengths:"Military planning, security doctrine",weaknesses:"Aggressive stance",usefulness:8},
    {id:14,portfolio:"Chief of the General Staff",country:"Israel",strengths:"Operational planning, tactical excellence",weaknesses:"Limited strategic vision",usefulness:9},
    {id:15,portfolio:"Director of Mossad",country:"Israel",strengths:"Intelligence operations, regional networks",weaknesses:"Provocative methods",usefulness:5},
    {id:16,portfolio:"Director of Shin Bet",country:"Israel",strengths:"Internal security, counterintelligence",weaknesses:"Domestic focus",usefulness:3},
    {id:17,portfolio:"Minister of Finance",country:"Israel",strengths:"Economic planning, resource allocation",weaknesses:"Limited military understanding",usefulness:4},
    {id:18,portfolio:"Commander of Israel Air Force",country:"Israel",strengths:"Air superiority, precision strikes",weaknesses:"Limited ground support",usefulness:6},
    {id:19,portfolio:"Commander of Israel Southern Command",country:"Israel",strengths:"Border security, regional operations",weaknesses:"Defensive mindset",usefulness:7},
    {id:20,portfolio:"Director of Israel Military Intelligence",country:"Israel",strengths:"Strategic intelligence, threat assessment",weaknesses:"Information hoarding",usefulness:8},
    {id:21,portfolio:"Vice President",country:"Egypt",strengths:"Administrative experience, party loyalty",weaknesses:"Limited foreign policy role",usefulness:6},
    {id:22,portfolio:"Minister of Foreign Affairs",country:"Egypt",strengths:"Diplomatic networks, negotiation experience",weaknesses:"Bureaucratic constraints",usefulness:8},
    {id:23,portfolio:"Minister of Defence",country:"Egypt",strengths:"Military-civilian coordination, resource management",weaknesses:"Political appointee",usefulness:7},
    {id:24,portfolio:"Chief of the General Staff",country:"Egypt",strengths:"Strategic planning, operational command",weaknesses:"Resource limitations",usefulness:10},
    {id:25,portfolio:"Director of Egyptian General Intelligence",country:"Egypt",strengths:"Regional intelligence, covert operations",weaknesses:"Limited technical capabilities",usefulness:8},
    {id:26,portfolio:"Minister of Finance",country:"Egypt",strengths:"Economic planning, international aid coordination",weaknesses:"Fiscal constraints",usefulness:5},
    {id:27,portfolio:"Commander of Egyptian Air Force",country:"Egypt",strengths:"Air operations, pilot training",weaknesses:"Equipment limitations",usefulness:7},
    {id:28,portfolio:"Commander of Second Field Army",country:"Egypt",strengths:"Eastern front operations, Sinai experience",weaknesses:"Defensive positioning",usefulness:8},
    {id:29,portfolio:"Commander of Third Field Army",country:"Egypt",strengths:"Suez operations, amphibious capabilities",weaknesses:"Limited armor",usefulness:7},
    {id:30,portfolio:"First Deputy Chairman of the Council of Ministers",country:"Soviet Union",strengths:"Administrative authority, resource access",weaknesses:"Ideological constraints",usefulness:4},
    {id:31,portfolio:"Minister of Foreign Affairs",country:"Soviet Union",strengths:"Global diplomatic network, superpower backing",weaknesses:"Cold War priorities",usefulness:6},
    {id:32,portfolio:"Minister of Defence",country:"Soviet Union",strengths:"Military-industrial complex, advanced weapons",weaknesses:"Distant from region",usefulness:5},
    {id:33,portfolio:"Chief of the General Staff",country:"Soviet Union",strengths:"Strategic doctrine, nuclear capabilities",weaknesses:"Limited regional knowledge",usefulness:4},
    {id:34,portfolio:"Director of the KGB",country:"Soviet Union",strengths:"Intelligence networks, covert operations",weaknesses:"Ideological agenda",usefulness:3},
    {id:35,portfolio:"Director of the GRU",country:"Soviet Union",strengths:"Military intelligence, technical expertise",weaknesses:"Compartmentalized information",usefulness:4},
    {id:36,portfolio:"Commander of the Soviet Air Force",country:"Soviet Union",strengths:"Air defense systems, advanced aircraft",weaknesses:"Limited regional deployment",usefulness:3},
    {id:37,portfolio:"Minister of Finance",country:"Soviet Union",strengths:"Economic planning, resource allocation",weaknesses:"Central planning constraints",usefulness:2},
    {id:38,portfolio:"Minister of Heavy Industry",country:"Soviet Union",strengths:"Military production, technological development",weaknesses:"Quality control issues",usefulness:3},
    {id:39,portfolio:"Commander in Chief of the Soviet Navy",country:"Soviet Union",strengths:"Naval power projection, Mediterranean fleet",weaknesses:"Limited port access",usefulness:5}
  ],
  timeline: [
    {id:genId(),date:"1978-09-17",title:"Camp David Accords Signed",description:"Egyptian President Anwar Sadat and Israeli Prime Minister Menachem Begin sign historic peace frameworks",impact:"High",category:"Diplomatic"},
    {id:genId(),date:"1978-10-01",title:"Historical Freeze Date",description:"Committee timeline freezes - all subsequent events are alternate timeline",impact:"Critical",category:"Administrative"},
    {id:genId(),date:"1978-10-02",title:"Giza Plateau Bombing",description:"Bomb detonates near the Great Sphinx at 7:50 AM EET, causing minor structural damage",impact:"High",category:"Security"},
    {id:genId(),date:"1978-10-08",title:"Joint Investigation Proposal",description:"Israel proposes joint investigation into Giza bombing through diplomatic channels",impact:"Medium",category:"Diplomatic"},
    {id:genId(),date:"1978-10-18",title:"Egyptian Limited Airstrike",description:"Egyptian forces conduct limited airstrike on unmanned Israeli logistics sites in Sinai",impact:"Critical",category:"Military"},
    {id:genId(),date:"1978-10-25",title:"Soviet Communications Leaked",description:"Confidential Egypt-USSR communications regarding Suez Canal access revealed",impact:"Critical",category:"Intelligence"}
  ],
  resources: {
    military: [
      {id:genId(),asset:"Active Personnel",quantity:680000,source:"Military-Intelligence-Briefing"},
      {id:genId(),asset:"M60A1 Main Battle Tanks",quantity:835,source:"Military-Intelligence-Briefing"},
      {id:genId(),asset:"T-62 Main Battle Tanks",quantity:200,source:"Military-Intelligence-Briefing"},
      {id:genId(),asset:"M113A1 Infantry Fighting Vehicles",quantity:1000,source:"Military-Intelligence-Briefing"},
      {id:genId(),asset:"BTR-50 Armored Personnel Carriers",quantity:500,source:"Military-Intelligence-Briefing"},
      {id:genId(),asset:"122mm D-30 Field Howitzers",quantity:108,source:"Military-Intelligence-Briefing"},
      {id:genId(),asset:"SA-6 Gainful SAM Launchers",quantity:36,source:"Military-Intelligence-Briefing"}
    ],
    economic: [
      {id:genId(),asset:"GDP (US$ Billions)",quantity:80,source:"Comprehensive-Preparation-Briefing"},
      {id:genId(),asset:"Suez Canal Revenue (Billion $)",quantity:2.1,source:"Comprehensive-Preparation-Briefing"},
      {id:genId(),asset:"US Military Aid (Billion $)",quantity:0.75,source:"Comprehensive-Preparation-Briefing"},
      {id:genId(),asset:"Soviet Arms Credit (Billion $)",quantity:0.45,source:"Comprehensive-Preparation-Briefing"}
    ],
    diplomatic: [
      {id:genId(),asset:"Active Embassy Relationships",quantity:28,source:"Comprehensive-Preparation-Briefing"},
      {id:genId(),asset:"UN Security Council Relations",quantity:4,source:"CCC-Background"},
      {id:genId(),asset:"Arab League Status",quantity:0,source:"Comprehensive-Preparation-Briefing"}
    ]
  },
  swot: {
    strengths: "• Strategic geographic position controlling Suez Canal\n• Strong military forces with modern equipment (~680,000 personnel)\n• US support and military aid commitments\n• Experienced leadership in regional conflicts",
    weaknesses: "• Economic challenges and heavy indebtedness\n• Regional diplomatic isolation from Arab League suspension\n• Internal political tensions and domestic dissent\n• Dependence on foreign military spare parts",
    opportunities: "• Peace dividend from Camp David Accords\n• International development aid potential\n• Economic modernization through superpower partnerships\n• Enhanced US-Egypt strategic relationship",
    threats: "• Arab League opposition and economic sanctions\n• Internal militant opposition groups\n• Soviet influence and Cold War tensions\n• Regional security threats from ongoing crisis"
  },
  strategies: [
    {id:genId(),title:"Diplomatic Balance Strategy",content:"Maintain equilibrium between US and Soviet relationships while securing full Israeli withdrawal from Sinai. Leverage Suez Canal control as strategic asset.",status:"active",type:"diplomatic"},
    {id:genId(),title:"Military Readiness Protocol",content:"Enhance defensive capabilities through equipment modernization while avoiding provocative deployments that could escalate tensions.",status:"planning",type:"military"},
    {id:genId(),title:"Economic Leverage Initiative",content:"Utilize Suez Canal revenue and international aid to strengthen domestic stability and reduce dependence on foreign support.",status:"planning",type:"economic"}
  ],
  documents: [
    {id:genId(),name:"Camp David Accords - Full Text.pdf",size:245760,type:"application/pdf",category:"diplomatic",uploadDate:new Date().toISOString()},
    {id:genId(),name:"Military Asset Inventory - Oct 1978.xlsx",size:156890,type:"application/vnd.ms-excel",category:"military",uploadDate:new Date().toISOString()},
    {id:genId(),name:"Strategic Intelligence Brief.docx",size:89432,type:"application/msword",category:"intelligence",uploadDate:new Date().toISOString()},
    {id:genId(),name:"Crisis Timeline Events.pdf",size:134521,type:"application/pdf",category:"administrative",uploadDate:new Date().toISOString()}
  ],
  directives: [
    {id:genId(),title:"Enhance Sinai Border Security",success:true,date:"1978-10-01",impact:"High",notes:"Deployed additional border patrols"},
    {id:genId(),title:"Establish US Military Liaison Office",success:true,date:"1978-10-03",impact:"Medium",notes:"Coordination office established in Cairo"},
    {id:genId(),title:"Intelligence Sharing Protocol",success:false,date:"1978-10-05",impact:"High",notes:"Negotiations stalled over classified materials"},
    {id:genId(),title:"Joint Training Exercise Coordination",success:true,date:"1978-10-10",impact:"Medium",notes:"Schedule agreed with Israeli counterparts"}
  ],
  notes: [
    {id:genId(),title:"Strategic Planning Session Notes",content:"Discussed prioritization of Sinai withdrawal timeline and coordination mechanisms with Israeli forces. Key concerns raised about timeline compression.",timestamp:new Date().toISOString(),wordCount:156},
    {id:genId(),title:"Intelligence Brief Summary",content:"Recent Soviet naval movements in Mediterranean suggest increased interest in regional developments. Recommend enhanced surveillance protocols.",timestamp:new Date().toISOString(),wordCount:89}
  ],
  risks: {
    political: 65,
    military: 45,
    economic: 70,
    diplomatic: 55
  }
};

/*****************************************************************************************
 TOAST CONTEXT
*****************************************************************************************/
const ToastContext = createContext(() => {});
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  
  const addToast = (message, type = 'info') => {
    const id = genId();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return React.createElement(ToastContext.Provider, { value: addToast }, [
    children,
    React.createElement('div', { key: 'toasts', className: 'toast-container' },
      toasts.map(toast =>
        React.createElement('div', {
          key: toast.id,
          className: `toast status--${toast.type}`
        }, toast.message)
      )
    )
  ]);
}
const useToast = () => useContext(ToastContext);

/*****************************************************************************************
 MAIN REDUCER
*****************************************************************************************/
function appReducer(state, action) {
  let newState = { ...state };
  
  switch (action.type) {
    case 'SET_PAGE':
      newState.currentPage = action.page;
      break;
      
    case 'UPDATE_SUMMARY':
      newState.overview = { ...state.overview, summary: action.summary };
      break;
      
    case 'ADD_TIMELINE_EVENT':
      newState.overview = {
        ...state.overview,
        timeline: [...state.overview.timeline, { ...action.event, id: genId() }]
      };
      break;
      
    case 'ADD_RESOURCE':
      newState.resources = {
        ...state.resources,
        [action.category]: [...state.resources[action.category], { ...action.resource, id: genId() }]
      };
      break;
      
    case 'UPDATE_RESOURCE':
      newState.resources = {
        ...state.resources,
        [action.category]: state.resources[action.category].map(r =>
          r.id === action.resource.id ? action.resource : r
        )
      };
      break;
      
    case 'DELETE_RESOURCE':
      newState.resources = {
        ...state.resources,
        [action.category]: state.resources[action.category].filter(r => r.id !== action.id)
      };
      break;
      
    case 'UPDATE_SWOT':
      newState.swot = { ...state.swot, [action.field]: action.value };
      break;
      
    case 'UPDATE_RISK':
      newState.risks = { ...state.risks, [action.riskType]: action.value };
      break;
      
    case 'ADD_STRATEGY':
      newState.strategies = [...state.strategies, { ...action.strategy, id: genId() }];
      break;
      
    case 'UPDATE_STRATEGY':
      newState.strategies = state.strategies.map(s =>
        s.id === action.strategy.id ? action.strategy : s
      );
      break;
      
    case 'DELETE_STRATEGY':
      newState.strategies = state.strategies.filter(s => s.id !== action.id);
      break;
      
    case 'ADD_DOCUMENT':
      newState.documents = [...state.documents, { ...action.document, id: genId() }];
      break;
      
    case 'DELETE_DOCUMENT':
      newState.documents = state.documents.filter(d => d.id !== action.id);
      break;
      
    case 'ADD_NOTE':
      newState.notes = [...state.notes, { ...action.note, id: genId(), timestamp: new Date().toISOString() }];
      break;
      
    case 'UPDATE_NOTE':
      newState.notes = state.notes.map(n =>
        n.id === action.note.id ? action.note : n
      );
      break;
      
    case 'DELETE_NOTE':
      newState.notes = state.notes.filter(n => n.id !== action.id);
      break;
      
    case 'ADD_DIRECTIVE':
      newState.directives = [...state.directives, { ...action.directive, id: genId() }];
      break;
      
    case 'UPDATE_DIRECTIVE':
      newState.directives = state.directives.map(d =>
        d.id === action.directive.id ? action.directive : d
      );
      break;
      
    case 'DELETE_DIRECTIVE':
      newState.directives = state.directives.filter(d => d.id !== action.id);
      break;
      
    case 'TOGGLE_DIRECTIVE_SUCCESS':
      newState.directives = state.directives.map(d =>
        d.id === action.id ? { ...d, success: !d.success } : d
      );
      break;
      
    case 'LOAD_STATE':
      newState = { ...action.state };
      break;
      
    default:
      return state;
  }
  
  // Save to localStorage
  saveToStorage('egyptDashboardState', newState);
  return newState;
}

/*****************************************************************************************
 1. OVERVIEW MODULE
*****************************************************************************************/
function Overview({ state, dispatch }) {
  const toast = useToast();
  const [editSummary, setEditSummary] = useState(false);
  const [summaryText, setSummaryText] = useState(state.overview?.summary || '');
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({ date: '', title: '', description: '', impact: 'Medium', category: 'Administrative' });
  
  const handleSaveSummary = () => {
    dispatch({ type: 'UPDATE_SUMMARY', summary: summaryText });
    setEditSummary(false);
    toast('Strategic summary updated', 'success');
  };
  
  const handleAddEvent = (e) => {
    e.preventDefault();
    dispatch({ type: 'ADD_TIMELINE_EVENT', event: eventForm });
    setEventForm({ date: '', title: '', description: '', impact: 'Medium', category: 'Administrative' });
    setShowEventModal(false);
    toast('Timeline event added', 'success');
  };
  
  const resourceTotals = {
    military: state.resources?.military?.reduce((sum, r) => sum + r.quantity, 0) || 0,
    economic: state.resources?.economic?.reduce((sum, r) => sum + r.quantity, 0) || 0,
    diplomatic: state.resources?.diplomatic?.reduce((sum, r) => sum + r.quantity, 0) || 0
  };
  
  return React.createElement('div', { className: 'page-grid' }, [
    React.createElement('div', { key: 'header', className: 'page-header' }, [
      React.createElement('h1', null, 'Strategic Overview'),
      React.createElement('p', null, 'Command center dashboard for Egypt General Staff operations following Camp David Accords')
    ]),
    
    React.createElement('div', { key: 'summary', className: 'card' }, [
      React.createElement('div', { className: 'card__header' }, [
        React.createElement('h3', null, 'Strategic Summary'),
        editSummary
          ? React.createElement('button', { className: 'btn btn--primary btn--sm', onClick: handleSaveSummary }, 'Save Summary')
          : React.createElement('button', { className: 'btn btn--secondary btn--sm', onClick: () => { setEditSummary(true); setSummaryText(state.overview?.summary || ''); } }, 'Edit Summary')
      ]),
      React.createElement('div', { className: 'card__body' },
        React.createElement('textarea', {
          className: 'form-control',
          rows: 4,
          value: summaryText,
          onChange: (e) => setSummaryText(e.target.value),
          readOnly: !editSummary,
          placeholder: 'Enter strategic summary...'
        })
      )
    ]),
    
    React.createElement('div', { key: 'resources', className: 'card' }, [
      React.createElement('div', { className: 'card__header' },
        React.createElement('h3', null, 'Resource Snapshot')
      ),
      React.createElement('div', { className: 'card__body' },
        React.createElement('div', { className: 'kpi-metrics' }, [
          React.createElement('div', { key: 'military', className: 'kpi-item' }, [
            React.createElement('div', { className: 'kpi-value' }, resourceTotals.military.toLocaleString()),
            React.createElement('div', { className: 'kpi-label' }, 'Military Assets')
          ]),
          React.createElement('div', { key: 'economic', className: 'kpi-item' }, [
            React.createElement('div', { className: 'kpi-value' }, '$' + resourceTotals.economic.toFixed(1) + 'B'),
            React.createElement('div', { className: 'kpi-label' }, 'Economic Resources')
          ]),
          React.createElement('div', { key: 'diplomatic', className: 'kpi-item' }, [
            React.createElement('div', { className: 'kpi-value' }, resourceTotals.diplomatic),
            React.createElement('div', { className: 'kpi-label' }, 'Diplomatic Assets')
          ])
        ])
      )
    ]),
    
    React.createElement('div', { key: 'timeline', className: 'card span-full' }, [
      React.createElement('div', { className: 'card__header' }, [
        React.createElement('h3', null, 'Crisis Timeline'),
        React.createElement('button', { className: 'btn btn--primary btn--sm', onClick: () => setShowEventModal(true) }, 'Add Event')
      ]),
      React.createElement('div', { className: 'card__body' },
        React.createElement('div', { className: 'timeline' },
          (state.overview?.timeline || []).map(event =>
            React.createElement('div', { key: event.id, className: 'timeline-item' }, [
              React.createElement('div', { key: 'date', className: 'timeline-date' }, event.date),
              React.createElement('div', { key: 'title', className: 'timeline-title' }, event.title),
              React.createElement('div', { key: 'desc', className: 'timeline-description' }, event.description || ''),
              React.createElement('div', { key: 'impact', className: `status status--${event.impact === 'High' || event.impact === 'Critical' ? 'error' : 'info'}`, style: { marginTop: '8px' } }, event.impact + ' Impact')
            ])
          )
        )
      )
    ]),
    
    showEventModal && React.createElement('div', { key: 'modal', className: 'modal' },
      React.createElement('div', { className: 'modal-content' }, [
        React.createElement('div', { key: 'header', className: 'modal-header' }, [
          React.createElement('h3', null, 'Add Timeline Event'),
          React.createElement('button', { className: 'btn btn--secondary btn--sm', onClick: () => setShowEventModal(false) }, '×')
        ]),
        React.createElement('form', { key: 'form', onSubmit: handleAddEvent },
          React.createElement('div', { className: 'modal-body' }, [
            React.createElement('div', { key: 'date', className: 'form-group' }, [
              React.createElement('label', { className: 'form-label' }, 'Date'),
              React.createElement('input', {
                type: 'date',
                className: 'form-control',
                value: eventForm.date,
                onChange: (e) => setEventForm({...eventForm, date: e.target.value}),
                required: true
              })
            ]),
            React.createElement('div', { key: 'title', className: 'form-group' }, [
              React.createElement('label', { className: 'form-label' }, 'Title'),
              React.createElement('input', {
                type: 'text',
                className: 'form-control',
                value: eventForm.title,
                onChange: (e) => setEventForm({...eventForm, title: e.target.value}),
                required: true,
                placeholder: 'Event title'
              })
            ]),
            React.createElement('div', { key: 'description', className: 'form-group' }, [
              React.createElement('label', { className: 'form-label' }, 'Description'),
              React.createElement('textarea', {
                className: 'form-control',
                rows: 3,
                value: eventForm.description,
                onChange: (e) => setEventForm({...eventForm, description: e.target.value}),
                placeholder: 'Event description'
              })
            ]),
            React.createElement('div', { key: 'impact', className: 'form-group' }, [
              React.createElement('label', { className: 'form-label' }, 'Impact Level'),
              React.createElement('select', {
                className: 'form-control',
                value: eventForm.impact,
                onChange: (e) => setEventForm({...eventForm, impact: e.target.value})
              }, [
                React.createElement('option', { key: 'low', value: 'Low' }, 'Low'),
                React.createElement('option', { key: 'medium', value: 'Medium' }, 'Medium'),
                React.createElement('option', { key: 'high', value: 'High' }, 'High'),
                React.createElement('option', { key: 'critical', value: 'Critical' }, 'Critical')
              ])
            ])
          ]),
          React.createElement('div', { key: 'footer', className: 'modal-footer' },
            React.createElement('button', { type: 'submit', className: 'btn btn--primary' }, 'Add Event')
          )
        )
      ])
    )
  ]);
}

/*****************************************************************************************
 2. RESOURCES MANAGEMENT MODULE
*****************************************************************************************/
function Resources({ state, dispatch }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('military');
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceForm, setResourceForm] = useState({ asset: '', quantity: 0, source: '' });
  const chartRef = useRef();
  const chartInstance = useRef();
  
  const handleAddResource = () => {
    setEditingResource(null);
    setResourceForm({ asset: '', quantity: 0, source: '' });
    setShowModal(true);
  };
  
  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setResourceForm(resource);
    setShowModal(true);
  };
  
  const handleSaveResource = (e) => {
    e.preventDefault();
    if (editingResource) {
      dispatch({ type: 'UPDATE_RESOURCE', category: activeTab, resource: resourceForm });
      toast('Resource updated', 'success');
    } else {
      dispatch({ type: 'ADD_RESOURCE', category: activeTab, resource: resourceForm });
      toast('Resource added', 'success');
    }
    setShowModal(false);
  };
  
  const handleDeleteResource = (id) => {
    dispatch({ type: 'DELETE_RESOURCE', category: activeTab, id });
    toast('Resource deleted', 'warning');
  };
  
  // Chart update
  useEffect(() => {
    if (!chartRef.current || !state.resources?.[activeTab]) return;
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const resources = state.resources[activeTab];
    const labels = resources.map(r => r.asset);
    const data = resources.map(r => r.quantity);
    const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];
    
    chartInstance.current = new Chart(chartRef.current.getContext('2d'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderColor: colors.map(c => c + '80'),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [state.resources, activeTab]);
  
  const currentResources = state.resources?.[activeTab] || [];
  
  return React.createElement('div', { className: 'page-grid' }, [
    React.createElement('div', { key: 'header', className: 'page-header' }, [
      React.createElement('h1', null, 'Resources Management'),
      React.createElement('p', null, 'Military, Economic, and Diplomatic asset management')
    ]),
    
    React.createElement('div', { key: 'tabs', className: 'card span-full' }, [
      React.createElement('div', { className: 'card__header' }, [
        React.createElement('div', { className: 'flex gap-8' }, [
          React.createElement('button', {
            className: `btn ${activeTab === 'military' ? 'btn--primary' : 'btn--secondary'} btn--sm`,
            onClick: () => setActiveTab('military')
          }, '⚔️ Military'),
          React.createElement('button', {
            className: `btn ${activeTab === 'economic' ? 'btn--primary' : 'btn--secondary'} btn--sm`,
            onClick: () => setActiveTab('economic')
          }, '💰 Economic'),
          React.createElement('button', {
            className: `btn ${activeTab === 'diplomatic' ? 'btn--primary' : 'btn--secondary'} btn--sm`,
            onClick: () => setActiveTab('diplomatic')
          }, '🤝 Diplomatic')
        ]),
        React.createElement('button', { className: 'btn btn--primary btn--sm', onClick: handleAddResource }, 'Add Asset')
      ]),
      React.createElement('div', { className: 'card__body' },
        React.createElement('table', { className: 'table' }, [
          React.createElement('thead', { key: 'head' },
            React.createElement('tr', null, [
              React.createElement('th', { key: 'asset' }, 'Asset'),
              React.createElement('th', { key: 'quantity' }, 'Quantity'),
              React.createElement('th', { key: 'source' }, 'Source'),
              React.createElement('th', { key: 'actions' }, 'Actions')
            ])
          ),
          React.createElement('tbody', { key: 'body' },
            currentResources.map(resource =>
              React.createElement('tr', { key: resource.id }, [
                React.createElement('td', { key: 'asset' }, resource.asset),
                React.createElement('td', { key: 'quantity' }, resource.quantity.toLocaleString()),
                React.createElement('td', { key: 'source' }, resource.source),
                React.createElement('td', { key: 'actions' }, [
                  React.createElement('button', {
                    key: 'edit',
                    className: 'btn btn--outline btn--sm',
                    onClick: () => handleEditResource(resource)
                  }, 'Edit'),
                  React.createElement('button', {
                    key: 'delete',
                    className: 'btn btn--danger btn--sm',
                    style: { marginLeft: '8px' },
                    onClick: () => handleDeleteResource(resource.id)
                  }, 'Delete')
                ])
              ])
            )
          )
        ])
      )
    ]),
    
    React.createElement('div', { key: 'chart', className: 'card' }, [
      React.createElement('div', { className: 'card__header' },
        React.createElement('h3', null, `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Assets Distribution`)
      ),
      React.createElement('div', { className: 'card__body' },
        React.createElement('div', { className: 'chart-container' },
          React.createElement('canvas', { ref: chartRef })
        )
      )
    ]),
    
    showModal && React.createElement('div', { key: 'modal', className: 'modal' },
      React.createElement('div', { className: 'modal-content' }, [
        React.createElement('div', { key: 'header', className: 'modal-header' }, [
          React.createElement('h3', null, editingResource ? 'Edit Asset' : 'Add New Asset'),
          React.createElement('button', { className: 'btn btn--secondary btn--sm', onClick: () => setShowModal(false) }, '×')
        ]),
        React.createElement('form', { key: 'form', onSubmit: handleSaveResource },
          React.createElement('div', { className: 'modal-body' }, [
            React.createElement('div', { key: 'asset', className: 'form-group' }, [
              React.createElement('label', { className: 'form-label' }, 'Asset Name'),
              React.createElement('input', {
                type: 'text',
                className: 'form-control',
                value: resourceForm.asset,
                onChange: (e) => setResourceForm({...resourceForm, asset: e.target.value}),
                required: true,
                placeholder: 'Enter asset name'
              })
            ]),
            React.createElement('div', { key: 'quantity', className: 'form-group' }, [
              React.createElement('label', { className: 'form-label' }, 'Quantity'),
              React.createElement('input', {
                type: 'number',
                className: 'form-control',
                value: resourceForm.quantity,
                onChange: (e) => setResourceForm({...resourceForm, quantity: Number(e.target.value)}),
                required: true,
                min: 0
              })
            ]),
            React.createElement('div', { key: 'source', className: 'form-group' }, [
              React.createElement('label', { className: 'form-label' }, 'Source'),
              React.createElement('input', {
                type: 'text',
                className: 'form-control',
                value: resourceForm.source,
                onChange: (e) => setResourceForm({...resourceForm, source: e.target.value}),
                placeholder: 'Enter source reference'
              })
            ])
          ]),
          React.createElement('div', { key: 'footer', className: 'modal-footer' },
            React.createElement('button', { type: 'submit', className: 'btn btn--primary' }, 
              editingResource ? 'Update Asset' : 'Add Asset'
            )
          )
        )
      ])
    )
  ]);
}

/*****************************************************************************************
 3. POSITION & RISK MODULE
*****************************************************************************************/
function PositionRisk({ state, dispatch }) {
  const toast = useToast();
  const [editingSwot, setEditingSwot] = useState(null);
  const [swotForm, setSwotForm] = useState('');
  
  const handleEditSwot = (field) => {
    setEditingSwot(field);
    setSwotForm(state.swot?.[field] || '');
  };
  
  const handleSaveSwot = () => {
    dispatch({ type: 'UPDATE_SWOT', field: editingSwot, value: swotForm });
    setEditingSwot(null);
    toast('SWOT analysis updated', 'success');
  };
  
  const handleRiskChange = (riskType, value) => {
    dispatch({ type: 'UPDATE_RISK', riskType, value: Number(value) });
  };
  
  const getRiskColor = (value) => {
    if (value <= 30) return '#10b981';
    if (value <= 60) return '#f59e0b';
    return '#ef4444';
  };
  
  const swotFields = [
    { key: 'strengths', title: 'Strengths', icon: '💪' },
    { key: 'weaknesses', title: 'Weaknesses', icon: '⚠️' },
    { key: 'opportunities', title: 'Opportunities', icon: '🎯' },
    { key: 'threats', title: 'Threats', icon: '🚨' }
  ];
  
  return React.createElement('div', { className: 'page-grid' }, [
    React.createElement('div', { key: 'header', className: 'page-header' }, [
      React.createElement('h1', null, 'Position & Risk Analysis'),
      React.createElement('p', null, 'Strategic position assessment and risk evaluation')
    ]),
    
    React.createElement('div', { key: 'swot', className: 'card span-full' }, [
      React.createElement('div', { className: 'card__header' },
        React.createElement('h3', null, 'SWOT Analysis')
      ),
      React.createElement('div', { className: 'card__body' },
        React.createElement('div', { className: 'swot-container' },
          swotFields.map(field =>
            React.createElement('div', { key: field.key, className: 'swot-quadrant' }, [
              React.createElement('h4', { key: 'title' }, `${field.icon} ${field.title}`),
              editingSwot === field.key
                ? React.createElement('div', { key: 'editing' }, [
                    React.createElement('textarea', {
                      className: 'form-control',
                      rows: 6,
                      value: swotForm,
                      onChange: (e) => setSwotForm(e.target.value),
                      placeholder: `Enter ${field.title.toLowerCase()}...`
                    }),
                    React.createElement('div', { className: 'flex gap-8', style: { marginTop: '8px' } }, [
                      React.createElement('button', { className: 'btn btn--primary btn--sm', onClick: handleSaveSwot }, 'Save'),
                      React.createElement('button', { className: 'btn btn--secondary btn--sm', onClick: () => setEditingSwot(null) }, 'Cancel')
                    ])
                  ])
                : React.createElement('div', { key: 'viewing' }, [
                    React.createElement('div', { style: { whiteSpace: 'pre-line', marginBottom: '12px' } }, state.swot?.[field.key] || 'No data entered'),
                    React.createElement('button', { className: 'btn btn--outline btn--sm', onClick: () => handleEditSwot(field.key) }, 'Edit')
                  ])
            ])
          )
        )
      )
    ]),
    
    React.createElement('div', { key: 'risks', className: 'card' }, [
      React.createElement('div', { className: 'card__header' },
        React.createElement('h3', null, 'Risk Assessment')
      ),
      React.createElement('div', { className: 'card__body' },
        React.createElement('div', { className: 'risk-container' },
          Object.entries(state.risks || {}).map(([riskType, value]) =>
            React.createElement('div', { key: riskType, className: 'risk-item' }, [
              React.createElement('div', { key: 'label', className: 'risk-label' }, riskType.charAt(0).toUpperCase() + riskType.slice(1)),
              React.createElement('input', {
                key: 'slider',
                type: 'range',
                min: 0,
                max: 100,
                value: value,
                onChange: (e) => handleRiskChange(riskType, e.target.value),
                className: 'risk-slider'
              }),
              React.createElement('div', {
                key: 'value',
                className: 'risk-value',
                style: { color: getRiskColor(value) }
              }, value + '%')
            ])
          )
        )
      )
    ])
  ]);
}

/*****************************************************************************************
 4. DELEGATES MODULE
*****************************************************************************************/
function Delegates({ state, dispatch }) {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [expandedDelegate, setExpandedDelegate] = useState(null);
  
  const countries = ['All', 'U.S.A', 'Israel', 'Egypt', 'Soviet Union'];
  
  const filteredDelegates = (initialData.delegates || []).filter(delegate => {
    const matchesSearch = delegate.portfolio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delegate.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = countryFilter === 'All' || delegate.country === countryFilter;
    return matchesSearch && matchesCountry;
  });
  
  const toggleExpand = (delegateId) => {
    setExpandedDelegate(expandedDelegate === delegateId ? null : delegateId);
  };
  
  return React.createElement('div', { className: 'page-grid' }, [
    React.createElement('div', { key: 'header', className: 'page-header' }, [
      React.createElement('h1', null, 'Delegates Directory'),
      React.createElement('p', null, 'Complete roster of crisis committee participants with analysis')
    ]),
    
    React.createElement('div', { key: 'filters', className: 'card span-full' }, [
      React.createElement('div', { className: 'card__body' },
        React.createElement('div', { className: 'search-filter-bar' }, [
          React.createElement('input', {
            type: 'text',
            className: 'form-control search-input',
            placeholder: 'Search delegates...',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value)
          }),
          React.createElement('select', {
            className: 'form-control filter-select',
            value: countryFilter,
            onChange: (e) => setCountryFilter(e.target.value)
          }, countries.map(country =>
            React.createElement('option', { key: country, value: country }, country)
          )),
          React.createElement('div', { className: 'flex-1' }),
          React.createElement('span', { className: 'text-center' }, `${filteredDelegates.length} delegates`)
        ])
      )
    ]),
    
    React.createElement('div', { key: 'delegates', className: 'span-full' },
      React.createElement('div', { className: 'delegate-grid' },
        filteredDelegates.map(delegate =>
          React.createElement('div', { key: delegate.id, className: 'delegate-card' }, [
            React.createElement('div', { key: 'header', className: 'delegate-header' }, [
              React.createElement('div', { key: 'portfolio', className: 'delegate-portfolio' }, delegate.portfolio),
              React.createElement('div', { key: 'country', className: 'delegate-country' }, delegate.country)
            ]),
            delegate.vacant && React.createElement('div', { key: 'vacant', className: 'status status--warning', style: { marginBottom: '8px' } }, 'Position Vacant'),
            React.createElement('button', {
              key: 'expand',
              className: 'btn btn--outline btn--sm',
              onClick: () => toggleExpand(delegate.id)
            }, expandedDelegate === delegate.id ? 'Collapse' : 'Expand'),
            
            expandedDelegate === delegate.id && React.createElement('div', { key: 'expanded', className: 'delegate-expanded' }, [
              React.createElement('h5', { key: 'title' }, 'Detailed Analysis'),
              React.createElement('div', { key: 'strengths', style: { marginBottom: '8px' } }, [
                React.createElement('strong', null, 'Strengths: '),
                delegate.strengths || 'Not assessed'
              ]),
              React.createElement('div', { key: 'weaknesses', style: { marginBottom: '8px' } }, [
                React.createElement('strong', null, 'Weaknesses: '),
                delegate.weaknesses || 'Not assessed'
              ]),
              React.createElement('div', { key: 'usefulness', style: { marginBottom: '8px' } }, [
                React.createElement('strong', null, 'Usefulness Rating: '),
                React.createElement('span', { 
                  className: `status ${delegate.usefulness >= 7 ? 'status--success' : delegate.usefulness >= 4 ? 'status--warning' : 'status--error'}` 
                }, `${delegate.usefulness || 0}/10`)
              ])
            ])
          ])
        )
      )
    )
  ]);
}

/*****************************************************************************************
 5. STRATEGY PLAYBOOK MODULE
*****************************************************************************************/
function Strategy({ state, dispatch }) {
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState(null);
  const [strategyForm, setStrategyForm] = useState({
    title: '',
    content: '',
    status: 'planning',
    type: 'diplomatic'
  });
  const [expandedStrategy, setExpandedStrategy] = useState(null);
  
  const handleAddStrategy = () => {
    setEditingStrategy(null);
    setStrategyForm({ title: '', content: '', status: 'planning', type: 'diplomatic' });
    setShowModal(true);
  };
  
  const handleEditStrategy = (strategy) => {
    setEditingStrategy(strategy);
    setStrategyForm(strategy);
    setShowModal(true);
  };
  
  const handleSaveStrategy = (e) => {
    e.preventDefault();
    if (editingStrategy) {
      dispatch({ type: 'UPDATE_STRATEGY', strategy: strategyForm });
      toast('Strategy updated', 'success');
    } else {
      dispatch({ type: 'ADD_STRATEGY', strategy: strategyForm });
      toast('Strategy added', 'success');
    }
    setShowModal(false);
  };
  
  const handleDeleteStrategy = (id) => {
    dispatch({ type: 'DELETE_STRATEGY', id });
    toast('Strategy deleted', 'warning');
  };
  
  const toggleExpand = (strategyId) => {
    setExpandedStrategy(expandedStrategy === strategyId ? null : strategyId);
  };
  
  const strategies = state.strategies || [];
  
  return React.createElement('div', { className: 'page-grid' }, [
    React.createElement('div', { key: 'header', className: 'page-header' }, [
      React.createElement('h1', null, 'Strategy Playbook'),
      React.createElement('p', null, 'Front room and back room strategic initiatives')
    ]),
    
    React.createElement('div', { key: 'header-card', className: 'card span-full' }, [
      React.createElement('div', { className: 'card__header' }, [
        React.createElement('h3', null, 'Strategic Initiatives'),
        React.createElement('button', { className: 'btn btn--primary btn--sm', onClick: handleAddStrategy }, 'New Strategy')
      ]),
      React.createElement('div', { className: 'card__body' },
        React.createElement('div', { className: 'strategy-grid' },
          strategies.map(strategy =>
            React.createElement('div', { key: strategy.id, className: 'strategy-card' }, [
              React.createElement('div', { 
                key: 'header',
                className: 'strategy-header',
                onClick: () => toggleExpand(strategy.id)
              }, [
                React.createElement('div', { key: 'title', className: 'strategy-title' }, strategy.title),
                React.createElement('div', { 
                  key: 'status',
                  className: `strategy-status strategy-status--${strategy.status}`
                }, strategy.status.charAt(0).toUpperCase() + strategy.status.slice(1))
              ]),
              
              expandedStrategy === strategy.id && React.createElement('div', { key: 'content', className: 'strategy-content' }, [
                React.createElement('div', { key: 'text', style: { marginBottom: '16px', whiteSpace: 'pre-line' } }, strategy.content),
                React.createElement('div', { key: 'meta', style: { marginBottom: '16px' } }, [
                  React.createElement('span', { className: 'status status--info', style: { marginRight: '8px' } }, strategy.type),
                  React.createElement('span', { className: `status status--${strategy.status === 'active' ? 'success' : 'warning'}` }, strategy.status)
                ]),
                React.createElement('div', { key: 'actions', className: 'flex gap-8' }, [
                  React.createElement('button', { className: 'btn btn--outline btn--sm', onClick: () => handleEditStrategy(strategy) }, 'Edit'),
                  React.createElement('button', { className: 'btn btn--danger btn--sm', onClick: () => handleDeleteStrategy(strategy.id) }, 'Delete')
                ])
              ])
            ])
          )
        )
      )
    ]),
    
    showModal && React.createElement('div', { key: 'modal', className: 'modal' },
      React.createElement('div', { className: 'modal-content' }, [
        React.createElement('div', { key: 'header', className: 'modal-header' }, [
          React.createElement('h3', null, editingStrategy ? 'Edit Strategy' : 'New Strategy'),
          React.createElement('button', { className: 'btn btn--secondary btn--sm', onClick: () => setShowModal(false) }, '×')
        ]),
        React.createElement('form', { key: 'form', onSubmit: handleSaveStrategy },
          React.createElement('div', { className: 'modal-body' }, [
            React.createElement('div', { key: 'title', className: 'form-group' }, [
              React.createElement('label', { className: 'form-label' }, 'Strategy Title'),
              React.createElement('input', {
                type: 'text',
                className: 'form-control',
                value: strategyForm.title,
                onChange: (e) => setStrategyForm({...strategyForm, title: e.target.value}),
                required: true,
                placeholder: 'Enter strategy title'
              })
            ]),
            React.createElement('div', { key: 'content', className: 'form-group' }, [
              React.createElement('label', { className: 'form-label' }, 'Strategy Content'),
              React.createElement('textarea', {
                className: 'form-control',
                rows: 6,
                value: strategyForm.content,
                onChange: (e) => setStrategyForm({...strategyForm, content: e.target.value}),
                required: true,
                placeholder: 'Describe the strategy in detail...'
              })
            ]),
            React.createElement('div', { key: 'type', className: 'form-group' }, [
              React.createElement('label', { className: 'form-label' }, 'Strategy Type'),
              React.createElement('select', {
                className: 'form-control',
                value: strategyForm.type,
                onChange: (e) => setStrategyForm({...strategyForm, type: e.target.value})
              }, [
                React.createElement('option', { key: 'diplomatic', value: 'diplomatic' }, 'Diplomatic'),
                React.createElement('option', { key: 'military', value: 'military' }, 'Military'),
                React.createElement('option', { key: 'economic', value: 'economic' }, 'Economic'),
                React.createElement('option', { key: 'intelligence', value: 'intelligence' }, 'Intelligence')
              ])
            ]),
            React.createElement('div', { key: 'status', className: 'form-group' }, [
              React.createElement('label', { className: 'form-label' }, 'Status'),
              React.createElement('select', {
                className: 'form-control',
                value: strategyForm.status,
                onChange: (e) => setStrategyForm({...strategyForm, status: e.target.value})
              }, [
                React.createElement('option', { key: 'planning', value: 'planning' }, 'Planning'),
                React.createElement('option', { key: 'active', value: 'active' }, 'Active'),
                React.createElement('option', { key: 'completed', value: 'completed' }, 'Completed'),
                React.createElement('option', { key: 'suspended', value: 'suspended' }, 'Suspended')
              ])
            ])
          ]),
          React.createElement('div', { key: 'footer', className: 'modal-footer' },
            React.createElement('button', { type: 'submit', className: 'btn btn--primary' }, 
              editingStrategy ? 'Update Strategy' : 'Add Strategy'
            )
          )
        )
      ])
    )
  ]);
}

/*****************************************************************************************
 6. DOCUMENTS MODULE
*****************************************************************************************/
function Documents({ state, dispatch }) {
  const toast = useToast();
  const [viewingDocument, setViewingDocument] = useState(null);
  const fileInputRef = useRef();
  const dropAreaRef = useRef();
  
  const handleFileUpload = (file) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const document = {
        name: file.name,
        type: file.type,
        size: file.size,
        content: e.target.result,
        category: getFileCategory(file.type),
        uploadDate: new Date().toISOString()
      };
      dispatch({ type: 'ADD_DOCUMENT', document });
      toast('Document uploaded successfully', 'success');
    };
    reader.readAsDataURL(file);
  };
  
  const getFileCategory = (type) => {
    if (type.includes('pdf')) return 'administrative';
    if (type.includes('excel') || type.includes('sheet')) return 'military';
    if (type.includes('word') || type.includes('document')) return 'diplomatic';
    return 'intelligence';
  };
  
  const handleInputChange = () => {
    const file = fileInputRef.current.files[0];
    if (file) {
      handleFileUpload(file);
      fileInputRef.current.value = '';
    }
  };
  
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;
    
    const handleDragOver = (e) => {
      e.preventDefault();
      dropArea.classList.add('drag-over');
    };
    
    const handleDragLeave = () => {
      dropArea.classList.remove('drag-over');
    };
    
    const handleDrop = (e) => {
      e.preventDefault();
      dropArea.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    };
    
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);
    
    return () => {
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, []);
  
  const documents = state.documents || [];
  
  return React.createElement('div', { className: 'page-grid' }, [
    React.createElement('div', { key: 'header', className: 'page-header' }, [
      React.createElement('h1', null, 'Documents Center'),
      React.createElement('p', null, 'Document management and in-panel viewing system')
    ]),
    
    React.createElement('div', { key: 'upload', className: 'card' }, [
      React.createElement('div', { className: 'card__header' },
        React.createElement('h3', null, 'Upload Documents')
      ),
      React.createElement('div', { className: 'card__body' }, [
        React.createElement('div', { 
          key: 'drop-area',
          ref: dropAreaRef,
          className: 'upload-area',
          onClick: () => fileInputRef.current?.click()
        }, [
          React.createElement('div', { key: 'icon', className: 'upload-icon' }, '📁'),
          React.createElement('p', { key: 'text' }, 'Drag & drop files here or click to browse'),
          React.createElement('p', { key: 'hint', style: { fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' } }, 'Supports PDF, DOC, XLSX files')
        ]),
        React.createElement('input', {
          key: 'file-input',
          ref: fileInputRef,
          type: 'file',
          style: { display: 'none' },
          onChange: handleInputChange,
          accept: '.pdf,.doc,.docx,.xls,.xlsx'
        })
      ])
    ]),
    
    React.createElement('div', { key: 'list', className: 'card' }, [
      React.createElement('div', { className: 'card__header' }, [
        React.createElement('h3', null, 'Document Library'),
        React.createElement('span', { className: 'status status--info' }, `${documents.length} documents`)
      ]),
      React.createElement('div', { className: 'card__body' },
        documents.length > 0
          ? React.createElement('table', { className: 'table' }, [
              React.createElement('thead', { key: 'head' },
                React.createElement('tr', null, [
                  React.createElement('th', { key: 'name' }, 'Name'),
                  React.createElement('th', { key: 'category' }, 'Category'),
                  React.createElement('th', { key: 'size' }, 'Size'),
                  React.createElement('th', { key: 'date' }, 'Upload Date'),
                  React.createElement('th', { key: 'actions' }, 'Actions')
                ])
              ),
              React.createElement('tbody', { key: 'body' },
                documents.map(doc =>
                  React.createElement('tr', { key: doc.id }, [
                    React.createElement('td', { key: 'name' }, doc.name),
                    React.createElement('td', { key: 'category' }, 
                      React.createElement('span', { className: 'status status--info' }, doc.category)
                    ),
                    React.createElement('td', { key: 'size' }, Math.round(doc.size / 1024) + ' KB'),
                    React.createElement('td', { key: 'date' }, formatDate(doc.uploadDate || new Date())),
                    React.createElement('td', { key: 'actions' }, [
                      React.createElement('button', {
                        key: 'view',
                        className: 'btn btn--outline btn--sm',
                        onClick: () => setViewingDocument(doc)
                      }, 'View'),
                      React.createElement('button', {
                        key: 'delete',
                        className: 'btn btn--danger btn--sm',
                        style: { marginLeft: '8px' },
                        onClick: () => dispatch({ type: 'DELETE_DOCUMENT', id: doc.id })
                      }, 'Delete')
                    ])
                  ])
                )
              )
            ])
          : React.createElement('p', { className: 'text-center' }, 'No documents uploaded yet')
      )
    ]),
    
    viewingDocument && React.createElement('div', { key: 'viewer', className: 'card span-full' }, [
      React.createElement('div', { className: 'card__header' }, [
        React.createElement('h3', null, `Viewing: ${viewingDocument.name}`),
        React.createElement('button', { className: 'btn btn--secondary btn--sm', onClick: () => setViewingDocument(null) }, 'Close')
      ]),
      React.createElement('div', { className: 'card__body' },
        React.createElement('iframe', {
          src: viewingDocument.content,
          style: { width: '100%', height: '500px', border: 'none', borderRadius: 'var(--radius-base)' }
        })
      )
    ])
  ]);
}

/*****************************************************************************************
 7. NOTES & PRODUCTIVITY MODULE
*****************************************************************************************/
function Notes({ state, dispatch }) {
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({ title: '', content: '' });
  
  const handleAddNote = () => {
    setEditingNote(null);
    setNoteForm({ title: '', content: '' });
    setShowModal(true);
  };
  
  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteForm(note);
    setShowModal(true);
  };
  
  const handleSaveNote = (e) => {
    e.preventDefault();
    const wordCount = noteForm.content.split(/\s+/).filter(word => word.length > 0).length;
    const noteData = { ...noteForm, wordCount };
    
    if (editingNote) {
      dispatch({ type: 'UPDATE_NOTE', note: { ...noteData, id: editingNote.id, timestamp: editingNote.timestamp } });
      toast('Note updated', 'success');
    } else {
      dispatch({ type: 'ADD_NOTE', note: noteData });
      toast('Note added', 'success');
    }
    setShowModal(false);
  };
  
  const handleDeleteNote = (id) => {
    dispatch({ type: 'DELETE_NOTE', id });
    toast('Note deleted', 'warning');
  };
  
  const handleSaveToDocuments = (note) => {
    const document = {
      name: `Note - ${note.title}.txt`,
      type: 'text/plain',
      size: note.content.length,
      content: `data:text/plain;base64,${btoa(note.content)}`,
      category: 'administrative',
      uploadDate: new Date().toISOString()
    };
    dispatch({ type: 'ADD_DOCUMENT', document });
    toast('Note saved to documents', 'success');
  };
  
  const notes = state.notes || [];
  
  return React.createElement('div', { className: 'page-grid' }, [
    React.createElement('div', { key: 'header', className: 'page-header' }, [
      React.createElement('h1', null, 'Notes & Productivity'),
      React.createElement('p', null, 'Rich text note editor with cross-module linking')
    ]),
    
    React.createElement('div', { key: 'header-card', className: 'card span-full' }, [
      React.createElement('div', { className: 'card__header' }, [
        React.createElement('h3', null, 'Strategic Notes'),
        React.createElement('button', { className: 'btn btn--primary btn--sm', onClick: handleAddNote }, 'New Note')
      ]),
      React.createElement('div', { className: 'card__body' },
        notes.length > 0
          ? React.createElement('div', { className: 'notes-list' },
              notes.map(note =>
                React.createElement('div', { key: note.id, className: 'note-item' }, [
                  React.createElement('div', { key: 'header', className: 'note-header' }, [
                    React.createElement('h4', { style: { margin: 0, color: 'var(--color-primary)' } }, note.title),
                    React.createElement('span', { className: 'note-timestamp' }, formatDate(note.timestamp))
                  ]),
                  React.createElement('div', { key: 'content', style: { marginBottom: '12px', whiteSpace: 'pre-line' } }, 
                    note.content.substring(0, 200) + (note.content.length > 200 ? '...' : '')
                  ),
                  React.createElement('div', { key: 'meta', className: 'flex items-center justify-between' }, [
                    React.createElement('span', { className: 'status status--info' }, `${note.wordCount || 0} words`),
                    React.createElement('div', { className: 'flex gap-8' }, [
                      React.createElement('button', { className: 'btn btn--outline btn--sm', onClick: () => handleEditNote(note) }, 'Edit'),
                      React.createElement('button', { className: 'btn btn--secondary btn--sm', onClick: () => handleSaveToDocuments(note) }, 'Save to Docs'),
                      React.createElement('button', { className: 'btn btn--danger btn--sm', onClick: () => handleDeleteNote(note.id) }, 'Delete')
                    ])
                  ])
                ])
              )
            )
          : React.createElement('p', { className: 'text-center' }, 'No notes created yet')
      )
    ]),
    
    showModal && React.createElement('div', { key: 'modal', className: 'modal' },
      React.createElement('div', { className: 'modal-content', style: { maxWidth: '800px' } }, [
        React.createElement('div', { key: 'header', className: 'modal-header' }, [
          React.createElement('h3', null, editingNote ? 'Edit Note' : 'New Note'),
          React.createElement('button', { className: 'btn btn--secondary btn--sm', onClick: () => setShowModal(false) }, '×')
        ]),
        React.createElement('form', { key: 'form', onSubmit: handleSaveNote },
          React.createElement('div', { className: 'modal-body' }, [
            React.createElement('div', { key: 'title', className: 'form-group' }, [
              React.createElement('label', { className: 'form-label' }, 'Title'),
              React.createElement('input', {
                type: 'text',
                className: 'form-control',
                value: noteForm.title,
                onChange: (e) => setNoteForm({...noteForm, title: e.target.value}),
                required: true,
                placeholder: 'Enter note title'
              })
            ]),
            React.createElement('div', { key: 'content', className: 'form-group' }, [
              React.createElement('label', { className: 'form-label' }, 'Content'),
              React.createElement('textarea', {
                className: 'form-control',
                rows: 12,
                value: noteForm.content,
                onChange: (e) => setNoteForm({...noteForm, content: e.target.value}),
                required: true,
                placeholder: 'Enter note content...'
              })
            ]),
            React.createElement('div', { key: 'stats', style: { fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' } },
              `${noteForm.content.length} characters, ${noteForm.content.split(/\s+/).filter(w => w.length > 0).length} words`
            )
          ]),
          React.createElement('div', { key: 'footer', className: 'modal-footer' },
            React.createElement('button', { type: 'submit', className: 'btn btn--primary' }, 
              editingNote ? 'Update Note' : 'Save Note'
            )
          )
        )
      ])
    )
  ]);
}

/*****************************************************************************************
 8. PERFORMANCE ANALYTICS MODULE
*****************************************************************************************/
function Performance({ state, dispatch }) {
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingDirective, setEditingDirective] = useState(null);
  const [directiveForm, setDirectiveForm] = useState({
    title: '',
    impact: 'Medium',
    notes: '',
    success: false
  });
  const chartRef = useRef();
  const chartInstance = useRef();
  
  const handleAddDirective = () => {
    setEditingDirective(null);
    setDirectiveForm({ title: '', impact: 'Medium', notes: '', success: false });
    setShowModal(true);
  };
  
  const handleEditDirective = (directive) => {
    setEditingDirective(directive);
    setDirectiveForm(directive);
    setShowModal(true);
  };
  
  const handleSaveDirective = (e) => {
    e.preventDefault();
    const directiveData = { ...directiveForm, date: new Date().toISOString().split('T')[0] };
    
    if (editingDirective) {
      dispatch({ type: 'UPDATE_DIRECTIVE', directive: { ...directiveData, id: editingDirective.id } });
      toast('Directive updated', 'success');
    } else {
      dispatch({ type: 'ADD_DIRECTIVE', directive: directiveData });
      toast('Directive added', 'success');
    }
    setShowModal(false);
  };
  
  const handleDeleteDirective = (id) => {
    dispatch({ type: 'DELETE_DIRECTIVE', id });
    toast('Directive deleted', 'warning');
  };
  
  const handleToggleSuccess = (id) => {
    dispatch({ type: 'TOGGLE_DIRECTIVE_SUCCESS', id });
    toast('Directive status updated', 'info');
  };
  
  const directives = state.directives || [];
  const totalDirectives = directives.length;
  const successfulDirectives = directives.filter(d => d.success).length;
  const successRate = totalDirectives > 0 ? Math.round((successfulDirectives / totalDirectives) * 100) : 0;
  
  // Update chart
  useEffect(() => {
    if (!chartRef.current || directives.length === 0) return;
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const successful = directives.filter(d => d.success).length;
    const failed = directives.filter(d => !d.success).length;
    
    chartInstance.current = new Chart(chartRef.current.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Successful', 'Failed'],
        datasets: [{
          data: [successful, failed],
          backgroundColor: ['#10b981', '#ef4444'],
          borderColor: ['#059669', '#dc2626'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [directives]);
  
  return React.createElement('div', { className: 'page-grid' }, [
    React.createElement('div', { key: 'header', className: 'page-header' }, [
      React.createElement('h1', null, 'Performance Analytics'),
      React.createElement('p', null, 'Directive tracking and performance metrics dashboard')
    ]),
    
    React.createElement('div', { key: 'kpis', className: 'card span-full' }, [
      React.createElement('div', { className: 'card__header' },
        React.createElement('h3', null, 'Key Performance Indicators')
      ),
      React.createElement('div', { className: 'card__body' },
        React.createElement('div', { className: 'kpi-metrics' }, [
          React.createElement('div', { key: 'total', className: 'kpi-item' }, [
            React.createElement('div', { className: 'kpi-value' }, totalDirectives),
            React.createElement('div', { className: 'kpi-label' }, 'Total Directives')
          ]),
          React.createElement('div', { key: 'successful', className: 'kpi-item' }, [
            React.createElement('div', { className: 'kpi-value', style: { color: '#10b981' } }, successfulDirectives),
            React.createElement('div', { className: 'kpi-label' }, 'Successful')
          ]),
          React.createElement('div', { key: 'rate', className: 'kpi-item' }, [
            React.createElement('div', { className: 'kpi-value', style: { color: successRate >= 70 ? '#10b981' : successRate >= 40 ? '#f59e0b' : '#ef4444' } }, successRate + '%'),
            React.createElement('div', { className: 'kpi-label' }, 'Success Rate')
          ]),
          React.createElement('div', { key: 'risk', className: 'kpi-item' }, [
            React.createElement('div', { className: 'kpi-value' }, Math.round(Object.values(state.risks || {}).reduce((sum, val) => sum + val, 0) / 4) + '%'),
            React.createElement('div', { className: 'kpi-label' }, 'Average Risk Level')
          ])
        ])
      )
    ]),
    
    React.createElement('div', { key: 'directives', className: 'card' }, [
      React.createElement('div', { className: 'card__header' }, [
        React.createElement('h3', null, 'Directive Tracker'),
        React.createElement('button', { className: 'btn btn--primary btn--sm', onClick: handleAddDirective }, 'Add Directive')
      ]),
      React.createElement('div', { className: 'card__body' },
        totalDirectives > 0
          ? React.createElement('table', { className: 'table' }, [
              React.createElement('thead', { key: 'head' },
                React.createElement('tr', null, [
                  React.createElement('th', { key: 'date' }, 'Date'),
                  React.createElement('th', { key: 'title' }, 'Title'),
                  React.createElement('th', { key: 'impact' }, 'Impact'),
                  React.createElement('th', { key: 'success' }, 'Status'),
                  React.createElement('th', { key: 'actions' }, 'Actions')
                ])
              ),
              React.createElement('tbody', { key: 'body' },
                directives.map(directive =>
                  React.createElement('tr', { key: directive.id }, [
                    React.createElement('td', { key: 'date' }, formatDate(directive.date)),
                    React.createElement('td', { key: 'title' }, directive.title),
                    React.createElement('td', { key: 'impact' }, 
                      React.createElement('span', { className: `status status--${directive.impact === 'High' ? 'error' : 'info'}` }, directive.impact)
                    ),
                    React.createElement('td', { key: 'success' }, 
                      React.createElement('span', { className: `status status--${directive.success ? 'success' : 'error'}` }, 
                        directive.success ? '✓ Success' : '✗ Failed'
                      )
                    ),
                    React.createElement('td', { key: 'actions' }, [
                      React.createElement('button', {
                        key: 'toggle',
                        className: 'btn btn--outline btn--sm',
                        onClick: () => handleToggleSuccess(directive.id)
                      }, 'Toggle'),
                      React.createElement('button', {
                        key: 'edit',
                        className: 'btn btn--secondary btn--sm',
                        style: { marginLeft: '4px' },
                        onClick: () => handleEditDirective(directive)
                      }, 'Edit'),
                      React.createElement('button', {
                        key: 'delete',
                        className: 'btn btn--danger btn--sm',
                        style: { marginLeft: '4px' },
                        onClick: () => handleDeleteDirective(directive.id)
                      }, 'Delete')
                    ])
                  ])
                )
              )
            ])
          : React.createElement('p', { className: 'text-center' }, 'No directives added yet')
      )
    ]),
    
    React.createElement('div', { key: 'chart', className: 'card' }, [
      React.createElement('div', { className: 'card__header' },
        React.createElement('h3', null, 'Success Rate Analysis')
      ),
      React.createElement('div', { className: 'card__body' },
        totalDirectives > 0
          ? React.createElement('div', { className: 'chart-container' },
              React.createElement('canvas', { ref: chartRef })
            )
          : React.createElement('p', { className: 'text-center' }, 'No data to display')
      )
    ]),
    
    showModal && React.createElement('div', { key: 'modal', className: 'modal' },
      React.createElement('div', { className: 'modal-content' }, [
        React.createElement('div', { key: 'header', className: 'modal-header' }, [
          React.createElement('h3', null, editingDirective ? 'Edit Directive' : 'New Directive'),
          React.createElement('button', { className: 'btn btn--secondary btn--sm', onClick: () => setShowModal(false) }, '×')
        ]),
        React.createElement('form', { key: 'form', onSubmit: handleSaveDirective },
          React.createElement('div', { className: 'modal-body' }, [
            React.createElement('div', { key: 'title', className: 'form-group' }, [
              React.createElement('label', { className: 'form-label' }, 'Directive Title'),
              React.createElement('input', {
                type: 'text',
                className: 'form-control',
                value: directiveForm.title,
                onChange: (e) => setDirectiveForm({...directiveForm, title: e.target.value}),
                required: true,
                placeholder: 'Enter directive title'
              })
            ]),
            React.createElement('div', { key: 'impact', className: 'form-group' }, [
              React.createElement('label', { className: 'form-label' }, 'Impact Level'),
              React.createElement('select', {
                className: 'form-control',
                value: directiveForm.impact,
                onChange: (e) => setDirectiveForm({...directiveForm, impact: e.target.value})
              }, [
                React.createElement('option', { key: 'low', value: 'Low' }, 'Low'),
                React.createElement('option', { key: 'medium', value: 'Medium' }, 'Medium'),
                React.createElement('option', { key: 'high', value: 'High' }, 'High')
              ])
            ]),
            React.createElement('div', { key: 'notes', className: 'form-group' }, [
              React.createElement('label', { className: 'form-label' }, 'Notes'),
              React.createElement('textarea', {
                className: 'form-control',
                rows: 3,
                value: directiveForm.notes,
                onChange: (e) => setDirectiveForm({...directiveForm, notes: e.target.value}),
                placeholder: 'Additional notes...'
              })
            ]),
            React.createElement('div', { key: 'success', className: 'form-group' }, [
              React.createElement('label', { className: 'flex items-center gap-8' }, [
                React.createElement('input', {
                  type: 'checkbox',
                  checked: directiveForm.success,
                  onChange: (e) => setDirectiveForm({...directiveForm, success: e.target.checked})
                }),
                'Mark as successful'
              ])
            ])
          ]),
          React.createElement('div', { key: 'footer', className: 'modal-footer' },
            React.createElement('button', { type: 'submit', className: 'btn btn--primary' }, 
              editingDirective ? 'Update Directive' : 'Add Directive'
            )
          )
        )
      ])
    )
  ]);
}

/*****************************************************************************************
 SIDEBAR NAVIGATION - FIXED
*****************************************************************************************/
function Sidebar({ currentPage, onNavigate }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'resources', label: 'Resources', icon: '⚔️' },
    { id: 'position', label: 'Position & Risk', icon: '📈' },
    { id: 'delegates', label: 'Delegates', icon: '👥' },
    { id: 'strategy', label: 'Strategy', icon: '🎯' },
    { id: 'documents', label: 'Documents', icon: '📂' },
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'performance', label: 'Performance', icon: '📊' }
  ];
  
  return React.createElement('aside', { className: 'sidebar' }, [
    React.createElement('div', { key: 'header', className: 'sidebar-header' },
      React.createElement('h2', null, 'Egypt Command')
    ),
    React.createElement('nav', { key: 'nav', className: 'sidebar-nav' },
      menuItems.map(item =>
        React.createElement('button', {
          key: item.id,
          className: currentPage === item.id ? 'active' : '',
          onClick: () => onNavigate(item.id)
        }, [
          React.createElement('span', { key: 'icon', className: 'nav-icon' }, item.icon),
          React.createElement('span', { key: 'label' }, item.label)
        ])
      )
    )
  ]);
}

/*****************************************************************************************
 MAIN APP COMPONENT - FIXED ROUTING
*****************************************************************************************/
function App() {
  const initialState = {
    currentPage: 'overview',
    overview: {
      summary: 'Egyptian General Staff primary objective after Camp David (Oct 1 1978) is to preserve national security, economic stability via Suez revenues, and diplomatic leverage while managing regional isolation and internal stability challenges.',
      timeline: initialData.timeline
    },
    resources: initialData.resources,
    swot: initialData.swot,
    risks: initialData.risks,
    strategies: initialData.strategies,
    documents: initialData.documents,
    notes: initialData.notes,
    directives: initialData.directives
  };
  
  const [state, dispatch] = useReducer(appReducer, loadFromStorage('egyptDashboardState', initialState));
  
  const renderPage = () => {
    switch (state.currentPage) {
      case 'overview':
        return React.createElement(Overview, { state, dispatch });
      case 'resources':
        return React.createElement(Resources, { state, dispatch });
      case 'position':
        return React.createElement(PositionRisk, { state, dispatch });
      case 'delegates':
        return React.createElement(Delegates, { state, dispatch });
      case 'strategy':
        return React.createElement(Strategy, { state, dispatch });
      case 'documents':
        return React.createElement(Documents, { state, dispatch });
      case 'notes':
        return React.createElement(Notes, { state, dispatch });
      case 'performance':
        return React.createElement(Performance, { state, dispatch });
      default:
        return React.createElement(Overview, { state, dispatch });
    }
  };
  
  const handleNavigation = (page) => {
    dispatch({ type: 'SET_PAGE', page });
  };
  
  return React.createElement(ToastProvider, null,
    React.createElement('div', { className: 'app-layout' }, [
      React.createElement(Sidebar, {
        key: 'sidebar',
        currentPage: state.currentPage,
        onNavigate: handleNavigation
      }),
      React.createElement('main', { key: 'content', className: 'content' }, renderPage())
    ])
  );
}

/*****************************************************************************************
 INITIALIZATION
*****************************************************************************************/
window.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(App));
});