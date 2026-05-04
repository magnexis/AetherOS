# Project Status

AetherOS is currently a runnable desktop shell prototype, not a bootable standalone operating system.

## Current Maturity

| Area | Status |
| --- | --- |
| Desktop shell | Working prototype |
| Window manager | Working internal simulation |
| File Explorer | Rust-backed host filesystem bridge with advanced UI surfaces |
| Terminal | Working shell commands with Rust bridge |
| Settings | Working persistent shell settings |
| System Monitor | Rust-backed host metrics plus simulated GPU metric |
| Package Manager | Local JSON registry prototype |
| Marketplace | Local catalog and publishing-flow prototype |
| App Runtime | Manifest and sandboxed app-window prototype |
| Aether Nexus | Working command-center orchestration layer |
| Root boot targets | Working manifest and CLI orchestration layer |
| Recovery Supervisor | Working manifest diagnosis, snapshot, and repair foundation |
| System operations layer | Working manifests, CLI commands, and graphical app surfaces |
| Administration plane | Working manifests, CLI commands, protected services, protected packages, and graphical app surfaces |
| Windows-plus experience | Working manifest, CLI commands, protected service/package, keyboard routes, and graphical app surface |
| Aether ecosystem | Working manifest, CLI commands, protected service/package, Store/SDK/runtime links, and graphical app surface |
| Security Center | Prototype permissions, scanner, and hardening baseline surface |
| Security hardening | Working manifest, protected service/package, CLI reports, doctor validation, and Security Center panels |
| Aether Shield | Hash/rule scanner prototype |
| Privacy and licensing | Root privacy policy, NOTICE file, Apache-2.0 license text, and package metadata |
| Kernel Lab | Interactive OS research surface |
| Update Center | Update/rollback/recovery UI prototype |
| Native OS replacement | Future research path |

## What Is Real Today

- Tauri desktop app launches.
- Vite frontend builds.
- Rust backend compiles.
- Shell windows open, move, resize, minimize, maximize, close, snap, and persist layout.
- File operations call Rust commands where available.
- Terminal calls backend commands.
- Package state is shared across AetherPkg and Terminal.
- Boot targets can be listed, planned, and applied through the Aether CLI.
- Service enablement, health, restart policy, driver state, and boot policy are linked through root manifests.
- Recovery Supervisor can diagnose health, snapshot state, and repair broken service, driver, package, and boot manifest state.
- Event bus, service logs, restore points, task scheduler, startup apps, crash bundles, update manifests, registry hives, and dependency solving are represented in root manifests.
- Network, account, storage, audit, backup, and policy administration state is represented in root manifests with CLI commands and Control Panel UI entry points.
- Start, taskbar, widget, snap, shortcut, and default-app policy is represented in `config/experience.json`.
- Store channels, verified apps, extension points, app protocols, publishing gates, and trust policy are represented in `config/ecosystem.json`.
- Security hardening controls, threat model, runtime default-deny posture, Store signature rules, and scoring are represented in `config/security-hardening.json`.
- The `aether-hardeningd` protected service, `aether-hardening` protected package, `hardening` event topic, and `hardening.evaluate` capability are linked through the root manifests.
- Root legal and privacy documents exist: Apache-2.0 `LICENSE`, `NOTICE`, and `PRIVACY.md`.
- Control Panel opens the new Boot Manager, Registry, Device Manager, Permission Center, Task Scheduler, Crash Reporter, and Event Viewer apps.
- Settings change visible shell state.
- Search, notifications, session state, workspace overview, and Nexus actions are wired to visible behavior.

## What Is Prototype or Simulated

- GPU telemetry
- True OS login provider
- Native OS task scheduler integration
- Native Windows device enumeration
- Kernel-mode antivirus
- Real app sandbox enforcement
- Remote signed package registry
- Runtime hardening enforcement beyond shell-managed policy checks
- Native process suspend/restart/resource limits
- Real service manager integration with OS boot
- Native isolated app webview loading for every installed app
- Kernel features in Kernel Lab
- Transparent compatibility VM implementation
- Formal verification harness
- Semantic filesystem graph database
- Deterministic replay recorder

## Current Safety Boundary

AetherOS may model compatibility virtualization for legitimate application compatibility and reproducible development environments. It does not implement stealth anti-cheat bypassing, hidden hardware-signature spoofing, malware persistence, credential harvesting, or evasion behavior.

## Recommended Next Engineering Focus

1. Persist Nexus modes and automation rules.
2. Replace more UI-only package/runtime flows with Rust-backed state.
3. Expose root boot targets, recovery reports, and service plans in the graphical Control Panel.
4. Add restore-from-snapshot and repair diff previews.
5. Move administration-plane writes behind Rust commands with transactional file locking.
6. Move Experience Center and Ecosystem Hub reads/writes behind Rust commands.
7. Load installed app HTML into isolated native Tauri webviews.
8. Add event streaming from Rust to the frontend for file indexing, copy queues, service logs, audit events, backups, experience events, ecosystem events, and notifications.
9. Expand visual regression testing for small-window overlap.
10. Introduce a real signed package manifest format.
11. Move hardening evaluation and posture events behind Rust commands with tamper-evident audit records.
