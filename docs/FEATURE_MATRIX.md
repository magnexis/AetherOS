# Feature Matrix

This matrix tracks the current implementation level of major AetherOS areas.

Status meanings:

- Working: implemented and interactive.
- Partial: implemented with meaningful behavior, but not complete.
- Prototype: interactive model or UI surface for future native work.
- Future: documented direction, not implemented yet.

| Area | Status | Notes |
| --- | --- | --- |
| Desktop shell | Working | Full-screen shell with wallpaper, status bar, dock, tray, desktop icons, and context menus. |
| Root OS substrate | Partial | Root folders and manifests for kernel, services, drivers, CLI, system utilities, config, packages, security, and logs. |
| Boot targets | Partial | `config/boot-targets.json` defines minimal, graphical, recovery, and diagnostic targets with service/driver plans. |
| Recovery Supervisor | Partial | `aether-recoveryd` diagnoses health, creates snapshots, repairs manifests, and logs actions. |
| System Event Bus | Partial | JSONL event stream with service, package, file, recovery, security, notification, and update topics. |
| Service Logs | Partial | Per-daemon structured JSONL service logs exposed through the CLI. |
| Registry Editor | Prototype | Graphical hive browser for kernel, services, drivers, packages, security, shell, tasks, and startup. |
| Restore Points | Partial | Recovery snapshots can be promoted into named restore point metadata and restored by snapshot path. |
| Driver Manager v2 | Partial | Driver profiles, version history, rollback data, hardware matching, blocked driver list, and warnings. |
| Device Manager | Prototype | Device tree app with buses, devices, driver state, events, and troubleshooting actions. |
| Permission Prompt Center | Prototype | Central UI for app capability requests and grant decisions. |
| Startup Apps Manager | Prototype | Startup app entries with enablement, delay, impact, and capability data. |
| Aether Task Scheduler | Prototype | Login, interval, event, idle, and capability-token task model. |
| Crash Reporter | Partial | Crash bundle generation policy and CLI bundle creation. |
| Update Engine | Partial | Signed manifest model, staging, rollback point, channels, and restart-required state. |
| Administration Plane | Partial | Network, account, storage, audit, backup, and policy manifests with protected services, packages, CLI commands, and UI apps. |
| Experience Center | Partial | Windows-familiar Start, taskbar, widgets, snap layouts, registered commands, and default app manifest plus UI. |
| Ecosystem Hub | Partial | Store channels, verified app catalog, shell extension points, protocols, publishing checklist, packages, and service model. |
| Security Hardening | Partial | Secure desktop baseline, protected hardening service/package, control scoring, threat model, CLI reports, and Security Center panel. |
| Network Center | Prototype | Profile, DNS, firewall, VPN, and interface management surface backed by `config/network.json`. |
| Account Manager | Prototype | Local users, groups, authentication policy, credential providers, and session policy surface. |
| Storage Manager | Prototype | Volumes, quotas, cleanup jobs, cache policy, and app-data allocation surface. |
| Audit Viewer | Partial | Structured audit policy, category filtering, retention metadata, and JSONL audit log flow. |
| Backup Manager | Partial | Backup plans, restore validation, retention metadata, last-run records, and backup CLI flow. |
| Policy Center | Partial | Policy rules, enforcement mode, capability scopes, and violation evaluation surface. |
| Aether CLI | Partial | `cli/aether.mjs` validates and mutates services, drivers, boot targets, packages, config, kernel status, and logs. |
| Window manager | Working | Open, close, minimize, maximize, drag, resize, focus, snap, tile, Alt+Tab, workspace visibility, and layout snapshots. |
| Start Menu | Working | Pinned apps, search, recommendations, recent files, and power actions. |
| Taskbar | Working | Running badges, workspace filtering, hover previews, right-click menu, and app launch/focus. |
| Workspaces | Partial | Switching, overview, movement, tiling, and template language exist. Persistent workspace templates are future work. |
| File Explorer | Partial | Rust-backed listing and operations plus tabs, split view, trash, queue, properties, open-with, search, and associations. |
| Terminal | Working | Shell, package, filesystem, system, theme, and Nexus commands. |
| Settings | Working | Appearance, performance, storage, privacy, notifications, accounts, shortcuts, developer, audio/display, and about surfaces. |
| System Monitor | Partial | Live host metrics and process list. Some control actions are request/prototype flows. |
| AetherPkg | Partial | Local registry, install/remove/update, channels, verify, rollback, and `.aetherpkg` flow. Remote signed registry is future work. |
| Marketplace | Prototype | Local catalog with reviews, screenshots, categories, install history language, and developer publishing flow. |
| App Runtime | Prototype | Manifests, permissions, lifecycle, sandboxed windows, and Tauri webview hook. Full native isolation is future work. |
| Service Manager | Prototype | Service controls, logs, health, restart policy, boot flags, and developer service model. |
| Security Center | Prototype | Identity, permissions, admin approval, and Shield surfaces. Real OS credential provider is future work. |
| Aether Shield | Partial | Rust-backed hash/rule scanner and quarantine flow. Not a kernel-mode antivirus. |
| System Search | Partial | Shell records plus Rust SQLite file search. Background event indexing is future work. |
| SDK Center | Prototype | TypeScript SDK examples, Rust bridge template, scaffolder flow, packaging CLI examples, and manifests. |
| Update Center | Prototype | Channels, changelog, apply/download/rollback, and recovery UI. Real update transport is future work. |
| Control Panel | Prototype | Devices, firewall, environment variables, startup apps, repair tools, safe mode, and boot logs. |
| Assistant | Prototype | Local helper actions for files, packages, settings, security, startup, and recovery. |
| Aether Nexus | Working | Command center for graph, modes, automations, self-healing, Time Ribbon, and Command Mesh. |
| Root kernel model | Partial | `src/kernelCore.ts` owns persistent registry, drivers, devices, modules, syscalls, interrupts, boot/panic/power policy, and protection-ring state. |
| Kernel Lab | Prototype | UI control surface for the root kernel model plus research surface for advanced OS concepts. Not a bootable kernel implementation. |
| Documentation | Working | README, user guide, development, testing, troubleshooting, backend commands, roadmap, governance, release, and GitHub docs. |
| GitHub automation | Working | CI, Dependabot, issue templates, PR template, CODEOWNERS, and community docs. |

## Highest-Value Next Steps

1. Persist Nexus modes and automation rules.
2. Add Rust event streaming for copy queues, index progress, package events, and service logs.
3. Load installed app HTML directly into isolated Tauri webviews.
4. Introduce package signature metadata and verification.
5. Add real visual regression checks for shell overlap.
6. Move administration plane reads and writes behind Rust commands.
7. Move Experience Center and Ecosystem Hub data reads behind Rust commands and live Event Viewer streams.
