import { updates } from "./platform";

type UpdateContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

export function createUpdateCenterApp(context: UpdateContext) {
  const root = document.createElement("div");
  root.className = "platform-app";
  let channel: "stable" | "beta" | "nightly" = "stable";
  let recovery = "Recovery image ready: last known good shell bundle.";

  const render = () => {
    const visible = updates.filter((update) => update.channel === channel);
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>Update Center</h2>
          <p>Release channels, changelog, download/apply, rollback, and recovery mode</p>
        </div>
        <select class="select-input" data-channel>
          ${["stable", "beta", "nightly"].map((value) => `<option ${value === channel ? "selected" : ""}>${value}</option>`).join("")}
        </select>
      </div>
      <div class="platform-grid">
        <section class="package-list">
          ${visible.map((update) => `<button class="package-row" data-version="${update.version}"><span>${update.version}</span><small>${update.status}</small></button>`).join("")}
        </section>
        <section class="details-panel">
          <h3>Signed Update Manifests</h3>
          ${visible.map((update) => `<p><strong>${update.version}</strong>: ${update.notes}</p>`).join("")}
          <dl>
            <dt>Staging</dt><dd>system/update-staging</dd>
            <dt>Verification</dt><dd>signature placeholder + checksum</dd>
            <dt>Rollback</dt><dd>restore-point-before-apply</dd>
            <dt>Restart required</dt><dd>${visible.some((update) => update.status === "applied") ? "yes" : "no"}</dd>
          </dl>
          <div class="button-row">
            <button class="primary-btn" data-action="check">Check</button>
            <button class="secondary-btn" data-action="download">Download</button>
            <button class="secondary-btn" data-action="apply">Apply</button>
            <button class="secondary-btn" data-action="rollback">Rollback</button>
          </div>
          <h3>Recovery</h3>
          <p>${recovery}</p>
          <button class="secondary-btn" data-action="recovery">Enter Recovery Mode</button>
        </section>
      </div>
    `;
    root.querySelector<HTMLSelectElement>("[data-channel]")?.addEventListener("change", (event) => {
      channel = (event.target as HTMLSelectElement).value as typeof channel;
      render();
    });
    root.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => button.addEventListener("click", () => {
      const action = button.dataset.action ?? "check";
      if (action === "download") visible.forEach((update) => update.status = "downloaded");
      if (action === "apply") visible.forEach((update) => update.status = "applied");
      if (action === "rollback") visible.forEach((update) => update.status = "rollback");
      if (action === "recovery") recovery = "Recovery mode armed. Restart would boot last known good bundle.";
      context.notify("Update action", `${action} on ${channel}`, action === "rollback" ? "warning" : "success");
      context.log("updates", `${action} ${channel}`);
      render();
    }));
  };

  render();
  return root;
}
