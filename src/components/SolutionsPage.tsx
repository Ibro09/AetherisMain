import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu,
  Globe,
  Database,
  ShieldCheck,
  Check,
  Activity,
  Sparkles,
  Award,
  type LucideIcon,
} from "lucide-react";

type IndustryId = "ai_agents" | "depin" | "api_relays" | "enterprise";

type Industry = {
  navLabel: string;
  navDesc: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  security: string;
  latencyMs: number;
  savingsPct: number;
  savingsLabel: string;
  nodesNeeded: string;
};

const LATENCY_CEILING_MS = 1;

export default function SolutionsPage({
  onStartEarning,
}: {
  onStartEarning: () => void;
}) {
  // Solutions tabs
  const [selectedIndustry, setSelectedIndustry] =
    useState<IndustryId>("ai_agents");

  // Dynamic case study metrics slider
  const [channelsQuantity, setChannelsQuantity] = useState<number>(18);

  const calculatedStats = useMemo(() => {
    return {
      throughput: (channelsQuantity * 12.4).toFixed(1) + " MB/s",
      reliability: (99.94 + channelsQuantity * 0.001).toFixed(3) + "%",
      solanaTrans: Math.floor(channelsQuantity * 144) + " tx / sec",
      estimatedSavings:
        "$" + (channelsQuantity * 120).toLocaleString() + " / yr",
    };
  }, [channelsQuantity]);

  const industries: Record<IndustryId, Industry> = {
    ai_agents: {
      navLabel: "AI Agent Orchestrators",
      navDesc: "Hosting for always-on autonomous agents",
      icon: Sparkles,
      title: "AI Agent Orchestrators",
      subtitle: "Hosting built for agents that can't afford downtime.",
      description:
        "Long-running agents can't tolerate leaked state or a machine going dark mid-task. Every session runs inside an Intel SGX enclave, so credentials and intermediate reasoning stay sealed off from the underlying host — including from us.",
      security: "SGX-attested memory",
      latencyMs: 0.24,
      savingsPct: 54,
      savingsLabel: "lower node cost",
      nodesNeeded: "NVIDIA H100 — Agent Host Runner",
    },
    depin: {
      navLabel: "DePIN Grids",
      navDesc: "Pool hardware without owning a data center",
      icon: Cpu,
      title: "Decentralized Physical Networks",
      subtitle: "Scale a compute grid without building a server farm.",
      description:
        "DePIN teams need to pool hardware across regions without owning any of it. We act as the routing layer — indexing available chips, matching jobs to the nearest verified node, and settling payouts automatically. No upfront hardware spend.",
      security: "AMD SEV isolation verified",
      latencyMs: 0.45,
      savingsPct: 70,
      savingsLabel: "no hardware capex",
      nodesNeeded: "NVIDIA A100 — Storage & Block Nodes",
    },
    api_relays: {
      navLabel: "Global API Relays",
      navDesc: "Edge caching and low-latency proxying",
      icon: Globe,
      title: "Global API Providers",
      subtitle: "Edge caching and routing for high-traffic APIs.",
      description:
        "Repeated round-trips to a single origin server waste cycles and add latency. We cache webhook payloads at the edge, verify requests inside secure enclaves, and settle payment per call, in fractions of a cent.",
      security: "TLS-secured tunnels",
      latencyMs: 0.19,
      savingsPct: 42,
      savingsLabel: "less network congestion",
      nodesNeeded: "Xeon Gold — REST Router Host",
    },
    enterprise: {
      navLabel: "Enterprise Data Systems",
      navDesc: "Compliant pipelines for regulated data",
      icon: Database,
      title: "Institutional Data Systems",
      subtitle: "Enterprise analytics built for strict compliance.",
      description:
        "Regulated data can't share infrastructure with anything else. Our enclave boundaries keep institutional workloads isolated from every other tenant on the network, meeting SOC 2 requirements without giving up performance.",
      security: "Intel TDX certified",
      latencyMs: 0.85,
      savingsPct: 85,
      savingsLabel: "lower compliance overhead",
      nodesNeeded: "NVIDIA A100 — CPU Cache Proxy",
    },
  };

  const industryOrder: IndustryId[] = [
    "ai_agents",
    "depin",
    "api_relays",
    "enterprise",
  ];

  const active = industries[selectedIndustry];
  const latencyFill = Math.round(
    Math.max(0, Math.min(1, 1 - active.latencyMs / LATENCY_CEILING_MS)) * 100,
  );
  const savingsFill = Math.max(0, Math.min(100, active.savingsPct));

  return (
    <div className="w-full flex flex-col text-left">
      {/* Solutions Header */}
      <section className="pt-16 pb-10 px-6 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl">
          <span className="font-label-caps text-brand-green mb-4 tracking-widest block bg-brand-green-bg/20 self-start px-2.5 py-1 rounded-full text-[10px] w-fit">
            BUILT FOR YOUR WORKLOAD
          </span>
          <h1 className="font-display-lg text-brand-dark tracking-tighter leading-[1.08] mb-6">
            One secure network.{" "}
            <span className="text-brand-green-light block italic font-medium mt-1">
              Tuned for what each sector needs.
            </span>
          </h1>
          <p className="font-body-lg text-brand-gray max-w-2xl mb-8 leading-relaxed">
            From latency-sensitive AI agents to compliance-bound enterprise
            pipelines — the underlying rails are the same. What changes is
            which guarantees matter most to you. Pick a sector below to see
            the fit.
          </p>

          {/* Quick sector switcher */}
          <div className="flex flex-wrap gap-2">
            {industryOrder.map((id) => {
              const ind = industries[id];
              const Icon = ind.icon;
              const isActive = id === selectedIndustry;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setSelectedIndustry(id);
                    document
                      .getElementById("solution-detail")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-[12px] font-sans font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-brand-green border-brand-green text-white"
                      : "border-brand-light-beige text-brand-gray hover:border-brand-gray"
                  }`}
                >
                  <Icon size={13} />
                  {ind.navLabel}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Solutions Tab Grid */}
      <section
        id="solution-detail"
        className="py-16 bg-brand-cream/60 border-y border-brand-light-beige/30 w-full px-6 scroll-mt-6"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Nav menu Column (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-3 text-left">
              <span className="font-label-caps text-[10px] text-brand-gray block tracking-wider font-semibold mb-2">
                INDUSTRY ARCHITECTURES
              </span>
              {industryOrder.map((id) => {
                const ind = industries[id];
                const Icon = ind.icon;
                const isActive = id === selectedIndustry;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedIndustry(id)}
                    className={`p-4 rounded-xl border text-left flex items-start gap-4 transition-all cursor-pointer ${
                      isActive
                        ? "bg-white border-brand-green shadow-md text-brand-green scale-[1.01]"
                        : "border-brand-light-beige hover:border-brand-gray bg-white/40 text-brand-dark"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isActive
                          ? "bg-brand-green text-white"
                          : "bg-brand-cream text-brand-gray"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-body-sm font-semibold tracking-tight text-[14px] leading-snug">
                        {ind.navLabel}
                      </h4>
                      <p className="text-[11px] text-brand-gray leading-tight mt-0.5">
                        {ind.navDesc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Display detail Column (8 Cols) */}
            <div className="lg:col-span-8 bg-white border border-brand-light-beige rounded-[32px] p-8 shadow-sm text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndustry}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="font-label-caps text-brand-green tracking-wider text-[11px] mb-1 font-bold">
                      SECTOR FIT
                    </span>
                    <h3 className="font-display font-medium text-[28px] text-brand-dark leading-tight">
                      {active.title}
                    </h3>
                    <p className="font-sans italic text-sm text-brand-gray mt-1 font-medium select-none">
                      {active.subtitle}
                    </p>
                  </div>

                  <p className="font-body-md text-brand-gray leading-relaxed">
                    {active.description}
                  </p>

                  {/* Nodes Needed Badge */}
                  <div className="p-3.5 bg-brand-cream rounded-xl flex items-center gap-2 border border-brand-light-beige/35">
                    <Award size={15} className="text-brand-green shrink-0" />
                    <span className="text-xs text-brand-gray font-sans">
                      Typical node for this workload:{" "}
                      <strong>{active.nodesNeeded}</strong>
                    </span>
                  </div>

                  {/* Fit meters */}
                  <div className="space-y-4 border-t border-brand-cream pt-6 mt-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="uppercase font-bold tracking-wider text-brand-gray">
                          Proxied latency
                        </span>
                        <span className="font-mono text-brand-green font-bold">
                          {active.latencyMs.toFixed(2)} ms
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-brand-cream overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-brand-green"
                          initial={{ width: 0 }}
                          animate={{ width: `${latencyFill}%` }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="uppercase font-bold tracking-wider text-brand-gray">
                          Cost reduction
                        </span>
                        <span className="font-mono text-zinc-800 font-bold">
                          {active.savingsPct}% {active.savingsLabel}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-brand-cream overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-zinc-800"
                          initial={{ width: 0 }}
                          animate={{ width: `${savingsFill}%` }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <ShieldCheck size={14} className="text-brand-green shrink-0" />
                      <span className="text-[11px] text-brand-gray">
                        Secure boundary:{" "}
                        <span className="font-semibold text-brand-dark">
                          {active.security}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Route design visual vector overlay */}
                  <div className="bg-zinc-950 p-4 rounded-xl font-mono text-[11px] text-zinc-400 border border-white/5 space-y-1">
                    <div className="flex justify-between text-[10px] font-sans font-bold text-brand-green-bg border-b border-white/5 pb-1 select-none">
                      <span>PIPELINE CHECK</span>
                      <span>STATUS: ROUTING OK</span>
                    </div>
                    <p className="text-emerald-400">
                      $ protocol-solutions --industry={selectedIndustry} --check-peer
                    </p>
                    <p className="text-zinc-500">
                      ▶ Handshaking with a verified {active.nodesNeeded} enclave...
                    </p>
                    <p className="text-zinc-300">
                      ✔ Attestation confirmed. Latency established:{" "}
                      {active.latencyMs.toFixed(2)} ms
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Simulation & Live Performance Estimator */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="font-display-md text-brand-dark mb-4 tracking-tight leading-none">
            See what more channels buys you
          </h2>
          <p className="font-body-lg text-brand-gray">
            Drag the slider to add routing channels and watch throughput,
            reliability, and savings update live.
          </p>
        </div>

        <div className="bg-white border border-brand-light-beige/30 rounded-[32px] p-8 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Range Controller */}
            <div className="space-y-8 text-left">
              <div>
                <p className="font-label-caps text-brand-gray tracking-wider text-[11px] mb-1 font-bold">
                  CHANNEL COUNT
                </p>
                <h4 className="font-headline-md text-brand-dark">
                  How many secure paths do you need?
                </h4>
              </div>

              <div className="space-y-4">
                <input
                  type="range"
                  min="2"
                  max="120"
                  value={channelsQuantity}
                  onChange={(e) =>
                    setChannelsQuantity(parseInt(e.target.value, 10))
                  }
                  className="w-full h-2 bg-brand-cream accent-brand-green rounded-lg cursor-pointer focus:outline-none"
                />
                <div className="flex justify-between text-xs text-brand-gray font-medium font-sans">
                  <span>2 channels</span>
                  <span className="bg-brand-cream text-brand-green px-2.5 py-1 rounded border border-brand-light-beige/35 font-mono text-[11.5px] font-semibold">
                    {channelsQuantity} dedicated secure paths
                  </span>
                  <span>120 channels</span>
                </div>
              </div>

              <div className="p-4 bg-brand-cream/80 border border-brand-light-beige/25 rounded-xl flex gap-3 text-xs leading-normal text-brand-gray">
                <Activity
                  size={16}
                  className="text-brand-green shrink-0 mt-0.5"
                />
                <p>
                  <strong>At this range:</strong> load spreads across
                  multiple secure enclave clusters worldwide. More channels
                  means less congestion per path and a higher reliability
                  ceiling.
                </p>
              </div>
            </div>

            {/* Right Result visual list */}
            <div className="grid grid-cols-2 gap-6 text-left">
              <div className="bg-brand-cream/40 p-5 rounded-2xl border border-brand-light-beige/20 flex flex-col gap-1 hover:border-brand-green-bg/50 transition-colors">
                <span className="text-[10px] text-brand-gray uppercase font-bold tracking-wider">
                  THROUGHPUT
                </span>
                <span className="text-xl font-mono text-zinc-900 font-bold block mt-1">
                  {calculatedStats.throughput}
                </span>
                <span className="text-[11px] text-brand-gray italic font-medium leading-tight">
                  Across the pooled pipeline
                </span>
              </div>

              <div className="bg-brand-cream/40 p-5 rounded-2xl border border-brand-light-beige/20 flex flex-col gap-1 hover:border-brand-green-bg/50 transition-colors">
                <span className="text-[10px] text-brand-gray uppercase font-bold tracking-wider">
                  RELIABILITY
                </span>
                <span className="text-xl font-mono text-emerald-600 font-bold block mt-1">
                  {calculatedStats.reliability}
                </span>
                <span className="text-[11px] text-brand-gray italic font-medium leading-tight">
                  Target uptime SLA
                </span>
              </div>

              <div className="bg-brand-cream/40 p-5 rounded-2xl border border-brand-light-beige/20 flex flex-col gap-1 hover:border-brand-green-bg/50 transition-colors">
                <span className="text-[10px] text-brand-gray uppercase font-bold tracking-wider">
                  SETTLEMENT SPEED
                </span>
                <span className="text-xl font-mono text-zinc-900 font-bold block mt-1">
                  {calculatedStats.solanaTrans}
                </span>
                <span className="text-[11px] text-brand-gray italic font-medium leading-tight">
                  Micro-payouts on Solana
                </span>
              </div>

              <div className="bg-brand-cream/40 p-5 rounded-2xl border border-brand-light-beige/20 flex flex-col gap-1 hover:border-brand-green-bg/50 transition-colors">
                <span className="text-[10px] text-brand-gray uppercase font-bold tracking-wider">
                  EST. ANNUAL SAVINGS
                </span>
                <span className="text-xl font-mono text-brand-green font-bold block mt-1">
                  {calculatedStats.estimatedSavings}
                </span>
                <span className="text-[11px] text-brand-gray italic font-medium leading-tight">
                  Versus owned hardware
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Certification Module Block */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-brand-light-beige/30 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6">
            <span className="font-label-caps text-brand-green text-[11px] block text-left tracking-wider font-bold">
              SECURITY POSTURE
            </span>
            <h2 className="font-display-md text-brand-dark tracking-tight leading-none text-4xl lg:text-5xl">
              Compliance you don't have to take our word for.
            </h2>
            <p className="font-body-md text-brand-gray leading-relaxed max-w-2xl text-[15px]">
              Every node goes through an automated remote-attestation check
              the moment it boots. If a host fails a chip verification, key
              audit, or enclave check, its routing keys are revoked on-chain
              immediately — no manual review, no delay.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-2 items-start text-xs leading-relaxed text-zinc-700">
                <Check size={16} className="text-brand-green shrink-0 mt-0.5" />
                <span>
                  <strong>SOC 2-aligned isolation:</strong> no administrative
                  access crosses a memory boundary between tenants.
                </span>
              </div>
              <div className="flex gap-2 items-start text-xs leading-relaxed text-zinc-700">
                <Check size={16} className="text-brand-green shrink-0 mt-0.5" />
                <span>
                  <strong>Hardware identity on Solana:</strong> every node's
                  key pair is registered and verifiable, without exposing who
                  runs it.
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            {/* Standard Shield Badge mockup */}
            <div className="p-8 bg-brand-cream border border-brand-light-beige rounded-[24px] text-center w-64 shadow-md flex flex-col items-center gap-4 hover:scale-[1.02] transition-transform">
              <div className="p-4 bg-brand-green-bg/25 text-brand-green rounded-full">
                <ShieldCheck size={40} />
              </div>
              <div>
                <h4 className="font-display font-medium text-lg text-brand-dark">
                  TEE Isolated Stack
                </h4>
                <p className="text-[11px] text-brand-gray mt-1 leading-snug font-sans">
                  Remote hardware attestation, checked on every boot.
                </p>
              </div>
              <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-700 font-semibold px-2 py-1 rounded">
                AUDIT STATUS: VERIFIED
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}