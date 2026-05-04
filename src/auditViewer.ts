type AuditViewerContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

const records = [
  { category: "auth", level: "audit", actor: "matth", message: "Session unlocked" },
  { category: "admin", level: "audit", actor: "matth", message: "Opened Control Panel" },
  { category: "policy", level: "warning", actor: "policyd", message: "Public sharing policy verified" }
];

export function createAuditViewerApp(context: AuditViewerContext) {
  const root = document.createElement("div");
  root.className = "platform-app";
  let category = "all";

  const render = () => {
    const visible = category === "all" ? records : records.filter((record) => record.category === category);
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>Audit Viewer</h2>
          <p>Authentication, admin, network, storage, policy, and backup audit trails.</p>
        </div>
        <select class="select-input" data-category>
          ${["all", "auth", "admin", "network", "storage", "policy", "backup"].map((item) => `<option ${item === category ? "selected" : ""}>${item}</option>`).join("")}
        </select>
      </div>
      <section class="details-panel">
        ${visible.map((record) => `<div class="process-row"><span>${record.category} · ${record.actor} · ${record.message}</span><strong>${record.level}</strong></div>`).join("")}
        <div class="button-row">
          <button class="secondary-btn" data-action="write">Write Test Audit</button>
          <button class="secondary-btn" data-action="export">Export</button>
        </div>
      </section>
    `;
    root.querySelector<HTMLSelectElement>("[data-category]")?.addEventListener("change", (event) => {
      category = (event.target as HTMLSelectElement).value;
      render();
    });
    root.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => button.addEventListener("click", () => {
      const action = button.dataset.action ?? "write";
      if (action === "write") records.unshift({ category: category === "all" ? "admin" : category, level: "audit", actor: "operator", message: "Manual audit event" });
      context.notify("Audit action", action, "success");
      context.log("audit", action);
      render();
    }));
  };

  render();
  return root;
}
