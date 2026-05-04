# Windows-Plus Ecosystem Layer

This layer makes AetherOS familiar to Windows users while moving beyond Windows in the places AetherOS can own: command-first workflows, capability-gated apps, local-first state, package rollback, shell extensions, and developer publishing.

## System Impact

- Kernel: command, default-app, and extension policies become validated system configuration.
- Services: `aether-experienced` owns shell behavior and `aether-ecosystemd` owns app ecosystem state.
- CLI: `aether experience` and `aether ecosystem` expose the layer outside the UI.
- UI: Experience Center and Ecosystem Hub are built-in desktop apps.
- Config: `config/experience.json` and `config/ecosystem.json` define shell UX and ecosystem state.
- Packages: protected `aether-experience` and `aether-ecosystem` packages keep the layer repairable.
- Security: shell extension and ecosystem actions require explicit capabilities.
- Event Bus: `experience` and `ecosystem` topics track shell and Store events.

## Experience Center

`src/experienceCenter.ts` exposes the Windows-familiar shell model:

- Start Menu pins, recommendations, recent files, search, and power actions.
- Taskbar zones, running badges, preview cards, jump lists, and workspace filtering.
- Widgets for system health, featured Store apps, calendar/session state, and Aether Shield.
- Snap layouts for halves, main/sidebar, quad, and creator workflows.
- Registered keyboard commands including Ctrl+K, Ctrl+Space, Ctrl+Shift+E, Ctrl+Shift+H, and Alt+Tab.
- Default app associations for folders, text, images, `.aetherpkg`, and terminal commands.

## Ecosystem Hub

`src/ecosystemHub.ts` is the control surface for Aether's app economy:

- Stable, beta, and nightly release channels.
- Verified app catalog records.
- Extension points for Start recommendations, taskbar jump lists, file previews, Settings pages, and search providers.
- Protocols: `aether://`, `aetherpkg://`, and `aether-dev://`.
- Publishing checklist: scaffold, validate manifest, review permissions, package, sign placeholder, publish locally.
- Quality gates: no UI overlap, keyboard focus, minimal permissions, and crash bundle readiness.

## Commands

```powershell
npm run aether -- experience
npm run aether -- experience commands
npm run aether -- experience defaults
npm run aether -- experience snap
npm run aether -- ecosystem
npm run aether -- ecosystem apps
npm run aether -- ecosystem extensions
npm run aether -- ecosystem protocols
npm run aether -- ecosystem publish
```

## Internal Flow

1. `config/system.json` registers the experience and ecosystem manifests.
2. `system/aether-system.mjs` loads both manifests into the system graph.
3. `doctor` validates command registrations, default app associations, Store channels, app capabilities, and extension point policy.
4. `cli/aether.mjs` exposes read-only operational reports.
5. `src/desktop.ts` registers both apps with desktop icons, Start, command palette, terminal, shortcuts, and search routing.
6. Control Panel links both apps as first-class system tools.

## Design Goal

AetherOS should feel immediately understandable to a Windows user: Start, taskbar, Settings, Control Panel, File Explorer, Device Manager, Store, and shortcuts are all present. The improvement is that these surfaces are unified through command search, safer permissions, package rollback, restore metadata, and a developer-facing extension platform.

