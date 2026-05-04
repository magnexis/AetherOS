# User Guide

This guide explains how to use AetherOS as a desktop shell prototype.

## Starting AetherOS

Run the desktop app:

```powershell
npm run tauri:dev
```

Run the browser preview:

```powershell
npm run dev
```

The browser preview is useful for fast UI checks. The Tauri app is the real desktop shell target because it can call Rust backend commands.

## Desktop Shell

AetherOS opens into a full-screen desktop with:

- Top status bar
- Clock
- Network and power controls
- Notification button
- User profile button
- Desktop icons
- Bottom dock/taskbar
- Workspace strip
- System tray
- Start launcher

Double-click desktop icons to open apps. Dock icons open or focus apps. Running app badges show how many windows exist for the current workspace.

## Windows

App windows can be:

- Dragged by the title bar
- Resized from the lower-right handle
- Minimized
- Maximized
- Closed
- Focused by clicking
- Snapped by dragging to the screen edge
- Cycled with Alt+Tab

The shell persists window layout through the local state bridge.

## Start Menu

Open Start from the top-left AetherOS button, the dock launcher, or Ctrl+Space.

Start includes:

- Pinned apps
- Search
- Recommended actions
- Recent files
- Power actions

Power actions are shell-level prototype actions: sleep shell, restart shell, lock, and shutdown mock.

## Command Palette

Open the command palette with Ctrl+K or Ctrl+Shift+P.

Use it to open apps, toggle theme, lock the session, tile windows, open workspace overview, and access Nexus, Kernel Lab, Marketplace, Search, Settings, and other shell apps.

## Aether Nexus

Aether Nexus is the command-center layer. Open it with:

- Desktop icon: Nexus
- Start Menu
- Command Palette: Open Aether Nexus
- Terminal command: `nexus`
- Keyboard shortcut: Ctrl+Shift+X

Nexus includes:

- Live system graph
- Workspace choreography modes
- Automation rules
- Self-healing diagnostics
- Time Ribbon
- Command Mesh

Every major Nexus button triggers visible shell behavior such as opening app stacks, changing performance profile, tiling windows, logging diagnostics, or sending notifications.

## Built-In Apps

- File Explorer: Browse known folders, use breadcrumbs, search, create, rename, copy, delete, restore trash, inspect properties, and manage file queues.
- Terminal: Run shell, package, filesystem, and system commands.
- Settings: Manage appearance, performance, storage, privacy, security, notifications, shortcuts, developer options, accounts, audio, and display.
- System Monitor: View live host metrics, active windows, processes, and process control actions.
- AetherPkg: Install, remove, verify, update, rollback, and install local `.aetherpkg` packages.
- Marketplace: Browse featured apps, reviews, categories, screenshots, and developer publishing flows.
- Ecosystem Hub: Manage Aether Store channels, verified apps, shell extension points, protocols, publishing, and app trust.
- Experience Center: Inspect and tune Start, taskbar, widgets, snap layouts, registered commands, and default app behavior.
- App Runtime: Inspect `aether.app.json` manifests, permissions, install flow, and sandboxed runtime windows.
- Service Manager: Start, stop, restart, inspect logs, and manage boot service settings.
- Security Center: Manage user/security surfaces, permissions, Aether Shield scans, quarantine, and threat state.
- System Search: Search apps, files, settings, packages, services, commands, updates, and recent actions.
- SDK Center: Review TypeScript SDK, Rust bridge patterns, package CLI, scaffold flow, and example apps.
- Update Center: Review release channels, changelog, apply/download/rollback flow, and recovery mode.
- Control Panel: Advanced boot targets, recovery, devices, services, firewall, environment variables, startup apps, package repair, permissions, tasks, event streams, crash bundles, update engine, and boot logs.
- Boot Manager: Normal boot, recovery boot, diagnostic boot, safe mode, and last known good configuration.
- Aether Registry: Kernel, service, driver, package, security, shell, task, and startup hives.
- Device Manager: Buses, devices, driver profiles, rollback, hardware matching, blocked drivers, and signature warnings.
- Permission Center: Central app capability request approval and audit.
- Task Scheduler: Login, interval, event, idle, and capability-token task actions.
- Crash Reporter: Crash bundles with logs, active windows, service state, package registry, recovery report, and replay metadata.
- Event Viewer: System Event Bus topics and replay windows.
- Network Center: Profiles, interfaces, DNS, firewall rules, and VPN state.
- Account Manager: Users, groups, credential providers, authentication policy, and session policy.
- Storage Manager: Volumes, quotas, cleanup jobs, cache policy, and app-data allocation.
- Audit Viewer: Audit categories, retention, export policy, recent records, and audit log state.
- Backup Manager: Backup plans, restore validation, retention, snapshots, and last-run metadata.
- Policy Center: Policy rules, enforcement mode, effects, scopes, and violations.
- Assistant: Local command helper for files, packages, settings, security, and recovery.
- Kernel Lab: Interactive research surface for advanced OS concepts.
- Developer Console: Logs, backend probes, package state, diagnostics, and window layout inspection.

## Terminal Commands

Core commands:

```text
help
clear
apps
status
version
nexus
ecosystem
experience
theme dark
theme light
```

Filesystem commands:

```text
pwd
ls
cd <path>
mkdir <name>
touch <name>
rm <path>
```

System commands:

```text
sysinfo
processes
```

Package commands:

```text
install demo-app
remove demo-app
```

Administration commands:

```text
network status
network firewall
accounts
storage
audit all 10
backup plans
policy
```

## Lock Screen and Notifications

The profile button locks the session. Notifications appear in shell history and, when enabled, through native notification bridging.

Do-not-disturb can be toggled from Settings or Action Center.

## Prototype Boundaries

AetherOS is runnable, but it is not yet a bootable operating system. Some advanced concepts such as formal verification, SASOS, kernel scheduling, and compatibility virtualization are interactive research surfaces until backed by deeper native implementation.
