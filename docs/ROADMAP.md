# Roadmap

## Completed Phase 2 Foundation

- Persistent state for settings, notifications, session, and window layout
- Real filesystem access for common file operations through Rust commands
- Real process and host metric bridge
- Terminal backend bridge
- Local JSON package registry
- Session lock screen
- Notification center
- Broader command palette search/actions
- Window resize, snap, saved positions, and Alt+Tab switching
- Developer Console app

## Completed Phase 3 Platform Foundation

- Third-party app runtime with manifests, permissions, lifecycle, sandboxed app windows, and local app store
- Advanced file manager layer with tabs, split view, previews, drag/drop queue, trash, permissions, recent files, search language, and associations
- Service manager for boot services, logs, restart policies, permissions, and developer services
- Package registry concepts for remote channels, signed packages, dependency resolution display, verification, history, and rollback
- Process control surface with kill bridge and elevated-control request flows
- Compositor-grade windowing foundation with workspaces, tiling, keyboard switching, snap, and persistent layouts
- Identity and security center with users, PIN state, permission grants, encrypted data indicators, admin approvals, and lock widgets
- Built-in Aether Shield virus protection surface
- System search/indexer foundation
- Aether SDK center
- Update system with channels, changelog, apply, rollback, and recovery mode

## Completed Phase 4 Depth Foundation

- Native App Runtime v2 primitives with app folder setup, disk manifest loading, Tauri webview launch hook, runtime permission prompts, app API bridge, and crash handling
- Rust SQLite file indexer and search database
- Aether Trash with restore and permanent delete
- File operation queue model with conflict-ready UI language
- System Storage and Privacy settings
- Native Web Notification bridge and do-not-disturb controls
- Local `.aetherpkg` package file install flow
- Workspace Overview/Mission Control
- Boot/startup splash and boot logs
- Aether Shield real scanner with hashing, rules, quarantine, and scan history
- Design system accessibility and consistency pass

## Completed Phase 5 Desktop Maturity Foundation

- Start Menu 2.0 with pinned apps, recent files, recommendations, search, and power controls
- Taskbar 2.0 with hover previews, right-click menus, app badges, pin/unpin actions, and per-workspace running indicators
- Real desktop context menu with file/folder creation, wallpaper toggle, display settings, icon sort, and shell refresh actions
- Aether Control Panel for advanced device manager, services, firewall, environment variables, startup apps, recovery, boot logs, and safe mode
- User profile expansion with multiple local users, avatar choices, PIN/password language, per-user settings, and app-data model
- File Explorer power features for address bar navigation, back/forward, properties, open-with, and batch operations
- Snap Assist preview and taskbar thumbnail cards
- Aether Marketplace expansion with featured apps, screenshots, reviews, categories, install/update history language, and local developer publishing flow
- System tray with service icons, quick status, network/power/audio controls, and hidden tray menu
- Audio and Display settings surface for volume, brightness, scale, multi-monitor layout, and refresh-rate display
- Aether Assistant local command helper for files, packages, gaming mode, security, startup, and recovery
- Recovery and Safe Mode controls for shell refresh, startup disabling language, package repair, boot logs, and session restore

## Completed Phase 6 Kernel Research Foundation

- Aether Kernel Lab app for advanced OS research inside the shell
- Root kernel model in `src/kernelCore.ts`
- Persistent kernel registry model with protected hives, boot policy, service policy, memory thresholds, session restore, and capability prompts
- Persistent driver configuration model with class, mode, signature state, and start/stop controls
- Persistent device tree model for PCIe, NVMe, USB, ACPI, and virtual devices
- Persistent kernel module table with load/unload state, version, and trust level
- Root syscall table model with capability-gated policies
- Persistent interrupt and timer vector model with handler counts and audit action
- Persistent boot flags, panic policy, safe/diagnostic boot profiles, protection-ring view, and power-state model
- Single Address Space OS and Protection Domain model
- Transparent compatibility hypervisor model for legitimate Windows shim containers
- Formal verification model for micro-core invariants
- Semantic filesystem graph-query model
- Deterministic record/replay crash debugging model
- Object-capability security model with token derivation instead of ambient identity
- Zero-copy IPC model with shared-memory circular buffers for user-mode drivers
- Reactive "everything is a stream" kernel API model
- Hot-swappable component-object kernel model for live scheduler replacement
- Hardware acceleration model for compression and filesystem encryption
- Scheduler models for Round Robin, MLFQ, CFS-style virtual runtime, and AI-augmented behavior tuning
- eBPF-style safe bytecode VM concept with verifier output
- ZRAM-style compressed paging model
- Virtual Filesystem model with native versioned-file ideas
- Namespace and isolation model for PID sandboxing and game containers
- OSDev Wiki and Aether From Scratch resource track

## Completed Phase 7 Nexus Command Center Foundation

- Aether Nexus app as a system-wide command center
- Live system graph spanning shell, apps, services, packages, Shield, Kernel Lab, and Search
- Workspace choreography modes for Game Dev Hyperflow, Secure Ops, Creator Studio, and Recovery Tunnel
- Mode launch actions that open coordinated app stacks and update the performance profile
- Automation rule engine surface for thermal guard, package scan chain, focus restore, and crash replay capture
- Self-healing diagnostics for shell drift, registry health, service mesh, and replay readiness
- Time Ribbon for boot/session/kernel/marketplace/Nexus event navigation
- Command Mesh for opening operational, build, recovery, and core research app stacks
- Nexus integration in desktop icons, Start, command palette, System Search, Terminal, Settings, and Ctrl+Shift+X
- Responsive Nexus layout and visible non-placeholder actions

## Completed Phase 8 Boot Orchestration Foundation

- Root boot target registry in `config/boot-targets.json`
- Minimal, graphical, recovery, and diagnostic startup profiles
- Boot plan generation that resolves target drivers and service dependencies
- Boot target application through shared system utilities
- Service enable/disable controls with health and restart metadata
- CLI commands for `targets`, `boot plan`, `boot apply`, and service enablement
- Security policy hooks for `boot.targets.apply` and `services.enable`
- Doctor validation for missing boot targets, service references, and driver references

## Completed Phase 9 Recovery Supervisor Foundation

- Recovery policy manifest in `config/recovery-policy.json`
- `aether-recoveryd` service with health, restart, boot, and permission metadata
- Protected `aether-recovery` package in the package registry
- Admin security actions for snapshots and repairs
- Recovery diagnosis for boot targets, drivers, services, packages, unsigned kernel drivers, and UI entry state
- Bounded recovery snapshots under `system/recovery-snapshots`
- Repair flow that restores required drivers, restarts enabled services, reinstalls protected packages, and safely handles invalid boot targets
- CLI commands for `recovery status`, `recovery diagnose`, `recovery snapshot`, and `recovery repair`
- Dedicated recovery supervisor documentation

## Completed Phase 10 System Operations Foundation

- Control Panel integration for boot targets, recovery status, service health, driver state, package repair, permissions, startup, tasks, events, crash reporting, and updates
- Snapshot restore command and restore point metadata
- System Event Bus manifest plus event publishing and replay CLI
- Per-service structured logs and `aether service <id> logs`
- Driver Manager v2 profiles, history, rollback, hardware matching, blocked driver list, and signature warnings
- Boot Manager app for normal boot, recovery boot, diagnostic boot, safe mode, and last known good configuration
- Aether Registry app for system hives
- Package dependency lock and dependency solving command
- Permission Prompt Center app
- Startup apps manifest
- Aether Task Scheduler app and manifest
- Crash Reporter app and crash bundle CLI
- Device Manager app
- Update Engine manifest and richer Update Center details

## Completed Phase 11 Administration Plane Foundation

- Network manifest with profiles, DNS, firewall rules, VPN state, and interface health
- Account manifest with users, groups, authentication policy, credential providers, and session policy
- Storage manifest with volumes, mounts, quotas, cleanup jobs, cache policy, and app-data ownership
- Audit manifest with categories, retention, export policy, and structured audit log flow
- Backup manifest with plans, targets, restore validation, retention, and last-run metadata
- Policy engine manifest with rule scopes, effects, enforcement mode, and violation evaluation
- Protected services for network, accounts, storage, audit, backup, and policy
- Protected packages for the administration plane
- Capability tokens and admin actions for network, firewall, accounts, storage, audit, backup, and policy
- CLI commands for network status/firewall, accounts, storage, audit, backup plans, and policy evaluation
- Graphical Network Center, Account Manager, Storage Manager, Audit Viewer, Backup Manager, and Policy Center apps
- Control Panel links for administration apps
- Doctor validation for admin manifests and cross-layer references

## Completed Phase 12 Windows-Plus Ecosystem Foundation

- Windows-familiar Aether experience manifest for Start, taskbar, widgets, snap layouts, quick settings, command registry, and default apps
- Aether ecosystem manifest for Store channels, verified apps, extension points, protocols, publishing, review policy, and quality gates
- Protected `aether-experience` and `aether-ecosystem` packages
- `aether-experienced` and `aether-ecosystemd` services
- Security capabilities for shell management, shell extensions, settings extensions, search indexing, and ecosystem management
- Event Bus topics for experience and ecosystem events
- CLI commands for `experience` and `ecosystem`
- Experience Center app
- Ecosystem Hub app
- Desktop, Start, command palette, terminal, System Search, Settings, and Control Panel integration
- Doctor validation for experience commands, default app associations, Store channels, app capabilities, and extension points

## Completed Phase 13 Security, Privacy, and Licensing Foundation

- Apache-2.0 license file and package metadata
- Root `NOTICE` file
- Root `PRIVACY.md` policy for local-first prototype data handling
- Security hardening manifest
- `aether-hardeningd` protected service
- `aether-hardening` protected package
- `hardening` Event Bus topic
- `hardening.evaluate` admin action and capability token
- CLI commands for hardening summary, controls, threat model, and policy
- Security Center hardening baseline panel
- Doctor validation for hardening controls, runtime default deny, Store signatures, and threat model presence
- Vite dependency update to clear reported moderate dev-server advisories

## Next Phase Ideas

- Persist shell experience edits from the UI back into `config/experience.json`
- Make Marketplace read from `config/ecosystem.json` instead of a local component array
- Add live Store installs through `.aetherpkg` and signed local publisher bundles
- Move hardening evaluation into a Rust command and publish posture changes to Event Viewer
- Add privacy export/delete controls to Settings and Audit Viewer
- Move administration manifests behind Rust-backed commands with file locking and transactional writes
- Add UI write-back flows for profile switching, account disablement, quota edits, policy enforcement, and backup restore previews
- Add live audit and backup progress events to Event Viewer and Notification Center
- Persist user-created Nexus modes and automations
- Surface boot targets in Control Panel and Kernel Lab
- Add boot transaction rollback and dry-run diff output
- Add recovery restore-from-snapshot and repair preview diffs
- Surface Recovery Supervisor status in Control Panel, Nexus, and boot logs
- Move event bus, service logs, restore, crash bundles, updates, and task execution into Rust-backed commands
- Add live Event Viewer streaming and restore preview diff UI
- Let Nexus rules subscribe to real Rust filesystem, package, and service events
- Add drag-and-drop workspace choreography templates
- Add visual dependency graph edges and real-time event streams
- Load installed app HTML directly into isolated native Tauri webviews
- Real file previews and editor integration
- Elevated process suspend/restart controls
- Real OS user accounts and session switching
- Plugin system for third-party apps and shell extensions
- Actual remote package registry with cryptographic package signing
- App sandboxing backed by native permission enforcement
- Linux distro version with compositor or desktop environment integration
- Real antivirus scanning engine integration
- File watcher service for realtime Aether Shield scans
- True async operation queue with progress from Rust events
- Real update channel
- Shell theming API
- Developer SDK for Aether apps
- Real Start/taskbar extension registry for third-party apps
- Real assistant automation engine with permission-gated skills
- Real display/audio backend bridge
- Rust-backed scheduler simulator service
- Rust-backed bytecode verifier and sandboxed extension runtime
- Real compressed cache service for shell data
- VFS abstraction over host filesystem adapters
- Namespace-style app isolation through native OS primitives
- Object-capability syscall prototype in Rust
- Shared-memory IPC ring buffer service
- Reactive stream event service
- Component migration interface for live-patched subsystems
- GPU/FPGA acceleration bridge for compression and encryption experiments
- Real protection-domain memory service
- Transparent compatibility VM prototype without stealth bypassing
- Formal proof harness using a model checker or theorem prover
- Graph database metadata engine for files/assets
- Deterministic replay recorder for system events

## Longer-Term Direction

AetherOS can mature from this shell prototype into a layered desktop environment. The near-term path is to keep the TypeScript shell productive while moving host integrations into Rust, then decide whether the target is an overlay shell, a Linux desktop environment, or a complete distribution.
