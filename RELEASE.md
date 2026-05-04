# Release Process

AetherOS is still a prototype, but releases should be repeatable.

## Pre-Release Checklist

Run from the project root:

```powershell
npm ci
npm run check
npm run tauri:build
```

Manual checks:

- Shell boots without a blank screen.
- Desktop icons and dock apps open.
- Windows drag, resize, minimize, maximize, close, snap, and focus.
- Start Menu works.
- Command palette works.
- Ctrl+Shift+X opens Aether Nexus.
- Terminal commands in `docs/USER_GUIDE.md` work.
- Settings toggles visibly affect the shell.
- File Explorer can list folders and perform basic operations.
- Package Manager install/remove state updates.
- System Monitor shows live metrics.
- Aether Nexus actions produce visible behavior.
- Kernel Lab remains clearly labeled as research/prototype.
- No visual overlap appears in small windows.

## Versioning

Until a stable public release exists, use prototype tags:

```text
v0.1.0-phase1
v1.1.2-desktop-preview
v0.2.0-foundation
v0.3.0-platform
v0.4.0-nexus
```

Once the app has a real installer release flow, use semantic versioning:

```text
MAJOR.MINOR.PATCH
```

## Release Notes

Update:

- `CHANGELOG.md`
- `README.md`
- `docs/ROADMAP.md`
- `docs/PHASE_1_FEATURES.md`

Release notes should include:

- User-facing changes
- Backend changes
- Known limitations
- Security notes
- Build/test verification

## Artifacts

Tauri build artifacts are generated under `src-tauri/target/`. They should not be committed. Upload installers or archives to GitHub Releases when the repository is published.

Current Windows x64 artifact paths after `npm run tauri:build`:

```text
src-tauri/target/release/aetheros.exe
src-tauri/target/release/bundle/nsis/AetherOS_1.1.2_x64-setup.exe
src-tauri/target/release/bundle/msi/AetherOS_1.1.2_x64_en-US.msi
```

The local release folder keeps GitHub-friendly copies:

```text
release/AetherOS-1.1.2-windows-x64-portable.exe
release/AetherOS-1.1.2-windows-x64-setup.exe
release/AetherOS-1.1.2-windows-x64.msi
release/SHA256SUMS.txt
release/RELEASE_NOTES_v1.1.2.md
```

Only release metadata and checksums are intended for source control. Installer binaries are ignored by `.gitignore` and should be uploaded to GitHub Releases.

Regenerate checksums after every release build:

```powershell
Get-ChildItem release -File |
  Where-Object { $_.Extension -in '.exe', '.msi' } |
  Sort-Object Name |
  ForEach-Object {
    $hash = Get-FileHash -Algorithm SHA256 -LiteralPath $_.FullName
    "$($hash.Hash.ToLower())  $($_.Name)"
  } | Set-Content release\SHA256SUMS.txt
```

## Rollback

If a release breaks the shell:

1. Revert to the previous known-good source revision.
2. Clear shell state from Settings > Storage if state migration is suspected.
3. Rebuild with `npm run build`.
4. Recheck Rust with `cargo check --locked --manifest-path src-tauri/Cargo.toml`.
