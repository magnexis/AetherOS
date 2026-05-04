type CrashReporterContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

const bundles = [
  { id: "boot-smoke-001", reason: "manual smoke bundle", status: "ready", includes: "logs, services, packages, recovery report, replay metadata" }
];

export function createCrashReporterApp(context: CrashReporterContext) {
  const root = document.createElement("div");
  root.className = "platform-app";
  let reason = "manual diagnostic bundle";

  const render = () => {
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>Crash Reporter</h2>
          <p>Crash bundles with logs, active windows, service state, package registry, recovery report, and replay metadata.</p>
        </div>
        <button class="primary-btn" data-action="bundle">Create Bundle</button>
      </div>
      <div class="platform-grid">
        <section class="details-panel">
          <h3>Bundle Contents</h3>
          <label class="field-label">Reason</label>
          <input class="search-input" data-reason value="${reason}">
          <ul class="feature-list">
            <li>System events and daemon logs</li>
            <li>Active windows and workspace state</li>
            <li>Service health and package registry</li>
            <li>Recovery report and deterministic replay metadata</li>
          </ul>
        </section>
        <section class="details-panel">
          <h3>Recent Bundles</h3>
          ${bundles.map((bundle) => `
            <div class="process-row"><span>${bundle.id}</span><strong>${bundle.status}</strong></div>
            <p class="small-note">${bundle.reason} · ${bundle.includes}</p>
          `).join("")}
        </section>
      </div>
    `;
    root.querySelector<HTMLInputElement>("[data-reason]")?.addEventListener("input", (event) => reason = (event.target as HTMLInputElement).value);
    root.querySelector<HTMLButtonElement>('[data-action="bundle"]')?.addEventListener("click", () => {
      const id = `bundle-${bundles.length + 1}`;
      bundles.unshift({ id, reason, status: "ready", includes: "logs, windows, services, packages, recovery, replay" });
      context.notify("Crash bundle created", id, "warning");
      context.log("crashd", `${id}: ${reason}`);
      render();
    });
  };

  render();
  return root;
}
