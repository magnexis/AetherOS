# RFC Process

Use an RFC for changes that affect architecture, security, package/runtime behavior, persistence, or long-term OS direction.

## When to Write an RFC

Write an RFC for:

- New built-in apps
- New Rust backend capabilities
- App runtime permissions
- Package registry format changes
- Security model changes
- Kernel Lab concept expansions
- Aether Nexus automation changes
- Window manager or workspace changes
- Breaking changes to persisted state

Small UI fixes, docs edits, and bug fixes usually do not need an RFC.

## RFC Template

```markdown
# RFC: Title

## Summary

What is being proposed?

## Motivation

Why does AetherOS need this?

## User Experience

How will the feature appear and behave?

## Technical Design

Which files, modules, Rust commands, state models, or app routes change?

## Security and Safety

What could go wrong? What boundaries are needed?

## Persistence

Does this change saved state, packages, app data, or config?

## Testing

How will it be verified?

## Documentation

Which docs must change?

## Alternatives

What other approaches were considered?
```

## Decision States

- Draft: idea is being shaped
- Proposed: ready for review
- Accepted: approved for implementation
- Rejected: not moving forward
- Superseded: replaced by another RFC

## Storage

Future RFCs can live in:

```text
docs/rfcs/
```

Use filenames like:

```text
0001-nexus-persistent-automations.md
0002-native-webview-runtime.md
```
