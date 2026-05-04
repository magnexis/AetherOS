# Development Guide

AetherOS is built with Tauri, Vite, vanilla TypeScript, CSS, HTML, and Rust.

## Local Setup

```powershell
npm install
npm run build
cargo check --locked --manifest-path src-tauri/Cargo.toml
```

Run the shell:

```powershell
npm run tauri:dev
```

Run fast browser preview:

```powershell
npm run dev
```

## Project Layout

- `src/main.ts`: Frontend entry point
- `src/desktop.ts`: Shell owner, global state, app registration, launcher, taskbar, command palette, shortcuts, notifications, and persistence
- `src/windows.ts`: Internal window manager
- `src/launcher.ts`: Start Menu and app launcher registry
- `src/backend.ts`: Tauri invoke bridge and browser fallbacks
- `src/platform.ts`: Shared app, service, update, threat, and search models
- `src/styles.css`: Shell and app styling
- `src-tauri/src/main.rs`: Rust backend commands
- `docs/`: Project documentation
- `.github/`: GitHub workflow and templates

## Adding a Built-In App

When adding an app, keep the shell registry synchronized.

1. Create a new `src/<appName>.ts` file exporting a `create<AppName>App()` function that returns an `HTMLElement`.
2. Add the app id to the `AppId` union in `src/windows.ts`.
3. Add the app to `launcherApps` in `src/launcher.ts`.
4. Import and route it in `src/desktop.ts`.
5. Add it to desktop icons if it should be first-class.
6. Add command palette entries in `src/desktop.ts`.
7. Add normalization keywords in `normalizeAppId()`.
8. Add System Search entries in `src/platform.ts` when useful.
9. Add Settings links or shortcut references if relevant.
10. Add Terminal commands if it should be command-launchable.
11. Update `README.md`, `docs/ARCHITECTURE.md`, `docs/PHASE_1_FEATURES.md`, and `docs/ROADMAP.md`.

## UI Rules

- No React, Next.js, or Tailwind.
- No placeholder-only screens.
- Every major button must launch a window, open a panel, change state, or run a visible action.
- Prefer solid dark panels, deep navy/charcoal backgrounds, and electric blue/green/purple accents.
- Avoid glassmorphism, blurry cards, and unstyled white panels.
- Keep controls responsive and non-overlapping at smaller window sizes.
- Preserve visible keyboard focus states.

See `DESIGN_SYSTEM.md` for the full UI quality bar.

## State and Persistence

Shell state is coordinated by `src/desktop.ts` and persisted through `src/backend.ts`.

State includes:

- Settings
- Notifications
- Session state
- Window layout
- Package state

Rust-backed persistence lives in the Tauri backend where possible. Browser preview uses safe fallbacks.

## Backend Work

Add native commands in `src-tauri/src/main.rs`, then expose them through `src/backend.ts` using `invokeCommand()`.

Backend commands should:

- Validate inputs
- Keep file operations explicit
- Avoid destructive behavior unless the UI clearly asks for it
- Return structured data for the frontend
- Provide safe mock/fallback behavior when appropriate

## Documentation Work

Update docs when changing:

- User-visible shell behavior
- Keyboard shortcuts
- Backend commands
- Built-in apps
- Security boundaries
- Package/runtime behavior
- Kernel research scope
- GitHub workflow or setup

Large architecture or platform changes should use `RFC_PROCESS.md`.

## Do Not Initialize Git Automatically

This local working copy is intentionally not initialized as a git repository by automation. Publishing commands in `docs/GITHUB_SETUP.md` are optional and should only be run by the maintainer.
