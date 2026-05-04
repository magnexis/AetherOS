# Changelog

All notable AetherOS changes should be recorded here.

This project currently moves quickly, so entries are grouped by foundation phase rather than published semver releases.

## Unreleased

- Built the Windows x64 release artifacts for v1.1.2:
  - `release/AetherOS-1.1.2-windows-x64-setup.exe`
  - `release/AetherOS-1.1.2-windows-x64-portable.exe`
  - `release/AetherOS-1.1.2-windows-x64.msi`
- Added release metadata under `release/`, including release notes and SHA-256 checksums.
- Updated GitHub release guidance so binaries are uploaded to GitHub Releases instead of committed.
- Added Aether Nexus command center with live system graph, workspace modes, automation rules, self-healing diagnostics, Time Ribbon, Command Mesh, terminal command, command palette entry, search entry, Settings link, desktop icon, and Ctrl+Shift+X shortcut.
- Expanded Kernel Lab with single address space, protection domains, transparent compatibility VM model, formal verification, semantic filesystem queries, deterministic replay, object capabilities, zero-copy IPC, reactive streams, live patching, hardware acceleration, schedulers, eBPF-style VM, ZRAM, VFS, and namespaces.
- Added desktop maturity features including Start Menu 2.0, taskbar previews, system tray, desktop context menu, Control Panel, Assistant, user profile surfaces, audio/display settings, recovery controls, and Marketplace expansion.
- Added native runtime, real search index, trash, file operation queue model, storage/privacy settings, native notification bridge, `.aetherpkg` install flow, workspace overview, boot flow, and Aether Shield scanner.

## Phase 1 Foundation

- Created runnable Tauri + Vite + vanilla TypeScript + Rust desktop shell.
- Added custom desktop UI, dock/taskbar, app launcher, window manager, File Explorer, Terminal, Settings, System Monitor, Package Manager, command palette, Rust command bridge, and documentation.

## Phase 2 Foundation

- Added persistent state, Rust-backed filesystem actions, live system metrics, terminal backend commands, JSON package registry, lock screen, notification center, window resizing/snapping, Alt+Tab, and Developer Console.

## Phase 3 Platform Foundation

- Added app runtime foundations, advanced file manager models, Service Manager, package registry concepts, process controls, workspaces, identity/security surfaces, Aether Shield, System Search, SDK Center, and Update Center.

## Phase 4 Depth Foundation

- Added native runtime v2 primitives, Rust SQLite search index, Aether Trash, storage/privacy management, native notifications, local package file install, Mission Control-style overview, boot/startup flow, scanner/quarantine, and design system polish.

## Phase 5 Desktop Maturity Foundation

- Added Windows-style Start/taskbar upgrades, desktop context actions, Control Panel, real user profile surfaces, File Explorer power features, Snap Assist, Marketplace expansion, system tray, audio/display controls, Assistant, and recovery/safe-mode controls.

## Phase 6 Kernel Research Foundation

- Added Kernel Lab as a research surface for scheduler, memory, VFS, namespace, security, IPC, stream, live patching, hardware acceleration, compatibility, verification, semantic filesystem, and deterministic replay concepts.

## Phase 7 Nexus Foundation

- Added Aether Nexus as the OS command-center layer that orchestrates apps, windows, services, packages, security, settings, diagnostics, modes, automations, and event timelines.
