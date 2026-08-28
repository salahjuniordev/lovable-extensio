/**
 * Lovable Pro v2.0 — Content Bridge
 * ============================================================
 * Registers early so side panel Send always has a receiver.
 * Manages bypass state with multi-signal guard.
 * Provides prompt delivery via WebSocket with native DOM fallback.
 * ============================================================
 */
(function () {
  if (window.__pkBridgeReady) return;
  window.__pkBridgeReady = true;

  var BYPASS_STORAGE_KEY = "__ql_bypass_active";
  var BYPASS_ATTR = "data-ql-bypass";

  // ============================================================
  // BYPASS MANAGEMENT — multi-signal
  // ============================================================

  function activatePkCreditBypass() {
    try { localStorage.setItem(BYPASS_STORAGE_KEY, "1"); } catch (e) {}
    try { document.documentElement.setAttribute(BYPASS_ATTR, "1"); } catch (e) {}
    try { document.documentElement.style.setProperty("--ql-bypass", "1"); } catch (e) {}
    try { window.postMessage({ type: "qlBypassState", active: true }, "*"); } catch (e) {}
  }

  function deactivatePkCreditBypass() {
    try { localStorage.removeItem(BYPASS_STORAGE_KEY); } catch (e) {}
    try { document.documentElement.removeAttribute(BYPASS_ATTR); } catch (e) {}
    try { document.documentElement.style.removeProperty("--ql-bypass"); } catch (e) {}
    try { window.postMessage({ type: "qlBypassState", active: false }, "*"); } catch (e) {}
  }

  function isBypassActive() {
    try {
      if (localStorage.getItem(BYPASS_STORAGE_KEY) === "1") return true;
    } catch (e) {}
    try {
      if (document.documentElement.getAttribute(BYPASS_ATTR) === "1") return true;
    } catch (e) {}
    return false;
  }

  function setPkCreditBypass(on) {
    if (on) activatePkCreditBypass();
    else deactivatePkCreditBypass();
  }

  // ============================================================
  // BYPASS GUARD — auto-reapply if page clears it
  // ============================================================

  (function setupBypassGuard() {
    var _lastKnown = false;

    function syncFromStorage() {
      var active = isBypassActive();
      if (active !== _lastKnown) {
        _lastKnown = active;
        if (active) activatePkCreditBypass();
      }
    }

    // MutationObserver for attribute changes
    if (typeof MutationObserver !== "undefined" && document.documentElement) {
      var obs = new MutationObserver(function () {
        if (_lastKnown && !isBypassActive()) {
          activatePkCreditBypass();
        }
      });
      obs.observe(document.documentElement, {
        attributes: true,
        attributeFilter: [BYPASS_ATTR],
      });
    }

    // Storage event for cross-context changes
    window.addEventListener("storage", function (e) {
      if (e.key === BYPASS_STORAGE_KEY) syncFromStorage();
    });

    // Periodic check (React can silently clear attributes)
    setInterval(syncFromStorage, 2000);
  })();

  // ============================================================
  // SYNC FROM CHROME STORAGE
  // ============================================================

  function syncPkCreditBypassFromStorage() {
    if (typeof INTERNAL_LICENSE_MODE !== "undefined" && INTERNAL_LICENSE_MODE) {
      setPkCreditBypass(true);
      return;
    }
    chrome.storage.local.get(["ql_license_valid", "ql_license_key"], function (res) {
      var licensed = !!(res.ql_license_valid && typeof resolveTeamLicenseKey === "function" && resolveTeamLicenseKey(res.ql_license_key));
      setPkCreditBypass(licensed);
    });
  }

  // ============================================================
  // PROMPT DELIVERY
  // ============================================================

  function generateId(prefix) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var id = prefix;
    for (var i = 0; i < 20; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    return id;
  }

  function sendViaWs(message) {
    return new Promise(function (resolve, reject) {
      var payload = {
        id: generateId("umsg_"),
        message: message,
        files: [],
        selected_elements: [],
        chat_only: false,
        view: "editor",
        view_description: "",
        optimisticImageUrls: [],
        ai_message_id: generateId("aimsg_"),
        thread_id: "main",
        current_page: window.location.pathname || "/",
        current_viewport_width: window.innerWidth || 1280,
        current_viewport_height: window.innerHeight || 800,
        current_viewport_dpr: window.devicePixelRatio || 1,
        model: null,
      };
      var timer = setTimeout(function () {
        window.removeEventListener("message", handler);
        reject(new Error("Timeout: WebSocket did not respond"));
      }, 6000);
      function handler(ev) {
        if (ev.source !== window || !ev.data) return;
        if (ev.data.type !== "lovableWsSendResult") return;
        clearTimeout(timer);
        window.removeEventListener("message", handler);
        if (ev.data.success) resolve();
        else reject(new Error(ev.data.error || "WebSocket send failed"));
      }
      window.addEventListener("message", handler);
      window.postMessage({ type: "lovableSendViaWs", payload: payload }, "*");
    });
  }

  async function sendNativeToLovable(text) {
    var chatForm = document.querySelector("form#chat-input");
    if (!chatForm) throw new Error("Lovable chat not found. Open your project on lovable.dev.");
    var editor = chatForm.querySelector('[contenteditable="true"]');
    if (!editor) throw new Error("Chat editor not found. Wait for the page to finish loading.");
    var sendBtn = document.getElementById("chatinput-send-message-button");
    if (!sendBtn) throw new Error("Send button not found.");

    editor.focus();
    editor.textContent = "";
    document.execCommand("selectAll", false, null);
    document.execCommand("insertText", false, text);

    // Modern input event for React
    editor.dispatchEvent(new InputEvent("input", {
      bubbles: true,
      cancelable: true,
      inputType: "insertText",
      data: text,
    }));

    await new Promise(function (r) { setTimeout(r, 200); });

    sendBtn.removeAttribute("disabled");
    sendBtn.click();
  }

  async function deliverPromptToLovable(text, retryCount) {
    retryCount = retryCount || 0;
    var strategy = (typeof SEND_STRATEGY !== "undefined" && SEND_STRATEGY) ? SEND_STRATEGY : "native";

    // Try WebSocket first (bypasses credit checks in the WS layer)
    if (strategy === "websocket" || retryCount > 0) {
      try {
        await sendViaWs(text);
        return;
      } catch (e) {
        if (typeof POWERKITS_DEBUG !== "undefined" && POWERKITS_DEBUG) {
          console.warn("[PK Bridge] WebSocket failed:", e.message);
        }
      }
    }

    // Fallback to native DOM delivery
    try {
      await sendNativeToLovable(text);
    } catch (nativeError) {
      // If native fails and we haven't retried, try WS as fallback
      if (retryCount < 1 && strategy !== "websocket") {
        return deliverPromptToLovable(text, retryCount + 1);
      }
      throw nativeError;
    }
  }

  window.__pkDeliverPrompt = deliverPromptToLovable;

  // ============================================================
  // MESSAGE LISTENER (from background / content script)
  // ============================================================

  chrome.runtime.onMessage.addListener(function (msg, _sender, sendResponse) {
    if (msg && msg.action === "ping") {
      sendResponse({ ok: true, bridge: true });
      return false;
    }
    if (msg && msg.action === "qlActivateBypass") {
      setPkCreditBypass(true);
      sendResponse({ ok: true });
      return false;
    }
    if (msg && msg.action === "qlDeactivateBypass") {
      setPkCreditBypass(false);
      sendResponse({ ok: true });
      return false;
    }
    if (msg && msg.action === "setCreditBypass") {
      setPkCreditBypass(!!msg.active);
      sendResponse({ ok: true });
      return false;
    }
    if (msg && msg.action === "syncCreditBypass") {
      syncPkCreditBypassFromStorage();
      sendResponse({ ok: true });
      return false;
    }
    if (msg && msg.action === "qlSendViaWs") {
      deliverPromptToLovable(msg.message || "")
        .then(function () { sendResponse({ ok: true }); })
        .catch(function (err) { sendResponse({ ok: false, error: err.message || String(err) }); });
      return true;
    }
    if (msg && msg.action === "requestTokenRefresh") {
      try { window.postMessage({ type: "lovableRequestToken" }, "*"); } catch (e) {}
      setTimeout(function () {
        try { window.postMessage({ type: "lovableRequestToken" }, "*"); } catch (e2) {}
      }, 120);
      sendResponse({ ok: true });
      return false;
    }
    if (msg && msg.action === "resolveLovableAuth") {
      (async function () {
        try { window.postMessage({ type: "lovableRequestToken" }, "*"); } catch (e) {}
        await new Promise(function (r) { setTimeout(r, 200); });
        var sd = await new Promise(function (r) {
          chrome.storage.local.get(["lovable_token", "lovable_projectId"], r);
        });
        sendResponse({
          token: sd.lovable_token || "",
          projectId: projectIdFromPage() || sd.lovable_projectId || "",
        });
      })();
      return true;
    }
  });

  function projectIdFromPage() {
    try {
      var m = window.location.pathname.match(/projects\/([0-9a-fA-F-]{36})/i);
      return m ? m[1] : "";
    } catch (e) { return ""; }
  }
})();
