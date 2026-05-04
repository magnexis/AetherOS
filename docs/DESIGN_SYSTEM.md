# Design System

AetherOS uses a dark, solid, operating-system-style interface. The design should feel like a premium desktop environment, not a marketing page.

## Visual Language

- Dark mode first
- Deep navy and charcoal surfaces
- Electric blue, purple, and green accents
- Solid panels
- Compact, information-rich layouts
- Clear window chrome
- Visible focus states
- Responsive grids

Avoid:

- Glassmorphism
- Blurry transparent cards
- Decorative gradient blobs
- Unstyled white backgrounds
- Oversized landing-page hero layouts inside apps
- Placeholder-only screens
- Overlapping controls

## Layout Rules

- Apps live inside movable windows.
- App content should fit in narrow windows.
- Use `minmax(0, 1fr)` for grid tracks that contain text.
- Use scroll containers for dense panels.
- Do not nest decorative cards inside decorative cards.
- Keep toolbar actions visible and predictable.
- Use compact headings inside app panels.

## Interaction Rules

Every major button should do one of these:

- Open a panel
- Launch an app/window
- Change state
- Run a visible action
- Write output/logs
- Send a notification

If a control is not wired yet, do not show it as a primary action.

## Accessibility

- Preserve `:focus-visible` outlines.
- Keep text contrast high in dark and light themes.
- Avoid tiny tap targets for core shell actions.
- Use real labels for controls, not only symbols, when the meaning is not obvious.
- Do not rely on color alone to show status.

## Theme Tokens

Current CSS is plain CSS, not a token system. When refactoring, keep these concepts:

- Background: deep navy / charcoal
- Surface: solid dark panel
- Border: muted blue-gray
- Primary accent: electric blue
- Success accent: green
- Research/accent: purple
- Warning accent: amber
- Danger accent: red

## App Design Checklist

Before finishing a new app:

- It opens inside the window manager.
- It has a meaningful toolbar.
- It has no blank or placeholder-only screen.
- All major buttons work.
- It has empty/loading/error states where needed.
- It works in a narrow window.
- It works in light and dark themes.
- It is documented in README and docs.
- It is searchable or command-launchable when appropriate.
