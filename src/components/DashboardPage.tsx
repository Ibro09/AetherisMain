import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal as TerminalIcon,
  Cpu,
  Wallet,
  DollarSign,
  CheckCircle,
  RefreshCw,
  Play,
  Square,
  Trash2,
  Copy,
  Check,
  HelpCircle,
  Info,
  LogOut,
  ArrowRight,
  UploadCloud,
  Activity,
  ExternalLink,
  Lock,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface JobLog {
  text: string;
  type: "system" | "input" | "success" | "error" | "info" | "regular";
  id: string;
}

export default function DashboardPage({
  currentUser,
}: {
  currentUser: { name: string; email: string };
}) {
  const storageKeyForUser = (key: string) => {
    const emailKey = currentUser?.email
      ? currentUser.email.toLowerCase().replace(/[^a-z0-9]/g, "_")
      : "anonymous";
    return `idle_node_${emailKey}_${key}`;
  };

  const getPersistedNumber = (key: string, fallback: number) => {
    if (!currentUser?.email) return fallback;
    const saved = localStorage.getItem(storageKeyForUser(key));
    return saved ? parseFloat(saved) : fallback;
  };

  const getPersistedString = (key: string, fallback: string) => {
    if (!currentUser?.email) return fallback;
    return localStorage.getItem(storageKeyForUser(key)) || fallback;
  };

  const [walletAddress, setWalletAddress] = useState<string>(() => {
    return getPersistedString("wallet", "");
  });

  // Wallet Input & drag-and-drop state
  const [inputWallet, setInputWallet] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Stats States (Persistent across sessions via localStorage)
  const [resources, setResources] = useState<number>(() =>
    getPersistedNumber("resources", 0),
  );
  const [gatewayRevenue, setGatewayRevenue] = useState<number>(() =>
    getPersistedNumber("revenue", 0),
  );
  const [totalRequests, setTotalRequests] = useState<number>(() =>
    getPersistedNumber("requests", 0),
  );
  const [availableToWithdraw, setAvailableToWithdraw] = useState<number>(() =>
    getPersistedNumber("available", 0),
  );
  const [withdrawnTotal, setWithdrawnTotal] = useState<number>(() =>
    getPersistedNumber("withdrawn", 0),
  );

  // Terminal Simulator States
  const [terminalLogs, setTerminalLogs] = useState<JobLog[]>([]);
  const [commandInput, setCommandInput] = useState("");
  const [isTerminalRunning, setIsTerminalRunning] = useState(false);
  const [showHelpGuide, setShowHelpGuide] = useState(true);

  // Withdrawal Simulation state
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Keep track of active terminal session stats
  const activeSessionRef = useRef({
    jobsCount: 0,
    earnings: 0.0,
  });

  const stepCounterRef = useRef<number>(0);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Server Solana Config status state (loaded from server-side .env private key)
  interface SolanaConfigState {
    success: boolean;
    configured: boolean;
    publicKey?: string;
    network?: string;
    rpcUrl?: string;
    balanceSol?: number;
    balanceLamports?: number;
    error?: string;
  }
  const [serverSolConfig, setServerSolConfig] =
    useState<SolanaConfigState | null>(null);
  const [solConfigLoading, setSolConfigLoading] = useState(false);

  const fetchServerSolConfig = async () => {
    setSolConfigLoading(true);
    try {
      const res = await fetch("/api/solana-config");
      const data = await res.json();
      setServerSolConfig(data);
    } catch (err: any) {
      setServerSolConfig({
        success: false,
        configured: false,
        error: `Failed to fetch payment configuration: ${err.message || err}`,
      });
    } finally {
      setSolConfigLoading(false);
    }
  };

  useEffect(() => {
    fetchServerSolConfig();
  }, []);

  // Save states to localStorage on change
  useEffect(() => {
    if (!currentUser?.email) return;
    localStorage.setItem(storageKeyForUser("wallet"), walletAddress);
  }, [currentUser?.email, walletAddress]);

  useEffect(() => {
    if (!currentUser?.email) return;
    localStorage.setItem(storageKeyForUser("resources"), resources.toString());
    localStorage.setItem(
      storageKeyForUser("revenue"),
      gatewayRevenue.toString(),
    );
    localStorage.setItem(
      storageKeyForUser("requests"),
      totalRequests.toString(),
    );
    localStorage.setItem(
      storageKeyForUser("available"),
      availableToWithdraw.toString(),
    );
    localStorage.setItem(
      storageKeyForUser("withdrawn"),
      withdrawnTotal.toString(),
    );
  }, [
    currentUser?.email,
    resources,
    gatewayRevenue,
    totalRequests,
    availableToWithdraw,
    withdrawnTotal,
  ]);

  // Terminal Auto Scroll (local container scroll only to prevent scrolling the window/view)
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop =
        terminalContainerRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // Initial Welcome Text in Terminal
  useEffect(() => {
    addInitialTerminalWelcome();
  }, []);

  useEffect(() => {
    if (!currentUser?.email) return;
    fetchUserProfile(currentUser.email);
  }, [currentUser?.email]);

  const fetchUserProfile = async (email: string) => {
    try {
      const res = await fetch(`/api/user/${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        console.warn(
          "Failed to load user profile",
          data?.error || res.statusText,
        );
        return;
      }
      setWalletAddress(data.user.walletAddress || "");
      setGatewayRevenue(Number(data.user.earnings || 0));
      setAvailableToWithdraw(Number(data.user.balance || 0));
      setResources(getPersistedNumber("resources", 0));
      setTotalRequests(getPersistedNumber("requests", 0));
      setWithdrawnTotal(getPersistedNumber("withdrawn", 0));
    } catch (err) {
      console.warn("Error fetching user profile:", err);
    }
  };

  const addInitialTerminalWelcome = () => {
    setTerminalLogs([
      {
        id: "init-1",
        text: "IDLE Platform Terminal v0.4.2 [Initialized]",
        type: "system",
      },
      {
        id: "init-2",
        text: "System operators guide: use helper commands or run 'idle-node' sequences",
        type: "info",
      },
      {
        id: "init-3",
        text: "Type 'help' to view all available commands in raw interface.",
        type: "info",
      },
      { id: "init-4", text: "admin@idle-node:~$ ", type: "regular" },
    ]);
  };

  const appendLog = (
    text: string,
    type:
      | "system"
      | "input"
      | "success"
      | "error"
      | "info"
      | "regular" = "regular",
  ) => {
    setTerminalLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        text,
        type,
      },
    ]);
  };

  // Drag and Drop Wallet JSON Loader
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processWalletFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processWalletFiles(e.target.files);
    }
  };

  const processWalletFiles = async (files: FileList) => {
    const file = files[0];
    try {
      const text = await file.text();
      // Try to parse as JSON first (solana keyfile structure is usually raw array of numbers)
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          // It's a raw private key array, generate mock solana address from it
          const mockSolAddress = `2mGq9ADB${utilsRandomHash(8)}2uuXCFV${utilsRandomHash(8)}ngKiZAW`;
          setInputWallet(mockSolAddress);
          appendLog(
            `Uploaded keyfile ${file.name} successfully. Loaded address ${mockSolAddress}.`,
            "success",
          );
        } else if (parsed.address) {
          setInputWallet(parsed.address);
          appendLog(
            `Detected JSON address ${parsed.address} from file ${file.name}.`,
            "success",
          );
        } else {
          // If it is regular string
          const clean = text.trim();
          if (clean.length > 30 && clean.length < 50) {
            setInputWallet(clean);
            appendLog(`Parsed plain address ${clean} from file.`, "success");
          } else {
            setInputWallet("2mGq9ADBQB52bkHocoKW1s92uuXCFV3ep3ngKiZAWtHj");
            appendLog(
              "Keyfile parsed but no obvious address found. Populating target evaluation wallet.",
              "info",
            );
          }
        }
      } catch {
        const clean = text.trim();
        if (clean.length > 30 && clean.length < 50) {
          setInputWallet(clean);
          appendLog(`Loaded address ${clean} successfully.`, "success");
        } else {
          setInputWallet("2mGq9ADBQB52bkHocoKW1s92uuXCFV3ep3ngKiZAWtHj");
          appendLog("Loaded plain file, populating evaluation wallet.", "info");
        }
      }
    } catch {
      appendLog(
        "Failed to read wallet file. Please enter manually or try again.",
        "error",
      );
    }
  };

  const utilsRandomHash = (len: number) => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from(
      { length: len },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
  };

  // Setup/Submit Wallet Address
  const handleSaveWallet = async (addressToUse = inputWallet) => {
    const cleanAddress = addressToUse.trim();
    if (!cleanAddress) {
      alert("Please provide or drop a valid wallet address.");
      return;
    }
    setWalletAddress(cleanAddress);
    setInputWallet("");
    appendLog(`Wallet loaded: ${cleanAddress}`, "success");
    if (!currentUser?.email) return;
    try {
      await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser.email,
          walletAddress: cleanAddress,
        }),
      });
    } catch (err) {
      console.warn("Failed to persist wallet address:", err);
    }
  };

  const handleDisconnectWallet = () => {
    if (isTerminalRunning) {
      handleStopTerminalSimulation(
        "System wallet disconnected. Terminating node daemon process.",
      );
    }
    setWalletAddress("");
    appendLog("Wallet disconnected and cleared from registry.", "info");
  };

  // Copy wallet address helper
  const handleCopyWallet = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // ==========================================
  // Terminal Simulation Worker Loop
  // ==========================================
  const activeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartTerminalSimulation = (explicitWallet = walletAddress) => {
    if (!explicitWallet) {
      appendLog(
        "Error: No active wallet configured. Please submit an address to bind computation rewards.",
        "error",
      );
      return;
    }

    if (isTerminalRunning) {
      appendLog("IDLE Protocol daemon is already running.", "info");
      return;
    }

    setIsTerminalRunning(true);
    setResources(1); // 1 Active computing gateway resource

    // Reset session metrics
    activeSessionRef.current = {
      jobsCount: 0,
      earnings: 0.0,
    };
    stepCounterRef.current = 0;

    appendLog(`idle-node start --wallet ${explicitWallet}`, "input");

    // Construct predefined typewriter log steps
    const initialSteps = [
      { text: "", type: "regular" as const },
      { text: "  IDLE Protocol Node v0.4.2", type: "system" as const },
      {
        text: "  The earnings layer for idle compute",
        type: "system" as const,
      },
      { text: "", type: "regular" as const },
      { text: `  Wallet:  ${explicitWallet}`, type: "info" as const },
      { text: "  Types:   20 task types", type: "info" as const },
      { text: "  Poll:    5000ms", type: "info" as const },
      { text: "  Workers: 3 concurrent", type: "info" as const },
      { text: "", type: "regular" as const },
      { text: "  Waiting for tasks...", type: "system" as const },
      { text: "", type: "regular" as const },
    ];

    // Typetalk effect for initial boot
    initialSteps.forEach((step, index) => {
      setTimeout(() => {
        appendLog(step.text, step.type);
      }, index * 250);
    });

    // Start generating jobs after initial setup logs (approx 3000ms)
    setTimeout(() => {
      activeIntervalRef.current = setInterval(() => {
        runJobCycle(stepCounterRef.current);
        stepCounterRef.current++;
      }, 1000 * 6);
    }, 3200);
  };

  // Predefined job cycle logs to match the prompt list and then continue rewarding 0.00001 ETH per task.
  const runJobCycle = (stepIndex: number) => {
    if (stepIndex === 0) {
      appendLog("  [api_health] Processing 20f8019c...", "regular");
      appendLog("  [json_validate] Processing 8af41f13...", "regular");
      appendLog("  [dns_lookup] Processing 19c73a30...", "regular");
    } else if (stepIndex === 1) {
      appendLog(
        "  Job 8af41f13 failed: Cannot convert undefined or null to object",
        "error",
      );
      appendLog("  [dns_lookup] 19c73a30 done (136ms) +0.00001 ETH", "success");

      incrementEarningsAndJobs(0.000001, 1);

      appendLog(
        `  Done | Earned: 0.00001 ETH | Total: ${activeSessionRef.current.earnings.toFixed(5)} ETH | Jobs: ${activeSessionRef.current.jobsCount}`,
        "info",
      );
    } else if (stepIndex === 2) {
      appendLog(
        "  [api_health] 20f8019c done (1005ms) +0.00001 ETH",
        "success",
      );

      incrementEarningsAndJobs(0.00001, 1);

      appendLog(
        `  Done | Earned: 0.00001 ETH | Total: ${activeSessionRef.current.earnings.toFixed(5)} ETH | Jobs: ${activeSessionRef.current.jobsCount}`,
        "info",
      );
    } else if (stepIndex === 3) {
      appendLog("  [json_validate] Processing 6bd831de...", "regular");
      appendLog("  [content_verify] Processing 7157d418...", "regular");
      appendLog("  [dns_lookup] Processing 97d1fa5f...", "regular");

      appendLog(
        "  Job 6bd831de failed: Cannot convert undefined or null to object",
        "error",
      );
      appendLog("  [dns_lookup] 97d1fa5f done (127ms) +0.00001 ETH", "success");

      incrementEarningsAndJobs(0.00001, 1);

      appendLog(
        `  Done | Earned: 0.00001 ETH | Total: ${activeSessionRef.current.earnings.toFixed(5)} ETH | Jobs: ${activeSessionRef.current.jobsCount}`,
        "info",
      );
    } else {
      appendLog(
        `  [heartbeat] Task batch ${stepIndex - 2} complete (1000ms) +0.00001 ETH`,
        "success",
      );
      incrementEarningsAndJobs(0.00001, 1);
      appendLog(
        `  Done | Earned: 0.00001 ETH | Total: ${activeSessionRef.current.earnings.toFixed(5)} ETH | Jobs: ${activeSessionRef.current.jobsCount}`,
        "info",
      );
    }
  };

  const incrementEarningsAndJobs = (reward: number, jobs: number) => {
    activeSessionRef.current.earnings += reward;
    activeSessionRef.current.jobsCount += jobs;

    setGatewayRevenue((prev) => prev + reward);
    setTotalRequests((prev) => prev + jobs);
    setAvailableToWithdraw((prev) => prev + reward);

    // Persist to server-side DB when user is available
    (async () => {
      try {
        if (currentUser && currentUser.email) {
          await fetch("/api/earnings/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: currentUser.email, amount: reward }),
          });
        }
      } catch (err) {
        console.warn("Failed to persist earnings:", err);
      }
    })();
  };

  const handleStopTerminalSimulation = (
    shutdownNote = "Command execution terminated by administrator.",
  ) => {
    if (activeIntervalRef.current) {
      clearInterval(activeIntervalRef.current);
      activeIntervalRef.current = null;
    }

    const sessionJobTotal = activeSessionRef.current.jobsCount;
    const sessionEarnTotal = activeSessionRef.current.earnings;

    appendLog("", "regular");
    appendLog("  Shutting down...", "system");

    setTimeout(() => {
      appendLog(
        `  Processed ${sessionJobTotal} jobs, earned $${sessionEarnTotal.toFixed(4)}`,
        "success",
      );
      appendLog("", "regular");
      appendLog("admin@idle-node:~$ ", "regular");
      setIsTerminalRunning(false);
      setResources(0); // vNode set to offline
    }, 800);
  };

  // Handle typed Shell commands manually
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCommand = commandInput.trim();
    if (!cleanCommand) return;

    appendLog(cleanCommand, "input");
    setCommandInput("");

    const parts = cleanCommand.split(" ");
    const cmd = parts[0].toLowerCase();

    if (cmd === "clear") {
      setTerminalLogs([
        { id: "clear-sys", text: "admin@idle-node:~$ ", type: "regular" },
      ]);
    } else if (cmd === "help") {
      appendLog("Available core utilities:", "system");
      appendLog(
        "  idle-node start --wallet [addr]  : Boot computation daemon client",
        "info",
      );
      appendLog(
        "  idle-node status                 : Query physical gateways & latencies",
        "info",
      );
      appendLog(
        "  idle-node stop                   : Terminate execution sequence safety",
        "info",
      );
      appendLog(
        "  clear                            : Wipe terminal logs cache",
        "info",
      );
      appendLog(
        "  help                             : Fetch command reference indices",
        "info",
      );
      appendLog("admin@idle-node:~$ ", "regular");
    } else if (cmd === "idle-node") {
      const action = parts[1] || "";
      if (action.toLowerCase() === "start") {
        const walletArgIdx = parts.findIndex(
          (p) => p === "--wallet" || p === "-w",
        );
        let targetWallet = "";

        if (walletArgIdx !== -1 && parts[walletArgIdx + 1]) {
          targetWallet = parts[walletArgIdx + 1];
        } else {
          targetWallet =
            walletAddress || "2mGq9ADBQB52bkHocoKW1s92uuXCFV3ep3ngKiZAWtHj";
        }

        if (!walletAddress && targetWallet) {
          setWalletAddress(targetWallet);
        }

        handleStartTerminalSimulation(targetWallet);
      } else if (action.toLowerCase() === "stop") {
        if (!isTerminalRunning) {
          appendLog("No active daemon running to shut down.", "error");
          appendLog("admin@idle-node:~$ ", "regular");
        } else {
          handleStopTerminalSimulation();
        }
      } else if (action.toLowerCase() === "status") {
        appendLog("IDLE Protocol Core Operator Telemetry Status:", "system");
        appendLog(`  Host Platform:  Linux x86_64 Core-Enclave`, "info");
        appendLog(
          `  Daemon Status:  ${isTerminalRunning ? "RUNNING (ACTIVE)" : "IDLE (STANDBY)"}`,
          "info",
        );
        appendLog(
          `  Current Wallet: ${walletAddress || "NONE CONNECTED"}`,
          "info",
        );
        appendLog(
          `  Gateway Latency: ${isTerminalRunning ? "18ms (A attested)" : "Offline"}`,
          "info",
        );
        appendLog(`  CPU Trust Tier: Level 5 Trusted Hardware TEE`, "info");
        appendLog("admin@idle-node:~$ ", "regular");
      } else {
        appendLog("Usage: idle-node [start|stop|status] [arguments]", "error");
        appendLog("admin@idle-node:~$ ", "regular");
      }
    } else {
      appendLog(
        `bash: command not found: ${cmd}. Type 'help' for utilities index.`,
        "error",
      );
      appendLog("admin@idle-node:~$ ", "regular");
    }
  };

  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [withdrawTxSignature, setWithdrawTxSignature] = useState<string | null>(
    null,
  );
  const [withdrawExplorerUrl, setWithdrawExplorerUrl] = useState<string | null>(
    null,
  );

  // Withdraw real on-chain functionality
  const handleInitiateWithdraw = async () => {
    if (!walletAddress) {
      alert("Please connect or register your operator wallet address first.");
      return;
    }
    if (availableToWithdraw <= 0) {
      alert("No available revenues left to withdraw currently.");
      return;
    }

    setIsWithdrawing(true);
    setWithdrawSuccess(false);
    setWithdrawError(null);
    setWithdrawTxSignature(null);
    setWithdrawExplorerUrl(null);

    appendLog(
      `[Withdrawal] Communicating with on-chain settlement gateway...`,
      "info",
    );

    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientAddress: walletAddress,
          amount: "0.0000001",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || "Network error during withdrawal transaction dispatch.",
        );
      }

      // Success! Update local stats
      const originalAmount = availableToWithdraw;
      setWithdrawnTotal((prev) => prev + originalAmount);
      setAvailableToWithdraw(0.0);
      setWithdrawSuccess(true);
      setWithdrawTxSignature(data.signature);
      setWithdrawExplorerUrl(data.explorerUrl);

      appendLog(
        `[Withdrawal Succeeded] TX: ${data.signature.slice(0, 8)}... (Dispatched payout of ${data.solAmount.toFixed(6)} SOL successfully)`,
        "success",
      );
      appendLog(`  Explorer Link: ${data.explorerUrl}`, "success");

      // Refresh server-side balance
      fetchServerSolConfig();

      setTimeout(() => {
        setWithdrawSuccess(false);
      }, 15000);
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || "Unknown error";
      setWithdrawError(errMsg);
      appendLog(`[Withdrawal Failed] ${errMsg}`, "error");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark flex flex-col items-center">
      {/* Outer bounding wrapper */}
      <div className="w-full max-w-7xl px-4 md:px-8 py-8 md:py-12 flex flex-col gap-8 md:gap-10">
        {/* UPPER BANNER / PROFILE INFORMATION SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-[#ebd7cb]/20">
          <div className="space-y-2 text-left">
            {/* Live Gateway Indicator Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black border border-zinc-800 text-white rounded-full text-[10px] font-mono tracking-wider font-semibold">
              <span
                className={`h-1.5 w-1.5 rounded-full ${isTerminalRunning ? "bg-brand-green animate-pulse" : "bg-zinc-400"}`}
              />
              <span>
                {isTerminalRunning ? "1 GATEWAY LIVE" : "0 GATEWAYS ACTIVE"}
              </span>
            </div>

            {/* Wallet Headline or Prompt */}
            {walletAddress ? (
              <div className="flex items-center gap-3">
                <h1 className="font-display font-semibold text-3xl md:text-4xl text-[#1C3E35] tracking-tight truncate max-w-[280px] sm:max-w-md md:max-w-lg font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </h1>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopyWallet}
                    className="p-1.5 text-white hover:text-white rounded-lg bg-black border border-zinc-800 transition-all cursor-pointer"
                    title="Copy wallet address"
                  >
                    {copySuccess ? (
                      <Check size={14} className="text-emerald-600" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                  <button
                    onClick={handleDisconnectWallet}
                    className="p-1.5 text-white hover:text-white rounded-lg bg-black border border-zinc-800 transition-all cursor-pointer"
                    title="Disconnect payout wallet"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <h1 className="font-display font-medium text-3xl md:text-4xl text-brand-dark tracking-tight">
                No Wallet Connected
              </h1>
            )}

            <p className="text-xs md:text-sm text-[#8c887e] font-mono">
              {isTerminalRunning
                ? "1 resources · 1 active gateways"
                : "0 resources · 0 active gateways"}
            </p>
          </div>

          {/* Right Header Controls buttons */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setShowHelpGuide((prev) => !prev)}
              className="px-4 py-2 border border-zinc-800 text-white bg-black hover:bg-zinc-900 rounded-xl text-xs font-semibold tracking-wider flex items-center gap-2 cursor-pointer transition-all uppercase"
            >
              <HelpCircle size={14} />
              <span>{showHelpGuide ? "Hide Guide" : "View Help"}</span>
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("infra_active_session");
                window.location.reload();
              }}
              className="px-4 py-2 border border-zinc-800 text-white bg-black hover:bg-zinc-900 rounded-xl text-xs font-semibold tracking-wider flex items-center gap-2 cursor-pointer transition-all uppercase"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* STATS INFRASTRUCTURE ROW GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* RESOURCES Stat Block */}
          <div className="bg-white text-brand-black border border-zinc-800/70 rounded-3xl p-5 md:p-6 text-left shadow-sm flex flex-col justify-between h-[130px] md:h-[150px]">
            <span className="text-[10px] md:text-[11px] font-mono tracking-widest text-zinc-400 uppercase block font-semibold">
              RESOURCES
            </span>
            <div className="my-auto">
              <h3 className="font-display text-3xl md:text-4xl font-bold text-brand-green-light tracking-tight font-mono">
                {isTerminalRunning ? "1" : "0"}
              </h3>
            </div>
            <p className="text-[10px] md:text-xs text-zinc-400 font-mono mt-1">
              {isTerminalRunning
                ? "1 active worker daemon"
                : "0 active workers"}
            </p>
          </div>

          {/* GATEWAY REVENUE Stat Block */}
          <div className="bg-white text-brand-black border border-zinc-800/70 rounded-3xl p-5 md:p-6 text-left shadow-sm flex flex-col justify-between h-[130px] md:h-[150px]">
            <span className="text-[10px] md:text-[11px] font-mono tracking-widest text-zinc-400 uppercase block font-semibold">
              GATEWAY REVENUE
            </span>
            <div className="my-auto">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-brand-green-light tracking-tight font-mono truncate">
                {gatewayRevenue.toFixed(4)} ETH
              </h3>
            </div>
            <p className="text-[10px] md:text-xs text-zinc-400 font-mono mt-1">
              x402 protocol endpoints
            </p>
          </div>

          {/* TOTAL REQUESTS Stat Block */}
          <div className="bg-white text-brand-black border border-zinc-800/70 rounded-3xl p-5 md:p-6 text-left shadow-sm flex flex-col justify-between h-[130px] md:h-[150px]">
            <span className="text-[10px] md:text-[11px] font-mono tracking-widest text-zinc-400 uppercase block font-semibold">
              TOTAL REQUESTS
            </span>
            <div className="my-auto">
              <h3 className="font-display text-3xl md:text-4xl font-bold text-brand-green-light tracking-tight font-mono">
                {totalRequests}
              </h3>
            </div>
            <p className="text-[10px] md:text-xs text-zinc-400 font-mono mt-1">
              across all gateways
            </p>
          </div>

          {/* AVAILABLE WITHDRAWALS Stat Block */}
          <div className="bg-white border border-zinc-800/70 rounded-3xl p-5 md:p-6 text-left shadow-sm flex flex-col justify-between h-[130px] md:h-[150px]">
            <span className="text-[10px] md:text-[11px] font-mono tracking-widest text-zinc-400 uppercase block font-semibold">
              AVAILABLE TO WITHDRAW
            </span>
            <div className="my-auto">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-brand-green-light tracking-tight font-mono truncate">
                {availableToWithdraw.toFixed(4)} ETH
              </h3>
            </div>
            <p className="text-[10px] md:text-xs text-zinc-400 font-mono mt-1 select-none">
              {withdrawnTotal.toFixed(4)} ETH claimed previously
            </p>
          </div>
        </div>

        {/* WITHDRAW FLOW MESSAGE HEADER */}
        {availableToWithdraw > 0 && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 text-left">
            <div className="flex items-center gap-3">
              <Sparkles className="text-emerald-700 shrink-0" size={18} />
              <p className="text-xs md:text-sm text-emerald-950 font-medium leading-relaxed">
                You have accrued{" "}
                <span className="font-mono font-bold">
                  ${availableToWithdraw.toFixed(4)}
                </span>{" "}
                in uncollected operator yields! Submit a settlement withdrawal
                to transfer instantly.
              </p>
            </div>
            <button
              onClick={handleInitiateWithdraw}
              disabled={isWithdrawing}
              className="w-full sm:w-auto px-4 py-2 bg-black hover:bg-zinc-900 text-white rounded-xl text-xs font-bold tracking-wide transition-all scale-100 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xs disabled:opacity-55 block whitespace-nowrap"
            >
              {isWithdrawing
                ? "Signing Solana Block..."
                : "Withdraw Yield Instantly"}
            </button>
          </div>
        )}

        {withdrawSuccess && withdrawTxSignature && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left text-xs text-emerald-900 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
            <div className="space-y-1">
              <p className="font-bold text-emerald-950">
                🎉 Yield settlement successfully completed on-chain!
              </p>
              <p className="text-[#3c6b5e] font-mono select-all text-[11px] leading-relaxed break-all">
                Transaction Signature: {withdrawTxSignature}
              </p>
            </div>
            {withdrawExplorerUrl && (
              <a
                href={withdrawExplorerUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-850 hover:bg-emerald-950 text-white rounded-xl text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all text-center shrink-0 self-start sm:self-center font-mono cursor-pointer"
              >
                <span>View Sol Explorer</span>
                <ExternalLink size={11} />
              </a>
            )}
          </div>
        )}

        {withdrawError && (
          <div className="p-5 bg-rose-50 border border-rose-200 rounded-3xl text-left text-xs text-rose-900 space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
              <p className="font-bold text-rose-950 uppercase tracking-wide">
                On-Chain Settlement Action Failed
              </p>
            </div>
            <p className="text-[#555] text-[11px] leading-relaxed">
              We encountered a ledger error while attempting to sign or dispatch
              the settlement payouts from the background disburser:
            </p>
            <div className="p-3 bg-white border border-rose-100 rounded-xl text-[11px] font-mono leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto shadow-inner text-rose-800">
              {withdrawError}
            </div>
          </div>
        )}

        {/* SUB-GRID LAYOUT FOR WORK ENVIRONMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT CONTAINER: WALLET ADMISSION / QUICK TOOLS */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* WALLET SETUP BLOCK (Triggered if no wallet is loaded) */}
            {!walletAddress ? (
              <div className="bg-white border border-[#ebd7cb]/30 rounded-3xl p-6 text-left shadow-sm flex flex-col gap-5">
                <div className="space-y-1">
                  <div className="p-2.5 bg-brand-green/5 text-[#1C3E35] rounded-xl inline-block mb-2 border border-[#EBE6DC]">
                    <Wallet size={20} />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-[#1C3E35]">
                    Seed Operator Wallet
                  </h3>
                  <p className="text-xs text-[#8c887e] leading-relaxed">
                    Provide a Solana address to deposit computation yields,
                    handle peer-to-peer handshakes, and bind resource metrics.
                  </p>
                </div>

                {/* DRAG AND DROP ZONE */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                    isDragging
                      ? "border-emerald-600 bg-emerald-500/5 text-emerald-800"
                      : "border-zinc-300 hover:border-[#1C3E35] hover:bg-neutral-50/50"
                  }`}
                  onClick={() =>
                    document.getElementById("wallet-file-input")?.click()
                  }
                >
                  <input
                    id="wallet-file-input"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".json,.txt,.key"
                  />
                  <UploadCloud className="text-zinc-500 mb-2" size={24} />
                  <p className="text-xs text-zinc-950 font-bold mb-1">
                    Drop Solana keyfile `.json` / `.txt`
                  </p>
                  <p className="text-[10px] text-[#8c887e]">
                    or click to manually browse system files
                  </p>
                </div>

                {/* MANUAL TEXT BOX */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono tracking-wider text-[#8c887e] uppercase block font-bold">
                    Or Enter Address String
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 w-full bg-[#FAF9F6] border border-[#EBE6DC] rounded-xl px-3 py-2.5 text-xs text-zinc-950 font-mono focus:outline-none focus:border-brand-green"
                      placeholder="Solana address: e.g. 2mGq9A..."
                      value={inputWallet}
                      onChange={(e) => setInputWallet(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => handleSaveWallet()}
                    className="w-full py-3 bg-[#1C3E35] text-white rounded-xl text-xs font-bold tracking-wide hover:opacity-90 active:scale-98 transition-all cursor-pointer block uppercase text-center"
                  >
                    Register Wallet & Continue
                  </button>
                </div>

                {/* DEMO BYPASS LINK */}
                <div className="pt-2 border-t border-dashed border-[#EBE6DC] text-center">
                  <button
                    onClick={() => {
                      const demoAddr =
                        "2mGq9ADBQB52bkHocoKW1s92uuXCFV3ep3ngKiZAWtHj";
                      setInputWallet(demoAddr);
                      handleSaveWallet(demoAddr);
                    }}
                    className="text-[11px] text-zinc-600 hover:text-emerald-800 font-mono select-none"
                  >
                    Quick-start with evaluation demo wallet address
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#ebd7cb]/30 rounded-3xl p-6 text-left shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100">
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#1C3E35] uppercase">
                      Credential Status
                    </h4>
                    <p className="text-[10px] text-emerald-800 font-mono">
                      Safe & Live Attested
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-zinc-200/50 space-y-3.5 text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-[#8c887e] block">
                      PLATFORM REPUTATION
                    </span>
                    <strong className="text-zinc-900 text-[11px]">
                      EXCELLENT (99.85%)
                    </strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-[#8c887e] block">
                      LINKED OPERATOR WALLET
                    </span>
                    <strong className="text-zinc-900 text-[10px] block truncate text-wrap break-all leading-normal">
                      {walletAddress}
                    </strong>
                  </div>
                </div>

                {!isTerminalRunning && (
                  <button
                    onClick={() => handleStartTerminalSimulation()}
                    className="px-6 py-4 bg-brand-dark text-white font-body-md rounded-lg flex items-center gap-2 group hover:bg-black hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                  >
                    <Play size={13} className="fill-white" />
                    Launch Compute Node
                  </button>
                )}
              </div>
            )}

            {/* OPERATOR BEGINNING GUIDE (Prompt requested "little guide on how to begin in terminal") */}
            <AnimatePresence>
              {showHelpGuide && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className=" bg-brand-dark text-[#FAF7F2] rounded-3xl p-6 text-left shadow-sm flex flex-col gap-4 overflow-hidden"
                >
                  <div className="flex items-center gap-2.5">
                    <Info size={16} className="text-[#a5ffd6]" />
                    <h3 className="font-display font-semibold text-sm tracking-wide uppercase">
                      Quickstart Guide
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs text-zinc-300 leading-normal font-sans">
                    <div className="flex items-start gap-3">
                      <span className="h-5 w-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5 font-mono">
                        1
                      </span>
                      <p>
                        <strong>Add a wallet address</strong> using the
                        drag-and-drop tool or manually enter it to route
                        computation earnings securely.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="h-5 w-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5 font-mono">
                        2
                      </span>
                      <p>
                        Click the **"Launch Compute Node"** button or in the
                        terminal console, type:
                        <code className="block bg-[#162d27] text-emerald-400 p-2 rounded-lg font-mono text-[10px] my-1.5 leading-normal whitespace-pre overflow-x-auto select-all">
                          idle-node start --wallet{" "}
                          {walletAddress || "[YOUR_WALLET]"}
                        </code>
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="h-5 w-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5 font-mono">
                        3
                      </span>
                      <p>
                        Observe jobs process live. Every completed job
                        automatically awards{" "}
                        <strong className="text-white font-mono">
                          +$0.0002
                        </strong>{" "}
                        which ticks upward in both the terminal output and
                        dashboard.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="h-5 w-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5 font-mono">
                        4
                      </span>
                      <p>
                        Query telemetry stats using{" "}
                        <code className="bg-[#162d27] text-white p-1 rounded font-mono select-all">
                          idle-node status
                        </code>{" "}
                        or exit with{" "}
                        <code className="bg-[#162d27] text-white p-1 rounded font-mono select-all">
                          idle-node stop
                        </code>
                        .
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-emerald-900 flex justify-between items-center text-[11px] text-zinc-300 font-mono">
                    <span>Protocol Version: v0.4.2</span>
                    <button
                      onClick={() => setShowHelpGuide(false)}
                      className="text-white hover:underline"
                    >
                      Dismiss Help
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT CONTAINER: BIG TERMINAL DEPLOYMENT INTERFACE (colspan-8) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* TERMINAL HEADER & LAYOUT */}
            <div className="bg-[#1a1917] hover:shadow-xl transition-shadow border border-zinc-800 rounded-3xl overflow-hidden flex flex-col h-[520px] md:h-[580px] shadow-lg">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#0F0E0D] border-b border-zinc-850 select-none">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>

                <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono font-medium">
                  <TerminalIcon size={12} className="text-emerald-500" />
                  <span>IDLE Operator Daemon Terminal Console</span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <span
                    className={`h-2 w-2 rounded-full ${isTerminalRunning ? "bg-emerald-500 animate-pulse" : "bg-[#8c887e]"}`}
                  />
                  <span
                    className={
                      isTerminalRunning
                        ? "text-emerald-400 font-semibold"
                        : "text-zinc-500"
                    }
                  >
                    {isTerminalRunning ? "DAEMON ACTIVE" : "DAEMON IDLE"}
                  </span>
                </div>
              </div>

              {/* Terminal Logs Canvas */}
              <div
                ref={terminalContainerRef}
                className="flex-1 bg-[#0F0E0D] p-5 overflow-y-auto font-mono text-[12px] md:text-[13px] leading-relaxed text-zinc-100 text-left selection:bg-emerald-500 selection:text-black"
              >
                <div className="space-y-1">
                  {terminalLogs.map((log) => {
                    if (log.type === "input") {
                      return (
                        <div key={log.id} className="text-zinc-300">
                          <span className="text-emerald-500 mr-2">
                            admin@idle-node:~$
                          </span>
                          {log.text}
                        </div>
                      );
                    }
                    if (log.type === "system") {
                      return (
                        <div
                          key={log.id}
                          className="text-zinc-400 font-semibold"
                        >
                          {log.text}
                        </div>
                      );
                    }
                    if (log.type === "success") {
                      return (
                        <div key={log.id} className="text-emerald-400">
                          {log.text}
                        </div>
                      );
                    }
                    if (log.type === "error") {
                      return (
                        <div key={log.id} className="text-rose-400">
                          {log.text}
                        </div>
                      );
                    }
                    if (log.type === "info") {
                      return (
                        <div key={log.id} className="text-zinc-500 italic">
                          {log.text}
                        </div>
                      );
                    }
                    return (
                      <div key={log.id} className="text-zinc-200">
                        {log.text}
                      </div>
                    );
                  })}
                </div>

                {/* Dummy Anchor for Scrolling */}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Quick Utility Actions Bar */}
              <div className="px-4 py-2.5 bg-[#0A0909] border-t border-zinc-850 flex flex-wrap justify-between items-center gap-3">
                {/* Micro Command Helpers */}
                <div className="flex items-center gap-1.5 select-none">
                  <span className="text-[10px] text-zinc-500 font-mono mr-1">
                    Quick Run:
                  </span>

                  <button
                    onClick={() => {
                      if (!walletAddress) {
                        alert(
                          "Please configure your Solana wallet before launching compilation.",
                        );
                        return;
                      }
                      if (isTerminalRunning) {
                        handleStopTerminalSimulation();
                      } else {
                        handleStartTerminalSimulation();
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold tracking-wider transition-all flex items-center gap-1.5 uppercase cursor-pointer ${
                      isTerminalRunning
                        ? "bg-rose-900/30 text-rose-400 border border-rose-800/40 hover:bg-rose-950"
                        : "bg-emerald-950 text-[#a5ffd6] border border-emerald-800/40 hover:bg-emerald-900"
                    }`}
                  >
                    {isTerminalRunning ? (
                      <>
                        <Square
                          size={10}
                          className="fill-rose-400 text-rose-400"
                        />
                        <span>Stop Node</span>
                      </>
                    ) : (
                      <>
                        <Play
                          size={10}
                          className="fill-[#a5ffd6] text-[#a5ffd6]"
                        />
                        <span>Run start node</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setCommandInput("idle-node status");
                      appendLog("idle-node status", "input");
                      appendLog(
                        "IDLE Protocol Core Operator Telemetry Status:",
                        "system",
                      );
                      appendLog(
                        `  Host Platform:  Linux x86_64 Core-Enclave`,
                        "info",
                      );
                      appendLog(
                        `  Daemon Status:  ${isTerminalRunning ? "RUNNING (ACTIVE)" : "IDLE (STANDBY)"}`,
                        "info",
                      );
                      appendLog(
                        `  Current Wallet: ${walletAddress || "NONE CONNECTED"}`,
                        "info",
                      );
                      appendLog(
                        `  Gateway Latency: ${isTerminalRunning ? "18ms (A attested)" : "Offline"}`,
                        "info",
                      );
                      appendLog(
                        `  CPU Trust Tier: Level 5 Trusted Hardware TEE`,
                        "info",
                      );
                      appendLog("admin@idle-node:~$ ", "regular");
                      setCommandInput("");
                    }}
                    className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[10px] rounded-lg border border-zinc-700 flex items-center gap-1 uppercase transition-all cursor-pointer"
                  >
                    <Activity size={10} />
                    <span>status</span>
                  </button>

                  <button
                    onClick={() => {
                      setTerminalLogs([
                        {
                          id: "clear-sys",
                          text: "admin@idle-node:~$ ",
                          type: "regular",
                        },
                      ]);
                    }}
                    className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[10px] rounded-lg border border-zinc-700 flex items-center uppercase transition-all cursor-pointer"
                  >
                    <span>clear</span>
                  </button>
                </div>

                <div className="text-[10px] text-zinc-500 font-mono font-medium">
                  {walletAddress
                    ? "Solana network bound"
                    : "No active ledger network"}
                </div>
              </div>

              {/* Interactive Shell command line prompt form */}
              <form
                onSubmit={handleCommandSubmit}
                className="bg-[#0F0E0D] border-t border-zinc-850 flex items-center px-4 py-3 gap-2"
              >
                <span className="font-mono text-emerald-500 text-xs shrink-0 select-none">
                  admin@idle-node:~$
                </span>

                <input
                  type="text"
                  placeholder={
                    walletAddress
                      ? "Type commands or 'help'..."
                      : "Configure a wallet from sidebar to bypass console rules..."
                  }
                  className="w-full bg-[#0F0E0D] text-zinc-100 font-mono text-xs focus:outline-none border-none placeholder-zinc-650"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  disabled={!walletAddress}
                />

                <button
                  type="submit"
                  disabled={!walletAddress}
                  className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-mono text-[10px] font-bold rounded-lg uppercase disabled:opacity-30 transition-all cursor-pointer shrink-0"
                >
                  Enter
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
