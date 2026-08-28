import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

/**
 * POST /api/validate-license
 * Validate a license key and bind to a device.
 */
http.route({
  path: "/api/validate-license",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { license_key, device_id, max_devices, heartbeat } = body;

      if (!license_key || !device_id) {
        return new Response(
          JSON.stringify({ valid: false, message: "Missing license_key or device_id." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      if (heartbeat && body.session_id) {
        const result = await ctx.runMutation(api.licenses.heartbeat, {
          licenseKey: license_key,
          sessionId: body.session_id,
          deviceId: device_id,
        });
        return new Response(JSON.stringify(result), {
          status: result.valid ? 200 : 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const result = await ctx.runMutation(api.licenses.validateLicense, {
        licenseKey: license_key,
        deviceId: device_id,
        maxDevices: max_devices,
      });

      return new Response(JSON.stringify(result), {
        status: result.valid ? 200 : 401,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      return new Response(
        JSON.stringify({ valid: false, message: error.message || "Internal error." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

/**
 * POST /api/proxy-command
 * Relay a prompt to Lovable via the user's session.
 */
http.route({
  path: "/api/proxy-command",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const {
        license_key,
        session_id,
        projeto_id,
        token_lovable,
        mensagem,
        modo_pensar,
        device_id,
        session_headers,
        browser_session_id,
        native_chat_body,
      } = body;

      if (!license_key || !projeto_id || !token_lovable || !mensagem) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing required fields." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const result = await ctx.runAction(api.lovable.proxyCommand, {
        licenseKey: license_key,
        sessionId: session_id || "",
        projetoId: projeto_id,
        tokenLovable: token_lovable,
        mensagem,
        modoPensar: modo_pensar,
        deviceId: device_id || "",
        sessionHeaders: session_headers,
        browserSessionId: browser_session_id,
        nativeChatBody: native_chat_body,
      });

      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 500,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      return new Response(
        JSON.stringify({ success: false, error: error.message || "Proxy failed." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

/**
 * POST /api/create-project
 */
http.route({
  path: "/api/create-lovable-project",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { license_key, token, project_name, session_headers } = body;

      if (!license_key || !token || !project_name) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing required fields." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const result = await ctx.runAction(api.lovable.createProject, {
        licenseKey: license_key,
        token,
        projectName: project_name,
        sessionHeaders: session_headers,
      });

      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 500,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      return new Response(
        JSON.stringify({ success: false, error: error.message || "Project creation failed." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

/**
 * POST /api/remove-watermark
 */
http.route({
  path: "/api/remove-watermark",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { license_key, token, projeto_id, session_headers } = body;

      if (!license_key || !token || !projeto_id) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing required fields." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const result = await ctx.runAction(api.lovable.removeWatermark, {
        licenseKey: license_key,
        token,
        projetoId: projeto_id,
        sessionHeaders: session_headers,
      });

      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 500,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      return new Response(
        JSON.stringify({ success: false, error: error.message || "Watermark removal failed." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

/**
 * POST /api/publish-project
 */
http.route({
  path: "/api/publish-project",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { license_key, token, projeto_id, session_headers } = body;

      if (!license_key || !token || !projeto_id) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing required fields." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const result = await ctx.runAction(api.lovable.publishProject, {
        licenseKey: license_key,
        token,
        projetoId: projeto_id,
        sessionHeaders: session_headers,
      });

      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 500,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      return new Response(
        JSON.stringify({ success: false, error: error.message || "Publish failed." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

/**
 * POST /api/enable-cloud
 */
http.route({
  path: "/api/enable-cloud",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { license_key, token, projeto_id, region, session_headers } = body;

      if (!license_key || !token || !projeto_id) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing required fields." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const result = await ctx.runAction(api.lovable.enableCloud, {
        licenseKey: license_key,
        token,
        projetoId: projeto_id,
        region,
        sessionHeaders: session_headers,
      });

      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 500,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      return new Response(
        JSON.stringify({ success: false, error: error.message || "Cloud activation failed." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

/**
 * POST /api/download-source
 */
http.route({
  path: "/api/download-source",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { license_key, token, projeto_id, session_headers } = body;

      if (!license_key || !token || !projeto_id) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing required fields." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const result = await ctx.runAction(api.lovable.downloadSource, {
        licenseKey: license_key,
        token,
        projetoId: projeto_id,
        sessionHeaders: session_headers,
      });

      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 500,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      return new Response(
        JSON.stringify({ success: false, error: error.message || "Download failed." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

/**
 * GET /api/notifications
 */
http.route({
  path: "/api/notifications",
  method: "GET",
  handler: httpAction(async (ctx) => {
    try {
      const notifications = await ctx.runQuery(
        api.notifications.getActiveNotifications
      );
      return new Response(JSON.stringify(notifications), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      return new Response(
        JSON.stringify({ error: error.message || "Failed to fetch notifications." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

export default http;
