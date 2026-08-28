// ============================================================
// Lovable Pro v2.0 — Page Hook (MAIN world)
// ============================================================
// Runs in the page's JS context at document_start.
// Intercepts WebSocket, applies credit bypass, extracts tokens.
// ============================================================
(function () {
  "use strict";

  var BYPASS_STORAGE_KEY = "__ql_bypass_active";
  var BYPASS_ATTR = "data-ql-bypass";
  var _bypassActive = false;
  var _wsIntercepted = false;
  var _creditChecksIntercepted = false;

  // ---- Bypass Management ----
  function isBypassActive() {
    if (_bypassActive) return true;
    try {
      if (localStorage.getItem(BYPASS_STORAGE_KEY) === "1") { _bypassActive = true; return true; }
    } catch (e) {}
    try {
      if (document.documentElement.getAttribute(BYPASS_ATTR) === "1") { _bypassActive = true; return true; }
    } catch (e) {}
    return false;
  }

  function activateBypass() {
    _bypassActive = true;
    try { localStorage.setItem(BYPASS_STORAGE_KEY, "1"); } catch (e) {}
    try { document.documentElement.setAttribute(BYPASS_ATTR, "1"); } catch (e) {}
    try { window.postMessage({ type: "qlBypassState", active: true }, "*"); } catch (e) {}
  }

  function deactivateBypass() {
    _bypassActive = false;
    try { localStorage.removeItem(BYPASS_STORAGE_KEY); } catch (e) {}
    try { document.documentElement.removeAttribute(BYPASS_ATTR); } catch (e) {}
    try { window.postMessage({ type: "qlBypassState", active: false }, "*"); } catch (e) {}
  }

  // ---- Bypass Guard — auto-reapply if cleared ----
  function setupBypassGuard() {
    if (typeof MutationObserver !== "undefined" && document.documentElement) {
      var obs = new MutationObserver(function () {
        if (_bypassActive && !isBypassActive()) activateBypass();
      });
      obs.observe(document.documentElement, { attributes: true, attributeFilter: [BYPASS_ATTR] });
    }
    window.addEventListener("storage", function (e) {
      if (e.key === BYPASS_STORAGE_KEY && e.newValue === "1" && !_bypassActive) activateBypass();
    });
  }

  // ---- Credit Check Interception ----
  function interceptCreditChecks() {
    if (_creditChecksIntercepted) return;
    _creditChecksIntercepted = true;

    var origFetch = window.fetch;
    window.fetch = function () {
      var url = arguments[0];
      var urlStr = typeof url === "string" ? url : (url && url.url) || "";
      if (isBypassActive() && /credit|balance|quota|usage|limit/i.test(urlStr)) {
        return Promise.resolve(new Response(JSON.stringify({ credits: 999999, balance: 999999, unlimited: true, hasCredits: true }), { status: 200, headers: { "Content-Type": "application/json" } }));
      }
      return origFetch.apply(this, arguments);
    };

    var origXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
      this._qlUrl = url;
      return origXHROpen.apply(this, arguments);
    };
    var origXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
      if (isBypassActive() && this._qlUrl && /credit|balance|quota|usage|limit/i.test(this._qlUrl)) {
        Object.defineProperty(this, "status", { value: 200, writable: false });
        Object.defineProperty(this, "readyState", { value: 4, writable: false });
        Object.defineProperty(this, "responseText", { value: JSON.stringify({ credits: 999999, unlimited: true }), writable: false });
        var self = this;
        setTimeout(function () { if (self.onreadystatechange) self.onreadystatechange(); if (self.onload) self.onload(); }, 10);
        return;
      }
      return origXHRSend.apply(this, arguments);
    };

    patchReactCreditState();
  }

  function patchReactCreditState() {
    try {
      var root = document.getElementById("chat-input") || document.getElementById("__next");
      if (!root) return;
      var fiberKey = Object.keys(root).find(function (k) { return k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$"); });
      if (!fiberKey) return;
      var fiber = root[fiberKey];
      var visited = 0;
      while (fiber && visited < 500) {
        visited++;
        if (fiber.memoizedState) {
          var state = fiber.memoizedState;
          while (state) {
            if (state.queue && state.queue.lastRenderedState) {
              var s = state.queue.lastRenderedState;
              if (typeof s === "object" && s !== null && ("credits" in s || "balance" in s || "hasCredits" in s || "creditsRemaining" in s)) {
                try { Object.defineProperty(s, "credits", { value: 999999, configurable: true }); } catch (e) {}
                try { Object.defineProperty(s, "balance", { value: 999999, configurable: true }); } catch (e) {}
                try { Object.defineProperty(s, "hasCredits", { value: true, configurable: true }); } catch (e) {}
                try { Object.defineProperty(s, "creditsRemaining", { value: 999999, configurable: true }); } catch (e) {}
                try { Object.defineProperty(s, "unlimited", { value: true, configurable: true }); } catch (e) {}
              }
            }
            state = state.next;
          }
        }
        fiber = fiber.child || fiber.sibling || fiber.return;
      }
    } catch (e) {}
  }

  // ---- WebSocket Interception ----
  function interceptWebSocket() {
    if (_wsIntercepted) return;
    _wsIntercepted = true;
    var OrigWebSocket = window.WebSocket;

    window.WebSocket = function (url, protocols) {
      var ws = protocols ? new OrigWebSocket(url, protocols) : new OrigWebSocket(url);
      if (url && /lovable|chat|realtime|ws/i.test(url)) {
        var origSend = ws.send.bind(ws);
        ws.send = function (data) {
          if (typeof data === "string" && isBypassActive()) {
            try {
              var p = JSON.parse(data);
              if (p.credits !== undefined) p.credits = 999999;
              if (p.balance !== undefined) p.balance = 999999;
              p.skipCreditCheck = true;
              data = JSON.stringify(p);
            } catch (e) {}
          }
          return origSend(data);
        };
        ws.addEventListener("message", function (ev) {
          try {
            var msg = JSON.parse(ev.data);
            if (msg.token || msg.access_token || msg.accessToken) {
              var tok = msg.token || msg.access_token || msg.accessToken;
              window.postMessage({ type: "lovableTokenFound", token: tok, projectId: projectIdFromUrl() }, "*");
            }
            if (isBypassActive() && (msg.credits !== undefined || msg.balance !== undefined)) {
              msg.credits = 999999; msg.balance = 999999; msg.hasCredits = true; msg.unlimited = true;
            }
          } catch (e) {}
        });
      }
      return ws;
    };
    window.WebSocket.prototype = OrigWebSocket.prototype;
    window.WebSocket.CONNECTING = OrigWebSocket.CONNECTING;
    window.WebSocket.OPEN = OrigWebSocket.OPEN;
    window.WebSocket.CLOSING = OrigWebSocket.CLOSING;
    window.WebSocket.CLOSED = OrigWebSocket.CLOSED;
  }

  // ---- Token Extraction ----
  function extractTokenFromLocalStorage() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i) || "";
        if (key.indexOf("firebase") === -1) continue;
        var raw = localStorage.getItem(key);
        if (!raw) continue;
        var data = JSON.parse(raw);
        if (data && data.stsTokenManager && data.stsTokenManager.accessToken) return data.stsTokenManager.accessToken;
        if (data && data.accessToken) return data.accessToken;
      }
    } catch (e) {}
    return null;
  }

  function findBestToken() {
    var candidates = [extractTokenFromLocalStorage()].filter(Boolean);
    var best = "", bestExp = 0;
    candidates.forEach(function (t) {
      try {
        var raw = t.replace(/^Bearer\s+/i, "").trim();
        var parts = raw.split(".");
        if (parts.length !== 3) return;
        var b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        var padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
        var exp = (JSON.parse(atob(padded)).exp || 0) * 1000;
        if (!best || exp > bestExp) { best = raw; bestExp = exp; }
      } catch (e) {}
    });
    return best;
  }

  // ---- ID Generation ----
  function generateId(prefix) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var id = prefix;
    for (var i = 0; i < 20; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    return id;
  }

  // ---- WebSocket Delivery ----
  function sendViaWebSocket(message) {
    return new Promise(function (resolve, reject) {
      if (!isBypassActive()) { reject(new Error("Bypass not active")); return; }
      var payload = { id: generateId("umsg_"), message: message, files: [], selected_elements: [], chat_only: false, view: "editor", view_description: "", optimisticImageUrls: [], ai_message_id: generateId("aimsg_"), thread_id: "main", current_page: window.location.pathname || "/", current_viewport_width: window.innerWidth || 1280, current_viewport_height: window.innerHeight || 800, current_viewport_dpr: window.devicePixelRatio || 1, model: null, skipCreditCheck: true, unlimited: true };
      var timer = setTimeout(function () { window.removeEventListener("message", handler); reject(new Error("WS timeout")); }, 6000);
      function handler(ev) { if (ev.source !== window || !ev.data) return; if (ev.data.type !== "lovableWsSendResult") return; clearTimeout(timer); window.removeEventListener("message", handler); ev.data.success ? resolve() : reject(new Error(ev.data.error || "WS send failed")); }
      window.addEventListener("message", handler);
      window.postMessage({ type: "lovableSendViaWs", payload: payload }, "*");
    });
  }

  // ---- Native DOM Delivery (fallback) ----
  function sendViaNativeDOM(text) {
    return new Promise(function (resolve, reject) {
      var chatForm = document.querySelector("form#chat-input");
      if (!chatForm) { reject(new Error("Chat form not found")); return; }
      var editor = chatForm.querySelector('[contenteditable="true"]');
      if (!editor) { reject(new Error("Editor not found")); return; }
      var sendBtn = document.getElementById("chatinput-send-message-button");
      if (!sendBtn) { reject(new Error("Send button not found")); return; }
      editor.focus();
      editor.textContent = "";
      document.execCommand("selectAll", false, null);
      document.execCommand("insertText", false, text);
      editor.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, inputType: "insertText", data: text }));
      setTimeout(function () {
        sendBtn.removeAttribute("disabled");
        sendBtn.click();
        resolve();
      }, 200);
    });
  }

  // ---- Deliver Prompt (with retry) ----
  function deliverPrompt(text) {
    return sendViaWebSocket(text).catch(function () {
      return sendViaNativeDOM(text).catch(function () {
        return new Promise(function (r) { setTimeout(r, 1000); }).then(function () { return sendViaNativeDOM(text); });
      });
    });
  }

  function projectIdFromUrl() {
    var m = window.location.pathname.match(/\/projects\/([0-9a-fA-F-]{36})/);
    return m ? m[1] : "";
  }

  // ---- Message Listener ----
  window.addEventListener("message", function (ev) {
    if (ev.source !== window) return;
    var msg = ev.data;
    if (!msg || typeof msg.type !== "string") return;
    if (msg.type === "qlBypassState") { msg.active ? activateBypass() : deactivateBypass(); }
    if (msg.type === "lovableSendViaWs" && msg.payload) {
      deliverPrompt(msg.payload.message || "").then(function () {
        window.postMessage({ type: "lovableWsSendResult", success: true }, "*");
      }).catch(function (err) {
        window.postMessage({ type: "lovableWsSendResult", success: false, error: err.message }, "*");
      });
    }
    if (msg.type === "lovableRequestToken") {
      var token = findBestToken();
      if (token) window.postMessage({ type: "lovableTokenFound", token: token, projectId: projectIdFromUrl() }, "*");
    }
  });

  // ---- Init ----
  try { if (localStorage.getItem(BYPASS_STORAGE_KEY) === "1") activateBypass(); } catch (e) {}
  setupBypassGuard();
  interceptWebSocket();
  interceptCreditChecks();
  var initToken = findBestToken();
  if (initToken) window.postMessage({ type: "lovableTokenFound", token: initToken, projectId: projectIdFromUrl() }, "*");
})();
