type PermissionCenterContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

type RequestStatus = "pending" | "approved" | "denied";

const requests: Array<{ id: string; app: string; capability: string; reason: string; status: RequestStatus }> = [
  { id: "req-files-demo", app: "demo-app", capability: "filesystem.read", reason: "Read project files for preview", status: "pending" },
  { id: "req-terminal-runner", app: "dev.runner", capability: "terminal.exec", reason: "Run local build commands", status: "pending" },
  { id: "req-notes-notify", app: "notes.studio", capability: "notifications", reason: "Show save reminders", status: "approved" },
  { id: "req-pkg", app: "dev.runner", capability: "packages.manage", reason: "Install SDK test packages", status: "denied" }
];

export function createPermissionCenterApp(context: PermissionCenterContext) {
  const root = document.createElement("div");
  root.className = "platform-app";

  const render = () => {
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>Permission Prompt Center</h2>
          <p>Filesystem, notifications, terminal, packages, services, network, and settings capability requests.</p>
        </div>
        <button class="primary-btn" data-action="audit">Run Audit</button>
      </div>
      <div class="platform-grid">
        ${requests.map((request) => `
          <section class="details-panel">
            <span class="status-pill">${request.status}</span>
            <h3>${request.app}</h3>
            <p>${request.capability}</p>
            <p class="small-note">${request.reason}</p>
            <div class="button-row">
              <button class="secondary-btn" data-id="${request.id}" data-status="approved">Approve</button>
              <button class="secondary-btn" data-id="${request.id}" data-status="denied">Deny</button>
              <button class="secondary-btn" data-id="${request.id}" data-status="pending">Ask again</button>
            </div>
          </section>
        `).join("")}
      </div>
    `;
    root.querySelector<HTMLButtonElement>('[data-action="audit"]')?.addEventListener("click", () => context.notify("Permission audit complete", `${requests.length} app requests reviewed.`, "success"));
    root.querySelectorAll<HTMLButtonElement>("[data-status]").forEach((button) => button.addEventListener("click", () => {
      const request = requests.find((candidate) => candidate.id === button.dataset.id);
      if (!request) return;
      request.status = button.dataset.status as RequestStatus;
      context.notify("Permission updated", `${request.app}: ${request.capability} -> ${request.status}`, request.status === "approved" ? "success" : "warning");
      context.log("permissions", `${request.id} ${request.status}`);
      render();
    }));
  };

  render();
  return root;
}
