# AetherOS Privacy Policy

Effective date: May 4, 2026

## Summary

AetherOS is currently a local desktop shell prototype. By default, project state, settings, package records, audit records, logs, search metadata, and app runtime data are stored locally on the user's machine. This repository does not include a production cloud service, telemetry endpoint, account backend, advertising SDK, or analytics pipeline.

## Data Stored Locally

AetherOS may store local development data such as:

- Shell settings and theme preferences.
- Window layout and session state.
- Notification history.
- Package registry state.
- File Explorer metadata and search index state.
- Aether Shield scan history and quarantine metadata.
- Audit, event, service, backup, crash, and recovery records.
- App runtime manifests and permission grants.
- Ecosystem Store, publishing, extension, and certification metadata.

Runtime logs and generated records are intended to remain local and are ignored by git where appropriate.

## Data Sent Over the Network

The Phase 1 through Phase 12 prototype does not intentionally transmit personal data to an AetherOS cloud service. Some features model future network behavior, such as marketplace channels, package registries, update channels, secure DNS, and app protocols. Those are architecture surfaces unless a future implementation connects them to real services.

## User-Controlled Data

Users can inspect and manage local state through:

- Settings
- Security Center
- Permission Center
- Audit Viewer
- Backup Manager
- Event Viewer
- Developer Console
- Aether CLI

Future production versions should provide clear export, deletion, reset, and consent flows for every category of user data.

## App Permissions

AetherOS uses an object-capability security model in its manifests. Apps and extensions should request only the capabilities they need, such as filesystem access, notifications, terminal execution, package management, services, network access, settings access, or shell extension access.

Permission prompts, capability grants, and privileged actions should be auditable and visible to the user.

## Logs and Diagnostics

Local logs may include technical metadata needed for debugging, such as timestamps, app names, service names, package names, command names, crash-bundle metadata, and system health state. Avoid storing secrets, passwords, private keys, tokens, or sensitive file contents in logs.

## Marketplace and Ecosystem

The local ecosystem model includes app catalog, publisher, review, certification, protocol, and publishing metadata. In this prototype, that data is local source/config data. If AetherOS later adds a remote marketplace, it should provide a separate service privacy notice covering accounts, purchases, reviews, crash reports, abuse reporting, and package download logs.

## Security Boundary

AetherOS is a prototype and not a replacement for host operating-system security controls. Users should not rely on it as a production antivirus, credential provider, encrypted storage engine, firewall, or sandbox until those features are backed by native implementations and independent review.

## Children

AetherOS is a developer prototype and is not designed to knowingly collect data from children.

## Changes

Privacy behavior may change as the project evolves. Update this file when adding telemetry, remote services, account systems, marketplace services, cloud sync, or any data collection beyond local prototype state.

