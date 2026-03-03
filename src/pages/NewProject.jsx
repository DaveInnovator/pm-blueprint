import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const REVENUE_OPTIONS = [
  "Not sure",
  "Subscription",
  "Marketplace take-rate",
  "Freemium",
  "Ads",
  "One-time purchase",
  "B2B SaaS",
];

export default function NewProject() {
  const nav = useNavigate();
  const [idea, setIdea] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [market, setMarket] = useState("");
  const [revenueModel, setRevenueModel] = useState("Not sure");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [step, setStep] = useState("idle"); // idle | saving | generating | done

  const isValid = idea.trim() && targetUser.trim() && market.trim();

  const create = async () => {
    setErr("");
    setLoading(true);
    setStep("saving");

    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      setLoading(false);
      setStep("idle");
      return setErr("Please log in first.");
    }

    const { data: project, error: pErr } = await supabase
      .from("projects")
      .insert({
        user_id: auth.user.id,
        idea: idea.trim(),
        target_user: targetUser.trim(),
        market: market.trim(),
        revenue_model: revenueModel,
      })
      .select()
      .single();

    if (pErr) {
      setLoading(false);
      setStep("idle");
      return setErr(pErr.message);
    }

    try {
      setStep("generating");

      const r = await fetch(`${API}/api/generate-blueprint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: idea.trim(),
          target_user: targetUser.trim(),
          market: market.trim(),
          revenue_model: revenueModel,
        }),
      });

      const json = await r.json();
      if (!r.ok) throw new Error(json?.details || json?.error || "Failed to generate blueprint.");

      await supabase.from("blueprints").insert({
        project_id: project.id,
        version: 1,
        content: json.blueprint,
      });

      setStep("done");
      nav(`/project/${project.id}`);
    } catch (e) {
      // Project was saved but blueprint failed — clean up
      await supabase.from("projects").delete().eq("id", project.id);
      setErr(e.message);
    } finally {
      setLoading(false);
      setStep("idle");
    }
  };

  const stepLabel = {
    idle: "Generate blueprint",
    saving: "Saving project…",
    generating: "Generating blueprint…",
    done: "Redirecting…",
  }[step];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-zinc-100 flex items-center justify-center">
            <span className="text-zinc-950 text-xs font-bold">PM</span>
          </div>
          <span className="font-semibold tracking-tight">Blueprint</span>
        </div>
        <Link to="/dashboard" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
          ← Dashboard
        </Link>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">New project</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Fill in the essentials. We'll generate a full product blueprint in seconds.
          </p>
        </div>

        <div className="space-y-5">
          {/* Idea */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              Startup idea <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full min-h-[140px] rounded-2xl bg-zinc-900/50 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-600 text-sm resize-none transition-colors placeholder:text-zinc-600"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe the product, who it helps, and how it works. The more specific, the better."
              disabled={loading}
            />
          </div>

          {/* Target user + Market */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">
                Target user <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-2xl bg-zinc-900/50 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-600 text-sm transition-colors placeholder:text-zinc-600"
                value={targetUser}
                onChange={(e) => setTargetUser(e.target.value)}
                placeholder="e.g., indie hackers building SaaS"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">
                Market <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-2xl bg-zinc-900/50 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-600 text-sm transition-colors placeholder:text-zinc-600"
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                placeholder="e.g., Global / Nigeria / EU"
                disabled={loading}
              />
            </div>
          </div>

          {/* Revenue model */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">Revenue model</label>
            <select
              className="w-full rounded-2xl bg-zinc-900/50 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-600 text-sm transition-colors"
              value={revenueModel}
              onChange={(e) => setRevenueModel(e.target.value)}
              disabled={loading}
            >
              {REVENUE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {err && (
            <div className="rounded-xl bg-red-950/50 border border-red-900 px-4 py-3 text-sm text-red-400">
              {err}
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-sm text-zinc-400 flex items-center gap-3">
              <div className="w-4 h-4 rounded-full border-2 border-zinc-600 border-t-zinc-200 animate-spin" />
              <span>{stepLabel}</span>
            </div>
          )}

          {/* Submit */}
          <button
            disabled={loading || !isValid}
            onClick={create}
            className="rounded-2xl bg-zinc-100 text-zinc-950 px-6 py-3 text-sm font-medium hover:bg-white disabled:opacity-50 transition-colors"
          >
            {loading ? stepLabel : "Generate blueprint →"}
          </button>
        </div>
      </main>
    </div>
  );
}
