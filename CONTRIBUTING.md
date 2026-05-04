# Contributing to AetherOS

Thanks for helping build AetherOS. This project is a Tauri desktop shell prototype using vanilla TypeScript, CSS, HTML, and Rust. The goal is a real runnable desktop environment foundation, not a static mockup.

## Local Setup

```powershell
npm install
npm run check
```

Run the desktop app with:

```powershell
npm run tauri:dev
```

## Development Rules

- Do not add React, Next.js, or Tailwind.
- Keep UI components wired to real actions.
- Avoid placeholder-only screens.
- Keep desktop shell features responsive and non-overlapping.
- Prefer existing shell patterns in `src/desktop.ts`, `src/windows.ts`, and app modules.
- Put Rust-backed system capability work in `src-tauri/src/main.rs`.
- Update documentation when adding or changing major features.
- Keep app registrations synchronized across launcher, command palette, search, settings, terminal, and documentation when adding a built-in app.
- Respect the current project boundary: advanced kernel and compatibility features are prototypes unless backed by real Rust/Tauri code.
- Do not implement stealth anti-cheat bypassing, hidden hardware-signature spoofing, or malware-like behavior.

## UI Quality Bar

- Dark mode must remain polished, readable, and high contrast.
- Buttons must open a panel, launch a window, change state, or run a visible action.
- Windows and panels must work at smaller sizes without obvious text overlap.
- Prefer solid panels and restrained accents over glassmorphism or blurry card effects.
- Keyboard focus states must remain visible.

## Pull Request Checklist

- `npm run build` passes.
- `npm run typecheck` passes.
- `npm run rust:check` passes.
- New UI controls have visible behavior.
- Docs are updated for user-facing shell changes.
- No generated build output, logs, `node_modules`, or `src-tauri/target` files are committed.
- `.git` is not required in this local working copy unless the maintainer intentionally initializes it outside this task.
