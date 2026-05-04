export type KernelRegistryEntry = {
  hive: "HKLM" | "HKCU" | "AETHER";
  key: string;
  value: string;
  type: "string" | "dword" | "policy" | "capability";
};

export type DriverModel = {
  id: string;
  name: string;
  className: "Display" | "Storage" | "Network" | "Input" | "Audio" | "Security";
  mode: "kernel" | "user";
  status: "running" | "stopped" | "faulted";
  signed: boolean;
};

export type KernelModule = {
  name: string;
  version: string;
  loaded: boolean;
  trust: "core" | "signed" | "experimental";
};

export type DeviceNode = {
  bus: "PCIe" | "USB" | "NVMe" | "ACPI" | "Virtual";
  name: string;
  driver: string;
  state: "ready" | "sleeping" | "needs-driver";
};

export type SyscallRow = {
  id: number;
  name: string;
  ring: string;
  policy: string;
};

export type InterruptVector = {
  vector: string;
  source: string;
  handler: string;
  count: number;
};

export type RootKernelState = {
  registry: KernelRegistryEntry[];
  drivers: DriverModel[];
  modules: KernelModule[];
  devices: DeviceNode[];
  interrupts: InterruptVector[];
  registryAudit: string;
  selectedBootProfile: string;
  bootFlags: string;
  powerState: string;
  panicPolicy: string;
  securityRing: string;
};

const KERNEL_STATE_KEY = "aether-root-kernel-state";

export const defaultRegistry: KernelRegistryEntry[] = [
  { hive: "AETHER", key: "Kernel\\Boot\\Profile", value: "balanced", type: "policy" },
  { hive: "AETHER", key: "Kernel\\Drivers\\SignaturePolicy", value: "require-signed", type: "policy" },
  { hive: "HKLM", key: "System\\Services\\aether-indexer", value: "auto", type: "string" },
  { hive: "HKLM", key: "System\\Memory\\CompressionThreshold", value: "72", type: "dword" },
  { hive: "HKCU", key: "Session\\Shell\\RestoreWindows", value: "true", type: "policy" },
  { hive: "AETHER", key: "Capabilities\\Runtime\\Notifications", value: "prompt", type: "capability" }
];

export const defaultDrivers: DriverModel[] = [
  { id: "aether-display", name: "Aether Display Driver", className: "Display", mode: "kernel", status: "running", signed: true },
  { id: "aether-nvme", name: "Aether NVMe Storage", className: "Storage", mode: "kernel", status: "running", signed: true },
  { id: "aether-net", name: "AetherNet Adapter", className: "Network", mode: "user", status: "running", signed: true },
  { id: "aether-hid", name: "Aether HID Input", className: "Input", mode: "user", status: "running", signed: true },
  { id: "aether-audio", name: "Aether Audio Mixer", className: "Audio", mode: "user", status: "stopped", signed: true },
  { id: "shield-filter", name: "Shield Filesystem Filter", className: "Security", mode: "kernel", status: "running", signed: true }
];

export const defaultModules: KernelModule[] = [
  { name: "scheduler.sys", version: "2.1.0", loaded: true, trust: "core" },
  { name: "vfs.sys", version: "1.8.3", loaded: true, trust: "core" },
  { name: "capability.sys", version: "0.9.7", loaded: true, trust: "signed" },
  { name: "streambus.sys", version: "0.4.0", loaded: false, trust: "experimental" },
  { name: "hypercore.sys", version: "0.2.5", loaded: false, trust: "experimental" }
];

export const defaultDevices: DeviceNode[] = [
  { bus: "PCIe", name: "Aether GPU 0", driver: "aether-display", state: "ready" },
  { bus: "NVMe", name: "System Disk", driver: "aether-nvme", state: "ready" },
  { bus: "USB", name: "Keyboard + Pointer Hub", driver: "aether-hid", state: "ready" },
  { bus: "ACPI", name: "Power Button", driver: "acpi-power", state: "sleeping" },
  { bus: "Virtual", name: "Compatibility VM Bus", driver: "hypercore.sys", state: "needs-driver" }
];

export const syscallRows: SyscallRow[] = [
  { id: 0x01, name: "open_cap", ring: "user -> kernel", policy: "requires object token" },
  { id: 0x02, name: "map_shared", ring: "user -> kernel", policy: "domain checked" },
  { id: 0x03, name: "spawn_task", ring: "user -> kernel", policy: "profile capability" },
  { id: 0x04, name: "subscribe_stream", ring: "user -> kernel", policy: "bounded callback" },
  { id: 0x05, name: "install_pkg", ring: "admin -> service", policy: "signature gate" }
];

export const defaultInterrupts: InterruptVector[] = [
  { vector: "0x20", source: "Timer", handler: "scheduler_tick", count: 1482 },
  { vector: "0x21", source: "Keyboard", handler: "hid_ring_push", count: 334 },
  { vector: "0x2E", source: "NVMe", handler: "storage_complete", count: 809 },
  { vector: "0x40", source: "GPU", handler: "display_fence", count: 226 },
  { vector: "0x80", source: "Syscall", handler: "capability_gate", count: 1195 }
];

export function createDefaultRootKernelState(): RootKernelState {
  return {
    registry: clone(defaultRegistry),
    drivers: clone(defaultDrivers),
    modules: clone(defaultModules),
    devices: clone(defaultDevices),
    interrupts: clone(defaultInterrupts),
    registryAudit: "Root kernel registry loaded from protected Aether hive snapshot.",
    selectedBootProfile: "balanced",
    bootFlags: "quiet splash restore-session verify-drivers",
    powerState: "S0 Active",
    panicPolicy: "capture replay + restart shell",
    securityRing: "Ring 0 sealed · Ring 3 capability-gated"
  };
}

export function loadRootKernelState(): RootKernelState {
  try {
    const stored = localStorage.getItem(KERNEL_STATE_KEY);
    if (!stored) return createDefaultRootKernelState();
    const parsed = JSON.parse(stored) as Partial<RootKernelState>;
    const fallback = createDefaultRootKernelState();
    return {
      ...fallback,
      ...parsed,
      registry: parsed.registry?.length ? parsed.registry : fallback.registry,
      drivers: parsed.drivers?.length ? parsed.drivers : fallback.drivers,
      modules: parsed.modules?.length ? parsed.modules : fallback.modules,
      devices: parsed.devices?.length ? parsed.devices : fallback.devices,
      interrupts: parsed.interrupts?.length ? parsed.interrupts : fallback.interrupts
    };
  } catch {
    return createDefaultRootKernelState();
  }
}

export function saveRootKernelState(state: RootKernelState) {
  localStorage.setItem(KERNEL_STATE_KEY, JSON.stringify(state));
}

export function resetRootKernelState() {
  const state = createDefaultRootKernelState();
  saveRootKernelState(state);
  return state;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
