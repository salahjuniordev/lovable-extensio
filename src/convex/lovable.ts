import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

/**
 * Proxy command relay: receives a prompt from the extension and sends it
 * to Lovable's WebSocket or native chat via the user's session.
 */
export const proxyCommand = action({
  args: {
    licenseKey: v.string(),
    sessionId: v.string(),
    projetoId: v.string(),
    tokenLovable: v.string(),
    mensagem: v.string(),
    modoPensar: v.optional(v.boolean()),
    deviceId: v.string(),
    sessionHeaders: v.optional(v.any()),
    browserSessionId: v.optional(v.string()),
    nativeChatBody: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate the license session first
    const license = await ctx.runQuery(api.licenses.getLicense, {
      licenseKey: args.licenseKey,
    });

    if (!license || license.status !== "active") {
      return { success: false, error: "Invalid or inactive license." };
    }

    // Build the Lovable API request
    const lovableToken = args.tokenLovable.replace(/^Bearer\s+/i, "").trim();

    // Use the session headers from the extension (includes cookies, UA, etc.)
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${lovableToken}`,
      "Origin": "https://lovable.dev",
      "Referer": `https://lovable.dev/projects/${args.projetoId}`,
      ...(args.sessionHeaders || {}),
    };

    // Remove cookie header if empty
    if (!headers["cookie"]) {
      delete headers["cookie"];
    }

    try {
      // Try sending via Lovable's chat API
      const chatPayload = {
        message: args.mensagem,
        projectId: args.projetoId,
        mode: args.modoPensar ? "think" : "normal",
      };

      const response = await fetch(
        "https://api.lovable.dev/api/v1/chat/send",
        {
          method: "POST",
          headers,
          body: JSON.stringify(chatPayload),
        }
      );

      if (response.ok) {
        return { success: true };
      }

      // If the direct API fails, return error for extension to handle fallback
      const errorText = await response.text().catch(() => "Unknown error");
      return {
        success: false,
        error: `Lovable API returned ${response.status}: ${errorText}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to relay command to Lovable.",
      };
    }
  },
});

/**
 * Create a new Lovable project via their API.
 */
export const createProject = action({
  args: {
    licenseKey: v.string(),
    token: v.string(),
    projectName: v.string(),
    sessionHeaders: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const license = await ctx.runQuery(api.licenses.getLicense, {
      licenseKey: args.licenseKey,
    });

    if (!license || license.status !== "active") {
      return { success: false, error: "Invalid or inactive license." };
    }

    const token = args.token.replace(/^Bearer\s+/i, "").trim();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Origin": "https://lovable.dev",
      ...(args.sessionHeaders || {}),
    };

    try {
      const response = await fetch("https://api.lovable.dev/api/v1/projects", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: args.projectName,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        return {
          success: false,
          error: `Failed to create project: ${response.status} ${errorText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        projectId: data.id || data.projectId,
        projectName: data.name || args.projectName,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to create project.",
      };
    }
  },
});

/**
 * Remove watermark: sends a CSS injection prompt to Lovable to hide the badge.
 */
export const removeWatermark = action({
  args: {
    licenseKey: v.string(),
    token: v.string(),
    projetoId: v.string(),
    sessionHeaders: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const license = await ctx.runQuery(api.licenses.getLicense, {
      licenseKey: args.licenseKey,
    });

    if (!license || license.status !== "active") {
      return { success: false, error: "Invalid or inactive license." };
    }

    const watermarkPrompt =
      'Add this CSS to global styles on every page: #lovable-badge { display: none !important; visibility: hidden !important; pointer-events: none !important; } Completely remove the entire Lovable branding widget — the Made with Lovable text AND the floating close X button. Hide the parent #lovable-badge container, not just the text inside it. No empty box or orphaned X button should remain visible.';

    // Send the watermark removal prompt directly to Lovable
    const lovableToken = args.token.replace(/^Bearer\s+/i, "").trim();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${lovableToken}`,
      "Origin": "https://lovable.dev",
      ...(args.sessionHeaders || {}),
    };

    try {
      const response = await fetch(
        "https://api.lovable.dev/api/v1/chat/send",
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            message: watermarkPrompt,
            projectId: args.projetoId,
            mode: "normal",
          }),
        }
      );

      if (response.ok) {
        return { success: true };
      }

      const errorText = await response.text().catch(() => "Unknown error");
      return {
        success: false,
        error: `Lovable API returned ${response.status}: ${errorText}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to remove watermark.",
      };
    }
  },
});

/**
 * Publish a Lovable project.
 */
export const publishProject = action({
  args: {
    licenseKey: v.string(),
    token: v.string(),
    projetoId: v.string(),
    sessionHeaders: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const license = await ctx.runQuery(api.licenses.getLicense, {
      licenseKey: args.licenseKey,
    });

    if (!license || license.status !== "active") {
      return { success: false, error: "Invalid or inactive license." };
    }

    const token = args.token.replace(/^Bearer\s+/i, "").trim();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Origin": "https://lovable.dev",
      ...(args.sessionHeaders || {}),
    };

    try {
      const response = await fetch(
        `https://api.lovable.dev/api/v1/projects/${args.projetoId}/publish`,
        {
          method: "POST",
          headers,
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        return {
          success: false,
          error: `Publish failed: ${response.status} ${errorText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        url: data.url || data.publishedUrl,
        message: "Project published successfully!",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to publish project.",
      };
    }
  },
});

/**
 * Enable Lovable Cloud for a project.
 */
export const enableCloud = action({
  args: {
    licenseKey: v.string(),
    token: v.string(),
    projetoId: v.string(),
    region: v.optional(v.string()),
    sessionHeaders: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const license = await ctx.runQuery(api.licenses.getLicense, {
      licenseKey: args.licenseKey,
    });

    if (!license || license.status !== "active") {
      return { success: false, error: "Invalid or inactive license." };
    }

    const token = args.token.replace(/^Bearer\s+/i, "").trim();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "Origin": "https://lovable.dev",
      ...(args.sessionHeaders || {}),
    };

    try {
      const response = await fetch(
        `https://api.lovable.dev/api/v1/projects/${args.projetoId}/cloud`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            region: args.region || "america",
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        return {
          success: false,
          error: `Cloud activation failed: ${response.status} ${errorText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || "Lovable Cloud activated!",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to enable cloud.",
      };
    }
  },
});

/**
 * Download project source code from Lovable.
 */
export const downloadSource = action({
  args: {
    licenseKey: v.string(),
    token: v.string(),
    projetoId: v.string(),
    sessionHeaders: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const license = await ctx.runQuery(api.licenses.getLicense, {
      licenseKey: args.licenseKey,
    });

    if (!license || license.status !== "active") {
      return { success: false, error: "Invalid or inactive license." };
    }

    const token = args.token.replace(/^Bearer\s+/i, "").trim();

    const headers: Record<string, string> = {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
      ...(args.sessionHeaders || {}),
    };

    try {
      const response = await fetch(
        `https://lovable-api.com/projects/${args.projetoId}/source-code`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        return {
          success: false,
          error: `Download failed: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        files: data.files || [],
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to download source.",
      };
    }
  },
});
