# Kernel Model

AetherOS is not yet a bootable kernel. The root kernel model now lives in `src/kernelCore.ts`, and Kernel Lab is the UI that edits that root model. Registry writes, driver states, module load states, device rescans, interrupt audits, boot flags, panic policy, power state, and protection-ring view persist through local shell storage.

Kernel Lab is no longer the private owner of this data. It is the control surface for root kernel state.

## Kernel Registry

The registry model in `src/kernelCore.ts` represents protected system configuration hives:

- `AETHER`: AetherOS kernel and capability policies
- `HKLM`: machine-wide service and system policy
- `HKCU`: user/session shell policy

Modeled registry areas include:

- Boot profile
- Driver signature policy
- Service startup policy
- Memory compression threshold
- Shell session restore
- Runtime capability prompts

Registry writes are treated as transactions with rollback language so the model can grow into a safer real state system later.

## Driver Configuration

The driver manager models:

- Display driver
- Storage driver
- Network adapter
- HID input driver
- Audio mixer driver
- Shield filesystem filter driver

Each driver tracks:

- Class
- Kernel/user-mode placement
- Running/stopped/faulted status
- Signature state

This is currently a persistent frontend state model. A real implementation would need native OS driver APIs or a real kernel.

## Device Tree

The device tree models bus/device/driver binding:

- PCIe GPU
- NVMe system disk
- USB input hub
- ACPI power button
- Virtual compatibility bus

The rescan action updates the virtual compatibility bus based on whether `hypercore.sys` is loaded.

## Kernel Modules

The module table models loadable kernel components:

- `scheduler.sys`
- `vfs.sys`
- `capability.sys`
- `streambus.sys`
- `hypercore.sys`

Each module tracks version, loaded state, and trust level.

## Syscall Table

The syscall table is root-level shared data and uses capability-gated entries instead of ambient trust:

- `open_cap`
- `map_shared`
- `spawn_task`
- `subscribe_stream`
- `install_pkg`

The point is to model a future syscall layer where access is explicit, auditable, and policy-bound.

## Interrupts and Timers

The interrupt model tracks vectors, sources, handlers, and counts:

- Timer
- Keyboard
- NVMe completion
- GPU fence
- Syscall gate

The audit action refreshes vector counters and simulates handler verification.

## Boot, Panic, and Power

Kernel Lab includes models for:

- Boot flags
- Panic policy
- Safe mode / diagnostic boot profile
- Replay capture on panic
- Power state transitions
- Wake source language

## Research Panels

Kernel Lab also includes:

- Single Address Space OS
- Transparent compatibility hypervisor model
- Formal verification micro-core
- Semantic filesystem
- Deterministic record/replay
- Object-capability security
- Zero-copy IPC
- Reactive kernel streams
- Hot-swappable components
- Hardware acceleration
- Process schedulers
- eBPF-style bytecode VM
- ZRAM-style memory compression
- Virtual filesystem layer
- Namespaces and isolation

## Safety Boundary

Compatibility virtualization is modeled for legitimate app compatibility and reproducible development environments. AetherOS does not implement stealth anti-cheat bypassing, hidden hardware-signature spoofing, malware persistence, credential theft, or evasion behavior.

## Path to Real Implementation

The practical path is:

1. Keep the root kernel model interactive and documented.
2. Move safe simulations from `src/kernelCore.ts` into Rust services.
3. Replace localStorage persistence with a Rust-backed kernel registry file.
4. Add event streams for device, service, and package changes.
5. Prototype a real user-mode driver/service boundary.
6. Decide whether deeper work targets a Linux desktop environment, native driver APIs, or a bootable research kernel.
