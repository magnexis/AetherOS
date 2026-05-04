# System Operations Expansion

This expansion adds a broader Windows-class operations layer to AetherOS while keeping the project modular. The goal is to make Control Panel, recovery, drivers, packages, events, permissions, startup, tasks, crashes, devices, and updates feel like connected OS subsystems.

## Architecture

The expansion is spread across root OS layers:

- `config/event-bus.json`: append-only event stream topics for services, packages, files, recovery, security, notifications, and updates
- `config/registry-hives.json`: registry-style hives for kernel, services, drivers, packages, security, shell, tasks, and startup
- `config/restore-points.json`: named restore point metadata promoted from recovery snapshots
- `config/startup-apps.json`: startup app registration, delay, enablement, impact, and capability
- `config/task-scheduler.json`: scheduled tasks for login, interval, event, and idle triggers
- `config/crash-reporter.json`: crash bundle policy and recent bundle metadata
- `config/updates.json`: signed update manifest model, staging path, channels, rollback, and restart-required state
- `pkg/dependency-lock.json`: dependency solver lockfile with conflicts, required services, required drivers, and rollback plans
- `drivers/drivers.manifest.json`: Driver Manager v2 profiles, version history, rollback, hardware matching, blocked drivers, and warnings
- `system/aether-system.mjs`: event publishing, service logs, package solving, restore points, snapshot restore, crash bundles, validation
- `cli/aether.mjs`: operator commands
- `src/`: Control Panel integration and dedicated graphical OS tools

## Commands

```powershell
npm run aether -- events [topic] [limit]
npm run aether -- event <topic> <message>
npm run aether -- service <id> logs [limit]
npm run aether -- service <id> log <message>
npm run aether -- recovery restore <snapshot>
npm run aether -- recovery points
npm run aether -- recovery point <name> [reason]
npm run aether -- pkg solve <name>
npm run aether -- registry
npm run aether -- startup
npm run aether -- tasks
npm run aether -- updates
npm run aether -- crash bundle [reason]
```

## Graphical Apps

The launcher and command palette now include:

- Boot Manager
- Aether Registry
- Device Manager
- Permission Prompt Center
- Aether Task Scheduler
- Crash Reporter
- Event Viewer

Control Panel links these tools together and exposes boot targets, recovery health, service health, driver state, package repair, restore point actions, permissions, tasks, event streams, crash bundles, and update engine status.

## Internal Flow

1. Root manifests describe each subsystem.
2. `loadSystemGraph()` loads those manifests into one graph.
3. `doctor` validates cross-references across services, packages, drivers, update rollback points, event subscribers, registry hive paths, startup entries, and task capabilities.
4. CLI commands call shared system functions rather than writing JSON directly.
5. Event and service log commands write structured JSONL under `logs/`.
6. Recovery snapshots can be promoted into restore points and restored by path.
7. Crash bundles collect the recovery report, service state, package state, and replay metadata.

## Config Usage

Add new scheduled work in `config/task-scheduler.json`, startup entries in `config/startup-apps.json`, and registry hives in `config/registry-hives.json`. Every new service referenced by an event topic or package must exist in `services/services.manifest.json`.

## Security Notes

New admin actions include:

- `events.publish`
- `events.subscribe`
- `tasks.manage`
- `crash.bundle`
- `updates.manage`
- `permissions.approve`

These are owned by service permissions and object-capability tokens in `security/policy.json`.

## Future Native Path

Next steps:

- Move event bus writes into Rust/Tauri commands
- Stream events live into Event Viewer
- Add real restore-point restore preview diffs
- Add UI-backed package dependency transactions
- Add native file watchers for startup, scan, and task triggers
- Add signed update package verification
- Add real driver discovery through host OS APIs
