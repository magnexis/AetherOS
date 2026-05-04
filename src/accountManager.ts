type AccountManagerContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

const users = [
  { id: "matth", displayName: "Matth", role: "admin", encrypted: true, auth: "PIN + password", state: "active" },
  { id: "guest", displayName: "Guest", role: "standard", encrypted: false, auth: "temporary", state: "allowed" }
];

export function createAccountManagerApp(context: AccountManagerContext) {
  const root = document.createElement("div");
  root.className = "platform-app";
  let lockAfter = 15;

  const render = () => {
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>Account Manager</h2>
          <p>Users, roles, PIN/password auth, elevation prompts, session state, and encrypted user data.</p>
        </div>
        <button class="primary-btn" data-action="add">Add User</button>
      </div>
      <div class="platform-grid">
        ${users.map((user) => `
          <section class="details-panel">
            <span class="status-pill">${user.state}</span>
            <h3>${user.displayName}</h3>
            <dl>
              <dt>Role</dt><dd>${user.role}</dd>
              <dt>Auth</dt><dd>${user.auth}</dd>
              <dt>Encrypted</dt><dd>${user.encrypted ? "yes" : "no"}</dd>
            </dl>
            <div class="button-row">
              <button class="secondary-btn" data-action="pin" data-user="${user.id}">Reset PIN</button>
              <button class="secondary-btn" data-action="elevate" data-user="${user.id}">Test Elevation</button>
            </div>
          </section>
        `).join("")}
        <section class="details-panel">
          <h3>Session Policy</h3>
          <label class="field-label">Lock after minutes</label>
          <input class="search-input" type="number" min="1" max="120" value="${lockAfter}" data-lock>
          <p class="small-note">Admin actions require PIN. Guest access is enabled.</p>
        </section>
      </div>
    `;
    root.querySelector<HTMLInputElement>("[data-lock]")?.addEventListener("input", (event) => lockAfter = Number((event.target as HTMLInputElement).value));
    root.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => button.addEventListener("click", () => {
      const action = button.dataset.action ?? "add";
      context.notify("Account action", `${action} ${button.dataset.user ?? ""}`, action === "elevate" ? "warning" : "success");
      context.log("accounts", action);
    }));
  };

  render();
  return root;
}
