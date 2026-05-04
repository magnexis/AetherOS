# Security Policy

## Supported Versions

AetherOS is currently an early prototype. Security fixes should target the latest published branch or release once the project is hosted. Until then, fixes should be made directly in the local working copy and verified with the build checks.

## Reporting a Vulnerability

Please open a private security advisory on GitHub if the repository is public and advisories are enabled. If advisories are not available, contact the maintainer directly before publishing details.

Include:

- A clear description of the vulnerability.
- Steps to reproduce.
- Impact and affected files.
- Any suggested mitigation.

## Current Security Scope

AetherOS includes security-facing prototype features such as Aether Shield, app permission surfaces, package verification language, quarantine flows, object-capability research, and compatibility virtualization models. These are not a replacement for OS-level antivirus, sandboxing, kernel hardening, or credential protection yet.

## Out of Scope

- Stealth anti-cheat bypassing
- Hidden hardware-signature spoofing
- Malware persistence, evasion, or privilege escalation
- Credential harvesting
- Unauthorized access to user files outside explicit shell features

## Secure Development Expectations

- Keep new Rust commands narrow and explicit.
- Validate paths and avoid accidental destructive file operations.
- Keep package install flows local and transparent until real signing exists.
- Show permission prompts before runtime apps access sensitive shell APIs.
- Document security-impacting changes in `docs/ARCHITECTURE.md` and `docs/ROADMAP.md`.
