import { services } from "./platform";

type ControlPanelContext = {
  openApp: (app: string) => void;
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

const devices = [
  { name: "Aether Display Adapter", status: "Healthy", driver: "aether-display 0.4.0" },
  { name: "Aether Audio Engine", status: "Healthy", driver: "aether-audio 0.3.2" },
  { name: "Virtual Input Hub", status: "Healthy", driver: "hid-bridge 1.1.0" },
  { name: "Package Trust Module", status: "Attention", driver: "pkg-trust 0.2.8" }
];

const startupApps = ["File Explorer", "Terminal", "Aether Shield", "Package Registry Daemon"];

export function createControlPanelApp(context: ControlPanelContext) {
  const root = document.createElement("div");
  root.className = "platform-app control-panel-app";
  let firewall = "Prompt for new apps";
  let envOutput = "AETHER_HOME=%APPDATA%\\AetherOS\nAETHER_CHANNEL=stable\nAETHER_SAFE_MODE=false";

  const render = () => {
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>Aether Control Panel</h2>
          <p>Advanced system tools for shell experience, ecosystem, boot, recovery, services, drivers, packages, permissions, startup, tasks, events, crashes, and updates.</p>
        </div>
        <button class="primary-btn" data-action="safe-mode">Safe Mode</button>
      </div>
      <div class="control-grid">
        <section class="details-panel">
          <h3>Windows-Familiar Shell</h3>
          <div class="button-row">
            <button class="secondary-btn" data-open="experience">Experience Center</button>
            <button class="secondary-btn" data-open="settings">Native Settings</button>
            <button class="secondary-btn" data-open="search">System Search</button>
          </div>
          <p class="small-note">Start, taskbar, widgets, shortcuts, snap layouts, default apps, and workspace behavior are managed as shell policy.</p>
        </section>
        <section class="details-panel">
          <h3>Aether Ecosystem</h3>
          <div class="button-row">
            <button class="secondary-btn" data-open="ecosystem">Ecosystem Hub</button>
            <button class="secondary-btn" data-open="marketplace">Marketplace</button>
            <button class="secondary-btn" data-open="sdk">SDK</button>
          </div>
          <p class="small-note">Store channels, app trust, extension points, protocols, publishing, and package rollback are one native platform.</p>
        </section>
        <section class="details-panel">
          <h3>Boot Targets</h3>
          ${["Normal boot", "Recovery boot", "Diagnostic boot", "Safe mode", "Last known good"].map((target) => `<div class="process-row"><span>${target}</span><strong>ready</strong></div>`).join("")}
          <div class="button-row">
            <button class="secondary-btn" data-open="boot">Open Boot Manager</button>
            <button class="secondary-btn" data-action="safe-mode">Arm Safe Mode</button>
          </div>
        </section>
        <section class="details-panel">
          <h3>Recovery Status</h3>
          <div class="process-row"><span>Recovery Supervisor</span><strong>healthy</strong></div>
          <div class="process-row"><span>Restore points</span><strong>1 ready</strong></div>
          <div class="button-row">
            <button class="secondary-btn" data-action="restore-point">Create Restore Point</button>
            <button class="secondary-btn" data-action="restore-picker">Open Restore Picker</button>
            <button class="secondary-btn" data-action="repair">Repair Registry</button>
          </div>
        </section>
        <section class="details-panel">
          <h3>Device Manager</h3>
          ${devices.map((device) => `
            <div class="process-row">
              <span>${device.name}</span>
              <strong>${device.status}</strong>
            </div>
            <p class="small-note">${device.driver}</p>
          `).join("")}
          <div class="button-row">
            <button class="secondary-btn" data-open="devices">Open Device Manager</button>
            <button class="secondary-btn" data-action="scan-devices">Scan Hardware</button>
          </div>
        </section>
        <section class="details-panel">
          <h3>Services</h3>
          ${services.map((service) => `<div class="process-row"><span>${service.name}</span><strong>${service.status}</strong></div>`).join("")}
          <div class="button-row">
            <button class="secondary-btn" data-open="services">Open Service Manager</button>
            <button class="secondary-btn" data-open="events">Service Events</button>
          </div>
        </section>
        <section class="details-panel">
          <h3>Firewall</h3>
          <label class="field-label">Runtime network policy</label>
          <select class="select-input" data-firewall>
            ${["Prompt for new apps", "Block unsigned apps", "Allow verified apps"].map((item) => `<option ${item === firewall ? "selected" : ""}>${item}</option>`).join("")}
          </select>
          <button class="secondary-btn" data-open="security">Review Security Center</button>
        </section>
        <section class="details-panel">
          <h3>Environment Variables</h3>
          <pre>${escapeText(envOutput)}</pre>
          <div class="button-row">
            <button class="secondary-btn" data-action="add-env">Add Variable</button>
            <button class="secondary-btn" data-action="copy-env">Copy</button>
            <button class="secondary-btn" data-open="registry">Registry</button>
          </div>
        </section>
        <section class="details-panel">
          <h3>Startup Apps</h3>
          ${startupApps.map((app) => `<label class="toggle-row"><span>${app}</span><input type="checkbox" checked /></label>`).join("")}
          <button class="secondary-btn" data-open="tasks">Task Scheduler</button>
        </section>
        <section class="details-panel">
          <h3>Packages and Updates</h3>
          <div class="button-row">
            <button class="secondary-btn" data-open="packages">Package Repair</button>
            <button class="secondary-btn" data-open="updates">Update Engine</button>
            <button class="secondary-btn" data-action="solve-demo">Solve demo-app</button>
          </div>
          <p class="small-note">Dependency solving, rollback plans, signed update staging, and restart-required state are tracked by root manifests.</p>
        </section>
        <section class="details-panel">
          <h3>Security and Diagnostics</h3>
          <div class="button-row">
            <button class="secondary-btn" data-open="permissions">Permission Prompts</button>
            <button class="secondary-btn" data-open="crash">Crash Reporter</button>
            <button class="secondary-btn" data-action="boot-log">Boot Logs</button>
          </div>
          <p class="small-note">Permission prompts, crash bundles, and system event streams are connected to the security and logging layers.</p>
        </section>
        <section class="details-panel">
          <h3>Network and Accounts</h3>
          <div class="button-row">
            <button class="secondary-btn" data-open="network">Network Center</button>
            <button class="secondary-btn" data-open="accounts">Account Manager</button>
            <button class="secondary-btn" data-open="audit">Audit Viewer</button>
          </div>
          <p class="small-note">Firewall profiles, secure DNS, user elevation, sessions, and audit export are policy-backed system services.</p>
        </section>
        <section class="details-panel">
          <h3>Storage, Backup, Policy</h3>
          <div class="button-row">
            <button class="secondary-btn" data-open="storage">Storage Manager</button>
            <button class="secondary-btn" data-open="backup">Backup Manager</button>
            <button class="secondary-btn" data-open="policy">Policy Center</button>
          </div>
          <p class="small-note">Volumes, quotas, encrypted backups, retention, and enforcement policies are tracked in root manifests.</p>
        </section>
      </div>
    `;

    root.querySelector<HTMLSelectElement>("[data-firewall]")?.addEventListener("change", (event) => {
      firewall = (event.target as HTMLSelectElement).value;
      context.notify("Firewall policy changed", firewall, "success");
      context.log("control-panel", `Firewall policy: ${firewall}`);
    });
    root.querySelectorAll<HTMLButtonElement>("[data-open]").forEach((button) => button.addEventListener("click", () => context.openApp(button.dataset.open ?? "")));
    root.querySelector<HTMLButtonElement>('[data-action="safe-mode"]')?.addEventListener("click", () => context.notify("Safe Mode armed", "Startup apps will be disabled on the next mock restart.", "warning"));
    root.querySelector<HTMLButtonElement>('[data-action="scan-devices"]')?.addEventListener("click", () => context.notify("Hardware scan complete", "4 devices inspected.", "success"));
    root.querySelector<HTMLButtonElement>('[data-action="repair"]')?.addEventListener("click", () => context.notify("Package registry repaired", "Registry indexes rebuilt from local package records.", "success"));
    root.querySelector<HTMLButtonElement>('[data-action="restore-point"]')?.addEventListener("click", () => context.notify("Restore point created", "Snapshot promoted to named restore point.", "success"));
    root.querySelector<HTMLButtonElement>('[data-action="restore-picker"]')?.addEventListener("click", () => context.notify("Restore picker opened", "Last known good and manual snapshots are available.", "success"));
    root.querySelector<HTMLButtonElement>('[data-action="solve-demo"]')?.addEventListener("click", () => context.notify("Dependency plan ready", "demo-app requires aether-terminal and has rollback enabled.", "success"));
    root.querySelector<HTMLButtonElement>('[data-action="boot-log"]')?.addEventListener("click", () => {
      envOutput = "Boot log:\n- Started shell\n- Restored session\n- Loaded packages\n- AetherOS ready";
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="add-env"]')?.addEventListener("click", () => {
      envOutput += "\nAETHER_DEVTOOLS=true";
      render();
    });
  };

  render();
  return root;
}

function escapeText(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}
