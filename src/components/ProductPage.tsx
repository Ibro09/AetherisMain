import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Database,
  Activity,
  Check,
  Info,
  RefreshCw,
  Lock,
  Server,
  Workflow,
  type LucideIcon,
} from "lucide-react";

type ExplainTab = "routing" | "tee" | "ledger";
type GpuId = "h100" | "a100" | "l40s" | "cpu";

type GpuSpec = {
  shortLabel: string;
  name: string;
  vram: string;
  payoutRate: string;
  routingShare: string;
  attestation: string;
  optimalTask: string;
};

export default function ProductPage({
  onStartEarning,
  onNavigateToDocs,
}: {
  onStartEarning: () => void;
  onNavigateToDocs?: () => void;
}) {
  // Explainer Tabs: routing, tee, ledger
  const [activeExplainTab, setActiveExplainTab] =
    useState<ExplainTab>("routing");

  // Selected GPU for details
  const [selectedGpu, setSelectedGpu] = useState<GpuId>("h100");

  // Latency simulation text/steps
  const [testNodeIp, setTestNodeIp] = useState<string>("192.168.100.41");
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [measuredLatency, setMeasuredLatency] = useState<string | null>(null);

  const runLatencyTest = () => {
    setIsMeasuring(true);
    setMeasuredLatency(null);
    setTimeout(() => {
      setIsMeasuring(false);
      setMeasuredLatency((Math.random() * 0.15 + 0.18).toFixed(3) + " ms");
    }, 1200);
  };

  const explainTabs: { id: ExplainTab; label: string; icon: LucideIcon }[] = [
    { id: "routing", label: "Adaptive routing", icon: Workflow },
    { id: "tee", label: "Secure enclaves (TEE)", icon: Lock },
    { id: "ledger", label: "Micro-ledger settlement", icon: Database },
  ];

  const gpuOrder: GpuId[] = ["h100", "a100", "l40s", "cpu"];

  const gpuSpecs: Record<GpuId, GpuSpec> = {
    h100: {
      shortLabel: "NVIDIA H100",
      name: "NVIDIA H100 Tensor Core",
      vram: "80GB SXM5",
      payoutRate: "$1.45 / hr",
      routingShare: "92% of routing traffic",
      attestation: "Intel TDX hardware identity key",
      optimalTask: "LLM fine-tuning and high-throughput batch inference",
    },
    a100: {
      shortLabel: "NVIDIA A100",
      name: "NVIDIA A100 Standard PCIe",
      vram: "40GB / 80GB HBM2",
      payoutRate: "$0.84 / hr",
      routingShare: "78% of routing traffic",
      attestation: "AMD SEV-SNP platform attestation token",
      optimalTask: "Vision-language routing and audio processing",
    },
    l40s: {
      shortLabel: "L40S cluster",
      name: "NVIDIA L40S Global Core",
      vram: "48GB GDDR6",
      payoutRate: "$0.68 / hr",
      routingShare: "84% of routing traffic",
      attestation: "Secure Enclave Module v4",
      optimalTask: "Distributed caching and high-density webhook forwarding",
    },
    cpu: {
      shortLabel: "Xeon / EPYC",
      name: "Xeon Gold Host Multi-Thread",
      vram: "256GB CPU cache proxy",
      payoutRate: "$0.18 / hr",
      routingShare: "25% of routing traffic",
      attestation: "TPM 2.0 chip signature",
      optimalTask:
        "Micro-API relaying, low-frequency IPFS caching, metadata registries",
    },
  };

  const activeGpu = gpuSpecs[selectedGpu];

  return (
    <div className="w-full flex flex-col text-left">
      {/* Product Hero */}
      <section className="pt-16 pb-12 px-6 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl">
          <span className="font-label-caps text-brand-green mb-4 tracking-widest block bg-brand-green-bg/20 self-start px-2.5 py-1 rounded-full text-[10px] w-fit">
            HOW THE PROTOCOL WORKS
          </span>
          <h1 className="font-display-lg text-brand-dark tracking-tighter leading-[1.08] mb-6">
            The low-latency routing{" "}
            <span className="text-brand-green-light block italic font-medium mt-1">
              layer for global compute.
            </span>
          </h1>
          <p className="font-body-lg text-brand-gray max-w-2xl mb-6 leading-relaxed">
            Physical machines become one fluid routing network. Secure
            enclaves verify the integrity of every node, and Solana settles
            payouts in real time — down to the fraction of a cent.
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-light-beige text-[11px] font-mono text-brand-gray">
              <Activity size={12} className="text-brand-green" />
              0.14 µs median route lookup
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-light-beige text-[11px] font-mono text-brand-gray">
              <Lock size={12} className="text-brand-green" />
              SGX & SEV-SNP enclaves
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-light-beige text-[11px] font-mono text-brand-gray">
              <Database size={12} className="text-brand-green" />
              Settled on Solana
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Core Explainer Tabs */}
      <section className="py-16 px-6 bg-brand-cream/60 border-y border-brand-light-beige/30 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12 border-b border-brand-light-beige/40 pb-6">
            <div>
              <p className="font-label-caps text-brand-gray tracking-wider text-[11px] mb-2">
                THREE SYSTEMS, ONE PIPELINE
              </p>
              <h2 className="font-display-md text-brand-dark tracking-tight">
                What happens on every request
              </h2>
            </div>

            {/* Nav tabs */}
            <div className="flex flex-wrap gap-2">
              {explainTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.id === activeExplainTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveExplainTab(tab.id)}
                    className={`font-label-caps text-[11px] tracking-wider px-4 py-3 rounded-lg border flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? "bg-brand-green text-white border-brand-green"
                        : "border-brand-light-beige hover:border-brand-gray/50 text-brand-dark bg-white"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual simulation column (Left component/diagram) */}
            <div className="lg:col-span-5 bg-white border border-brand-light-beige rounded-[24px] p-6 h-[400px] flex flex-col justify-between relative overflow-hidden shadow-sm">
              <div className="flex justify-between items-center text-xs font-mono text-brand-gray border-b border-brand-cream pb-3 select-none">
                <span className="font-label-caps text-[10px] flex items-center gap-1.5">
                  <Activity
                    size={12}
                    className="text-brand-green animate-pulse motion-reduce:animate-none"
                  />{" "}
                  SIMULATION DECK
                </span>
                <span className="text-[10px] uppercase font-bold text-brand-green-light">
                  Enclave status: PASS
                </span>
              </div>

              <div className="flex-grow flex items-center justify-center relative">
                {activeExplainTab === "routing" && (
                  <div className="w-full flex flex-col items-center gap-8">
                    {/* Routing Diagram Visualizer */}
                    <div className="flex items-center gap-12 relative w-full justify-center">
                      <div className="w-14 h-14 bg-brand-cream border border-brand-light-beige text-brand-dark font-mono rounded-xl flex flex-col items-center justify-center text-xs shadow-sm">
                        <Cpu size={18} className="text-brand-green" />
                        <span className="text-[8px] mt-1">A100</span>
                      </div>
                      <div className="h-[1px] border-b border-dashed border-brand-green/45 w-16 relative">
                        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-brand-green animate-[ping_2s_infinite] motion-reduce:animate-none" />
                      </div>
                      <div className="w-16 h-16 bg-brand-green text-white rounded-full flex flex-col items-center justify-center shadow-lg">
                        <RefreshCw
                          size={18}
                          className="animate-spin motion-reduce:animate-none"
                          style={{ animationDuration: "12s" }}
                        />
                        <span className="text-[7px] font-bold mt-1">PROXY</span>
                      </div>
                      <div className="h-[1px] border-b border-dashed border-brand-green/45 w-16 relative">
                        <span className="absolute -top-1.5 left-1/3 -translate-x-1/2 w-3 h-3 rounded-full bg-brand-green-light animate-pulse motion-reduce:animate-none" />
                      </div>
                      <div className="w-14 h-14 bg-brand-cream border border-brand-light-beige text-brand-dark font-mono rounded-xl flex flex-col items-center justify-center text-xs shadow-sm">
                        <Server size={18} className="text-brand-green-light" />
                        <span className="text-[8px] mt-1">CLIENT</span>
                      </div>
                    </div>
                    <div className="text-center font-mono text-[10px] text-zinc-500 bg-brand-cream px-3 py-1.5 rounded-lg border border-brand-light-beige/30 w-fit">
                      MULTIPATH LOAD BALANCER ONLINE
                    </div>
                  </div>
                )}

                {activeExplainTab === "tee" && (
                  <div className="w-full flex flex-col items-center gap-5">
                    {/* Ring Isolation Representation */}
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border border-dashed border-brand-green/40 animate-[spin_40s_linear_infinite] motion-reduce:animate-none" />
                      <div className="absolute inset-3 rounded-full border border-brand-green-bg/65 flex items-center justify-center" />
                      <div className="w-20 h-20 bg-brand-green text-white rounded-full flex flex-col items-center justify-center shadow-md relative z-10">
                        <Lock size={24} />
                        <span className="text-[8px] font-label-caps mt-1 tracking-wider">
                          SECURE TEE
                        </span>
                      </div>
                    </div>
                    <p className="font-mono text-[10px] text-brand-green bg-brand-green-bg/20 px-3 py-1 rounded uppercase tracking-wider font-semibold">
                      Handshake verified
                    </p>
                  </div>
                )}

                {activeExplainTab === "ledger" && (
                  <div className="w-full flex flex-col items-center gap-4">
                    {/* Ledger/Rewards representation */}
                    <div className="h-40 w-full overflow-hidden flex flex-col justify-end gap-2.5 font-mono text-[10px] text-zinc-400 select-none">
                      <div className="flex justify-between items-center bg-brand-cream p-2 border border-brand-light-beige/30 rounded-lg text-brand-dark">
                        <span>TX-88091 · settled</span>
                        <span className="text-brand-green font-bold text-xs">
                          +$0.145
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-brand-cream/60 p-2 border border-brand-light-beige/30 rounded-lg text-brand-gray">
                        <span>TX-88090 · settled</span>
                        <span className="text-zinc-600 font-bold text-xs">
                          +$0.081
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-brand-cream/20 p-2 border border-brand-light-beige/10 rounded-lg text-zinc-400">
                        <span>TX-88089 · settled</span>
                        <span className="text-zinc-500 font-bold text-xs">
                          +$0.940
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-label-caps text-brand-gray tracking-wider uppercase font-semibold">
                      Payouts settle continuously, in fractions of a cent
                    </span>
                  </div>
                )}
              </div>

              {/* Status footer for simulated console */}
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-white/5 flex justify-between items-center text-[10px] font-mono text-zinc-400">
                <span>METRICS STREAM: STABLE</span>
                <span className="text-brand-green-bg">SPEED: 0.14 µs</span>
              </div>
            </div>

            {/* Column 2 (Detailed specifications text) */}
            <div className="lg:col-span-7 text-left space-y-6">
              <AnimatePresence mode="wait">
                {activeExplainTab === "routing" && (
                  <motion.div
                    key="routing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <h3 className="font-headline-lg text-brand-dark">
                      Adaptive global routing
                    </h3>
                    <p className="font-body-md text-brand-gray leading-relaxed">
                      Idle machines around the world register their spare
                      capacity with our indexer. The moment a request comes
                      in — from an AI agent, an API relay, anything — the
                      daemon finds the nearest compliant node and opens a
                      secure tunnel to it.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white border border-brand-light-beige/40 rounded-xl">
                        <span className="font-mono text-xs text-brand-green font-bold block mb-1">
                          0.14 µs
                        </span>
                        <p className="font-body-sm text-brand-dark text-[13px] leading-tight">
                          Median lookup time across the global indexer.
                        </p>
                      </div>
                      <div className="p-4 bg-white border border-brand-light-beige/40 rounded-xl">
                        <span className="font-mono text-xs text-brand-green font-bold block mb-1">
                          Multi-channel
                        </span>
                        <p className="font-body-sm text-brand-dark text-[13px] leading-tight">
                          Traffic reroutes automatically if a path gets
                          congested.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeExplainTab === "tee" && (
                  <motion.div
                    key="tee"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <h3 className="font-headline-lg text-brand-dark">
                      Confidential computing enclaves
                    </h3>
                    <p className="font-body-md text-brand-gray leading-relaxed">
                      We don't ask you to trust the host — we make trust
                      unnecessary. Code runs inside hardware-isolated{" "}
                      <strong>Trusted Execution Environments</strong>, using
                      AMD SEV-SNP and Intel SGX. The host's own operating
                      system and administrators are locked out of that
                      boundary entirely.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white border border-brand-light-beige/40 rounded-xl">
                        <span className="font-mono text-xs text-brand-green font-bold block mb-1">
                          Hardware-locked
                        </span>
                        <p className="font-body-sm text-brand-dark text-[13px] leading-tight">
                          No way to view memory buffers from the host
                          console.
                        </p>
                      </div>
                      <div className="p-4 bg-white border border-brand-light-beige/40 rounded-xl">
                        <span className="font-mono text-xs text-brand-green font-bold block mb-1">
                          Signed attestations
                        </span>
                        <p className="font-body-sm text-brand-dark text-[13px] leading-tight">
                          Cryptographic certificates verified automatically
                          at boot.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeExplainTab === "ledger" && (
                  <motion.div
                    key="ledger"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <h3 className="font-headline-lg text-brand-dark">
                      A micropayment engine, not an invoice
                    </h3>
                    <p className="font-body-md text-brand-gray leading-relaxed">
                      Every routed task settles on our Solana-integrated
                      transaction layer as it happens. Hosts get paid per
                      token processed, per megabyte moved, per step verified
                      — no monthly billing cycle, just a steady stream of
                      small payouts.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white border border-brand-light-beige/40 rounded-xl">
                        <span className="font-mono text-xs text-brand-green font-bold block mb-1">
                          Non-custodial
                        </span>
                        <p className="font-body-sm text-brand-dark text-[13px] leading-tight">
                          Payouts land directly in your own wallet, not a
                          holding account.
                        </p>
                      </div>
                      <div className="p-4 bg-white border border-brand-light-beige/40 rounded-xl">
                        <span className="font-mono text-xs text-brand-green font-bold block mb-1">
                          $0.0001 unit
                        </span>
                        <p className="font-body-sm text-brand-dark text-[13px] leading-tight">
                          You're paid to the decimal for what you actually
                          deliver.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Node Matrix Layout */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Text Col */}
          <div className="lg:col-span-4 space-y-6">
            <span className="font-label-caps text-brand-green font-semibold tracking-wider text-[11px] block text-left">
              HARDWARE DIRECTORY
            </span>
            <h2 className="font-display-md text-brand-dark tracking-tight">
              Pick a node class, see the specs
            </h2>
            <p className="font-body-md text-brand-gray leading-relaxed">
              Every node class is certified for stable throughput. Browse the
              standard specs, or run a quick latency check below.
            </p>

            {/* Interactive IP Client Tester Panel */}
            <div className="mt-8 p-6 bg-brand-cream border border-brand-light-beige rounded-2xl flex flex-col gap-4 text-left">
              <div>
                <span className="font-label-caps text-zinc-400 text-[10px] block mb-1.5 font-bold tracking-wider">
                  ROUTE LATENCY CHECK
                </span>
                <p className="text-[12px] text-brand-dark leading-snug">
                  Enter an IP to estimate the peer-to-peer route time to your
                  nearest node.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={testNodeIp}
                  onChange={(e) => setTestNodeIp(e.target.value)}
                  className="font-mono text-xs p-2.5 bg-white border border-brand-light-beige rounded-lg focus:outline-none focus:border-brand-green flex-grow"
                  placeholder="e.g. 192.168.1.1"
                />
                <button
                  type="button"
                  onClick={runLatencyTest}
                  disabled={isMeasuring}
                  className="px-4 py-2 bg-brand-green text-white font-label-caps text-[11px] rounded-lg tracking-wider font-semibold hover:bg-brand-green-light active:scale-95 transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isMeasuring ? "PINGING…" : "TEST ROUTE"}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {measuredLatency && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3.5 bg-brand-green-bg/25 border border-brand-green-bg/40 text-brand-green text-[12px] font-mono rounded-lg flex items-center gap-2"
                  >
                    <Check size={14} className="shrink-0" />
                    <span>
                      Route verified in <strong>{measuredLatency}</strong>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Matrix selection & Speclist view */}
          <div className="lg:col-span-8 bg-white border border-brand-light-beige rounded-[32px] p-8 shadow-sm flex flex-col text-left">
            <div className="flex flex-wrap gap-2.5 border-b border-brand-light-beige/45 pb-6 mb-8 select-none">
              {gpuOrder.map((id) => {
                const isActive = id === selectedGpu;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedGpu(id)}
                    className={`px-4.5 py-2 rounded-xl transition-all font-body-sm font-semibold border ${
                      isActive
                        ? "bg-brand-green text-white border-brand-green shadow-sm scale-[1.02]"
                        : "bg-brand-cream border-brand-light-beige hover:border-brand-gray text-brand-dark"
                    }`}
                  >
                    {gpuSpecs[id].shortLabel}
                  </button>
                );
              })}
            </div>

            {/* Speclist block details */}
            <div className="space-y-6">
              <div>
                <p className="font-label-caps text-brand-green tracking-wider text-[11px] mb-1 font-bold">
                  NODE SPEC SHEET
                </p>
                <h3 className="font-display font-medium text-[26px] text-brand-dark">
                  {activeGpu.name}
                </h3>
              </div>

              <div className="border-t border-brand-cream divide-y divide-brand-cream">
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-xs text-brand-gray font-sans uppercase tracking-wider">
                    Memory
                  </span>
                  <p className="font-body-md font-semibold text-brand-dark text-sm">
                    {activeGpu.vram}
                  </p>
                </div>
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-xs text-brand-gray font-sans uppercase tracking-wider">
                    Estimated base yield
                  </span>
                  <p className="font-body-md font-bold text-brand-green text-sm">
                    {activeGpu.payoutRate}
                  </p>
                </div>
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-xs text-brand-gray font-sans uppercase tracking-wider">
                    Routing share
                  </span>
                  <p className="font-body-md font-semibold text-zinc-700 text-sm">
                    {activeGpu.routingShare}
                  </p>
                </div>
                <div className="flex items-center justify-between py-3.5 gap-6">
                  <span className="text-xs text-brand-gray font-sans uppercase tracking-wider shrink-0">
                    Attestation key
                  </span>
                  <code className="text-[11px] block bg-brand-cream p-1.5 rounded font-mono text-zinc-600 border border-brand-light-beige/30 text-right">
                    {activeGpu.attestation}
                  </code>
                </div>
              </div>

              <div className="p-4 bg-brand-cream border border-brand-light-beige/35 rounded-xl text-left mt-2 flex gap-3 text-xs leading-normal text-brand-gray">
                <Info size={16} className="text-brand-green shrink-0 mt-0.5" />
                <p>
                  <strong>Best suited for:</strong> {activeGpu.optimalTask}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Feature Layout */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-brand-light-beige/30">
        <div className="max-w-xl mx-auto text-center mb-16">
          <h2 className="font-display-md text-brand-dark mb-4 tracking-tight leading-none">
            Built to stay up, stay sealed
          </h2>
          <p className="font-body-lg text-brand-gray">
            Every layer is designed for resilience, isolation, and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-cream/60 border border-brand-light-beige/30 p-8 rounded-2xl text-left space-y-4">
            <div className="p-3 bg-white w-fit rounded-xl border border-brand-light-beige/20 text-brand-green">
              <Zap size={22} />
            </div>
            <h4 className="font-display font-medium text-xl text-brand-dark">
              Dynamic failover
            </h4>
            <p className="font-body-sm text-brand-gray text-[13px] leading-relaxed">
              If a node's latency climbs past 20ms or its uptime slips, the
              protocol hot-swaps it out and reroutes traffic to a healthy
              backup — mid-stream, without a dropped request.
            </p>
          </div>

          <div className="bg-brand-cream/60 border border-brand-light-beige/30 p-8 rounded-2xl text-left space-y-4">
            <div className="p-3 bg-white w-fit rounded-xl border border-brand-light-beige/20 text-brand-green">
              <ShieldCheck size={22} />
            </div>
            <h4 className="font-display font-medium text-xl text-brand-dark">
              Intel SGX / AMD SEV enclaves
            </h4>
            <p className="font-body-sm text-brand-gray text-[13px] leading-relaxed">
              Workloads run inside encrypted memory. Not even a host's own
              administrators can see the tensors, API payloads, or code
              running inside it.
            </p>
          </div>

          <div className="bg-brand-cream/60 border border-brand-light-beige/30 p-8 rounded-2xl text-left space-y-4">
            <div className="p-3 bg-white w-fit rounded-xl border border-brand-light-beige/20 text-brand-green">
              <Layers size={22} />
            </div>
            <h4 className="font-display font-medium text-xl text-brand-dark">
              Solana settlement
            </h4>
            <p className="font-body-sm text-brand-gray text-[13px] leading-relaxed">
              No invoices, no billing desk. Every routed task pays out to
              your wallet in real time, as it's completed.
            </p>
          </div>
        </div>
      </section>

      {/* Final Action Module Banner */}
      <section className="py-20 bg-brand-green text-white w-full rounded-3xl max-w-7xl mx-auto px-6 mb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="max-w-2xl text-left relative z-10 space-y-6">
          <h2 className="font-display-md leading-none text-white tracking-tight">
            Ready to plug in your hardware?
          </h2>
          <p className="text-white/80 font-body-md text-[15px] leading-relaxed">
            Deploy the lightweight daemon container — the handshake takes
            under three minutes, and your node starts earning from the first
            task it routes.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={onStartEarning}
              className="px-6 py-4.5 bg-brand-dark text-white font-label-caps text-[11px] font-semibold border-none rounded-lg tracking-wider hover:bg-black hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
            >
              CONNECT A NODE
            </button>
            <button
              type="button"
              onClick={onNavigateToDocs}
              className="px-6 py-4.5 border border-white hover:bg-white/10 font-label-caps text-[11px] rounded-lg tracking-wider transition-all duration-300 cursor-pointer"
            >
              READ THE PROTOCOL MANUAL
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}