import React, { useState, useMemo } from "react";
import {
  Shield,
  Search,
  ChevronRight,
  Lock,
  EyeOff,
  Database,
  FileText,
  HelpCircle,
  Copy,
  Check,
  Mail,
  ArrowRight,
} from "lucide-react";

interface PolicySection {
  id: string;
  title: string;
  content: string;
  bullets?: string[];
}

export default function PrivacyPolicyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [copiedText, setCopiedText] = useState(false);

  const sections: PolicySection[] = [
    {
      id: "scope",
      title: "1. Scope & Core Enclave Protocol Principles",
      content:
        "This Privacy Policy governs the decentralized physical infrastructure network ('the Protocol', 'Aetheris Protocol', 'we', 'our') and applies to all raw telemetry, node operator registration metadata, and cryptographically sealed execution enclaves. Unlike conventional centralized hosting networks, our protocol utilizes zero-knowledge (ZK) attestation and trusted execution environments (TEEs) such as Intel SGX and AMD SEV-SNP. This architecture inherently prevents unauthorized human operators, including our system administrators, from viewing inside active workloads.",
      bullets: [
        "Workload Confidentiality: All machine instructions submitted to GPU slices or CPU cache are encrypted in transit and isolated in hardware memory.",
        "Zero Trust Storage: State transition logs are sealed on-ledger using public key signatures, never exposed as plaintext in centralized index databases.",
        "Operator Isolation: Physical node host owners cannot inspect the state of the customer VM running on their microcode TEE enclaves.",
      ],
    },
    {
      id: "data-collection",
      title: "2. Information We Collect (And What We Never Can)",
      content:
        "We strictly limit data collection to the absolute absolute operational minimum required to maintain peer-to-peer routing safety, sybil-attack protection, and ledger payout calculations. If you are a Node Operator or Enterprise customer, we do not require your biometric data, personal financial bank details, or unencrypted web traffic.",
      bullets: [
        "Node Telemetry: Uptime metrics, network latency (ping), and hardware signature keys (e.g., SGX MRENCLAVE / MRSIGNER signature hashes) necessary for routing tier selection.",
        "Account Credentials: Standard email addresses and self-custodied wallet addresses for user login session states (valid for 30-day cookie-stored tokens).",
        "Usage Telemetry: Aggregated transaction count, block fees claimed, and timestamp metrics. We never collect the payload execution variables of your serverless scripts.",
      ],
    },
    {
      id: "enclave-confidentiality",
      title: "3. Cryptographic IP & Workload Integrity",
      content:
        "Through the use of secure routing channels and enclaved hardware, the content of any software container, LLM query, deep learning training batch, or secure financial database run on the Aetheris Protocol is protected by hardware-enforced private keys.",
      bullets: [
        "Decryption Keys: Encryption keys are generated inside the secure processor register files of the TEE and are never persistent on magnetic physical storage.",
        "Ephemerality: Run state memory isolates are dynamically cleared in raw silicon (RAM) immediately upon compute-slice completion.",
      ],
    },
    {
      id: "data-sharing",
      title: "4. Third-Party Routing & Global Compliance",
      content:
        "The Protocol operates on a public decentralized registry with globally distributed operators. While payment transactions are committed publicly to a cryptographic state machine, your source binaries are strictly routed via TLS 1.3 tunnels to authenticated TEE hosts. We do not sell, rent, or trade your telemetry to advertising networks or brokerages.",
      bullets: [
        "Government and Legal Requests: Because compute contents are sealed in cryptographic sandboxes, we lack the technical capability to decrypt or deliver raw execution payloads under subpoena.",
        "Indexer Network: Public node listings (such as location, capacity tier, and pricing profiles) are transparently distributed via gossip protocol to all network participants.",
      ],
    },
    {
      id: "cookies",
      title: "5. Cookies & Local Browser Session Persistence",
      content:
        "We reject invasive advertising tracking pixels. We only utilize local storage and functional browser cookies to identify your authenticated operator identity or custom dashboard preferences. These parameters do not track your activity on third-party domains.",
      bullets: [
        "Session Keys: Key-value parameters mapped locally to persist your 30-day operator session securely (e.g., 'infra_active_session').",
        "Operational State: Local cache containing your registered vNodes layout and diagnostic metrics to avoid state mismatch delays.",
      ],
    },
    {
      id: "security-measures",
      title: "6. Node-Level Protection & Penetration Auditing",
      content:
        "We commission quarterly third-party binary audits and secure-hardware penetration tests from tier-1 cyber engineering agencies. Despite physical access vectors, physical operators are mathematically banned from microcode side-channel execution by our runtime-level entropy filters.",
      bullets: [
        "Encrypted Backups: System session vaults are encrypted at rest with AES-256-GCM configurations.",
        "Rate-Limiting: Web endpoints enforce multi-tier token limits to mitigate distributed denial-of-service (DDoS) vectors.",
      ],
    },
    {
      id: "contact",
      title: "7. Contact Policy & Inquiries",
      content:
        "If you have questions regarding TEE attestation verification, zero-knowledge metadata pipelines, or wish to assert your data erasure rights under GDPR/CCPA framework protocols, reach out to our legal team via the contact conduit.",
      bullets: [
        "Email Support: legal@aetheris.protocol",
        "Public Handshake: Operators can submit cryptographically signed messages via the Discord legal routing channel.",
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
        activeTab === "enclaves" &&
        (sec.id === "scope" ||
          sec.id === "enclave-confidentiality" ||
          sec.id === "security-measures")
      )
        return matchesSearch;
      if (
        activeTab === "collection" &&
        (sec.id === "data-collection" || sec.id === "cookies")
      )
        return matchesSearch;
      if (
        activeTab === "routing" &&
        (sec.id === "data-sharing" || sec.id === "contact")
      )
        return matchesSearch;

      return false;
    });
  }, [searchQuery, activeTab]);

  const handleCopyPolicy = () => {
    const textToCopy =
      `AETHERIS PROTOCOL PRIVACY POLICY\nLast Updated: May 31, 2026\n\n` +
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
        {/* Decorative Badge and Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-green/10 text-brand-green rounded-full border border-brand-green/10 font-label-caps text-[10px] tracking-wider font-semibold">
            <Shield size={12} />
            May 2026 Policy Framework
          </div>

          <h1 className="font-display-md text-brand-dark tracking-tight leading-none">
            Privacy Policy
          </h1>

          <p className="font-body-md text-brand-gray text-[15px] max-w-2xl mx-auto">
            Governing zero-knowledge compute attestation, hardware enclaves,
            metadata minimizations, and physical operator security boundaries in
            the decentralized physical compute future.
          </p>

          <div className="text-[11px] font-mono text-brand-gray flex justify-center items-center gap-2 pt-2">
            <span>Last Updated: May 31, 2026</span>
            <span className="text-zinc-300">•</span>
            <span>Version 4.1.0-Release</span>
          </div>
        </div>

        {/* Dynamic Controls Row */}
        <div className="bg-white border border-brand-light-beige rounded-2xl p-5 mb-10 flex flex-col md:flex-row gap-5 justify-between items-center shadow-sm">
          {/* Tabs Filter */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {[
              { id: "all", label: "All Clauses" },
              { id: "enclaves", label: "Hardware & Enclaves" },
              { id: "collection", label: "Data Minimization" },
              { id: "routing", label: "Global Routing" },
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
                placeholder="Search legal clauses..."
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
              onClick={handleCopyPolicy}
              className="px-4 py-2 bg-brand-cream border border-brand-light-beige text-brand-dark rounded-xl text-xs font-label-caps flex items-center gap-1.5 hover:bg-brand-light-beige/30 hover:border-brand-gray/30 transition-all cursor-pointer"
              title="Copy clean policy text file"
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
                Overview & Summary
              </h3>

              <ul className="space-y-4">
                {[
                  {
                    icon: Shield,
                    label: "Cryptographically Minimized Collection",
                  },
                  { icon: Lock, label: "Intel SGX / AMD SEV Isolation" },
                  { icon: EyeOff, label: "Operator Exclusions" },
                  { icon: Database, label: "Deterministic Blockchain Logs" },
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
                  The Protocol mathematical primitives are designed so that we
                  do not have to ask for your absolute trust: we enforce
                  confidentiality in hardware registers. If you need dedicated
                  system support, open a secure legal ticket.
                </p>
              </div>
            </div>

            {/* Quick-Jump Section Navigator */}
            <div className="bg-white border border-brand-light-beige rounded-2xl p-6">
              <span className="font-label-caps text-[10px] text-brand-green font-semibold tracking-wider block mb-4">
                QUICK NAVIGATOR
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
                    No matching policy clauses found for "{searchQuery}".
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

            {/* Inquiries Callout Card */}
            <div className="bg-brand-cream border border-brand-green/20 rounded-2xl p-8 hover:border-brand-green/45 transition-all text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green-bg/10 rounded-full blur-2xl transform translate-x-12 -translate-y-12" />

              <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-brand-green" />
                    <span className="text-[10px] font-label-caps text-brand-green font-semibold">
                      LEGAL COMPLIANCE INQUIRIES
                    </span>
                  </div>
                  <h4 className="font-display text-lg text-brand-dark">
                    Need formal hardware security specifications?
                  </h4>
                  <p className="text-xs text-brand-gray max-w-xl">
                    Authorized hardware audit teams can request the official
                    cryptographic whitepaper containing physical enclave proof
                    standards.
                  </p>
                </div>

                <a
                  href="mailto:legal@aetheris.protocol"
                  className="px-5 py-2.5 bg-brand-green text-white font-label-caps text-[10px] rounded-xl flex items-center gap-2 hover:bg-brand-green-light transition-all shrink-0 cursor-pointer text-center"
                >
                  Contact Conduit
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
