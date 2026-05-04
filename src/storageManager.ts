type StorageManagerContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

const volumes = [
  { id: "system", label: "Aether System", used: 188, capacity: 512, encrypted: true, health: "healthy" },
  { id: "home", label: "Home", used: 91, capacity: 256, encrypted: true, health: "healthy" },
  { id: "cache", label: "System Cache", used: 11, capacity: 32, encrypted: false, health: "trim-needed" }
];

export function createStorageManagerApp(context: StorageManagerContext) {
  const root = document.createElement("div");
  root.className = "platform-app";
  root.innerHTML = `
    <div class="app-toolbar">
      <div>
        <h2>Storage Manager</h2>
        <p>Volumes, quotas, encryption, health, cleanup targets, trim, and cache deduplication.</p>
      </div>
      <button class="primary-btn" data-action="cleanup">Run Cleanup</button>
    </div>
    <div class="platform-grid">
      ${volumes.map((volume) => {
        const percent = Math.round((volume.used / volume.capacity) * 100);
        return `
          <section class="details-panel">
            <span class="status-pill">${volume.health}</span>
            <h3>${volume.label}</h3>
            <div class="meter"><span style="width:${percent}%"></span></div>
            <dl>
              <dt>Usage</dt><dd>${volume.used}/${volume.capacity}GB (${percent}%)</dd>
              <dt>Encrypted</dt><dd>${volume.encrypted ? "yes" : "no"}</dd>
            </dl>
            <div class="button-row">
              <button class="secondary-btn" data-action="trim">Trim</button>
              <button class="secondary-btn" data-action="quota">Quota</button>
            </div>
          </section>
        `;
      }).join("")}
    </div>
  `;
  root.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => button.addEventListener("click", () => {
    context.notify("Storage action", button.dataset.action ?? "cleanup", "success");
    context.log("storage", button.dataset.action ?? "action");
  }));
  return root;
}
