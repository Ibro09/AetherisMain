import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal as TerminalIcon,
  Cpu,
  Code,
  Key,
  Play,
  Copy,
  Check,
  ArrowRight,
  ChevronRight,
  Layers,
  Settings,
  Activity,
  BookOpen,
  Database,
  FileText,
  Workflow,
  Sparkles,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Server,
} from "lucide-react";

export default function DevelopersPage({
  onNavigateToDocs,
  onStartEarning,
}: {
  onNavigateToDocs: () => void;
  onStartEarning: () => void;
}) {
  // Tabs for SDK code snippets
  const [activeSdkTab, setActiveSdkTab] = useState<"ts" | "py" | "rust" | "go">(
    "ts",
  );

  // API key generation state
  const [generatedKey, setGeneratedKey] = useState<string>("");
  const [keyCopied, setKeyCopied] = useState<boolean>(false);
  const [keyEnvironment, setKeyEnvironment] = useState<"mainnet" | "testnet">(
    "mainnet",
  );
  const [keyPermissions, setKeyPermissions] = useState<string>("read-write");
  const [isGeneratingKey, setIsGeneratingKey] = useState<boolean>(false);

  // API Playground state
  const [selectedEndpoint, setSelectedEndpoint] = useState<
    "get_node" | "calc_route" | "list_payouts"
  >("get_node");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playgroundParamId, setPlaygroundParamId] =
    useState<string>("INF-3011-XP");
  const [playgroundParamLimit, setPlaygroundParamLimit] = useState<number>(10);
  const [playgroundResponse, setPlaygroundResponse] = useState<any | null>(
    null,
  );

  // Copy status for commands/SDK codes
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(identifier);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleGenerateKey = () => {
    setIsGeneratingKey(true);
    setTimeout(() => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let res = "infra_live_";
      for (let i = 0; i < 32; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setGeneratedKey(res);
      setIsGeneratingKey(false);
    }, 900);
  };

  const handlePlaygroundRun = () => {
    setIsPlaying(true);
    setPlaygroundResponse(null);

    setTimeout(() => {
      setIsPlaying(false);
      if (selectedEndpoint === "get_node") {
        setPlaygroundResponse({
          status: "success",
          timestamp: new Date().toISOString(),
          node: {
            id: playgroundParamId,
            name: "Apex GPU Core Cluster",
            class: "NVIDIA-A100-SXM4",
            location: "United-Kingdom-London-02",
            latency_ms: 0.24,
            uptime_pct: 99.98,
            current_yield_usd: 1482.5,
            tee_attestation: {
              isolation: "Intel SGX Enclave",
              hardware_id_key: "0xec2f19a08e1bd882193b043aa9f91192da",
              status: "VERIFIED_PASS_REMOTE",
            },
          },
        });
      } else if (selectedEndpoint === "calc_route") {
        setPlaygroundResponse({
          status: "success",
          timestamp: new Date().toISOString(),
          routing_pathway: {
            hops: 3,
            selected_nodes: ["INF-3011-XP", "INF-9012-K", "LOCAL-PROXY-01"],
            aggregated_latency_ms: 1.14,
            payload_bytes_transferred: 8192,
            settlement_txn_sol: "4aW2jFpEunpZ69m7ySda...",
            incentive_rewards_usd: 0.145,
            security: "E2E TLS Tunnel over SGX Boundaries",
          },
        });
      } else {
        setPlaygroundResponse({
          status: "success",
          timestamp: new Date().toISOString(),
          payout_history: [
            {
              tx_id: "TX-4091",
              amount_usd: 0.62,
              node_id: "INF-3011-XP",
              timestamp: "2026-05-31T22:30:10Z",
            },
            {
              tx_id: "TX-4090",
              amount_usd: 0.11,
              node_id: "INF-9012-K",
              timestamp: "2026-05-31T22:28:44Z",
            },
            {
              tx_id: "TX-4089",
              amount_usd: 0.29,
              node_id: "INF-7724-Y",
              timestamp: "2026-05-31T22:25:01Z",
            },
          ].slice(0, playgroundParamLimit),
        });
      }
    }, 1100);
  };

  const sdkCodeSnippets = {
    ts: {
      lang: "TypeScript",
      install: "npm install @aetheris-protocol/sdk",
      code: `import { AetherisClient } from "@aetheris-protocol/sdk";\n\nconst client = new AetherisClient({\n  apiKey: "${generatedKey || "aetheris_live_live_key_88f912a20z"}",\n  environment: "${keyEnvironment}"\n});\n\n// Query secure node cluster status\nconst nodeRegistry = await client.nodes.retrieve("${playgroundParamId}");\nconsole.log(\`Node latency is \${nodeRegistry.latency_ms}ms\`);\n\n// Calculate secure path and execute task\nconst execution = await client.routes.dispatch({\n  payload: { model: "DeepSeek-R1-inference", tokens: 25000 },\n  targetIsolation: "hardware_tee_sgx"\n});\n\nconsole.log("Settlement Transaction Reference:", execution.settlement_txn_sol);`,
    },
    py: {
      lang: "Python",
      install: "pip install aetheris-protocol",
      code: `from aetheris_protocol import SecureClient\n\nclient = SecureClient(\n    api_key="${generatedKey || "aetheris_live_live_key_88f912a20z"}",\n    environment="${keyEnvironment}"\n)\n\n# Retrieve active enclave metrics\nnode_stats = client.nodes.get("${playgroundParamId}")\nprint(f"Node [ {node_stats.id} ] attestation: {node_stats.tee_attestation.isolation}")\n\n# Trigger multi-path confidential route calculation\nroute_job = client.routes.dispatch(\n    payload={"task": "agent_execution_loop", "complexity": "high"},\n    require_enclave=True\n)\n\nprint(f"Execution complete. Payout settled: {route_job.incentive_rewards_usd} USD")`,
    },
    rust: {
      lang: "Rust",
      install: "cargo add aetheris-protocol-sdk",
      code: `use aetheris_protocol_sdk::{Client, Config, Environment};\n\n#[tokio::main]\nasync fn main() -> Result<(), Box<dyn std::error::Error>> {\n    let config = Config::new(\n        "${generatedKey || "aetheris_live_live_key_88f912a20z"}",\n        Environment::${keyEnvironment === "mainnet" ? "Mainnet" : "Testnet"}\n    );\n    let client = Client::with_config(config)?;\n\n    // Fetch attested nodes from decentralized index\n    let node_details = client.nodes().retrieve("${playgroundParamId}").await?;\n    println!("Decentralized telemetry validated. Uptime: {}%", node_details.uptime_pct);\n\n    Ok(()\n}`,
    },
    go: {
      lang: "Go",
      install: "go get github.com/aetheris/protocol-go",
      code: `package main\n\nimport (\n\t"context"\n\t"fmt"\n\t"github.com/aetheris/protocol-go"\n)\n\nfunc main() {\n\tclient := protocol.NewClient(\n\t\t"${generatedKey || "aetheris_live_live_key_88f912a20z"}",\n\t\tprotocol.WithEnvironment("${keyEnvironment}"),\n\t)\n\n\t// Retrieve cryptographic attestation verification\n\tctx := context.Background()\n\tnode, _ := client.Nodes.Get(ctx, "${playgroundParamId}")\n\tfmt.Printf("Hardware Isolation Certification status: %s\\n", node.TeeAttestation.Status)\n}`,
    },
  };

  return (
    <div className="w-full flex flex-col text-left">
      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl">
          <span className="font-label-caps text-brand-green mb-4 tracking-widest block bg-brand-green-bg/20 self-start px-2.5 py-1 rounded-full text-[10px] w-fit">
            DEVELOPER OPERATIONS HUB
          </span>
          <h1 className="font-display-lg text-brand-dark tracking-tighter leading-[1.08] mb-6">
            Build on fully decentralized,{" "}
            <span className="text-brand-green-light block italic font-medium mt-1">
              hardware-secured compute.
            </span>
          </h1>
          <p className="font-body-lg text-brand-gray max-w-2xl mb-10 leading-relaxed">
            Provision secure micro-routing API credentials, integrate
            multi-language SDKs in standard web structures, and run real-time
            RPC attestation queries on our low-latency global network.
          </p>
        </div>
      </section>

      {/* API Key Provision Panel */}
      <section className="py-16 bg-brand-cream/60 border-y border-brand-light-beige/30 w-full px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Control Column (Key parameters) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="font-label-caps text-brand-gray tracking-wider text-[11px] mb-1 font-bold">
                  INTEGRATION CREDENTIALS
                </p>
                <h2 className="font-display-md text-brand-dark tracking-tight leading-none">
                  Generate API Credentials
                </h2>
                <p className="font-body-sm text-brand-gray mt-2 leading-relaxed">
                  Provision unique cryptographic keys linked directly to the
                  on-chain settlement network. Use credentials to sign TLS
                  routing packages or cache localized webhooks.
                </p>
              </div>

              {/* Controls and selections */}
              <div className="bg-white p-5 border border-brand-light-beige/60 rounded-2xl space-y-4">
                {/* Target Env */}
                <div>
                  <label className="font-label-caps text-[10px] uppercase text-brand-gray font-bold block mb-1.5">
                    NETWORK ENVIRONMENT
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["mainnet", "testnet"].map((env) => (
                      <button
                        key={env}
                        onClick={() => {
                          setKeyEnvironment(env as any);
                          setGeneratedKey(""); // reset when config changes to encourage regenerating
                        }}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                          keyEnvironment === env
                            ? "bg-brand-green text-white border-brand-green"
                            : "border-brand-light-beige text-brand-dark hover:border-brand-gray hover:bg-zinc-50"
                        }`}
                      >
                        {env}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scope Selection */}
                <div>
                  <label className="font-label-caps text-[10px] uppercase text-brand-gray font-bold block mb-1.5">
                    KEY WRITING SCOPE
                  </label>
                  <select
                    value={keyPermissions}
                    onChange={(e) => {
                      setKeyPermissions(e.target.value);
                      setGeneratedKey("");
                    }}
                    className="w-full bg-white border border-brand-light-beige/80 rounded-xl p-2.5 text-xs font-medium text-brand-dark focus:outline-none focus:border-brand-green"
                  >
                    <option value="read-write">
                      Full Execution (Admin Read + Route Dispatch)
                    </option>
                    <option value="read-only">
                      Telemetry Diagnostics Only (Read Metrics)
                    </option>
                    <option value="write-only">
                      Host Registration Dispatch (Write Nodes)
                    </option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateKey}
                  disabled={isGeneratingKey}
                  className="w-full py-3 bg-brand-green text-white hover:bg-brand-green-light font-label-caps text-[11px] font-semibold tracking-wider rounded-xl uppercase transition-all duration-300 active:scale-[0.98] cursor-pointer flex justify-center items-center gap-2"
                >
                  {isGeneratingKey ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>PROVISIONING...</span>
                    </>
                  ) : (
                    <>
                      <Key size={13} />
                      <span>PROVISION NEW API KEY</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Display Column (Key Output Card) */}
            <div className="lg:col-span-7 bg-white border border-brand-light-beige rounded-[32px] p-6 lg:p-8 shadow-sm text-left flex flex-col justify-between h-full min-h-[350px]">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-zinc-400 select-none pb-3 border-b border-brand-cream">
                  <span className="font-label-caps text-[10px] flex items-center gap-1">
                    <ShieldCheck size={12} className="text-brand-green" />{" "}
                    CRYPTOGRAPHIC HANDSHAKE
                  </span>
                  <span className="text-[10px] uppercase text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    Key Status: Valid
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-body-md font-semibold text-brand-dark">
                    Sovereign Authorization Token
                  </h4>
                  <p className="text-xs text-brand-gray leading-relaxed">
                    This secret key identifies your client process and signs
                    authorization loops with decentralized enclaves. Protect
                    this key as it settles payments directly to on-chain hosts.
                  </p>
                </div>

                {/* Key presentation */}
                <div className="p-4 bg-zinc-950 rounded-xl border border-white/5 space-y-2 text-left relative overflow-hidden group">
                  <span className="text-[10px] text-zinc-500 font-label-caps tracking-wider block uppercase select-none">
                    API ACCESS KEY TOKEN
                  </span>
                  <div className="flex items-center justify-between gap-4 font-mono text-xs text-emerald-400 overflow-x-auto select-all">
                    <code>
                      {generatedKey ||
                        "••••••••••••••••••••••••••••••••••••••••"}
                    </code>
                    {generatedKey && (
                      <button
                        onClick={() => handleCopy(generatedKey, "apiKey")}
                        className="p-1 px-2.5 bg-zinc-900 border border-zinc-850 text-zinc-400 rounded-lg text-[10px] hover:text-white hover:border-zinc-700 transition-all font-sans flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        {copiedIndex === "apiKey" ? (
                          <>
                            <Check size={11} className="text-emerald-500" />
                            <span className="text-emerald-500 font-bold">
                              COPIED
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>COPY</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {!generatedKey && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950 to-transparent h-12 flex items-center justify-center pointer-events-none">
                      <span className="text-[10px] text-zinc-500 font-sans tracking-wide">
                        Generate key on left to display value
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-brand-cream border border-brand-light-beige/35 p-4 rounded-xl flex gap-3 text-xs leading-normal text-brand-gray mt-6 align-bottom">
                <TerminalIcon
                  size={16}
                  className="text-brand-green shrink-0 mt-0.5"
                />
                <div>
                  <p>
                    <strong>API Request Prefix Endpoint:</strong> Use{" "}
                    <code className="bg-white border border-brand-light-beige px-1 rounded font-mono text-zinc-700 text-[11px]">
                      https://api.protocol.dev/v1
                    </code>{" "}
                    as the routing prefix. Your custom credentials must be sent
                    as standard Bearer headers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive API Endpoint Sandbox (Request/Response Playground) */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="max-w-xl text-left mb-16 space-y-3">
          <span className="font-label-caps text-brand-green font-bold tracking-wider text-[11px]">
            LIVE RUNNING TESTING DECK
          </span>
          <h2 className="font-display-md text-brand-dark tracking-tight leading-none text-3xl md:text-4xl">
            Interactive Endpoint Playground
          </h2>
          <p className="font-body-md text-brand-gray leading-relaxed text-[14.5px]">
            Test functional network queries directly inside your browser. Select
            an endpoint method, configure test parameters, and trigger real
            simulated handshakes.
          </p>
        </div>

        <div className="bg-white border border-brand-light-beige rounded-[32px] p-6 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Sandbox Configuration (5 columns) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-left">
              <div className="space-y-4">
                <h4 className="font-body-md font-bold text-brand-dark tracking-tight">
                  Select Endpoint Request
                </h4>

                <div className="flex flex-col gap-2 select-none">
                  {[
                    {
                      id: "get_node",
                      method: "GET",
                      path: "/nodes/:id",
                      label: "Inspect Node Specifications",
                    },
                    {
                      id: "calc_route",
                      method: "POST",
                      path: "/routing/pathway",
                      label: "Calculate Multipath Tunnel",
                    },
                    {
                      id: "list_payouts",
                      method: "GET",
                      path: "/rewards/history",
                      label: "List Ledger Transactions",
                    },
                  ].map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => {
                        setSelectedEndpoint(endpoint.id as any);
                        setPlaygroundResponse(null);
                      }}
                      className={`p-3.5 border rounded-xl text-left flex items-start gap-3 transition-all cursor-pointer ${
                        selectedEndpoint === endpoint.id
                          ? "bg-brand-cream/80 border-brand-green text-brand-dark shadow-sm"
                          : "border-brand-light-beige hover:border-brand-gray bg-white text-brand-dark"
                      }`}
                    >
                      <span
                        className={`px-2 py-0.5 font-mono text-[9px] font-extrabold rounded ${
                          endpoint.method === "GET"
                            ? "bg-blue-500/10 text-blue-600 border border-blue-500/10"
                            : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/10"
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <div className="flex-grow">
                        <span className="font-mono text-xs block font-bold text-zinc-800 leading-tight">
                          {endpoint.path}
                        </span>
                        <span className="text-[11px] text-brand-gray font-medium leading-none block mt-0.5">
                          {endpoint.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Flexible config fields depending on type */}
                <div className="border-t border-brand-cream pt-4 space-y-3.5">
                  <span className="font-label-caps text-[9px] text-zinc-400 font-bold block select-none">
                    API REQUEST CONFIGURATION
                  </span>
                  {selectedEndpoint === "get_node" && (
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs text-brand-dark font-semibold font-sans">
                        Node Host Registry ID
                      </label>
                      <input
                        type="text"
                        value={playgroundParamId}
                        onChange={(e) => setPlaygroundParamId(e.target.value)}
                        className="w-full bg-brand-cream/60 border border-brand-light-beige font-mono text-xs p-2.5 rounded-lg focus:outline-none focus:border-brand-green focus:bg-white"
                        placeholder="e.g. INF-3011-XP"
                      />
                    </div>
                  )}

                  {selectedEndpoint === "calc_route" && (
                    <div className="space-y-3 text-left">
                      <div className="space-y-1.5">
                        <label className="text-xs text-brand-dark font-semibold font-sans">
                          Payload Memory Isolation
                        </label>
                        <select className="w-full bg-brand-cream/60 border border-brand-light-beige font-sans text-xs p-2.5 rounded-lg focus:outline-none focus:border-brand-green focus:bg-white">
                          <option>Intel TEE (SGX Signed)</option>
                          <option>AMD SEV Protected Memory</option>
                          <option>Standard Edge Multi-Channel</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedEndpoint === "list_payouts" && (
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs text-brand-dark font-semibold font-sans flex justify-between">
                        <span>Transaction Retrieve Limit</span>
                        <span className="font-mono">
                          {playgroundParamLimit} records
                        </span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={playgroundParamLimit}
                        onChange={(e) =>
                          setPlaygroundParamLimit(parseInt(e.target.value))
                        }
                        className="w-full h-1.5 bg-brand-cream accent-brand-green rounded-lg cursor-pointer focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handlePlaygroundRun}
                disabled={isPlaying}
                className="w-full py-4 bg-brand-dark text-white hover:bg-black font-label-caps text-[11px] font-bold tracking-widest rounded-xl transition-all uppercase duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>QUERYING PROTOCOL INDEXER...</span>
                  </>
                ) : (
                  <>
                    <Play size={13} className="fill-white font-bold" />
                    <span>EXECUTE ROUTING CALL</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Sandbox JSON Response (7 columns) */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-zinc-950 rounded-2xl p-5 md:p-6 border border-zinc-850 h-full min-h-[420px] relative overflow-hidden">
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 border-b border-white/5 pb-2.5 select-none">
                <span>CONSTRUCTED JSON RESPONSE</span>
                <span className="text-brand-green-bg font-semibold">
                  200 OK
                </span>
              </div>

              <div className="flex-grow flex items-center justify-center py-4 font-mono text-xs select-all text-left overflow-x-auto min-h-[280px]">
                {isPlaying ? (
                  <div className="flex flex-col items-center gap-3 font-sans text-zinc-500 user-select-none select-none">
                    <RefreshCw
                      size={24}
                      className="text-brand-green animate-spin"
                    />
                    <p className="text-[11px] tracking-wider animate-pulse">
                      Requesting secure attestation index...
                    </p>
                  </div>
                ) : playgroundResponse ? (
                  <pre className="text-emerald-400 w-full whitespace-pre-wrap overflow-x-auto max-h-[300px] leading-relaxed">
                    {JSON.stringify(playgroundResponse, null, 2)}
                  </pre>
                ) : (
                  <div className="text-zinc-500 text-center flex flex-col items-center gap-2 select-none">
                    <Code size={20} className="text-zinc-600" />
                    <p className="font-sans text-[11.5px]">
                      Click "EXECUTE ROUTING CALL" to preview raw index details.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-zinc-900 px-3 py-2 rounded-lg text-[10px] text-zinc-400 font-mono flex justify-between items-center select-none">
                <span>API ENGINE V4.14-STABLE</span>
                <span>TIME: {playgroundResponse ? "9.43 ms" : "0.00 ms"}</span>
              </div>

              {playgroundResponse && (
                <button
                  onClick={() =>
                    handleCopy(
                      JSON.stringify(playgroundResponse, null, 2),
                      "jsonRes",
                    )
                  }
                  className="absolute right-4 top-13 p-1 px-2.5 bg-zinc-900 border border-zinc-850 text-zinc-500 rounded-lg text-[10px] hover:text-white hover:border-zinc-700 transition-all font-sans flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedIndex === "jsonRes" ? (
                    <>
                      <Check size={11} className="text-emerald-500" />
                      <span className="text-emerald-500 font-bold">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Language SDKs & Tools */}
      <section className="py-20 px-6 bg-brand-cream/60 border-y border-brand-light-beige/30 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
            <span className="font-label-caps text-brand-green font-bold tracking-wider text-[11px]">
              DEVELOPER ECOSYSTEM SDK
            </span>
            <h2 className="font-display-md text-brand-dark tracking-tight leading-none text-3xl md:text-5xl">
              Integrate Everywhere
            </h2>
            <p className="font-body-lg text-brand-gray leading-relaxed">
              We provide lightweight, native SDK packages to spin up secure
              enclaves, map RPC gateways, or calculate routes in standard
              enterprise platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* SDK Languages Selection list */}
            <div className="lg:col-span-4 flex flex-col gap-2.5 text-left select-none">
              {[
                {
                  id: "ts",
                  label: "TypeScript / Node",
                  desc: "For full-stack Web apps and JS services",
                },
                {
                  id: "py",
                  label: "Python SDK",
                  desc: "Designed for deep machine learning models",
                },
                {
                  id: "rust",
                  label: "Rust Library",
                  desc: "Ultra-low-latency high performance logic",
                },
                {
                  id: "go",
                  label: "Go Package",
                  desc: "Sized for concurrent distributed backends",
                },
              ].map((sdk) => (
                <button
                  key={sdk.id}
                  onClick={() => setActiveSdkTab(sdk.id as any)}
                  className={`p-4 border rounded-xl text-left transition-all cursor-pointer ${
                    activeSdkTab === sdk.id
                      ? "bg-white border-brand-green shadow-md text-brand-green scale-102"
                      : "border-brand-light-beige hover:border-brand-gray bg-white/40 text-brand-dark"
                  }`}
                >
                  <h4 className="font-body-sm font-semibold text-[14px] leading-tight">
                    {sdk.label}
                  </h4>
                  <p className="text-[11px] text-brand-gray mt-1 leading-normal">
                    {sdk.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Code presentation card */}
            <div className="lg:col-span-8 bg-zinc-950 border border-zinc-850 rounded-[32px] p-6 lg:p-8 flex flex-col hover:shadow-2xl transition-all text-left relative overflow-hidden h-[480px]">
              <div className="flex justify-between items-center text-xs font-mono text-zinc-500 border-b border-white/5 pb-3 mb-4 select-none">
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  PACKAGE DIRECTORY SETUP
                </span>
                <span className="text-[10px] tracking-tight text-emerald-500 font-bold">
                  {sdkCodeSnippets[activeSdkTab].install}
                </span>
              </div>

              {/* Install cmd header copy */}
              <div className="bg-black/40 border border-white/5 p-3 rounded-xl mb-4 font-mono text-xs text-zinc-400 flex justify-between items-center select-all">
                <code>{sdkCodeSnippets[activeSdkTab].install}</code>
                <button
                  onClick={() =>
                    handleCopy(
                      sdkCodeSnippets[activeSdkTab].install,
                      "install_sdk",
                    )
                  }
                  className="p-1 px-2 bg-zinc-900 border border-zinc-850 text-zinc-500 rounded text-[10px] hover:text-white transition-colors cursor-pointer"
                >
                  {copiedIndex === "install_sdk" ? "COPIED" : "COPY"}
                </button>
              </div>

              {/* Code viewer */}
              <div className="flex-grow font-mono overflow-auto text-xs leading-relaxed text-zinc-300 select-all scrollbar-thin">
                <pre className="whitespace-pre">
                  {sdkCodeSnippets[activeSdkTab].code}
                </pre>
              </div>

              {/* Float copy button over raw codes */}
              <button
                onClick={() =>
                  handleCopy(sdkCodeSnippets[activeSdkTab].code, "sdk_code")
                }
                className="absolute right-6 bottom-6 p-1.5 px-3 bg-zinc-900 border border-zinc-850 text-zinc-400 rounded-lg text-[10.5px] hover:text-white hover:border-zinc-700 transition-all font-sans flex items-center gap-1.5 cursor-pointer"
              >
                {copiedIndex === "sdk_code" ? (
                  <>
                    <Check size={11} className="text-emerald-500" />
                    <span className="text-emerald-500 font-bold">
                      ALL SDK CODE COPIED
                    </span>
                  </>
                ) : (
                  <>
                    <Copy size={11} />
                    <span>COPY CODE SNIPPET</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Action panel linking to Documentation */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-brand-green rounded-[32px] p-8 lg:p-12 text-white relative overflow-hidden">
          <div
            className="absolute inset-0 bg-opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="lg:col-span-8 space-y-4 text-left relative z-10">
            <span className="font-label-caps text-brand-green-bg font-bold tracking-widest text-[11px] block text-left uppercase">
              FULL KNOWLEDGE BASE
            </span>
            <h2 className="font-display-md text-white tracking-tight leading-none text-4xl lg:text-5xl">
              Explore the protocols documentation manuals.
            </h2>
            <p className="text-white/80 font-body-sm leading-relaxed max-w-2xl text-[14.5px]">
              Dive deep into CLI node setups, remote attestation handshakes,
              validation slashing triggers, consensus settlements, or delegation
              rates. Your complete build reference awaits.
            </p>
          </div>

          <div className="lg:col-span-4 relative z-10 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center items-stretch w-full min-w-[200px]">
            <button
              onClick={onNavigateToDocs}
              className="px-6 py-4 bg-white text-zinc-950 font-label-caps text-[11px] font-bold border-none rounded-xl tracking-wider hover:bg-zinc-100 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 uppercase"
            >
              <BookOpen size={14} />
              <span>READ DETAILED MANUALS</span>
            </button>
            <button
              onClick={onStartEarning}
              className="px-6 py-4 border border-white hover:bg-white/10 text-white font-label-caps text-[11px] font-semibold rounded-xl tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 uppercase"
            >
              <Server size={14} />
              <span>LINK OPERATOR NODE</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
