import { installPackage } from "./packageManager";

type AssistantContext = {
  openApp: (app: string) => void;
  updateSettings: (patch: { performanceProfile?: "Balanced" | "Gaming" | "Battery Saver" }) => void;
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

const suggestions = [
  "Open files from yesterday",
  "Install demo-app",
  "Switch to gaming mode",
  "Open security warnings",
  "Show startup apps",
  "Repair package registry"
];

export function createAssistantApp(context: AssistantContext) {
  const root = document.createElement("div");
  root.className = "assistant-app platform-app";
  let transcript = ["Aether Assistant is ready. Try a suggested command or type your own."];

  const run = async (command: string) => {
    const value = command.toLowerCase();
    transcript.push(`> ${command}`);
    if (value.includes("file")) {
      context.openApp("files");
      transcript.push("Opened File Explorer and highlighted recent-file workflows.");
    } else if (value.includes("install") || value.includes("demo-app")) {
      await installPackage("demo-app").catch(() => undefined);
      context.notify("Assistant installed package", "demo-app", "success");
      transcript.push("Installed demo-app through AetherPkg.");
    } else if (value.includes("gaming")) {
      context.updateSettings({ performanceProfile: "Gaming" });
      transcript.push("Performance profile switched to Gaming.");
    } else if (value.includes("security")) {
      context.openApp("security");
      transcript.push("Opened Security Center.");
    } else if (value.includes("startup") || value.includes("registry") || value.includes("repair")) {
      context.openApp("control");
      transcript.push("Opened Control Panel recovery and startup tools.");
    } else {
      context.openApp("search");
      transcript.push("Sent the request to System Search.");
    }
    context.log("assistant", command);
    render();
  };

  const render = () => {
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>Aether Assistant</h2>
          <p>Local command helper for files, packages, settings, security, and recovery.</p>
        </div>
      </div>
      <div class="assistant-layout">
        <section class="details-panel">
          <h3>Suggestions</h3>
          <div class="assistant-suggestions">
            ${suggestions.map((item) => `<button class="secondary-btn" data-command="${item}">${item}</button>`).join("")}
          </div>
        </section>
        <section class="details-panel assistant-console">
          <h3>Conversation</h3>
          <div class="assistant-transcript">${transcript.map((line) => `<p>${escapeText(line)}</p>`).join("")}</div>
          <form class="assistant-prompt">
            <input class="search-input wide-input" placeholder="Ask Aether to do something local" autocomplete="off" />
            <button class="primary-btn">Run</button>
          </form>
        </section>
      </div>
    `;
    root.querySelectorAll<HTMLButtonElement>("[data-command]").forEach((button) => button.addEventListener("click", () => run(button.dataset.command ?? "")));
    root.querySelector<HTMLFormElement>(".assistant-prompt")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = root.querySelector<HTMLInputElement>(".assistant-prompt input");
      if (!input?.value.trim()) return;
      run(input.value.trim());
      input.value = "";
    });
  };

  render();
  return root;
}

function escapeText(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}
