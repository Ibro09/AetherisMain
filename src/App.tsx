/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import ProductPage from "./components/ProductPage";
import SolutionsPage from "./components/SolutionsPage";
import ResourcesPage from "./components/ResourcesPage";
import PricingPage from "./components/PricingPage";
import DevelopersPage from "./components/DevelopersPage";
import DocsPage from "./components/DocsPage";
import AuthPage from "./components/AuthPage";
import DashboardPage from "./components/DashboardPage";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import TermsOfServicePage from "./components/TermsOfServicePage";
import CookiePolicyPage from "./components/CookiePolicyPage";
import {
  ArrowRight,
  LayoutDashboard,
  Check,
  Copy,
  Plus,
  Cpu,
  Bot,
  Globe,
  ShieldCheck,
  TrendingUp,
  Zap,
  Database,
  Terminal as TerminalIcon,
  Quote,
  Github,
  ExternalLink,
  X,
  ChevronRight,
  Info,
  Settings,
  Layers,
  Activity,
  Wallet,
  Coins,
  RefreshCw,
  Search,
  Server,
  Play,
  Menu,
} from "lucide-react";
import QuantumCanvas from "./components/QuantumCanvas";

// Types for our custom app
interface ConnectedNode {
  id: string;
  name: string;
  type: "gpu" | "agent" | "api" | "storage";
  status: "ACTIVE" | "AETHERIS" | "ROUTING";
  rate: number;
  uptime: string;
  earned: number;
}

interface LiveTransaction {
  id: string;
  timestamp: string;
  nodeId: string;
  resource: string;
  destination: string;
  latency: string;
  payout: number;
}

const INITIAL_NODES: ConnectedNode[] = [
  {
    id: "INF-3011-XP",
    name: "Apex GPU Cluster A100",
    type: "gpu",
    status: "ACTIVE",
    rate: 354.16,
    uptime: "99.98%",
    earned: 1482.5,
  },
  {
    id: "INF-7724-Y",
    name: "Local Agent Runner V2",
    type: "agent",
    status: "AETHERIS",
    rate: 210.5,
    uptime: "98.75%",
    earned: 310.2,
  },
  {
    id: "INF-9012-K",
    name: "REST Endpoint Router v3",
    type: "api",
    status: "ROUTING",
    rate: 85.4,
    uptime: "100%",
    earned: 125.8,
  },
];

export default function App() {
  // Navigation & View views
  const [currentView, setCurrentView] = useState<
    | "landing"
    | "console"
    | "product"
    | "solutions"
    | "resources"
    | "docs"
    | "developers"
    | "auth"
    | "dashboard"
    | "privacy"
    | "terms"
    | "cookie"
  >("landing");
  const [activeTab, setActiveTab] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User Authentication & Session state (expires in 30 days)
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  // Restore 30-day session if signed in recently
  useEffect(() => {
    try {
      const storedSession = localStorage.getItem("infra_active_session");
      if (storedSession) {
        const parsed = JSON.parse(storedSession);
        if (parsed && parsed.user && parsed.expiresAt) {
          if (Date.now() < parsed.expiresAt) {
            setCurrentUser(parsed.user);
          } else {
            // Expired after 30 days
            localStorage.removeItem("infra_active_session");
          }
        }
      }
    } catch (e) {
      console.error("Failed to restore session:", e);
    }
  }, []);

  // Interaction: Earnings Calculator
  const [calcTab, setCalcTab] = useState<"gpu" | "agent" | "api" | "storage">(
    "gpu",
  );
  const [calcUnits, setCalcUnits] = useState<number>(120);

  // Interaction: Route Simulator
  const [routeSource, setRouteSource] = useState<string>("gpu");
  const [routeTarget, setRouteTarget] = useState<string>("ai");
  const [isSimulatingRoute, setIsSimulatingRoute] = useState<boolean>(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [activeRouteAnimation, setActiveRouteAnimation] =
    useState<boolean>(false);

  // Interactive Live Data state
  const [nodes, setNodes] = useState<ConnectedNode[]>(INITIAL_NODES);
  const [transactions, setTransactions] = useState<LiveTransaction[]>([
    {
      id: "TX-4091",
      timestamp: "Just now",
      nodeId: "INF-3011-XP",
      resource: "GPU Cluster",
      destination: "OpenAI Whisper v4",
      latency: "0.24ms",
      payout: 0.62,
    },
    {
      id: "TX-4090",
      timestamp: "3s ago",
      nodeId: "INF-9012-K",
      resource: "REST Endpoints",
      destination: "Vercel Edge Global",
      latency: "1.20ms",
      payout: 0.11,
    },
    {
      id: "TX-4089",
      timestamp: "8s ago",
      nodeId: "INF-7724-Y",
      resource: "AI Agents",
      destination: "Autonomous Agent #441",
      latency: "0.85ms",
      payout: 0.29,
    },
    {
      id: "TX-4088",
      timestamp: "12s ago",
      nodeId: "INF-3011-XP",
      resource: "GPU Cluster",
      destination: "DeepSeek R1 Core",
      latency: "0.19ms",
      payout: 0.71,
    },
  ]);
  const [totalYield, setTotalYield] = useState<number>(12482.5);

  // Stepper connection modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalStep, setModalStep] = useState<number>(1);
  const [newNodeType, setNewNodeType] = useState<
    "gpu" | "agent" | "api" | "storage"
  >("gpu");
  const [newNodeName, setNewNodeName] = useState<string>("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isSimulatingLink, setIsSimulatingLink] = useState<boolean>(false);

  // Terminal Simulator inside the landing page container (developer section)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isTerminalRunning, setIsTerminalRunning] = useState<boolean>(false);

  // Token CA copy state
  const [tokenCopied, setTokenCopied] = useState<boolean>(false);
  const TOKEN_CA = "FdfnFzFzCArFBVW9wqPd5sesdrK7uXTzQkw4vRwDpump";

  const copyTokenToClipboard = () => {
    navigator.clipboard.writeText(TOKEN_CA);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  // Trigger continuous random transaction piping with mock interval
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time routing payouts & update state metrics
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      const resourcesMap = {
        gpu: {
          label: "GPU Cluster",
          dest: [
            "OpenAI Sora",
            "DeepSeek Chat",
            "Ideogram Visual",
            "Runway Gen3",
          ],
          basePay: 0.62,
          latency: () => (Math.random() * 0.3 + 0.1).toFixed(2) + "ms",
        },
        agent: {
          label: "AI Agents",
          dest: ["LangChain Sandbox", "AutoGPT Executor", "CrewAI Node 4"],
          basePay: 0.29,
          latency: () => (Math.random() * 0.8 + 0.3).toFixed(2) + "ms",
        },
        api: {
          label: "REST Endpoints",
          dest: [
            "Stripe Webhook Gateway",
            "Shopify Real-time",
            "SendGrid Relay",
          ],
          basePay: 0.11,
          latency: () => (Math.random() * 1.5 + 0.5).toFixed(2) + "ms",
        },
        storage: {
          label: "Storage Node",
          dest: ["Arweave Archival", "IPFS Global DHT", "Filecoin Pool 2"],
          basePay: 0.04,
          latency: () => (Math.random() * 4.0 + 1.0).toFixed(2) + "ms",
        },
      };

      const meta = resourcesMap[randomNode.type];
      const payoutValue = parseFloat(
        (meta.basePay + Math.random() * 0.2).toFixed(2),
      );
      const newTx: LiveTransaction = {
        id: "TX-" + Math.floor(Math.random() * 9000 + 1000),
        timestamp: "Just now",
        nodeId: randomNode.id,
        resource: meta.label,
        destination: meta.dest[Math.floor(Math.random() * meta.dest.length)],
        latency: meta.latency(),
        payout: payoutValue,
      };

      setTransactions((prev) => [newTx, ...prev.slice(0, 5)]);
      setTotalYield((prev) => parseFloat((prev + payoutValue).toFixed(2)));

      // Add small reward to individual nodes
      setNodes((prev) =>
        prev.map((n) => {
          if (n.id === randomNode.id) {
            return {
              ...n,
              earned: parseFloat((n.earned + payoutValue).toFixed(2)),
              status: "ROUTING",
            };
          }
          return n;
        }),
      );

      // Return nodes to natural states shortly
      setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) => {
            if (n.id === randomNode.id) {
              return {
                ...n,
                status: n.type === "agent" ? "AETHERIS" : "ACTIVE",
              };
            }
            return n;
          }),
        );
      }, 2500);
    }, 4500);

    return () => clearInterval(interval);
  }, [nodes]);

  // Handle Calculator calculation
  const getCalculatedYield = () => {
    const formulas = {
      gpu: 354.16,
      agent: 210.5,
      api: 85.4,
      storage: 45.1,
    };
    return Math.floor(calcUnits * formulas[calcTab]);
  };

  // Launch a Node Simulation Stepper connection
  const handleStartNodeConnection = () => {
    setIsModalOpen(true);
    setModalStep(1);
    setNewNodeName("");
    setTerminalLogs([]);
    setIsSimulatingLink(false);
  };

  const executeModalStep2 = () => {
    if (!newNodeName.trim()) {
      alert("Please provide a name for your node.");
      return;
    }
    setModalStep(3);
  };

  const simulateStep3NodeLink = () => {
    setIsSimulatingLink(true);
    setTerminalLogs([]);

    const logMessages = [
      "▶ Initializing protocol daemon node container...",
      "✔ Downloading lightweight secure-enclave binaries...",
      "▶ Mapping virtual device memory addresses into hardware registry...",
      "⚙ Registering node cryptographic key pair on Solana network layer...",
      "✔ Handshaking with regional cluster directory indices...",
      "▶ Testing sub-ms ping routing to nearest autonomous index coordinator...",
      "▶ SECURE BOUNDARY COMMITTED: Hardware isolated enclaves certified (Intel SGX / AMD SEV ready).",
      "✔ CONNECTED SUCCESSFULLY! Allocating global protocol status to ROUTING...",
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < logMessages.length) {
        const msg = logMessages[index];
        index++;
        if (msg !== undefined) {
          setTerminalLogs((prev) => [...prev, msg]);
        }
        if (index >= logMessages.length) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSimulatingLink(false);
            setModalStep(4);
          }, 400);
        }
      }
    }, 700);
  };

  // Add simulated node to user list
  const finishNodeConnection = () => {
    const nodeRates = { gpu: 354.16, agent: 210.5, api: 85.4, storage: 45.1 };
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randLetters =
      alphabet[Math.floor(Math.random() * 26)] +
      alphabet[Math.floor(Math.random() * 26)];
    const id = `INF-${Math.floor(Math.random() * 9000 + 1000)}-${randLetters}`;

    const newlyConnected: ConnectedNode = {
      id,
      name: newNodeName || `Custom ${newNodeType.toUpperCase()} Node`,
      type: newNodeType,
      status: "ACTIVE",
      rate: nodeRates[newNodeType],
      uptime: "100.00%",
      earned: 0,
    };

    setNodes((prev) => [...prev, newlyConnected]);
    setIsModalOpen(false);
  };

  // Developer terminal sandbox run simulation
  const runDeveloperTerminalSandbox = () => {
    if (isTerminalRunning) return;
    setIsTerminalRunning(true);
    setTerminalOutput([]);

    const commands = [
      { text: "$ npm install @aetheris-protocol/sdk-node", delay: 100 },
      {
        text: "added 14 packages, containing real-time multiplexer",
        delay: 1200,
      },
      { text: "$ node index.js", delay: 2000 },
      {
        text: "[INFO] Initializing handshake client protocol (V4.14)...",
        delay: 2300,
      },
      {
        text: "[INFO] Hardware audit: found NVIDIA RTX 4090 Host (24GB VRAM)",
        delay: 3000,
      },
      {
        text: "[INFO] Secure Enclave Handshake: TEE verified perfectly",
        delay: 3600,
      },
      {
        text: "[SUCCESS] Registered with indexer. Node ID: INF-LIVE-8801-R",
        delay: 4200,
      },
      {
        text: "[EARNINGS] +$0.62 (Computed 140,291 tokens for OpenAI Whisper v4)",
        delay: 4900,
      },
      {
        text: "[EARNINGS] +$0.51 (Analyzed telemetry on global relay BW-99)",
        delay: 5800,
      },
      { text: "[INFO] Waiting for next batch request...", delay: 6500 },
    ];

    commands.forEach((c) => {
      setTimeout(() => {
        setTerminalOutput((prev) => [...prev, c.text]);
        if (c.text.startsWith("[INFO] Waiting")) {
          setIsTerminalRunning(false);
        }
      }, c.delay);
    });
  };

  // Run Route Simulator
  const triggerRouteSimulation = () => {
    if (isSimulatingRoute) return;
    setIsSimulatingRoute(true);
    setActiveRouteAnimation(true);
    setSimulationLogs([
      "Negotiating neutral liquidity layer connection...",
      "Analyzing physical network routing...",
    ]);

    const steps = [
      `Validating physical route source: [${routeSource.toUpperCase()}] resource layer`,
      `Securing route with hardware-isolated Intel SGX TEE layer`,
      `Calculating lowest routing cost paths (dynamic routing logic)`,
      `Executing instant settlement: paying rewards directly to Node account`,
      `SUCCESS: Route established securely inside ${Math.floor(Math.random() * 200 + 40)}μs. Payout committed.`,
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setSimulationLogs((prev) => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsSimulatingRoute(false);
        // Turn off route visual animation after some delay
        setTimeout(() => {
          setActiveRouteAnimation(false);
        }, 1500);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark selection:bg-brand-green-bg selection:text-brand-green relative flex flex-col justify-between">
      {/* Dynamic Background Noise / Gradient Layer */}
      <div
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#4a2c1a 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <QuantumCanvas />
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 left-0 w-full z-45 bg-white/90 backdrop-blur-md border-b border-brand-light-beige/30 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div
            onClick={() => {
              setCurrentView("landing");
              setActiveTab("");
            }}
            className="flex items-center gap-2 cursor-pointer group mr-5"
          >
            <span className="font-display font-medium text-2xl tracking-tighter text-brand-dark hover:opacity-85 transition-opacity">
              AETHERIS
            </span>
          </div>

          {/* Nav Items */}
          <div className="hidden md:flex items-center gap-8">
            {[
              "Product",
              "Solutions",
              "Resources",
              "AI Builder",
              ...(currentUser ? ["Dashboard"] : []),
            ].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveTab(item);
                  if (item === "AI Builder") {
                    setCurrentView("docs");
                  } else if (item === "Dashboard") {
                    setCurrentView("dashboard");
                  } else {
                    setCurrentView(item.toLowerCase() as any);
                  }
                }}
                className={`font-label-caps text-[12px] transition-all border-b pb-0.5 ${
                  currentView === item.toLowerCase() ||
                  (item === "Docs" && currentView === "docs") ||
                  (item === "Dashboard" && currentView === "dashboard")
                    ? "text-brand-green border-brand-green font-semibold"
                    : "text-brand-gray border-transparent hover:text-brand-dark hover:border-brand-gray/30"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* View Interactive Console Toggle */}
            {/* <button
              onClick={() => {
                setCurrentView(
                  currentView === "console" ? "landing" : "console",
                );
                setActiveTab("");
              }}
              className={`p-2 rounded-lg flex items-center gap-1.5 font-label-caps text-[12px] transition-all duration-300 cursor-pointer ${
                currentView === "console"
                  ? "bg-brand-green text-white shadow-sm hover:bg-brand-green-light"
                  : "border border-brand-light-beige hover:bg-brand-cream text-brand-gray hover:text-brand-dark"
              }`}
            >
              <LayoutDashboard
                size={14}
                className={currentView === "console" ? "animate-pulse" : ""}
              />
            </button> */}

            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="font-label-caps text-[9px] text-brand-green font-semibold">
                    ● Connected
                  </span>
                  <span className="text-[11px] font-medium text-brand-dark tracking-tight">
                    {currentUser.name}
                  </span>
                </div>
                <button
                  id="btn-navbar-signout"
                  onClick={() => {
                    localStorage.removeItem("infra_active_session");
                    setCurrentUser(null);
                    setCurrentView("landing");
                  }}
                  className="font-label-caps text-[11px] px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50/50 transition-all cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="btn-navbar-signin"
                  onClick={() => {
                    setAuthMode("signin");
                    setCurrentView("auth");
                    setActiveTab("");
                  }}
                  className={`font-label-caps text-[11px] sm:text-[12px] px-3.5 py-2 rounded-lg border transition-all active:scale-95 duration-200 cursor-pointer ${
                    currentView === "auth" && authMode === "signin"
                      ? "bg-brand-green border-brand-green text-white"
                      : "border-brand-green text-brand-green hover:bg-brand-green/5 hover:border-brand-green-light"
                  }`}
                >
                  Sign In
                </button>
                <button
                  id="btn-navbar-signup"
                  onClick={() => {
                    setAuthMode("signup");
                    setCurrentView("auth");
                    setActiveTab("");
                  }}
                  className={`font-label-caps text-[11px] sm:text-[12px] px-3.5 py-2 rounded-lg border transition-all active:scale-95 duration-200 cursor-pointer hidden sm:inline-block ${
                    currentView === "auth" && authMode === "signup"
                      ? "bg-brand-green border-brand-green text-white animate-pulse"
                      : "border-transparent text-brand-gray hover:text-brand-dark"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            <button
              onClick={handleStartNodeConnection}
              className="font-label-caps text-[12px] px-4 py-2 rounded-lg bg-black text-white hover:bg-zinc-900 hover:shadow-md transition-all active:scale-95 duration-200 cursor-pointer"
            >
              Start Earning
            </button>

            {/* Mobile Hamburger toggle button */}
            <button
              id="btn-mobile-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-brand-light-beige hover:bg-brand-cream text-brand-gray hover:text-brand-dark transition-all cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#f7f4ee]/95 backdrop-blur-md border-b border-brand-light-beige/40 px-6 py-4 space-y-4 shadow-inner relative z-40 overflow-hidden"
          >
            <div className="flex flex-col gap-3.5">
              {[
                { label: "Product", view: "product" },
                { label: "Solutions", view: "solutions" },
                { label: "Resources", view: "resources" },

                { label: "Developers", view: "developers" },
                { label: "AI Builder", view: "docs" },
                ...(currentUser
                  ? [{ label: "Dashboard", view: "dashboard" }]
                  : []),
              ].map((item) => (
                <button
                  key={item.label}
                  id={`btn-mobile-nav-${item.view}`}
                  onClick={() => {
                    setCurrentView(item.view as any);
                    setActiveTab(item.label);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left font-label-caps text-[13px] py-1 transition-all ${
                    currentView === item.view
                      ? "text-brand-green font-semibold pl-2 border-l-2 border-brand-green"
                      : "text-brand-gray hover:text-brand-dark hover:pl-1"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Custom Logged user details or Quick Sign In controls */}
            <div className="pt-4 border-t border-brand-light-beige/35 flex flex-col gap-3">
              {currentUser ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="font-label-caps text-[9px] text-brand-green font-semibold">
                      ● Grid Operator Connected
                    </span>
                    <span className="text-xs font-semibold text-brand-dark">
                      {currentUser.name}
                    </span>
                  </div>
                  <button
                    id="btn-mobile-signout"
                    onClick={() => {
                      localStorage.removeItem("infra_active_session");
                      setCurrentUser(null);
                      setCurrentView("landing");
                      setMobileMenuOpen(false);
                    }}
                    className="font-label-caps text-[11px] px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50/50 transition-all cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="btn-mobile-signin"
                    onClick={() => {
                      setAuthMode("signin");
                      setCurrentView("auth");
                      setActiveTab("");
                      setMobileMenuOpen(false);
                    }}
                    className="font-label-caps text-[12px] py-2 bg-transparent text-brand-green hover:bg-brand-green/5 border border-brand-green rounded-lg text-center cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    id="btn-mobile-signup"
                    onClick={() => {
                      setAuthMode("signup");
                      setCurrentView("auth");
                      setActiveTab("");
                      setMobileMenuOpen(false);
                    }}
                    className="font-label-caps text-[12px] py-2 bg-brand-green text-white hover:bg-brand-green-light rounded-lg text-center cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container with View switching */}
      <main className="flex-grow z-10">
        <AnimatePresence mode="wait">
          {currentView === "landing" && (
            <motion.div
              key="landing-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col"
            >
              {/* Hero Section */}
              <section className="min-h-fit sm:min-h-[85vh] flex items-center pt-8 pb-16 px-6 max-w-7xl mx-auto overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                  {/* Hero Copy */}
                  <div className="flex flex-col text-left gap-4">
                    <span className="font-label-caps text-brand-green mb-4 tracking-widest block bg-brand-green-bg/20 self-start px-2.5 py-1 rounded-full text-[10px]">
                      PROTOCOL V4.14 IS LIVE
                    </span>
                    {/* <div className="flex items-center gap-2 mb-6">
                      <span className="inline-block font-label-caps text-white bg-gradient-to-r from-brand-green to-brand-green-light px-3 py-1.5 rounded-full text-[11px] shadow-md border border-brand-green/40 tracking-wider">
                        Token:{" "}
                        <span className=" tracking-tight">
                          FdfnFzFzCArFBVW9wqPd5sesdrK7uXTzQkw4vRwDpump
                        </span>
                      </span>
                      <button
                        onClick={copyTokenToClipboard}
                        className={`p-2 rounded-lg flex items-center gap-1.5 transition-all duration-300 font-label-caps text-[11px] ${
                          tokenCopied
                            ? "bg-brand-green text-white shadow-md"
                            : "bg-brand-green/20 text-brand-green hover:bg-brand-green/30 hover:shadow-md"
                        }`}
                        title="Copy token address"
                      >
                        {tokenCopied ? (
                          <>
                            <Check size={16} />
                            <span className="hidden sm:inline">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            <span className="hidden sm:inline">Copy</span>
                          </>
                        )}
                      </button>
                    </div> */}
                    <h1 className="font-headline-lg-mobile sm:font-display-lg text-brand-dark tracking-tighter leading-[1.08] mb-6">
                      Decentralized Compute
                      <span className="text-brand-green-light block italic font-medium mt-1">
                        & Routing Network{" "}
                      </span>
                    </h1>
                    <p className="font-body-lg text-brand-gray max-w-lg mb-10 leading-relaxed">
                      Earn rewards by routing underutilized compute, bandwidth,
                      and API capacity.
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={handleStartNodeConnection}
                        className="px-6 py-4 bg-brand-dark text-white font-body-md rounded-lg flex items-center gap-2 group hover:bg-black hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                      >
                        Connect Node
                        <ArrowRight
                          size={18}
                          className="group-hover:translate-x-1 transition-transform duration-300"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Hero Visual Glassmorphic Dashboard */}
                  <div className="relative h-[420px] sm:h-[520px] lg:h-[600px] flex items-center justify-center lg:justify-end">
                    <div className="w-full glass rounded-xl p-6 relative shadow-2xl overflow-hidden group hover:scale-[1.02] transition-transform duration-500 max-w-full sm:max-w-md border border-outline-variant/30">
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-secondary-fixed via-secondary to-on-secondary-fixed-variant"></div>

                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-5 h-5 text-secondary animate-spin-slow" />
                          <span className="text-xs font-mono font-bold tracking-wider text-secondary">
                            AETHERIS ORCHESTRATOR
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-black text-white rounded">
                          LIVE AGENTS ACTIVE
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-white/50 rounded-lg border border-black/5 shadow-inner">
                          <div className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
                            ACTIVE STRATEGY
                          </div>
                          <div className="text-lg font-bold font-display text-primary">
                            AETHERIS NODE
                          </div>
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-black/5">
                            <span className="text-xs font-mono text-on-surface-variant">
                              Projected APY:
                            </span>
                            <span className="text-sm font-mono font-bold text-secondary animate-pulse">
                              2.45%
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-white/40 rounded border border-black/5">
                            <div className="text-[9px] font-mono text-on-surface-variant">
                              RISK INDEX
                            </div>
                            <div className="text-sm font-mono font-bold flex items-center gap-1.5 mt-0.5">
                              <span className="w-2 h-2 rounded-full bg-secondary"></span>
                              2{" "}
                            </div>
                          </div>
                          <div className="p-3 bg-white/40 rounded border border-black/5">
                            <div className="text-[9px] font-mono text-on-surface-variant">
                              REBALANCE INTERVAL
                            </div>
                            <div className="text-sm font-mono font-bold mt-0.5 text-ellipsis overflow-hidden whitespace-nowrap">
                              0
                            </div>
                          </div>
                        </div>

                        {/* Animated Simulated Operations */}
                        <div className="p-4 bg-black text-white/90 rounded-lg font-mono text-xs overflow-hidden h-28 space-y-1 shadow-inner relative">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 pointer-events-none"></div>
                          <div className="text-secondary-fixed-dim text-[10px] pb-1 border-b border-white/10 uppercase tracking-widest flex justify-between">
                            <span>Agent Operations</span>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                          </div>
                          <div className="animate-pulse text-[10px] text-green-400 mt-2">
                            &gt; [11:54:02] Yield Hunter scan init...
                          </div>
                          <div className="text-[10px] text-zinc-300">
                            &gt; [11:54:05] Checking ROBINHOOD ETH-USDC
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            &gt; [11:54:11] Allocations balanced (100%)
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            &gt; [11:54:15] Security state: 100% Verified
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Social Proof Section (Trusted list matching screenshot) */}
              <section className="py-12 bg-white/40 border-y border-brand-light-beige/30">
                <div className="max-w-7xl mx-auto px-6 text-center">
                  <p className="font-label-caps text-brand-gray tracking-[0.15em] text-[10px] mb-8 font-medium">
                    TRUSTED BY
                  </p>

                  <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-60 hover:opacity-100 transition-opacity duration-500">
                    <span className="font-display font-medium text-[26px] tracking-[0.25em] text-brand-dark hover:scale-105 transition-transform cursor-pointer">
                      ROBINHOOD
                    </span>
                  </div>
                </div>
              </section>

              {/* Ticker Bar (Live route rewards) */}
              <div className="w-full bg-brand-green py-3.5 overflow-hidden relative shadow-inner">
                <div className="animate-ticker-scroll flex whitespace-nowrap items-center gap-12 group cursor-ew-resize">
                  <div className="flex items-center gap-12 text-white/95 font-label-caps text-[11px] font-medium">
                    <span>
                      GPU-07 → COMPUTE MARKET →{" "}
                      <span className="text-brand-green-bg font-bold animate-pulse">
                        +$0.62
                      </span>
                    </span>
                    <span className="opacity-40">|</span>
                    <span>
                      API-V3 → INFERENCE HUB →{" "}
                      <span className="text-brand-green-bg font-bold animate-pulse">
                        +$0.11
                      </span>
                    </span>
                    <span className="opacity-40">|</span>
                    <span>
                      STG-01 → ARCHIVAL CLOUD →{" "}
                      <span className="text-brand-green-bg font-bold animate-pulse">
                        +$0.04
                      </span>
                    </span>
                    <span className="opacity-40">|</span>
                    <span>
                      BW-99 → GLOBAL RELAY →{" "}
                      <span className="text-brand-green-bg font-bold animate-pulse">
                        +$0.29
                      </span>
                    </span>
                    <span className="opacity-40">|</span>
                    <span>
                      GPU-08 → COMPUTE MARKET →{" "}
                      <span className="text-brand-green-bg font-bold animate-pulse">
                        +$0.71
                      </span>
                    </span>
                    <span className="opacity-40">|</span>
                    <span>
                      AGENT-X → AUTO ROUTING →{" "}
                      <span className="text-brand-green-bg font-bold animate-pulse">
                        +$1.04
                      </span>
                    </span>
                  </div>
                  {/* Duplicate segment for seamless loop */}
                  <div className="flex items-center gap-12 text-white/95 font-label-caps text-[11px] font-medium">
                    <span>
                      GPU-07 → COMPUTE MARKET →{" "}
                      <span className="text-brand-green-bg font-bold">
                        +$0.62
                      </span>
                    </span>
                    <span className="opacity-40">|</span>
                    <span>
                      API-V3 → INFERENCE HUB →{" "}
                      <span className="text-brand-green-bg font-bold">
                        +$0.11
                      </span>
                    </span>
                    <span className="opacity-40">|</span>
                    <span>
                      STG-01 → ARCHIVAL CLOUD →{" "}
                      <span className="text-brand-green-bg font-bold">
                        +$0.04
                      </span>
                    </span>
                    <span className="opacity-40">|</span>
                    <span>
                      BW-99 → GLOBAL RELAY →{" "}
                      <span className="text-brand-green-bg font-bold">
                        +$0.29
                      </span>
                    </span>
                    <span className="opacity-40">|</span>
                    <span>
                      GPU-08 → COMPUTE MARKET →{" "}
                      <span className="text-brand-green-bg font-bold">
                        +$0.71
                      </span>
                    </span>
                    <span className="opacity-40">|</span>
                    <span>
                      AGENT-X → AUTO ROUTING →{" "}
                      <span className="text-brand-green-bg font-bold">
                        +$1.04
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistics Panel matching screenshots */}
              <section className="py-24 px-6 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 border-t border-brand-light-beige/40 pt-16">
                  <div className="group cursor-default">
                    <p className="font-label-caps text-brand-gray mb-3.5 tracking-wider text-[11px]">
                      NETWORK SCALE
                    </p>
                    <h3 className="font-display font-medium text-4xl text-brand-dark mb-2 transition-colors group-hover:text-brand-green duration-300">
                      14 Active
                    </h3>
                    <p className="font-body-md text-brand-gray text-[14px] leading-relaxed">
                      Endpoints deployed globally across active zones
                    </p>
                  </div>

                  <div className="group cursor-default">
                    <p className="font-label-caps text-brand-gray mb-3.5 tracking-wider text-[11px]">
                      LOGIC LAYER
                    </p>
                    <h3 className="font-display font-medium text-4xl text-brand-dark mb-2 transition-colors group-hover:text-brand-green duration-300">
                      x402 Routing
                    </h3>
                    <p className="font-body-md text-brand-gray text-[14px] leading-relaxed">
                      Dynamic protocol version updates auto-routing
                    </p>
                  </div>

                  <div className="group cursor-default">
                    <p className="font-label-caps text-brand-gray mb-3.5 tracking-wider text-[11px]">
                      RESPONSE TIME
                    </p>
                    <h3 className="font-display font-medium text-4xl text-brand-dark mb-2 transition-colors group-hover:text-brand-green duration-300">
                      5 min
                    </h3>
                    <p className="font-body-md text-brand-gray text-[14px] leading-relaxed">
                      Adaptive resource balancing and state audits
                    </p>
                  </div>

                  <div className="group cursor-default">
                    <p className="font-label-caps text-brand-gray mb-3.5 tracking-wider text-[11px]">
                      EFFICIENCY
                    </p>
                    <h3 className="font-display font-medium text-4xl text-brand-dark mb-2 transition-colors group-hover:text-brand-green duration-300">
                      $0.01
                    </h3>
                    <p className="font-body-md text-brand-gray text-[14px] leading-relaxed">
                      Minimum secure settlement unit globally
                    </p>
                  </div>
                </div>
              </section>

              {/* How It Works Section */}
              <section className="py-24 px-6 max-w-7xl mx-auto w-full">
                <div className="bg-brand-cream/80 border border-brand-light-beige/30 p-12 lg:p-20 rounded-[32px] hover:shadow-lg transition-shadow duration-500">
                  <div className="max-w-xl mx-auto text-center mb-16">
                    <h2 className="font-display-md text-brand-dark mb-4 tracking-tight lead-none">
                      One protocol. Three simple steps.
                    </h2>
                    <p className="font-body-lg text-brand-gray">
                      The aetheris routing layer for the autonomous economy.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white/90 p-8 lg:p-10 rounded-[20px] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group border border-brand-light-beige/20">
                      <span className="font-display text-4xl text-brand-light-beige group-hover:text-brand-green font-light transition-colors duration-300">
                        01
                      </span>
                      <h4 className="font-headline-md text-xl text-brand-dark mt-6 mb-3">
                        Connect
                      </h4>
                      <p className="font-body-md text-brand-gray text-[14px] leading-relaxed">
                        Securely link your hardware or service endpoints via our
                        lightweight SDK or Docker containers.
                      </p>
                    </div>

                    <div className="bg-white/90 p-8 lg:p-10 rounded-[20px] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group border border-brand-light-beige/20">
                      <span className="font-display text-4xl text-brand-light-beige group-hover:text-brand-green font-light transition-colors duration-300">
                        02
                      </span>
                      <h4 className="font-headline-md text-xl text-brand-dark mt-6 mb-3">
                        Route
                      </h4>
                      <p className="font-body-md text-brand-gray text-[14px] leading-relaxed">
                        Our engine automatically matches your aetheris capacity
                        with enterprise-grade demand in real-time.
                      </p>
                    </div>

                    <div className="bg-white/90 p-8 lg:p-10 rounded-[20px] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group border border-brand-light-beige/20">
                      <span className="font-display text-4xl text-brand-light-beige group-hover:text-brand-green font-light transition-colors duration-300">
                        03
                      </span>
                      <h4 className="font-headline-md text-xl text-brand-dark mt-6 mb-3">
                        Earn
                      </h4>
                      <p className="font-body-md text-brand-gray text-[14px] leading-relaxed">
                        Receive automated, high-frequency payouts directly to
                        your treasury based on usage and uptime.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Adaptive Routing Engine Visualizer Section */}
              <section className="py-24 px-6 max-w-7xl mx-auto w-full overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  {/* Left explanation column */}
                  <div>
                    <span className="font-label-caps text-brand-green font-semibold tracking-widest text-[11px] mb-4 block">
                      ZERO-WASTE RESOURCE ALLOCATION
                    </span>
                    <h2 className="font-display-md text-brand-dark mb-6 tracking-tight leading-none">
                      Adaptive Routing Engine
                    </h2>
                    <p className="font-body-lg text-brand-gray mb-10 leading-relaxed">
                      Our central engine acts as a neutral liquidity layer for
                      physical and digital resources, ensuring zero-waste
                      allocation across global markets.
                    </p>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4 group cursor-default">
                        <div className="p-3 bg-brand-green-bg/30 text-brand-green rounded-full group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                          <Zap size={18} />
                        </div>
                        <div>
                          <h5 className="font-display text-lg text-brand-dark font-semibold mb-1">
                            Sub-ms Latency
                          </h5>
                          <p className="font-body-sm text-brand-gray text-[13px]">
                            Milliseconds from raw consumer request to automated
                            host allocation.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 group cursor-default">
                        <div className="p-3 bg-brand-green-bg/30 text-brand-green rounded-full group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <h5 className="font-display text-lg text-brand-dark font-semibold mb-1">
                            TEE Secured
                          </h5>
                          <p className="font-body-sm text-brand-gray text-[13px]">
                            Enclave-level cryptographic security for every
                            orchestrated task.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right visual interactive representation */}
                  <div className="bg-brand-cream/60 border border-brand-light-beige/30 rounded-[24px] p-8 h-[480px] relative flex flex-col justify-between overflow-hidden">
                    {/* Header bar */}
                    <div className="flex justify-between items-center text-xs font-mono text-brand-gray">
                      <span className="flex items-center gap-1.5 font-label-caps select-none text-[10px]">
                        <Activity
                          size={12}
                          className="text-brand-green animate-pulse"
                        />{" "}
                        LIVE ALLOCATION PORTAL
                      </span>
                      <span className="text-[10px]">
                        VERIFIED LATENCY: &lt; 0.40 ms
                      </span>
                    </div>

                    {/* Nodes interactive mapping */}
                    <div className="relative flex-grow flex items-center justify-between px-6">
                      {/* Interactive Animation Path lines SVG */}
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none stroke-brand-green/20"
                        fill="none"
                      >
                        {/* Custom animated paths */}
                        <path
                          d="M 50 140 Q 200 120 185 200"
                          strokeWidth="1.5"
                          strokeDasharray="5,5"
                        />
                        <path
                          d="M 50 260 Q 200 280 185 200"
                          strokeWidth="1.5"
                          strokeDasharray="5,5"
                        />
                        <path
                          d="M 185 200 Q 230 120 350 140"
                          strokeWidth="1.5"
                          strokeDasharray="5,5"
                        />
                        <path
                          d="M 185 200 Q 230 280 350 260"
                          strokeWidth="1.5"
                          strokeDasharray="5,5"
                        />

                        {activeRouteAnimation && (
                          <>
                            {/* Animated route pulses */}
                            <circle
                              r="4"
                              fill="#4a2c1a"
                              className="animate-[ping_1.5s_infinite]"
                            >
                              <animateMotion
                                dur="1.2s"
                                repeatCount="indefinite"
                                path={
                                  routeSource === "gpu"
                                    ? "M 50 140 Q 200 120 185 200"
                                    : "M 50 260 Q 200 280 185 200"
                                }
                              />
                            </circle>
                            <circle
                              r="4"
                              fill="#1f1f1f"
                              className="animate-[ping_1s_infinite]"
                            >
                              <animateMotion
                                dur="1s"
                                repeatCount="indefinite"
                                path={
                                  routeTarget === "ai"
                                    ? "M 185 200 Q 230 120 350 140"
                                    : "M 185 200 Q 230 280 350 260"
                                }
                              />
                            </circle>
                          </>
                        )}
                      </svg>

                      {/* Left: Input Nodes */}
                      <div className="flex flex-col gap-12 z-10">
                        {/* GPU Input Node */}
                        <button
                          onClick={() => {
                            setRouteSource("gpu");
                            triggerRouteSimulation();
                          }}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left group ${
                            routeSource === "gpu"
                              ? "bg-white border-brand-green shadow-md text-brand-green scale-105"
                              : "bg-white/80 border-brand-light-beige hover:border-brand-gray text-brand-dark"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg transition-colors ${routeSource === "gpu" ? "bg-brand-green-bg/40 text-brand-green" : "bg-brand-cream text-brand-gray"}`}
                          >
                            <Cpu size={16} />
                          </div>
                          <div>
                            <p className="font-label-caps text-[9px] text-brand-gray">
                              RESOURCE
                            </p>
                            <span className="font-body-sm font-semibold select-none text-[12px]">
                              GPU Cluster
                            </span>
                          </div>
                        </button>

                        {/* API Input Node */}
                        <button
                          onClick={() => {
                            setRouteSource("api");
                            triggerRouteSimulation();
                          }}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left group ${
                            routeSource === "api"
                              ? "bg-white border-brand-green shadow-md text-brand-green scale-105"
                              : "bg-white/80 border-brand-light-beige hover:border-brand-gray text-brand-dark"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg transition-colors ${routeSource === "api" ? "bg-brand-green-bg/40 text-brand-green" : "bg-brand-cream text-brand-gray"}`}
                          >
                            <Globe size={16} />
                          </div>
                          <div>
                            <p className="font-label-caps text-[9px] text-brand-gray">
                              RESOURCE
                            </p>
                            <span className="font-body-sm font-semibold select-none text-[12px]">
                              API Endpoint
                            </span>
                          </div>
                        </button>
                      </div>

                      {/* Center Hub */}
                      <div
                        onClick={triggerRouteSimulation}
                        className="w-16 h-16 bg-brand-green text-white rounded-full flex flex-col items-center justify-center cursor-pointer shadow-lg z-10 animate-soft-pulse hover:scale-110 active:scale-95 transition-all group"
                      >
                        <RefreshCw
                          size={22}
                          className={`group-hover:rotate-180 transition-transform duration-700 ${isSimulatingRoute ? "animate-spin" : ""}`}
                        />
                        <span className="text-[7px] font-label-caps font-bold mt-1 text-brand-green-bg tracking-widest">
                          HUB
                        </span>
                      </div>

                      {/* Right: Consumer Target Nodes */}
                      <div className="flex flex-col gap-12 z-10">
                        {/* AI inference consumer */}
                        <button
                          onClick={() => {
                            setRouteTarget("ai");
                            triggerRouteSimulation();
                          }}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left group ${
                            routeTarget === "ai"
                              ? "bg-white border-brand-green shadow-md text-brand-green scale-105"
                              : "bg-white/80 border-brand-light-beige hover:border-brand-gray text-brand-dark"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg transition-colors ${routeTarget === "ai" ? "bg-brand-green-bg/40 text-brand-green" : "bg-brand-cream text-brand-gray"}`}
                          >
                            <Bot size={16} />
                          </div>
                          <div>
                            <p className="font-label-caps text-[9px] text-brand-gray">
                              CONSUMER
                            </p>
                            <span className="font-body-sm font-semibold select-none text-[12px]">
                              AI Inference
                            </span>
                          </div>
                        </button>

                        {/* Database storage consumer */}
                        <button
                          onClick={() => {
                            setRouteTarget("data");
                            triggerRouteSimulation();
                          }}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left group ${
                            routeTarget === "data"
                              ? "bg-white border-brand-green shadow-md text-brand-green scale-105"
                              : "bg-white/80 border-brand-light-beige hover:border-brand-gray text-brand-dark"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg transition-colors ${routeTarget === "data" ? "bg-brand-green-bg/40 text-brand-green" : "bg-brand-cream text-brand-gray"}`}
                          >
                            <Database size={16} />
                          </div>
                          <div>
                            <p className="font-label-caps text-[9px] text-brand-gray">
                              CONSUMER
                            </p>
                            <span className="font-body-sm font-semibold select-none text-[12px]">
                              Data Storage
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Bottom active logging pane */}
                    <div className="bg-black/90 p-3 rounded-lg font-mono text-[11px] text-zinc-400 border border-brand-light-beige/10">
                      <div className="flex items-center justify-between text-[10px] text-brand-green-bg font-sans uppercase tracking-widest border-b border-white/5 pb-1 mb-1 font-semibold select-none">
                        <span>Terminal Output Logs (Simulated)</span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-ping" />{" "}
                          ROUTING ENGINE STEADY
                        </span>
                      </div>
                      <div className="min-h-12 max-h-16 overflow-y-auto space-y-1">
                        {simulationLogs.length === 0 ? (
                          <div className="text-zinc-500 italic select-none">
                            ◀ Click any Resource Node or Consumer Node above to
                            route traffic instantly...
                          </div>
                        ) : (
                          simulationLogs.map((log, idx) => (
                            <div key={idx} className="flex gap-2">
                              <span className="text-brand-green-bg/70 select-none">
                                ❯
                              </span>
                              <span>{log}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Developer Section matching the code mock visualizer */}
              <section
                id="dev-section"
                className="py-24 bg-brand-dark text-white overflow-hidden relative"
              >
                {/* Visual grid blur accent backgrounds */}
                <div className="absolute w-[300px] h-[300px] bg-brand-green/20 rounded-full blur-[90px] pointer-events-none -left-20 top-1/2 -translate-y-1/2 z-0" />

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full z-10 relative">
                  {/* Explanatory column */}
                  <div className="text-left flex flex-col">
                    <span className="font-label-caps text-brand-green-bg font-semibold tracking-widest text-[11px] mb-4">
                      LIGHTWEIGHT INTEGRATION NODE
                    </span>
                    <h2 className="font-display font-medium text-4xl lg:text-5xl text-white mb-6 tracking-tight leading-[1.12]">
                      Built for developers,
                      <br className="hidden md:inline" /> by aetheris experts.
                    </h2>
                    <p className="font-body-md text-zinc-400 text-[15px] leading-relaxed mb-10 max-w-md">
                      Integrate the protocol in minutes. Our SDK handles
                      everything from identity verification to secure automated
                      routing settlements.
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => {
                          setCurrentView("docs");
                          setActiveTab("Docs");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="px-6 py-3 bg-white text-brand-dark font-label-caps font-semibold rounded-lg hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
                      >
                        Build
                      </button>
                    </div>
                  </div>

                  {/* Code Mock Interactive Terminal */}
                  <div className="flex flex-col">
                    {/* Code Editor block layout with interactive execution */}
                    <div className="bg-black/60 border border-zinc-800 rounded-2xl overflow-hidden font-mono p-6 sm:p-8 text-xs sm:text-[13px] hover:border-brand-green/50 transition-colors duration-500 group relative">
                      {/* Window header controls */}
                      <div className="flex gap-2 justify-between items-center mb-6 border-b border-zinc-800/50 pb-3">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/80" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                        </div>
                        <span className="text-[10px] text-zinc-500 select-none uppercase tracking-widest">
                          ACR-NODE-DAEMON.TS
                        </span>

                        {/* Copy Code button */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              "npm install @aetheris-protocol/sdk-node",
                            );
                            alert("Copied setup code to clipboard!");
                          }}
                          className="flex items-center gap-1 bg-zinc-800/50 text-zinc-400 hover:text-white py-1 px-2 rounded-md hover:bg-zinc-800 transition-all text-[10px] cursor-pointer inline-flex"
                        >
                          <Copy size={11} />
                          <span>COPY SDK</span>
                        </button>
                      </div>

                      {/* Code Area */}
                      <div className="space-y-2 opacity-90 group-hover:opacity-100 transition-opacity text-left">
                        <p className="text-zinc-500 comment select-none">
                          // Install the core SDK
                        </p>
                        <p>
                          <span className="text-zinc-500 font-semibold">
                            npm install
                          </span>{" "}
                          protocol-sdk
                        </p>

                        <p className="pt-3 text-zinc-500 comment select-none">
                          // Initialize connection securely
                        </p>
                        <p>
                          <span className="text-emerald-500">const</span>{" "}
                          <span className="text-zinc-300">node</span> ={" "}
                          <span className="text-emerald-500">new</span>{" "}
                          <span className="text-zinc-300">AetherisNode</span>(
                          {`{`}
                        </p>
                        <p className="pl-4">
                          apiKey:{" "}
                          <span className="text-emerald-400">
                            'INF_LIVE_...'
                          </span>
                          ,
                        </p>
                        <p className="pl-4">
                          resource:{" "}
                          <span className="text-emerald-400">
                            'GPU_CLUSTER_A100'
                          </span>
                        </p>
                        <p>{`});`}</p>

                        <p className="pt-3 text-zinc-500 comment select-none">
                          // Start automatic local host routing
                        </p>
                        <p>
                          <span className="text-zinc-300">node</span>.
                          <span className="text-emerald-500">connect</span>().
                          <span className="text-emerald-500">then</span>(()
                          =&gt; <span className="text-zinc-300">console</span>.
                          <span className="text-emerald-500">log</span>(
                          <span className="text-emerald-400">
                            'Earning Live'
                          </span>
                          ));
                        </p>
                      </div>

                      {/* Run Console Simulator button */}
                      <div className="mt-8 border-t border-zinc-800/80 pt-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-semibold text-zinc-500 font-sans tracking-widest uppercase select-none">
                            Mock Runtime Sandbox Console
                          </span>
                          <button
                            onClick={runDeveloperTerminalSandbox}
                            disabled={isTerminalRunning}
                            className={`px-3.5 py-1.5 rounded-lg text-[11px] font-label-caps flex items-center gap-1.5 transition-all duration-300 ${
                              isTerminalRunning
                                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                : "bg-brand-green hover:bg-brand-green-light text-white cursor-pointer active:scale-95"
                            }`}
                          >
                            <Play size={10} fill="currentColor" />
                            <span>
                              {isTerminalRunning
                                ? "RUNNING..."
                                : "RUN INTERACTIVE CODE"}
                            </span>
                          </button>
                        </div>

                        {/* Terminal Box */}
                        <div className="bg-black/90 rounded-lg p-4 font-mono text-[11px] min-h-24 max-h-36 overflow-y-auto text-left border border-zinc-800 space-y-1">
                          {terminalOutput.length === 0 ? (
                            <div className="text-zinc-600 select-none italic text-[11px]">
                              ◀ Click 'RUN INTERACTIVE CODE' to boot node daemon
                              and simulate connection...
                            </div>
                          ) : (
                            terminalOutput.map((log, idx) => (
                              <div
                                key={idx}
                                className={`leading-relaxed ${log.startsWith("[SUCCESS]") ? "text-emerald-500 font-semibold" : log.startsWith("[EARNINGS]") ? "text-brand-green-bg font-bold animate-pulse" : "text-zinc-300"}`}
                              >
                                {log}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Final CTA marketing */}
              <section className="py-24 px-6 max-w-7xl mx-auto text-center w-full">
                <div className="max-w-3xl mx-auto flex flex-col items-center">
                  <h2 className="font-display-md text-brand-dark mb-6 tracking-tight leading-none text-4xl sm:text-5xl">
                    Put your aetheris computing to work.
                  </h2>
                  <p className="font-body-lg text-brand-gray mb-10 leading-relaxed max-w-lg">
                    Join the protocol today and start earning rewards for the
                    capacity you've already built. No additional overhead. No
                    complexity.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
                    <button
                      onClick={handleStartNodeConnection}
                      className="px-10 py-5 bg-brand-green text-white font-body-md rounded-lg hover:bg-brand-green-light hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                    >
                      Get Started Now
                    </button>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {currentView === "console" && (
            // Console Sub-view (Interactive Dashboard Mode)
            <motion.div
              key="console-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto px-6 py-10 w-full flex flex-col text-left"
            >
              {/* Dashboard Console Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-brand-light-beige/30 pb-8 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 bg-brand-green rounded-full animate-ping" />
                    <span className="font-label-caps text-brand-green text-[10px] font-bold tracking-widest">
                      LIVE MULTIPLEXER DASHBOARD
                    </span>
                  </div>
                  <h1 className="font-display font-medium text-3xl lg:text-4xl text-brand-dark tracking-tight">
                    Network Console Monitor
                  </h1>
                </div>

                {/* Top stats info box */}
                <div className="flex flex-wrap items-center gap-6">
                  <div className="p-4 bg-white border border-brand-light-beige rounded-xl flex items-center gap-3">
                    <div className="p-2.5 bg-brand-green-bg/30 text-brand-green rounded-lg">
                      <Wallet size={18} />
                    </div>
                    <div>
                      <p className="font-label-caps text-brand-gray text-[9px]">
                        TOTAL ESTIMATED YIELD
                      </p>
                      <span className="font-mono text-base font-bold text-brand-dark block">
                        ${totalYield.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Add Connected Node call */}
                  <button
                    onClick={handleStartNodeConnection}
                    className="px-4 py-3 bg-brand-green text-white hover:bg-brand-green-light font-label-caps text-[11px] rounded-xl flex items-center gap-1.5 shadow-sm transition-all duration-300 active:scale-95 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>ADD CAPACITY NODE</span>
                  </button>
                </div>
              </div>

              {/* Grid Overview of Active Nodes & Realtime Transactions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Columns (My Nodes) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div className="bg-white border border-brand-light-beige rounded-[20px] p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-display font-medium text-[19px] text-brand-dark flex items-center gap-2">
                        <Server size={18} className="text-brand-green" />
                        My Registered Capacity Nodes
                      </h3>
                      <span className="text-[10px] text-brand-gray font-mono font-medium">
                        {nodes.length} Host Nodes active
                      </span>
                    </div>

                    {/* Nodes custom layout block list */}
                    <div className="space-y-4">
                      {nodes.map((node) => (
                        <div
                          key={node.id}
                          className="p-5 bg-brand-cream/60 border border-brand-light-beige/30 rounded-xl hover:bg-brand-cream hover:border-brand-green/30 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="p-3 bg-white border border-brand-light-beige rounded-xl text-brand-green">
                              {node.type === "gpu" && <Cpu size={20} />}
                              {node.type === "agent" && <Bot size={20} />}
                              {node.type === "api" && <Globe size={20} />}
                              {node.type === "storage" && (
                                <Database size={20} />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-body-md font-semibold text-brand-dark text-[15px]">
                                  {node.name}
                                </h4>
                                <span className="font-mono text-[9px] bg-brand-light-beige/40 text-brand-gray px-1.5 py-0.5 rounded uppercase font-medium">
                                  {node.id}
                                </span>
                              </div>
                              <p className="font-body-sm text-brand-gray text-[12px] flex items-center gap-1.5 mt-0.5">
                                <span>
                                  Rate:{" "}
                                  <span className="font-mono font-medium">
                                    ${node.rate}/unit
                                  </span>
                                </span>
                                <span className="text-brand-light-beige/80">
                                  |
                                </span>
                                <span>
                                  Uptime:{" "}
                                  <span className="font-mono">
                                    {node.uptime}
                                  </span>
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Stat outputs */}
                          <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-y-0 border-brand-light-beige/30 pt-3 sm:pt-0 sm:pl-3.5">
                            <div className="text-left sm:text-right">
                              <p className="font-label-caps text-brand-gray text-[9px]">
                                EARNED
                              </p>
                              <span className="font-mono text-[14px] font-bold text-brand-green block">
                                +${node.earned.toFixed(2)}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-brand-light-beige select-none">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  node.status === "ACTIVE"
                                    ? "bg-emerald-500 animate-pulse"
                                    : node.status === "ROUTING"
                                      ? "bg-brand-green animate-ping"
                                      : "bg-zinc-400"
                                }`}
                              />
                              <span className="font-label-caps text-[9px] font-bold text-brand-gray">
                                {node.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick tip info box */}
                    <div className="mt-6 p-4 bg-brand-green-bg/20 border border-brand-green-bg/30 text-brand-green rounded-xl flex items-start gap-2.5">
                      <Info size={16} className="mt-0.5 shrink-0" />
                      <p className="font-body-sm text-[12px] text-brand-green-light leading-relaxed">
                        <strong>Multiplexer Node Optimization:</strong> Secure
                        routing payouts are auto-settled onto the integrated
                        ledger as microtransactions every time an API or compute
                        routing occurs on your hosts.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column (Transactions explorer panel) */}
                <div className="flex flex-col gap-6">
                  <div className="bg-white border border-brand-light-beige rounded-[20px] p-6 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-display font-medium text-[19px] text-brand-dark flex items-center gap-2">
                        <Activity size={18} className="text-brand-green" />
                        Live Routing Ledger
                      </h3>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    </div>

                    {/* Live stream */}
                    <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                      {transactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="p-4 bg-brand-cream/40 border border-brand-light-beige/20 rounded-xl hover:border-brand-green/30 transition-all flex flex-col gap-2 relative overflow-hidden group"
                        >
                          {/* Top row */}
                          <div className="flex justify-between items-center font-mono text-[10px]">
                            <span className="text-brand-green font-semibold">
                              {tx.id}
                            </span>
                            <span className="text-zinc-400">
                              {tx.timestamp}
                            </span>
                          </div>

                          {/* Center routing layout */}
                          <div className="flex items-center gap-2 text-zinc-700 leading-snug">
                            <span className="font-body-sm font-semibold text-brand-dark select-none text-[12px]">
                              {tx.resource}
                            </span>
                            <ChevronRight size={12} className="text-zinc-300" />
                            <span className="font-body-sm text-brand-green-light text-[12px] font-medium">
                              {tx.destination}
                            </span>
                          </div>

                          {/* Footer parameters */}
                          <div className="flex justify-between items-center border-t border-brand-light-beige/30 pt-1.5 mt-0.5">
                            <span className="text-[10px] text-zinc-400 font-mono">
                              LATENCY: {tx.latency}
                            </span>
                            <span className="text-[12px] font-mono font-bold text-brand-green group-hover:scale-105 transition-transform">
                              +${tx.payout.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total summary of activity in past hours */}
                    <div className="mt-4 border-t border-brand-light-beige/40 pt-4 flex justify-between items-center text-xs select-none">
                      <span className="text-zinc-500">
                        Live feed auto-updates
                      </span>
                      <span className="bg-brand-green/5 text-brand-green px-2 py-0.5 rounded font-mono font-semibold">
                        Active Tunnel Pool
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === "product" && (
            <motion.div
              key="product-view"
              className="w-full"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <ProductPage
                onStartEarning={handleStartNodeConnection}
                onNavigateToDocs={() => {
                  setCurrentView("docs");
                  setActiveTab("Docs");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </motion.div>
          )}

          {currentView === "solutions" && (
            <motion.div
              key="solutions-view"
              className="w-full"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <SolutionsPage onStartEarning={handleStartNodeConnection} />
            </motion.div>
          )}

          {currentView === "resources" && (
            <motion.div
              key="resources-view"
              className="w-full"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <ResourcesPage
                onNavigateToDocs={() => {
                  setCurrentView("docs");
                  setActiveTab("Docs");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onStartEarning={handleStartNodeConnection}
              />
            </motion.div>
          )}

          {currentView === "docs" && (
            <motion.div
              key="docs-view"
              className="w-full"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <DocsPage onStartEarning={handleStartNodeConnection} />
            </motion.div>
          )}

          {currentView === "auth" && (
            <motion.div
              key="auth-view"
              className="w-full"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <AuthPage
                initialMode={authMode}
                onCancel={() => {
                  setCurrentView("landing");
                }}
                onAuthSuccess={(user) => {
                  setCurrentUser(user);
                  setCurrentView("dashboard");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </motion.div>
          )}

          {currentView === "dashboard" && currentUser && (
            <motion.div
              key="dashboard-view"
              className="w-full"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <DashboardPage currentUser={currentUser} />
            </motion.div>
          )}

          {currentView === "privacy" && (
            <motion.div
              key="privacy-view"
              className="w-full"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <PrivacyPolicyPage />
            </motion.div>
          )}

          {currentView === "terms" && (
            <motion.div
              key="terms-view"
              className="w-full"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <TermsOfServicePage />
            </motion.div>
          )}

          {currentView === "cookie" && (
            <motion.div
              key="cookie-view"
              className="w-full"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <CookiePolicyPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Stepper Node Connection Interactive Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/45 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-brand-light-beige rounded-[24px] max-w-lg w-full shadow-2xl flex flex-col"
            >
              {/* Modal header */}
              <div className="flex justify-between items-center px-6 py-4.5 bg-brand-cream border-b border-brand-light-beige/50">
                <span className="font-label-caps text-[11px] text-brand-green font-bold tracking-widest uppercase">
                  Node Setup Wizard — Step {modalStep} of 4
                </span>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 px-2.5 rounded-lg hover:bg-brand-light-beige/50 text-brand-gray hover:text-brand-dark transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-brand-light-beige w-full relative">
                <div
                  className="h-full bg-brand-green transition-all duration-300"
                  style={{ width: `${(modalStep / 4) * 100}%` }}
                />
              </div>

              {/* Stepper Content */}
              <div className="p-6 flex-grow overflow-y-auto min-h-[320px]">
                <AnimatePresence mode="sync">
                  {modalStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex flex-col text-left">
                        <h3 className="font-display font-medium text-[20px] text-brand-dark mb-2">
                          Choose Your Resource Type
                        </h3>
                        <p className="font-body-sm text-brand-gray text-[13px] mb-6">
                          Decide what capacity class you wish to allocate onto
                          the global protocol routing cluster indexing tables.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          {
                            type: "gpu",
                            title: "GPU / Compute",
                            desc: "For LLM inference pipelines & generative nodes",
                            icon: Cpu,
                          },
                          {
                            type: "agent",
                            title: "AI Agent Runner",
                            desc: "For hosting autonomous agent executor loop hosts",
                            icon: Bot,
                          },
                          {
                            type: "api",
                            title: "API Endpoint",
                            desc: "For REST webhook, relay & caching pipelines",
                            icon: Globe,
                          },
                          {
                            type: "storage",
                            title: "Storage Space",
                            desc: "Secure caching, IPFS hosting, and data layers",
                            icon: Database,
                          },
                        ].map((opt) => {
                          const IconComp = opt.icon;
                          return (
                            <button
                              key={opt.type}
                              onClick={() => setNewNodeType(opt.type as any)}
                              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all gap-4 select-none cursor-pointer ${
                                newNodeType === opt.type
                                  ? "bg-brand-green-bg/25 border-brand-green text-brand-green shadow-sm"
                                  : "border-brand-light-beige hover:border-brand-gray text-brand-dark bg-white"
                              }`}
                            >
                              <IconComp
                                size={20}
                                className={
                                  newNodeType === opt.type
                                    ? "text-brand-green font-bold"
                                    : "text-brand-gray"
                                }
                              />
                              <div>
                                <h4 className="font-body-md font-semibold text-[14px] leading-tight mb-1">
                                  {opt.title}
                                </h4>
                                <p className="text-[11px] text-brand-gray leading-snug">
                                  {opt.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button
                          onClick={() => setModalStep(2)}
                          className="px-5 py-2.5 bg-brand-green hover:bg-brand-green-light text-white font-label-caps text-[11px] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>CONTINUE</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {modalStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex flex-col text-left">
                        <h3 className="font-display font-medium text-[20px] text-brand-dark mb-2">
                          Label Your Node Host
                        </h3>
                        <p className="font-body-sm text-brand-gray text-[13px] mb-6">
                          Provide a human-friendly name identifier to help
                          manage your telemetry metrics and routing log
                          pipelines.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <label className="font-label-caps text-brand-gray text-[10px] font-medium tracking-wider">
                          HOST SPECIFICATION NAME
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. London Host RTX 4090"
                          value={newNodeName}
                          onChange={(e) => setNewNodeName(e.target.value)}
                          className="w-full p-3.5 bg-brand-cream border border-brand-light-beige rounded-xl focus:border-brand-green focus:ring-1 focus:ring-brand-green/40 mt-1 select-all font-body-md text-brand-dark text-sm"
                        />
                        <p className="text-[11px] text-brand-gray leading-relaxed italic">
                          Tip: You can change the registered name later from
                          your client control settings panel.
                        </p>
                      </div>

                      <div className="mt-12 flex justify-between">
                        <button
                          onClick={() => setModalStep(1)}
                          className="px-4.5 py-2.5 border border-brand-light-beige hover:bg-zinc-100 text-brand-gray font-label-caps text-[11px] rounded-lg transition-all"
                        >
                          BACK
                        </button>
                        <button
                          onClick={executeModalStep2}
                          className="px-5 py-2.5 bg-brand-green hover:bg-brand-green-light text-white font-label-caps text-[11px] rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>CONTINUE</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {modalStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex flex-col text-left">
                        <h3 className="font-display font-medium text-[20px] text-brand-dark mb-1">
                          Boot & Handshake Node
                        </h3>
                        <p className="font-body-sm text-brand-gray text-[13px] mb-4">
                          Start the lightweight protocol simulation to verify
                          network connectivity, enclave certifications, and
                          resource bandwidth.
                        </p>
                      </div>
                      {/* Pre-formatted Copier Box */}
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-[11px] text-zinc-300 leading-normal mb-4 text-left relative group">
                        <p className="text-zinc-500 mb-0.5 select-none font-sans uppercase tracking-widest text-[9px] font-bold">
                          Copy setup command
                        </p>
                        <code className="text-emerald-400">
                          docker run -d -e API_KEY="INF_LIVE_V4"
                          protocol-node/server
                        </code>
                      </div>

                      {/* Handshake simulate Terminal output */}
                      <div className="bg-black/95 rounded-xl p-4 font-mono text-[10px] min-h-28 max-h-36 overflow-y-auto border border-zinc-850 text-left space-y-1 mb-4">
                        {terminalLogs.length === 0 ? (
                          <div className="text-zinc-650 italic select-none">
                            ◀ Click 'SIMULATE LINK HANDSHAKE' below to establish
                            secure cryptographic routing tunnel...
                          </div>
                        ) : (
                          terminalLogs.filter(Boolean).map((log, idx) => (
                            <div
                              key={idx}
                              className={
                                log.startsWith("✔")
                                  ? "text-emerald-500"
                                  : log.startsWith("▶")
                                    ? "text-zinc-300"
                                    : "text-yellow-500"
                              }
                            >
                              {log}
                            </div>
                          ))
                        )}
                      </div>

                      <div className="flex justify-between items-center gap-4">
                        <button
                          onClick={() => setModalStep(2)}
                          disabled={isSimulatingLink}
                          className={`px-4 py-2.5 border border-brand-light-beige text-brand-gray font-label-caps text-[11px] rounded-lg transition-all ${isSimulatingLink ? "opacity-40 cursor-not-allowed" : "hover:bg-zinc-100"}`}
                        >
                          BACK
                        </button>

                        <button
                          onClick={simulateStep3NodeLink}
                          disabled={isSimulatingLink}
                          className={`px-5 py-2.5 bg-black text-white hover:bg-zinc-900 font-label-caps text-[11px] rounded-lg transition-all ${
                            isSimulatingLink
                              ? "opacity-60 cursor-not-allowed animate-pulse"
                              : "cursor-pointer active:scale-95"
                          }`}
                        >
                          {isSimulatingLink
                            ? "VERIFYING ENCLAVE..."
                            : "SIMULATE LINK HANDSHAKE"}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {modalStep === 4 && (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-center flex flex-col items-center py-4">
                        <div className="w-16 h-16 bg-brand-green text-white rounded-full flex items-center justify-center mb-6 shadow-md animate-bounce">
                          <Check size={32} />
                        </div>
                        <h3 className="font-display font-medium text-2xl text-brand-dark mb-3">
                          Connection Confirmed!
                        </h3>
                        <p className="font-body-md text-brand-gray text-[14px] max-w-sm mb-8 leading-relaxed">
                          Your host node labeled{" "}
                          <strong>"{newNodeName}"</strong> has been
                          cryptographically certified and linked. Live routing
                          is active.
                        </p>

                        <button
                          onClick={finishNodeConnection}
                          className="px-12 py-4 bg-brand-green text-white hover:bg-brand-green-light font-label-caps text-[11.5px] font-semibold rounded-lg shadow transition-all active:scale-98 duration-200 uppercase tracking-wider cursor-pointer"
                        >
                          Commit Node to Ledger & Close
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Structured Footer matching landing specs */}
      <footer className="bg-white border-t border-brand-light-beige/40 py-16 px-6 w-full z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-left animate-fade-in">
          <div className="col-span-1">
            <div className="font-display font-medium text-2xl text-brand-green mb-4 tracking-tighter">
              AETHERIS
            </div>
            <p className="font-body-sm text-brand-gray leading-relaxed text-[13px]">
              Institutional-grade reliability for the decentralized physical
              compute future.
            </p>
          </div>

          <div>
            <h6 className="font-label-caps text-brand-dark mb-5 text-[11px] tracking-wider font-semibold">
              LEGAL
            </h6>
            <ul className="space-y-3 font-body-sm text-[13px] text-brand-gray">
              <li>
                <button
                  onClick={() => {
                    setCurrentView("privacy");
                    setActiveTab("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-brand-green transition-all hover:pl-1 text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView("terms");
                    setActiveTab("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-brand-green transition-all hover:pl-1 text-left cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView("cookie");
                    setActiveTab("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-brand-green transition-all hover:pl-1 text-left cursor-pointer"
                >
                  Cookie & Storage Policy
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="font-label-caps text-brand-dark mb-5 text-[11px] tracking-wider font-semibold">
              CONNECT
            </h6>
            <ul className="space-y-3 font-body-sm text-[13px] text-brand-gray">
              <li>
                <a
                  href="https://x.com/useaetheris2026"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brand-green transition-all hover:pl-1 block text-left"
                >
                  Twitter / X
                </a>
              </li>

              <li>
                <a
                  href="https://t.me/earnaetheris"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-brand-green transition-all hover:pl-1 block text-left"
                >
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-brand-light-beige/20 text-center text-xs text-brand-gray flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>
            © 2026 Aetheris Protocol. Institutional-grade physical computing
            routing layer.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
            <button
              onClick={() => {
                setCurrentView("landing");
                setActiveTab("");
                window.scrollTo({ top: 0 });
              }}
              className="hover:text-brand-green cursor-pointer"
            >
              Home
            </button>
            <span className="text-zinc-300 select-none">•</span>
            <button
              onClick={() => {
                setCurrentView("product");
                setActiveTab("Product");
                window.scrollTo({ top: 0 });
              }}
              className="hover:text-brand-green cursor-pointer"
            >
              Product
            </button>
            <span className="text-zinc-300 select-none">•</span>
            <button
              onClick={() => {
                setCurrentView("solutions");
                setActiveTab("Solutions");
                window.scrollTo({ top: 0 });
              }}
              className="hover:text-brand-green cursor-pointer"
            >
              Solutions
            </button>
            <span className="text-zinc-300 select-none">•</span>
            <button
              onClick={() => {
                setCurrentView("resources");
                setActiveTab("Resources");
                window.scrollTo({ top: 0 });
              }}
              className="hover:text-brand-green cursor-pointer"
            >
              Resources
            </button>

            <span className="text-zinc-300 select-none">•</span>
            <button
              onClick={() => {
                setCurrentView("developers");
                setActiveTab("Developers");
                window.scrollTo({ top: 0 });
              }}
              className="hover:text-brand-green cursor-pointer"
            >
              Developers
            </button>
            <span className="text-zinc-300 select-none">•</span>
            <button
              onClick={() => {
                setCurrentView("docs");
                setActiveTab("Docs");
                window.scrollTo({ top: 0 });
              }}
              className="hover:text-brand-green cursor-pointer"
            >
              Docs
            </button>
            <span className="text-zinc-300 select-none">•</span>
            <button
              onClick={() => {
                setCurrentView("console");
                setActiveTab("");
                window.scrollTo({ top: 0 });
              }}
              className="hover:text-brand-green cursor-pointer"
            >
              Interactive Console
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
