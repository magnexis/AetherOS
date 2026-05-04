# System Layout

AetherOS is organized as a system, not a single app. The root folders model operating-system layers that can gradually move from structured manifests into deeper native implementations.

## Root Layers

```text
AetherOS/
├── kernel/    core kernel manifest, ABI, modules, syscalls, boot policy
├── services/  background daemon manifest and dependency graph
├── drivers/   driver registry, device tree, and binding state
├── cli/       AetherOS command-line tooling
├── ui/        optional graphical shell manifest mapped to the Tauri `src/` frontend
├── system/    shared system utilities for validation, logging, and graph access
├── config/    system configuration and path registry
├── pkg/       package repositories and package registry state
├── security/  capability and policy model
├── logs/      runtime system event logs
└── docs/      documentation
```

## Architecture

`config/system.json` points to the major manifests. `config/boot-targets.json` defines startup targets such as minimal, graphical, recovery, and diagnostic. `config/recovery-policy.json` defines health checks, repair rules, snapshot retention, and recovery policy alignment. Operations manifests now also cover event bus topics, registry hives, restore points, startup apps, scheduled tasks, crash bundles, updates, and package dependency locks. The administration plane adds network, accounts, storage, audit, backup, and policy manifests. The Windows-plus ecosystem layer adds experience and ecosystem manifests. `system/aether-system.mjs` loads all manifests into one system graph and validates cross-layer relationships.

The CLI in `cli/aether.mjs` uses the shared system utilities. It does not duplicate validation logic.

## Current Manifests

- `kernel/kernel.manifest.json`
- `config/boot-targets.json`
- `config/recovery-policy.json`
- `config/event-bus.json`
- `config/registry-hives.json`
- `config/restore-points.json`
- `config/startup-apps.json`
- `config/task-scheduler.json`
- `config/crash-reporter.json`
- `config/updates.json`
- `config/network.json`
- `config/accounts.json`
- `config/storage.json`
- `config/audit.json`
- `config/backup.json`
- `config/policy-engine.json`
- `config/experience.json`
- `config/ecosystem.json`
- `config/security-hardening.json`
- `services/services.manifest.json`
- `drivers/drivers.manifest.json`
- `pkg/registry.json`
- `pkg/dependency-lock.json`
- `security/policy.json`
- `config/system.json`
- `ui/shell.manifest.json`

## CLI Commands

```powershell
npm run aether -- help
npm run aether -- doctor
npm run aether -- status
npm run aether -- targets
npm run aether -- boot plan [target]
npm run aether -- boot apply <target>
npm run aether -- recovery status
npm run aether -- recovery snapshot [label]
npm run aether -- recovery restore <snapshot>
npm run aether -- recovery points
npm run aether -- recovery point <name> [reason]
npm run aether -- recovery repair
npm run aether -- events [topic] [limit]
npm run aether -- service <id> logs [limit]
npm run aether -- pkg solve <name>
npm run aether -- registry
npm run aether -- startup
npm run aether -- tasks
npm run aether -- updates
npm run aether -- network status
npm run aether -- network firewall
npm run aether -- accounts
npm run aether -- storage
npm run aether -- audit [category] [limit]
npm run aether -- audit write <category> <message>
npm run aether -- backup plans
npm run aether -- backup run <plan> [reason]
npm run aether -- policy
npm run aether -- experience [commands|defaults|snap]
npm run aether -- ecosystem [apps|extensions|protocols|publish]
npm run aether -- hardening [controls|threats|policy]
npm run aether -- crash bundle [reason]
npm run aether -- kernel
npm run aether -- services
npm run aether -- service <id> <running|stopped|faulted|enable|disable>
npm run aether -- drivers
npm run aether -- driver <id> <running|stopped|faulted>
npm run aether -- packages
npm run aether -- pkg <install|remove> <name>
npm run aether -- config
npm run aether -- logs
```

## Internal Flow

1. CLI calls `system/aether-system.mjs`.
2. System utility loads manifests from paths in `config/system.json`.
3. Commands update the owning layer.
4. Changes are written back to that layer's manifest through a temp-file rename so readers do not observe half-written JSON.
5. Boot planning topologically orders target services and binds required drivers.
6. Recovery diagnosis checks boot target validity, service health, driver integrity, protected packages, and UI entry state.
7. Recovery repair creates a snapshot, then writes only the owning manifests for the affected subsystem.
8. Actions append structured JSONL events under `logs/`.
9. `doctor` validates cross-layer references.

## Validation Rules

`doctor` checks:

- Device driver/module references.
- Service dependency references.
- Package service/driver references.
- Boot target service/driver references.
- Default and safe-mode boot targets.
- Recovery policy path and kernel policy alignment.
- Event topic subscribers.
- Registry hive paths.
- Task capability references.
- Startup app delay shape.
- Update rollback point references.
- Package dependency lock service/driver references.
- Administration manifest references for network profiles, active users, storage quotas, backup retention, and policy effects.
- Experience command registry, default app associations, Store channels, ecosystem app capabilities, and extension point review requirements.
- Hardening control status, severity, default-deny runtime policy, Store signature requirements, and threat model presence.
- Required kernel subsystems.
- Presence of core Aether packages.
- Basic permission shape across services and security policy.

## UI Relationship

The current graphical shell still lives in `src/` as the Tauri frontend. The new root folders are the lower system model that the UI can increasingly consume. Over time, UI apps such as Kernel Lab, AetherPkg, Service Manager, Security Center, Network Center, Account Manager, Storage Manager, Audit Viewer, Backup Manager, Policy Center, Experience Center, and Ecosystem Hub should read/write these root manifests or Rust-backed equivalents instead of keeping parallel data.
