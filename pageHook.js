// ============================================================
// Lovable Pro v2.0 — Page Hook (MAIN world)
// ============================================================
// Hooks WebSocket constructor to intercept credit data at the
// instance level. This is how working bypasses actually work.
// ============================================================
(function () {
  "use strict";

  var BYPASS_KEY = "__ql_bypass_active";
  var BYPASS_ATTR = "data-ql-bypass";
  var _active = false;
  var _hooked = false;

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
    if (!_hooked) hookWebSocket();
  }

  // ---- WebSocket instance-level hook ----
  function hookWebSocket() {
    if (_hooked) return;
    _hooked = true;

    var OrigWS = window.WebSocket;

    function FakeWS(url, protocols) {
      // Create real WebSocket
      var ws;
      if (protocols !== undefined) {
        ws = new OrigWS(url, protocols);
      } else {
        ws = new OrigWS(url);
      }

      // Hook send on this specific instance
      var origSend = ws.send;
      ws.send = function (data) {
        if (_active && typeof data === "string") {
          try {
            var p = JSON.parse(data);
            // Set credits to max to prevent server-side deduction trigger
            if ("credits" in p) p.credits = 999999;
            if ("balance" in p) p.balance = 999999;
            if ("creditsRemaining" in p) p.creditsRemaining = 999999;
            if ("skipCreditCheck" in p || true) p.skipCreditCheck = true;
            if ("noCreditCheck" in p || true) p.noCreditCheck = true;
            data = JSON.stringify(p);
          } catch (e) {}
        }
        return origSend.call(ws, data);
      };

      // Hook addEventListener for incoming messages
      var origAddEvent = ws.addEventListener.bind(ws);
      ws.addEventListener = function (type, handler, opts) {
        if (type === "message" && handler) {
          var wrapped = function (ev) {
            if (_active) {
              try {
                var msg = JSON.parse(ev.data);
                var changed = false;
                if ("credits" in msg) { msg.credits = 999999; changed = true; }
                if ("balance" in msg) { msg.balance = 999999; changed = true; }
                if ("creditsRemaining" in msg) { msg.creditsRemaining = 999999; changed = true; }
                if ("hasCredits" in msg) { msg.hasCredits = true; changed = true; }
                if ("creditWarning" in msg) { msg.creditWarning = false; changed = true; }
                if ("outOfCredits" in msg) { msg.outOfCredits = false; changed = true; }
                if (changed) {
                  ev = new MessageEvent("message", { data: JSON.stringify(msg) });
                }
              } catch (e) {}
            }
            return handler.call(this, ev);
          };
          return origAddEvent(type, wrapped, opts);
        }
        return origAddEvent(type, handler, opts);
      };

      // Hook onmessage property
      var _onmsg = null;
      Object.defineProperty(ws, "onmessage", {
        get: function () { return _onmsg; },
        set: function (handler) {
          _onmsg = handler ? function (ev) {
            if (_active) {
              try {
                var msg = JSON.parse(ev.data);
                var changed = false;
                if ("credits" in msg) { msg.credits = 999999; changed = true; }
                if ("balance" in msg) { msg.balance = 999999; changed = true; }
                if ("creditsRemaining" in msg) { msg.creditsRemaining = 999999; changed = true; }
                if ("hasCredits" in msg) { msg.hasCredits = true; changed = true; }
                if ("creditWarning" in msg) { msg.creditWarning = false; changed = true; }
                if ("outOfCredits" in msg) { msg.outOfCredits = false; changed = true; }
                if (changed) {
                  ev = new MessageEvent("message", { data: JSON.stringify(msg) });
                }
              } catch (e) {}
            }
            return handler.call(ws, ev);
          } : null;
        },
        configurable: true
      });

      return ws;
    }

    // Copy static properties and prototype
    FakeWS.prototype = OrigWS.prototype;
    FakeWS.CONNECTING = OrigWS.CONNECTING;
    FakeWS.OPEN = OrigWS.OPEN;
    FakeWS.CLOSING = OrigWS.CLOSING;
    FakeWS.CLOSED = OrigWS.CLOSED;

    window.WebSocket = FakeWS;
  }

  // ---- Message handler ----
  window.addEventListener("message", function (e) {
    if (!e.data || e.source !== window) return;
    if (e.data.type === "qlActivateBypass") activate();
    if (e.data.type === "qlDeactivateBypass") {
      _active = false;
      try { localStorage.removeItem(BYPASS_KEY); } catch (err) {}
      try { document.documentElement.removeAttribute(BYPASS_ATTR); } catch (err) {}
    }
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

  // Always hook WebSocket constructor early (before page scripts load)
  hookWebSocket();

  // If already active, activate now
  if (isActive()) activate();
})();
