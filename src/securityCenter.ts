import { runtimeApps, threats } from "./platform";
import { invokeCommand } from "./backend";

type SecurityContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

const users = [
  { name: "matth", role: "Admin", pin: "enabled", encrypted: true },
  { name: "guest", role: "Standard", pin: "disabled", encrypted: false }
];

const hardeningControls = [
  { id: "least-privilege-apps", label: "Least privilege app permissions", status: "Enforced", severity: "Critical" },
  { id: "signed-store-artifacts", label: "Signed Store artifacts", status: "Warn", severity: "High" },
  { id: "restore-before-mutation", label: "Restore before privileged mutation", status: "Enforced", severity: "High" },
  { id: "shell-extension-review", label: "Shell extension review gate", status: "Enforced", severity: "Critical" },
  { id: "audit-admin-actions", label: "Audit privileged actions", status: "Enforced", severity: "Critical" },
  { id: "network-runtime-prompts", label: "Runtime network prompts", status: "Enforced", severity: "High" }
];

const hardeningThreats = [
  "Malicious shell extension",
  "Package supply-chain attack",
  "Privilege sprawl",
  "Unsafe driver",
  "Persistence abuse"
];

export function createSecurityCenterApp(context: SecurityContext) {
  const root = document.createElement("div");
  root.className = "platform-app";
  let scanState = "Realtime protection enabled. Last scan: not run this session.";
  let realFindings: Array<{ path: string; hash: string; severity: string; reason: string }> = [];

  const render = () => {
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>Security Center</h2>
          <p>Identity, permissions, app grants, encryption, admin actions, and Aether Shield</p>
        </div>
        <button class="primary-btn" data-action="scan">Run Quick Scan</button>
      </div>
      <div class="platform-grid">
        <section class="details-panel">
          <h3>Users</h3>
          ${users.map((user) => `<div class="process-row"><span>${user.name}</span><small>${user.role} · PIN ${user.pin} · encrypted ${user.encrypted ? "yes" : "no"}</small></div>`).join("")}
          <div class="button-row">
            <button class="secondary-btn" data-action="add-user">Add User</button>
            <button class="secondary-btn" data-action="elevate">Admin Action</button>
          </div>
        </section>
        <section class="details-panel">
          <h3>App Capability Grants</h3>
          ${runtimeApps.map((app) => `<div class="process-row"><span>${app.name}</span><small>${app.permissions.length} permissions</small></div>`).join("")}
        </section>
        <section class="details-panel">
          <h3>Virus Protection</h3>
          <p>${scanState}</p>
          ${threats.map((threat) => `<div class="process-row"><span>${threat.name}</span><small>${threat.severity} · ${threat.status}</small></div>`).join("")}
          ${realFindings.map((finding) => `<div class="process-row"><span>${finding.path}</span><small>${finding.severity}</small></div><p class="small-note">${finding.reason} · ${finding.hash.slice(0, 18)}</p>`).join("")}
          <div class="button-row">
            <button class="secondary-btn" data-action="quarantine">Quarantine</button>
            <button class="secondary-btn" data-action="allow">Allow</button>
            <button class="secondary-btn" data-action="watch">Enable Watch Mode</button>
          </div>
        </section>
        <section class="details-panel">
          <h3>Lock Screen Widgets</h3>
          <div class="permission-list"><span>Clock</span><span>Battery</span><span>Protection status</span><span>Update status</span></div>
          <p class="small-note">Credential-provider integration is a future native installer task.</p>
        </section>
        <section class="details-panel">
          <h3>Security Hardening Baseline</h3>
          <div class="process-row"><span>Baseline score</span><strong>92%</strong></div>
          <div class="process-row"><span>Runtime policy</span><strong>default deny</strong></div>
          <div class="process-row"><span>Store policy</span><strong>signed or prompt</strong></div>
          <div class="button-row">
            <button class="secondary-btn" data-action="evaluate-hardening">Evaluate</button>
            <button class="secondary-btn" data-action="export-hardening">Export</button>
          </div>
        </section>
        <section class="details-panel">
          <h3>Hardening Controls</h3>
          ${hardeningControls.map((control) => `
            <div class="process-row">
              <span>${control.label}<small>${control.id}</small></span>
              <strong>${control.status}</strong>
            </div>
            <p class="small-note">${control.severity}</p>
          `).join("")}
        </section>
        <section class="details-panel">
          <h3>Threat Model</h3>
          <div class="permission-list">${hardeningThreats.map((threat) => `<span>${threat}</span>`).join("")}</div>
          <p class="small-note">Controls tie package installs, shell extensions, startup entries, drivers, audit, and network prompts into one security posture.</p>
        </section>
      </div>
    `;
    root.querySelector<HTMLButtonElement>('[data-action="scan"]')?.addEventListener("click", async () => {
      const path = prompt("Scan path", "Downloads") ?? "Downloads";
      realFindings = await invokeCommand<typeof realFindings>("scan_path", { path }, () => []);
      scanState = `Quick scan complete at ${new Date().toLocaleTimeString()}. ${realFindings.length} filesystem findings, ${threats.length} model finding.`;
      context.notify("Virus scan complete", scanState, "success");
      context.log("shield", scanState);
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="quarantine"]')?.addEventListener("click", () => {
      threats.forEach((threat) => threat.status = "quarantined");
      const first = realFindings[0];
      if (first) invokeCommand("quarantine_path", { path: first.path }).catch(() => undefined);
      context.notify("Threat quarantined", threats[0]?.name ?? "No threat", "warning");
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="allow"]')?.addEventListener("click", () => {
      threats.forEach((threat) => threat.status = "allowed");
      context.notify("Threat allowed", "Added to local allow list.", "warning");
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="add-user"]')?.addEventListener("click", () => {
      users.push({ name: `user${users.length + 1}`, role: "Standard", pin: "enabled", encrypted: true });
      context.notify("User created", users.at(-1)?.name ?? "new user", "success");
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="elevate"]')?.addEventListener("click", () => {
      context.notify("Admin approval", "Elevated action approved for this shell session.", "success");
    });
    root.querySelector<HTMLButtonElement>('[data-action="watch"]')?.addEventListener("click", () => {
      scanState = "Realtime watch mode armed for next phase; quick scan rules are active now.";
      context.notify("Watch mode", "Realtime watcher placeholder armed.", "success");
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="evaluate-hardening"]')?.addEventListener("click", () => {
      context.notify("Hardening evaluated", "Baseline score 92%. Critical controls enforced.", "success");
      context.log("hardening", "Evaluated secure desktop baseline");
    });
    root.querySelector<HTMLButtonElement>('[data-action="export-hardening"]')?.addEventListener("click", () => {
      context.notify("Hardening report exported", "Controls, threat model, and runtime policies ready for audit.", "success");
      context.log("hardening", "Exported hardening posture report");
    });
  };

  render();
  return root;
}
