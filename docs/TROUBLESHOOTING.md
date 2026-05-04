# Troubleshooting

This guide covers common AetherOS setup, build, and runtime issues on Windows 10/11 and VS Code.

## Quick Health Check

Run from the project root:

```powershell
npm install
npm run typecheck
npm run build
npm run rust:check
```

Or run the combined check:

```powershell
npm run check
```

## Node.js Problems

Check Node:

```powershell
node --version
npm --version
```

Recommended:

- Node.js 20+
- npm bundled with Node

If dependencies look broken:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

Only do this if dependency restore is actually failing.

## Rust Problems

Check Rust:

```powershell
rustc --version
cargo --version
```

Install or update Rust from `https://rustup.rs`.

Then verify:

```powershell
npm run rust:check
```

## Tauri Windows Prerequisites

Tauri on Windows requires Microsoft build tools and WebView2.

Install:

- Microsoft Edge WebView2 Runtime
- Visual Studio Build Tools with C++ desktop workload
- Windows SDK

If `npm run tauri:dev` fails but `npm run dev` works, the issue is usually the native Tauri toolchain rather than the frontend.

## Blank Screen

Try:

```powershell
npm run build
npm run dev
```

Then open the Vite URL.

If the browser preview works but Tauri is blank:

- Check `src-tauri/tauri.conf.json`.
- Confirm `beforeDevCommand` and `devUrl` match the Vite port.
- Run `npm run tauri:dev` from the project root.

## Port Already in Use

Vite uses port `1420` in this project.

Find the process:

```powershell
Get-NetTCPConnection -LocalPort 1420 -ErrorAction SilentlyContinue
```

Stop only the process you know belongs to this dev server:

```powershell
Stop-Process -Id <PID>
```

## TypeScript Errors

Run:

```powershell
npm run typecheck
```

Common causes:

- New app id was not added to `AppId` in `src/windows.ts`.
- New app was added to launcher but not routed in `src/desktop.ts`.
- Settings patch uses a value outside the `AetherSettings` union.
- Rust command response shape changed but frontend type was not updated.

## Rust Command Fails in Browser Preview

Browser preview cannot call real Tauri commands. Use:

```powershell
npm run tauri:dev
```

Frontend code should use `invokeCommand()` fallbacks where browser preview is expected to keep working.

## File Explorer Cannot Access a Path

AetherOS resolves common aliases such as Home, Desktop, Documents, Downloads, and Pictures.

If a path fails:

- Try an absolute path.
- Check permissions.
- Avoid destructive file operations outside test folders.
- Verify the Rust command in Terminal where possible.

## UI Overlap or Broken Layout

Check:

- Normal window
- Maximized window
- Narrow window
- Light theme
- Dark theme
- Compact dock

Most app panels should use responsive grids with `minmax(0, 1fr)` and collapse at small widths.

## Package Manager State Looks Wrong

Try:

- Open AetherPkg and click Update.
- Use Terminal: `status`.
- Remove and reinstall `demo-app`.
- Use Settings > Storage export before resetting state.

## Aether Nexus Does Not Open

Try all launch paths:

- Desktop icon
- Start Menu
- Command Palette: Open Aether Nexus
- Terminal: `nexus`
- Ctrl+Shift+X

If only one path fails, check that route in `src/desktop.ts`, `src/launcher.ts`, `src/platform.ts`, `src/settings.ts`, or `src/terminal.ts`.

## Clean Temporary Output

Generated output should not be committed:

- `dist/`
- `node_modules/`
- `src-tauri/target/`
- Vite logs
- Tauri generated folders

The `.gitignore` already excludes common generated files.
