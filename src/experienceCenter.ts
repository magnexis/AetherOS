type ExperienceContext = {
  openApp: (app: string) => void;
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

const pinnedApps = ["File Explorer", "Settings", "Terminal", "Marketplace", "System Search", "System Monitor", "Security Center", "Aether Nexus"];
const commands = [
  ["Ctrl+K", "Command Palette"],
  ["Ctrl+Space", "Start"],
  ["Ctrl+,", "Settings"],
  ["Ctrl+Shift+E", "Experience Center"],
  ["Ctrl+Shift+H", "Ecosystem Hub"],
  ["Alt+Tab", "Window Switcher"]
];
const snapLayouts = [
  ["Side by side", "Two equal windows for familiar desktop work"],
  ["Main and sidebar", "Primary app plus assistant, settings, or files"],
  ["Four corners", "Operations dashboard layout"],
  ["Creator stack", "Preview, timeline, and tools"]
];

export function createExperienceCenterApp(context: ExperienceContext) {
  const root = document.createElement("div");
  root.className = "experience-center app-stack";
  root.innerHTML = `
    <div class="app-toolbar">
      <div>
        <h2>Aether Experience Center</h2>
        <p>Windows-familiar shell controls, upgraded with command search, safer defaults, workspaces, widgets, and Aether workflows.</p>
      </div>
      <button class="primary-btn" data-action="apply">Apply Recommended Layout</button>
    </div>
    <div class="dashboard-grid">
      <article class="details-panel">
        <h3>Start Menu</h3>
        <p class="small-note">Pinned apps, recommendations, recent files, global search, and power actions share one command registry.</p>
        <div class="permission-list">
          ${pinnedApps.map((app) => `<span>${app}</span>`).join("")}
        </div>
        <div class="button-row">
          <button class="secondary-btn" data-open="search">Search</button>
          <button class="secondary-btn" data-open="settings">Settings</button>
          <button class="secondary-btn" data-open="nexus">Nexus</button>
        </div>
      </article>
      <article class="details-panel">
        <h3>Taskbar</h3>
        <div class="process-row"><span>Alignment</span><strong>Center</strong></div>
        <div class="process-row"><span>Previews</span><strong>Enabled</strong></div>
        <div class="process-row"><span>Jump lists</span><strong>Enabled</strong></div>
        <div class="process-row"><span>Workspace filter</span><strong>Enabled</strong></div>
        <button class="secondary-btn" data-action="pin">Audit Pins</button>
      </article>
      <article class="details-panel">
        <h3>Snap Layouts</h3>
        ${snapLayouts.map(([name, body]) => `<button class="market-card" data-action="snap"><strong>${name}</strong><small>${body}</small></button>`).join("")}
      </article>
      <article class="details-panel">
        <h3>Widgets</h3>
        <div class="metric-card"><strong>System Health</strong><span>CPU, RAM, disk, Shield, and update state</span></div>
        <div class="metric-card"><strong>Featured Apps</strong><span>Marketplace picks without opening the Store</span></div>
        <div class="metric-card"><strong>Today</strong><span>Account-local calendar and session actions</span></div>
      </article>
    </div>
    <section class="details-panel">
      <h3>Registered Commands</h3>
      <div class="shortcut-grid">
        ${commands.map(([keys, command]) => `<div class="shortcut-row"><kbd>${keys}</kbd><span>${command}</span></div>`).join("")}
      </div>
    </section>
    <section class="details-panel">
      <h3>Better Than Familiar</h3>
      <div class="settings-card-grid">
        <article class="settings-card"><strong>One Search</strong><p>Apps, files, settings, packages, commands, services, and Store results in the same mental model.</p></article>
        <article class="settings-card"><strong>Permission-First Apps</strong><p>Default apps and shell extensions are capability-gated before they run.</p></article>
        <article class="settings-card"><strong>Rollback-Aware UI</strong><p>Packages, updates, and shell layout changes can point at restore metadata.</p></article>
      </div>
    </section>
  `;

  root.querySelector<HTMLButtonElement>('[data-action="apply"]')?.addEventListener("click", () => {
    context.notify("Experience layout applied", "Start, taskbar, widgets, and snap presets are aligned.", "success");
    context.log("experience", "Applied recommended Windows-familiar Aether layout");
  });
  root.querySelector<HTMLButtonElement>('[data-action="pin"]')?.addEventListener("click", () => context.notify("Pinned apps audited", "All required shell apps are pinned and searchable.", "success"));
  root.querySelectorAll<HTMLButtonElement>("[data-open]").forEach((button) => button.addEventListener("click", () => context.openApp(button.dataset.open ?? "")));
  root.querySelectorAll<HTMLButtonElement>('[data-action="snap"]').forEach((button) => button.addEventListener("click", () => context.notify("Snap layout selected", button.querySelector("strong")?.textContent ?? "Layout", "success")));
  return root;
}
