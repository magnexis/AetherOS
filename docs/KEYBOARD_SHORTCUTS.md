# Keyboard Shortcuts

AetherOS keeps major shell actions reachable from both UI controls and keyboard commands.

## Global Shortcuts

| Shortcut | Action |
| --- | --- |
| Ctrl+K | Open command palette |
| Ctrl+Shift+P | Open command palette |
| Ctrl+Space | Open Start launcher |
| Ctrl+, | Open Settings |
| Ctrl+Shift+T | Open Terminal |
| Ctrl+Shift+F | Open File Explorer |
| Ctrl+Shift+M | Open Marketplace |
| Ctrl+Shift+S | Open System Search |
| Ctrl+Shift+A | Open Aether Assistant |
| Ctrl+Shift+X | Open Aether Nexus |
| Alt+Tab | Focus next visible window |
| Ctrl+Alt+L | Lock session |
| Ctrl+Alt+O | Open workspace overview |
| Ctrl+Alt+T | Tile visible windows |
| Ctrl+Alt+M | Open System Monitor |
| Ctrl+Alt+S | Open Security Center |
| Ctrl+Alt+1 | Switch to workspace 1 |
| Ctrl+Alt+2 | Switch to workspace 2 |
| Ctrl+Alt+3 | Switch to workspace 3 |
| Ctrl+Alt+4 | Switch to workspace 4 |
| Escape | Close workspace overview and shell menus |

## Command Palette Routes

The command palette can open:

- Terminal
- Settings
- File Explorer
- System Monitor
- Package Manager
- Marketplace
- Developer Console
- App Runtime
- Service Manager
- Security Center
- System Search
- Aether SDK
- Update Center
- Control Panel
- Aether Assistant
- Kernel Lab
- Aether Nexus

It can also:

- Tile windows
- Open workspace overview
- Toggle theme
- Lock session
- Search package keywords
- Show About text

## Terminal Launch Commands

Some shell actions are also available from Terminal:

```text
open <app>
nexus
theme dark
theme light
install demo-app
remove demo-app
```

## Adding a Shortcut

When adding a new shortcut:

1. Add the key handler in `src/desktop.ts`.
2. Add the command palette route if the action is user-facing.
3. Add it to Settings > Shortcuts.
4. Add it here.
5. Add it to `docs/PHASE_1_FEATURES.md` if it is a major feature.
