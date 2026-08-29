// ============================================================
// Lovable Pro v2.0 — Page Hook (MAIN world)
// ============================================================
// Minimal interceptor: only modifies behavior AFTER bypass
// is explicitly activated via license validation.
// Does NOT touch fetch/XHR/React until bypass is on.
// ============================================================
(function () {
  "use strict";

  var BYPASS_STORAGE_KEY = "__ql_bypass_active";
  var BYPASS_ATTR = "data-ql-bypass";
  var _bypassActive = false;
  var _interceptorsInstalled = false;

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
    installInterceptors();
  }

  function deactivateBypass() {
    _bypassActive = false;
    try { localStorage.removeItem(BYPASS_STORAGE_KEY); } catch (e) {}
    try { document.documentElement.removeAttribute(BYPASS_ATTR); } catch (e) {}
    try { window.postMessage({ type: "qlBypassState", active: false }, "*"); } catch (e) {}
  }

  // Only install interceptors AFTER bypass is activated
  function installInterceptors() {
    if (_interceptorsInstalled) return;
    _interceptorsInstalled = true;
    interceptFetch();
    interceptXHR();
  }

  function interceptFetch() {
    var origFetch = window.fetch;
    window.fetch = function () {
      var url = arguments[0];
      var urlStr = typeof url === "string" ? url : (url && url.url) || "";
      if (_bypassActive && /credit|balance|quota|usage|limit/i.test(urlStr)) {
        return Promise.resolve(new Response(
          JSON.stringify({ credits: 999999, balance: 999999, unlimited: true, hasCredits: true }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        ));
      }
      return origFetch.apply(this, arguments);
    };
  }

  function interceptXHR() {
    var origOpen = XMLHttpRequest.prototype.open;
    var origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
      this._qlUrl = url;
      return origOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
      if (_bypassActive && this._qlUrl && /credit|balance|quota|usage|limit/i.test(this._qlUrl)) {
        Object.defineProperty(this, "status", { value: 200, writable: false });
        Object.defineProperty(this, "readyState", { value: 4, writable: false });
        Object.defineProperty(this, "responseText", {
          value: JSON.stringify({ credits: 999999, unlimited: true }),
          writable: false
        });
        var self = this;
        setTimeout(function () {
          if (self.onreadystatechange) self.onreadystatechange();
          if (self.onload) self.onload();
        }, 10);
        return;
      }
      return origSend.apply(this, arguments);
    };
  }

  // ---- Token Extraction from WebSocket ----
  function setupTokenExtraction() {
    var OrigWebSocket = window.WebSocket;
    window.WebSocket = function (url, protocols) {
      var ws = protocols ? new OrigWebSocket(url, protocols) : new OrigWebSocket(url);
      ws.addEventListener("message", function (ev) {
        try {
          var msg = JSON.parse(ev.data);
          if (msg.token || msg.access_token || msg.accessToken) {
            var tok = msg.token || msg.access_token || msg.accessToken;
            window.postMessage({ type: "lovableTokenFound", token: tok, projectId: projectIdFromUrl() }, "*");
          }
          if (msg.browserSessionId) {
            window.postMessage({ type: "lovableBrowserSession", browserSessionId: msg.browserSessionId }, "*");
          }
        } catch (e) {}
      });
      return ws;
    };
    window.WebSocket.prototype = OrigWebSocket.prototype;
    window.WebSocket.CONNECTING = OrigWebSocket.CONNECTING;
    window.WebSocket.OPEN = OrigWebSocket.OPEN;
    window.WebSocket.CLOSING = OrigWebSocket.CLOSING;
    window.WebSocket.CLOSED = OrigWebSocket.CLOSED;
  }

  function projectIdFromUrl() {
    var m = location.pathname.match(/\/projects\/([a-f0-9-]{36})/i);
    return m ? m[1] : "";
  }

  // ---- Message Handler ----
  window.addEventListener("message", function (e) {
    if (!e.data || e.source !== window) return;
    if (e.data.type === "qlActivateBypass") { activateBypass(); return; }
    if (e.data.type === "qlDeactivateBypass") { deactivateBypass(); return; }
    if (e.data.type === "lovableSendViaWs") {
      // Forward to content script for delivery
      window.postMessage({ type: "lovableWsForward", payload: e.data.payload }, "*");
      return;
    }
  });

  // ---- Bypass Guard ----
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

  // ---- Init ----
  setupTokenExtraction();
  setupBypassGuard();

  // If bypass was already active before page load, install interceptors
  if (isBypassActive()) installInterceptors();
})();
