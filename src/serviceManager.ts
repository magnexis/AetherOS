import { services, type ServiceRecord } from "./platform";

type ServiceContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

export function createServiceManagerApp(context: ServiceContext) {
  const root = document.createElement("div");
  root.className = "platform-app";
  let selected = services[0].id;

  const changeStatus = (service: ServiceRecord, status: ServiceRecord["status"], note: string) => {
    service.status = status;
    service.logs = [`${new Date().toLocaleTimeString()} ${note}`, ...service.logs].slice(0, 8);
    context.notify("Service updated", `${service.name}: ${status}`, status === "running" ? "success" : "warning");
    context.log("services", `${service.id} ${status}`);
    render();
  };

  const render = () => {
    const service = services.find((candidate) => candidate.id === selected) ?? services[0];
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>Service Manager</h2>
          <p>Boot services, health, logs, restart policy, permissions, and developer services</p>
        </div>
        <button class="primary-btn" data-action="create">Create Service</button>
      </div>
      <div class="platform-grid">
        <section class="package-list">
          ${services.map((candidate) => `
            <button class="package-row ${candidate.id === selected ? "selected" : ""}" data-service="${candidate.id}">
              <span>${candidate.name}</span><small>${candidate.status}</small>
            </button>
          `).join("")}
        </section>
        <section class="details-panel">
          <span class="status-pill">${service.status} · boot ${service.boot ? "on" : "off"}</span>
          <h2>${service.name}</h2>
          <p>Restart policy: ${service.restartPolicy}</p>
          <div class="permission-list">${service.permissions.map((permission) => `<span>${permission}</span>`).join("")}</div>
          <div class="button-row">
            <button class="primary-btn" data-action="start">Start</button>
            <button class="secondary-btn" data-action="stop">Stop</button>
            <button class="secondary-btn" data-action="restart">Restart</button>
            <button class="secondary-btn" data-action="boot">Toggle Boot</button>
            <button class="secondary-btn" data-action="crash">Simulate Crash</button>
          </div>
          <h3>Logs</h3>
          <pre>${service.logs.join("\n")}</pre>
        </section>
      </div>
    `;
    root.querySelectorAll<HTMLButtonElement>("[data-service]").forEach((button) => button.addEventListener("click", () => {
      selected = button.dataset.service ?? selected;
      render();
    }));
    root.querySelector<HTMLButtonElement>('[data-action="start"]')?.addEventListener("click", () => changeStatus(service, "running", "started"));
    root.querySelector<HTMLButtonElement>('[data-action="stop"]')?.addEventListener("click", () => changeStatus(service, "stopped", "stopped"));
    root.querySelector<HTMLButtonElement>('[data-action="restart"]')?.addEventListener("click", () => changeStatus(service, "running", "restarted"));
    root.querySelector<HTMLButtonElement>('[data-action="crash"]')?.addEventListener("click", () => changeStatus(service, "crashed", "crash detected; policy evaluated"));
    root.querySelector<HTMLButtonElement>('[data-action="boot"]')?.addEventListener("click", () => {
      service.boot = !service.boot;
      service.logs = [`Boot ${service.boot ? "enabled" : "disabled"}`, ...service.logs];
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="create"]')?.addEventListener("click", () => {
      const id = `svc-${services.length + 1}`;
      services.push({ id, name: `Developer Service ${services.length + 1}`, status: "stopped", boot: false, restartPolicy: "on-failure", permissions: ["notifications"], logs: ["Created by Service Manager"] });
      selected = id;
      render();
    });
  };

  render();
  return root;
}
