import type { AppId } from "./windows";

export type LauncherApp = {
  id: AppId;
  name: string;
  icon: string;
  description: string;
};

export const launcherApps: LauncherApp[] = [
  { id: "files", name: "File Explorer", icon: "▣", description: "Browse AetherFS folders and files." },
  { id: "terminal", name: "Terminal", icon: "⌁", description: "Run shell commands and package actions." },
  { id: "settings", name: "Settings", icon: "⚙", description: "Tune appearance, performance, and developer options." },
  { id: "monitor", name: "System Monitor", icon: "▥", description: "Inspect simulated resource usage and windows." },
  { id: "packages", name: "AetherPkg", icon: "⬡", description: "Install, remove, and update local packages." },
  { id: "developer", name: "Developer Console", icon: "⌬", description: "Inspect logs, backend commands, and shell diagnostics." },
  { id: "runtime", name: "App Runtime", icon: "▤", description: "Install and run third-party manifest apps." },
  { id: "marketplace", name: "Marketplace", icon: "◌", description: "Discover verified apps, services, packages, widgets, and extensions." },
  { id: "ecosystem", name: "Ecosystem Hub", icon: "◎", description: "Manage Store channels, extension points, protocols, publishing, and app trust." },
  { id: "experience", name: "Experience Center", icon: "⊞", description: "Tune Start, taskbar, widgets, snap layouts, shortcuts, and default apps." },
  { id: "services", name: "Service Manager", icon: "▧", description: "Control background services and boot policies." },
  { id: "security", name: "Security Center", icon: "◈", description: "Manage identity, permissions, and Aether Shield." },
  { id: "search", name: "System Search", icon: "⌕", description: "Search apps, files, commands, packages, and settings." },
  { id: "sdk", name: "Aether SDK", icon: "⌘", description: "Build, package, and test AetherOS apps." },
  { id: "updates", name: "Update Center", icon: "⇪", description: "Manage channels, rollbacks, and recovery mode." },
  { id: "control", name: "Control Panel", icon: "▦", description: "Advanced devices, firewall, environment, startup, and recovery tools." },
  { id: "assistant", name: "Aether Assistant", icon: "✦", description: "Local command helper for files, packages, settings, and recovery." },
  { id: "kernel", name: "Kernel Lab", icon: "◇", description: "Prototype registry, drivers, device tree, modules, syscalls, interrupts, SASOS, compatibility VMs, formal proofs, semantic FS, replay, capabilities, IPC, scheduling, eBPF, ZRAM, VFS, and namespaces." },
  { id: "nexus", name: "Aether Nexus", icon: "✧", description: "Command center for modes, automation, self-healing, timeline replay, workspace choreography, and system graph control." }
  ,
  { id: "boot", name: "Boot Manager", icon: "⏻", description: "Advanced startup, safe mode, diagnostic boot, and last known good configuration." },
  { id: "registry", name: "Aether Registry", icon: "▥", description: "Edit and inspect kernel, service, driver, user, shell, task, and startup hives." },
  { id: "devices", name: "Device Manager", icon: "◫", description: "Buses, devices, drivers, rollback, hardware matching, and signature warnings." },
  { id: "permissions", name: "Permission Center", icon: "◈", description: "Approve, deny, and audit app capability prompts." },
  { id: "tasks", name: "Task Scheduler", icon: "◷", description: "Run jobs at login, intervals, events, idle time, and capability tokens." },
  { id: "crash", name: "Crash Reporter", icon: "⚠", description: "Create crash bundles with logs, service state, recovery report, and replay metadata." },
  { id: "events", name: "Event Viewer", icon: "≋", description: "Inspect system event bus topics and replay windows." }
  ,
  { id: "network", name: "Network Center", icon: "⇄", description: "Manage interfaces, DNS, VPN, firewall rules, and network profiles." },
  { id: "accounts", name: "Account Manager", icon: "◉", description: "Manage users, roles, auth, elevation, sessions, and encrypted profile state." },
  { id: "storage", name: "Storage Manager", icon: "▰", description: "Inspect volumes, quotas, encryption, health, cleanup, trim, and cache policy." },
  { id: "audit", name: "Audit Viewer", icon: "☷", description: "Review auth, admin, network, storage, policy, and backup audit trails." },
  { id: "backup", name: "Backup Manager", icon: "↺", description: "Run encrypted backup plans, retention, restore hooks, and recovery integration." },
  { id: "policy", name: "Policy Center", icon: "⛨", description: "Evaluate account, network, driver, update, and storage enforcement policies." }
];

type LauncherContext = {
  openApp: (id: AppId) => void;
  lockSession: () => void;
  restartShell: () => void;
  sleepShell: () => void;
  shutdownShell: () => void;
};

export function createLauncher(context: LauncherContext) {
  const overlay = document.createElement("div");
  overlay.className = "launcher-overlay";
  overlay.innerHTML = `
    <section class="launcher-panel">
      <div class="app-toolbar">
        <div>
          <h2>Start</h2>
          <p>Pinned apps, recent files, recommendations, search, and power controls</p>
        </div>
        <input class="search-input" placeholder="Search apps" />
      </div>
      <h3>Pinned</h3>
      <div class="launcher-grid"></div>
      <div class="start-lower-grid">
        <section>
          <h3>Recommended</h3>
          <button data-app="assistant">Ask Aether to switch to gaming mode</button>
          <button data-app="nexus">Launch Aether Nexus command center</button>
          <button data-app="experience">Apply Windows-familiar Aether layout</button>
          <button data-app="ecosystem">Open Aether ecosystem hub</button>
          <button data-app="kernel">Tune scheduler and namespace prototypes</button>
          <button data-app="marketplace">Explore featured Marketplace apps</button>
          <button data-app="updates">Review update rollback options</button>
        </section>
        <section>
          <h3>Recent Files</h3>
          <button data-app="files">Design notes.md</button>
          <button data-app="files">Downloads/demo-app.aetherpkg</button>
          <button data-app="files">Pictures/wallpaper-draft.png</button>
        </section>
        <section>
          <h3>Power</h3>
          <button data-power="sleep">Sleep shell</button>
          <button data-power="restart">Restart shell</button>
          <button data-power="lock">Lock</button>
          <button data-power="shutdown">Shutdown mock</button>
        </section>
      </div>
    </section>
  `;

  const input = overlay.querySelector("input") as HTMLInputElement;
  const grid = overlay.querySelector(".launcher-grid") as HTMLElement;

  const render = () => {
    const query = input.value.toLowerCase();
    grid.innerHTML = launcherApps
      .filter((app) => `${app.name} ${app.description}`.toLowerCase().includes(query))
      .map((app) => `
        <button class="launcher-tile" data-app="${app.id}">
          <b>${app.icon}</b>
          <span>${app.name}</span>
          <small>${app.description}</small>
        </button>
      `)
      .join("");
    grid.querySelectorAll<HTMLButtonElement>("[data-app]").forEach((button) => {
      button.addEventListener("click", () => {
        context.openApp(button.dataset.app as AppId);
        hide();
      });
    });
  };

  const show = () => {
    overlay.classList.add("visible");
    input.focus();
    render();
  };
  const hide = () => overlay.classList.remove("visible");
  const toggle = () => overlay.classList.contains("visible") ? hide() : show();

  input.addEventListener("input", render);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) hide();
  });
  overlay.querySelectorAll<HTMLButtonElement>("[data-app]").forEach((button) => {
    button.addEventListener("click", () => {
      context.openApp(button.dataset.app as AppId);
      hide();
    });
  });
  overlay.querySelectorAll<HTMLButtonElement>("[data-power]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.power;
      if (action === "sleep") context.sleepShell();
      if (action === "restart") context.restartShell();
      if (action === "lock") context.lockSession();
      if (action === "shutdown") context.shutdownShell();
      hide();
    });
  });
  render();
  return { element: overlay, show, hide, toggle };
}
