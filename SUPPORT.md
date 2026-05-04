# Support

AetherOS is an early desktop shell prototype. Support is focused on helping the project run locally, keeping the UI functional, and improving the shell foundation.

## Before Asking for Help

Run these checks from the project root:

```powershell
npm install
npm run build
cargo check --locked --manifest-path src-tauri/Cargo.toml
```

For the desktop app:

```powershell
npm run tauri:dev
```

## Useful Information to Include

- Windows version
- Node.js version
- Rust version
- Command that failed
- Full error text
- Whether the issue appears in `npm run dev`, `npm run tauri:dev`, or both
- Screenshots for visual overlap or broken UI controls

## Where to Ask

If this project is published on GitHub:

- Use Issues for reproducible bugs.
- Use Discussions for roadmap ideas and design questions.
- Use private vulnerability reporting for security issues.

If the project is still local, keep notes in `docs/ROADMAP.md` or create a local issue list before publishing.

## Security Issues

Do not publish exploit details publicly. Follow `SECURITY.md`.
