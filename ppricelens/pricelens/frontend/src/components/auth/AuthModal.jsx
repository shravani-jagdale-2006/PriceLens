import React, { useState } from "react";
import { X, Lock, Mail, User, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authMode, setAuthMode, login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (authMode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setError(err.message || "Authentication error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("demo@pricelens.com");
    setPassword("demo123");
    setError("");
    setLoading(true);
    try {
      await login("demo@pricelens.com", "demo123");
    } catch (err) {
      setError(err.message || "Failed to log in with demo account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/90 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {authMode === "login" ? "Welcome back to PriceLens" : "Create your PriceLens Account"}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {authMode === "login"
              ? "Access your saved wishlists and real-time price alerts"
              : "Compare smarter and get instant price drop alerts"}
          </p>
        </div>

        {/* Demo Fast Login Pill */}
        <div className="mb-5 p-3 rounded-2xl bg-indigo-50/80 border border-indigo-100/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500 flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs font-semibold text-brand-900">Test Account Ready</p>
              <p className="text-[11px] text-brand-700">Alex Morgan (demo@pricelens.com)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-500 text-white hover:bg-brand-600 transition shadow-sm cursor-pointer"
          >
            1-Click Sign In
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === "register" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-white/80 focus:border-brand-500 focus:bg-white focus:outline-none text-sm transition text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-white/80 focus:border-brand-500 focus:bg-white focus:outline-none text-sm transition text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-white/80 focus:border-brand-500 focus:bg-white focus:outline-none text-sm transition text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 rounded-full text-sm font-semibold shadow-md shadow-brand-500/25 mt-2"
          >
            {loading ? "Please wait..." : authMode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Mode Toggle */}
        <div className="mt-6 text-center text-xs text-slate-500">
          {authMode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => { setAuthMode("register"); setError(""); }}
                className="text-brand-600 font-semibold hover:underline cursor-pointer"
              >
                Sign Up Free
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => { setAuthMode("login"); setError(""); }}
                className="text-brand-600 font-semibold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
