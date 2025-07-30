// Egypt Crisis Command Dashboard – Enhanced Edition with Document Viewing & Data Persistence
// React 18 UMD with comprehensive localStorage integration

const { useState, useEffect, useReducer, createContext, useContext, useRef, useCallback } = React;

/*****************************************************************************************
 UTILITIES & CONSTANTS
*****************************************************************************************/
const genId = () => Math.random().toString(36).slice(2, 10);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// File type detection
const getFileType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  if (['pdf'].includes(ext)) return 'pdf';
  if (['xlsx', 'xls'].includes(ext)) return 'excel';
  if (['docx', 'doc'].includes(ext)) return 'word';
  if (['txt'].includes(ext)) return 'text';
  return 'unknown';
};

/*****************************************************************************************
 SEED DATA
*****************************************************************************************/
const delegatesData = [
  {"id":1,"portfolio":"Vice President","country":"U.S.A"},
  {"id":2,"portfolio":"Secretary of State","country":"U.S.A","vacant":true},
  {"id":3,"portfolio":"Secretary of Defence","country":"U.S.A"},
  {"id":4,"portfolio":"Chairman of the Joint Chiefs of Staff","country":"U.S.A"},
  {"id":5,"portfolio":"Director of Central Intelligence","country":"U.S.A"},
  {"id":6,"portfolio":"National Security Advisor","country":"U.S.A"},
  {"id":7,"portfolio":"Chief of Staff of the US Air Force","country":"U.S.A"},
  {"id":8,"portfolio":"Chief of Staff of the US Army","country":"U.S.A"},
  {"id":9,"portfolio":"Chief of Naval Operations","country":"U.S.A"},
  {"id":10,"portfolio":"Director of National Security Agency","country":"U.S.A"},
  {"id":11,"portfolio":"Deputy Prime Minister","country":"Israel"},
  {"id":12,"portfolio":"Minister of Foreign Affairs","country":"Israel"},
  {"id":13,"portfolio":"Minister of Defence","country":"Israel"},
  {"id":14,"portfolio":"Chief of the General Staff","country":"Israel"},
  {"id":15,"portfolio":"Director of Mossad","country":"Israel"},
  {"id":16,"portfolio":"Director of Shin Bet","country":"Israel"},
  {"id":17,"portfolio":"Minister of Finance","country":"Israel"},
  {"id":18,"portfolio":"Commander of Israel Air Force","country":"Israel"},
  {"id":19,"portfolio":"Commander of Israel Southern Command","country":"Israel"},
  {"id":20,"portfolio":"Director of Israel Military Intelligence","country":"Israel"},
  {"id":21,"portfolio":"Vice President","country":"Egypt"},
  {"id":22,"portfolio":"Minister of Foreign Affairs","country":"Egypt"},
  {"id":23,"portfolio":"Minister of Defence","country":"Egypt"},
  {"id":24,"portfolio":"Chief of the General Staff","country":"Egypt"},
  {"id":25,"portfolio":"Director of Egyptian General Intelligence","country":"Egypt"},
  {"id":26,"portfolio":"Minister of Finance","country":"Egypt"},
  {"id":27,"portfolio":"Commander of Egyptian Air Force","country":"Egypt"},
  {"id":28,"portfolio":"Commander of Second Field Army","country":"Egypt"},
  {"id":29,"portfolio":"Commander of Third Field Army","country":"Egypt"},
  {"id":30,"portfolio":"First Deputy Chairman of the Council of Ministers","country":"Soviet Union"},
  {"id":31,"portfolio":"Minister of Foreign Affairs","country":"Soviet Union"},
  {"id":32,"portfolio":"Minister of Defence","country":"Soviet Union"},
  {"id":33,"portfolio":"Chief of the General Staff","country":"Soviet Union"},
  {"id":34,"portfolio":"Director of the KGB","country":"Soviet Union"},
  {"id":35,"portfolio":"Director of the GRU","country":"Soviet Union"},
  {"id":36,"portfolio":"Commander of the Soviet Air Force","country":"Soviet Union"},
  {"id":37,"portfolio":"Minister of Finance","country":"Soviet Union"},
  {"id":38,"portfolio":"Minister of Heavy Industry","country":"Soviet Union"},
  {"id":39,"portfolio":"Commander in Chief of the Soviet Navy","country":"Soviet Union"}
];

const initialTimelineEvents = [
  {"date":"1978-09-17","title":"Camp David Accords Signed","description":"Egyptian President Anwar Sadat and Israeli Prime Minister Menachem Begin sign historic peace frameworks","impact":"High","category":"Diplomatic","id":genId()},
  {"date":"1978-10-01","title":"Historical Freeze Date","description":"Committee timeline freezes - all subsequent events are alternate timeline","impact":"Critical","category":"Administrative","id":genId()},
  {"date":"1978-10-02","title":"Giza Plateau Bombing","description":"Bomb detonates near the Great Sphinx at 7:50 AM EET, causing minor structural damage","impact":"High","category":"Security","id":genId()},
  {"date":"1978-10-08","title":"Joint Investigation Proposal","description":"Israel proposes joint investigation into Giza bombing through diplomatic channels","impact":"Medium","category":"Diplomatic","id":genId()},
  {"date":"1978-10-18","title":"Egyptian Limited Airstrike","description":"Egyptian forces conduct limited airstrike on unmanned Israeli logistics sites in Sinai","impact":"Critical","category":"Military","id":genId()},
  {"date":"1978-10-25","title":"Soviet Communications Leaked","description":"Confidential Egypt-USSR communications regarding Suez Canal access revealed","impact":"Critical","category":"Intelligence","id":genId()}
];

/*****************************************************************************************
 INITIAL STATE
*****************************************************************************************/
const getInitialState = () => ({
  currentPage: 'overview',
  overview: {
    summary: 'Egyptian General Staff primary objective after Camp David (Oct 1 1978) is to preserve national security, economic stability via Suez revenues, and diplomatic leverage while managing complex relationships with USA, Israel, and Soviet Union.',
    timeline: [...initialTimelineEvents]
  },
  resources: {
    military: [
      { id: genId(), asset: 'Army Personnel', quantity: 400000, category: 'Personnel' },
      { id: genId(), asset: 'Air Force Personnel', quantity: 30000, category: 'Personnel' },
      { id: genId(), asset: 'Navy Personnel', quantity: 35000, category: 'Personnel' },
      { id: genId(), asset: 'M60A1 Tanks', quantity: 835, category: 'Equipment' },
      { id: genId(), asset: 'T-62 Tanks', quantity: 200, category: 'Equipment' }
    ],
    economic: [
      { id: genId(), asset: 'GDP (Billion USD)', quantity: 80, category: 'Economic' },
      { id: genId(), asset: 'US Aid (Billion USD)', quantity: 0.75, category: 'Economic' },
      { id: genId(), asset: 'Soviet Deals (Billion USD)', quantity: 0.45, category: 'Economic' }
    ],
    diplomatic: [
      { id: genId(), asset: 'Active Embassies', quantity: 28, category: 'Diplomatic' },
      { id: genId(), asset: 'Trade Agreements', quantity: 15, category: 'Diplomatic' }
    ]
  },
  position: {
    swot: {
      strengths: ['Strategic Suez Canal control', 'Regional military leadership', 'US-Soviet balanced relations'],
      weaknesses: ['Economic dependency', 'Technology gaps', 'Internal political pressure'],
      opportunities: ['Peace dividend potential', 'Regional stability role', 'Economic modernization'],
      threats: ['Regional conflicts', 'Economic sanctions', 'Internal security challenges']
    },
    risks: {
      military: 6,
      economic: 7,
      diplomatic: 5,
      internal: 8
    }
  },
  delegates: delegatesData.map(d => ({ ...d, expanded: false })),
  strategy: {
    playbook: [
      { id: genId(), title: 'Diplomatic Balance Strategy', status: 'active', priority: 'high', description: 'Maintain balanced relations with both superpowers' },
      { id: genId(), title: 'Economic Diversification', status: 'planning', priority: 'medium', description: 'Reduce dependency on single revenue sources' },
      { id: genId(), title: 'Military Modernization', status: 'active', priority: 'high', description: 'Upgrade equipment and training programs' }
    ]
  },
  documents: [],
  notes: {
    entries: [
      { id: genId(), title: 'Meeting Notes - Cabinet Review', content: 'Strategic priorities discussed with defense council...', timestamp: new Date().toISOString(), tags: ['meeting', 'strategy'] }
    ]
  },
  performance: { 
    directives: [
      { id: genId(), ts: '1978-10-15', title: 'Enhance Suez Security', impact: 'High', success: true, description: 'Implement additional security measures for canal operations' },
      { id: genId(), ts: '1978-10-20', title: 'Intelligence Coordination', impact: 'Critical', success: false, description: 'Establish improved coordination protocols between agencies' }
    ]
  }
});

/*****************************************************************************************
 DATA PERSISTENCE
*****************************************************************************************/
const STORAGE_KEY = 'egypt_crisis_dashboard_state';

const saveToStorage = (state) => {
  try {
    const serialized = JSON.stringify({
      ...state,
      lastSaved: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with default state to handle new features
      return { ...getInitialState(), ...parsed };
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return getInitialState();
};

const exportData = (state) => {
  const dataStr = JSON.stringify(state, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `egypt-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/*****************************************************************************************
 TOAST CONTEXT
*****************************************************************************************/
const ToastContext = createContext(() => {});

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  
  const addToast = useCallback((message, type = 'info') => {
    const id = genId();
    const toast = { id, message, type, timestamp: Date.now() };
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);
  
  return React.createElement(ToastContext.Provider, { value: addToast }, [
    children,
    React.createElement('div', { key: 'toast-container', className: 'toast-container' }, 
      toasts.map(toast => 
        React.createElement('div', { 
          key: toast.id, 
          className: `toast toast--${toast.type}` 
        }, toast.message)
      )
    )
  ]);
}

const useToast = () => useContext(ToastContext);

/*****************************************************************************************
 AUTO-SAVE HOOK
*****************************************************************************************/
function useAutoSave(state, interval = 30000) {
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const save = () => {
      setSaving(true);
      const success = saveToStorage(state);
      if (success) {
        setLastSaved(new Date());
      }
      setSaving(false);
    };

    const timer = setInterval(save, interval);
    return () => clearInterval(timer);
  }, [state, interval, toast]);

  return { lastSaved, saving };
}

/*****************************************************************************************
 DOCUMENT VIEWER COMPONENTS
*****************************************************************************************/
function PDFViewer({ file }) {
  const canvasRef = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!file || !canvasRef.current) return;
    
    const loadPDF = async () => {
      try {
        setLoading(true);
        if (typeof pdfjsLib === 'undefined') {
          setError('PDF.js library not loaded');
          setLoading(false);
          return;
        }
        const loadingTask = pdfjsLib.getDocument({ data: atob(file.content.split(',')[1]) });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.5 });
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({ canvasContext: context, viewport }).promise;
        setLoading(false);
      } catch (err) {
        setError('Failed to load PDF');
        setLoading(false);
      }
    };

    loadPDF();
  }, [file]);

  if (loading) return React.createElement('div', { className: 'pdf-viewer' }, 'Loading PDF...');
  if (error) return React.createElement('div', { className: 'pdf-viewer' }, error);
  
  return React.createElement('div', { className: 'pdf-viewer' },
    React.createElement('canvas', { ref: canvasRef, style: { maxWidth: '100%', height: 'auto' } })
  );
}

function ExcelViewer({ file }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!file) return;
    
    try {
      setLoading(true);
      if (typeof XLSX === 'undefined') {
        setError('XLSX library not loaded');
        setLoading(false);
        return;
      }
      const binaryString = atob(file.content.split(',')[1]);
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setData(jsonData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load Excel file');
      setLoading(false);
    }
  }, [file]);

  if (loading) return React.createElement('div', { className: 'excel-viewer' }, 'Loading Excel file...');
  if (error) return React.createElement('div', { className: 'excel-viewer' }, error);
  if (!data || data.length === 0) return React.createElement('div', { className: 'excel-viewer' }, 'No data found');

  return React.createElement('div', { className: 'excel-viewer' },
    React.createElement('table', { className: 'excel-sheet' }, [
      data[0] && React.createElement('thead', { key: 'header' },
        React.createElement('tr', null, data[0].map((cell, idx) => 
          React.createElement('th', { key: idx }, String(cell || ''))
        ))
      ),
      React.createElement('tbody', { key: 'body' },
        data.slice(1).map((row, rowIdx) =>
          React.createElement('tr', { key: rowIdx },
            row.map((cell, cellIdx) =>
              React.createElement('td', { key: cellIdx }, String(cell || ''))
            )
          )
        )
      )
    ])
  );
}

function WordViewer({ file }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!file) return;
    
    try {
      setLoading(true);
      // Basic text extraction - in real implementation would use mammoth.js or similar
      const text = 'Word document content preview not fully supported. Download to view complete document.';
      setContent(text);
      setLoading(false);
    } catch (err) {
      setContent('Failed to load Word document');
      setLoading(false);
    }
  }, [file]);

  if (loading) return React.createElement('div', { className: 'word-viewer' }, 'Loading Word document...');
  
  return React.createElement('div', { className: 'word-viewer' }, content);
}

function DocumentViewer({ file, expanded = false }) {
  if (!file) return null;
  
  const fileType = getFileType(file.name);
  
  const getViewer = () => {
    switch (fileType) {
      case 'pdf':
        return React.createElement(PDFViewer, { file });
      case 'excel':
        return React.createElement(ExcelViewer, { file });
      case 'word':
        return React.createElement(WordViewer, { file });
      case 'text':
        return React.createElement('div', { className: 'word-viewer' }, 
          React.createElement('pre', null, atob(file.content.split(',')[1]))
        );
      default:
        return React.createElement('div', { className: 'word-viewer' }, 
          'Preview not available for this file type. Download to view.'
        );
    }
  };

  return React.createElement('div', { className: 'document-viewer' }, getViewer());
}

/*****************************************************************************************
 REDUCER
*****************************************************************************************/
function reducer(state, action) {
  let newState;
  
  switch (action.type) {
    case 'LOAD_STATE':
      return action.state;
      
    case 'NAV':
      newState = { ...state, currentPage: action.page };
      break;

    case 'SUMMARY_SET':
      newState = { ...state, overview: { ...state.overview, summary: action.text } };
      break;

    case 'TIMELINE_ADD':
      newState = { ...state, overview: { ...state.overview, timeline: [...state.overview.timeline, action.item] } };
      break;

    case 'RESOURCE_ADD':
      newState = { ...state, resources: { ...state.resources, [action.cat]: [...state.resources[action.cat], action.item] } };
      break;
      
    case 'RESOURCE_UPDATE':
      newState = { ...state, resources: { ...state.resources, [action.cat]: state.resources[action.cat].map(item => item.id === action.item.id ? action.item : item) } };
      break;
      
    case 'RESOURCE_DELETE':
      newState = { ...state, resources: { ...state.resources, [action.cat]: state.resources[action.cat].filter(item => item.id !== action.id) } };
      break;

    case 'SWOT_UPDATE':
      newState = { ...state, position: { ...state.position, swot: { ...state.position.swot, [action.category]: action.items } } };
      break;
      
    case 'RISK_UPDATE':
      newState = { ...state, position: { ...state.position, risks: { ...state.position.risks, [action.riskType]: action.value } } };
      break;

    case 'DELEGATE_TOGGLE':
      newState = { ...state, delegates: state.delegates.map(d => d.id === action.id ? { ...d, expanded: !d.expanded } : d) };
      break;

    case 'STRATEGY_ADD':
      newState = { ...state, strategy: { ...state.strategy, playbook: [...state.strategy.playbook, action.strategy] } };
      break;
      
    case 'STRATEGY_UPDATE':
      newState = { ...state, strategy: { ...state.strategy, playbook: state.strategy.playbook.map(s => s.id === action.strategy.id ? action.strategy : s) } };
      break;

    case 'DOC_ADD':
      newState = { ...state, documents: [...state.documents, action.doc] };
      break;

    case 'NOTE_ADD':
      newState = { ...state, notes: { ...state.notes, entries: [...state.notes.entries, action.note] } };
      break;
      
    case 'NOTE_UPDATE':
      newState = { ...state, notes: { ...state.notes, entries: state.notes.entries.map(n => n.id === action.note.id ? action.note : n) } };
      break;

    case 'DIR_ADD':
      newState = { ...state, performance: { ...state.performance, directives: [...state.performance.directives, action.directive] } };
      break;
      
    case 'DIR_TOGGLE':
      newState = { ...state, performance: { ...state.performance, directives: state.performance.directives.map(d => d.id === action.id ? { ...d, success: !d.success } : d) } };
      break;
      
    case 'DIR_DELETE':
      newState = { ...state, performance: { ...state.performance, directives: state.performance.directives.filter(d => d.id !== action.id) } };
      break;

    default:
      return state;
  }
  
  // Auto-save to localStorage on every change
  saveToStorage(newState);
  return newState;
}

/*****************************************************************************************
 PAGE COMPONENTS
*****************************************************************************************/
function Overview({ state, dispatch }) {
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [summaryText, setSummaryText] = useState(state.overview.summary);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [timelineForm, setTimelineForm] = useState({ date: '', title: '', description: '', impact: 'Medium', category: 'General' });

  const saveSummary = () => {
    dispatch({ type: 'SUMMARY_SET', text: summaryText });
    setEditing(false);
    toast('Summary updated successfully');
  };

  const addTimelineEvent = (e) => {
    e.preventDefault();
    const event = { ...timelineForm, id: genId() };
    dispatch({ type: 'TIMELINE_ADD', item: event });
    setTimelineForm({ date: '', title: '', description: '', impact: 'Medium', category: 'General' });
    setShowTimelineModal(false);
    toast('Timeline event added');
  };

  const resourceTotals = {
    military: state.resources.military.reduce((sum, item) => sum + item.quantity, 0),
    economic: state.resources.economic.reduce((sum, item) => sum + item.quantity, 0),
    diplomatic: state.resources.diplomatic.reduce((sum, item) => sum + item.quantity, 0)
  };

  return React.createElement('div', { className: 'overview-grid' }, [
    React.createElement('div', { key: 'main-content', style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' } }, [
      React.createElement('div', { key: 'summary', className: 'card' }, [
        React.createElement('div', { className: 'card__header' }, [
          React.createElement('h3', null, 'Strategic Summary'),
          editing ? 
            React.createElement('button', { className: 'btn btn--primary btn--sm', onClick: saveSummary }, 'Save') :
            React.createElement('button', { className: 'btn btn--secondary btn--sm', onClick: () => setEditing(true) }, 'Edit')
        ]),
        React.createElement('div', { className: 'card__body' },
          React.createElement('textarea', {
            className: 'form-control',
            rows: 6,
            readOnly: !editing,
            value: summaryText,
            onChange: (e) => setSummaryText(e.target.value)
          })
        )
      ]),
      
      React.createElement('div', { key: 'timeline', className: 'card' }, [
        React.createElement('div', { className: 'card__header' }, [
          React.createElement('h3', null, 'Crisis Timeline'),
          React.createElement('button', { className: 'btn btn--primary btn--sm', onClick: () => setShowTimelineModal(true) }, 'Add Event')
        ]),
        React.createElement('div', { className: 'card__body' },
          React.createElement('div', { style: { maxHeight: '400px', overflowY: 'auto' } },
            state.overview.timeline.map(event =>
              React.createElement('div', { key: event.id, className: 'timeline-item' }, [
                React.createElement('div', { className: 'timeline-date' }, event.date),
                React.createElement('div', { className: 'timeline-content' }, [
                  React.createElement('div', { className: 'timeline-title' }, event.title),
                  React.createElement('div', { className: 'timeline-impact' }, `Impact: ${event.impact} | Category: ${event.category}`)
                ])
              ])
            )
          )
        )
      ])
    ]),
    
    React.createElement('div', { key: 'sidebar-content' }, [
      React.createElement('div', { className: 'card' }, [
        React.createElement('div', { className: 'card__header' },
          React.createElement('h3', null, 'Resource Overview')
        ),
        React.createElement('div', { className: 'card__body' },
          React.createElement('div', { className: 'kpi-metrics', style: { gridTemplateColumns: '1fr' } },
            Object.entries(resourceTotals).map(([category, total]) =>
              React.createElement('div', { key: category, className: 'kpi-item' }, [
                React.createElement('div', { className: 'kpi-value' }, total.toLocaleString()),
                React.createElement('div', { className: 'kpi-label' }, cap(category))
              ])
            )
          )
        )
      ])
    ]),

    showTimelineModal && React.createElement('div', { key: 'modal', className: 'modal' },
      React.createElement('div', { className: 'modal-content' }, [
        React.createElement('div', { className: 'modal-header' }, [
          React.createElement('h3', null, 'Add Timeline Event'),
          React.createElement('button', { 
            className: 'btn btn--secondary btn--sm', 
            onClick: () => setShowTimelineModal(false),
            type: 'button'
          }, '×')
        ]),
        React.createElement('form', { onSubmit: addTimelineEvent },
          React.createElement('div', { className: 'modal-body' }, [
            React.createElement('input', {
              type: 'date',
              className: 'form-control',
              style: { marginBottom: 'var(--space-8)' },
              value: timelineForm.date,
              onChange: (e) => setTimelineForm({ ...timelineForm, date: e.target.value }),
              required: true
            }),
            React.createElement('input', {
              type: 'text',
              className: 'form-control',
              placeholder: 'Event Title',
              style: { marginBottom: 'var(--space-8)' },
              value: timelineForm.title,
              onChange: (e) => setTimelineForm({ ...timelineForm, title: e.target.value }),
              required: true
            }),
            React.createElement('textarea', {
              className: 'form-control',
              placeholder: 'Event Description',
              rows: 3,
              style: { marginBottom: 'var(--space-8)' },
              value: timelineForm.description,
              onChange: (e) => setTimelineForm({ ...timelineForm, description: e.target.value })
            }),
            React.createElement('select', {
              className: 'form-control',
              style: { marginBottom: 'var(--space-8)' },
              value: timelineForm.impact,
              onChange: (e) => setTimelineForm({ ...timelineForm, impact: e.target.value })
            }, [
              React.createElement('option', { key: 'low', value: 'Low' }, 'Low Impact'),
              React.createElement('option', { key: 'medium', value: 'Medium' }, 'Medium Impact'),
              React.createElement('option', { key: 'high', value: 'High' }, 'High Impact'),
              React.createElement('option', { key: 'critical', value: 'Critical' }, 'Critical Impact')
            ]),
            React.createElement('select', {
              className: 'form-control',
              value: timelineForm.category,
              onChange: (e) => setTimelineForm({ ...timelineForm, category: e.target.value })
            }, [
              React.createElement('option', { key: 'general', value: 'General' }, 'General'),
              React.createElement('option', { key: 'military', value: 'Military' }, 'Military'),
              React.createElement('option', { key: 'diplomatic', value: 'Diplomatic' }, 'Diplomatic'),
              React.createElement('option', { key: 'economic', value: 'Economic' }, 'Economic'),
              React.createElement('option', { key: 'intelligence', value: 'Intelligence' }, 'Intelligence')
            ])
          ]),
          React.createElement('div', { className: 'modal-footer' },
            React.createElement('button', { className: 'btn btn--primary', type: 'submit' }, 'Add Event')
          )
        )
      ])
    )
  ]);
}

function Resources({ state, dispatch }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('military');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ asset: '', quantity: 0, category: '' });
  const chartRef = useRef();
  const chartInstance = useRef();

  const openModal = (item = null) => {
    if (item) {
      setForm({ asset: item.asset, quantity: item.quantity, category: item.category || cap(activeTab) });
      setEditingItem(item);
    } else {
      setForm({ asset: '', quantity: 0, category: cap(activeTab) });
      setEditingItem(null);
    }
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const item = editingItem ? 
      { ...editingItem, ...form } : 
      { ...form, id: genId() };
    
    dispatch({
      type: editingItem ? 'RESOURCE_UPDATE' : 'RESOURCE_ADD',
      cat: activeTab,
      item
    });
    
    setShowModal(false);
    toast(`Resource ${editingItem ? 'updated' : 'added'} successfully`);
  };

  const handleDelete = (id) => {
    dispatch({ type: 'RESOURCE_DELETE', cat: activeTab, id });
    toast('Resource deleted successfully');
  };

  // Chart rendering
  useEffect(() => {
    if (!chartRef.current) return;
    
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
          backgroundColor: colors.slice(0, data.length),
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
  }, [state.resources, activeTab]);

  const tabs = [
    { id: 'military', label: 'Military', icon: '⚔️' },
    { id: 'economic', label: 'Economic', icon: '💰' },
    { id: 'diplomatic', label: 'Diplomatic', icon: '🤝' }
  ];

  return React.createElement('div', { className: 'resources-grid' }, [
    React.createElement('div', { key: 'resources-table', className: 'card' }, [
      React.createElement('div', { className: 'card__header' }, [
        React.createElement('div', { style: { display: 'flex', gap: 'var(--space-8)' } },
          tabs.map(tab =>
            React.createElement('button', {
              key: tab.id,
              type: 'button',
              className: `btn ${activeTab === tab.id ? 'btn--primary' : 'btn--secondary'} btn--sm`,
              onClick: () => setActiveTab(tab.id)
            }, `${tab.icon} ${tab.label}`)
          )
        ),
        React.createElement('button', { 
          className: 'btn btn--primary btn--sm', 
          type: 'button',
          onClick: () => openModal() 
        }, 'Add Resource')
      ]),
      React.createElement('div', { className: 'card__body' },
        React.createElement('table', { className: 'table' }, [
          React.createElement('thead', { key: 'thead' },
            React.createElement('tr', null, [
              React.createElement('th', { key: 'asset' }, 'Asset'),
              React.createElement('th', { key: 'quantity' }, 'Quantity'),
              React.createElement('th', { key: 'category' }, 'Category'),
              React.createElement('th', { key: 'actions' }, 'Actions')
            ])
          ),
          React.createElement('tbody', { key: 'tbody' },
            state.resources[activeTab].map(resource =>
              React.createElement('tr', { key: resource.id }, [
                React.createElement('td', { key: 'asset' }, resource.asset),
                React.createElement('td', { key: 'quantity' }, resource.quantity.toLocaleString()),
                React.createElement('td', { key: 'category' }, resource.category || cap(activeTab)),
                React.createElement('td', { key: 'actions' }, [
                  React.createElement('button', {
                    key: 'edit',
                    type: 'button',
                    className: 'btn btn--outline btn--sm',
                    onClick: () => openModal(resource),
                    style: { marginRight: 'var(--space-4)' }
                  }, 'Edit'),
                  React.createElement('button', {
                    key: 'delete',
                    type: 'button',
                    className: 'btn btn--danger btn--sm',
                    onClick: () => handleDelete(resource.id)
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
        React.createElement('h3', null, `${cap(activeTab)} Resources Chart`)
      ),
      React.createElement('div', { className: 'card__body' },
        React.createElement('div', { className: 'chart-container', style: { position: 'relative', height: '300px' } },
          React.createElement('canvas', { ref: chartRef })
        )
      )
    ]),

    showModal && React.createElement('div', { key: 'modal', className: 'modal' },
      React.createElement('div', { className: 'modal-content' }, [
        React.createElement('div', { className: 'modal-header' }, [
          React.createElement('h3', null, editingItem ? 'Edit Resource' : 'Add Resource'),
          React.createElement('button', { 
            className: 'btn btn--secondary btn--sm', 
            type: 'button',
            onClick: () => setShowModal(false) 
          }, '×')
        ]),
        React.createElement('form', { onSubmit: handleSave },
          React.createElement('div', { className: 'modal-body' }, [
            React.createElement('input', {
              type: 'text',
              className: 'form-control',
              placeholder: 'Asset Name',
              style: { marginBottom: 'var(--space-8)' },
              value: form.asset,
              onChange: (e) => setForm({ ...form, asset: e.target.value }),
              required: true
            }),
            React.createElement('input', {
              type: 'number',
              className: 'form-control',
              placeholder: 'Quantity',
              style: { marginBottom: 'var(--space-8)' },
              value: form.quantity,
              onChange: (e) => setForm({ ...form, quantity: Number(e.target.value) }),
              required: true
            }),
            React.createElement('input', {
              type: 'text',
              className: 'form-control',
              placeholder: 'Category',
              value: form.category,
              onChange: (e) => setForm({ ...form, category: e.target.value }),
              required: true
            })
          ]),
          React.createElement('div', { className: 'modal-footer' },
            React.createElement('button', { className: 'btn btn--primary', type: 'submit' }, 
              editingItem ? 'Update' : 'Add'
            )
          )
        )
      ])
    )
  ]);
}

function PositionRisk({ state, dispatch }) {
  const toast = useToast();
  const [editingSwot, setEditingSwot] = useState(null);
  const [swotForm, setSwotForm] = useState([]);

  const swotCategories = [
    { key: 'strengths', label: 'Strengths', color: 'var(--color-success)' },
    { key: 'weaknesses', label: 'Weaknesses', color: 'var(--color-error)' },
    { key: 'opportunities', label: 'Opportunities', color: 'var(--color-primary)' },
    { key: 'threats', label: 'Threats', color: 'var(--color-warning)' }
  ];

  const riskCategories = [
    { key: 'military', label: 'Military Risk' },
    { key: 'economic', label: 'Economic Risk' },
    { key: 'diplomatic', label: 'Diplomatic Risk' },
    { key: 'internal', label: 'Internal Security Risk' }
  ];

  const editSwot = (category) => {
    setEditingSwot(category);
    setSwotForm([...state.position.swot[category]]);
  };

  const saveSwot = () => {
    dispatch({ type: 'SWOT_UPDATE', category: editingSwot, items: swotForm });
    setEditingSwot(null);
    toast('SWOT analysis updated');
  };

  const updateRisk = (riskType, value) => {
    dispatch({ type: 'RISK_UPDATE', riskType, value: Number(value) });
    toast(`${cap(riskType)} risk updated`);
  };

  return React.createElement('div', { className: 'page-grid' }, [
    React.createElement('div', { key: 'swot', className: 'card' }, [
      React.createElement('div', { className: 'card__header' },
        React.createElement('h3', null, 'SWOT Analysis')
      ),
      React.createElement('div', { className: 'card__body' },
        React.createElement('div', { className: 'swot-container' },
          swotCategories.map(category =>
            React.createElement('div', { key: category.key, className: 'swot-quadrant' }, [
              React.createElement('div', { 
                style: { 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: 'var(--space-8)' 
                } 
              }, [
                React.createElement('h4', { style: { color: category.color, margin: 0 } }, category.label),
                React.createElement('button', {
                  type: 'button',
                  className: 'btn btn--outline btn--sm',
                  onClick: () => editSwot(category.key)
                }, 'Edit')
              ]),
              ...state.position.swot[category.key].map((item, idx) =>
                React.createElement('div', { key: idx, className: 'swot-item' }, `• ${item}`)
              )
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
        riskCategories.map(risk =>
          React.createElement('div', { key: risk.key, className: 'risk-item' }, [
            React.createElement('label', { style: { minWidth: '180px' } }, risk.label),
            React.createElement('input', {
              type: 'range',
              className: 'risk-slider',
              min: 1,
              max: 10,
              value: state.position.risks[risk.key],
              onChange: (e) => updateRisk(risk.key, e.target.value)
            }),
            React.createElement('span', { className: 'risk-value' }, state.position.risks[risk.key])
          ])
        )
      )
    ]),

    editingSwot && React.createElement('div', { key: 'modal', className: 'modal' },
      React.createElement('div', { className: 'modal-content' }, [
        React.createElement('div', { className: 'modal-header' }, [
          React.createElement('h3', null, `Edit ${cap(editingSwot)}`),
          React.createElement('button', { 
            className: 'btn btn--secondary btn--sm', 
            type: 'button',
            onClick: () => setEditingSwot(null) 
          }, '×')
        ]),
        React.createElement('div', { className: 'modal-body' }, [
          React.createElement('textarea', {
            className: 'form-control',
            rows: 10,
            placeholder: 'Enter items (one per line)',
            value: swotForm.join('\n'),
            onChange: (e) => setSwotForm(e.target.value.split('\n').filter(line => line.trim()))
          })
        ]),
        React.createElement('div', { className: 'modal-footer' }, [
          React.createElement('button', { 
            className: 'btn btn--primary', 
            type: 'button',
            onClick: saveSwot 
          }, 'Save'),
          React.createElement('button', { 
            className: 'btn btn--secondary', 
            type: 'button',
            onClick: () => setEditingSwot(null) 
          }, 'Cancel')
        ])
      ])
    )
  ]);
}

function Delegates({ state, dispatch }) {
  const toast = useToast();
  const [filter, setFilter] = useState('all');

  const toggleDelegate = (id) => {
    dispatch({ type: 'DELEGATE_TOGGLE', id });
  };

  const countries = ['all', 'U.S.A', 'Israel', 'Egypt', 'Soviet Union'];
  const filteredDelegates = filter === 'all' ? 
    state.delegates : 
    state.delegates.filter(d => d.country === filter);

  const getCountryFlag = (country) => {
    const flags = {
      'U.S.A': '🇺🇸',
      'Israel': '🇮🇱',
      'Egypt': '🇪🇬',
      'Soviet Union': '🇷🇺'
    };
    return flags[country] || '🏛️';
  };

  return React.createElement('div', { className: 'page-grid' }, [
    React.createElement('div', { key: 'filters', className: 'card' }, [
      React.createElement('div', { className: 'card__header' },
        React.createElement('h3', null, 'Delegate Roster')
      ),
      React.createElement('div', { className: 'card__body' },
        React.createElement('div', { style: { display: 'flex', gap: 'var(--space-8)', marginBottom: 'var(--space-16)' } },
          countries.map(country =>
            React.createElement('button', {
              key: country,
              type: 'button',
              className: `btn ${filter === country ? 'btn--primary' : 'btn--secondary'} btn--sm`,
              onClick: () => setFilter(country)
            }, cap(country))
          )
        )
      )
    ]),

    React.createElement('div', { key: 'delegates', className: 'card' }, [
      React.createElement('div', { className: 'card__header' },
        React.createElement('h3', null, `${filteredDelegates.length} Delegates`)
      ),
      React.createElement('div', { className: 'card__body' },
        React.createElement('div', { className: 'delegate-grid' },
          filteredDelegates.map(delegate =>
            React.createElement('div', { key: delegate.id, className: 'delegate-card' }, [
              React.createElement('div', { 
                style: { 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 'var(--space-8)'
                } 
              }, [
                React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-8)' } }, [
                  React.createElement('span', { style: { fontSize: '1.5em' } }, getCountryFlag(delegate.country)),
                  React.createElement('strong', null, delegate.country)
                ]),
                React.createElement('button', {
                  type: 'button',
                  className: 'btn btn--outline btn--sm',
                  onClick: () => toggleDelegate(delegate.id)
                }, delegate.expanded ? 'Collapse' : 'Expand')
              ]),
              React.createElement('div', { style: { marginBottom: 'var(--space-8)' } }, delegate.portfolio),
              delegate.vacant && React.createElement('div', { 
                className: 'status status--warning',
                style: { marginBottom: 'var(--space-8)' }
              }, 'VACANT'),
              delegate.expanded && React.createElement('div', { className: 'delegate-expanded' }, [
                React.createElement('h5', { style: { marginBottom: 'var(--space-8)' } }, 'Additional Information'),
                React.createElement('p', { style: { fontSize: 'var(--font-size-sm)', margin: 0 } }, 
                  `Key responsibilities include oversight of ${delegate.portfolio.toLowerCase()} operations, strategic planning, and cross-departmental coordination within the ${delegate.country} delegation structure.`
                )
              ])
            ])
          )
        )
      )
    ])
  ]);
}

function Strategy({ state, dispatch }) {
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'planning', priority: 'medium' });

  const openModal = (strategy = null) => {
    if (strategy) {
      setForm({ ...strategy });
      setEditingStrategy(strategy);
    } else {
      setForm({ title: '', description: '', status: 'planning', priority: 'medium' });
      setEditingStrategy(null);
    }
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const strategy = editingStrategy ? 
      { ...editingStrategy, ...form } : 
      { ...form, id: genId() };
    
    dispatch({
      type: editingStrategy ? 'STRATEGY_UPDATE' : 'STRATEGY_ADD',
      strategy
    });
    
    setShowModal(false);
    toast(`Strategy ${editingStrategy ? 'updated' : 'added'} successfully`);
  };

  const getStatusColor = (status) => {
    const colors = {
      planning: 'var(--color-warning)',
      active: 'var(--color-success)',
      completed: 'var(--color-primary)',
      suspended: 'var(--color-error)'
    };
    return colors[status] || 'var(--color-text-secondary)';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'var(--color-text-secondary)',
      medium: 'var(--color-warning)',
      high: 'var(--color-error)'
    };
    return colors[priority] || 'var(--color-text-secondary)';
  };

  return React.createElement('div', { className: 'page-grid' }, [
    React.createElement('div', { key: 'strategies', className: 'card' }, [
      React.createElement('div', { className: 'card__header' }, [
        React.createElement('h3', null, 'Strategy Playbook'),
        React.createElement('button', { 
          className: 'btn btn--primary btn--sm', 
          type: 'button',
          onClick: () => openModal() 
        }, 'Add Strategy')
      ]),
      React.createElement('div', { className: 'card__body' },
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' } },
          state.strategy.playbook.map(strategy =>
            React.createElement('div', { key: strategy.id, className: 'card', style: { backgroundColor: 'var(--color-secondary)' } }, [
              React.createElement('div', { className: 'card__header' }, [
                React.createElement('div', null, [
                  React.createElement('h4', { style: { margin: 0, marginBottom: 'var(--space-4)' } }, strategy.title),
                  React.createElement('div', { style: { display: 'flex', gap: 'var(--space-8)' } }, [
                    React.createElement('span', { 
                      className: 'status',
                      style: { 
                        backgroundColor: `${getStatusColor(strategy.status)}20`,
                        color: getStatusColor(strategy.status),
                        border: `1px solid ${getStatusColor(strategy.status)}40`
                      }
                    }, cap(strategy.status)),
                    React.createElement('span', { 
                      className: 'status',
                      style: { 
                        backgroundColor: `${getPriorityColor(strategy.priority)}20`,
                        color: getPriorityColor(strategy.priority),
                        border: `1px solid ${getPriorityColor(strategy.priority)}40`
                      }
                    }, `${cap(strategy.priority)} Priority`)
                  ])
                ]),
                React.createElement('button', {
                  type: 'button',
                  className: 'btn btn--outline btn--sm',
                  onClick: () => openModal(strategy)
                }, 'Edit')
              ]),
              React.createElement('div', { className: 'card__body' },
                React.createElement('p', { style: { margin: 0 } }, strategy.description)
              )
            ])
          )
        )
      )
    ]),

    showModal && React.createElement('div', { key: 'modal', className: 'modal' },
      React.createElement('div', { className: 'modal-content' }, [
        React.createElement('div', { className: 'modal-header' }, [
          React.createElement('h3', null, editingStrategy ? 'Edit Strategy' : 'Add Strategy'),
          React.createElement('button', { 
            className: 'btn btn--secondary btn--sm', 
            type: 'button',
            onClick: () => setShowModal(false) 
          }, '×')
        ]),
        React.createElement('form', { onSubmit: handleSave },
          React.createElement('div', { className: 'modal-body' }, [
            React.createElement('input', {
              type: 'text',
              className: 'form-control',
              placeholder: 'Strategy Title',
              style: { marginBottom: 'var(--space-8)' },
              value: form.title,
              onChange: (e) => setForm({ ...form, title: e.target.value }),
              required: true
            }),
            React.createElement('textarea', {
              className: 'form-control',
              placeholder: 'Strategy Description',
              rows: 4,
              style: { marginBottom: 'var(--space-8)' },
              value: form.description,
              onChange: (e) => setForm({ ...form, description: e.target.value }),
              required: true
            }),
            React.createElement('select', {
              className: 'form-control',
              style: { marginBottom: 'var(--space-8)' },
              value: form.status,
              onChange: (e) => setForm({ ...form, status: e.target.value })
            }, [
              React.createElement('option', { key: 'planning', value: 'planning' }, 'Planning'),
              React.createElement('option', { key: 'active', value: 'active' }, 'Active'),
              React.createElement('option', { key: 'completed', value: 'completed' }, 'Completed'),
              React.createElement('option', { key: 'suspended', value: 'suspended' }, 'Suspended')
            ]),
            React.createElement('select', {
              className: 'form-control',
              value: form.priority,
              onChange: (e) => setForm({ ...form, priority: e.target.value })
            }, [
              React.createElement('option', { key: 'low', value: 'low' }, 'Low Priority'),
              React.createElement('option', { key: 'medium', value: 'medium' }, 'Medium Priority'),
              React.createElement('option', { key: 'high', value: 'high' }, 'High Priority')
            ])
          ]),
          React.createElement('div', { className: 'modal-footer' },
            React.createElement('button', { className: 'btn btn--primary', type: 'submit' }, 
              editingStrategy ? 'Update' : 'Add'
            )
          )
        )
      ])
    )
  ]);
}

function Documents({ state, dispatch }) {
  const toast = useToast();
  const [expandedDoc, setExpandedDoc] = useState(null);
  const fileInputRef = useRef();
  const dropAreaRef = useRef();

  const handleFileUpload = (file) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const doc = {
        id: genId(),
        name: file.name,
        type: file.type,
        size: file.size,
        content: e.target.result,
        uploadedAt: new Date().toISOString()
      };
      
      dispatch({ type: 'DOC_ADD', doc });
      toast(`Document "${file.name}" uploaded successfully`);
    };
    
    reader.readAsDataURL(file);
  };

  const handleInputChange = () => {
    const file = fileInputRef.current.files[0];
    if (file) {
      handleFileUpload(file);
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop functionality
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
      if (file) {
        handleFileUpload(file);
      }
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

  const downloadDocument = (doc) => {
    const link = document.createElement('a');
    link.href = doc.content;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIcon = (filename) => {
    const type = getFileType(filename);
    const icons = {
      pdf: '📄',
      excel: '📊',
      word: '📝',
      text: '📋',
      unknown: '📎'
    };
    return icons[type] || icons.unknown;
  };

  return React.createElement('div', { className: 'page-grid' }, [
    React.createElement('div', { key: 'upload', className: 'card' }, [
      React.createElement('div', { className: 'card__header' },
        React.createElement('h3', null, 'Upload Documents')
      ),
      React.createElement('div', { className: 'card__body' }, [
        React.createElement('div', {
          ref: dropAreaRef,
          className: 'drag-area',
          onClick: () => fileInputRef.current?.click()
        }, [
          React.createElement('p', { style: { margin: 0, marginBottom: 'var(--space-8)' } }, '📎 Drag & drop files here or click to browse'),
          React.createElement('p', { style: { margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' } }, 
            'Supported: PDF, Excel (.xlsx), Word (.docx), Text files'
          )
        ]),
        React.createElement('input', {
          ref: fileInputRef,
          type: 'file',
          style: { display: 'none' },
          accept: '.pdf,.xlsx,.xls,.docx,.doc,.txt',
          onChange: handleInputChange
        })
      ])
    ]),

    React.createElement('div', { key: 'documents', className: 'card' }, [
      React.createElement('div', { className: 'card__header' },
        React.createElement('h3', null, `Documents (${state.documents.length})`)
      ),
      React.createElement('div', { className: 'card__body' },
        state.documents.length === 0 ? 
          React.createElement('p', { style: { textAlign: 'center', color: 'var(--color-text-secondary)' } }, 'No documents uploaded yet') :
          React.createElement('div', { className: 'file-list' },
            state.documents.map(doc =>
              React.createElement('div', { key: doc.id, className: 'file-item' }, [
                React.createElement('div', { className: 'file-info' }, [
                  React.createElement('div', { className: 'file-name' }, 
                    `${getFileIcon(doc.name)} ${doc.name}`
                  ),
                  React.createElement('div', { className: 'file-meta' }, 
                    `${formatBytes(doc.size)} • ${new Date(doc.uploadedAt).toLocaleDateString()}`
                  )
                ]),
                React.createElement('div', { className: 'file-actions' }, [
                  React.createElement('button', {
                    type: 'button',
                    className: 'btn btn--outline btn--sm',
                    onClick: () => setExpandedDoc(doc)
                  }, 'Expand'),
                  React.createElement('button', {
                    type: 'button',
                    className: 'btn btn--secondary btn--sm',
                    onClick: () => downloadDocument(doc)
                  }, 'Download')
                ])
              ])
            )
          )
      )
    ]),

    expandedDoc && React.createElement('div', { key: 'expanded', className: 'modal' },
      React.createElement('div', { className: 'modal-content large' }, [
        React.createElement('div', { className: 'modal-header' }, [
          React.createElement('h3', null, `${getFileIcon(expandedDoc.name)} ${expandedDoc.name}`),
          React.createElement('div', { style: { display: 'flex', gap: 'var(--space-8)' } }, [
            React.createElement('button', {
              type: 'button',
              className: 'btn btn--secondary btn--sm',
              onClick: () => downloadDocument(expandedDoc)
            }, 'Download'),
            React.createElement('button', {
              type: 'button',
              className: 'btn btn--secondary btn--sm',
              onClick: () => setExpandedDoc(null)
            }, '×')
          ])
        ]),
        React.createElement('div', { className: 'modal-body', style: { padding: 0 } },
          React.createElement(DocumentViewer, { file: expandedDoc, expanded: true })
        )
      ])
    )
  ]);
}

function Notes({ state, dispatch }) {
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', tags: '' });

  const openModal = (note = null) => {
    if (note) {
      setForm({ 
        title: note.title, 
        content: note.content, 
        tags: note.tags ? note.tags.join(', ') : '' 
      });
      setEditingNote(note);
    } else {
      setForm({ title: '', content: '', tags: '' });
      setEditingNote(null);
    }
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const note = {
      ...(editingNote || { id: genId() }),
      ...form,
      tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      timestamp: new Date().toISOString()
    };
    
    dispatch({
      type: editingNote ? 'NOTE_UPDATE' : 'NOTE_ADD',
      note
    });
    
    setShowModal(false);
    toast(`Note ${editingNote ? 'updated' : 'added'} successfully`);
  };

  return React.createElement('div', { className: 'page-grid' }, [
    React.createElement('div', { key: 'notes', className: 'card' }, [
      React.createElement('div', { className: 'card__header' }, [
        React.createElement('h3', null, 'Notes & Productivity'),
        React.createElement('button', { 
          className: 'btn btn--primary btn--sm', 
          type: 'button',
          onClick: () => openModal() 
        }, 'Add Note')
      ]),
      React.createElement('div', { className: 'card__body' },
        React.createElement('div', { className: 'notes-list' },
          state.notes.entries.map(note =>
            React.createElement('div', { key: note.id, className: 'note-item' }, [
              React.createElement('div', { 
                style: { 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: 'var(--space-8)' 
                } 
              }, [
                React.createElement('h4', { style: { margin: 0 } }, note.title),
                React.createElement('div', { style: { display: 'flex', gap: 'var(--space-4)' } }, [
                  React.createElement('button', {
                    type: 'button',
                    className: 'btn btn--outline btn--sm',
                    onClick: () => openModal(note)
                  }, 'Edit'),
                  React.createElement('span', { 
                    style: { 
                      fontSize: 'var(--font-size-sm)', 
                      color: 'var(--color-text-secondary)' 
                    } 
                  }, new Date(note.timestamp).toLocaleDateString())
                ])
              ]),
              React.createElement('p', { style: { marginBottom: 'var(--space-8)' } }, note.content),
              note.tags && note.tags.length > 0 && React.createElement('div', { style: { display: 'flex', gap: 'var(--space-4)' } },
                note.tags.map((tag, idx) =>
                  React.createElement('span', {
                    key: `${note.id}-${tag}-${idx}`,
                    className: 'status status--info',
                    style: { fontSize: 'var(--font-size-xs)' }
                  }, tag)
                )
              )
            ])
          )
        )
      )
    ]),

    showModal && React.createElement('div', { key: 'modal', className: 'modal' },
      React.createElement('div', { className: 'modal-content' }, [
        React.createElement('div', { className: 'modal-header' }, [
          React.createElement('h3', null, editingNote ? 'Edit Note' : 'Add Note'),
          React.createElement('button', { 
            className: 'btn btn--secondary btn--sm', 
            type: 'button',
            onClick: () => setShowModal(false) 
          }, '×')
        ]),
        React.createElement('form', { onSubmit: handleSave },
          React.createElement('div', { className: 'modal-body' }, [
            React.createElement('input', {
              type: 'text',
              className: 'form-control',
              placeholder: 'Note Title',
              style: { marginBottom: 'var(--space-8)' },
              value: form.title,
              onChange: (e) => setForm({ ...form, title: e.target.value }),
              required: true
            }),
            React.createElement('textarea', {
              className: 'form-control',
              placeholder: 'Note Content',
              rows: 8,
              style: { marginBottom: 'var(--space-8)' },
              value: form.content,
              onChange: (e) => setForm({ ...form, content: e.target.value }),
              required: true
            }),
            React.createElement('input', {
              type: 'text',
              className: 'form-control',
              placeholder: 'Tags (comma separated)',
              value: form.tags,
              onChange: (e) => setForm({ ...form, tags: e.target.value })
            })
          ]),
          React.createElement('div', { className: 'modal-footer' },
            React.createElement('button', { className: 'btn btn--primary', type: 'submit' }, 
              editingNote ? 'Update' : 'Add'
            )
          )
        )
      ])
    )
  ]);
}

function Performance({ state, dispatch }) {
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', impact: 'Medium' });

  const handleAdd = (e) => {
    e.preventDefault();
    const directive = {
      ...form,
      id: genId(),
      ts: new Date().toLocaleDateString(),
      success: false
    };
    
    dispatch({ type: 'DIR_ADD', directive });
    setForm({ title: '', description: '', impact: 'Medium' });
    setShowModal(false);
    toast('Directive added successfully');
  };

  const toggleSuccess = (id) => {
    dispatch({ type: 'DIR_TOGGLE', id });
    toast('Directive status updated');
  };

  const deleteDirective = (id) => {
    dispatch({ type: 'DIR_DELETE', id });
    toast('Directive deleted');
  };

  const successRate = state.performance.directives.length > 0 ? 
    Math.round((state.performance.directives.filter(d => d.success).length / state.performance.directives.length) * 100) : 0;

  return React.createElement('div', { className: 'page-grid' }, [
    React.createElement('div', { key: 'metrics', className: 'card' }, [
      React.createElement('div', { className: 'card__header' },
        React.createElement('h3', null, 'Performance Metrics')
      ),
      React.createElement('div', { className: 'card__body' },
        React.createElement('div', { className: 'kpi-metrics' }, [
          React.createElement('div', { className: 'kpi-item' }, [
            React.createElement('div', { className: 'kpi-value' }, state.performance.directives.length),
            React.createElement('div', { className: 'kpi-label' }, 'Total Directives')
          ]),
          React.createElement('div', { className: 'kpi-item' }, [
            React.createElement('div', { className: 'kpi-value' }, state.performance.directives.filter(d => d.success).length),
            React.createElement('div', { className: 'kpi-label' }, 'Completed')
          ]),
          React.createElement('div', { className: 'kpi-item' }, [
            React.createElement('div', { className: 'kpi-value' }, `${successRate}%`),
            React.createElement('div', { className: 'kpi-label' }, 'Success Rate')
          ])
        ])
      )
    ]),

    React.createElement('div', { key: 'directives', className: 'card' }, [
      React.createElement('div', { className: 'card__header' }, [
        React.createElement('h3', null, 'Directive Tracking'),
        React.createElement('button', { 
          className: 'btn btn--primary btn--sm', 
          type: 'button',
          onClick: () => setShowModal(true) 
        }, 'Add Directive')
      ]),
      React.createElement('div', { className: 'card__body' },
        React.createElement('table', { className: 'table' }, [
          React.createElement('thead', { key: 'thead' },
            React.createElement('tr', null, [
              React.createElement('th', { key: 'date' }, 'Date'),
              React.createElement('th', { key: 'title' }, 'Title'),
              React.createElement('th', { key: 'impact' }, 'Impact'),
              React.createElement('th', { key: 'status' }, 'Status'),
              React.createElement('th', { key: 'actions' }, 'Actions')
            ])
          ),
          React.createElement('tbody', { key: 'tbody' },
            state.performance.directives.map(directive =>
              React.createElement('tr', { key: directive.id }, [
                React.createElement('td', { key: 'date' }, directive.ts),
                React.createElement('td', { key: 'title' }, directive.title),
                React.createElement('td', { key: 'impact' }, directive.impact),
                React.createElement('td', { key: 'status' }, 
                  React.createElement('span', { 
                    className: `status ${directive.success ? 'status--success' : 'status--warning'}` 
                  }, directive.success ? '✓ Complete' : '⏳ Pending')
                ),
                React.createElement('td', { key: 'actions' }, [
                  React.createElement('button', {
                    key: 'toggle',
                    type: 'button',
                    className: 'btn btn--outline btn--sm',
                    onClick: () => toggleSuccess(directive.id),
                    style: { marginRight: 'var(--space-4)' }
                  }, 'Toggle'),
                  React.createElement('button', {
                    key: 'delete',
                    type: 'button',
                    className: 'btn btn--danger btn--sm',
                    onClick: () => deleteDirective(directive.id)
                  }, 'Delete')
                ])
              ])
            )
          )
        ])
      )
    ]),

    showModal && React.createElement('div', { key: 'modal', className: 'modal' },
      React.createElement('div', { className: 'modal-content' }, [
        React.createElement('div', { className: 'modal-header' }, [
          React.createElement('h3', null, 'Add Directive'),
          React.createElement('button', { 
            className: 'btn btn--secondary btn--sm', 
            type: 'button',
            onClick: () => setShowModal(false) 
          }, '×')
        ]),
        React.createElement('form', { onSubmit: handleAdd },
          React.createElement('div', { className: 'modal-body' }, [
            React.createElement('input', {
              type: 'text',
              className: 'form-control',
              placeholder: 'Directive Title',
              style: { marginBottom: 'var(--space-8)' },
              value: form.title,
              onChange: (e) => setForm({ ...form, title: e.target.value }),
              required: true
            }),
            React.createElement('textarea', {
              className: 'form-control',
              placeholder: 'Description',
              rows: 3,
              style: { marginBottom: 'var(--space-8)' },
              value: form.description,
              onChange: (e) => setForm({ ...form, description: e.target.value })
            }),
            React.createElement('select', {
              className: 'form-control',
              value: form.impact,
              onChange: (e) => setForm({ ...form, impact: e.target.value })
            }, [
              React.createElement('option', { key: 'low', value: 'Low' }, 'Low Impact'),
              React.createElement('option', { key: 'medium', value: 'Medium' }, 'Medium Impact'),
              React.createElement('option', { key: 'high', value: 'High' }, 'High Impact'),
              React.createElement('option', { key: 'critical', value: 'Critical' }, 'Critical Impact')
            ])
          ]),
          React.createElement('div', { className: 'modal-footer' },
            React.createElement('button', { className: 'btn btn--primary', type: 'submit' }, 'Add Directive')
          )
        )
      ])
    )
  ]);
}

/*****************************************************************************************
 SIDEBAR COMPONENT
*****************************************************************************************/
function Sidebar({ currentPage, onNavigate }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'resources', label: 'Resources', icon: '⚔️' },
    { id: 'position', label: 'Position & Risk', icon: '📈' },
    { id: 'delegates', label: 'Delegates', icon: '🏛️' },
    { id: 'strategy', label: 'Strategy', icon: '🎯' },
    { id: 'documents', label: 'Documents', icon: '📂' },
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'performance', label: 'Performance', icon: '📋' }
  ];

  return React.createElement('aside', { className: 'sidebar' }, [
    React.createElement('div', { key: 'header', style: { padding: 'var(--space-16)', borderBottom: '1px solid var(--color-border)' } }, [
      React.createElement('h2', { style: { margin: 0, color: 'var(--color-primary)', fontSize: 'var(--font-size-lg)' } }, 'Egypt Crisis Command'),
      React.createElement('p', { style: { margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' } }, 'Enhanced Dashboard')
    ]),
    ...menuItems.map(item =>
      React.createElement('button', {
        key: item.id,
        type: 'button',
        className: currentPage === item.id ? 'active' : '',
        onClick: () => onNavigate(item.id)
      }, `${item.icon} ${item.label}`)
    )
  ]);
}

/*****************************************************************************************
 MAIN APP COMPONENT
*****************************************************************************************/
function App() {
  const [state, dispatch] = useReducer(reducer, null, loadFromStorage);
  const toast = useToast();
  const { lastSaved, saving } = useAutoSave(state);
  const fileImportRef = useRef();

  // Load data on mount
  useEffect(() => {
    const savedState = loadFromStorage();
    dispatch({ type: 'LOAD_STATE', state: savedState });
  }, []);

  const handleExport = () => {
    exportData(state);
    toast('Data exported successfully');
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        dispatch({ type: 'LOAD_STATE', state: importedData });
        saveToStorage(importedData);
        toast('Data imported successfully');
      } catch (error) {
        toast('Failed to import data - invalid file format', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const renderCurrentPage = () => {
    const pages = {
      overview: Overview,
      resources: Resources,
      position: PositionRisk,
      delegates: Delegates,
      strategy: Strategy,
      documents: Documents,
      notes: Notes,
      performance: Performance
    };

    const PageComponent = pages[state.currentPage];
    return PageComponent ? React.createElement(PageComponent, { state, dispatch }) : null;
  };

  return React.createElement('div', { className: 'app-layout' }, [
    React.createElement(Sidebar, {
      key: 'sidebar',
      currentPage: state.currentPage,
      onNavigate: (page) => dispatch({ type: 'NAV', page })
    }),
    React.createElement('main', { key: 'content', className: 'content' }, [
      React.createElement('div', { key: 'data-actions', className: 'data-actions' }, [
        React.createElement('button', { 
          className: 'btn btn--secondary btn--sm', 
          type: 'button',
          onClick: handleExport 
        }, '📤 Export Data'),
        React.createElement('button', { 
          className: 'btn btn--secondary btn--sm', 
          type: 'button',
          onClick: () => fileImportRef.current?.click()
        }, '📥 Import Data'),
        React.createElement('input', { 
          ref: fileImportRef,
          type: 'file', 
          accept: '.json', 
          onChange: handleImport, 
          style: { display: 'none' } 
        }),
        lastSaved && React.createElement('span', { 
          style: { 
            fontSize: 'var(--font-size-sm)', 
            color: 'var(--color-text-secondary)',
            alignSelf: 'center'
          } 
        }, `Last saved: ${lastSaved.toLocaleTimeString()}`)
      ]),
      renderCurrentPage()
    ]),
    saving && React.createElement('div', { key: 'saving', className: 'auto-save-indicator visible' }, 'Saving...')
  ]);
}

/*****************************************************************************************
 INITIALIZE APP
*****************************************************************************************/
window.addEventListener('DOMContentLoaded', () => {
  // Set PDF.js worker
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(ToastProvider, null, React.createElement(App)));
});