import { loadRootKernelState, saveRootKernelState, syscallRows } from "./kernelCore";

type KernelLabContext = {
  notify: (title: string, body: string, tone?: "info" | "success" | "warning") => void;
  log: (source: string, message: string) => void;
};

type ProcessModel = {
  pid: number;
  name: string;
  kind: "CPU" | "I/O" | "GPU";
  priority: number;
  vruntime: number;
  queue: number;
};

const initialProcesses: ProcessModel[] = [
  { pid: 1, name: "aether-shell", kind: "I/O", priority: 8, vruntime: 12, queue: 0 },
  { pid: 42, name: "unity-editor", kind: "GPU", priority: 4, vruntime: 34, queue: 1 },
  { pid: 77, name: "asset-importer", kind: "CPU", priority: 5, vruntime: 28, queue: 1 },
  { pid: 108, name: "network-daemon", kind: "I/O", priority: 7, vruntime: 16, queue: 0 },
  { pid: 144, name: "shader-compiler", kind: "CPU", priority: 3, vruntime: 51, queue: 2 }
];

const bytecodeProgram = [
  "load r1, packet.protocol",
  "eq r1, tcp",
  "load r2, packet.port",
  "allow r2, 443",
  "deny suspicious"
];

const capabilityRows = [
  { token: "cap:root:9fa1", object: "AetherFS:/", rights: "derive, read", holder: "init" },
  { token: "cap:cfg:42be", object: "AetherFS:/System/config", rights: "read, write", holder: "settingsd" },
  { token: "cap:pkg:a817", object: "AetherPkg registry", rights: "install, rollback", holder: "pkgd" }
];

export function createKernelLabApp(context: KernelLabContext) {
  const root = document.createElement("div");
  root.className = "kernel-lab platform-app";
  let scheduler = "MLFQ";
  let processes = initialProcesses.map((process) => ({ ...process }));
  let memoryPressure = 71;
  let compressedPages = 384;
  let vmOutput = "No eBPF-style filter has run yet.";
  let vfsVersion = 18;
  let namespaceMode = "Game Container";
  let capabilityLog = "request_access(parent_token, \"config\") has not been invoked.";
  let ipcMessages = 12;
  let ipcCopiedBytes = 0;
  let streamEvents = 4;
  let hotSwapVersion = "scheduler.sys v1";
  let componentState = "5 runnable processes migrated";
  let accelerator = "GPU Compute";
  let encryptedBlocks = 96;
  let sasPointerPasses = 128;
  let protectionFaults = 0;
  let compatibilityVm = "Windows Shim VM";
  let vmAttestation = "Transparent compatibility mode: no stealth spoofing.";
  let proofStatus = "Micro-core proof not run yet.";
  let semanticQuery = "SELECT files WHERE extension == '.cs' AND references == 'PlayerController'";
  let semanticResults = ["Assets/Scripts/PlayerController.cs", "Assets/Scripts/InputBridge.cs", "Tests/PlayerControllerReplay.test.cs"];
  let replayEvents = 240;
  let replayCursor = 10;
  let kernelState = loadRootKernelState();
  let registry = kernelState.registry;
  let drivers = kernelState.drivers;
  let modules = kernelState.modules;
  let devices = kernelState.devices;
  let interrupts = kernelState.interrupts;
  let registryAudit = kernelState.registryAudit;
  let selectedBootProfile = kernelState.selectedBootProfile;
  let bootFlags = kernelState.bootFlags;
  let powerState = kernelState.powerState;
  let panicPolicy = kernelState.panicPolicy;
  let securityRing = kernelState.securityRing;

  const persistKernelState = () => {
    kernelState = {
      registry,
      drivers,
      modules,
      devices,
      interrupts,
      registryAudit,
      selectedBootProfile,
      bootFlags,
      powerState,
      panicPolicy,
      securityRing
    };
    saveRootKernelState(kernelState);
  };

  const writeRegistryPolicy = () => {
    const index = registry.findIndex((entry) => entry.key === "Kernel\\Boot\\Profile");
    if (index >= 0) registry[index] = { ...registry[index], value: selectedBootProfile };
    registryAudit = [
      `Write AETHER\\Kernel\\Boot\\Profile = ${selectedBootProfile}`,
      "Transaction journal: committed",
      "Rollback snapshot: registry-boot-profile.previous",
      "Policy verifier: driver signature policy unchanged"
    ].join("\n");
    context.notify("Kernel registry updated", `Boot profile set to ${selectedBootProfile}.`, "success");
    context.log("kernel-lab", `Registry boot profile: ${selectedBootProfile}`);
    persistKernelState();
    render();
  };

  const toggleDriver = (id: string) => {
    drivers = drivers.map((driver) => {
      if (driver.id !== id) return driver;
      const nextStatus = driver.status === "running" ? "stopped" : "running";
      return { ...driver, status: nextStatus };
    });
    const driver = drivers.find((candidate) => candidate.id === id);
    context.notify("Driver state changed", `${driver?.name ?? id}: ${driver?.status ?? "unknown"}`, driver?.status === "running" ? "success" : "warning");
    context.log("kernel-lab", `Driver ${id}: ${driver?.status}`);
    persistKernelState();
    render();
  };

  const toggleModule = (name: string) => {
    modules = modules.map((module) => module.name === name ? { ...module, loaded: !module.loaded } : module);
    const module = modules.find((candidate) => candidate.name === name);
    context.notify(module?.loaded ? "Kernel module loaded" : "Kernel module unloaded", name, module?.loaded ? "success" : "warning");
    context.log("kernel-lab", `Module ${name}: ${module?.loaded ? "loaded" : "unloaded"}`);
    persistKernelState();
    render();
  };

  const rescanDevices = () => {
    const hypercoreLoaded = modules.some((module) => module.name === "hypercore.sys" && module.loaded);
    devices = devices.map((device) => device.name === "Compatibility VM Bus" ? { ...device, state: hypercoreLoaded ? "ready" : "needs-driver" } : device);
    context.notify("Device tree rescanned", hypercoreLoaded ? "Compatibility VM Bus is ready." : "Compatibility VM Bus still needs hypercore.sys.", hypercoreLoaded ? "success" : "warning");
    context.log("kernel-lab", "Device tree rescan completed");
    persistKernelState();
    render();
  };

  const auditInterrupts = () => {
    interrupts = interrupts.map((interrupt) => ({ ...interrupt, count: interrupt.count + Math.round(12 + Math.random() * 80) }));
    context.notify("Interrupt audit complete", "Vector counts refreshed and handlers verified.", "success");
    context.log("kernel-lab", "Interrupt descriptor table audited");
    persistKernelState();
    render();
  };

  const applyBootFlags = () => {
    registryAudit = [
      `Boot flags staged: ${bootFlags}`,
      `Panic policy: ${panicPolicy}`,
      "Next boot profile stored in Aether registry transaction log.",
      "Recovery note: previous boot flags remain restorable."
    ].join("\n");
    context.notify("Boot configuration staged", selectedBootProfile, "success");
    context.log("kernel-lab", `Boot flags: ${bootFlags}`);
    persistKernelState();
    render();
  };

  const cyclePowerState = () => {
    powerState = powerState === "S0 Active" ? "S0 Low Power Idle" : powerState === "S0 Low Power Idle" ? "S3 Sleep Ready" : "S0 Active";
    context.notify("Power state changed", powerState, "info");
    context.log("kernel-lab", `Power state: ${powerState}`);
    persistKernelState();
    render();
  };

  const rotateSecurityRing = () => {
    securityRing = securityRing.startsWith("Ring 0")
      ? "Ring -1 hypervisor mediated · Ring 0 sealed"
      : securityRing.startsWith("Ring -1")
        ? "Ring 3 app domain · capability prompt required"
        : "Ring 0 sealed · Ring 3 capability-gated";
    context.notify("Protection model rotated", securityRing, "info");
    context.log("kernel-lab", securityRing);
    persistKernelState();
    render();
  };

  const runSchedulerTick = () => {
    processes = processes
      .map((process) => {
        const behaviorBonus = process.kind === "I/O" ? -2 : process.kind === "GPU" ? -1 : 4;
        const aiSlice = scheduler === "AI-Augmented" ? behaviorBonus : 0;
        const delta = scheduler === "CFS" ? Math.max(1, 10 - process.priority) : scheduler === "Round Robin" ? 8 : 4 + process.queue * 3;
        return {
          ...process,
          vruntime: Math.max(0, process.vruntime + delta + aiSlice),
          queue: scheduler === "MLFQ" && process.kind === "CPU" ? Math.min(2, process.queue + 1) : process.kind === "I/O" ? 0 : process.queue
        };
      })
      .sort((a, b) => a.vruntime - b.vruntime);
    context.log("kernel-lab", `Scheduler tick: ${scheduler}`);
    render();
  };

  const runCompression = () => {
    const reclaimed = Math.max(32, Math.round(memoryPressure * 3.2));
    compressedPages += reclaimed;
    memoryPressure = Math.max(39, memoryPressure - 14);
    context.notify("ZRAM compression pass", `${reclaimed} cold pages compressed in RAM.`, "success");
    context.log("kernel-lab", `Compressed ${reclaimed} pages`);
    render();
  };

  const runVm = () => {
    vmOutput = [
      "Aether eBPF VM loaded 5 instructions.",
      "Verifier: bounded jumps, register types, and memory access passed.",
      "Packet rule: allow tcp/443, deny suspicious extensions.",
      "Future: accept higher-level C#-like safe bytecode for kernel extensions."
    ].join("\n");
    context.notify("Kernel extension verified", "Sandboxed bytecode executed safely.", "success");
    context.log("kernel-lab", "Ran eBPF-style VM verifier");
    render();
  };

  const writeFileVersion = () => {
    vfsVersion += 1;
    context.notify("Versioned VFS write", `Created file revision #${vfsVersion}.`, "success");
    context.log("kernel-lab", `VFS revision ${vfsVersion}`);
    render();
  };

  const requestCapability = () => {
    capabilityLog = [
      "request_access(cap:root:9fa1, \"System/config\")",
      "Verifier: parent token can derive child capability.",
      "Returned cap:cfg:42be with read/write rights.",
      "No ambient UID/GID identity was consulted."
    ].join("\n");
    context.notify("Capability derived", "Object token issued for System/config.", "success");
    context.log("kernel-lab", "Derived object capability for config");
    render();
  };

  const runIpc = () => {
    ipcMessages += 8;
    ipcCopiedBytes = 0;
    context.notify("Zero-copy IPC batch", "Keyboard driver wrote events into shared ring buffer.", "success");
    context.log("kernel-lab", `IPC messages: ${ipcMessages}`);
    render();
  };

  const pushStreamEvent = () => {
    streamEvents += 1;
    context.notify("Reactive stream event", "File change callback delivered without polling.", "success");
    context.log("kernel-lab", `Stream events: ${streamEvents}`);
    render();
  };

  const hotSwapScheduler = () => {
    hotSwapVersion = hotSwapVersion.endsWith("v1") ? "scheduler.sys v2" : "scheduler.sys v3";
    componentState = `Migrated ${processes.length} process records into ${scheduler} layout`;
    context.notify("Scheduler hot-swapped", `${hotSwapVersion} is live after state migration.`, "warning");
    context.log("kernel-lab", `Hot-swapped ${hotSwapVersion}`);
    render();
  };

  const runAccelerator = () => {
    encryptedBlocks += accelerator === "GPU Compute" ? 256 : 128;
    compressedPages += accelerator === "GPU Compute" ? 96 : 48;
    context.notify("Kernel accelerator dispatched", `${accelerator} handled compression/encryption queue.`, "success");
    context.log("kernel-lab", `${accelerator} encrypted ${encryptedBlocks} blocks`);
    render();
  };

  const passSasPointer = () => {
    sasPointerPasses += 64;
    protectionFaults = Math.max(0, protectionFaults - 1);
    context.notify("SAS pointer passed", "Shared 64-bit pointer crossed domains without copying.", "success");
    context.log("kernel-lab", `SASOS pointer passes: ${sasPointerPasses}`);
    render();
  };

  const launchCompatibilityVm = () => {
    vmAttestation = [
      `${compatibilityVm} launched inside isolated compatibility container.`,
      "CPU/GPU access is mediated by Aether HyperCore.",
      "Attestation policy: transparent compatibility, no anti-cheat stealth spoofing.",
      "Target: legitimate Windows app compatibility and reproducible device profiles."
    ].join("\n");
    context.notify("Compatibility VM ready", compatibilityVm, "success");
    context.log("kernel-lab", `Compatibility VM: ${compatibilityVm}`);
    render();
  };

  const runProof = () => {
    proofStatus = [
      "Model checked: lock ordering graph has no cycles.",
      "Memory allocator invariant: no double-free state reachable.",
      "Capability derivation invariant: rights only decrease.",
      "Result: micro-core proof obligations satisfied in design model."
    ].join("\n");
    context.notify("Formal proof pass", "Micro-core invariants verified in model.", "success");
    context.log("kernel-lab", "Formal verification model pass");
    render();
  };

  const runSemanticQuery = () => {
    semanticResults = semanticResults.slice().reverse();
    context.notify("Semantic filesystem query", "Graph metadata query returned Unity project assets.", "success");
    context.log("kernel-lab", semanticQuery);
    render();
  };

  const rewindReplay = () => {
    replayCursor = Math.max(0, replayCursor - 2);
    replayEvents += 12;
    context.notify("Replay stream rewound", `${replayCursor}s before crash marker.`, "warning");
    context.log("kernel-lab", `Replay cursor: ${replayCursor}s`);
    render();
  };

  const render = () => {
    root.innerHTML = `
      <div class="app-toolbar">
        <div>
          <h2>Aether Kernel Lab</h2>
          <p>Root kernel model UI for registry, drivers, devices, modules, syscalls, interrupts, boot policy, scheduling, memory, VFS, namespaces, and isolation.</p>
        </div>
        <span class="status-pill">Root kernel state · persistent</span>
      </div>
      <div class="kernel-grid">
        <section class="details-panel kernel-panel">
          <h3>Kernel Registry</h3>
          <p class="small-note">Protected registry-style configuration hive for boot policy, services, memory thresholds, driver signing, shell restore, and capabilities.</p>
          <div class="registry-table">
            ${registry.map((entry) => `
              <button title="${entry.hive}\\${entry.key}">
                <strong>${entry.hive}</strong>
                <span>${entry.key}</span>
                <small>${entry.type} · ${entry.value}</small>
              </button>
            `).join("")}
          </div>
          <label class="field-label">Boot profile</label>
          <select class="select-input" data-boot-profile>
            ${["balanced", "gaming", "battery-saver", "safe-mode", "diagnostic"].map((profile) => `<option ${profile === selectedBootProfile ? "selected" : ""}>${profile}</option>`).join("")}
          </select>
          <div class="button-row">
            <button class="primary-btn" data-action="registry-write">Commit registry transaction</button>
            <button class="secondary-btn" data-action="boot-flags">Stage boot flags</button>
          </div>
          <pre>${escapeText(registryAudit)}</pre>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Driver Configuration</h3>
          <p class="small-note">Driver manager model with class, isolation mode, signature state, status, and start/stop controls.</p>
          <div class="driver-list">
            ${drivers.map((driver) => `
              <article class="${driver.status}">
                <div>
                  <strong>${driver.name}</strong>
                  <span>${driver.className} · ${driver.mode} mode · ${driver.signed ? "signed" : "unsigned"}</span>
                </div>
                <button class="secondary-btn" data-driver="${driver.id}">${driver.status === "running" ? "Stop" : "Start"}</button>
              </article>
            `).join("")}
          </div>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Device Tree</h3>
          <p class="small-note">ACPI/PCIe/USB/NVMe/virtual device topology with driver binding and power state.</p>
          <div class="device-tree">
            ${devices.map((device) => `
              <article class="${device.state}">
                <strong>${device.bus}</strong>
                <span>${device.name}</span>
                <small>${device.driver} · ${device.state}</small>
              </article>
            `).join("")}
          </div>
          <button class="primary-btn" data-action="rescan-devices">Rescan device tree</button>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Kernel Modules</h3>
          <p class="small-note">Loadable component registry with trust level, version, and runtime load state.</p>
          <div class="module-list">
            ${modules.map((module) => `
              <button class="${module.loaded ? "loaded" : ""}" data-module="${module.name}">
                <strong>${module.name}</strong>
                <span>${module.version} · ${module.trust}</span>
                <small>${module.loaded ? "loaded" : "available"}</small>
              </button>
            `).join("")}
          </div>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Syscall Table</h3>
          <p class="small-note">Capability-gated syscall surface with explicit policy labels instead of ambient trust.</p>
          <div class="syscall-table">
            ${syscallRows.map((syscall) => `
              <article>
                <strong>0x${syscall.id.toString(16).padStart(2, "0")}</strong>
                <span>${syscall.name}</span>
                <small>${syscall.ring} · ${syscall.policy}</small>
              </article>
            `).join("")}
          </div>
          <p class="small-note">${securityRing}</p>
          <button class="primary-btn" data-action="security-ring">Rotate protection view</button>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Interrupts and Timers</h3>
          <p class="small-note">Interrupt descriptor table model for timer, input, storage, GPU fences, and syscall gates.</p>
          <div class="interrupt-table">
            ${interrupts.map((interrupt) => `
              <article>
                <strong>${interrupt.vector}</strong>
                <span>${interrupt.source}</span>
                <small>${interrupt.handler} · ${interrupt.count}</small>
              </article>
            `).join("")}
          </div>
          <button class="primary-btn" data-action="interrupt-audit">Audit interrupt table</button>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Boot and Panic Policy</h3>
          <p class="small-note">Bootloader handoff model with kernel flags, panic strategy, safe mode, and recovery rollback.</p>
          <label class="field-label">Boot flags</label>
          <input class="search-input wide-input" data-boot-flags value="${escapeAttr(bootFlags)}" />
          <label class="field-label">Panic policy</label>
          <select class="select-input" data-panic-policy>
            ${["capture replay + restart shell", "freeze and dump state", "enter recovery shell", "rollback last module"].map((policy) => `<option ${policy === panicPolicy ? "selected" : ""}>${policy}</option>`).join("")}
          </select>
          <button class="primary-btn" data-action="boot-flags">Stage boot configuration</button>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Power Manager</h3>
          <p class="small-note">ACPI-style power model with active, low-power idle, sleep readiness, device state, and wake source language.</p>
          <div class="metric-card">
            <div><span>Power state</span><strong>${powerState}</strong></div>
            <div><span>Wake source</span><strong>Keyboard</strong></div>
          </div>
          <button class="primary-btn" data-action="power-state">Cycle power state</button>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Single Address Space OS</h3>
          <p class="small-note">SASOS model: every process lives in one 64-bit address space, with Protection Domains enforcing access instead of separate page tables.</p>
          <div class="sas-map">
            <span>0x0000 shell.ro</span>
            <span>0x2A00 unity.rw</span>
            <span>0x7F00 ipc.shared</span>
            <span>0xFF00 kernel.sealed</span>
          </div>
          <div class="metric-card">
            <div><span>Pointer handoffs</span><strong>${sasPointerPasses}</strong></div>
            <div><span>Protection faults</span><strong>${protectionFaults}</strong></div>
          </div>
          <button class="primary-btn" data-action="sas">Pass shared pointer</button>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Transparent Compatibility Hypervisor</h3>
          <p class="small-note">Aether HyperCore model for legitimate Windows compatibility shims, hardware profile mediation, and isolated game/app containers.</p>
          <label class="field-label">Compatibility target</label>
          <select class="select-input" data-compat-vm>
            ${["Windows Shim VM", "Legacy Tool VM", "Game Compatibility Container"].map((item) => `<option ${item === compatibilityVm ? "selected" : ""}>${item}</option>`).join("")}
          </select>
          <pre>${escapeText(vmAttestation)}</pre>
          <button class="primary-btn" data-action="compat-vm">Launch compatibility container</button>
          <p class="small-note">Safety boundary: this lab models transparent compatibility and isolation, not stealth anti-cheat bypassing.</p>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Formal Verification Micro-Core</h3>
          <p class="small-note">SeL4-inspired proof workflow for synchronization, allocator invariants, capability monotonicity, and deadlock freedom.</p>
          <div class="proof-grid">
            <span>memory safety</span>
            <span>no deadlocks</span>
            <span>capability monotonicity</span>
            <span>scheduler progress</span>
          </div>
          <button class="primary-btn" data-action="proof">Run proof model</button>
          <pre>${escapeText(proofStatus)}</pre>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Semantic Filesystem</h3>
          <p class="small-note">Database-as-OS model: files are graph nodes with tags, relationships, references, authorship, and build metadata.</p>
          <input class="search-input wide-input" data-semantic-query value="${escapeAttr(semanticQuery)}" />
          <div class="semantic-results">
            ${semanticResults.map((result) => `<button>${result}<span>references PlayerController · modified_by GitHub_Action</span></button>`).join("")}
          </div>
          <button class="primary-btn" data-action="semantic">Run graph query</button>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Deterministic Record & Replay</h3>
          <p class="small-note">Kernel ring buffer captures interrupts, thread switches, clock reads, and nondeterministic inputs for replayable crash streams.</p>
          <div class="replay-timeline">
            ${Array.from({ length: 10 }, (_, index) => `<span class="${index >= replayCursor / 2 ? "active" : ""}">${index - 9}s</span>`).join("")}
          </div>
          <div class="metric-card">
            <div><span>Recorded events</span><strong>${replayEvents}</strong></div>
            <div><span>Replay cursor</span><strong>-${replayCursor}s</strong></div>
          </div>
          <button class="primary-btn" data-action="replay">Rewind crash stream</button>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Capability-Based Security</h3>
          <p class="small-note">Object capabilities replace ambient identity checks. Processes receive unforgeable tokens and derive narrower child tokens through syscalls.</p>
          <div class="capability-list">
            ${capabilityRows.map((capability) => `
              <article>
                <strong>${capability.token}</strong>
                <span>${capability.object}</span>
                <small>${capability.holder} · ${capability.rights}</small>
              </article>
            `).join("")}
          </div>
          <button class="primary-btn" data-action="capability">request_access(parent_token, "config")</button>
          <pre>${escapeText(capabilityLog)}</pre>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Zero-Copy Microkernel IPC</h3>
          <p class="small-note">A non-critical user-mode driver can send input events through shared memory and circular buffers without copying payload bytes.</p>
          <div class="ipc-ring">
            ${Array.from({ length: 8 }, (_, index) => `<span class="${index < ipcMessages % 8 ? "filled" : ""}">slot ${index}</span>`).join("")}
          </div>
          <div class="metric-card">
            <div><span>Messages</span><strong>${ipcMessages}</strong></div>
            <div><span>Copied bytes</span><strong>${ipcCopiedBytes}</strong></div>
          </div>
          <button class="primary-btn" data-action="ipc">Send keyboard driver batch</button>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Everything is a Stream</h3>
          <p class="small-note">Reactive kernel API inspired by io_uring and Observables: processes subscribe to events instead of polling files, sockets, or interrupts.</p>
          <div class="stream-pipeline">
            <span>file.watch()</span>
            <span>kernel event loop</span>
            <span>ring event</span>
            <span>process callback</span>
          </div>
          <p class="small-note">Delivered events: ${streamEvents}</p>
          <button class="primary-btn" data-action="stream">Push file-change event</button>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Hot-Swappable Kernel Components</h3>
          <p class="small-note">Component-object kernel model for replacing scheduler.sys or memory manager components while preserving state.</p>
          <div class="component-stack">
            <span>Pause threads</span>
            <span>Export state</span>
            <span>Load ${hotSwapVersion}</span>
            <span>Resume</span>
          </div>
          <p class="small-note">${componentState}</p>
          <button class="primary-btn" data-action="hotswap">Hot-swap scheduler.sys</button>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Hardware-Accelerated Kernel Logic</h3>
          <p class="small-note">GPU or FPGA offload model for compression and filesystem encryption queues.</p>
          <label class="field-label">Accelerator</label>
          <select class="select-input" data-accelerator>
            ${["GPU Compute", "FPGA Queue", "CPU Fallback"].map((item) => `<option ${item === accelerator ? "selected" : ""}>${item}</option>`).join("")}
          </select>
          <div class="metric-card">
            <div><span>Encrypted blocks</span><strong>${encryptedBlocks}</strong></div>
            <div><span>Compression target</span><strong>${compressedPages}</strong></div>
          </div>
          <button class="primary-btn" data-action="accelerate">Dispatch compute queue</button>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Advanced Process Scheduling</h3>
          <p class="small-note">Round Robin, Multilevel Feedback Queue, CFS-style virtual runtime, and AI-augmented behavior tuning.</p>
          <label class="field-label">Scheduler policy</label>
          <select class="select-input" data-scheduler>
            ${["Round Robin", "MLFQ", "CFS", "AI-Augmented"].map((item) => `<option ${item === scheduler ? "selected" : ""}>${item}</option>`).join("")}
          </select>
          <div class="scheduler-tree">
            ${processes.map((process) => `
              <button title="${process.name}">
                <strong>${process.pid}</strong>
                <span>${process.name}</span>
                <small>${process.kind} · q${process.queue} · vr ${process.vruntime}</small>
              </button>
            `).join("")}
          </div>
          <button class="primary-btn" data-action="schedule">Run scheduler tick</button>
        </section>
        <section class="details-panel kernel-panel">
          <h3>eBPF-Style Kernel VM</h3>
          <p class="small-note">A small register VM for safe filesystem filters, packet inspection, and future high-level Aether bytecode.</p>
          <pre>${bytecodeProgram.join("\n")}</pre>
          <button class="primary-btn" data-action="vm">Verify and run bytecode</button>
          <pre>${escapeText(vmOutput)}</pre>
        </section>
        <section class="details-panel kernel-panel">
          <h3>ZRAM and Memory Compression</h3>
          <p class="small-note">Compressed paging model for memory pressure, virtualization, and low-RAM workloads.</p>
          <div class="metric-card">
            <div><span>Memory pressure</span><strong>${memoryPressure}%</strong></div>
            <progress value="${memoryPressure}" max="100"></progress>
            <div><span>Compressed pages</span><strong>${compressedPages}</strong></div>
          </div>
          <button class="primary-btn" data-action="compress">Compress cold LRU pages</button>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Virtual Filesystem Layer</h3>
          <p class="small-note">Everything-as-a-file plus a native versioned filesystem concept, like mini-Git under file writes.</p>
          <div class="vfs-stack">
            <span>sys_read()</span>
            <span>Aether VFS</span>
            <span>versioned file node</span>
            <span>host adapter / future ext4 / NTFS / FAT32</span>
          </div>
          <button class="primary-btn" data-action="vfs">Write new file revision</button>
          <p class="small-note">Current revision: #${vfsVersion}</p>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Namespaces and Isolation</h3>
          <p class="small-note">PID, mount, network, user, and GPU-aware game containers for safer creative workloads.</p>
          <label class="field-label">Isolation profile</label>
          <select class="select-input" data-namespace>
            ${["PID Sandbox", "Game Container", "Build Container", "Network Isolate"].map((item) => `<option ${item === namespaceMode ? "selected" : ""}>${item}</option>`).join("")}
          </select>
          <div class="namespace-map">
            <span>PID 1: game.exe</span>
            <span>GPU: direct grant</span>
            <span>FS: project-only</span>
            <span>Network: prompted</span>
          </div>
        </section>
        <section class="details-panel kernel-panel">
          <h3>Technical Resources</h3>
          <p>OSDev Wiki</p>
          <p class="small-note">Bare Bones and Meaty Skeleton tutorials for moving from bootloader to kernel fundamentals.</p>
          <p>Aether From Scratch</p>
          <p class="small-note">A project track for userspace/kernel contracts: compilers, shell, syscalls, filesystem, and package toolchain.</p>
        </section>
      </div>
    `;

    root.querySelector<HTMLSelectElement>("[data-scheduler]")?.addEventListener("change", (event) => {
      scheduler = (event.target as HTMLSelectElement).value;
      context.notify("Scheduler policy changed", scheduler);
      render();
    });
    root.querySelector<HTMLSelectElement>("[data-boot-profile]")?.addEventListener("change", (event) => {
      selectedBootProfile = (event.target as HTMLSelectElement).value;
    });
    root.querySelector<HTMLInputElement>("[data-boot-flags]")?.addEventListener("input", (event) => {
      bootFlags = (event.target as HTMLInputElement).value;
    });
    root.querySelector<HTMLSelectElement>("[data-panic-policy]")?.addEventListener("change", (event) => {
      panicPolicy = (event.target as HTMLSelectElement).value;
    });
    root.querySelectorAll<HTMLButtonElement>("[data-driver]").forEach((button) => {
      button.addEventListener("click", () => toggleDriver(button.dataset.driver ?? ""));
    });
    root.querySelectorAll<HTMLButtonElement>("[data-module]").forEach((button) => {
      button.addEventListener("click", () => toggleModule(button.dataset.module ?? ""));
    });
    root.querySelector<HTMLSelectElement>("[data-namespace]")?.addEventListener("change", (event) => {
      namespaceMode = (event.target as HTMLSelectElement).value;
      context.notify("Namespace profile changed", namespaceMode);
      render();
    });
    root.querySelector<HTMLSelectElement>("[data-accelerator]")?.addEventListener("change", (event) => {
      accelerator = (event.target as HTMLSelectElement).value;
      context.notify("Accelerator changed", accelerator);
      render();
    });
    root.querySelector<HTMLSelectElement>("[data-compat-vm]")?.addEventListener("change", (event) => {
      compatibilityVm = (event.target as HTMLSelectElement).value;
      vmAttestation = `Selected ${compatibilityVm}. Launch to create an isolated compatibility profile.`;
      render();
    });
    root.querySelector<HTMLInputElement>("[data-semantic-query]")?.addEventListener("input", (event) => {
      semanticQuery = (event.target as HTMLInputElement).value;
    });
    root.querySelector('[data-action="sas"]')?.addEventListener("click", passSasPointer);
    root.querySelector('[data-action="registry-write"]')?.addEventListener("click", writeRegistryPolicy);
    root.querySelector('[data-action="rescan-devices"]')?.addEventListener("click", rescanDevices);
    root.querySelector('[data-action="interrupt-audit"]')?.addEventListener("click", auditInterrupts);
    root.querySelector('[data-action="boot-flags"]')?.addEventListener("click", applyBootFlags);
    root.querySelector('[data-action="power-state"]')?.addEventListener("click", cyclePowerState);
    root.querySelector('[data-action="security-ring"]')?.addEventListener("click", rotateSecurityRing);
    root.querySelector('[data-action="compat-vm"]')?.addEventListener("click", launchCompatibilityVm);
    root.querySelector('[data-action="proof"]')?.addEventListener("click", runProof);
    root.querySelector('[data-action="semantic"]')?.addEventListener("click", runSemanticQuery);
    root.querySelector('[data-action="replay"]')?.addEventListener("click", rewindReplay);
    root.querySelector('[data-action="capability"]')?.addEventListener("click", requestCapability);
    root.querySelector('[data-action="ipc"]')?.addEventListener("click", runIpc);
    root.querySelector('[data-action="stream"]')?.addEventListener("click", pushStreamEvent);
    root.querySelector('[data-action="hotswap"]')?.addEventListener("click", hotSwapScheduler);
    root.querySelector('[data-action="accelerate"]')?.addEventListener("click", runAccelerator);
    root.querySelector('[data-action="schedule"]')?.addEventListener("click", runSchedulerTick);
    root.querySelector('[data-action="compress"]')?.addEventListener("click", runCompression);
    root.querySelector('[data-action="vm"]')?.addEventListener("click", runVm);
    root.querySelector('[data-action="vfs"]')?.addEventListener("click", writeFileVersion);
  };

  render();
  return root;
}

function escapeText(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function escapeAttr(value: string) {
  return escapeText(value).replace(/"/g, "&quot;");
}
