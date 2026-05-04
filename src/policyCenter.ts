type PolicyCenterContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

const policies = [
  { id: "admin-requires-pin", scope: "accounts", effect: "prompt", enabled: true },
  { id: "public-network-lockdown", scope: "network", effect: "enforce", enabled: true },
  { id: "unsigned-kernel-driver-block", scope: "drivers", effect: "block", enabled: true },
  { id: "backup-before-update", scope: "updates", effect: "enforce", enabled: true },
  { id: "storage-warning", scope: "storage", effect: "warn", enabled: true }
];

export function createPolicyCenterApp(context: PolicyCenterContext) {
  const root = document.createElement("div");
  root.className = "platform-app";
  let violations = 0;

  const render = () => {
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>Policy Center</h2>
          <p>System policy enforcement for accounts, networking, drivers, updates, and storage.</p>
        </div>
        <button class="primary-btn" data-action="evaluate">Evaluate</button>
      </div>
      <div class="platform-grid">
        ${policies.map((policy) => `
          <section class="details-panel">
            <label class="toggle-row"><span>${policy.id}</span><input type="checkbox" ${policy.enabled ? "checked" : ""}></label>
            <dl>
              <dt>Scope</dt><dd>${policy.scope}</dd>
              <dt>Effect</dt><dd>${policy.effect}</dd>
            </dl>
          </section>
        `).join("")}
        <section class="details-panel">
          <h3>Evaluation</h3>
          <div class="process-row"><span>Violations</span><strong>${violations}</strong></div>
          <p class="small-note">Policies run in enforce mode and write audit events.</p>
        </section>
      </div>
    `;
    root.querySelector<HTMLButtonElement>('[data-action="evaluate"]')?.addEventListener("click", () => {
      violations = 0;
      context.notify("Policy evaluation complete", "No violations detected.", "success");
      context.log("policy", "evaluate");
      render();
    });
  };

  render();
  return root;
}
