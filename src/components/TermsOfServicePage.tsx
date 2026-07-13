import React, { useState, useMemo } from "react";
import {
  FileCheck,
  Search,
  ChevronRight,
  Settings,
  AlertTriangle,
  Coins,
  Cpu,
  ShieldAlert,
  Copy,
  Check,
  Mail,
  ArrowRight,
} from "lucide-react";

interface TermsSection {
  id: string;
  title: string;
  content: string;
  bullets?: string[];
}

export default function TermsOfServicePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [copiedText, setCopiedText] = useState(false);

  const sections: TermsSection[] = [
    {
      id: "agreement",
      title: "1. Acceptance of the Protocol Agreement",
      content:
        "These Terms of Service ('Terms', 'Agreement') govern your access, deployment, and operational integration of the Infrastructure Physical Routing Protocol ('the Protocol'). By committing a node to the decentralized ledger or leasing sandboxed compute slices, you agree to be bound by these legal rules. If you represent an institutional enterprise, you represent that you possess sufficient signature keys to bind your corporation to this state-machine agreement.",
      bullets: [
        "Cryptographic Confirmation: Any on-ledger staking actions constitute irrevocable digital execution of these coordinates.",
        "Version Updates: The protocol parameters are governed by autonomous validator pools. Subscribing to the grid implies automatic alignment with dynamic upgrades.",
      ],
    },
    {
      id: "operator-obligations",
      title: "2. Physical Node Host Operations & SLA Rules",
      content:
        "Node Operators registering hardware assets (vNodes) must maintain strict physical and digital isolation standards. Failing to meet these boundaries triggers automated penalties on-ledger.",
      bullets: [
        "Attestation Compliance: You agree to install mandatory BIOS TEE drivers. Rogue BIOS versions or spoofed attestation tokens will result in instantaneous quarantine.",
        "Uptime Benchmark: Operators are expected to maintain at least 98.0% availability across any rolling 72-hour period.",
        "No Packet Tampering: Modifying outgoing TLS payload packets automatically sets the trust score to level 0, locking accumulated settlement claims.",
      ],
    },
    {
      id: "slashing-staking",
      title: "3. Cryptographic Staking & Slashing Protocols",
      content:
        "To guarantee trustworthy performance across edge routes, operators must seed a structural pledge stake in the register ledger. This pledge serves as collateral against collusion or protocol exploitation.",
      bullets: [
        "Slashing Events: Double-routing packets, failure to provide valid ZKP execution reports, or malicious tampering triggers automated on-chain penalty liquidation ('slashing').",
        "Settle Periods: Earned operator yields are stored in pending state for 12 hours before becoming claims-eligible to protect the pool from transaction reversals.",
      ],
    },
    {
      id: "leasing-agreement",
      title: "4. Compute Leasing & Intellectual Property",
      content:
        "Enterprise clients leasing GPU slices, container pods, or edge API proxy blocks receive cryptographically-sealed runtime guarantees. You retain sole and exclusive ownership of all code, training parameters, and private dataset structures submitted to the enclaves.",
      bullets: [
        "No Reverse Engineering: Clients are prohibited from executing hardware side-channel timing loops inside leased compute segments to scan adjacent physical cores.",
        "Resource Fair Use: Compute limits (such as network egress limits) are strictly throttled according to your active tier agreement.",
      ],
    },
    {
      id: "liability-disclaimer",
      title: "5. Fully Autonomous State Machine & Disclaimer",
      content:
        "Because the Protocol is executed across a decentralized grid of physical hardware clusters, we offer no single corporate guarantee regarding runtime guarantees, data loss, or server-side microcode failures. The network is provided strictly 'as-is' and 'as-available'.",
      bullets: [
        "Hardware Risks: Microcode-level vulnerabilities (such as hypothetical new SGX leak vectors) are systemic hardware manufacturer incidents outside protocol control.",
        "Limit of Liability: We shall not be held liable for synthetic token rewards missed due to regional electric outages or operator system failures.",
      ],
    },
    {
      id: "arbitration",
      title: "6. Decentralized Coordination & Dispute Resolution",
      content:
        "Any conflicts arising from routing payouts, slashing calculations, or node status classifications are resolved inside the autonomous validation mechanisms of the Registry smart contract pool.",
      bullets: [
        "On-Chain Arbitration: Digital audit trails stored in verified ledger blocks are definitive, overriding external subjective verbal arguments.",
        "Governing Law: This digital agreement exists purely in the cloud region index layers and is governed globally by cryptographic deterministic axioms.",
      ],
    },
  ];

  const filteredSections = useMemo(() => {
    return sections.filter((sec) => {
      const matchesSearch =
        searchQuery === "" ||
        sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sec.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sec.bullets &&
          sec.bullets.some((b) =>
            b.toLowerCase().includes(searchQuery.toLowerCase()),
          ));

      if (activeTab === "all") return matchesSearch;
      if (
        activeTab === "operators" &&
        (sec.id === "operator-obligations" || sec.id === "slashing-staking")
      )
        return matchesSearch;
      if (
        activeTab === "leasing" &&
        (sec.id === "leasing-agreement" || sec.id === "liability-disclaimer")
      )
        return matchesSearch;

      return false;
    });
  }, [searchQuery, activeTab]);

  const handleCopyTerms = () => {
    const textToCopy =
      `AETHERIS PROTOCOL TERMS OF SERVICE\nLast Updated: May 31, 2026\n\n` +
      sections
        .map(
          (s) =>
            `${s.title}\n${s.content}\n${s.bullets ? s.bullets.map((b) => `- ${b}`).join("\n") : ""}`,
        )
        .join("\n\n");
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="w-full bg-brand-bg md:py-16 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-green/10 text-brand-green rounded-full border border-brand-green/10 font-label-caps text-[10px] tracking-wider font-semibold">
            <FileCheck size={12} />
            System SLA Coordinates
          </div>

          <h1 className="font-display-md text-brand-dark tracking-tight leading-none">
            Terms of Service
          </h1>

          <p className="font-body-md text-brand-gray text-[15px] max-w-2xl mx-auto">
            Governing staking compliance, hardware performance SLA requirements,
            smart contract penalties, and distributed physical compute lease
            agreements on the grid.
          </p>

          <div className="text-[11px] font-mono text-brand-gray flex justify-center items-center gap-2 pt-2">
            <span>Last Updated: May 31, 2026</span>
            <span className="text-zinc-300">•</span>
            <span>Version 5.2.0-Production</span>
          </div>
        </div>

        {/* Dynamic Filter Controls Row */}
        <div className="bg-white border border-brand-light-beige rounded-2xl p-5 mb-10 flex flex-col md:flex-row gap-5 justify-between items-center shadow-sm">
          {/* Tabs Filter */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {[
              { id: "all", label: "All Terms" },
              { id: "operators", label: "Node Hosting Rules" },
              { id: "leasing", label: "Client Compute Lease" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-label-caps rounded-xl transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "bg-brand-cream border border-brand-light-beige text-brand-gray hover:text-brand-dark"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar & Copy layout buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search rule clauses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-brand-cream border border-brand-light-beige rounded-xl text-xs text-brand-dark focus:outline-none focus:border-brand-green font-sans"
              />
              <Search
                size={13}
                className="absolute left-3.5 top-2.5 text-brand-gray"
              />
            </div>

            <button
              onClick={handleCopyTerms}
              className="px-4 py-2 bg-brand-cream border border-brand-light-beige text-brand-dark rounded-xl text-xs font-label-caps flex items-center gap-1.5 hover:bg-brand-light-beige/30 hover:border-brand-gray/30 transition-all cursor-pointer"
              title="Copy terms document text file"
            >
              {copiedText ? (
                <>
                  <Check size={12} className="text-brand-green" />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={12} />
                  Copy TXT
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left table of contents (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-brand-cream border border-brand-light-beige rounded-2xl p-6 space-y-5">
              <h3 className="font-display text-lg text-brand-dark font-medium border-b border-brand-light-beige/60 pb-3">
                Protocol Axioms
              </h3>

              <ul className="space-y-4">
                {[
                  {
                    icon: Cpu,
                    label: "Deterministic Hardware Attestation Check",
                  },
                  { icon: Coins, label: "On-Ledger Security Stake Collateral" },
                  {
                    icon: ShieldAlert,
                    label: "Automatic Anti-Tampering Penalisation",
                  },
                  { icon: Settings, label: "Dynamic Resource Quota Control" },
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 leading-snug">
                    <item.icon
                      className="text-brand-green shrink-0 mt-0.5"
                      size={16}
                    />
                    <span className="text-xs text-brand-gray font-sans">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-brand-light-beige/60">
                <p className="text-[11px] text-brand-gray leading-relaxed font-sans">
                  The Protocol runs deterministically inside sandboxed enclaves.
                  Every operation is authenticated via hardware key handshakes.
                  Tampering with routing paths triggers cryptographic penalties.
                </p>
              </div>
            </div>

            {/* Quick-Jump Section Navigator */}
            <div className="bg-white border border-brand-light-beige rounded-2xl p-6 font-sans">
              <span className="font-label-caps text-[10px] text-brand-green font-semibold tracking-wider block mb-4">
                SECTIONS LIST
              </span>
              <div className="space-y-2 flex flex-col">
                {sections.map((sec) => (
                  <a
                    href={`#${sec.id}`}
                    key={sec.id}
                    className="text-xs text-left text-brand-gray hover:text-brand-dark transition-all py-1.5 flex items-center justify-between group border-b border-brand-cream last:border-b-0"
                  >
                    <span className="truncate pr-2 font-mono">
                      {sec.title.split(".")[0]}. {sec.title.split(".")[1]}
                    </span>
                    <ChevronRight
                      size={11}
                      className="opacity-0 group-hover:opacity-100 transition-all text-brand-green"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right actual documents panel (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-brand-light-beige rounded-2xl p-6 md:p-10 space-y-8">
              {filteredSections.map((sec) => (
                <div
                  key={sec.id}
                  id={sec.id}
                  className="scroll-mt-24 space-y-4 pb-8 border-b border-brand-light-beige/40 last:border-b-0 last:pb-0"
                >
                  <h2 className="font-display text-xl md:text-2xl text-brand-dark font-medium hover:text-brand-green-light transition-colors">
                    {sec.title}
                  </h2>

                  <p className="font-sans text-brand-gray text-[13.5px] leading-relaxed">
                    {sec.content}
                  </p>

                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul className="space-y-2.5 pl-4 pt-1 border-l-2 border-brand-green/20">
                      {sec.bullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="text-xs text-brand-gray leading-normal list-none italic flex gap-2"
                        >
                          <span className="text-brand-green font-bold shrink-0">
                            ◇
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {filteredSections.length === 0 && (
                <div className="py-12 text-center text-brand-gray space-y-2">
                  <p className="font-sans text-xs">
                    No matching SLA coordinates found for "{searchQuery}".
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveTab("all");
                    }}
                    className="text-xs text-brand-green hover:underline uppercase font-bold tracking-wider"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>

            {/* Operator Support Card */}
            <div className="bg-brand-cream border border-brand-green/20 rounded-2xl p-8 hover:border-brand-green/45 transition-all text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green-bg/10 rounded-full blur-2xl transform translate-x-12 -translate-y-12" />

              <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={16} className="text-brand-green" />
                    <span className="text-[10px] font-label-caps text-brand-green font-semibold">
                      ARBITRATION DESK
                    </span>
                  </div>
                  <h4 className="font-display text-lg text-brand-dark">
                    Operator slashing issue or payout dispute?
                  </h4>
                  <p className="text-xs text-brand-gray max-w-xl">
                    Submit cryptographically signed performance logs for
                    verification. Our audit validators review disputes against
                    the state ledger records inside safe sandbox enclaves.
                  </p>
                </div>

                <a
                  href="mailto:protocol@aetheris.protocol"
                  className="px-5 py-2.5 bg-brand-green text-white font-label-caps text-[10px] rounded-xl flex items-center gap-2 hover:bg-brand-green-light transition-all shrink-0 cursor-pointer text-center"
                >
                  Operator Conduit
                  <ArrowRight size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
