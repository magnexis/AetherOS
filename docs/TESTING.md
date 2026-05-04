# Testing and Verification

Use this checklist before publishing changes or handing off a build.

## Automated Checks

Run from the project root:

```powershell
npm run build
cargo check --locked --manifest-path src-tauri/Cargo.toml
```

For a desktop release build:

```powershell
npm run tauri:build
```

## Dev Server Smoke Test

Run:

```powershell
npm run dev
```

Open the shown local URL and verify:

- Desktop is not blank.
- Start Menu opens.
- Dock buttons open windows.
- Command palette opens with Ctrl+K.
- No obvious console/runtime errors appear.

Stop the dev server after testing.

## Tauri Smoke Test

Run:

```powershell
npm run tauri:dev
```

Verify:

- Boot screen completes.
- File Explorer and Terminal open by default or from restored layout.
- Rust-backed commands work in Terminal.
- Native commands do not crash the shell.
- Windows drag, resize, minimize, maximize, close, focus, and snap.

## App Verification

Desktop shell:

- Top bar controls respond.
- Dock icons launch/focus apps.
- Taskbar previews appear on hover.
- Right-click taskbar menu opens.
- Desktop context menu opens and actions notify.
- Workspace buttons switch spaces.
- Overview opens and moves windows.

File Explorer:

- Known folders load.
- Address bar navigation works.
- Back/forward work.
- New folder/file actions work.
- Delete routes through trash where supported.
- Restore/permanent delete actions are visible.
- Search results show.

Terminal:

- `help`
- `apps`
- `status`
- `version`
- `nexus`
- `ls`
- `pwd`
- `cd`
- `mkdir`
- `touch`
- `rm`
- `sysinfo`
- `processes`
- `install demo-app`
- `remove demo-app`
- `theme dark`
- `theme light`

Settings:

- Theme toggle visibly changes shell.
- Animations toggle applies.
- Compact dock changes dock width.
- Developer mode toggles root class.
- Performance profile changes root dataset.
- Storage actions return visible output.
- Shortcuts list includes Ctrl+Shift+X.

Package Manager:

- Install updates state.
- Remove updates state.
- Verify produces output.
- Rollback produces output.
- Channel selector changes result.
- `.aetherpkg` install prompt appears.

System Monitor:

- Metrics update.
- Process list appears.
- Active windows count matches open windows.
- Process action buttons produce visible result.

Aether Nexus:

- Opens from desktop, Start, command palette, System Search, Terminal, and Ctrl+Shift+X.
- Pulse Graph changes graph state.
- Mode selection changes active mode.
- Launch Selected Mode opens app stack and updates performance profile.
- Automation rules run visible actions.
- Self-Heal changes health to 100%.
- Time Ribbon advances/selects events.
- Command Mesh opens app stacks.

Kernel Lab:

- Each prototype panel renders.
- Actions update counters/logs.
- Safety boundary language remains clear for compatibility VM features.

System Operations:

- Control Panel opens Boot Manager, Registry, Device Manager, Permission Center, Task Scheduler, Crash Reporter, and Event Viewer.
- Boot Manager target buttons select and apply visible startup profiles.
- Registry Editor validates, exports, snapshots, and saves draft hives visibly.
- Device Manager scan, rollback, blocklist, and hardware match actions produce notifications.
- Permission Center approve, deny, and ask-again actions update request state.
- Task Scheduler toggles and run/history buttons respond.
- Crash Reporter creates a visible bundle entry.
- Event Viewer topic filter, publish, and replay actions respond.
- Experience Center opens from desktop, Start, command palette, terminal, System Search, and Control Panel.
- Ecosystem Hub opens from desktop, Start, command palette, terminal, System Search, and Control Panel.
- Experience Center buttons for layout, pins, snap layouts, and linked apps respond.
- Ecosystem Hub buttons for channels, apps, Marketplace, SDK, Runtime, and publish checklist respond.
- Security Center hardening evaluate/export buttons respond.
- Network Center profile, firewall, DNS, VPN, and interface panels render without overlap.
- Account Manager user, group, credential, auth, and session panels render without overlap.
- Storage Manager volume, quota, cleanup, cache, and app-data panels render without overlap.
- Audit Viewer filters records and shows retention/export policy.
- Backup Manager shows plans, restore validation, retention, snapshots, and last-run state.
- Policy Center evaluates policy state and shows violations/effects.

CLI operations:

```powershell
npm run aether -- doctor
npm run aether -- events all 5
npm run aether -- service eventbus log validation
npm run aether -- service eventbus logs 5
npm run aether -- pkg solve demo-app
npm run aether -- registry
npm run aether -- startup
npm run aether -- tasks
npm run aether -- updates
npm run aether -- network status
npm run aether -- network firewall
npm run aether -- accounts
npm run aether -- storage
npm run aether -- audit all 5
npm run aether -- backup plans
npm run aether -- policy
npm run aether -- experience
npm run aether -- experience commands
npm run aether -- ecosystem
npm run aether -- ecosystem publish
npm run aether -- hardening
npm run aether -- hardening controls
npm run aether -- crash bundle validation
```

## Visual QA

Check at:

- Default desktop window size
- Narrow app window
- Maximized app window
- Light theme
- Dark theme
- Compact dock on/off

Look for:

- Text overlap
- Buttons spilling out of panels
- Horizontal overflow where it should not exist
- Hidden actions
- Blank app screens
- Unstyled white backgrounds
- Missing focus outlines

## Cleanup

Before finishing:

- Stop dev servers started during testing.
- Remove temporary logs such as `vite-dev.log`.
- Do not commit `dist/`, `node_modules/`, or `src-tauri/target/`.
- Confirm `.git` is absent if the local instruction is still to avoid repository initialization.
