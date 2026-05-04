# Security Hardening

The hardening layer turns AetherOS security from a set of separate screens into a baseline that spans runtime apps, package installs, shell extensions, services, drivers, audit, recovery, network, and the Store ecosystem.

## System Impact

- Config: `config/security-hardening.json` defines the secure desktop baseline.
- Services: `aether-hardeningd` evaluates hardening controls.
- Packages: `aether-hardening` is a protected package.
- Security: `hardening.evaluate` is an explicit admin action with a capability token.
- Event Bus: the `hardening` topic records posture changes.
- CLI: `aether hardening` reports baseline score, controls, threat model, and policy.
- UI: Security Center shows baseline score, hardening controls, and threat model coverage.

## Baseline Controls

The baseline currently covers:

- Least privilege app permissions.
- Signed Store artifacts.
- Restore points before privileged mutations.
- Shell extension review gates.
- Auditing privileged actions.
- Runtime network prompts.
- Quarantine for suspicious files.
- Driver signature policy.
- Secretless publishing posture.
- Session lock accelerators.

## Commands

```powershell
npm run aether -- hardening
npm run aether -- hardening controls
npm run aether -- hardening threats
npm run aether -- hardening policy
```

## Internal Flow

1. `config/system.json` registers `config/security-hardening.json`.
2. `system/aether-system.mjs` loads the hardening manifest into the system graph.
3. `doctor` validates control status, severity, default-deny runtime policy, Store signature policy, and threat model presence.
4. `cli/aether.mjs` exposes operational reports.
5. Security Center renders hardening posture alongside identity, permissions, Shield, and lock-screen controls.

## Threat Model

The initial threat model includes malicious shell extensions, package supply-chain attacks, privilege sprawl, unsafe drivers, and persistence abuse. These map directly to existing AetherOS control surfaces: Permission Center, AetherPkg, Ecosystem Hub, Driver Manager, Startup Apps, Task Scheduler, Event Viewer, and Audit Viewer.

## Dependency Hardening

The Vite development dependency was upgraded to remove the moderate esbuild/Vite dev-server advisory reported by `npm audit`. `npm audit` should remain part of release checks.

