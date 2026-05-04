import { installPackage, getPackages } from "./packageManager";
import { runtimeApps, services, updates, type AetherAppManifest } from "./platform";

type MarketplaceContext = {
  openApp: (app: string) => void;
  launchRuntimeApp: (app: AetherAppManifest) => void;
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

const ecosystemApps = [
  { id: "aurora-mail", name: "Aurora Mail", kind: "Productivity", rating: "4.9", reviews: 1284, verified: true, featured: true, description: "Fast local-first mail client with privacy scoring.", screenshot: "Inbox triage, encrypted sync, command compose" },
  { id: "nebula-code", name: "Nebula Code", kind: "Developer", rating: "4.8", reviews: 902, verified: true, featured: true, description: "Native editor shell for Aether SDK projects.", screenshot: "Project tree, terminal bridge, package publisher" },
  { id: "pulse-calendar", name: "Pulse Calendar", kind: "Productivity", rating: "4.7", reviews: 530, verified: true, featured: false, description: "Calendar with command-palette scheduling and lock-screen widgets.", screenshot: "Timeline, focus blocks, meeting prep" },
  { id: "forge-vm", name: "Forge VM", kind: "System", rating: "4.6", reviews: 221, verified: false, featured: false, description: "Sandbox profiles for experimental app workloads.", screenshot: "Resource caps, snapshots, service isolation" },
  { id: "orbit-music", name: "Orbit Music", kind: "Media", rating: "4.8", reviews: 644, verified: true, featured: true, description: "Lossless player with spatial queue controls.", screenshot: "Now playing, mixer, library index" },
  { id: "atlas-db", name: "Atlas DB", kind: "Developer", rating: "4.5", reviews: 318, verified: false, featured: false, description: "Database workbench packaged for AetherOS.", screenshot: "Connections, query console, schema graph" }
];

export function createMarketplaceApp(context: MarketplaceContext) {
  const root = document.createElement("div");
  root.className = "marketplace-app";
  let selected = ecosystemApps[0].id;
  let query = "";
  let category = "All";
  const installs = new Set<string>();

  const render = () => {
    const packageCount = getPackages().filter((pkg) => pkg.installed).length;
    const categories = ["All", ...Array.from(new Set(ecosystemApps.map((app) => app.kind)))];
    const visible = ecosystemApps.filter((app) => {
      const matchesCategory = category === "All" || app.kind === category;
      const matchesQuery = `${app.name} ${app.kind} ${app.description}`.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
    const selectedApp = ecosystemApps.find((app) => app.id === selected) ?? ecosystemApps[0];
    const runtimeApp = runtimeApps.find((app) => app.id === "notes.studio") ?? runtimeApps[0];

    root.innerHTML = `
      <div class="marketplace-hero">
        <div>
          <h2>Aether Marketplace</h2>
          <p>Verified apps, services, SDK templates, packages, widgets, and system extensions in one ecosystem hub.</p>
        </div>
        <div class="market-stats">
          <span>${ecosystemApps.length + runtimeApps.length} apps</span>
          <span>${packageCount} installed packages</span>
          <span>${services.filter((service) => service.status === "running").length} live services</span>
          <span>${updates.length} release channels</span>
        </div>
      </div>
      <div class="market-toolbar">
        <input class="search-input wide-input" placeholder="Search marketplace" value="${escapeAttr(query)}" />
        <div class="segmented market-categories">
          ${categories.map((item) => `<button class="${item === category ? "selected" : ""}" data-category="${item}">${item}</button>`).join("")}
        </div>
      </div>
      <div class="market-layout">
        <section class="market-list">
          <h3>Featured</h3>
          <div class="featured-row">
            ${ecosystemApps.filter((app) => app.featured).map((app) => `<button data-market-app="${app.id}"><strong>${app.name}</strong><span>${app.kind}</span></button>`).join("")}
          </div>
          <h3>Catalog</h3>
          ${visible.map((app) => `
            <button class="market-card ${app.id === selected ? "selected" : ""}" data-market-app="${app.id}">
              <strong>${app.name}</strong>
              <span>${app.kind} · ${app.rating} ★ ${app.verified ? "· Aether Verified" : "· Community"}</span>
              <small>${app.description}</small>
            </button>
          `).join("") || `<p class="small-note">No marketplace results.</p>`}
        </section>
        <section class="details-panel market-detail">
          <span class="status-pill">${selectedApp.verified ? "Aether Verified" : "Community"} · ${selectedApp.kind}</span>
          <h2>${selectedApp.name}</h2>
          <p>${selectedApp.description}</p>
          <div class="market-screenshot">${selectedApp.screenshot}</div>
          <div class="market-review-row">
            <strong>${selectedApp.rating} ★</strong>
            <span>${selectedApp.reviews.toLocaleString()} reviews</span>
            <span>Updated today</span>
          </div>
          <div class="permission-list">
            <span>Signed manifest</span>
            <span>Permission prompts</span>
            <span>Rollback snapshot</span>
            <span>Security scan</span>
          </div>
          <div class="button-row">
            <button class="primary-btn" data-action="install">${installs.has(selectedApp.id) ? "Installed" : "Install"}</button>
            <button class="secondary-btn" data-action="launch">Launch Demo Runtime</button>
            <button class="secondary-btn" data-action="sdk">Open SDK</button>
            <button class="secondary-btn" data-action="packages">Open AetherPkg</button>
          </div>
          <h3>Ecosystem Channels</h3>
          <div class="market-channel-grid">
            <button data-open="runtime">Runtime Apps</button>
            <button data-open="services">Services</button>
            <button data-open="security">Security Extensions</button>
            <button data-open="updates">Release Channels</button>
          </div>
          <pre>{
  "id": "${selectedApp.id}",
  "marketplace": "aether.market.local",
  "verified": ${selectedApp.verified},
  "capabilities": ["install", "rollback", "scan", "review"],
  "history": ["installed", "updated", "rolled-back"],
  "publisherFlow": "local developer publishing"
}</pre>
        </section>
      </div>
    `;

    root.querySelector<HTMLInputElement>(".search-input")?.addEventListener("input", (event) => {
      query = (event.target as HTMLInputElement).value;
      render();
    });
    root.querySelectorAll<HTMLButtonElement>("[data-category]").forEach((button) => button.addEventListener("click", () => {
      category = button.dataset.category ?? "All";
      render();
    }));
    root.querySelectorAll<HTMLButtonElement>("[data-market-app]").forEach((button) => button.addEventListener("click", () => {
      selected = button.dataset.marketApp ?? selected;
      render();
    }));
    root.querySelector<HTMLButtonElement>('[data-action="install"]')?.addEventListener("click", async () => {
      installs.add(selectedApp.id);
      await installPackage("demo-app").catch(() => undefined);
      context.notify("Marketplace install complete", selectedApp.name, "success");
      context.log("marketplace", `Installed ${selectedApp.id}`);
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="launch"]')?.addEventListener("click", () => context.launchRuntimeApp(runtimeApp));
    root.querySelector<HTMLButtonElement>('[data-action="sdk"]')?.addEventListener("click", () => context.openApp("sdk"));
    root.querySelector<HTMLButtonElement>('[data-action="packages"]')?.addEventListener("click", () => context.openApp("packages"));
    root.querySelectorAll<HTMLButtonElement>("[data-open]").forEach((button) => button.addEventListener("click", () => context.openApp(button.dataset.open ?? "")));
  };

  render();
  return root;
}

function escapeAttr(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
