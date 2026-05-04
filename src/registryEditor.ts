type RegistryEditorContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

const hives = [
  { id: "HKLM\\Kernel", owner: "kernel", path: "kernel/kernel.manifest.json", protected: true },
  { id: "HKLM\\Services", owner: "services", path: "services/services.manifest.json", protected: true },
  { id: "HKLM\\Drivers", owner: "drivers", path: "drivers/drivers.manifest.json", protected: true },
  { id: "HKLM\\Packages", owner: "pkg", path: "pkg/registry.json", protected: true },
  { id: "HKLM\\Security", owner: "security", path: "security/policy.json", protected: true },
  { id: "HKCU\\Shell", owner: "ui", path: "ui/shell.manifest.json", protected: false },
  { id: "HKLM\\Tasks", owner: "system", path: "config/task-scheduler.json", protected: false },
  { id: "HKLM\\Startup", owner: "system", path: "config/startup-apps.json", protected: false }
];

export function createRegistryEditorApp(context: RegistryEditorContext) {
  const root = document.createElement("div");
  root.className = "platform-app";
  let selected = hives[0];

  const render = () => {
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>Aether Registry</h2>
          <p>Kernel, services, drivers, packages, security, user, shell, task, and startup hives.</p>
        </div>
        <button class="primary-btn" data-action="snapshot">Snapshot Before Edit</button>
      </div>
      <div class="platform-grid">
        <section class="package-list">
          ${hives.map((hive) => `<button class="package-row ${hive.id === selected.id ? "selected" : ""}" data-hive="${hive.id}"><span>${hive.id}</span><small>${hive.owner}</small></button>`).join("")}
        </section>
        <section class="details-panel">
          <span class="status-pill">${selected.protected ? "protected" : "user writable"}</span>
          <h2>${selected.id}</h2>
          <dl>
            <dt>Owner</dt><dd>${selected.owner}</dd>
            <dt>Path</dt><dd>${selected.path}</dd>
            <dt>Write policy</dt><dd>${selected.protected ? "admin + snapshot required" : "user scope"}</dd>
          </dl>
          <textarea class="registry-textarea" spellcheck="false">{
  "hive": "${selected.id}",
  "owner": "${selected.owner}",
  "path": "${selected.path}",
  "protected": ${selected.protected}
}</textarea>
          <div class="button-row">
            <button class="secondary-btn" data-action="validate">Validate</button>
            <button class="secondary-btn" data-action="export">Export</button>
            <button class="secondary-btn" data-action="save">Save Draft</button>
          </div>
        </section>
      </div>
    `;
    root.querySelectorAll<HTMLButtonElement>("[data-hive]").forEach((button) => button.addEventListener("click", () => {
      selected = hives.find((hive) => hive.id === button.dataset.hive) ?? selected;
      render();
    }));
    root.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => button.addEventListener("click", () => {
      const action = button.dataset.action ?? "validate";
      context.notify("Registry action", `${action} for ${selected.id}`, action === "save" && selected.protected ? "warning" : "success");
      context.log("registry", `${action} ${selected.id}`);
    }));
  };

  render();
  return root;
}
