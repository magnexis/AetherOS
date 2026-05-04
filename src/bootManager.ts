type BootManagerContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  openApp: (app: string) => void;
  log: (source: string, message: string) => void;
};

const targets = [
  { id: "graphical", name: "Normal boot", services: 12, drivers: 5, flags: "quiet, splash, restore-session, verify-drivers" },
  { id: "recovery", name: "Recovery boot", services: 7, drivers: 3, flags: "safe-mode, repair-registry, verify-drivers" },
  { id: "diagnostic", name: "Diagnostic boot", services: 10, drivers: 5, flags: "verbose, trace-services, trace-drivers, capture-replay" },
  { id: "minimal", name: "Safe mode", services: 4, drivers: 3, flags: "quiet, verify-drivers" },
  { id: "last-known-good", name: "Last known good configuration", services: 12, drivers: 5, flags: "restore-point, rollback-ready" }
];

export function createBootManagerApp(context: BootManagerContext) {
  const root = document.createElement("div");
  root.className = "platform-app";
  let selected = targets[0];

  const render = () => {
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>Boot Manager</h2>
          <p>Advanced startup targets, safe mode, diagnostic tracing, and last known good configuration.</p>
        </div>
        <button class="primary-btn" data-action="apply">Apply Target</button>
      </div>
      <div class="platform-grid">
        <section class="package-list">
          ${targets.map((target) => `<button class="package-row ${target.id === selected.id ? "selected" : ""}" data-target="${target.id}"><span>${target.name}</span><small>${target.id}</small></button>`).join("")}
        </section>
        <section class="details-panel">
          <span class="status-pill">${selected.id}</span>
          <h2>${selected.name}</h2>
          <dl>
            <dt>Services</dt><dd>${selected.services}</dd>
            <dt>Drivers</dt><dd>${selected.drivers}</dd>
            <dt>Flags</dt><dd>${selected.flags}</dd>
            <dt>Rollback</dt><dd>${selected.id === "last-known-good" ? "restore point preview" : "snapshot before apply"}</dd>
          </dl>
          <div class="button-row">
            <button class="secondary-btn" data-action="plan">Preview plan</button>
            <button class="secondary-btn" data-open="recovery">Recovery tools</button>
            <button class="secondary-btn" data-open="events">Boot events</button>
          </div>
          <pre>Boot order:
init -> registry -> drivers -> eventbus -> pkgd -> recovery -> shell</pre>
        </section>
      </div>
    `;
    root.querySelectorAll<HTMLButtonElement>("[data-target]").forEach((button) => button.addEventListener("click", () => {
      selected = targets.find((target) => target.id === button.dataset.target) ?? selected;
      render();
    }));
    root.querySelector<HTMLButtonElement>('[data-action="apply"]')?.addEventListener("click", () => {
      context.notify("Boot target armed", `${selected.name} will be used on next shell restart.`, selected.id === "graphical" ? "success" : "warning");
      context.log("boot-manager", `Applied target ${selected.id}`);
    });
    root.querySelector<HTMLButtonElement>('[data-action="plan"]')?.addEventListener("click", () => context.notify("Boot plan ready", `${selected.services} services and ${selected.drivers} drivers resolved.`, "success"));
    root.querySelectorAll<HTMLButtonElement>("[data-open]").forEach((button) => button.addEventListener("click", () => context.openApp(button.dataset.open ?? "")));
  };

  render();
  return root;
}
