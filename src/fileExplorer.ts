import { invokeCommand } from "./backend";

type FsItem = {
  name: string;
  path: string;
  entry_type: "folder" | "file";
  size: number;
  modified: string;
};

type KnownFolder = [string, string];

type FileExplorerContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

export function createFileExplorerApp(context: FileExplorerContext) {
  const root = document.createElement("div");
  root.className = "files-app";
  let knownFolders: KnownFolder[] = [["Home", "Home"], ["Desktop", "Desktop"], ["Documents", "Documents"], ["Downloads", "Downloads"], ["Pictures", "Pictures"], ["System", "System"], ["Applications", "Applications"]];
  let currentPath = "Home";
  let currentLabel = "Home";
  let query = "";
  let selected: FsItem | null = null;
  let items: FsItem[] = [];
  let status = "Loading filesystem...";
  let splitView = false;
  let activeTab = 0;
  const tabs = [{ label: "Home", path: "Home" }];
  const history = ["Home"];
  let historyIndex = 0;
  const queue: string[] = [];
  let trash: Array<{ name: string; original_path: string; trash_path: string; deleted_at: string }> = [];
  const recent: FsItem[] = [];

  const refresh = async () => {
    try {
      knownFolders = await invokeCommand<KnownFolder[]>("get_known_folders", undefined, () => knownFolders);
      items = await invokeCommand<FsItem[]>("list_directory", { path: currentPath }, () => []);
      trash = await invokeCommand<typeof trash>("list_trash", undefined, () => trash);
      status = items.length ? `${items.length} items loaded from ${currentLabel}.` : `${currentLabel} is empty.`;
    } catch (error) {
      status = `Filesystem error: ${String(error)}`;
      items = [];
    }
    render();
  };

  const render = () => {
    const visibleItems = items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
    root.innerHTML = `
      <aside class="file-sidebar">
        ${knownFolders.map(([label, path]) => `<button class="${path === currentPath || label === currentLabel ? "selected" : ""}" data-folder="${label}" data-path="${escapeAttr(path)}">▸ ${label}</button>`).join("")}
      </aside>
      <section class="file-main">
        <div class="tab-row">
          ${tabs.map((tab, index) => `<button class="${index === activeTab ? "selected" : ""}" data-tab="${index}">${tab.label}</button>`).join("")}
          <button data-action="new-tab">+</button>
        </div>
        <div class="app-toolbar">
          <div>
            <h2>${currentLabel}</h2>
            <p title="${escapeAttr(currentPath)}">${currentPath}</p>
          </div>
          <input class="search-input" type="search" placeholder="Indexed search in ${currentLabel}" value="${escapeAttr(query)}" />
        </div>
        <div class="address-row">
          <button class="secondary-btn" data-action="back" ${historyIndex <= 0 ? "disabled" : ""}>Back</button>
          <button class="secondary-btn" data-action="forward" ${historyIndex >= history.length - 1 ? "disabled" : ""}>Forward</button>
          <input class="search-input wide-input" data-address value="${escapeAttr(currentPath)}" />
        </div>
        <div class="breadcrumb">AetherFS <span>/</span> ${currentLabel}</div>
        <div class="file-actions">
          <button class="secondary-btn" data-action="up">Up</button>
          <button class="secondary-btn" data-action="refresh">Refresh</button>
          <button class="secondary-btn" data-action="new-folder">New Folder</button>
          <button class="secondary-btn" data-action="new-file">New File</button>
          <button class="secondary-btn" data-action="rename" ${selected ? "" : "disabled"}>Rename</button>
          <button class="secondary-btn" data-action="duplicate" ${selected ? "" : "disabled"}>Copy</button>
          <button class="secondary-btn" data-action="open" ${selected ? "" : "disabled"}>Open</button>
          <button class="secondary-btn" data-action="preview" ${selected ? "" : "disabled"}>Preview</button>
          <button class="secondary-btn" data-action="split">Split</button>
          <button class="secondary-btn" data-action="permissions" ${selected ? "" : "disabled"}>Permissions</button>
          <button class="secondary-btn" data-action="properties" ${selected ? "" : "disabled"}>Properties</button>
          <button class="secondary-btn" data-action="open-with" ${selected ? "" : "disabled"}>Open With</button>
          <button class="secondary-btn" data-action="batch" ${selected ? "" : "disabled"}>Batch</button>
          <button class="secondary-btn" data-action="delete" ${selected ? "" : "disabled"}>Trash</button>
        </div>
        <div class="file-manager-grid ${splitView ? "split" : ""}">
          ${fileTable(visibleItems, "Files", selected)}
          ${splitView ? fileTable(recent.length ? recent : visibleItems.slice(0, 6), "Split / Recent", selected) : ""}
          <aside class="preview-panel">
            <h3>Preview</h3>
            ${selected ? `<strong>${selected.name}</strong><p>${selected.entry_type} · ${formatSize(selected.size)}</p><p>${associationFor(selected)}</p><p>${selected.path}</p>` : `<p class="small-note">Select a file to preview metadata and association.</p>`}
            <h3>Copy/Move Queue</h3>
            ${queue.map((item) => `<p class="small-note">${item}</p>`).join("") || `<p class="small-note">Queue is empty.</p>`}
            <h3>Trash</h3>
            ${trash.map((item) => `<p class="small-note">${item.name}</p><div class="button-row"><button class="secondary-btn" data-restore="${escapeAttr(item.trash_path)}">Restore</button><button class="secondary-btn" data-permadelete="${escapeAttr(item.trash_path)}">Delete</button></div>`).join("") || `<p class="small-note">Trash is empty.</p>`}
          </aside>
        </div>
        <p class="small-note" id="file-status">${selected ? `Selected ${selected.name}` : status}</p>
      </section>
    `;
    bindNavigation();
    bindActions();
    root.querySelectorAll<HTMLButtonElement>("[data-restore]").forEach((button) => button.addEventListener("click", async () => {
      const entry = trash.find((item) => item.trash_path === button.dataset.restore);
      if (!entry) return;
      await invokeCommand("restore_from_trash", { trashPath: entry.trash_path, originalPath: entry.original_path });
      context.notify("Restored from trash", entry.name, "success");
      await refresh();
    }));
    root.querySelectorAll<HTMLButtonElement>("[data-permadelete]").forEach((button) => button.addEventListener("click", async () => {
      await invokeCommand("permanently_delete", { path: button.dataset.permadelete });
      context.notify("Permanently deleted", "Trash item removed.", "warning");
      await refresh();
    }));
    root.querySelectorAll(".file-table").forEach((table) => {
      table.addEventListener("dragover", (event) => event.preventDefault());
      table.addEventListener("drop", (event) => {
        event.preventDefault();
        queue.push("External drag/drop import queued");
        status = "Drag/drop import queued. Native external payload import is next bridge work.";
        render();
      });
    });
  };

  const bindNavigation = () => {
    root.querySelector<HTMLInputElement>("[data-address]")?.addEventListener("keydown", async (event) => {
      if (event.key !== "Enter") return;
      currentPath = (event.target as HTMLInputElement).value.trim() || "Home";
      currentLabel = currentPath.split(/[\\/]/).filter(Boolean).at(-1) ?? currentPath;
      pushHistory(currentPath);
      await refresh();
    });
    root.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach((button) => {
      button.addEventListener("click", async () => {
        activeTab = Number(button.dataset.tab ?? 0);
        currentPath = tabs[activeTab].path;
        currentLabel = tabs[activeTab].label;
        pushHistory(currentPath);
        selected = null;
        await refresh();
      });
    });
    root.querySelectorAll<HTMLButtonElement>("[data-folder]").forEach((button) => {
      button.addEventListener("click", async () => {
        currentPath = button.dataset.path ?? "Home";
        currentLabel = button.dataset.folder ?? "Home";
        tabs[activeTab] = { label: currentLabel, path: currentPath };
        pushHistory(currentPath);
        selected = null;
        await refresh();
      });
    });
    root.querySelector<HTMLInputElement>(".search-input")?.addEventListener("input", (event) => {
      query = (event.target as HTMLInputElement).value;
      render();
    });
    root.querySelectorAll<HTMLButtonElement>("[data-item]").forEach((button) => {
      button.addEventListener("click", () => {
        selected = items.find((item) => item.path === button.dataset.item) ?? recent.find((item) => item.path === button.dataset.item) ?? null;
        if (selected && !recent.some((item) => item.path === selected?.path)) recent.unshift(selected);
        render();
      });
      button.addEventListener("dblclick", async () => {
        const item = items.find((candidate) => candidate.path === button.dataset.item);
        if (!item) return;
        if (item.entry_type === "folder") {
          currentPath = item.path;
          currentLabel = item.name;
          tabs[activeTab] = { label: currentLabel, path: currentPath };
          pushHistory(currentPath);
          selected = null;
          await refresh();
        } else {
          await openSelected(item);
        }
      });
    });
  };

  const bindActions = () => {
    root.querySelector<HTMLButtonElement>('[data-action="new-tab"]')?.addEventListener("click", () => {
      tabs.push({ label: currentLabel, path: currentPath });
      activeTab = tabs.length - 1;
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="refresh"]')?.addEventListener("click", refresh);
    root.querySelector<HTMLButtonElement>('[data-action="up"]')?.addEventListener("click", async () => {
      const parent = parentPath(currentPath);
      if (!parent) return;
      currentPath = parent;
      currentLabel = parent.split(/[\\/]/).filter(Boolean).at(-1) ?? "Root";
      tabs[activeTab] = { label: currentLabel, path: currentPath };
      pushHistory(currentPath);
      selected = null;
      await refresh();
    });
    root.querySelector<HTMLButtonElement>('[data-action="back"]')?.addEventListener("click", async () => {
      if (historyIndex <= 0) return;
      historyIndex -= 1;
      currentPath = history[historyIndex];
      currentLabel = currentPath.split(/[\\/]/).filter(Boolean).at(-1) ?? currentPath;
      await refresh();
    });
    root.querySelector<HTMLButtonElement>('[data-action="forward"]')?.addEventListener("click", async () => {
      if (historyIndex >= history.length - 1) return;
      historyIndex += 1;
      currentPath = history[historyIndex];
      currentLabel = currentPath.split(/[\\/]/).filter(Boolean).at(-1) ?? currentPath;
      await refresh();
    });
    root.querySelector<HTMLButtonElement>('[data-action="new-folder"]')?.addEventListener("click", async () => {
      const name = prompt("Folder name", "New Folder");
      if (!name) return;
      await invokeCommand("create_directory", { path: joinPath(currentPath, name) });
      context.notify("Folder created", name, "success");
      context.log("files", `Created folder ${name}`);
      await refresh();
    });
    root.querySelector<HTMLButtonElement>('[data-action="new-file"]')?.addEventListener("click", async () => {
      const name = prompt("File name", "new-file.txt");
      if (!name) return;
      await invokeCommand("touch_file", { path: joinPath(currentPath, name) });
      context.notify("File created", name, "success");
      context.log("files", `Created file ${name}`);
      await refresh();
    });
    root.querySelector<HTMLButtonElement>('[data-action="rename"]')?.addEventListener("click", async () => {
      if (!selected) return;
      const name = prompt("New name", selected.name);
      if (!name) return;
      await invokeCommand("rename_path", { from: selected.path, to: joinPath(currentPath, name) });
      context.notify("Item renamed", `${selected.name} to ${name}`, "success");
      selected = null;
      await refresh();
    });
    root.querySelector<HTMLButtonElement>('[data-action="duplicate"]')?.addEventListener("click", async () => {
      if (!selected) return;
      const copyName = `${selected.name} copy`;
      queue.push(`Copy ${selected.name} to ${copyName}`);
      await invokeCommand("copy_path", { from: selected.path, to: joinPath(currentPath, copyName) });
      context.notify("Item copied", copyName, "success");
      await refresh();
    });
    root.querySelector<HTMLButtonElement>('[data-action="delete"]')?.addEventListener("click", async () => {
      if (!selected || !confirm(`Move ${selected.name} to trash?`)) return;
      queue.push(`Move ${selected.name} to Aether Trash`);
      await invokeCommand("move_to_trash", { path: selected.path });
      context.notify("Moved to trash", selected.name, "warning");
      selected = null;
      await refresh();
    });
    root.querySelector<HTMLButtonElement>('[data-action="open"]')?.addEventListener("click", () => selected && openSelected(selected));
    root.querySelector<HTMLButtonElement>('[data-action="preview"]')?.addEventListener("click", () => {
      status = selected ? `Preview ready: ${selected.name} (${associationFor(selected)})` : status;
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="split"]')?.addEventListener("click", () => {
      splitView = !splitView;
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="permissions"]')?.addEventListener("click", () => {
      status = selected ? `Permissions for ${selected.name}: owner read/write, apps need grants.` : status;
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="properties"]')?.addEventListener("click", () => {
      status = selected ? `Properties: ${selected.name} · ${selected.entry_type} · ${formatSize(selected.size)} · ${selected.path}` : status;
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="open-with"]')?.addEventListener("click", () => {
      status = selected ? `Open with: ${associationFor(selected)} · Aether Notes · Host default · Marketplace search` : status;
      render();
    });
    root.querySelector<HTMLButtonElement>('[data-action="batch"]')?.addEventListener("click", () => {
      if (!selected) return;
      queue.push(`Batch queued for ${selected.name}: copy, tag, scan, compress`);
      status = "Batch operation queued with cancel/retry tracking.";
      render();
    });
  };

  const openSelected = async (item: FsItem) => {
    await invokeCommand("open_path", { path: item.path }, () => undefined);
    context.notify("Open requested", item.name);
    context.log("files", `Open requested for ${item.path}`);
  };

  refresh();
  return root;

  function pushHistory(path: string) {
    if (history[historyIndex] === path) return;
    history.splice(historyIndex + 1);
    history.push(path);
    historyIndex = history.length - 1;
  }
}

function fileTable(visibleItems: FsItem[], title: string, selected: FsItem | null) {
  return `
    <div class="file-table">
      <div class="file-row file-head"><span>${title}</span><span>Size</span><span>Modified</span></div>
      ${visibleItems.map((item) => `
        <button draggable="true" class="file-row ${selected?.path === item.path ? "selected" : ""}" data-item="${escapeAttr(item.path)}">
          <span>${item.entry_type === "folder" ? "[DIR]" : "[FILE]"} ${item.name}</span><span>${formatSize(item.size)}</span><span>${formatDate(item.modified)}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function formatSize(size: number) {
  if (!size) return "--";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(value: string) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds)) return value;
  return new Date(seconds * 1000).toLocaleString();
}

function associationFor(item: FsItem) {
  if (item.entry_type === "folder") return "Folder opens in File Explorer";
  if (item.name.match(/\.(md|txt|log)$/i)) return "Association: Aether Notes";
  if (item.name.match(/\.(png|jpg|jpeg|webp)$/i)) return "Association: Aether Preview";
  if (item.name.match(/\.(pkg|aetherpkg)$/i)) return "Association: AetherPkg";
  return "Association: Host default";
}

function joinPath(base: string, name: string) {
  const separator = base.includes("\\") ? "\\" : "/";
  return `${base.replace(/[\\/]+$/, "")}${separator}${name}`;
}

function parentPath(path: string) {
  if (!path.includes("\\") && !path.includes("/")) return null;
  const parts = path.split(/[\\/]/).filter(Boolean);
  if (parts.length <= 1) return null;
  const prefix = path.startsWith("\\\\") ? "\\\\" : path.match(/^[A-Za-z]:/)?.[0] ?? "";
  parts.pop();
  return prefix ? `${prefix}\\${parts.slice(prefix ? 1 : 0).join("\\")}` : `/${parts.join("/")}`;
}

function escapeAttr(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
