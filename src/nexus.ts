import { getPackages } from "./packageManager";
import { services, threats, updates } from "./platform";
import type { AetherSettings } from "./settings";
import type { AppId, WindowManager } from "./windows";

type NexusContext = {
  openApp: (app: string) => void;
  updateSettings: (patch: Partial<AetherSettings>) => void;
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
  windowManager: WindowManager;
};

type NexusMode = {
  id: string;
  name: string;
  accent: string;
  profile: AetherSettings["performanceProfile"];
  apps: AppId[];
  description: string;
};

type AutomationRule = {
  id: string;
  name: string;
  trigger: string;
  action: string;
  tone: "info" | "success" | "warning";
};

const nexusModes: NexusMode[] = [
  {
    id: "hyperflow",
    name: "Game Dev Hyperflow",
    accent: "GPU lane",
    profile: "Gaming",
    apps: ["terminal", "files", "monitor", "kernel"],
    description: "Opens tooling for engine work, raises performance profile, and pins live diagnostics."
  },
  {
    id: "secure-ops",
    name: "Secure Ops",
    accent: "Shield lane",
    profile: "Balanced",
    apps: ["security", "services", "developer", "updates"],
    description: "Centers permissions, services, logs, and rollback controls for hardened sessions."
  },
  {
    id: "creator",
    name: "Creator Studio",
    accent: "Focus lane",
    profile: "Balanced",
    apps: ["files", "marketplace", "assistant", "settings"],
    description: "Arranges files, marketplace extensions, assistant actions, and personalization."
  },
  {
    id: "recovery",
    name: "Recovery Tunnel",
    accent: "Repair lane",
    profile: "Battery Saver",
    apps: ["updates", "control", "packages", "developer"],
    description: "Loads repair, registry, rollback, and diagnostic surfaces for bad shell states."
  }
];

const automationRules: AutomationRule[] = [
  {
    id: "thermal-guard",
    name: "Thermal Guard",
    trigger: "CPU or GPU pressure stays above 85%",
    action: "Switch profile to Balanced, notify user, and open System Monitor",
    tone: "warning"
  },
  {
    id: "package-scan",
    name: "Package Scan Chain",
    trigger: "A package or .aetherpkg file installs",
    action: "Run Shield scan, verify signature placeholder, record rollback point",
    tone: "success"
  },
  {
    id: "focus-restore",
    name: "Focus Restore",
    trigger: "Workspace layout drifts from saved template",
    action: "Restore snapped windows and reopen missing tools",
    tone: "info"
  },
  {
    id: "crash-replay",
    name: "Crash Replay Capture",
    trigger: "Runtime app exits unexpectedly",
    action: "Open Developer Console and Kernel Lab replay timeline",
    tone: "warning"
  }
];

const timeline = [
  "Boot: service manager started indexer, package daemon, and shield",
  "Session: restored window layout, settings, notifications, and registry",
  "Kernel Lab: replay stream armed for deterministic diagnostics",
  "Marketplace: verified local publishing lane and featured apps",
  "Nexus: command mesh linked apps, automation, and workspaces"
];

const commandMesh = [
  { label: "Open Ops Stack", apps: ["monitor", "services", "developer", "security"] },
  { label: "Open Build Stack", apps: ["sdk", "runtime", "packages", "marketplace"] },
  { label: "Open Recovery Stack", apps: ["updates", "control", "developer", "files"] },
  { label: "Open Core Research", apps: ["kernel", "monitor", "terminal", "search"] }
];

export function createNexusApp(context: NexusContext) {
  const root = document.createElement("div");
  root.className = "nexus-app";
  let activeMode = nexusModes[0].id;
  let selectedRule = automationRules[0].id;
  let automationRuns = 0;
  let healthScore = 94;
  let graphPulse = 0;
  let timelineIndex = timeline.length - 1;
  const liveLog: string[] = ["Nexus online: graph, automations, modes, repair, and time ribbon armed."];

  const pushLog = (message: string) => {
    liveLog.unshift(`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${message}`);
    liveLog.splice(7);
    context.log("nexus", message);
  };

  const render = () => {
    const mode = nexusModes.find((candidate) => candidate.id === activeMode) ?? nexusModes[0];
    const rule = automationRules.find((candidate) => candidate.id === selectedRule) ?? automationRules[0];
    const windows = context.windowManager.list();
    const installedPackages = getPackages().filter((pkg) => pkg.installed);
    const runningServices = services.filter((service) => service.status === "running");
    const unresolvedThreats = threats.filter((threat) => threat.status === "detected");
    root.innerHTML = `
      <div class="app-toolbar nexus-toolbar">
        <div>
          <h2>Aether Nexus</h2>
          <p>Command center for modes, automation, self-healing, workspaces, packages, services, and kernel diagnostics</p>
        </div>
        <div class="button-row">
          <button class="secondary-btn" data-action="pulse">Pulse Graph</button>
          <button class="primary-btn" data-action="repair">Self-Heal</button>
        </div>
      </div>

      <section class="nexus-hero">
        <div>
          <span class="status-pill">Active mode · ${mode.name}</span>
          <h1>${mode.accent}</h1>
          <p>${mode.description}</p>
        </div>
        <div class="nexus-stat-grid">
          ${statCard("Health", `${healthScore}%`, "Self-healing confidence")}
          ${statCard("Windows", String(windows.length), "Across workspaces")}
          ${statCard("Packages", String(installedPackages.length), "Installed")}
          ${statCard("Services", String(runningServices.length), "Running")}
          ${statCard("Alerts", String(unresolvedThreats.length), "Shield detections")}
          ${statCard("Updates", String(updates.length), "Channels tracked")}
        </div>
      </section>

      <div class="nexus-grid">
        <section class="details-panel nexus-panel">
          <h3>Live System Graph</h3>
          <div class="nexus-map" data-pulse="${graphPulse % 4}">
            ${graphNode("Shell", "desktop + compositor", "core")}
            ${graphNode("Apps", `${windows.length} windows`, "app")}
            ${graphNode("Services", `${runningServices.length} running`, "service")}
            ${graphNode("AetherPkg", `${installedPackages.length} installed`, "package")}
            ${graphNode("Shield", `${unresolvedThreats.length} alerts`, "security")}
            ${graphNode("Kernel Lab", "SASOS + replay", "kernel")}
            ${graphNode("Search", "index + commands", "search")}
          </div>
          <div class="button-row">
            <button class="secondary-btn" data-open="monitor">Monitor</button>
            <button class="secondary-btn" data-open="services">Services</button>
            <button class="secondary-btn" data-open="kernel">Kernel Lab</button>
          </div>
        </section>

        <section class="details-panel nexus-panel">
          <h3>Workspace Choreography</h3>
          <div class="mode-grid">
            ${nexusModes.map((candidate) => `
              <button class="${candidate.id === activeMode ? "selected" : ""}" data-mode="${candidate.id}">
                <strong>${candidate.name}</strong>
                <span>${candidate.accent}</span>
                <small>${candidate.apps.join(" + ")}</small>
              </button>
            `).join("")}
          </div>
          <button class="primary-btn full-width" data-action="launch-mode">Launch Selected Mode</button>
        </section>

        <section class="details-panel nexus-panel">
          <h3>Automation Rules</h3>
          <div class="automation-list">
            ${automationRules.map((candidate) => `
              <button class="${candidate.id === selectedRule ? "selected" : ""}" data-rule="${candidate.id}">
                <strong>${candidate.name}</strong>
                <span>${candidate.trigger}</span>
              </button>
            `).join("")}
          </div>
          <div class="automation-detail">
            <span class="status-pill">Runs · ${automationRuns}</span>
            <p><strong>${rule.name}</strong></p>
            <p>${rule.action}</p>
            <button class="primary-btn" data-action="run-rule">Run Rule</button>
          </div>
        </section>

        <section class="details-panel nexus-panel">
          <h3>Self-Healing Diagnostics</h3>
          <div class="repair-stack">
            ${repairItem("Shell drift", "Window state, dock filters, theme, and shortcut registry inspected.", healthScore > 88)}
            ${repairItem("Package registry", "JSON registry checksum, rollback snapshot, and dependency map checked.", installedPackages.length >= 5)}
            ${repairItem("Service mesh", "Boot services, restart policies, and health logs checked.", runningServices.length >= 3)}
            ${repairItem("Replay buffer", "Crash replay stream ready in Kernel Lab.", true)}
          </div>
          <div class="button-row">
            <button class="secondary-btn" data-action="replay">Open Replay</button>
            <button class="secondary-btn" data-action="export">Export Report</button>
          </div>
        </section>

        <section class="details-panel nexus-panel">
          <h3>Time Ribbon</h3>
          <div class="timeline-ribbon">
            ${timeline.map((item, index) => `
              <button class="${index === timelineIndex ? "selected" : ""}" data-time="${index}">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <strong>${item}</strong>
              </button>
            `).join("")}
          </div>
          <button class="secondary-btn full-width" data-action="advance-time">Advance Ribbon</button>
        </section>

        <section class="details-panel nexus-panel">
          <h3>Command Mesh</h3>
          <div class="command-mesh">
            ${commandMesh.map((mesh, index) => `
              <button data-mesh="${index}">
                <strong>${mesh.label}</strong>
                <span>${mesh.apps.join(" / ")}</span>
              </button>
            `).join("")}
          </div>
          <pre class="nexus-log">${liveLog.join("\n")}</pre>
        </section>
      </div>
    `;

    root.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        activeMode = button.dataset.mode ?? activeMode;
        pushLog(`Selected mode ${nexusModes.find((item) => item.id === activeMode)?.name ?? activeMode}`);
        render();
      });
    });
    root.querySelectorAll<HTMLButtonElement>("[data-rule]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedRule = button.dataset.rule ?? selectedRule;
        render();
      });
    });
    root.querySelectorAll<HTMLButtonElement>("[data-open]").forEach((button) => {
      button.addEventListener("click", () => context.openApp(button.dataset.open ?? ""));
    });
    root.querySelectorAll<HTMLButtonElement>("[data-time]").forEach((button) => {
      button.addEventListener("click", () => {
        timelineIndex = Number(button.dataset.time ?? timelineIndex);
        pushLog(`Focused time ribbon event ${timelineIndex + 1}`);
        render();
      });
    });
    root.querySelectorAll<HTMLButtonElement>("[data-mesh]").forEach((button) => {
      button.addEventListener("click", () => {
        const mesh = commandMesh[Number(button.dataset.mesh ?? 0)];
        mesh.apps.forEach((app) => context.openApp(app));
        pushLog(`${mesh.label} launched`);
        context.notify("Command mesh launched", mesh.label, "success");
        render();
      });
    });
    root.querySelector<HTMLButtonElement>('[data-action="pulse"]')?.addEventListener("click", () => {
      graphPulse += 1;
      pushLog("System graph pulse propagated through app, service, package, and kernel nodes");
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="launch-mode"]')?.addEventListener("click", () => {
      const selectedMode = nexusModes.find((candidate) => candidate.id === activeMode) ?? nexusModes[0];
      context.updateSettings({ performanceProfile: selectedMode.profile });
      selectedMode.apps.forEach((app) => context.openApp(app));
      healthScore = Math.min(99, healthScore + 1);
      pushLog(`Mode launched: ${selectedMode.name}`);
      context.notify("Nexus mode launched", selectedMode.name, "success");
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="run-rule"]')?.addEventListener("click", () => {
      automationRuns += 1;
      if (rule.id === "thermal-guard") {
        context.updateSettings({ performanceProfile: "Balanced" });
        context.openApp("monitor");
      }
      if (rule.id === "package-scan") context.openApp("security");
      if (rule.id === "focus-restore") context.windowManager.tileVisible();
      if (rule.id === "crash-replay") {
        context.openApp("developer");
        context.openApp("kernel");
      }
      healthScore = Math.min(100, healthScore + 2);
      pushLog(`Automation ran: ${rule.name}`);
      context.notify("Automation complete", rule.name, rule.tone);
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="repair"]')?.addEventListener("click", () => {
      healthScore = 100;
      graphPulse += 1;
      pushLog("Self-healing pass repaired cache markers, layout confidence, and registry diagnostics");
      context.notify("Self-healing complete", "Aether Nexus reports 100% shell health.", "success");
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="replay"]')?.addEventListener("click", () => {
      context.openApp("kernel");
      pushLog("Opened Kernel Lab deterministic replay stream");
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="export"]')?.addEventListener("click", () => {
      pushLog("Exported Nexus diagnostics report to Developer Console log stream");
      context.notify("Diagnostics exported", "Report sent to the Developer Console log stream.", "success");
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="advance-time"]')?.addEventListener("click", () => {
      timelineIndex = (timelineIndex + 1) % timeline.length;
      pushLog(`Advanced time ribbon to event ${timelineIndex + 1}`);
      render();
    });
  };

  render();
  return root;
}

function statCard(label: string, value: string, note: string) {
  return `
    <article>
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${note}</small>
    </article>
  `;
}

function graphNode(label: string, detail: string, type: string) {
  return `
    <button class="nexus-node" data-node="${type}">
      <strong>${label}</strong>
      <span>${detail}</span>
    </button>
  `;
}

function repairItem(label: string, detail: string, ok: boolean) {
  return `
    <div class="repair-item ${ok ? "ok" : "warn"}">
      <strong>${ok ? "OK" : "Check"} · ${label}</strong>
      <span>${detail}</span>
    </div>
  `;
}
