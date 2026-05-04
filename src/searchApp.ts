import { buildSearchIndex, type SearchHit } from "./platform";
import { invokeCommand } from "./backend";

type SearchContext = {
  execute: (action: string) => void;
  log: (source: string, message: string) => void;
};

export function createSearchApp(context: SearchContext) {
  const root = document.createElement("div");
  root.className = "platform-app";
  let index: SearchHit[] = [];
  let fileResults: Array<{ title: string; path: string; record_type: string; size: number }> = [];
  let query = "";
  let indexStatus = "SQLite index idle.";

  const render = () => {
    const results = index.filter((hit) => `${hit.type} ${hit.title} ${hit.subtitle}`.toLowerCase().includes(query.toLowerCase()));
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>System Search</h2>
          <p>Apps, files, settings, commands, packages, services, updates, and recent actions</p>
        </div>
        <button class="primary-btn" data-action="reindex">Reindex Files</button>
      </div>
      <input class="search-input wide-input" placeholder="Search AetherOS" value="${query.replace(/"/g, "&quot;")}" />
      <p class="small-note">${indexStatus}</p>
      <div class="search-results">
        ${results.map((hit) => `
          <button class="search-hit" data-action="${hit.action}">
            <span>${hit.type}</span>
            <strong>${hit.title}</strong>
            <small>${hit.subtitle}</small>
          </button>
        `).join("")}
        ${fileResults.map((hit) => `
          <button class="search-hit" data-action="files">
            <span>${hit.record_type}</span>
            <strong>${hit.title}</strong>
            <small>${hit.path}</small>
          </button>
        `).join("")}
        ${!results.length && !fileResults.length ? `<p class="small-note">No results yet.</p>` : ""}
      </div>
      <p class="small-note">Search uses a Rust SQLite metadata cache; semantic search remains a reserved hook.</p>
    `;
    root.querySelector<HTMLInputElement>(".search-input")?.addEventListener("input", (event) => {
      query = (event.target as HTMLInputElement).value;
      invokeCommand<typeof fileResults>("search_files", { query }, () => []).then((results) => {
        fileResults = results;
        render();
      });
    });
    root.querySelector<HTMLButtonElement>('[data-action="reindex"]')?.addEventListener("click", async () => {
      index = await buildSearchIndex();
      const count = await invokeCommand<number>("build_search_index", undefined, () => 0);
      indexStatus = `Indexed ${count} filesystem records into SQLite plus ${index.length} shell records.`;
      context.log("search", indexStatus);
      render();
    });
    root.querySelectorAll<HTMLButtonElement>(".search-hit").forEach((button) => button.addEventListener("click", () => context.execute(button.dataset.action ?? "")));
  };

  buildSearchIndex().then((hits) => {
    index = hits;
    render();
  });
  render();
  return root;
}
