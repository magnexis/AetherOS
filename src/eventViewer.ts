type EventViewerContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

const events = [
  { topic: "services", level: "info", message: "aether-eventd started" },
  { topic: "packages", level: "success", message: "Dependency solver loaded" },
  { topic: "recovery", level: "success", message: "Recovery Supervisor healthy" },
  { topic: "security", level: "warning", message: "2 permission prompts pending" },
  { topic: "updates", level: "info", message: "Stable channel checked" }
];

export function createEventViewerApp(context: EventViewerContext) {
  const root = document.createElement("div");
  root.className = "platform-app";
  let topic = "all";

  const render = () => {
    const visible = topic === "all" ? events : events.filter((event) => event.topic === topic);
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>System Event Bus</h2>
          <p>Service, package, file operation, recovery, scan, notification, and update event stream.</p>
        </div>
        <select class="select-input" data-topic>
          ${["all", "services", "packages", "files", "recovery", "security", "notifications", "updates"].map((item) => `<option ${item === topic ? "selected" : ""}>${item}</option>`).join("")}
        </select>
      </div>
      <section class="details-panel">
        ${visible.map((event) => `<div class="process-row"><span>${event.topic} · ${event.message}</span><strong>${event.level}</strong></div>`).join("") || `<p class="small-note">No events for this topic yet.</p>`}
        <div class="button-row">
          <button class="secondary-btn" data-action="publish">Publish test event</button>
          <button class="secondary-btn" data-action="replay">Replay window</button>
        </div>
      </section>
    `;
    root.querySelector<HTMLSelectElement>("[data-topic]")?.addEventListener("change", (event) => {
      topic = (event.target as HTMLSelectElement).value;
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="publish"]')?.addEventListener("click", () => {
      events.unshift({ topic: topic === "all" ? "notifications" : topic, level: "audit", message: "Manual event emitted from Event Viewer" });
      context.notify("Event published", topic, "success");
      context.log("eventbus", topic);
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="replay"]')?.addEventListener("click", () => context.notify("Replay window", "Last 250 events are ready for replay.", "success"));
  };

  render();
  return root;
}
