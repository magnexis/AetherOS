# Maintainers

Current maintainer:

- matth

## Maintainer Checklist

Before accepting or publishing changes:

- Run `npm run check`.
- Run `npm run tauri:build` for release candidates.
- Review UI at normal, maximized, and narrow window sizes.
- Confirm new controls have visible behavior.
- Confirm documentation is updated.
- Confirm security-sensitive changes are documented in `SECURITY.md` or `docs/ARCHITECTURE.md`.
- Confirm generated files are not included.

## Review Focus

- Shell stability
- Window manager behavior
- Rust command safety
- Settings persistence
- Package/runtime state integrity
- App registration consistency
- Small-window layout quality
- Security boundaries

## Ownership Areas

| Area | Primary Files |
| --- | --- |
| Shell orchestration | `src/desktop.ts`, `src/session.ts` |
| Windows | `src/windows.ts` |
| Start and app registry | `src/launcher.ts` |
| Native bridge | `src/backend.ts`, `src-tauri/src/main.rs` |
| Shared platform models | `src/platform.ts` |
| Styling | `src/styles.css` |
| Documentation | `README.md`, `docs/`, root GitHub docs |

## Adding Maintainers

Future maintainers should have a clear ownership area and a track record of changes that keep the project runnable, documented, and aligned with the stack.
