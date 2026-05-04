type NetworkCenterContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

const interfaces = [
  { id: "eth0", name: "AetherNet 2.5G", type: "ethernet", state: "connected", address: "192.168.1.42" },
  { id: "wlan0", name: "Aether Wi-Fi", type: "wifi", state: "available", address: "no-address" },
  { id: "vpn0", name: "Aether Secure Tunnel", type: "vpn", state: "disconnected", address: "no-address" }
];

const firewallRules = [
  "Allow Update Engine outbound 443/tcp",
  "Allow Marketplace outbound 443/tcp",
  "Block Unsigned Runtime Apps"
];

export function createNetworkCenterApp(context: NetworkCenterContext) {
  const root = document.createElement("div");
  root.className = "platform-app";
  let profile = "home";

  const render = () => {
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>Network Center</h2>
          <p>Interfaces, DNS, VPN, firewall rules, network profiles, and secure DNS policy.</p>
        </div>
        <select class="select-input" data-profile>
          ${["home", "work", "public"].map((item) => `<option ${item === profile ? "selected" : ""}>${item}</option>`).join("")}
        </select>
      </div>
      <div class="platform-grid">
        <section class="details-panel">
          <h3>Interfaces</h3>
          ${interfaces.map((iface) => `<div class="process-row"><span>${iface.name}</span><strong>${iface.state}</strong></div><p class="small-note">${iface.type} · ${iface.address}</p>`).join("")}
          <div class="button-row">
            <button class="secondary-btn" data-action="diagnose">Diagnose</button>
            <button class="secondary-btn" data-action="dns">Test DNS</button>
            <button class="secondary-btn" data-action="vpn">Toggle VPN</button>
          </div>
        </section>
        <section class="details-panel">
          <h3>Firewall</h3>
          ${firewallRules.map((rule) => `<div class="process-row"><span>${rule}</span><strong>enabled</strong></div>`).join("")}
          <p class="small-note">Profile ${profile} uses ${profile === "public" ? "locked-down" : profile === "work" ? "managed" : "trusted-lan"} policy.</p>
        </section>
      </div>
    `;
    root.querySelector<HTMLSelectElement>("[data-profile]")?.addEventListener("change", (event) => {
      profile = (event.target as HTMLSelectElement).value;
      context.notify("Network profile changed", profile, profile === "public" ? "warning" : "success");
      context.log("network", `profile ${profile}`);
      render();
    });
    root.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => button.addEventListener("click", () => {
      context.notify("Network action", button.dataset.action ?? "diagnose", "success");
      context.log("network", button.dataset.action ?? "action");
    }));
  };

  render();
  return root;
}
