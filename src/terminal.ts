import { invokeCommand } from "./backend";
import { getPackages, installPackage, loadPackages, removePackage } from "./packageManager";

type TerminalContext = {
  openApp: (app: string) => void;
  setTheme: (theme: "dark" | "light") => void;
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

type FsItem = {
  name: string;
  path: string;
  entry_type: "folder" | "file";
  size: number;
};

export function createTerminalApp(context: TerminalContext) {
  const root = document.createElement("div");
  root.className = "terminal-app";
  const output = document.createElement("div");
  output.className = "terminal-output";
  const prompt = document.createElement("form");
  prompt.className = "terminal-prompt";
  prompt.innerHTML = `<span id="terminal-cwd">aether@phase2:Home$</span><input autocomplete="off" spellcheck="false" /><i></i>`;
  const input = prompt.querySelector("input") as HTMLInputElement;
  const cwdLabel = prompt.querySelector("#terminal-cwd") as HTMLElement;
  const history: string[] = [];
  let cwd = "Home";
  let historyIndex = 0;

  root.append(output, prompt);
  write("Aether Terminal 2.0. Type `help` for shell, filesystem, system, and package commands.");
  input.focus();

  prompt.addEventListener("submit", async (event) => {
    event.preventDefault();
    const command = input.value.trim();
    if (!command) return;
    history.push(command);
    historyIndex = history.length;
    write(`${cwdLabel.textContent} ${command}`, "command");
    input.value = "";
    context.log("terminal", command);
    await runCommand(command);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex] ?? "";
    }
    if (event.key === "ArrowDown") {
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] ?? "";
    }
  });

  root.addEventListener("click", () => input.focus());

  async function runCommand(command: string) {
    const [base, ...args] = command.split(/\s+/);
    const arg = args.join(" ");
    if (command === "help") {
      write("Commands: help, clear, apps, status, version, nexus, ecosystem, experience, theme dark|light, ls, pwd, cd <path>, mkdir <name>, touch <name>, rm <path>, sysinfo, processes, install demo-app, remove demo-app");
      return;
    }
    if (command === "clear") {
      output.innerHTML = "";
      return;
    }
    if (command === "apps") {
      write("Built-ins: File Explorer, Terminal, Settings, System Monitor, AetherPkg, Developer Console, Marketplace, Ecosystem Hub, Experience Center, Kernel Lab, Aether Nexus");
      return;
    }
    if (command === "nexus") {
      context.openApp("nexus");
      write("Opening Aether Nexus command center.");
      return;
    }
    if (command === "ecosystem") {
      context.openApp("ecosystem");
      write("Opening Aether Ecosystem Hub.");
      return;
    }
    if (command === "experience") {
      context.openApp("experience");
      write("Opening Aether Experience Center.");
      return;
    }
    if (command === "status") {
      await loadPackages();
      write(`Packages installed: ${getPackages().filter((pkg) => pkg.installed).length}/${getPackages().length}. Shell state: operational.`);
      return;
    }
    if (command === "version") {
      const version = await invokeCommand<string>("get_os_version", undefined, () => navigator.userAgent);
      write(`AetherOS Phase 2 shell 0.2.0 | Host: ${version}`);
      return;
    }
    if (base === "install" && arg) {
      write(await installPackage(arg));
      context.notify("Package installed", arg, "success");
      return;
    }
    if (base === "remove" && arg) {
      try {
        write(await removePackage(arg));
        context.notify("Package removed", arg, "warning");
      } catch (error) {
        write(String(error));
      }
      return;
    }
    if (base === "theme" && (arg === "dark" || arg === "light")) {
      context.setTheme(arg);
      write(`Theme changed to ${arg}.`);
      return;
    }
    if (base === "open" && arg) {
      context.openApp(arg);
      write(`Opening ${arg}.`);
      return;
    }
    if (command === "pwd") {
      write(cwd);
      return;
    }
    if (command === "ls") {
      const entries = await invokeCommand<FsItem[]>("list_directory", { path: cwd }, () => []);
      write(entries.map((entry) => `${entry.entry_type === "folder" ? "d" : "-"} ${entry.name}`).join("\n") || "Directory is empty.");
      return;
    }
    if (base === "cd") {
      cwd = arg || "Home";
      cwdLabel.textContent = `aether@phase2:${shortPath(cwd)}$`;
      write(`Changed directory to ${cwd}.`);
      return;
    }
    if (base === "mkdir" && arg) {
      await invokeCommand("create_directory", { path: joinPath(cwd, arg) });
      write(`Created directory ${arg}.`);
      context.notify("Directory created", arg, "success");
      return;
    }
    if (base === "touch" && arg) {
      await invokeCommand("touch_file", { path: joinPath(cwd, arg) });
      write(`Created file ${arg}.`);
      context.notify("File created", arg, "success");
      return;
    }
    if (base === "rm" && arg) {
      await invokeCommand("delete_path", { path: arg.includes("\\") || arg.includes("/") ? arg : joinPath(cwd, arg) });
      write(`Removed ${arg}.`);
      context.notify("Path removed", arg, "warning");
      return;
    }
    if (command === "sysinfo") {
      const info = await invokeCommand<Record<string, unknown>>("get_live_system_info");
      write(Object.entries(info).map(([key, value]) => `${key}: ${value}`).join("\n"));
      return;
    }
    if (command === "processes") {
      const processes = await invokeCommand<Array<Record<string, unknown>>>("list_processes", undefined, () => []);
      write(processes.slice(0, 12).map((process) => `${process.pid}\t${process.name}\t${process.memory_kb} KB\t${Number(process.cpu_usage ?? 0).toFixed(1)}%`).join("\n") || "No processes returned.");
      return;
    }
    const echo = await invokeCommand<string>("echo_command", { input: command }, () => `Browser preview handled ${command}`);
    write(`${echo}. Unknown command; try help.`);
  }

  function write(text: string, className = "") {
    const line = document.createElement("p");
    line.className = className;
    line.textContent = text;
    output.append(line);
    output.scrollTop = output.scrollHeight;
  }

  return root;
}

function joinPath(base: string, name: string) {
  if (base === "Home" || base === "Desktop" || base === "Documents" || base === "Downloads" || base === "Pictures") return `${base}/${name}`;
  const separator = base.includes("\\") ? "\\" : "/";
  return `${base.replace(/[\\/]+$/, "")}${separator}${name}`;
}

function shortPath(path: string) {
  return path.split(/[\\/]/).filter(Boolean).at(-1) ?? path;
}
