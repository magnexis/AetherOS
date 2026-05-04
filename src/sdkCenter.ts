import { appManifestJson, runtimeApps } from "./platform";

type SdkContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

export function createSdkCenterApp(context: SdkContext) {
  const root = document.createElement("div");
  root.className = "platform-app";
  let scaffoldName = "hello-aether";

  const render = () => {
    const manifest = runtimeApps[0];
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>Aether SDK</h2>
          <p>TypeScript SDK, Rust bridge templates, app scaffolder, package CLI, and examples</p>
        </div>
        <button class="primary-btn" data-action="scaffold">Scaffold App</button>
      </div>
      <div class="platform-grid">
        <section class="details-panel">
          <h3>Scaffolder</h3>
          <input class="search-input wide-input" value="${scaffoldName}" />
          <pre>npx aether create ${scaffoldName}
cd ${scaffoldName}
npm run package
aetherpkg install ./dist/${scaffoldName}.aetherpkg</pre>
        </section>
        <section class="details-panel">
          <h3>SDK APIs</h3>
          <div class="permission-list"><span>Aether.fs</span><span>Aether.notify</span><span>Aether.settings</span><span>Aether.terminal</span><span>Aether.packages</span></div>
          <pre>import { Aether } from "@aether/sdk";
await Aether.notify("Hello from an app");
const files = await Aether.fs.list("Documents");</pre>
        </section>
        <section class="details-panel">
          <h3>Rust Command Bridge Template</h3>
          <pre>#[tauri::command]
fn app_command(input: String) -> String {
    format!("handled {}", input)
}</pre>
        </section>
        <section class="details-panel">
          <h3>Example Manifest</h3>
          <pre>${appManifestJson(manifest)}</pre>
        </section>
      </div>
    `;
    root.querySelector<HTMLInputElement>(".search-input")?.addEventListener("input", (event) => {
      scaffoldName = (event.target as HTMLInputElement).value;
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="scaffold"]')?.addEventListener("click", () => {
      context.notify("App scaffolded", `${scaffoldName} template generated in the SDK plan.`, "success");
      context.log("sdk", `Scaffolded ${scaffoldName}`);
    });
  };

  render();
  return root;
}
