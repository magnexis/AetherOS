# Architecture

## Desktop Shell

The shell starts in `src/main.ts`, which mounts `AetherDesktop` from `src/desktop.ts`. The desktop owns global state for theme, animation mode, compact dock, developer mode, performance profile, notifications, lock state, and restored window layout.

## Root OS Substrate

AetherOS now includes root-level OS layers below the Tauri shell:

- `kernel/`: kernel manifest, ABI, modules, syscalls, rings, boot policy, and subsystem list
- `services/`: service/daemon manifest with dependencies and permissions
- `drivers/`: driver registry, signature policy, device tree, and driver binding state
- `cli/`: command-line tooling for system status, validation, services, drivers, packages, config, and logs
- `ui/`: graphical shell manifest that maps the optional UI layer to the current Tauri frontend
- `system/`: shared system graph loader, validation logic, mutation helpers, and structured logging
- `config/`: system configuration and paths to core manifests
- `pkg/`: package repositories and registry state
- `security/`: capability and admin policy model
- `logs/`: structured JSONL system event logs

`system/aether-system.mjs` loads these manifests into one graph. It also plans and applies boot targets by combining `config/boot-targets.json`, `services/services.manifest.json`, `drivers/drivers.manifest.json`, and security policy. `cli/aether.mjs` uses that graph for commands and writes structured events into `logs/system-events.jsonl`.

## Boot and Service Orchestration

`config/boot-targets.json` defines native startup profiles:

- `minimal`: core init, registry, and driver manager only
- `graphical`: full shell, package daemon, Shield, and UI stack
- `recovery`: repair-safe profile without UI session restore
- `diagnostic`: verbose service and driver tracing target

The system utility builds a boot plan by resolving target drivers and topologically ordering service dependencies. Applying a target updates the boot configuration, service enablement, service health, and driver running state together. The `init` service owns `boot.targets.apply` and `services.enable`, while `security/policy.json` records those as admin actions.

## Recovery Supervisor

`config/recovery-policy.json` and the `aether-recoveryd` service form the root recovery layer. The supervisor checks the active boot target, required drivers, enabled service health, protected packages, unsigned kernel drivers, and UI entry state.

The CLI exposes diagnosis, snapshots, and repair through `aether recovery ...`. Repair creates a snapshot first, then updates only the owning manifests: system config, service manifest, driver manifest, and package registry. `security/policy.json` declares `recovery.snapshot` and `recovery.repair` as admin actions so future graphical tools can enforce the same boundary.

## System Operations Layer

AetherOS now includes a broader operations layer:

- System Event Bus for structured service, package, file, recovery, security, notification, and update events
- Service logs per daemon under `logs/services`
- Registry hives for kernel, service, driver, package, security, shell, task, and startup configuration
- Restore points promoted from recovery snapshots
- Driver Manager v2 metadata for profiles, version history, rollback, hardware matching, blocked drivers, and signature warnings
- Package dependency solver lockfile with conflicts, required services, required drivers, and rollback plans
- Startup app manager and task scheduler manifests
- Crash reporter bundles with logs, service state, package registry, recovery report, and replay metadata
- Update engine manifests for signed updates, staging, rollback points, release channels, and restart-required state

Graphically, Control Panel is the hub for these tools. Dedicated apps expose Boot Manager, Aether Registry, Device Manager, Permission Prompt Center, Task Scheduler, Crash Reporter, and Event Viewer.

The shell renders a full-screen OS-like surface with:

- Wallpaper
- Top status bar
- Clock
- Network, battery, notification, and profile controls
- Desktop icons
- Bottom dock
- Start Menu 2.0 launcher
- System tray
- Desktop context menu
- Command palette
- Action Center and notification history
- Session lock screen
- Workspace strip and window tiling controls

## Window Manager

`src/windows.ts` contains the reusable internal window manager. It creates app windows, assigns z-index order, tracks active state, and supports:

- Opening app windows
- Closing windows
- Minimizing windows
- Maximizing windows
- Restoring minimized windows
- Dragging windows by their chrome
- Bringing clicked windows to the front
- Active window highlighting
- Resizing
- Edge snapping
- Snap preview while dragging
- Alt+Tab focus cycling
- Layout snapshots for persistence
- Taskbar preview integration

Each built-in app returns an `HTMLElement` that is mounted inside the window body.

## Built-In Apps

The shell includes five built-in apps:

- `src/fileExplorer.ts`: Rust-backed filesystem explorer
- `src/terminal.ts`: Aether terminal command interface backed by Rust commands
- `src/settings.ts`: Shell and system preferences
- `src/systemMonitor.ts`: Host system dashboard plus simulated GPU telemetry
- `src/packageManager.ts`: Local JSON-backed package registry and package state
- `src/developerConsole.ts`: Shell logs, backend command probes, package state, and window layout diagnostics
- `src/session.ts`: Notification center and lock screen
- `src/backend.ts`: Tauri invoke bridge, fallback browser state, notifications, and shell logger
- `src/appRuntime.ts`: Third-party app manifests, permissions, lifecycle, and sandboxed app windows
- `src/serviceManager.ts`: Background services, boot policy, logs, restart controls, and developer-created services
- `src/securityCenter.ts`: Identity, permissions, admin approval, and Aether Shield virus protection
- `src/searchApp.ts`: Local index and Spotlight-style system search UI
- `src/sdkCenter.ts`: TypeScript SDK, Rust bridge templates, app scaffolder, and packaging CLI examples
- `src/updateCenter.ts`: Release channels, changelog, rollback, and recovery mode
- `src/controlPanel.ts`: Advanced device, services, firewall, environment, startup, and recovery tools
- `src/assistantApp.ts`: Local command helper for files, packages, settings, security, and recovery
- `src/kernelCore.ts`: Root kernel model and persistent frontend state for registry hives, drivers, device tree, modules, syscalls, interrupts, boot flags, panic policy, power state, and protection-ring view
- `src/kernelLab.ts`: UI control surface for the root kernel model plus advanced kernel research prototypes for SASOS, protection domains, transparent compatibility VMs, formal verification, semantic filesystems, deterministic replay, object capabilities, zero-copy IPC, reactive streams, hot-swappable components, hardware acceleration, process scheduling, safe bytecode, compressed paging, VFS, namespaces, and OSDev learning paths
- `src/nexus.ts`: Aether Nexus command center for live system graph control, workspace choreography, automation rules, self-healing diagnostics, time ribbon, command mesh, and mode launches
- `src/marketplace.ts`: Aether Marketplace catalog with featured apps, reviews, screenshots, channels, install flow, and developer publishing language
- `src/platform.ts`: Shared platform data models for runtime apps, services, updates, threats, and search
- `src/fileExplorer.ts`: Now routes deletes through the Rust Aether Trash command and shows queue, restore, permanent delete, associations, tabs, previews, and split panes
- `src/fileExplorer.ts`: Also includes address bar navigation, back/forward history, properties, open-with, and batch queue actions
- `src/searchApp.ts`: Combines shell records with a Rust SQLite file index
- `src/securityCenter.ts`: Calls Rust scanner/quarantine commands and keeps Aether Shield state visible

The command palette in `src/commandPalette.ts` executes shell actions such as opening apps, toggling theme, locking the session, opening Control Panel, opening Aether Assistant, searching package keywords, and showing about information.

The Start Menu and taskbar are owned by `src/desktop.ts` and `src/launcher.ts`. Start exposes pinned apps, recommendations, recent files, and power actions. The taskbar filters running indicators by workspace, shows app badges, opens hover previews, and exposes right-click menus for pin/open/settings flows.

The Action Center in `src/session.ts` combines notification history with quick controls for theme, do-not-disturb, dock density, performance, search, lock, Marketplace, Security, Updates, and Monitor.

## Aether Nexus

`src/nexus.ts` is the shell's command-center layer. It does not replace Settings, Control Panel, or Kernel Lab; it orchestrates them. Nexus reads package, service, update, threat, and window-manager state, then exposes visible actions for:

- Live system graph pulses across shell, apps, services, package registry, Shield, Kernel Lab, and Search
- Workspace modes such as Game Dev Hyperflow, Secure Ops, Creator Studio, and Recovery Tunnel
- Automation rules for thermal guard, package scan chain, focus restore, and crash replay capture
- Self-healing diagnostics for layout drift, package registry health, service mesh checks, and replay readiness
- Time Ribbon navigation for boot, session restore, kernel diagnostics, marketplace verification, and Nexus events
- Command Mesh buttons that open coordinated app stacks

Nexus is reachable from the desktop icon, Start Menu, command palette, system search, terminal `nexus` command, and Ctrl+Shift+X.

## Kernel Lab

`src/kernelCore.ts` owns the root kernel model, and `src/kernelLab.ts` is the UI control surface for it. This does not claim to be a bootable kernel. Instead, it gives working persistent UI models for:

- Round Robin, MLFQ, CFS-style virtual runtime, and AI-augmented process scheduling
- Kernel registry hives for boot profile, driver signature policy, services, memory thresholds, session restore, and capability prompts
- Driver configuration for display, storage, network, input, audio, and filesystem filter drivers
- Device tree model for PCIe, NVMe, USB, ACPI, and virtual buses
- Kernel module table for scheduler, VFS, capability, stream bus, and compatibility components
- Syscall table model with capability-gated policies
- Interrupt descriptor table model for timer, input, storage, GPU, and syscall vectors
- Boot flags, panic policy, safe/diagnostic boot profiles, and power state transitions
- A small eBPF-style register VM concept with bytecode verification language
- ZRAM-style compressed paging and cold-page compression modeling
- A Virtual Filesystem layer with everything-as-a-file and versioned file-write concepts
- PID/network/filesystem/GPU namespace isolation for future game containers
- Object-capability security with unforgeable tokens and `request_access(parent_token, "config")`
- Zero-copy microkernel IPC using shared-memory ring buffers for user-mode drivers
- Reactive "everything is a stream" APIs for file, socket, hardware, and interrupt events
- Hot-swappable component-object kernel design for scheduler and memory-manager live patching
- GPU/FPGA kernel acceleration models for compression and filesystem encryption
- Single Address Space OS model where processes share one 64-bit address space and Protection Domains enforce access
- Transparent compatibility hypervisor model for legitimate Windows shim containers and reproducible hardware profiles
- Formal verification workflow for micro-core invariants, allocator state, lock ordering, and capability monotonicity
- Semantic filesystem graph queries for assets, relationships, references, authorship, and build metadata
- Deterministic record/replay ring buffer for interrupts, clock reads, thread switches, and crash rewind
- OSDev Wiki and Aether From Scratch learning paths

The future native path is to move these concepts into Rust services first, then into a bootable kernel or Linux desktop environment integration if AetherOS becomes more than a shell.

Compatibility virtualization is explicitly scoped to transparent app compatibility and isolation. AetherOS does not implement stealth anti-cheat bypassing or hidden hardware-signature spoofing.

## Tauri Backend

`src-tauri/src/main.rs` exposes Rust commands through Tauri:

- `get_system_info()`
- `get_live_system_info()`
- `list_processes()`
- `get_os_version()`
- `echo_command(input: String)`
- `load_state()` and `save_state()`
- `get_known_folders()`
- `list_directory()`
- `create_directory()`
- `rename_path()`
- `delete_path()`
- `copy_path()`
- `touch_file()`
- `open_path()`
- `load_packages()`
- `install_package()`
- `remove_package()`
- `kill_process()`
- `get_storage_info()`
- `clear_cache()`
- `reset_shell_state()`
- `export_state()` and `import_state()`
- `ensure_app_runtime_dirs()`
- `load_app_manifests()`
- `open_app_webview()`
- `install_package_file()`
- `build_search_index()`
- `search_files()`
- `move_to_trash()`
- `list_trash()`
- `restore_from_trash()`
- `permanently_delete()`
- `scan_path()`
- `quarantine_path()`

The frontend calls these commands from the terminal, file explorer, package manager, system monitor, desktop shell, and developer console. In browser-only Vite preview, frontend code falls back safely where possible so the shell remains usable.

## Future Real OS Path

Phase 1 deliberately separates UI shell concerns from backend capabilities. The simulated filesystem, packages, and metrics can be replaced with Rust-backed services without rewriting the shell window system.

Future architecture can evolve toward:

- Deeper filesystem adapters and file previews
- Process and service management
- App sandboxing
- Package registry client
- User/session service
- Native Tauri multi-webview app runtime
- Direct per-app HTML loading into isolated native webviews
- Signed app/package verification
- Kernel or OS-provider security hooks
- Linux compositor or desktop environment integration
- Native system settings bridge
- Real shell extension APIs for Start, taskbar, tray, and desktop context menu
- Real assistant/automation engine connected to local permissions
- Native scheduler, namespace, memory, and VFS services in Rust
- Bootable kernel track using OSDev Bare Bones, Meaty Skeleton, and Aether From Scratch milestones
- Single-address-space protection-domain prototype
- Formal verification harness for Rust micro-core models
- Semantic filesystem metadata index backed by a real graph store
- Deterministic record/replay service for shell and runtime events
