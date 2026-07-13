import React, { useState, useEffect } from "react";
import {
  Database,
  Search,
  Trash2,
  Check,
  RotateCcw,
  ShieldAlert,
  Info,
  Briefcase,
  Copy,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

interface CookieDescription {
  key: string;
  type: "Session" | "Operational" | "Preference";
  expiry: string;
  purpose: string;
  status: "Active" | "Not Found";
}

export default function CookiePolicyPage() {
  const [copiedText, setCopiedText] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cookieData, setCookieData] = useState<CookieDescription[]>([]);

  // Query actual browser localStorage keys to show a real diagnostic list!
  const scanStorageStates = () => {
    const registry: Omit<CookieDescription, "status">[] = [
      {
        key: "infra_active_session",
        type: "Session",
        expiry: "30 Days from Auth",
        purpose:
          "Maintains your cryptographic operator profile login sequence so you don't need to re-type private passwords and keys on every refresh.",
      },
      {
        key: "infra_operator_nodes",
        type: "Operational",
        expiry: "Persistent (Local Only)",
        purpose:
          "Stores registered virtual node attributes (identities, hardware config, uptime status) to coordinate peer routing state.",
      },
      {
        key: "infra_operator_balance",
        type: "Operational",
        expiry: "Persistent (Local Only)",
        purpose:
          "Tracks your verified payout settlement dollar ledger balances in browser memory schemas.",
      },
      {
        key: "infra_operator_pending",
        type: "Operational",
        expiry: "Persistent (Local Only)",
        purpose:
          "Tracks pending unclaimed compute-slice yield rewards accrued by active virtual enclaves during execution loops.",
      },
    ];

    const updated = registry.map((item) => {
      const exists = !!localStorage.getItem(item.key);
      return {
        ...item,
        status: exists ? "Active" : ("Not Found" as const),
      };
    });

    setCookieData(updated);
  };

  useEffect(() => {
    scanStorageStates();
  }, []);

  // Flush specific storage key for demo convenience
  const handleDeleteKey = (key: string) => {
    localStorage.removeItem(key);
    scanStorageStates();
    // Dispatch a dummy event to sync components that look at storage
    window.dispatchEvent(new Event("storage"));
  };

  // Perform full operational reset (simulate declining extra cache cookies)
  const handleFullReset = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      localStorage.removeItem("infra_active_session");
      localStorage.removeItem("infra_operator_nodes");
      localStorage.removeItem("infra_operator_balance");
      localStorage.removeItem("infra_operator_pending");
      scanStorageStates();
      setIsRefreshing(false);
      window.dispatchEvent(new Event("storage"));
      alert(
        "Fully flushed local storage telemetry states. Refreshing console context.",
      );
      window.location.reload();
    }, 1200);
  };

  const handleCopyPolicy = () => {
    const textToCopy =
      `AETHERIS PROTOCOL COOKIE POLICY\nLast Updated: May 31, 2026\n\n` +
      cookieData
        .map(
          (c) =>
            `Key: ${c.key} [${c.type}]\nExpiry: ${c.expiry}\nPurpose: ${c.purpose}`,
        )
        .join("\n\n");
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const filteredCookies = cookieData.filter(
    (item) =>
      item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full bg-brand-bg md:py-16 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Title block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-green/10 text-brand-green rounded-full border border-brand-green/10 font-label-caps text-[10px] tracking-wider font-semibold">
            <Database size={12} />
            Browser Telemetry Spec
          </div>

          <h1 className="font-display-md text-brand-dark tracking-tight leading-none">
            Cookie & Local Storage Policy
          </h1>

          <p className="font-body-md text-brand-gray text-[15px] max-w-2xl mx-auto">
            Review exactly what data keys our protocol registers on your client
            machine. No advertising cookies, no invasive surveillance scripts -
            strictly enclaved routing storage.
          </p>

          <div className="text-[11px] font-mono text-brand-gray flex justify-center items-center gap-2 pt-2">
            <span>Last Updated: May 31, 2026</span>
            <span className="text-zinc-300">•</span>
            <span>GDPR/ePrivacy Compliant</span>
          </div>
        </div>

        {/* Content sections layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left instructions block */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-brand-cream border border-brand-light-beige rounded-2xl p-6 space-y-5">
              <h3 className="font-display text-lg text-brand-dark font-medium border-b border-brand-light-beige/60 pb-3">
                Cookie Philosophy
              </h3>

              <div className="prose text-xs text-brand-gray leading-relaxed space-y-3.5 font-sans">
                <p>
                  At Aetheris Protocol, we believe in radical transparency. The
                  cookie policies of contemporary platforms are usually verbose
                  frameworks masking bulk demographic broker pixels.
                </p>
                <p>
                  <strong>Our absolute non-tracking mandate:</strong> We
                  register zero third-party advertising cookies, zero
                  third-party telemetry, and zero cross-domain trackers.
                </p>
                <p>
                  Everything we record is restricted to{" "}
                  <strong>Local Storage variables</strong> that live inside your
                  own browser window. They are completely absent from
                  centralized servers.
                </p>
              </div>

              <div className="pt-3 border-t border-brand-light-beige/60">
                <button
                  onClick={handleCopyPolicy}
                  className="w-full py-2 bg-white border border-brand-light-beige hover:border-brand-gray/35 rounded-xl text-xs font-label-caps text-brand-dark flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedText ? (
                    <Check size={12} className="text-brand-green" />
                  ) : (
                    <Database size={12} className="text-brand-gray" />
                  )}
                  {copiedText ? "Copied Storage Map" : "Export Storage Schema"}
                </button>
              </div>
            </div>

            {/* Quick Warning widget */}
            <div className="bg-amber-50/60 border border-amber-200/50 rounded-2xl p-5 text-amber-900 font-sans">
              <div className="flex gap-2 text-xs">
                <ShieldAlert
                  className="text-amber-700 shrink-0 mt-0.5"
                  size={16}
                />
                <div>
                  <strong className="block font-semibold mb-1">
                    Clearing Cache Note
                  </strong>
                  If you manually erase local storage or run CCleaner setups,
                  your registered virtual enclaves configuration will be wiped
                  out from the browser. Keep backups of your node names if
                  needed.
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Cookie Manager (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Live manager interface wrapper */}
            <div className="bg-white border border-brand-light-beige rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-light-beige/60 pb-5">
                <div>
                  <h3 className="font-display text-xl text-brand-dark font-medium">
                    Interactive Cookie Diagnostic Console
                  </h3>
                  <p className="text-xs text-brand-gray mt-1">
                    This panel scans your active browser profile for active
                    Aetheris keys.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Filter keys..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-brand-cream border border-brand-light-beige rounded-lg text-xs text-brand-dark focus:outline-none focus:border-brand-green font-sans"
                    />
                    <Search
                      size={12}
                      className="absolute left-2.5 top-2.5 text-brand-gray"
                    />
                  </div>

                  <button
                    onClick={handleFullReset}
                    disabled={isRefreshing}
                    className="p-1.5 border border-red-200 hover:bg-red-50 text-red-700 rounded-lg transition-all cursor-pointer bg-white"
                    title="Flush all telemetry cookies and reset session"
                  >
                    {isRefreshing ? (
                      <RotateCcw
                        size={14}
                        className="animate-spin text-red-400"
                      />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>

              {/* Cookie / Storage Key rows */}
              <div className="space-y-4 font-sans">
                {filteredCookies.map((item) => (
                  <div
                    key={item.key}
                    className="p-4 border border-brand-light-beige/60 rounded-xl hover:bg-brand-cream transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <strong className="text-xs text-brand-dark font-mono bg-brand-dark/10 px-1.5 py-0.5 rounded">
                          {item.key}
                        </strong>
                        <span
                          className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                            item.type === "Session"
                              ? "bg-brand-green/10 text-brand-green"
                              : "bg-neutral-100 text-neutral-800"
                          }`}
                        >
                          {item.type}
                        </span>
                        <span className="text-[10px] text-brand-gray font-mono">
                          Expires: {item.expiry}
                        </span>
                      </div>

                      <p className="text-xs text-brand-gray leading-relaxed max-w-xl">
                        {item.purpose}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-start shrink-0">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md border flex items-center gap-1 ${
                          item.status === "Active"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-100"
                            : "bg-neutral-50 text-neutral-400 border-neutral-100 line-through"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${item.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-neutral-300"}`}
                        />
                        {item.status}
                      </span>

                      {item.status === "Active" && (
                        <button
                          onClick={() => handleDeleteKey(item.key)}
                          className="p-1.5 border border-brand-light-beige text-brand-gray hover:text-red-700 hover:border-red-200 hover:bg-red-50/30 rounded-lg transition-all cursor-pointer bg-white"
                          title="Flush this storage variable"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {filteredCookies.length === 0 && (
                  <div className="py-8 text-center text-brand-gray text-xs">
                    No keys matched your filter parameter.
                  </div>
                )}
              </div>
            </div>

            {/* Quick information guide statement */}
            <div className="bg-brand-cream border border-brand-light-beige rounded-2xl p-6 space-y-3.5 text-left font-sans">
              <div className="flex gap-2.5 items-start">
                <Info size={16} className="text-brand-green mt-0.5 shrink-0" />
                <div className="text-xs text-brand-gray space-y-2">
                  <h4 className="font-display text-base text-brand-dark font-medium leading-none">
                    Automatic GDPR / ePrivacy Conformance
                  </h4>
                  <p>
                    Because we resolve compute tasks inside hardware execution
                    enclaves and do not collect nor share personal demographics,
                    no automated popups are triggered which would disrupt your
                    dashboard workflow.
                  </p>
                  <p>
                    By persisting your nodes or confirming operator settings,
                    you accept these operational telemetry paths to ensure
                    stable protocol communication cycles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
