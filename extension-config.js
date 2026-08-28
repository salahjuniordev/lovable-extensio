(function(){
  // ============================================================
  // Lovable Pro v2.0.0 — Convex Backend Configuration
  // ============================================================
  //
  // IMPORTANT: Set CONVEX_URL to your Convex deployment URL.
  // You can find this in your Convex dashboard after running:
  //   npx convex dev
  //
  // The URL looks like: https://your-project.convex.cloud
  // ============================================================

  var CONVEX_URL = "https://proper-hawk-358.convex.cloud";

  var _c = {};
  function _f(n, v) {
    _c[n] = v;
    try {
      Object.defineProperty(window, n, { configurable: false, writable: false, value: v });
    } catch(e) {}
  }

  _f('EXTENSION_NAME', 'Lovable Pro');
  _f('EXTENSION_VERSION', '2.0.0');
  _f('DEFAULT_LICENSE_USER_NAME', 'Lovable Pro User');
  _f('CONVEX_URL', CONVEX_URL);
  _f('API_BASE', CONVEX_URL ? CONVEX_URL + '/api' : '');
  _f('API_KEY', ''); // No API key needed for Convex HTTP actions
  _f('POWERKITS_API_BASE', CONVEX_URL ? CONVEX_URL + '/api' : '');
  _f('POWERKITS_API_KEY', '');
  _f('GRINGOW_API_BASE', CONVEX_URL ? CONVEX_URL + '/api' : '');
  _f('GRINGOW_API_KEY', '');
  _f('DISCORD_SUPPORT_URL', '');
  _f('PROXY_COMMAND_URL', CONVEX_URL ? CONVEX_URL + '/api/proxy-command' : '');
  _f('SEND_STRATEGY', 'native');
  _f('POWERKITS_DEBUG', false);
  _f('INTERNAL_LICENSE_MODE', false); // Disabled — users must validate with license key
  _f('SIDE_PANEL_ONLY', false);

  // API endpoint helpers
  _f('VALIDATE_LICENSE_URL', CONVEX_URL ? CONVEX_URL + '/api/validate-license' : '');
  _f('NOTIFICATIONS_URL', CONVEX_URL ? CONVEX_URL + '/api/notifications' : '');
  _f('CREATE_PROJECT_URL', CONVEX_URL ? CONVEX_URL + '/api/create-lovable-project' : '');
  _f('REMOVE_WATERMARK_URL', CONVEX_URL ? CONVEX_URL + '/api/remove-watermark' : '');
  _f('PUBLISH_PROJECT_URL', CONVEX_URL ? CONVEX_URL + '/api/publish-project' : '');
  _f('ENABLE_CLOUD_URL', CONVEX_URL ? CONVEX_URL + '/api/enable-cloud' : '');
  _f('DOWNLOAD_SOURCE_URL', CONVEX_URL ? CONVEX_URL + '/api/download-source' : '');

  try { if (Object.freeze) Object.freeze(_c); } catch(e) {}
  try {
    if (typeof window._pkS !== 'undefined' && window._pkS) {
      window._pkS.lock('EXTENSION_NAME', EXTENSION_NAME);
      window._pkS.lock('EXTENSION_VERSION', EXTENSION_VERSION);
      window._pkS.lock('CONVEX_URL', CONVEX_URL);
    }
  } catch(e) {}
})();

function extensionVersionShort() {
  return typeof EXTENSION_VERSION !== "undefined" ? String(EXTENSION_VERSION) : "0.0.0";
}

function extensionFooterBadge() {
  var name = typeof EXTENSION_NAME !== "undefined" ? String(EXTENSION_NAME) : "Lovable Pro";
  return name + " \u2022 v" + extensionVersionShort();
}

function powerkitsApiHeaders(extra) {
  return Object.assign({ apikey: typeof POWERKITS_API_KEY !== 'undefined' ? POWERKITS_API_KEY : '' }, extra || {});
}

function gringowApiHeaders(extra) {
  return powerkitsApiHeaders(extra);
}

function normalizeLicenseUserName(name) {
  var n = String(name || "").trim();
  if (!n || n.toLowerCase() === "test" || n.toLowerCase() === "user" || /gringow|powerkits|empire|vip extension/i.test(n)) {
    return typeof DEFAULT_LICENSE_USER_NAME !== 'undefined' ? DEFAULT_LICENSE_USER_NAME : "Lovable Pro User";
  }
  return n;
}

function resolveTeamLicenseKey(storedKey) {
  if (typeof INTERNAL_LICENSE_MODE !== 'undefined' && INTERNAL_LICENSE_MODE) return "INTERNAL";
  var k = String(storedKey || "").trim();
  if (!k) return "";
  return k;
}

function powerkitsInternalSessionStorage(sessionId, userName) {
  var key = resolveTeamLicenseKey("");
  return {
    ql_license_valid: true,
    ql_license_key: key || "INTERNAL",
    ql_session_id: sessionId,
    ql_user_name: normalizeLicenseUserName(userName),
    ql_license_status: "active",
    ql_expires_at: null,
    ql_activated_at: new Date().toISOString()
  };
}

function gringowInternalSessionStorage(sessionId, userName) {
  return powerkitsInternalSessionStorage(sessionId, userName);
}

function readPlanModeFromStorage(res) {
  res = res || {};
  return !!(res.ql_modo_plano || res.ql_license_mode || res.ql_modo_licenca);
}

function writePlanModeToStorage(on, cb) {
  chrome.storage.local.set({ ql_modo_plano: !!on }, cb);
}

function migratePlanModeStorageKeys(cb) {
  chrome.storage.local.get([
    "ql_modo_plano", "ql_license_mode", "ql_modo_licenca",
    "ql_modo_plano_alert_dismissed", "ql_license_mode_alert_dismissed"
  ], function(res) {
    var patch = {};
    var on = readPlanModeFromStorage(res);
    if (on && res.ql_modo_plano !== true) patch.ql_modo_plano = true;
    var dismissed = !!(res.ql_modo_plano_alert_dismissed || res.ql_license_mode_alert_dismissed);
    if (dismissed && res.ql_modo_plano_alert_dismissed !== true) {
      patch.ql_modo_plano_alert_dismissed = true;
    }
    if (Object.keys(patch).length) {
      chrome.storage.local.set(patch, function() { if (cb) cb(on, dismissed); });
    } else if (cb) {
      cb(on, dismissed);
    }
  });
}

function pkPageStorageGet(suffix) {
  try {
    return localStorage.getItem("pk_" + suffix) || localStorage.getItem("gringow_" + suffix) || "";
  } catch (e) {
    return "";
  }
}

function pkPageStorageSet(suffix, value) {
  try {
    localStorage.setItem("pk_" + suffix, value);
  } catch (e) {}
}

function pkParseUtcExpiry(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number" && !isNaN(value)) return value;
  var s = String(value).trim();
  if (!s) return null;
  if (!/Z|[+-]\d{2}:?\d{2}$/.test(s)) {
    s = s.replace(" ", "T") + "Z";
  }
  var ms = Date.parse(s);
  return isNaN(ms) ? null : ms;
}

function pkResolveLicenseStatus(data) {
  if (!data) return "active";
  if (data.is_trial || data.status === "trial") return "trial";
  return data.status || "active";
}

function pkLicenseStoragePatch(data) {
  if (!data) return {};
  var patch = { ql_license_status: pkResolveLicenseStatus(data) };
  if (Object.prototype.hasOwnProperty.call(data, "expires_at")) {
    patch.ql_expires_at = data.expires_at || null;
  }
  if (Object.prototype.hasOwnProperty.call(data, "activated_at")) {
    patch.ql_activated_at = data.activated_at || null;
  }
  if (Object.prototype.hasOwnProperty.call(data, "validity_minutes")) {
    patch.ql_validity_minutes = data.validity_minutes != null ? data.validity_minutes : null;
  }
  return patch;
}
