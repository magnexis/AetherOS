import { invokeCommand } from "./backend";

export type AetherSettings = {
  theme: "dark" | "light";
  animations: boolean;
  compactDock: boolean;
  developerMode: boolean;
  performanceProfile: "Balanced" | "Gaming" | "Battery Saver";
  nativeNotifications: boolean;
  doNotDisturb: boolean;
};

type SettingsContext = {
  getSettings: () => AetherSettings;
  updateSettings: (patch: Partial<AetherSettings>) => void;
  lockSession?: () => void;
  openApp?: (app: string) => void;
};

const sections = [
  "System",
  "Personalization",
  "Apps",
  "Accounts",
  "Network",
  "Privacy",
  "Security",
  "Storage",
  "Notifications",
  "Shortcuts",
  "Updates",
  "Developer",
  "About"
];

export function createSettingsApp(context: SettingsContext) {
  const root = document.createElement("div");
  root.className = "settings-app native-settings";
  let active = "System";
  let output = "Select a system action to inspect or change AetherOS.";

  const render = () => {
    const settings = context.getSettings();
    root.innerHTML = `
      <aside class="settings-nav native-settings-nav">
        <div class="settings-profile">
          <strong>matth</strong>
          <span>Admin · Local encrypted profile</span>
        </div>
        ${sections.map((section) => `<button class="${section === active ? "selected" : ""}" data-section="${section}">${iconFor(section)} ${section}</button>`).join("")}
      </aside>
      <section class="settings-panel native-settings-panel">
        <div class="settings-search-row">
          <input class="search-input wide-input" data-settings-search placeholder="Find a setting, command, device, app, or permission" />
          <button class="secondary-btn" data-open="search">Search System</button>
        </div>
        ${renderSection(active, settings)}
        <pre id="settings-output">${escapeText(output)}</pre>
      </section>
    `;

    root.querySelectorAll<HTMLButtonElement>("[data-section]").forEach((button) => {
      button.addEventListener("click", () => {
        active = button.dataset.section ?? "System";
        render();
      });
    });
    root.querySelectorAll<HTMLInputElement>("[data-toggle]").forEach((input) => {
      input.addEventListener("change", () => {
        const key = input.dataset.toggle as keyof AetherSettings;
        context.updateSettings({ [key]: input.checked } as Partial<AetherSettings>);
        output = `Updated ${key}.`;
        render();
      });
    });
    root.querySelector<HTMLSelectElement>("[data-profile]")?.addEventListener("change", (event) => {
      context.updateSettings({ performanceProfile: (event.target as HTMLSelectElement).value as AetherSettings["performanceProfile"] });
      output = "Performance policy changed.";
      render();
    });
    root.querySelectorAll<HTMLButtonElement>("[data-theme]").forEach((button) => {
      button.addEventListener("click", () => {
        context.updateSettings({ theme: button.dataset.theme as "dark" | "light" });
        output = `Theme changed to ${button.dataset.theme}.`;
        render();
      });
    });
    root.querySelectorAll<HTMLButtonElement>("[data-open]").forEach((button) => {
      button.addEventListener("click", () => context.openApp?.(button.dataset.open ?? ""));
    });
    root.querySelector<HTMLInputElement>("[data-settings-search]")?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      const value = (event.currentTarget as HTMLInputElement).value.toLowerCase();
      const match = sections.find((section) => section.toLowerCase().includes(value) || keywordsFor(section).includes(value));
      if (match) {
        active = match;
        output = `Opened ${match} settings from search.`;
        render();
      } else {
        output = "No matching settings category. Try apps, privacy, storage, shortcuts, updates, or security.";
        render();
      }
    });
    root.querySelector<HTMLButtonElement>("[data-lock]")?.addEventListener("click", () => context.lockSession?.());
    root.querySelectorAll<HTMLButtonElement>("[data-backend-action]").forEach((button) => {
      button.addEventListener("click", async () => {
        output = await runStorageAction(button.dataset.backendAction ?? "");
        render();
      });
    });
  };

  render();
  return root;
}

function renderSection(active: string, settings: AetherSettings) {
  if (active === "System") {
    return `
      <h2>System</h2>
      <div class="settings-card-grid">
        ${settingCard("Display & Windowing", "Workspaces, tiling, snapping, boot flow, and compositor behavior.", "workspace", "Open Overview")}
        ${settingCard("Experience Center", "Start, taskbar, widgets, snap layouts, shortcuts, and defaults.", "experience", "Open")}
        ${settingCard("Audio & Display", "Volume mixer, scaling, brightness, refresh rate, and multi-monitor layout.", "settings-display", "Configure")}
        ${settingCard("Power & Performance", `${settings.performanceProfile} mode is active.`, "monitor", "Open Monitor")}
        ${settingCard("Aether Nexus", "Modes, automations, self-healing, command mesh, and time ribbon.", "nexus", "Open Nexus")}
        ${settingCard("Storage", "Inspect AetherOS state, cache, app data, trash, and search index.", "settings-storage", "Inspect Storage")}
        ${settingCard("Default Apps", "Manage file associations and installed app handlers.", "marketplace", "Open Marketplace")}
      </div>
      <label class="field-label">Performance profile</label>
      <select class="select-input" data-profile>
        ${["Balanced", "Gaming", "Battery Saver"].map((profile) => `<option ${settings.performanceProfile === profile ? "selected" : ""}>${profile}</option>`).join("")}
      </select>
    `;
  }
  if (active === "Personalization") {
    return `
      <h2>Personalization</h2>
      <div class="segmented">
        <button class="${settings.theme === "dark" ? "selected" : ""}" data-theme="dark">Dark</button>
        <button class="${settings.theme === "light" ? "selected" : ""}" data-theme="light">Light</button>
      </div>
      ${toggle("Animations", "animations", settings.animations)}
      ${toggle("Compact dock", "compactDock", settings.compactDock)}
      <div class="metric-card"><strong>Aether visual system</strong><span>Solid panels, high-contrast focus states, no overlapping cards, responsive shell controls.</span></div>
    `;
  }
  if (active === "Apps") {
    return `
      <h2>Apps</h2>
      <div class="settings-card-grid">
        ${settingCard("Marketplace", "Verified apps, widgets, extensions, services, and app bundles.", "marketplace", "Open")}
        ${settingCard("Ecosystem Hub", "Store channels, extension points, protocols, developer publishing, and app trust.", "ecosystem", "Open")}
        ${settingCard("App Runtime", "Manifest apps, isolated windows, permissions, and API bridge.", "runtime", "Manage")}
        ${settingCard("AetherPkg", "Packages, channels, dependencies, signatures, and rollbacks.", "packages", "Open")}
        ${settingCard("Default Associations", "Text, images, packages, folders, host fallback.", "files", "Review")}
      </div>
    `;
  }
  if (active === "Accounts") {
    return `
      <h2>Accounts</h2>
      <div class="settings-card-grid">
        ${settingCard("matth", "Admin · PIN enabled · encrypted local profile", "security", "Manage")}
        ${settingCard("Guest", "Standard · no admin elevation · temporary shell data", "security", "Review")}
        ${settingCard("Add User", "Create a local profile with user-specific app data and settings.", "settings-accounts", "Create")}
        ${settingCard("Avatar Gallery", "Choose initials, portal badge, or uploaded user avatar.", "settings-accounts", "Choose")}
      </div>
      <div class="profile-grid">
        <button class="profile-choice selected">M</button>
        <button class="profile-choice">A</button>
        <button class="profile-choice">◎</button>
        <button class="profile-choice">+</button>
      </div>
      <button class="primary-btn" data-lock>Lock Session</button>
    `;
  }
  if (active === "Network") {
    return `
      <h2>Network</h2>
      <div class="settings-card-grid">
        ${settingCard("LAN", "Stable · trusted local network profile", "services", "Services")}
        ${settingCard("Marketplace Access", "registry.aether.local · signed channel metadata", "marketplace", "Open")}
        ${settingCard("Firewall Policy", "App runtime network permissions require prompts.", "security", "Review")}
      </div>
    `;
  }
  if (active === "Privacy") {
    return `
      <h2>Privacy</h2>
      <div class="settings-card-grid">
        ${settingCard("Permission Audit", "Filesystem, notifications, terminal, settings, package, and network grants.", "security", "Audit")}
        ${settingCard("App Data", "Export, import, clear cache, reset shell, and inspect storage paths.", "settings-storage", "Manage")}
        ${settingCard("Notification Privacy", "Native notifications, DND, history, per-app controls.", "settings-notifications", "Configure")}
      </div>
    `;
  }
  if (active === "Security") {
    return `
      <h2>Security</h2>
      <div class="settings-card-grid">
        ${settingCard("Aether Shield", "Hash scanner, rules, quarantine, scan history, watch-mode hook.", "security", "Open")}
        ${settingCard("Admin Approval", "Elevated actions require explicit session approval.", "security", "Review")}
        ${settingCard("App Capabilities", "Capability grants are visible before launch and install.", "runtime", "Manage")}
      </div>
      <button class="primary-btn" data-lock>Lock Session</button>
    `;
  }
  if (active === "Storage") {
    return `
      <h2>Storage</h2>
      <div class="button-row">
        <button class="primary-btn" data-backend-action="storage">Show Storage</button>
        <button class="secondary-btn" data-backend-action="clear">Clear Cache</button>
        <button class="secondary-btn" data-backend-action="export">Export Settings</button>
        <button class="secondary-btn" data-backend-action="import">Import Settings</button>
        <button class="secondary-btn" data-backend-action="reset">Reset Shell</button>
      </div>
      <div class="settings-card-grid">
        ${settingCard("Search Index", "SQLite metadata cache for files and folders.", "search", "Open Search")}
        ${settingCard("Trash", "Aether Trash folder with restore and permanent delete.", "files", "Open Files")}
        ${settingCard("Installed Apps", "Manifest folders and package state live in app data.", "runtime", "Open Runtime")}
      </div>
    `;
  }
  if (active === "Notifications") {
    return `
      <h2>Notifications</h2>
      ${toggle("Native notifications", "nativeNotifications", settings.nativeNotifications)}
      ${toggle("Do not disturb", "doNotDisturb", settings.doNotDisturb)}
      <div class="settings-card-grid">
        ${settingCard("Notification Center", "History, app events, settings, installs, and security alerts.", "notifications", "Open")}
        ${settingCard("App-specific Controls", "Runtime apps request notification permission before sending.", "runtime", "Manage")}
      </div>
    `;
  }
  if (active === "Shortcuts") {
    return `
      <h2>Shortcuts</h2>
      <div class="shortcut-grid">
        ${shortcut("Ctrl + K", "Open command palette")}
        ${shortcut("Ctrl + Shift + P", "Open command palette")}
        ${shortcut("Ctrl + Space", "Open app launcher")}
        ${shortcut("Ctrl + ,", "Open Settings")}
        ${shortcut("Ctrl + Shift + T", "Open Terminal")}
        ${shortcut("Ctrl + Shift + F", "Open File Explorer")}
        ${shortcut("Ctrl + Shift + M", "Open Marketplace")}
        ${shortcut("Ctrl + Shift + H", "Open Ecosystem Hub")}
        ${shortcut("Ctrl + Shift + E", "Open Experience Center")}
        ${shortcut("Ctrl + Shift + S", "Open System Search")}
        ${shortcut("Ctrl + Shift + X", "Open Aether Nexus")}
        ${shortcut("Alt + Tab", "Cycle active windows")}
        ${shortcut("Ctrl + Alt + 1-4", "Switch workspace")}
        ${shortcut("Ctrl + Alt + O", "Open workspace overview")}
        ${shortcut("Ctrl + Alt + T", "Tile visible windows")}
        ${shortcut("Ctrl + Alt + L", "Lock session")}
      </div>
      <div class="settings-card-grid">
        ${settingCard("Command Registry", "Every shortcut maps to a command-palette action so keyboard and UI stay in sync.", "search", "Search Commands")}
        ${settingCard("Developer Hooks", "Future SDK apps can register scoped commands with permission prompts.", "sdk", "Open SDK")}
      </div>
    `;
  }
  if (active === "Updates") {
    return `
      <h2>Updates</h2>
      <div class="settings-card-grid">
        ${settingCard("Update Center", "Stable, beta, nightly channels with rollback and recovery.", "updates", "Open")}
        ${settingCard("Recovery", "Last-known-good shell bundle is tracked for recovery mode.", "updates", "Review")}
      </div>
    `;
  }
  if (active === "Developer") {
    return `
      <h2>Developer</h2>
      ${toggle("Developer mode", "developerMode", settings.developerMode)}
      <div class="settings-card-grid">
        ${settingCard("Developer Console", "Logs, backend probes, registry state, and diagnostics.", "developer", "Open")}
        ${settingCard("Ecosystem Publishing", "Scaffold, validate, package, sign placeholder, and publish local apps.", "ecosystem", "Open Hub")}
        ${settingCard("Aether SDK", "TypeScript SDK, Rust bridge templates, scaffolder, package CLI.", "sdk", "Open")}
        ${settingCard("Keyboard Commands", "Ctrl+K, Ctrl+Space, Ctrl+Alt+1-4, Ctrl+Alt+L, Ctrl+Shift+M.", "search", "Search")}
      </div>
    `;
  }
  if (active === "About") {
    return `
      <h2>About</h2>
      <div class="settings-card-grid">
        ${settingCard("AetherOS", "Desktop shell, app marketplace, service layer, shield, SDK, assistant, control panel, updates, and recovery.", "marketplace", "Explore")}
        ${settingCard("Why it beats Windows someday", "Unified command palette, safer app permissions, local-first state, app rollback, OS-grade search, and developer-first app publishing.", "sdk", "Build")}
      </div>
      <div class="details-panel">
        <h3>Audio & Display</h3>
        <label class="field-label">Volume</label><input type="range" min="0" max="100" value="72" />
        <label class="field-label">Brightness</label><input type="range" min="0" max="100" value="80" />
        <label class="field-label">Display scale</label>
        <select class="select-input"><option>100%</option><option selected>125%</option><option>150%</option></select>
        <div class="monitor-layout"><span>Primary 2560x1440 144Hz</span><span>Side display 1920x1080 60Hz</span></div>
      </div>
    `;
  }
  return `
    <h2>About</h2>
    <div class="settings-card-grid">
      ${settingCard("AetherOS", "Desktop shell, app marketplace, service layer, shield, SDK, and update system.", "marketplace", "Explore")}
      ${settingCard("Why it beats Windows someday", "Unified command palette, safer app permissions, local-first state, app rollback, and OS-grade search.", "sdk", "Build")}
    </div>
  `;
}

function settingCard(title: string, body: string, openTarget: string, button: string) {
  return `
    <article class="settings-card">
      <strong>${title}</strong>
      <p>${body}</p>
      <button class="secondary-btn" data-open="${openTarget}">${button}</button>
    </article>
  `;
}

function iconFor(section: string) {
  const icons: Record<string, string> = {
    System: "▣",
    Personalization: "◐",
    Apps: "▤",
    Accounts: "●",
    Network: "⌁",
    Privacy: "◌",
    Security: "◈",
    Storage: "▥",
    Notifications: "◇",
    Shortcuts: "⌘",
    Updates: "⇪",
    Developer: "⌬",
    About: "A"
  };
  return icons[section] ?? "•";
}

function shortcut(keys: string, action: string) {
  return `
    <div class="shortcut-row">
      <kbd>${keys}</kbd>
      <span>${action}</span>
    </div>
  `;
}

function keywordsFor(section: string) {
  const keywords: Record<string, string> = {
    System: "display window workspace performance storage default",
    Personalization: "theme dark light dock animation wallpaper",
    Apps: "marketplace ecosystem package runtime default association extension protocol publishing",
    Accounts: "login user profile password lock",
    Network: "internet wifi lan firewall registry",
    Privacy: "permissions data audit notification history",
    Security: "shield virus scanner permissions admin",
    Storage: "cache state export import reset trash index",
    Notifications: "native dnd history action center",
    Shortcuts: "keyboard commands hotkeys keystrokes ctrl alt tab experience ecosystem",
    Updates: "rollback recovery stable beta nightly",
    Developer: "sdk logs console bridge diagnostics",
    About: "version aetheros windows better"
  };
  return keywords[section] ?? "";
}

async function runStorageAction(action: string) {
  try {
    if (action === "storage") return JSON.stringify(await invokeCommand("get_storage_info"), null, 2);
    if (action === "clear") return String(await invokeCommand("clear_cache"));
    if (action === "export") return String(await invokeCommand("export_state"));
    if (action === "import") {
      const stateJson = prompt("Paste exported AetherOS state JSON", "{}") ?? "{}";
      return String(await invokeCommand("import_state", { stateJson }));
    }
    if (action === "reset") return String(await invokeCommand("reset_shell_state"));
  } catch (error) {
    return String(error);
  }
  return "No action selected.";
}

function toggle(label: string, key: string, checked: boolean) {
  return `
    <label class="toggle-row">
      <span>${label}</span>
      <input type="checkbox" data-toggle="${key}" ${checked ? "checked" : ""} />
    </label>
  `;
}

function escapeText(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}
