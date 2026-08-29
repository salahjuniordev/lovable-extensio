// ============================================================
// Lovable Pro v2.0 — Page Hook (MAIN world)
// ============================================================
// Intercepts credit checks via fetch, XHR, WebSocket, and React.
// Activates ONLY after license validation triggers bypass.
// ============================================================
(function () {
  "use strict";

  var BYPASS_KEY = "__ql_bypass_active";
  var BYPASS_ATTR = "data-ql-bypass";
  var _active = false;
  var _patched = false;

  function isActive() {
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
    patchAll();
    // Delayed React patch — React loads after page
    setTimeout(patchReactState, 3000);
    setTimeout(patchReactState, 8000);
  }

  function deactivate() {
    _active = false;
    try { localStorage.removeItem(BYPASS_KEY); } catch (e) {}
    try { document.documentElement.removeAttribute(BYPASS_ATTR); } catch (e) {}
  }

  // ---- CREDIT_URL helper ----
  function isCreditUrl(s) {
    return /credit|balance|quota|usage|limit|payment|subscription/i.test(s);
  }

  // ---- Patch fetch ----
  function patchFetch() {
    var orig = window.fetch;
    window.fetch = function () {
      var url = arguments[0];
      var s = typeof url === "string" ? url : (url && url.url) || "";
      if (_active && isCreditUrl(s)) {
        return Promise.resolve(new Response(
          JSON.stringify({ credits: 999999, balance: 999999, unlimited: true, hasCredits: true, creditsRemaining: 999999 }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        ));
      }
      return orig.apply(this, arguments);
    };
  }

  // ---- Patch XHR ----
  function patchXHR() {
    var origOpen = XMLHttpRequest.prototype.open;
    var origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (m, url) {
      this._url = url;
      return origOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function () {
      if (_active && this._url && isCreditUrl(this._url)) {
        Object.defineProperty(this, "status", { value: 200, writable: false });
        Object.defineProperty(this, "readyState", { value: 4, writable: false });
        Object.defineProperty(this, "responseText", {
          value: JSON.stringify({ credits: 999999, unlimited: true, creditsRemaining: 999999 }),
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

  // ---- Patch WebSocket (prototype — don't replace constructor) ----
  function patchWebSocket() {
    var OrigSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
      if (_active && typeof data === "string") {
        try {
          var p = JSON.parse(data);
          // Remove/override credit fields in outgoing messages
          if ("credits" in p) p.credits = 999999;
          if ("balance" in p) p.balance = 999999;
          if ("creditsRemaining" in p) p.creditsRemaining = 999999;
          if ("skipCreditCheck" !== undefined) p.skipCreditCheck = true;
          data = JSON.stringify(p);
        } catch (e) {}
      }
      return OrigSend.call(this, data);
    };

    // Also patch addEventListener to intercept incoming credit data
    var OrigAddEventListener = WebSocket.prototype.addEventListener;
    WebSocket.prototype.addEventListener = function (type, listener, options) {
      if (type === "message" && _active) {
        var wrappedListener = function (event) {
          try {
            var msg = JSON.parse(event.data);
            var modified = false;
            if ("credits" in msg) { msg.credits = 999999; modified = true; }
            if ("balance" in msg) { msg.balance = 999999; modified = true; }
            if ("creditsRemaining" in msg) { msg.creditsRemaining = 999999; modified = true; }
            if ("hasCredits" in msg) { msg.hasCredits = true; modified = true; }
            if (modified) {
              var newEvent = new MessageEvent("message", {
                data: JSON.stringify(msg),
                origin: event.origin,
                lastEventId: event.lastEventId,
                source: event.source,
                ports: event.ports
              });
              return listener.call(this, newEvent);
            }
          } catch (e) {}
          return listener.call(this, event);
        };
        return OrigAddEventListener.call(this, type, wrappedListener, options);
      }
      return OrigAddEventListener.call(this, type, listener, options);
    };

    // Patch onmessage setter
    var desc = Object.getOwnPropertyDescriptor(WebSocket.prototype, "onmessage") ||
               Object.getOwnPropertyDescriptor(WebSocket.__proto__, "onmessage");
    if (desc && desc.set) {
      var origSet = desc.set;
      Object.defineProperty(WebSocket.prototype, "onmessage", {
        get: desc.get,
        set: function (handler) {
          if (_active && handler) {
            var wrapped = function (event) {
              try {
                var msg = JSON.parse(event.data);
                var modified = false;
                if ("credits" in msg) { msg.credits = 999999; modified = true; }
                if ("balance" in msg) { msg.balance = 999999; modified = true; }
                if ("creditsRemaining" in msg) { msg.creditsRemaining = 999999; modified = true; }
                if ("hasCredits" in msg) { msg.hasCredits = true; modified = true; }
                if (modified) {
                  event = new MessageEvent("message", { data: JSON.stringify(msg) });
                }
              } catch (e) {}
              return handler.call(this, event);
            };
            return origSet.call(this, wrapped);
          }
          return origSet.call(this, handler);
        },
        configurable: true
      });
    }
  }

  // ---- Patch React state ----
  function patchReactState() {
    try {
      var root = document.getElementById("__next") || document.getElementById("root") || document.getElementById("chat-input");
      if (!root) return;
      var fiberKey = Object.keys(root).find(function (k) { return k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$"); });
      if (!fiberKey) return;
      var fiber = root[fiberKey];
      var count = 0;
      while (fiber && count < 1000) {
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

  // ---- Install all interceptors ----
  function patchAll() {
    if (_patched) return;
    _patched = true;
    patchFetch();
    patchXHR();
    patchWebSocket();
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
        if (_active && !isActive()) activate();
      }).observe(document.documentElement, { attributes: true, attributeFilter: [BYPASS_ATTR] });
    }
  } catch (e) {}
  window.addEventListener("storage", function (e) {
    if (e.key === BYPASS_KEY && e.newValue === "1" && !_active) activate();
  });

  // If already active, patch now
  if (isActive()) patchAll();
})();
