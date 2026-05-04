# Vision

AetherOS aims to become a modern desktop shell foundation that feels closer to an operating system than a web app.

The near-term goal is not to pretend the prototype is already a full OS. The goal is to build a serious shell layer with real windows, real app surfaces, real state, real backend bridges, and a clean path toward deeper native capabilities.

## Product Principles

- The desktop is the primary experience, not a landing page.
- Apps open in windows, not full-page routes.
- Controls should do visible work.
- Settings should affect the shell immediately where possible.
- Native capabilities should live behind Rust/Tauri commands.
- Ambitious OS concepts should be modeled honestly until they become real backend or kernel features.
- The UI should feel premium, dense, readable, and non-overlapping.

## What AetherOS Should Beat

AetherOS should eventually feel better than legacy desktop shells by improving:

- Command-first navigation
- App permissions and capability visibility
- Package and app lifecycle clarity
- Workspace orchestration
- Local-first settings and session restore
- Developer-first app runtime and SDK
- System diagnostics
- Recovery and rollback
- Search across files, apps, settings, packages, commands, and events

## Platform Direction

The project can evolve through several layers:

1. Tauri desktop shell prototype.
2. Rust-backed native services for files, search, packages, processes, notifications, and security.
3. Native multi-webview app runtime with manifest enforcement.
4. Linux desktop environment or compositor integration.
5. Optional bootable OS or distribution path.

## Design Direction

AetherOS should look and feel like a premium system tool:

- Dark mode first
- Solid panels
- Deep navy and charcoal backgrounds
- Electric blue, green, and purple accents
- Clear focus states
- Strong information hierarchy
- Responsive panels that do not overlap
- No glassmorphism
- No blurry transparent cards
- No placeholder-only apps

## Research Direction

Kernel Lab exists to explore advanced OS ideas:

- Single address space and protection domains
- Object capabilities
- Zero-copy IPC
- Reactive streams
- Semantic filesystem
- Deterministic replay
- Formal verification
- Scheduling research
- Namespaces and isolation
- Memory compression
- VFS architecture

These features should remain clearly labeled as research until implemented in a real native layer.
