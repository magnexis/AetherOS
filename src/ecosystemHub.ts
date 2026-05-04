import {
  ecosystemCatalogApps,
  ecosystemExtensionPoints as megaExtensionPoints,
  ecosystemPublishers,
  getEcosystemCatalogSummary,
  getEcosystemReadinessScore,
  searchEcosystemCatalog
} from "./ecosystemMegaCatalog";

type EcosystemContext = {
  openApp: (app: string) => void;
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

const channels = [
  ["Stable", "Signed releases with restore-point updates"],
  ["Beta", "Prompted updates for early adopters"],
  ["Nightly", "Developer-mode-only experimental builds"]
];
const extensionPoints = [
  ["Start recommendations", "shell.start.provider", "shell.extend"],
  ["Taskbar jump lists", "taskbar.jumpList", "shell.extend"],
  ["File previews", "file.preview", "filesystem.read"],
  ["Settings pages", "settings.page", "settings.extend"],
  ["Search providers", "search.provider", "search.index"]
];
const apps = [
  ["Aurora Mail", "Productivity", "Verified"],
  ["Nebula Code", "Developer", "Verified"],
  ["Orbit Music", "Media", "Verified"],
  ["Atlas DB", "Developer", "Prompt"]
];

export function createEcosystemHubApp(context: EcosystemContext) {
  const root = document.createElement("div");
  root.className = "ecosystem-hub app-stack";
  let query = "";

  const render = () => {
    const summary = getEcosystemCatalogSummary();
    const readiness = getEcosystemReadinessScore();
    const results = searchEcosystemCatalog(query);
    const topPublishers = ecosystemPublishers.slice(0, 8);

    root.innerHTML = `
      <div class="marketplace-hero">
        <div>
          <h2>Aether Ecosystem Hub</h2>
          <p>A local-first app economy: Store, packages, SDK, shell extensions, protocols, trust review, and developer publishing in one place.</p>
        </div>
        <div class="market-stats">
          <span>${summary.appCount} catalog apps</span>
          <span>${summary.publisherCount} publishers</span>
          <span>${summary.extensionPointCount} extension APIs</span>
          <span>${readiness}% readiness</span>
        </div>
      </div>
      <section class="details-panel">
        <div class="app-toolbar">
          <div>
            <h3>Massive Local Catalog</h3>
            <p>Search hundreds of typed ecosystem records without leaving the OS shell.</p>
          </div>
          <input class="search-input" data-catalog-search placeholder="Search apps, channels, trust, publishers" value="${escapeAttr(query)}" />
        </div>
        <div class="market-stats">
          ${summary.categories.map(([name, count]) => `<span>${name}: ${count}</span>`).join("")}
        </div>
        <div class="market-stats">
          ${summary.channels.map(([name, count]) => `<span>${name}: ${count}</span>`).join("")}
          ${summary.trust.map(([name, count]) => `<span>${name}: ${count}</span>`).join("")}
        </div>
      </section>
      <div class="market-layout">
        <section class="market-list">
          <h3>Catalog Results</h3>
          ${results.slice(0, 18).map((app) => `
            <button class="market-card" data-catalog-app="${app.id}">
              <strong>${app.name}</strong>
              <span>${app.category} · ${app.channel} · ${app.trust} · ${app.rating.toFixed(1)} ★</span>
              <small>${app.publisher} · ${app.capabilities.join(", ")}</small>
            </button>
          `).join("")}
        </section>
        <section class="details-panel">
          <h3>Publisher Trust</h3>
          ${topPublishers.map((publisher) => `
            <div class="process-row">
              <span>${publisher.name}<small>${publisher.supportTier} · ${publisher.apps} apps</small></span>
              <strong>${publisher.trustScore}%</strong>
            </div>
          `).join("")}
          <h3>Certification Gates</h3>
          ${summary.certificationGates.map((gate) => `
            <div class="metric-card">
              <strong>${gate.title}</strong>
              <span>${gate.gates.slice(0, 3).join(" · ")}</span>
            </div>
          `).join("")}
        </section>
      </div>
      <div class="market-layout">
        <section class="market-list">
          <h3>Store Channels</h3>
          ${channels.map(([name, body]) => `<button class="market-card" data-channel="${name}"><strong>${name}</strong><small>${body}</small></button>`).join("")}
          <h3>Verified Apps</h3>
          ${apps.map(([name, kind, trust]) => `<button class="market-card" data-app="${name}"><strong>${name}</strong><span>${kind} · ${trust}</span><small>Install through Marketplace with scan, rollback, and permission review.</small></button>`).join("")}
        </section>
        <section class="details-panel">
          <h3>Featured Bundles</h3>
          ${summary.featuredBundles.map((bundle) => `
            <button class="market-card" data-bundle="${bundle.id}">
              <strong>${bundle.name}</strong>
              <span>${bundle.audience}</span>
              <small>${bundle.apps.join(", ")}</small>
            </button>
          `).join("")}
          <h3>Expanded Extension Surface</h3>
          <div class="permission-list">
            ${megaExtensionPoints.slice(0, 24).map((extension) => `<span>${extension.host}: ${extension.capability}</span>`).join("")}
          </div>
        </section>
      </div>
      <section class="details-panel market-detail">
        <span class="status-pill">Aether Verified Ecosystem</span>
        <h2>Own App Platform</h2>
        <p>AetherOS treats apps, services, widgets, settings pages, file previews, and search providers as signed ecosystem artifacts.</p>
        <div class="permission-list">
          <span>aether://</span>
          <span>aetherpkg://</span>
          <span>aether-dev://</span>
          <span>signed-or-prompt trust</span>
        </div>
        <h3>Core Extension Points</h3>
        ${extensionPoints.map(([name, id, capability]) => `
          <div class="process-row">
            <span>${name}<small>${id}</small></span>
            <strong>${capability}</strong>
          </div>
        `).join("")}
        <div class="button-row">
          <button class="primary-btn" data-open="marketplace">Open Marketplace</button>
          <button class="secondary-btn" data-open="sdk">Open SDK</button>
          <button class="secondary-btn" data-open="runtime">Open Runtime</button>
          <button class="secondary-btn" data-action="publish">Run Publish Checklist</button>
        </div>
        <pre>{
  "catalogApps": ${ecosystemCatalogApps.length},
  "requiredFiles": ["aether.app.json", "dist/index.html", "README.md"],
  "qualityGates": ["no-overlap-ui", "keyboard-focus", "permission-minimal", "crash-bundle-ready"],
  "publish": "scaffold -> validate -> review -> package -> sign -> publish-local"
}</pre>
      </section>
    `;

    root.querySelector<HTMLInputElement>("[data-catalog-search]")?.addEventListener("input", (event) => {
      query = (event.target as HTMLInputElement).value;
      render();
    });
    root.querySelectorAll<HTMLButtonElement>("[data-open]").forEach((button) => button.addEventListener("click", () => context.openApp(button.dataset.open ?? "")));
    root.querySelector<HTMLButtonElement>('[data-action="publish"]')?.addEventListener("click", () => {
      context.notify("Publishing checklist passed", "Manifest, permissions, keyboard focus, rollback, and crash bundle gates are ready.", "success");
      context.log("ecosystem", "Ran local developer publishing checklist");
    });
    root.querySelectorAll<HTMLButtonElement>("[data-channel]").forEach((button) => button.addEventListener("click", () => context.notify("Channel selected", button.dataset.channel ?? "Stable", "success")));
    root.querySelectorAll<HTMLButtonElement>("[data-app], [data-catalog-app]").forEach((button) => button.addEventListener("click", () => context.notify("Store app selected", button.dataset.app ?? button.dataset.catalogApp ?? "App", "info")));
    root.querySelectorAll<HTMLButtonElement>("[data-bundle]").forEach((button) => button.addEventListener("click", () => context.notify("Bundle selected", button.dataset.bundle ?? "Bundle", "success")));
  };

  render();
  return root;
}

function escapeAttr(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
