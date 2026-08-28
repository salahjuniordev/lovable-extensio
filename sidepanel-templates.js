// ============================================================
// Lovable Pro - Side Panel Templates (Static/HTML)
// Separated from business logic for easier maintenance
// ============================================================

const SP_SVG = {
  sparkles: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
  mic: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',
  wrench: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  edit: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  shield: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  zap: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  msgSq: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  trendUp: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  palette: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="0.5"/><circle cx="17.5" cy="10.5" r="0.5"/><circle cx="8.5" cy="7.5" r="0.5"/><circle cx="6.5" cy="12" r="0.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
  box: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
  search: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  lock: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  logOut: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  key: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
  paperclip: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
  globe: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  cloud: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
  trash: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
  file: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>',
  checkCircle: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  xCircle: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  xMark: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 12 9 17 20 7"/></svg>',
  bell: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  clock: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  arrowLeft: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  alertTriangle: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  clipboard: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>',
  link: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  folder: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  download: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  refresh: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
  pkg: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
};

const SP_TEMPLATES = [
  { icon: SP_SVG.wrench, label: "Bugs", prompt: "Analyze the code and identify all bugs, errors, and failures. Fix each one and explain the problem and the solution applied." },
  { icon: SP_SVG.edit, label: "Refactor", prompt: "Create a complete step-by-step refactoring and system optimization plan." },
  { icon: SP_SVG.shield, label: "Errors", prompt: "Implement robust error handling throughout the code." },
  { icon: SP_SVG.zap, label: "Optimize", prompt: "Analyze and optimize system performance." },
  { icon: SP_SVG.msgSq, label: "Comments", prompt: "Add clear comments and documentation throughout the code." },
  { icon: SP_SVG.trendUp, label: "SEO", prompt: "Create a complete SEO creation and optimization plan for this website." },
  { icon: SP_SVG.palette, label: "UI", prompt: "Improve the user interface, making it more modern, responsive, and accessible." },
  { icon: SP_SVG.box, label: "Components", prompt: "Reorganize the code into reusable components." },
  { icon: SP_SVG.search, label: "Review", prompt: "Perform a complete code review, identifying quality, security, and performance issues." }
];

function spEscapeHtml(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = String(s);
  return d.innerHTML;
}

function spSanitizeUrl(url) {
  if (!url) return '';
  try {
    const p = new URL(url);
    return (p.protocol === 'http:' || p.protocol === 'https:') ? url : '';
  } catch(e) { return ''; }
}

function spTemplateLicenseGate() {
  return '<div class="sp-license-gate">' +
    '<div class="sp-lock-icon">' + SP_SVG.lock + '</div>' +
    '<p class="sp-gate-title">Activate License</p>' +
    '<p class="sp-gate-desc">Enter your license key to activate your Lovable Pro access.</p>' +
    '<input class="sp-input" id="sp-license-input" placeholder="Your license key" spellcheck="false">' +
    '<button class="sp-btn-primary" id="sp-validate-btn">Validate License</button>' +
    '<div class="sp-log" id="sp-license-log"></div>' +
  '</div>';
}

function spTemplateMainUI(greeting, statusBadge) {
  return '<div id="sp-update-banner" style="display:none"></div>' +
    '<div class="sp-agent-bar">' +
      '<div class="sp-agent-left">' +
        '<span class="sp-agent-dot"></span>' +
        '<span class="sp-profile-name" id="sp-name">' + greeting + '</span>' +
        statusBadge +
      '</div>' +
      '<div class="sp-sync-status" id="sp-sync">' + SP_SVG.clock + ' Waiting...</div>' +
    '</div>' +
    '<div class="sp-trial-countdown" id="sp-countdown" style="display:none"></div>' +
    '<div class="sp-composer">' +
      '<textarea class="sp-textarea" id="sp-msg" rows="4" placeholder="Describe what you want to build or fix..." spellcheck="false"></textarea>' +
      '<div id="sp-attach-preview" class="sp-attach-preview" style="display:none"></div>' +
      '<div class="sp-composer-bar">' +
        '<div class="sp-composer-left">' +
          '<label class="sp-toggle"><input type="checkbox" id="sp-modo-plano"><span class="sp-toggle-slider"></span></label>' +
          '<span class="sp-toggle-label">Plan</span>' +
          '<span class="sp-composer-sep"></span>' +
          '<button class="sp-attach-btn" id="sp-attach-btn" title="Attach file">' + SP_SVG.paperclip + '</button>' +
          '<button class="sp-tool-btn" id="sp-optimize" title="AI enhance">' + SP_SVG.sparkles + '</button>' +
          '<button class="sp-tool-btn" id="sp-speech" title="Voice">' + SP_SVG.mic + '</button>' +
        '</div>' +
        '<button class="sp-send-btn" id="sp-send">Send</button>' +
      '</div>' +
    '</div>' +
    '<input type="file" id="sp-file-input" multiple style="display:none" accept="*/*">' +
    '<div class="sp-log" id="sp-log"></div>' +
    '<div class="sp-section">' +
      '<span class="sp-section-label">Quick Actions</span>' +
      '<div class="sp-shortcuts-grid" id="sp-chips"></div>' +
    '</div>' +
    '<div class="sp-feature-list">' +
      '<button id="sp-remove-watermark" class="sp-watermark-btn">' + SP_SVG.xCircle + ' Remove Watermark</button>' +
      '<button id="sp-publish-project" class="sp-watermark-btn sp-btn-feature sp-btn-publish">' + SP_SVG.globe + ' Publish Project</button>' +
      '<button id="sp-enable-cloud" class="sp-watermark-btn sp-btn-feature sp-btn-cloud">' + SP_SVG.cloud + ' Enable Lovable Cloud</button>' +
    '</div>' +
    '<div id="sp-reseller-btn" style="display:none;margin-bottom:14px"></div>';
}

function spTemplateStatusBadge(status) {
  if (status === 'trial') {
    return '<span class="sp-status-badge sp-badge-test">FREE</span>';
  }
  return '<span class="sp-status-badge sp-badge-pro">FREE</span>';
}

function spTemplateAlert(title, message) {
  return '<div class="sp-alert-box">' +
    '<div class="sp-alert-icon">' + SP_SVG.checkCircle + '</div>' +
    '<div class="sp-alert-title">' + spEscapeHtml(title) + '</div>' +
    '<div class="sp-alert-message">' + spEscapeHtml(message) + '</div>' +
    '<button class="sp-alert-ok">OK</button>' +
  '</div>';
}

function spTemplateNotifItem(n) {
  const date = new Date(n.created_at).toLocaleDateString('en-US');
  const safeLink = spSanitizeUrl(n.link);
  const linkHtml = safeLink
    ? '<a href="' + spEscapeHtml(safeLink) + '" target="_blank" rel="noopener noreferrer" class="sp-notif-link">Open link →</a>'
    : '';
  return '<div class="sp-notif-item">' +
    '<div class="sp-notif-item-title">' + spEscapeHtml(n.title) + '</div>' +
    '<div class="sp-notif-item-msg">' + spEscapeHtml(n.message) + '</div>' +
    linkHtml +
    '<div class="sp-notif-item-date">' + date + '</div>' +
  '</div>';
}

function spTemplateUpdateBanner(version, changelog, dlUrl) {
  return '<div class="pk-update-banner">' +
    '<div class="pk-update-banner-head">' +
      '<span style="font-size:14px">' + SP_SVG.bell + '</span>' +
      '<strong class="pk-update-banner-title">New update v' + version + '!</strong>' +
    '</div>' +
    '<p class="pk-update-banner-text">' + (changelog || '') + '</p>' +
    (dlUrl ? '<a href="' + dlUrl + '" target="_blank" rel="noopener noreferrer" class="pk-update-banner-dl">Download v' + version + '</a>' : '') +
  '</div>';
}

function spTemplateCountdown(label, timeStr, pct, urgentClass) {
  return '<div class="sp-countdown-row">' +
    '<span>' + SP_SVG.clock + '</span>' +
    '<span class="sp-countdown-label">' + label + '</span>' +
    '<span class="sp-countdown-time">' + timeStr + '</span>' +
  '</div>' +
  '<div class="sp-trial-bar">' +
    '<div class="sp-trial-bar-fill' + urgentClass + '" style="width:' + pct + '%"></div>' +
  '</div>';
}

function spTemplateAttachItem(f, index) {
  const thumb = f.previewUrl
    ? '<img class="sp-attach-thumb" src="' + f.previewUrl + '" alt="">'
    : '<div class="sp-attach-icon">' + SP_SVG.file + '</div>';
  return '<div class="sp-attach-item' + (f.uploading ? ' sp-attach-uploading' : '') + '">' +
    thumb +
    '<div class="sp-attach-info">' +
      '<span class="sp-attach-name" title="' + spEscapeHtml(f.file_name) + '">' + spEscapeHtml(f.file_name) + '</span>' +
      '<span class="sp-attach-size">' + spEscapeHtml(f.sizeLabel) + '</span>' +
    '</div>' +
    '<button class="sp-attach-remove" data-idx="' + index + '">' + SP_SVG.xMark + '</button>' +
  '</div>';
}

function spFormatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ========== Chat History Templates ==========
function spTemplateTabs(activeTab, msgCount) {
  var countBadge = msgCount > 0 ? '<span class="sp-tab-badge">' + msgCount + '</span>' : '';
  return '<div class="sp-tabs">' +
    '<button class="sp-tab' + (activeTab === 'prompt' ? ' sp-tab-active' : '') + '" data-tab="prompt">' +
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' +
      ' Prompt' +
    '</button>' +
    '<button class="sp-tab' + (activeTab === 'history' ? ' sp-tab-active' : '') + '" data-tab="history">' +
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
      ' History ' + countBadge +
    '</button>' +
  '</div>';
}

function spTemplateChatEmpty() {
  return '<div class="sp-chat-empty">' +
    '<div class="sp-chat-empty-icon">' + SP_SVG.msgSq + '</div>' +
    '<div class="sp-chat-empty-title">No messages</div>' +
    '<div class="sp-chat-empty-desc">Your sent prompts will appear here as history.</div>' +
  '</div>';
}

function spFormatChatDate(dateStr) {
  var d = new Date(dateStr);
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var msgDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  var diff = (today - msgDay) / 86400000;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()];
  return d.toLocaleDateString('en-US');
}

function spFormatChatTime(dateStr) {
  var d = new Date(dateStr);
  return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}

function spTemplateChatBubble(msg) {
  var statusClass = msg.status === 'error' ? 'sp-chat-status-err' : 'sp-chat-status-ok';
  var statusText = msg.status === 'error' ? SP_SVG.xMark + ' Error' : SP_SVG.check + ' Sent';
  var truncated = msg.text.length > 300 ? spEscapeHtml(msg.text.substring(0, 300)) + '…' : spEscapeHtml(msg.text);
  return '<div class="sp-chat-bubble" title="' + spEscapeHtml(msg.text) + '">' +
    truncated +
    '<div class="sp-chat-meta">' +
      '<span class="sp-chat-status ' + statusClass + '">' + statusText + '</span>' +
      '<span class="sp-chat-time">' + spFormatChatTime(msg.timestamp) + '</span>' +
      '<span class="sp-chat-check">' + SP_SVG.check + SP_SVG.check + '</span>' +
    '</div>' +
  '</div>';
}

function spTemplateChatHistory(messages) {
  if (!messages || !messages.length) return spTemplateChatEmpty();
  var html = '<div class="sp-chat-messages">';
  var lastDate = '';
  for (var i = 0; i < messages.length; i++) {
    var m = messages[i];
    var dateLabel = spFormatChatDate(m.timestamp);
    if (dateLabel !== lastDate) {
      html += '<div class="sp-chat-date-divider"><span class="sp-chat-date-label">' + dateLabel + '</span></div>';
      lastDate = dateLabel;
    }
    html += spTemplateChatBubble(m);
  }
  html += '</div>';
  html += '<div class="sp-chat-actions">' +
    '<span class="sp-chat-count">' + messages.length + ' message' + (messages.length === 1 ? '' : 's') + '</span>' +
    '<button class="sp-chat-clear" id="sp-chat-clear">' + SP_SVG.trash + ' Clear History</button>' +
  '</div>';
  return html;
}
