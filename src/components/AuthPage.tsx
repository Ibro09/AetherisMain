import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  Key,
} from "lucide-react";

interface AuthPageProps {
  onAuthSuccess: (user: { name: string; email: string }) => void;
  initialMode?: "signin" | "signup";
  onCancel: () => void;
}

interface UserRecord {
  name: string;
  email: string;
  passwordHash: string; // Plaintext for demo since no backend, but represented properly
  createdAt: number;
}

export default function AuthPage({
  onAuthSuccess,
  initialMode = "signin",
  onCancel,
}: AuthPageProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Clear errors on tab change
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [mode]);

  // Helper inside browser storage for registering and fetching users
  const getRegisteredUsers = (): UserRecord[] => {
    try {
      const data = localStorage.getItem("infra_users_db");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!name.trim()) {
      setError("Full Name is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid corporate email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setError("You must accept the Network Operator Agreement.");
      return;
    }

    setIsLoading(true);
    // Call server signup
    fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
      }),
    })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data?.error || "Signup failed");
        // Build session token expiring in 30 days
        const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
        const session = {
          user: { name: data.user.name, email: data.user.email },
          expiresAt: Date.now() + thirtyDaysMs,
        };
        localStorage.setItem("infra_active_session", JSON.stringify(session));
        setSuccess("Account registered successfully! Establishing session...");
        setIsLoading(false);
        setTimeout(() => {
          onAuthSuccess({ name: data.user.name, email: data.user.email });
        }, 800);
      })
      .catch((err) => {
        setError(err.message || "Signup failed");
        setIsLoading(false);
      });
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    setIsLoading(true);
    fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
    })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data?.error || "Signin failed");
        const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
        const session = {
          user: { name: data.user.name, email: data.user.email },
          expiresAt: Date.now() + thirtyDaysMs,
        };
        localStorage.setItem("infra_active_session", JSON.stringify(session));
        setSuccess("Secure handshake validated! Unlocking console...");
        setIsLoading(false);
        setTimeout(() => {
          onAuthSuccess({ name: data.user.name, email: data.user.email });
        }, 800);
      })
      .catch((err) => {
        setError(err.message || "Signin failed");
        setIsLoading(false);
      });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 md:py-20 flex justify-center items-center min-h-[80vh]">
      <div className="relative w-full max-w-5xl bg-white border border-brand-light-beige shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        {/* Decorative Grid Left Background Sidebar */}
        <div className="lg:col-span-5 bg-brand-green text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(#f6ede4 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div className="absolute w-64 h-64 rounded-full bg-brand-green-light/25 blur-3xl pointer-events-none -left-20 -top-20" />

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-display text-xl text-white font-semibold">
                A
              </div>
              <span className="font-display font-medium text-xl tracking-tighter">
                AETHERIS
              </span>
            </div>

            <div className="mt-8">
              <span className="font-label-caps text-brand-green-bg bg-white/10 px-2.5 py-1 rounded-full text-[10px] tracking-wider">
                DECENTRALIZED RESOURCE GRID
              </span>
              <h3 className="font-display text-3xl md:text-4xl tracking-tight leading-tight mt-4 text-white">
                Access your global node network enclaves.
              </h3>
              <p className="font-body-sm text-brand-light-beige/80 mt-4 leading-relaxed">
                Connect your physical systems to state-of-the-art secure routing
                pools. Earn yield over secure cryptographic circuits.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
            <div className="space-y-4 font-body-sm">
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-brand-green-bg shrink-0" />
                <span className="text-brand-light-beige">
                  TKE Encrypted Local Keys
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Key size={16} className="text-brand-green-bg shrink-0" />
                <span className="text-brand-light-beige">
                  Automatic 30-Day Session Lease
                </span>
              </div>
            </div>
            <p className="text-[11px] text-brand-light-beige/50 mt-8">
              Institutional physical computing secure routing network. V4.14
              active.
            </p>
          </div>
        </div>

        {/* Auth form Column */}
        <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-brand-cream">
          <div className="w-full max-w-md mx-auto">
            {/* Navigation Header Tabs inside form */}
            <div className="flex gap-6 mb-8 border-b border-brand-light-beige/60 pb-3">
              <button
                type="button"
                id="tab-signin"
                onClick={() => setMode("signin")}
                className={`font-display text-2xl tracking-tight pb-2 transition-all relative ${
                  mode === "signin"
                    ? "text-brand-dark font-medium"
                    : "text-brand-gray/50 hover:text-brand-dark"
                }`}
              >
                Sign In
                {mode === "signin" && (
                  <motion.div
                    layoutId="activeAuthUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green"
                  />
                )}
              </button>
              <button
                type="button"
                id="tab-signup"
                onClick={() => setMode("signup")}
                className={`font-display text-2xl tracking-tight pb-2 transition-all relative ${
                  mode === "signup"
                    ? "text-brand-dark font-medium"
                    : "text-brand-gray/50 hover:text-brand-dark"
                }`}
              >
                Sign Up
                {mode === "signup" && (
                  <motion.div
                    layoutId="activeAuthUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green"
                  />
                )}
              </button>
            </div>

            {/* Error & Success indicators */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3 bg-red-50 border border-red-100 rounded-xl mb-6 text-red-700 text-xs flex items-start gap-2.5"
                >
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl mb-6 text-emerald-800 text-xs flex items-start gap-2.5"
                >
                  <CheckCircle size={15} className="mt-0.5 shrink-0" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form
              onSubmit={mode === "signin" ? handleSignIn : handleSignUp}
              className="space-y-4"
            >
              {mode === "signup" && (
                <div>
                  <label
                    htmlFor="auth-name"
                    className="block text-xs font-semibold tracking-wider text-brand-gray font-label-caps mb-1.5 uppercase"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray/40">
                      <User size={16} />
                    </span>
                    <input
                      id="auth-name"
                      type="text"
                      placeholder="e.g. Alexis Vance"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-brand-light-beige rounded-xl focus:border-brand-green focus:outline-none font-body-sm text-brand-dark transition-all placeholder:text-brand-gray/40 focus:ring-1 focus:ring-brand-green"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="auth-email"
                  className="block text-xs font-semibold tracking-wider text-brand-gray font-label-caps mb-1.5 uppercase"
                >
                  Corporate Email
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray/40">
                    <Mail size={16} />
                  </span>
                  <input
                    id="auth-email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-brand-light-beige rounded-xl focus:border-brand-green focus:outline-none font-body-sm text-brand-dark transition-all placeholder:text-brand-gray/40 focus:ring-1 focus:ring-brand-green"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="auth-password"
                  className="block text-xs font-semibold tracking-wider text-brand-gray font-label-caps mb-1.5 uppercase"
                >
                  Secure Passcode
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray/40">
                    <Lock size={16} />
                  </span>
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white border border-brand-light-beige rounded-xl focus:border-brand-green focus:outline-none font-body-sm text-brand-dark transition-all placeholder:text-brand-gray/40 focus:ring-1 focus:ring-brand-green"
                  />
                  <button
                    id="toggle-password-visibility"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray/40 hover:text-brand-dark transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <div>
                  <label
                    htmlFor="auth-confirm-password"
                    className="block text-xs font-semibold tracking-wider text-brand-gray font-label-caps mb-1.5 uppercase"
                  >
                    Confirm Passcode
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray/40">
                      <Lock size={16} />
                    </span>
                    <input
                      id="auth-confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-brand-light-beige rounded-xl focus:border-brand-green focus:outline-none font-body-sm text-brand-dark transition-all placeholder:text-brand-gray/40 focus:ring-1 focus:ring-brand-green"
                    />
                  </div>
                </div>
              )}

              {mode === "signup" && (
                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    id="agree-operator-terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 rounded bg-white border-brand-light-beige text-brand-green focus:ring-brand-green focus:ring-offset-0 h-4 w-4"
                  />
                  <span className="text-xs text-brand-gray leading-normal">
                    I agree to the{" "}
                    <span className="underline cursor-pointer hover:text-brand-dark">
                      Node Routing Terms
                    </span>{" "}
                    and authorize the regional indexer to perform secure
                    enclaved heartbeats.
                  </span>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between gap-4">
                <button
                  id="btn-cancel-auth"
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-3 text-xs font-semibold text-brand-gray hover:text-brand-dark font-label-caps transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  id="btn-submit-auth"
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-brand-green text-white font-body-md rounded-xl flex items-center gap-2 hover:bg-brand-green-light hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      {mode === "signin" ? "Verifying..." : "Registering..."}
                    </span>
                  ) : (
                    <>
                      {mode === "signin"
                        ? "Access Network"
                        : "Initialize Operator"}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-brand-light-beige/60 text-center">
              <span className="text-xs text-brand-gray">
                {mode === "signin"
                  ? "New to the secure grid?"
                  : "Already possess an Operator account?"}
              </span>
              <button
                id="link-toggle-mode"
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-xs text-brand-green hover:text-brand-green-light font-semibold underline ml-1.5 transition-colors cursor-pointer"
              >
                {mode === "signin"
                  ? "Initialize operator registration"
                  : "Authenticate secure node passcode"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
