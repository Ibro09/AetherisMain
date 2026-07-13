import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, 
  HelpCircle, 
  ArrowRight, 
  Coins, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Plus, 
  Percent, 
  Activity,
  Server
} from "lucide-react";

export default function PricingPage({ onStartEarning }: { onStartEarning: () => void }) {
  // Pricing mode - consumers (buy compute/bandwidth) vs providers (earn from compute/bandwidth)
  const [pricingMode, setPricingMode] = useState<"consumers" | "providers">("consumers");

  // Interactive micro-pricing calculator for consumer capacity pricing
  const [estimateTps, setEstimateTps] = useState<number>(15);

  const calculateCapacityBilling = () => {
    // Estimations on annual/monthly bills for consumers
    const baseUnitRate = 0.024; // dollars per 10k routing steps
    const monthlyCalls = estimateTps * 60 * 60 * 24 * 30; // total routing steps per month
    const billingRate = (monthlyCalls / 10000) * baseUnitRate;
    return {
      totalRoutingSteps: monthlyCalls.toLocaleString() + " / mo",
      estimatedRate: "$" + Math.max(15, Math.round(billingRate)).toLocaleString() + " / mo",
      discountRate: billingRate > 500 ? "15% High-bandwidth auto discount applied" : "Standard baseline rate active"
    };
  };

  const bilingResult = calculateCapacityBilling();

  const demandPlans = [
    {
      name: "Starter Router",
      price: "$0.05",
      unit: "per 10k routing steps",
      description: "Pay-as-you-go capacity. Ideal for testing AI agents, local caches, and webhook proxies.",
      features: [
        "Unrestricted regional routing hops",
        "Standard multi-path backup path access",
        "Access to NVIDIA A100 & L40S secure nodes",
        "API access to telemetry dashboards",
        "Community Discord support"
      ],
      popular: false,
      actionText: "Create Developer Account"
    },
    {
      name: "Scale Compute Pool",
      price: "$499",
      unit: "per month base + usage",
      description: "High performance. Sized for scaling AI agents, continuous proxy gateways, and storage nodes.",
      features: [
        "Everything in Starter plan, plus:",
        "Guaranteed low priority queue placement",
        "Prioritized NVIDIA H100 enclave access",
        "99.95% Network Routing SLA agreement",
        "Dedicated API key access configuration",
        "2 hr secure support response ticket time"
      ],
      popular: true,
      actionText: "Launch Scale Pool"
    },
    {
      name: "Institutional Edge Grid",
      price: "Custom",
      unit: "dedicated monthly agreements",
      description: "Enterprise grade. Absolute dedicated routing rows, bare-metal isolation, and custom SLAs.",
      features: [
        "Everything in Scale plan, plus:",
        "Fully dedicated bare-metal TEE enclaves",
        "Enterprise custom fail-safe structures",
        "99.999% Guaranteed Routing SLA agreement",
        "24/7 Phone and dedicated Slack engineer assistance",
        "Custom billing cycles and ledger integrations"
      ],
      popular: false,
      actionText: "Contact Sales Department"
    }
  ];

  const supplyPlans = [
    {
      name: "Sovereign Operator",
      price: "1.25%",
      unit: "protocol routing fee",
      description: "Standard node operator. Deploy inside a home rig, office server, or single machine.",
      features: [
        "Instant microtransaction Sol setup",
        "Support up to 95% Node uptime levels",
        "Automated remote attestation certificate",
        "Non-custodial treasury earnings pipeline",
        "Standard discord developer references"
      ],
      popular: false,
      actionText: "Deploy Operator Node"
    },
    {
      name: "Cluster Host Pool",
      price: "0.50%",
      unit: "protocol routing fee",
      description: "Ambitious providers. Perfect for office server rows, colocation rings, and dedicated racks.",
      features: [
        "Everything in Sovereign plan, plus:",
        "Uptime SLA target from 99.5% to 99.8%",
        "Direct access to high priority routing tasks",
        "Dedicated multi-node telemetry dashboard access",
        "Prioritized attestation queue verification",
        "Email developer support assistance"
      ],
      popular: true,
      actionText: "Link Racks & Pools"
    },
    {
      name: "Institutional Enclave Row",
      price: "0.05%",
      unit: "protocol routing fee",
      description: "High-grade capacity racks, institutional server rows, and compliant high-compute warehouses.",
      features: [
        "Everything in Cluster plan, plus:",
        "Standard SLA baseline above 99.99%",
        "Dedicated routing lines with customized queues",
        "Whiteglove setup audits from protocol core teams",
        "Custom billing/payout configurations on-chain",
        "Dedicated VIP priority hardware setup line"
      ],
      popular: false,
      actionText: "Audit Warehouse Rack"
    }
  ];

  return (
    <div className="w-full flex flex-col text-left">
      
      {/* Pricing Header */}
      <section className="pt-16 pb-12 px-6 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl">
          <span className="font-label-caps text-brand-green mb-4 tracking-widest block bg-brand-green-bg/20 self-start px-2.5 py-1 rounded-full text-[10px] w-fit">
            MEMBERSHIP & PLAN TIERS
          </span>
          <h1 className="font-display-lg text-brand-dark tracking-tighter leading-[1.08] mb-6">
            Transparent pricing. <span className="text-brand-green-light block italic font-medium mt-1">For buyers and providers.</span>
          </h1>
          <p className="font-body-lg text-brand-gray max-w-2xl mb-10 leading-relaxed">
            Choose whether to consume low-latency secure computer capacity (Demand-Side) or plug in spare computing machines to earn rewards verified directly on Sol blockchain (Supply-side).
          </p>
        </div>
      </section>

      {/* Selector Toggle */}
      <section className="py-6 px-6 w-full flex justify-center">
        <div className="bg-brand-cream border border-brand-light-beige rounded-2xl p-2 flex gap-1 select-none">
          <button
            onClick={() => setPricingMode("consumers")}
            className={`px-6 py-3 font-label-caps text-[11px] font-bold tracking-wider rounded-xl transition-all cursor-pointer ${
              pricingMode === "consumers"
              ? "bg-brand-green text-white shadow-sm"
              : "text-brand-gray hover:text-brand-dark"
            }`}
          >
            BUY CAPACITY (Demand Side)
          </button>
          <button
            onClick={() => setPricingMode("providers")}
            className={`px-6 py-3 font-label-caps text-[11px] font-bold tracking-wider rounded-xl transition-all cursor-pointer ${
              pricingMode === "providers"
              ? "bg-brand-green text-white shadow-sm"
              : "text-brand-gray hover:text-brand-dark"
            }`}
          >
            EARN REWARDS (Supply Side)
          </button>
        </div>
      </section>

      {/* Plans Pricing Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {(pricingMode === "consumers" ? demandPlans : supplyPlans).map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`flex flex-col bg-white border border-brand-light-beige rounded-[32px] p-8 min-h-[580px] shadow-sm justify-between hover:shadow-xl hover:scale-[1.01] transition-all duration-300 relative ${
                  plan.popular ? "ring-2 ring-brand-green ring-offset-4 ring-offset-[#f7f4ee]" : ""
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-green text-white font-label-caps text-[9px] font-bold tracking-wider px-3.5 py-1.5 rounded-full select-none shadow">
                    MOST DEPLOYED CHOICE
                  </span>
                )}

                <div className="space-y-6">
                  <div>
                    <h4 className="font-display font-medium text-2xl text-brand-dark">{plan.name}</h4>
                    <p className="font-body-sm text-brand-gray text-[12.5px] leading-relaxed mt-2">{plan.description}</p>
                  </div>

                  <div className="border-t border-brand-cream pt-6">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-mono text-3xl font-bold text-brand-dark tracking-tight">{plan.price}</span>
                      <span className="text-zinc-500 font-sans text-[12.5px] font-medium italic">{plan.unit}</span>
                    </div>
                  </div>

                  <div className="space-y-3.5 pt-4 text-left">
                    <span className="text-[10px] text-zinc-400 font-sans tracking-wider uppercase block select-none">FEATURES & CORE BOUNDARIES:</span>
                    <ul className="space-y-3 font-sans text-[13px] text-zinc-700">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex gap-2.5 items-start">
                          <Check size={14} className="text-brand-green shrink-0 mt-1" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8 border-t border-brand-cream mt-8">
                  <button
                    onClick={() => {
                      onStartEarning();
                    }}
                    className={`w-full py-4 rounded-xl font-label-caps text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 active:scale-98 cursor-pointer ${
                      plan.popular
                      ? "bg-brand-green text-white hover:bg-brand-green-light shadow-md"
                      : "border border-zinc-300 bg-white hover:bg-zinc-50 text-brand-dark"
                    }`}
                  >
                    {plan.actionText}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Interactive Pricing estimations Calculator */}
      <AnimatePresence>
        {pricingMode === "consumers" && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="py-16 px-6 bg-brand-cream/60 border-t border-brand-light-beige/30 w-full overflow-hidden"
          >
            <div className="max-w-7xl mx-auto w-full">
              <div className="bg-white border border-brand-light-beige rounded-[32px] p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  
                  {/* Calculator controls */}
                  <div className="space-y-8 text-left">
                    <div>
                      <p className="font-label-caps text-brand-green tracking-wider text-[11px] mb-1 font-bold">CAPACITY ESTIMATOR TOOL</p>
                      <h4 className="font-headline-md text-brand-dark">Input Your Expected Peak Traffic</h4>
                      <p className="text-[13px] text-brand-gray mt-1 leading-relaxed">Adjust expected micro-transactions speed per second inside peak API routes, calculating estimated monthly routing invoices.</p>
                    </div>

                    <div className="space-y-4">
                      <input
                        type="range"
                        min="1"
                        max="250"
                        value={estimateTps}
                        onChange={(e) => setEstimateTps(parseInt(e.target.value))}
                        className="w-full h-2 bg-brand-cream accent-brand-green rounded-lg cursor-pointer focus:outline-none"
                      />
                      <div className="flex justify-between text-xs text-brand-gray font-sans font-medium">
                        <span>1 Request / s</span>
                        <span className="bg-brand-cream text-brand-green px-2.5 py-1 rounded border border-brand-light-beige/35 font-mono text-[11.5px] font-semibold">
                          {estimateTps} Peak Actions / sec
                        </span>
                        <span>250 Requests / s</span>
                      </div>
                    </div>
                  </div>

                  {/* Calculator results */}
                  <div className="space-y-6 text-left">
                    <div className="p-6 bg-brand-cream border border-brand-light-beige rounded-2xl flex flex-col gap-1">
                      <span className="font-label-caps text-zinc-400 text-[10px] tracking-wider font-bold">TOTAL EXPECTED TRAFFIC HOPS</span>
                      <span className="text-2xl font-mono text-zinc-900 font-bold block mt-1">{bilingResult.totalRoutingSteps}</span>
                    </div>

                    <div className="p-6 bg-brand-green-bg/25 border border-brand-green-bg/40 text-brand-green rounded-2xl flex flex-col gap-1">
                      <span className="font-label-caps text-brand-green-light text-[10px] tracking-wider font-bold">ESTIMATED PROXIED BILL</span>
                      <h3 className="font-mono text-3xl font-bold tracking-tight mt-1 flex items-baseline gap-1.5 flex-wrap">
                        <span>{bilingResult.estimatedRate}</span>
                        <span className="text-[12.5px] font-sans font-medium text-brand-green-light">/ month base</span>
                      </h3>
                      <p className="text-[11px] leading-none text-brand-gray mt-2 font-medium italic select-none">{bilingResult.discountRate}</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* FAQ brief block column */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full border-t border-brand-light-beige/30">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="font-display-md text-brand-dark mb-4 tracking-tight leading-none text-3xl md:text-4xl">Common billing queries</h2>
          <p className="font-body-lg text-brand-gray">Everything operators and network clients need to discover.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          <div className="space-y-3 text-left">
            <h5 className="font-headline-md text-[18px] text-brand-dark leading-snug">Are payouts settled immediately on Solana?</h5>
            <p className="font-body-sm text-brand-gray leading-relaxed text-[13px]">
              Yes. Payouts settle almost instantly inside on-chain micro wallets. Since our transactions utilize state-of-the-art Solana microchannels, network gas fees are near-zero.
            </p>
          </div>

          <div className="space-y-3 text-left">
            <h5 className="font-headline-md text-[18px] text-brand-dark leading-snug">Is there a minimum commit period for demand scale pools?</h5>
            <p className="font-body-sm text-brand-gray leading-relaxed text-[13px]">
              No. Starter routers operates fully pay-as-you-go. Scale pools run monthly cycles, which you are free to pause or cancel instantly from client dashboard configurations.
            </p>
          </div>

          <div className="space-y-3 text-left">
            <h5 className="font-headline-md text-[18px] text-brand-dark leading-snug">How are physical hardware failures handled for operators?</h5>
            <p className="font-body-sm text-brand-gray leading-relaxed text-[13px]">
              If a host fails chip attestation or loses local power, traffic streams automatically route to nearest backup enclaves. Uptime logs calculate accurately down to standard minutes.
            </p>
          </div>

          <div className="space-y-3 text-left">
            <h5 className="font-headline-md text-[18px] text-brand-dark leading-snug">Are custom bare-metal configurations available?</h5>
            <p className="font-body-sm text-brand-gray leading-relaxed text-[13px]">
              Yes. Dedicated, private bare-metal configurations fall strictly within corporate SLA agreements. Reach out directly to our system planning engineers via enterprise department contacts.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
