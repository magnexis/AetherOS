# Documentation Index

This folder contains the working documentation for AetherOS.

## Start Here

- `../README.md`: Project overview, install, run, build, features, and limitations
- `VISION.md`: Product principles, platform direction, and research direction
- `USER_GUIDE.md`: How to use the shell, windows, apps, shortcuts, and Nexus
- `DEVELOPMENT.md`: How the project is organized and how to add features safely
- `DESIGN_SYSTEM.md`: UI design rules, layout rules, accessibility, and app checklist
- `TESTING.md`: Verification checklist for builds, UI, backend commands, and docs
- `TROUBLESHOOTING.md`: Common Windows, Node, Rust, Tauri, and shell fixes
- `PROJECT_STATUS.md`: Current maturity, real features, prototype boundaries, and next focus
- `FEATURE_MATRIX.md`: Implementation status across major subsystems
- `RFC_PROCESS.md`: Process for proposing large technical changes
- `SYSTEM_LAYOUT.md`: Root OS-layer folders, manifests, CLI commands, and validation flow
- `boot-service-orchestration.md`: Boot targets, service plans, CLI commands, and config flow
- `recovery-supervisor.md`: Recovery policy, health diagnosis, snapshots, repairs, and security flow
- `system-operations-expansion.md`: Control Panel operations, event bus, registry, restore points, task scheduler, crash reporter, device manager, and update engine
- `admin-plane.md`: Network, accounts, storage, audit, backup, policy, service, CLI, and UI administration layer
- `windows-plus-ecosystem.md`: Windows-familiar shell behavior plus Aether's own Store, extension, protocol, and publishing ecosystem
- `security-hardening.md`: Secure desktop baseline, hardening service, CLI, controls, threat model, and dependency posture

## Architecture and APIs

- `ARCHITECTURE.md`: Desktop shell, window manager, built-in apps, backend, Nexus, and kernel research model
- `BACKEND_COMMANDS.md`: Rust/Tauri commands exposed to the frontend
- `KERNEL_MODEL.md`: Kernel registry, drivers, device tree, modules, syscalls, interrupts, boot, panic, and power model
- `KEYBOARD_SHORTCUTS.md`: Registered shortcuts and their shell actions

## Planning

- `PHASE_1_FEATURES.md`: Full feature inventory across completed foundation phases
- `ROADMAP.md`: Completed phases and next-phase ideas

## GitHub

- `GITHUB_SETUP.md`: Optional publishing guidance and recommended repository settings
- `../CONTRIBUTING.md`: Contribution rules and pull request checklist
- `../SECURITY.md`: Security policy and boundaries
- `../PRIVACY.md`: Local-first prototype privacy policy
- `../SUPPORT.md`: Support workflow
- `../CHANGELOG.md`: Change history
- `../RELEASE.md`: Release checklist and artifact guidance
- `../GOVERNANCE.md`: Maintainer decision model and project principles
- `../MAINTAINERS.md`: Ownership map and maintainer checklist
- `../CODE_OF_CONDUCT.md`: Community standards
- `../NOTICE`: Apache-2.0 notice file

## Current Project Boundary

AetherOS is a real runnable desktop shell prototype. Some advanced operating-system features are represented as interactive UI and architecture models until they are backed by deeper Rust, Tauri, native OS, or kernel work. Documentation should always make that distinction clear.
