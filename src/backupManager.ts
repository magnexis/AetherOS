type BackupManagerContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

const plans = [
  { id: "system-daily", name: "System Daily", schedule: "daily:02:00", enabled: true, retention: 7, targets: "config, kernel, services, drivers, pkg, security" },
  { id: "home-weekly", name: "Home Weekly", schedule: "weekly:sunday:03:00", enabled: true, retention: 4, targets: "home" },
  { id: "developer-before-build", name: "Developer Pre-Build", schedule: "event:before-release-build", enabled: false, retention: 3, targets: "config, pkg, ui" }
];

export function createBackupManagerApp(context: BackupManagerContext) {
  const root = document.createElement("div");
  root.className = "platform-app";
  const runs: string[] = ["system-daily ready · 42MB"];

  const render = () => {
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>Backup Manager</h2>
          <p>Encrypted backup plans, retention, verification, restore hooks, and recovery integration.</p>
        </div>
        <button class="primary-btn" data-action="run-all">Run Enabled</button>
      </div>
      <div class="platform-grid">
        ${plans.map((plan) => `
          <section class="details-panel">
            <label class="toggle-row"><span>${plan.name}</span><input type="checkbox" ${plan.enabled ? "checked" : ""}></label>
            <dl>
              <dt>Schedule</dt><dd>${plan.schedule}</dd>
              <dt>Retention</dt><dd>${plan.retention}</dd>
              <dt>Targets</dt><dd>${plan.targets}</dd>
            </dl>
            <button class="secondary-btn" data-plan="${plan.id}">Run now</button>
          </section>
        `).join("")}
        <section class="details-panel">
          <h3>Recent Runs</h3>
          ${runs.map((run) => `<div class="process-row"><span>${run}</span><strong>verified</strong></div>`).join("")}
        </section>
      </div>
    `;
    root.querySelectorAll<HTMLButtonElement>("[data-plan], [data-action]").forEach((button) => button.addEventListener("click", () => {
      const plan = button.dataset.plan ?? "enabled plans";
      runs.unshift(`${plan} ready · ${Math.floor(24 + Math.random() * 64)}MB`);
      context.notify("Backup complete", plan, "success");
      context.log("backup", plan);
      render();
    }));
  };

  render();
  return root;
}
