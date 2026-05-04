export type SessionState = {
  userName: string;
  locked: boolean;
  lastLogin: string;
};

type SessionContext = {
  session: SessionState;
  updateSession: (patch: Partial<SessionState>) => void;
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
};

export function createSessionOverlay(context: SessionContext) {
  const overlay = document.createElement("div");
  overlay.className = "lock-overlay";

  const render = () => {
    overlay.classList.toggle("visible", context.session.locked);
    overlay.innerHTML = `
      <section class="lock-panel">
        <div class="lock-avatar">${context.session.userName.slice(0, 1).toUpperCase()}</div>
        <h1>AetherOS</h1>
        <p>${context.session.userName}</p>
        <input class="search-input" type="password" placeholder="Enter any password" />
        <button class="primary-btn" id="unlock-button">Unlock Session</button>
        <small>Last login: ${context.session.lastLogin || "new session"}</small>
      </section>
    `;
    overlay.querySelector<HTMLButtonElement>("#unlock-button")?.addEventListener("click", unlock);
    overlay.querySelector<HTMLInputElement>("input")?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") unlock();
    });
  };

  const unlock = () => {
    context.updateSession({ locked: false, lastLogin: new Date().toLocaleString() });
    context.notify("Session unlocked", `Welcome back, ${context.session.userName}.`, "success");
  };

  render();
  return { element: overlay, render };
}

type NotificationCenterContext = {
  getNotifications: () => Array<{ title: string; body: string; time: string; tone: string }>;
  getQuickSettings: () => {
    theme: "dark" | "light";
    doNotDisturb: boolean;
    compactDock: boolean;
    performanceProfile: string;
  };
  toggleTheme: () => void;
  toggleDoNotDisturb: () => void;
  toggleCompactDock: () => void;
  openApp: (app: string) => void;
  lockSession: () => void;
};

export function createNotificationCenter(context: NotificationCenterContext) {
  const panel = document.createElement("aside");
  panel.className = "notification-center";

  const render = () => {
    const notifications = context.getNotifications();
    const quick = context.getQuickSettings();
    panel.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>Action Center</h2>
          <p>Quick controls, system health, and event history</p>
        </div>
        <button class="secondary-btn" data-action="close">Close</button>
      </div>
      <div class="quick-grid">
        <button data-action="theme"><strong>${quick.theme === "dark" ? "Dark" : "Light"}</strong><span>Theme</span></button>
        <button data-action="dnd"><strong>${quick.doNotDisturb ? "On" : "Off"}</strong><span>Do not disturb</span></button>
        <button data-action="dock"><strong>${quick.compactDock ? "Compact" : "Full"}</strong><span>Dock</span></button>
        <button data-action="settings"><strong>${quick.performanceProfile}</strong><span>Performance</span></button>
        <button data-action="search"><strong>Ctrl K</strong><span>Search</span></button>
        <button data-action="lock"><strong>Lock</strong><span>Session</span></button>
      </div>
      <div class="action-links">
        <button class="secondary-btn" data-action="marketplace">Marketplace</button>
        <button class="secondary-btn" data-action="security">Security</button>
        <button class="secondary-btn" data-action="updates">Updates</button>
        <button class="secondary-btn" data-action="monitor">Monitor</button>
      </div>
      <div class="notification-list">
        ${notifications.map((item) => `
          <article class="notification-item ${item.tone}">
            <strong>${item.title}</strong>
            <p>${item.body}</p>
            <small>${item.time}</small>
          </article>
        `).join("") || `<p class="small-note">No notifications yet.</p>`}
      </div>
    `;
    panel.querySelector<HTMLButtonElement>('[data-action="close"]')?.addEventListener("click", hide);
    panel.querySelector<HTMLButtonElement>('[data-action="theme"]')?.addEventListener("click", () => {
      context.toggleTheme();
      render();
    });
    panel.querySelector<HTMLButtonElement>('[data-action="dnd"]')?.addEventListener("click", () => {
      context.toggleDoNotDisturb();
      render();
    });
    panel.querySelector<HTMLButtonElement>('[data-action="dock"]')?.addEventListener("click", () => {
      context.toggleCompactDock();
      render();
    });
    panel.querySelector<HTMLButtonElement>('[data-action="settings"]')?.addEventListener("click", () => context.openApp("settings"));
    panel.querySelector<HTMLButtonElement>('[data-action="search"]')?.addEventListener("click", () => context.openApp("search"));
    panel.querySelector<HTMLButtonElement>('[data-action="lock"]')?.addEventListener("click", context.lockSession);
    panel.querySelector<HTMLButtonElement>('[data-action="marketplace"]')?.addEventListener("click", () => context.openApp("marketplace"));
    panel.querySelector<HTMLButtonElement>('[data-action="security"]')?.addEventListener("click", () => context.openApp("security"));
    panel.querySelector<HTMLButtonElement>('[data-action="updates"]')?.addEventListener("click", () => context.openApp("updates"));
    panel.querySelector<HTMLButtonElement>('[data-action="monitor"]')?.addEventListener("click", () => context.openApp("monitor"));
  };

  const show = () => {
    render();
    panel.classList.add("visible");
  };
  const hide = () => panel.classList.remove("visible");
  const toggle = () => panel.classList.contains("visible") ? hide() : show();
  return { element: panel, render, show, hide, toggle };
}
