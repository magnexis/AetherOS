type DeviceManagerContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

const devices = [
  { id: "gpu0", bus: "PCIe", name: "Aether GPU 0", driver: "aether-display", state: "ready", location: "PCI bus 1, device 0", events: ["driver-bound", "profile-balanced"] },
  { id: "disk0", bus: "NVMe", name: "System Disk", driver: "aether-nvme", state: "ready", location: "NVMe slot 0", events: ["trim-enabled"] },
  { id: "hid0", bus: "USB", name: "Keyboard + Pointer Hub", driver: "aether-hid", state: "ready", location: "USB root hub 2", events: ["driver-bound"] },
  { id: "power0", bus: "ACPI", name: "Power Button", driver: "acpi-power", state: "sleeping", location: "ACPI fixed feature", events: ["sleep-capable"] },
  { id: "vmbus0", bus: "Virtual", name: "Compatibility VM Bus", driver: "hypercore.sys", state: "needs-driver", location: "HyperCore virtual bus", events: ["module-not-loaded"] }
];

const drivers = [
  { id: "aether-display", version: "0.4.0", profile: "balanced", rollback: "0.3.8", signed: true, warnings: "none" },
  { id: "aether-audio", version: "0.3.2", profile: "performance", rollback: "0.3.0", signed: true, warnings: "disabled in balanced profile" },
  { id: "unsigned-storage-test", version: "0.0.1", profile: "blocked", rollback: "none", signed: false, warnings: "blocked unsigned kernel driver" }
];

export function createDeviceManagerApp(context: DeviceManagerContext) {
  const root = document.createElement("div");
  root.className = "platform-app";
  root.innerHTML = `
    <div class="app-toolbar">
      <div>
        <h2>Device Manager</h2>
        <p>Buses, devices, drivers, hardware matching, rollback, signature warnings, and troubleshooting.</p>
      </div>
      <button class="primary-btn" data-action="scan">Scan Hardware</button>
    </div>
    <div class="platform-grid">
      <section class="details-panel">
        <h3>Devices</h3>
        ${devices.map((device) => `
          <div class="process-row"><span>${device.bus} · ${device.name}</span><strong>${device.state}</strong></div>
          <p class="small-note">${device.location} · ${device.driver} · ${device.events.join(", ")}</p>
        `).join("")}
      </section>
      <section class="details-panel">
        <h3>Driver Manager v2</h3>
        ${drivers.map((driver) => `
          <div class="process-row"><span>${driver.id} ${driver.version}</span><strong>${driver.signed ? "signed" : "blocked"}</strong></div>
          <p class="small-note">profile=${driver.profile} · rollback=${driver.rollback} · ${driver.warnings}</p>
        `).join("")}
        <div class="button-row">
          <button class="secondary-btn" data-action="rollback">Rollback selected</button>
          <button class="secondary-btn" data-action="blocklist">Open blocklist</button>
          <button class="secondary-btn" data-action="match">Match hardware</button>
        </div>
      </section>
    </div>
  `;
  root.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => button.addEventListener("click", () => {
    const action = button.dataset.action ?? "scan";
    context.notify("Device Manager", `${action} complete`, action === "blocklist" ? "warning" : "success");
    context.log("devices", action);
  }));
  return root;
}
