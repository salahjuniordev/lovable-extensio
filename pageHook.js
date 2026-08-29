// ============================================================
// Lovable Pro v2.0 — Page Hook (MAIN world)
// ============================================================
// Ultra-minimal: only listens for bypass activation messages.
// Does NOT touch WebSocket, fetch, XHR, or React.
// ============================================================
(function () {
  "use strict";

  window.addEventListener("message", function (e) {
    if (!e.data || e.source !== window) return;
    if (e.data.type === "qlActivateBypass") {
      try { localStorage.setItem("__ql_bypass_active", "1"); } catch (err) {}
      try { document.documentElement.setAttribute("data-ql-bypass", "1"); } catch (err) {}
    }
    if (e.data.type === "qlDeactivateBypass") {
      try { localStorage.removeItem("__ql_bypass_active"); } catch (err) {}
      try { document.documentElement.removeAttribute("data-ql-bypass"); } catch (err) {}
    }
  });
})();
