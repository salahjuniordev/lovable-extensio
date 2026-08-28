// ============================================
// Lovable Pro – HTML Templates (content)
// Separated from business logic (content.js)
// ============================================

const SVG_ICONS = {
  wrench: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  edit: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  shield: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  zap: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  msgSquare: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  trendUp: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  palette: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="0.5"/><circle cx="17.5" cy="10.5" r="0.5"/><circle cx="8.5" cy="7.5" r="0.5"/><circle cx="6.5" cy="12" r="0.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
  box: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  search: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  bell: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  moon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  mic: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',
  refresh: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
  headphones: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
  sparkles: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
  sidePanel: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>',
  lock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  logOut: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  key: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
  paperclip: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
  globe: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  cloud: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
  trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
  folder: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  file: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>',
  download: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  pkg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  link: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  settings: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  arrowLeft: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12 9 17 20 7"/></svg>',
  xMark: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  checkCircle: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  xCircle: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  alertTriangle: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  award: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>',
  minus: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  radio: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/></svg>',
  archive: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',
  send: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  infinity: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z"/><path d="M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z"/></svg>',
  clipboard: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>',
};

var QL_DISCORD_SUPPORT = "";

const PROMPT_TEMPLATES = [
  { icon: SVG_ICONS.wrench, label: "Bugs", prompt: "Analyze the code and identify all bugs, errors, and failures. Fix each one and explain the problem and the solution applied." },
  { icon: SVG_ICONS.edit, label: "Refactor", prompt: "Create a complete step-by-step refactoring and system optimization plan." },
  { icon: SVG_ICONS.shield, label: "Errors", prompt: "Implement robust error handling throughout the code, including try/catch blocks, validations, and user-friendly error messages." },
  { icon: SVG_ICONS.zap, label: "Optimize", prompt: "Analyze and optimize system performance by identifying bottlenecks, improving queries, reducing re-renders, and applying best practices." },
  { icon: SVG_ICONS.msgSquare, label: "Comments", prompt: "Add clear comments and documentation throughout the code, explaining the logic, parameters, and return values of each function." },
  { icon: SVG_ICONS.trendUp, label: "SEO", prompt: "Create a complete SEO creation and optimization plan for this website. Include: meta tag analysis (title, description, og:image), heading structure (H1-H6), sitemap.xml, robots.txt, structured data (JSON-LD), performance (Core Web Vitals), accessibility, friendly URLs, canonical tags, image alt text, lazy loading, and internal link-building strategies. Implement all identified improvements." },
  { icon: SVG_ICONS.palette, label: "UI", prompt: "Improve the user interface, making it more modern, responsive, and accessible while following UX/UI best practices." },
  { icon: SVG_ICONS.box, label: "Components", prompt: "Reorganize the code into reusable, well-structured components with single responsibilities." },
  { icon: SVG_ICONS.search, label: "Review", prompt: "Perform a complete code review, identifying quality, security, and performance issues and suggesting improvements." },
];

// ---- Template: License Gate ----
function templateLicenseGate(minimized) {
  return '<div id="ql-header">' +
    '<div class="ql-header-left">' +
      '<span class="ql-dot"></span>' +
      '<img class="ql-title-logo" src="' + chrome.runtime.getURL('assets/logo.png') + '" alt=""><span class="ql-title">Lovable Pro</span>' +
    '</div>' +
    '<div class="ql-header-right">' +
       '<span class="ql-badge">v' + extensionVersionShort() + '</span>' +
      '<button id="ql-minimize" class="ql-minimize-btn">' + (minimized ? '□' : '−') + '</button>' +
    '</div>' +
  '</div>' +
  '<div id="ql-body">' +
    '<div class="ql-license-gate">' +
      '<div class="ql-lock-icon">' + SVG_ICONS.lock + '</div>' +
      '<p class="ql-gate-title">Activate License</p>' +
      '<p class="ql-gate-desc">Enter your license key to activate your Lovable Pro access.</p>' +
      '<div class="ql-field">' +
        '<input id="ql-license-input" placeholder="Your license key" spellcheck="false">' +
      '</div>' +
      '<button id="ql-validate-btn">Validate License</button>' +
      '<div id="ql-license-log"></div>' +
    '</div>' +
  '</div>' +
  '<div id="ql-resize-handle" class="ql-resize-handle"></div>';
}

// ---- Template: Main UI ----
function templateMainUI(greeting, statusBadge, minimized) {
  return '<div id="ql-header">' +
    '<div class="ql-header-left">' +
      '<span class="ql-brand"><img class="ql-brand-logo" src="' + chrome.runtime.getURL('assets/logo.png') + '" alt=""><span>Lovable Pro</span></span>' +
    '</div>' +
    '<div class="ql-header-right">' +
      '<button id="ql-sidepanel-btn" class="ql-icon-btn" title="Open in Side Panel">' + SVG_ICONS.sidePanel + '</button>' +
      '<button class="ql-icon-btn" title="Theme">' + SVG_ICONS.moon + '</button>' +
      '<button id="ql-minimize" class="ql-icon-btn">' + (minimized ? '□' : '−') + '</button>' +
    '</div>' +
  '</div>' +
  '<div id="ql-body">' +
    '<div id="ql-update-banner" style="display:none"></div>' +
    '<div class="ql-agent-bar">' +
      '<div class="ql-agent-left">' +
        '<span class="ql-agent-dot"></span>' +
        '<span class="ql-profile-name">' + escapeHtml(greeting) + '</span>' +
        statusBadge +
      '</div>' +
      '<div id="ql-sync-status" class="ql-sync-status ql-sync-waiting">' +
        '<span class="ql-sync-text">' + SVG_ICONS.clock + ' Waiting...</span>' +
      '</div>' +
    '</div>' +
    '<div class="ql-project-bar" id="ql-project-bar" style="display:none">' +
      SVG_ICONS.folder +
      '<span class="ql-project-name" id="ql-project-name">—</span>' +
    '</div>' +
    '<div id="ql-trial-countdown" class="ql-trial-countdown" style="display:none"></div>' +
    '<div class="ql-tabs" id="ql-tabs">' +
      '<button class="ql-tab ql-tab-active" data-tab="prompt">' + SVG_ICONS.zap + ' Prompt</button>' +
      '<button class="ql-tab" data-tab="history">' + SVG_ICONS.msgSquare + ' History <span class="ql-tab-badge" id="ql-history-badge" style="display:none">0</span></button>' +
    '</div>' +
    '<div id="ql-tab-content">' +
      '<div class="ql-composer">' +
        '<textarea id="ql-msg" rows="4" placeholder="Describe what you want to build or fix..." spellcheck="false"></textarea>' +
        '<div id="ql-attach-preview" class="ql-attach-preview" style="display:none"></div>' +
        '<div class="ql-composer-bar">' +
          '<div class="ql-composer-left">' +
            '<label class="ql-toggle" title="Plan mode">' +
              '<input type="checkbox" id="ql-modo-plano">' +
              '<span class="ql-toggle-slider"></span>' +
            '</label>' +
            '<span class="ql-toggle-label-inline">Plan</span>' +
            '<span class="ql-composer-sep"></span>' +
            '<button id="ql-attach-btn" class="ql-attach-btn" title="Attach file">' + SVG_ICONS.paperclip + '</button>' +
            '<button id="ql-optimize-btn" class="ql-tool-btn" title="AI enhance">' + SVG_ICONS.sparkles + '</button>' +
            '<button id="ql-speech-btn" class="ql-tool-btn" title="Voice to text">' + SVG_ICONS.mic + '</button>' +
          '</div>' +
          '<button id="ql-send" class="ql-send-btn">Send</button>' +
        '</div>' +
      '</div>' +
      '<input type="file" id="ql-file-input" multiple style="display:none" accept="*/*">' +
      '<div id="ql-log"></div>' +
      '<div class="ql-section">' +
        '<span class="ql-section-label">Quick Actions</span>' +
        '<div class="ql-actions-grid" id="ql-chips"></div>' +
      '</div>' +
      '<div class="ql-feature-list">' +
        '<button id="ql-remove-watermark" class="ql-watermark-btn">Remove Watermark</button>' +
        '<button id="ql-shield-btn" class="ql-shield-btn"><span id="ql-shield-label">Enable Shield</span></button>' +
        '<button id="ql-native-chat-btn" class="ql-native-chat-btn">' + SVG_ICONS.msgSquare + ' Use Native Chat</button>' +
        '<button id="ql-download-project" class="ql-watermark-btn sp-btn-feature sp-btn-download">Download Source Code</button>' +
        '<button id="ql-quick-init" class="ql-watermark-btn sp-btn-feature sp-btn-quick-init">Create New Project</button>' +
        '<button id="ql-publish-project" class="ql-watermark-btn sp-btn-feature sp-btn-publish">' + SVG_ICONS.globe + ' Publish Project</button>' +
        '<button id="ql-enable-cloud" class="ql-watermark-btn sp-btn-feature sp-btn-cloud">' + SVG_ICONS.cloud + ' Enable Lovable Cloud</button>' +
        '<div id="ql-download-status" style="display:none"></div>' +
      '</div>' +
    '</div>' +
    '<div id="ql-reseller-btn" style="display:none;margin-bottom:14px"></div>' +
  '</div>' +
  '<div id="ql-footer" class="ql-footer">' +
    '<div class="ql-footer-row">' +
      '<span class="ql-support-link">' + SVG_ICONS.headphones + ' Lovable Pro</span>' +
      '<span class="ql-footer-version">v' + extensionVersionShort() + '</span>' +
    '</div>' +
    '<span class="ql-badge-mz">Lovable Pro · by Shoaib Ahmed</span>' +
  '</div>' +
  '<div id="ql-resize-handle" class="ql-resize-handle"></div>' +
  '<div id="ql-custom-alert" class="ql-custom-alert" style="display:none">' +
    '<div class="ql-alert-content">' +
      '<div class="ql-alert-icon">' + SVG_ICONS.checkCircle + '</div>' +
      '<div class="ql-alert-title">Success!</div>' +
      '<div class="ql-alert-message"></div>' +
      '<button class="ql-alert-ok-btn">OK</button>' +
    '</div>' +
  '</div>';
}

// ---- Template: Expired License Overlay ----
function templateExpiredOverlay() {
  return '<div class="ql-sweetalert-box">' +
    '<div class="ql-sweetalert-icon">' + SVG_ICONS.clock + '</div>' +
    '<h2 class="ql-sweetalert-title">License Expired!</h2>' +
    '<p class="ql-sweetalert-text">Your license has expired. Please renew it to continue using Lovable Pro.</p>' +
    '<div class="ql-sweetalert-actions">' +
      '<button class="ql-sweetalert-btn ql-sweetalert-btn-primary" id="ql-sweetalert-renew">' + SVG_ICONS.key + ' Renew License</button>' +
      '<button class="ql-sweetalert-btn ql-sweetalert-btn-secondary" id="ql-sweetalert-close">Close</button>' +
    '</div>' +
  '</div>';
}

function qlTemplateUpdateBanner(version, changelog, dlUrl) {
  return '<div class="pk-update-banner">' +
    '<div class="pk-update-banner-head">' +
      '<span style="font-size:14px">' + SVG_ICONS.bell + '</span>' +
      '<strong class="pk-update-banner-title">New update v' + version + '!</strong>' +
    '</div>' +
    '<p class="pk-update-banner-text">' + (changelog || '') + '</p>' +
    (dlUrl ? '<a href="' + dlUrl + '" target="_blank" rel="noopener noreferrer" class="pk-update-banner-dl">Download v' + version + '</a>' : '') +
  '</div>';
}

function templateWelcomeNote() {
  return '<div id="ql-welcome-overlay" class="ql-welcome-overlay">' +
    '<div class="ql-welcome-card">' +
      '<div class="ql-welcome-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg></div>' +
      '<h2 class="ql-welcome-title">Welcome to Lovable Pro</h2>' +
      '<p class="ql-welcome-sub">by Shoaib Ahmed</p>' +
      '<p class="ql-welcome-desc">Your AI development co-pilot is ready. What should we call you?</p>' +
      '<input id="ql-welcome-name" class="ql-welcome-input" type="text" placeholder="Your name..." autocomplete="off" spellcheck="false" maxlength="40">' +
      '<button id="ql-welcome-start" class="ql-welcome-btn">Get Started</button>' +
      '<button id="ql-welcome-close" class="ql-welcome-skip">Skip for now</button>' +
    '</div>' +
  '</div>';
}

// ---- Template: Payment UI (packages list) ----
var BRL_TO_MZN = 12.6;
var QL_BRL_PLANS = [
  { name: "Weekly",  price: "49,90",  period: "per week",      popular: false, badge: "7d",  icon: SVG_ICONS.zap,
    features: ["Full extension access", "Plan Mode workflow", "Priority support"] },
  { name: "Monthly",   price: "97,90",  period: "per month",    popular: true,  badge: "30d", icon: SVG_ICONS.award,
    features: ["Everything in Weekly", "Best value", "Priority support"] },
  { name: "Lifetime", price: "149,90", period: "one-time payment", popular: false, badge: "∞", icon: SVG_ICONS.infinity,
    features: ["Permanent access", "Lifetime updates", "Priority VIP support"] }
];
function qlFmtMzn(brl) {
  var n = parseFloat(String(brl).replace(",", ".")) * BRL_TO_MZN;
  if (!isFinite(n)) return "0";
  return Math.round(n).toLocaleString("en-US");
}
function templateBrlCard(plan, idx) {
  var features = plan.features.map(function(f){ return '<li>' + escapeHtml(f) + '</li>'; }).join('');
  var popular = plan.popular ? '<span class="ql-pkg-popular">' + SVG_ICONS.star + ' POPULAR</span>' : '';
  return '<div class="ql-pkg-card ql-pkg-brl' + (plan.popular ? ' ql-pkg-highlight' : '') + '" data-brl-idx="' + idx + '">' +
    popular +
    '<div class="ql-pkg-name">' + plan.icon + ' ' + escapeHtml(plan.name) + '</div>' +
    '<div class="ql-pkg-price">R$ ' + escapeHtml(plan.price) + '</div>' +
    '<div class="ql-pkg-mzn">≈ ' + qlFmtMzn(plan.price) + ' MZN <span>(approx. exchange rate)</span></div>' +
    '<div class="ql-pkg-duration">' + escapeHtml(plan.period) + '</div>' +
    '<ul class="ql-pkg-features">' + features + '</ul>' +
    '<button class="ql-pkg-select-btn ql-brl-buy">' + SVG_ICONS.key + ' Get This Plan</button>' +
  '</div>';
}
function templateBrlSection() {
  var cards = QL_BRL_PLANS.map(function(p, i){ return templateBrlCard(p, i); }).join('');
  return '<div class="ql-pay-divider"><span>Available Plans</span></div>' +
    '<div class="ql-packages-list ql-brl-list">' + cards + '</div>';
}
function templatePaymentUI(minimized) {
  return '<div id="ql-header">' +
    '<div class="ql-header-left">' +
      '<span class="ql-brand"><img class="ql-brand-logo" src="' + chrome.runtime.getURL('assets/logo.png') + '" alt=""><span>Lovable Pro</span></span>' +
    '</div>' +
    '<div class="ql-header-right">' +
      '<button id="ql-pay-back" class="ql-icon-btn" title="Back">' + SVG_ICONS.arrowLeft + '</button>' +
      '<button id="ql-minimize" class="ql-icon-btn">' + (minimized ? '□' : '−') + '</button>' +
    '</div>' +
  '</div>' +
  '<div id="ql-body">' +
    '<div class="ql-pay-section">' +
      '<div class="ql-pay-title">Choose a Plan</div>' +
      templateBrlSection() +
      '<div class="ql-pay-divider"><span>All Plans</span></div>' +
      '<div id="ql-packages-list" class="ql-packages-list">' +
        '<div class="ql-pay-loading">' + SVG_ICONS.clock + ' Loading plans...</div>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<div id="ql-resize-handle" class="ql-resize-handle"></div>';
}

// ---- Template: Package Card ----
function templatePackageCard(pkg) {
  const popular = pkg.is_popular ? '<span class="ql-pkg-popular">' + SVG_ICONS.star + ' POPULAR</span>' : '';
  const duration = pkg.duration_days ? escapeHtml(String(pkg.duration_days)) + ' days' : 'Permanent';
  const features = (pkg.features || []).map(function(f) { return '<li>' + escapeHtml(f) + '</li>'; }).join('');
  return '<div class="ql-pkg-card' + (pkg.is_popular ? ' ql-pkg-highlight' : '') + '" data-pkg-id="' + escapeHtml(pkg.id) + '" data-pkg-name="' + escapeHtml(pkg.name) + '" data-pkg-price="' + '' + '">' +
    popular +
    '<div class="ql-pkg-name">' + escapeHtml(pkg.name) + '</div>' +
    '<div class="ql-pkg-price">' + '' + '</div>' +
    '<div class="ql-pkg-duration">' + duration + '</div>' +
    '<ul class="ql-pkg-features">' + features + '</ul>' +
    '<button class="ql-pkg-select-btn">' + SVG_ICONS.key + ' Select Plan</button>' +
  '</div>';
}

// ---- Template: Checkout Screen ----
function templateCheckoutScreen(pkg, minimized) {
  return '<div id="ql-header">' +
    '<div class="ql-header-left">' +
      '<span class="ql-brand"><img class="ql-brand-logo" src="' + chrome.runtime.getURL('assets/logo.png') + '" alt=""><span>Lovable Pro</span></span>' +
    '</div>' +
    '<div class="ql-header-right">' +
      '<button id="ql-checkout-back" class="ql-icon-btn" title="Back">' + SVG_ICONS.arrowLeft + '</button>' +
      '<button id="ql-minimize" class="ql-icon-btn">' + (minimized ? '□' : '−') + '</button>' +
    '</div>' +
  '</div>' +
  '<div id="ql-body">' +
    '<div class="ql-pay-section" style="text-align:center">' +
      '<div class="ql-pay-title">Activate License Key</div>' +
      '<div class="ql-selected-pkg">' + SVG_ICONS.pkg + ' <strong>' + escapeHtml(pkg.name || 'Selected plan') + '</strong></div>' +
      '<p style="color:var(--ql-text-secondary);font-size:12px;line-height:1.5;margin:10px 0 16px">Enter your license key below to activate this plan.</p>' +
      '<button id="ql-confirm-pay" class="ql-buy-btn" style="font-size:12px;width:100%">' + SVG_ICONS.key + ' Activate Now</button>' +
      '<div id="ql-pay-log" class="ql-pay-log"></div>' +
    '</div>' +
  '</div>' +
  '<div id="ql-resize-handle" class="ql-resize-handle"></div>';
}

// ---- Template: Payment Success ----
function templatePaymentSuccess(licenseKey) {
  return '<div class="ql-pay-section" style="text-align:center;padding:24px 16px">' +
    '<div style="margin-bottom:12px;color:#667eea"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg></div>' +
    '<div class="ql-pay-title">License Activated!</div>' +
    '<p style="color:var(--ql-muted);font-size:12px;margin:8px 0 16px">Your license was activated successfully.</p>' +
    '<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px;margin-bottom:12px">' +
      '<p style="font-size:10px;color:var(--ql-muted);margin-bottom:4px">Your license key</p>' +
      '<p id="ql-new-key" style="font-family:monospace;font-size:13px;color:var(--ql-accent);font-weight:600;word-break:break-all">' + escapeHtml(licenseKey) + '</p>' +
    '</div>' +
    '<button id="ql-copy-key" class="ql-confirm-pay-btn" style="margin-bottom:8px">' + SVG_ICONS.clipboard + ' Copy Key</button>' +
    '<p style="font-size:10px;color:var(--ql-muted);margin-bottom:12px">Paste the key above to activate the extension.</p>' +
    '<button id="ql-activate-key" class="ql-buy-btn" style="font-size:12px">' + SVG_ICONS.key + ' Activate Now</button>' +
  '</div>';
}
