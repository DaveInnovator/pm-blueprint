import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setErr("");
    setSuccess("");

    if (!email || !password) return setErr("Please fill in both fields.");
    if (password.length < 6) return setErr("Password must be at least 6 characters.");

    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) return setErr(error.message);
      setSuccess("Account created! You can now sign in.");
      setMode("signin");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setErr(error.message);
      nav("/dashboard");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center">
            <span className="text-zinc-950 text-xs font-bold">PM</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">Blueprint</span>
        </div>

        <div className="text-xl font-semibold">
          {mode === "signin" ? "Welcome back" : "Create account"}
        </div>
        <div className="mt-1 text-sm text-zinc-400">
          {mode === "signin" ? "Sign in to your account." : "Get started for free."}
        </div>

        <div className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-600 text-sm transition-colors"
            placeholder="you@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <input
            className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-600 text-sm transition-colors"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          {err && (
            <div className="rounded-xl bg-red-950/50 border border-red-900 px-4 py-3 text-sm text-red-400">
              {err}
            </div>
          )}
          {success && (
            <div className="rounded-xl bg-emerald-950/50 border border-emerald-900 px-4 py-3 text-sm text-emerald-400">
              {success}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-zinc-100 text-zinc-950 font-medium py-3 hover:bg-white disabled:opacity-50 text-sm transition-colors"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </div>

        <div className="mt-5 text-sm text-center text-zinc-500">
          {mode === "signin" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => { setMode("signup"); setErr(""); setSuccess(""); }}
                className="text-zinc-300 hover:text-white underline transition-colors"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => { setMode("signin"); setErr(""); setSuccess(""); }}
                className="text-zinc-300 hover:text-white underline transition-colors"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}