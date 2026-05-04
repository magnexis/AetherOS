# AetherOS Release Folder

This folder holds local release metadata for the current Windows build.

Generated installer binaries are intentionally ignored by git:

- `AetherOS-1.1.2-windows-x64-setup.exe`
- `AetherOS-1.1.2-windows-x64-portable.exe`
- `AetherOS-1.1.2-windows-x64.msi`

Upload those binaries to GitHub Releases instead of committing them to source control.

## Rebuild

```powershell
npm ci
npm run check
npm run tauri:build
```

## Artifact Sources

Tauri writes the release build to:

- `src-tauri/target/release/aetheros.exe`
- `src-tauri/target/release/bundle/nsis/AetherOS_1.1.2_x64-setup.exe`
- `src-tauri/target/release/bundle/msi/AetherOS_1.1.2_x64_en-US.msi`

The local release copies use GitHub-friendly names:

- `release/AetherOS-1.1.2-windows-x64-portable.exe`
- `release/AetherOS-1.1.2-windows-x64-setup.exe`
- `release/AetherOS-1.1.2-windows-x64.msi`

## Checksums

Use `SHA256SUMS.txt` to verify local release artifacts before upload.
