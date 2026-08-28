# Lovable Pro — Chrome Extension

A premium Chrome extension that supercharges your [Lovable.dev](https://lovable.dev) workflow with an AI development agent UI, prompt optimization, voice input, project sync, and more.

> Built by **Shoaib Ahmed**

---

## Features

- **AI Agent Interface** — floating widget and native side panel with a composer-style prompt bar
- **Prompt Optimization** — one-click AI rewrite before sending
- **Voice Input** — dictate prompts with built-in speech recognition
- **Project Sync** — detects the active Lovable project and displays it in the UI
- **Quick Shortcuts** — 2-column chip grid for common dev commands
- **Plan Mode** — staged prompt flow that saves credits on complex builds
- **Shield Mode** — locks the native Lovable chat input so all prompts route through the extension
- **Source Download** — exports the full project as a ZIP via JSZip
- **Watermark Removal & Cloud Publishing** — one-click post-build actions
- **Dark / Light theme** — toggle or inherit from system preference
- **Onboarding flow** — first-run name capture; your name replaces the generic "Lovable Pro User" label
- **Chat history** — local message log with date grouping and status badges

---

## Tech Stack

| Layer | Detail |
|---|---|
| Platform | Chrome Extension — Manifest V3 |
| UI | Vanilla JS + CSS custom properties |
| Storage | `chrome.storage.local` |
| Auth | Supabase JWT (`lovable_token`) |
| Fonts | Plus Jakarta Sans (Google Fonts) |
| Bundler | None — plain files, loaded by the manifest |
| Build (optional) | `javascript-obfuscator` via `npm run build` |

---

## Project Structure

```
├── manifest.json            # MV3 manifest — permissions, content scripts, side panel
├── background.js            # Service worker — message routing, heartbeat
├── content.js               # Main content script — floating widget logic
├── content-templates.js     # HTML template functions for the floating widget
├── floating.css             # Styles for the floating widget
├── sidepanel.html           # Side panel shell
├── sidepanel.js             # Side panel logic (mirrors content.js)
├── sidepanel-templates.js   # HTML helpers for the side panel
├── sidepanel.css            # Side panel styles
├── theme.css                # Shared CSS custom properties (dark + light)
├── extension-config.js      # API base URLs, keys, feature flags
├── lovable-auth.js          # Token parsing + session helpers
├── lovable-feature-api.js   # Wrapper for Supabase feature endpoints
├── security-hardening.js    # Anti-inspect guards (clipboard, devtools)
├── user-messages.js         # Prompt template definitions
├── content-bridge.js        # postMessage bridge between MAIN and content worlds
├── pageHook.js              # Injected into MAIN world — intercepts network tokens
├── hwFingerprint.js         # Hardware fingerprint for device licensing
├── sounds.js                # Audio feedback helpers
├── jszip.min.js             # Vendored JSZip for project downloads
├── obfuscate.js             # Build script — obfuscates JS before distribution
├── obfuscate-config.json    # javascript-obfuscator settings
├── assets/                  # Extension icons + logos
└── sounds/                  # MP3 error sounds
```

---

## Installation (Development)

1. Clone the repo:
   ```bash
   git clone https://github.com/shoaibahmed-dev/lovable-pro-extension.git
   cd lovable-pro-extension
   ```

2. Open Chrome and go to `chrome://extensions`

3. Enable **Developer mode** (top-right toggle)

4. Click **Load unpacked** and select the project folder

5. Navigate to any [lovable.dev](https://lovable.dev) project — the floating widget will appear automatically

---

## Build (Obfuscated Distribution)

```bash
npm install
npm run build
```

Output is written alongside the source files. The manifest and CSS are not obfuscated.

---

## Key Storage Keys

| Key | Description |
|---|---|
| `lovable_token` | Supabase JWT from the active Lovable session |
| `lovable_projectId` | Current project UUID |
| `lovable_project_name` | Display name extracted from the page title |
| `lovable_user_name` | Username decoded from the JWT |
| `ql_custom_name` | User-entered display name from onboarding |
| `ql_onboarded` | Whether the first-run onboarding has been completed |
| `ql_license_valid` | License validation state |
| `ql_dark_mode` | Theme preference (`true` = dark, `false` = light) |

---

## License

Private — all rights reserved. Not for redistribution.
