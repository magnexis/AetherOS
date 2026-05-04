# Governance

AetherOS is currently maintained as a single-maintainer prototype. Governance can become more formal if the project is published and contributors join.

## Maintainer Responsibilities

- Keep the shell runnable.
- Preserve the project stack: Tauri, Vite, vanilla TypeScript, CSS, HTML, and Rust.
- Review changes for UI functionality, security boundaries, and documentation updates.
- Keep GitHub issues and roadmap labels understandable.
- Avoid merging placeholder-only screens.

## Decision Process

Small changes can be accepted when they:

- Build successfully.
- Match existing project patterns.
- Improve real shell behavior.
- Do not weaken safety boundaries.

Large changes should include:

- Motivation
- Architecture impact
- UI behavior
- Backend impact
- Persistence impact
- Testing plan
- Documentation updates

For major changes, use the RFC process in `docs/RFC_PROCESS.md`.

## Architecture Principles

- The frontend shell should stay framework-light and understandable.
- Rust should own native system access.
- Advanced OS concepts should be clearly labeled as prototype, model, or real implementation.
- Security-impacting capabilities should be explicit and permission-gated.
- User-facing controls should do something visible.

## Roadmap Ownership

`docs/ROADMAP.md` is the source of truth for future direction. Feature proposals should connect to roadmap items or explain why the roadmap should change.

## Status Labels

When discussing or documenting features, use clear maturity labels:

- Working: implemented and interactive
- Partial: meaningful behavior exists but the feature is not complete
- Prototype: UI or model exists for future native work
- Future: documented direction, not implemented

`docs/FEATURE_MATRIX.md` tracks these labels across the project.

## Release Expectations

Release candidates should follow `RELEASE.md`. A release should not be cut unless `npm run check` passes and the manual smoke checklist has been reviewed.

## Safety Boundary

AetherOS should not accept features that implement stealth bypassing, hidden hardware spoofing, malware-like persistence, credential theft, or unauthorized access.
