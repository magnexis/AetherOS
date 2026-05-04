type TaskSchedulerContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

const tasks = [
  { id: "scan-downloads", name: "Scan Downloads", trigger: "login", enabled: true, capability: "filesystem.scan", action: "scan Downloads" },
  { id: "package-refresh", name: "Refresh Package Registry", trigger: "interval:6h", enabled: true, capability: "packages.manage", action: "pkg refresh" },
  { id: "restore-point-nightly", name: "Nightly Restore Point", trigger: "idle", enabled: true, capability: "recovery.snapshot", action: "recovery snapshot nightly" },
  { id: "crash-bundle-on-fault", name: "Crash Bundle on Service Fault", trigger: "event:service.faulted", enabled: true, capability: "crash.bundle", action: "crash bundle service" }
];

export function createTaskSchedulerApp(context: TaskSchedulerContext) {
  const root = document.createElement("div");
  root.className = "platform-app";

  const render = () => {
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>Aether Task Scheduler</h2>
          <p>Run at login, on interval, on event, when idle, and with capability tokens.</p>
        </div>
        <button class="primary-btn" data-action="new">New Task</button>
      </div>
      <div class="platform-grid">
        ${tasks.map((task) => `
          <section class="details-panel">
            <label class="toggle-row"><span>${task.name}</span><input type="checkbox" data-toggle="${task.id}" ${task.enabled ? "checked" : ""}></label>
            <dl>
              <dt>Trigger</dt><dd>${task.trigger}</dd>
              <dt>Capability</dt><dd>${task.capability}</dd>
              <dt>Action</dt><dd>${task.action}</dd>
            </dl>
            <div class="button-row">
              <button class="secondary-btn" data-run="${task.id}">Run now</button>
              <button class="secondary-btn" data-history="${task.id}">History</button>
            </div>
          </section>
        `).join("")}
      </div>
    `;
    root.querySelector<HTMLButtonElement>('[data-action="new"]')?.addEventListener("click", () => context.notify("Task drafted", "New capability-gated task created as a draft.", "success"));
    root.querySelectorAll<HTMLInputElement>("[data-toggle]").forEach((input) => input.addEventListener("change", () => {
      const task = tasks.find((candidate) => candidate.id === input.dataset.toggle);
      if (!task) return;
      task.enabled = input.checked;
      context.log("taskd", `${task.id} ${task.enabled ? "enabled" : "disabled"}`);
    }));
    root.querySelectorAll<HTMLButtonElement>("[data-run]").forEach((button) => button.addEventListener("click", () => context.notify("Task executed", button.dataset.run ?? "", "success")));
    root.querySelectorAll<HTMLButtonElement>("[data-history]").forEach((button) => button.addEventListener("click", () => context.notify("Task history", `${button.dataset.history}: last run pending event bus replay.`)));
  };

  render();
  return root;
}
