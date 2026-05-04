# Administration Plane

The administration plane is the Phase 11 system layer for network, account, storage, audit, backup, and policy control. It gives AetherOS a more complete OS management surface instead of scattering administrative state across unrelated apps.

## Affected Subsystems

- Kernel: policy and service capability tokens are validated against protected system actions.
- Services: `netd`, `accountsd`, `storaged`, `auditd`, `backupd`, and `policyd` are registered as first-class daemons.
- Drivers: network, storage, and backup packages bind to existing driver state.
- CLI: `aether` exposes administration commands for status, audit, backup, and policy inspection.
- UI: Network Center, Account Manager, Storage Manager, Audit Viewer, Backup Manager, and Policy Center are built-in apps launched from the shell and Control Panel.
- Config: new JSON manifests define profiles, users, volumes, audit retention, backup plans, and policy rules.
- Packages: protected system packages keep the administration plane visible to dependency solving and repair flows.
- Security: explicit capability tokens and admin actions govern access to administrative features.
- Logs: audit records are written as structured JSONL runtime logs.

## Manifests

- `config/network.json`: network profiles, DNS, firewall rules, VPN profiles, and interface health.
- `config/accounts.json`: local users, groups, authentication policy, credential providers, and session policy.
- `config/storage.json`: volumes, mounts, quotas, cache policy, cleanup jobs, and app-data ownership.
- `config/audit.json`: audit categories, retention, export policy, and recent structured audit entries.
- `config/backup.json`: backup plans, targets, snapshots, retention, restore validation, and last runs.
- `config/policy-engine.json`: policy rules, scopes, effects, enforcement mode, and evaluation results.

All six manifests are registered in `config/system.json` and validated by `system/aether-system.mjs`.

## Services

- `netd`: owns network profile health, firewall state, DNS, and VPN status.
- `accountsd`: owns local identity, groups, password policy, and session policy.
- `storaged`: owns volumes, quotas, cleanup policy, and app-data storage state.
- `auditd`: owns audit records, retention policy, and export policy.
- `backupd`: owns backup plans, restore validation, and snapshot metadata.
- `policyd`: evaluates policy rules and depends on accounts and audit state.

Boot targets load these services where they are useful: graphical and diagnostic targets load the full administration plane, while recovery loads storage, audit, and backup services.

## CLI Commands

```powershell
npm run aether -- network status
npm run aether -- network profile <id>
npm run aether -- network firewall
npm run aether -- accounts
npm run aether -- storage
npm run aether -- audit [category] [limit]
npm run aether -- audit write <category> <message>
npm run aether -- backup plans
npm run aether -- backup run <plan> [reason]
npm run aether -- policy
```

The CLI routes through shared system utilities. It does not keep separate administration state.

## UI Apps

- Network Center: profile selection, DNS, firewall, VPN, and interface diagnostics.
- Account Manager: users, groups, login policy, credential providers, and session behavior.
- Storage Manager: volumes, quotas, cleanup jobs, app-data allocation, and storage pressure.
- Audit Viewer: category filtering, export policy, retention policy, and recent audit records.
- Backup Manager: backup plans, restore validation, retention, last runs, and snapshot policy.
- Policy Center: policy rules, enforcement mode, violations, and capability-gated scopes.

The Control Panel links directly to all six apps, so administration tasks are reachable from the OS tools surface.

## Internal Flow

1. The shell opens a native app window through the shared window manager.
2. The app renders the relevant manifest data and offers visible actions.
3. CLI commands call `system/aether-system.mjs`.
4. System utilities load manifests through `config/system.json`.
5. Mutating commands write back to the owning manifest through an atomic temp-file rename and publish structured events when applicable.
6. `doctor` validates cross-layer references before release.

## Security Model

Administrative services use explicit capability tokens such as `cap:network`, `cap:accounts`, `cap:storage`, `cap:audit`, `cap:backup`, and `cap:policy`. The security policy also exposes actions such as `network.manage`, `accounts.manage`, `backup.manage`, and `policy.enforce`.

This keeps administrative authority visible and auditable, which is important for the longer-term object-capability model.

## Runtime Files

- Audit logs are written under `logs/audit/`.
- Backup run records are written under `system/backups/`.

These runtime outputs are intentionally ignored by git except for `.gitkeep` placeholders.
