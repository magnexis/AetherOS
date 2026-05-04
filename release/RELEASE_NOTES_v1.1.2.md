# AetherOS v1.1.2 Windows Release Notes

This is the first packaged Windows desktop release of the AetherOS shell prototype.

## Artifacts

- `AetherOS-1.1.2-windows-x64-setup.exe`: NSIS installer for Windows x64.
- `AetherOS-1.1.2-windows-x64.msi`: MSI installer for Windows x64.
- `AetherOS-1.1.2-windows-x64-portable.exe`: portable raw Tauri executable.
- `SHA256SUMS.txt`: SHA-256 checksums for release verification.

## Highlights

- Full Tauri/Vite/Rust desktop shell build.
- Custom OS-style desktop, Start/taskbar, command palette, and window manager.
- Built-in apps for files, terminal, settings, system monitor, packages, security, update, control panel, device manager, registry, event viewer, task scheduler, ecosystem, and kernel research.
- Large local Aether ecosystem catalog and Ecosystem Hub.
- Security hardening layer with protected hardening service, protected package, hardening CLI, baseline scoring, and Security Center panels.
- Apache-2.0 licensing, NOTICE file, and local-first privacy policy.

## Verification

Built on Windows with:

```powershell
npm run check
npm run tauri:build
npm audit --audit-level=moderate
```

Current validation status:

- TypeScript typecheck passed.
- Vite production build passed.
- Rust `cargo check --locked` passed.
- Aether system doctor passed.
- npm audit reports 0 vulnerabilities.

## Known Limitations

- AetherOS is still a desktop shell prototype, not a bootable standalone OS.
- Some OS subsystems are modeled in manifests and UI before native integration.
- GPU telemetry, native login, kernel-mode security, remote signed package registry, and full native app sandboxing remain future work.
