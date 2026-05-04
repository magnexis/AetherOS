# Boot Service Orchestration

Boot service orchestration is the root-level startup model for AetherOS. It connects kernel boot policy, service daemons, driver readiness, security policy, logs, and the Aether CLI.

## Architecture

The orchestration layer is split across system folders:

- `config/boot-targets.json`: named startup targets and their required services, drivers, and flags
- `config/system.json`: active default target, safe-mode target, boot flags, and manifest paths
- `services/services.manifest.json`: daemon metadata, dependency graph, health, restart policy, enablement, and permissions
- `drivers/drivers.manifest.json`: driver registry and running state
- `security/policy.json`: admin actions required for service enablement and boot target application
- `system/aether-system.mjs`: graph loader, validator, boot planner, target applier, and structured logger
- `cli/aether.mjs`: operator-facing commands
- `logs/system-events.jsonl`: append-only event stream for boot and service actions

The current implementation is a manifest-backed foundation. It does not alter the host machine's real boot loader.

## Boot Targets

AetherOS ships with four targets:

- `minimal`: init, registry, and driver manager only
- `graphical`: full shell profile with package daemon, Shield, and UI
- `recovery`: repair target with no UI session restore
- `diagnostic`: verbose target for service, driver, and replay tracing

Targets declare the drivers that should be running and the services that should be enabled. The system utility resolves the service order from dependencies before presenting or applying a plan.

## Commands

```powershell
npm run aether -- targets
npm run aether -- boot plan
npm run aether -- boot plan recovery
npm run aether -- boot apply graphical
npm run aether -- services
npm run aether -- service shield disable
npm run aether -- service shield enable
npm run aether -- service pkgd faulted
npm run aether -- logs 20
```

`boot plan` is read-only. `boot apply` updates the active boot target, boot flags, service enablement, service status, service health, and driver status together.

## Internal Flow

1. CLI calls `getBootPlan(targetId)` or `applyBootTarget(targetId)`.
2. The system utility loads all root manifests into a graph.
3. The target is resolved from `config/boot-targets.json`.
4. Driver IDs are matched against `drivers/drivers.manifest.json`.
5. Services are topologically ordered from `services.services[].requires`.
6. `boot apply` writes updated state into `config/system.json`, `services/services.manifest.json`, and `drivers/drivers.manifest.json`.
7. The action is logged to `logs/system-events.jsonl`.
8. `doctor` validates the target, dependency, driver, and permission references.

## Config Usage

To add a new boot target, edit `config/boot-targets.json`:

```json
{
  "id": "maintenance",
  "name": "Maintenance",
  "description": "Service repair profile with networking and package daemon.",
  "services": ["init", "registry", "drivers", "pkgd"],
  "drivers": ["aether-display", "aether-nvme", "aether-net", "aether-hid"],
  "flags": ["safe-mode", "repair-registry", "verify-drivers"]
}
```

Then run:

```powershell
npm run aether -- doctor
npm run aether -- boot plan maintenance
```

Every service and driver listed by a target must already exist in its owning manifest. This keeps startup profiles declarative while avoiding duplicate system state.

## Security Notes

Applying a target is an admin action: `boot.targets.apply`. Enabling or disabling services is also explicit: `services.enable`.

The `init` service owns those permissions in `services/services.manifest.json`, and `security/policy.json` records them in `adminActions`. Future UI controls should route boot changes through the same system utility instead of writing manifests directly.
