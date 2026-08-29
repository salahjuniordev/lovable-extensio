// ============================================================
// Lovable Pro v2.0 — Page Hook (MAIN world)
// ============================================================
// Intercepts credit-check requests only AFTER bypass is activated.
// Does NOT hook WebSocket constructor (that breaks Lovable).
// ============================================================
(function () {
  "use strict";

  var BYPASS_KEY = "__ql_bypass_active";
  var BYPASS_ATTR = "data-ql-bypass";
  var _active = false;
  var _fetchPatched = false;
  var _xhrPatched = false;

  function isBypassActive() {
    if (_active) return true;
    try { if (localStorage.getItem(BYPASS_KEY) === "1") { _active = true; return true; } } catch (e) {}
    try { if (document.documentElement.getAttribute(BYPASS_ATTR) === "1") { _active = true; return true; } } catch (e) {}
    return false;
  }

  function activate() {
    _active = true;
    try { localStorage.setItem(BYPASS_KEY, "1"); } catch (e) {}
    try { document.documentElement.setAttribute(BYPASS_ATTR, "1"); } catch (e) {}
    try { window.postMessage({ type: "qlBypassState", active: true }, "*"); } catch (e) {}
    installInterceptors();
  }

  function deactivate() {
    _active = false;
    try { localStorage.removeItem(BYPASS_KEY); } catch (e) {}
    try { document.documentElement.removeAttribute(BYPASS_ATTR); } catch (e) {}
    try { window.postMessage({ type: "qlBypassState", active: false }, "*"); } catch (e) {}
  }

  function installInterceptors() {
    patchFetch();
    patchXHR();
    patchReactState();
  }

  function patchFetch() {
    if (_fetchPatched) return;
    _fetchPatched = true;
    var orig = window.fetch;
    window.fetch = function () {
      var url = arguments[0];
      var s = typeof url === "string" ? url : (url && url.url) || "";
      if (_active && /credit|balance|quota|usage|limit|payment|subscription/i.test(s)) {
        return Promise.resolve(new Response(
          JSON.stringify({ credits: 999999, balance: 999999, unlimited: true, hasCredits: true, creditsRemaining: 999999 }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        ));
      }
      return orig.apply(this, arguments);
    };
  }

  function patchXHR() {
    if (_xhrPatched) return;
    _xhrPatched = true;
    var origOpen = XMLHttpRequest.prototype.open;
    var origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (m, url) {
      this._qlUrl = url;
      return origOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function () {
      if (_active && this._qlUrl && /credit|balance|quota|usage|limit|payment|subscription/i.test(this._qlUrl)) {
        Object.defineProperty(this, "status", { value: 200, writable: false });
        Object.defineProperty(this, "readyState", { value: 4, writable: false });
        Object.defineProperty(this, "responseText", {
          value: JSON.stringify({ credits: 999999, balance: 999999, unlimited: true, creditsRemaining: 999999 }),
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

  function patchReactState() {
    try {
      var root = document.getElementById("__next") || document.getElementById("root") || document.getElementById("chat-input");
      if (!root) return;
      var fiberKey = Object.keys(root).find(function (k) { return k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$"); });
      if (!fiberKey) return;
      var fiber = root[fiberKey];
      var count = 0;
      while (fiber && count < 500) {
        count++;
        if (fiber.memoizedState) {
          var state = fiber.memoizedState;
          while (state) {
            if (state.queue && state.queue.lastRenderedState) {
              var st = state.queue.lastRenderedState;
              if (typeof st === "object" && st !== null && ("credits" in st || "balance" in st || "hasCredits" in st || "creditsRemaining" in st)) {
                try { Object.defineProperty(st, "credits", { value: 999999, configurable: true }); } catch (e) {}
                try { Object.defineProperty(st, "balance", { value: 999999, configurable: true }); } catch (e) {}
                try { Object.defineProperty(st, "hasCredits", { value: true, configurable: true }); } catch (e) {}
                try { Object.defineProperty(st, "creditsRemaining", { value: 999999, configurable: true }); } catch (e) {}
                try { Object.defineProperty(st, "unlimited", { value: true, configurable: true }); } catch (e) {}
              }
            }
            state = state.next;
          }
        }
        fiber = fiber.child || fiber.sibling || fiber.return;
      }
    } catch (e) {}
  }

  // ---- Message handler ----
  window.addEventListener("message", function (e) {
    if (!e.data || e.source !== window) return;
    if (e.data.type === "qlActivateBypass") activate();
    if (e.data.type === "qlDeactivateBypass") deactivate();
  });

  // ---- Bypass guard ----
  try {
    if (typeof MutationObserver !== "undefined" && document.documentElement) {
      new MutationObserver(function () {
        if (_active && !isBypassActive()) activate();
      }).observe(document.documentElement, { attributes: true, attributeFilter: [BYPASS_ATTR] });
    }
  } catch (e) {}
  window.addEventListener("storage", function (e) {
    if (e.key === BYPASS_KEY && e.newValue === "1" && !_active) activate();
  });

  // If already active, install now
  if (isBypassActive()) installInterceptors();
})();
