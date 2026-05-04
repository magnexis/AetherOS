# Recovery Supervisor

The Recovery Supervisor is AetherOS' root-level repair and health layer. It is designed like an OS recovery daemon: it audits core manifests, snapshots state before repair, and restores safe defaults across boot, service, driver, and package layers.

## Architecture

Recovery is intentionally system-wide:

- `config/recovery-policy.json`: active recovery policy, check list, repair rules, snapshot directory, and retention count
- `kernel/kernel.manifest.json`: declares the active kernel recovery policy
- `services/services.manifest.json`: runs `aether-recoveryd` as the Recovery Supervisor service
- `pkg/registry.json`: protects the `aether-recovery` package from removal
- `security/policy.json`: records `recovery.snapshot` and `recovery.repair` as admin actions
- `system/aether-system.mjs`: implements diagnosis, snapshots, repairs, validation, and logging
- `cli/aether.mjs`: exposes operator commands
- `logs/system-events.jsonl`: records recovery actions

This is a manifest-backed supervisor. It repairs AetherOS project state and shell substrate state; it does not repair the host Windows installation.

## Commands

```powershell
npm run aether -- recovery status
npm run aether -- recovery diagnose
npm run aether -- recovery snapshot before-driver-test
npm run aether -- recovery repair
npm run aether -- logs 20
```

`status` and `diagnose` are read-only. `snapshot` writes a JSON recovery snapshot under `system/recovery-snapshots`. `repair` creates a pre-repair snapshot first when the active policy requires it.

## Internal Flow

1. CLI calls `getRecoveryReport()`, `createRecoverySnapshot()`, or `repairSystemGraph()`.
2. `system/aether-system.mjs` loads the full system graph.
3. Diagnosis checks:
   - default boot target exists
   - required drivers are running
   - enabled services are running and healthy
   - protected packages are installed
   - unsigned kernel drivers are stopped when signature policy requires signed drivers
   - UI layer has an entry point when enabled
4. Repair writes only the owning manifests:
   - `config/system.json`
   - `services/services.manifest.json`
   - `drivers/drivers.manifest.json`
   - `pkg/registry.json`
5. Every recovery action appends a JSONL log event.
6. `doctor` validates recovery policy wiring, service references, package references, and security policy references.

## Config Usage

The active policy is stored in `config/recovery-policy.json`:

```json
{
  "activePolicy": "standard-auto-repair",
  "snapshotDirectory": "system/recovery-snapshots",
  "maxSnapshots": 5,
  "repairs": {
    "createSnapshotBeforeRepair": true,
    "restartFaultedServices": true,
    "restoreRequiredDrivers": true,
    "protectCorePackages": true,
    "stopUnsignedKernelDrivers": true,
    "applySafeModeOnCriticalFailure": false
  }
}
```

The policy name must match `kernel.boot.recoveryPolicy`. This keeps kernel boot behavior and recovery supervisor behavior aligned.

## Security Notes

Recovery actions are admin operations:

- `recovery.snapshot`
- `recovery.repair`

The `recovery` service owns these permissions. Future UI surfaces should route through the shared system utility instead of directly editing manifests.

## Future Native Path

Next steps for this layer:

- Show recovery reports in Control Panel and Kernel Lab
- Add restore-from-snapshot
- Add diff previews before repair
- Stream service and driver events from Rust
- Promote recovery snapshots into signed system restore points
- Tie recovery mode to the actual Tauri startup flow
