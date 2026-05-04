# Backend Commands

AetherOS exposes native Rust functionality through Tauri commands in `src-tauri/src/main.rs`. Frontend code calls these through `invokeCommand()` in `src/backend.ts`.

Browser-only Vite preview uses safe frontend fallbacks where possible. The full command bridge is available in the Tauri desktop app.

## System Commands

| Command | Purpose |
| --- | --- |
| `get_system_info()` | Returns basic mock/system info for Phase 1 compatibility. |
| `get_live_system_info()` | Returns CPU, RAM, disk, uptime, OS, and kernel metrics. |
| `list_processes()` | Returns host process records. |
| `kill_process(pid)` | Requests process termination. |
| `get_os_version()` | Returns host OS version text. |
| `echo_command(input)` | Echo bridge used by Terminal fallback behavior. |

## State Commands

| Command | Purpose |
| --- | --- |
| `load_state()` | Loads persisted shell state JSON. |
| `save_state(state)` | Saves persisted shell state JSON. |
| `get_storage_info()` | Returns app data paths and storage metadata. |
| `clear_cache()` | Clears shell cache data. |
| `reset_shell_state()` | Resets persisted shell state. |
| `export_state()` | Exports shell state as JSON text. |
| `import_state(state_json)` | Imports shell state JSON text. |

## Filesystem Commands

| Command | Purpose |
| --- | --- |
| `get_known_folders()` | Returns known folder names and paths. |
| `list_directory(path)` | Lists folders and files for File Explorer and Terminal. |
| `create_directory(path)` | Creates a directory. |
| `rename_path(from, to)` | Renames or moves a path. |
| `delete_path(path)` | Deletes a path. |
| `copy_path(from, to)` | Copies a file or directory. |
| `touch_file(path)` | Creates a file if missing. |
| `open_path(path)` | Requests host open behavior. |

## Trash Commands

| Command | Purpose |
| --- | --- |
| `move_to_trash(path)` | Moves a path into Aether Trash. |
| `list_trash()` | Lists trash entries. |
| `restore_from_trash(trash_path, original_path)` | Restores a trashed entry. |
| `permanently_delete(path)` | Deletes a trash entry permanently. |

## Package and Runtime Commands

| Command | Purpose |
| --- | --- |
| `load_packages()` | Loads local package registry JSON. |
| `install_package(name)` | Marks a package installed. |
| `remove_package(name)` | Marks a package removed when allowed. |
| `install_package_file(package_path)` | Installs a local `.aetherpkg` manifest. |
| `ensure_app_runtime_dirs()` | Creates local app runtime directories. |
| `load_app_manifests()` | Loads installed app manifests from disk. |
| `open_app_webview(app_id)` | Opens a Tauri webview hook for native runtime work. |

## Search Commands

| Command | Purpose |
| --- | --- |
| `build_search_index()` | Builds the Rust SQLite filesystem index. |
| `search_files(query)` | Searches indexed files and folders. |

## Security Commands

| Command | Purpose |
| --- | --- |
| `scan_path(path)` | Runs Aether Shield hash/rule scan over a path. |
| `quarantine_path(path)` | Moves a path into quarantine storage. |

## Adding a Command

1. Add a `#[tauri::command]` function in `src-tauri/src/main.rs`.
2. Add it to the `invoke_handler!` list.
3. Call it from TypeScript through `invokeCommand()`.
4. Return structured data when the UI needs to render state.
5. Document the command here.
6. Add verification steps to `TESTING.md` if it is user-facing.

## Safety Notes

- Path commands should resolve user-facing aliases safely.
- Destructive commands should be explicit in the UI.
- Package install commands are local prototypes until real signatures and remote registry validation exist.
- Security scanner commands are useful prototype tools, not a replacement for OS-level antivirus.
