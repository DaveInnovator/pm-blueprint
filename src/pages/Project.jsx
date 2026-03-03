import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const SECTIONS = [
  { key: "problem_statement", label: "Problem", icon: "🎯" },
  { key: "icp", label: "ICP", icon: "👤" },
  { key: "positioning", label: "Positioning", icon: "📍" },
  { key: "competitors", label: "Competition", icon: "⚔️" },
  { key: "mvp_features", label: "MVP Features", icon: "🏗️" },
  { key: "roadmap_30_days", label: "30-Day Plan", icon: "📅" },
  { key: "north_star_metric", label: "North Star", icon: "⭐" },
  { key: "kpis", label: "KPIs", icon: "📊" },
  { key: "gtm_experiments", label: "GTM Experiments", icon: "🚀" },
  { key: "assumptions", label: "Assumptions", icon: "🧪" },
];

export default function Project() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [blueprint, setBlueprint] = useState(null);
  const [active, setActive] = useState("problem_statement");
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase.from("projects").select("*").eq("id", id).single();
      setProject(p || null);

      const { data: b } = await supabase
        .from("blueprints")
        .select("*")
        .eq("project_id", id)
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle();

      setBlueprint(b?.content || null);
      setLoading(false);
    })();
  }, [id]);

  const activeSection = useMemo(
    () => SECTIONS.find((s) => s.key === active),
    [active]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-sm text-zinc-500">Loading blueprint…</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-sm text-zinc-400">Project not found.</div>
          <Link to="/dashboard" className="mt-3 inline-block underline text-zinc-400 text-sm">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            ← Dashboard
          </Link>
          <span className="text-zinc-800">|</span>
          <span className="text-sm text-zinc-400 line-clamp-1 max-w-xs hidden sm:block">{project.idea}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="hidden sm:block">{project.target_user}</span>
          <span className="hidden sm:block">•</span>
          <span className="hidden sm:block">{project.market}</span>
          <span className="hidden sm:block">•</span>
          <span>{project.revenue_model}</span>
        </div>
        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-sm text-zinc-400 hover:text-zinc-200"
          onClick={() => setMobileMenuOpen((x) => !x)}
        >
          {mobileMenuOpen ? "✕ Close" : "☰ Sections"}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={[
            "border-r border-zinc-900 bg-zinc-950 p-5 overflow-y-auto",
            "md:w-64 md:block shrink-0",
            mobileMenuOpen ? "block w-full absolute z-10 inset-0 top-[57px]" : "hidden",
          ].join(" ")}
        >
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-3">Sections</div>
          <nav className="space-y-1">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => {
                  setActive(s.key);
                  setMobileMenuOpen(false);
                }}
                className={[
                  "w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center gap-2.5 transition-all",
                  active === s.key
                    ? "bg-zinc-900 border border-zinc-800 text-zinc-100"
                    : "hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-200",
                ].join(" ")}
              >
                <span className="text-base">{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {/* Section header */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeSection?.icon}</span>
                <h1 className="text-2xl font-semibold">{activeSection?.label}</h1>
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                {SECTIONS.findIndex((s) => s.key === active) + 1} / {SECTIONS.length}
              </div>
            </div>

            {/* Blueprint content */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-900/20 p-6 min-h-[200px]">
              {!blueprint ? (
                <div className="text-sm text-zinc-400">No blueprint found for this project.</div>
              ) : (
                <SectionRenderer active={active} bp={blueprint} />
              )}
            </div>

            {/* Nav between sections */}
            <div className="mt-4 flex items-center justify-between">
              {SECTIONS.findIndex((s) => s.key === active) > 0 ? (
                <button
                  onClick={() => {
                    const idx = SECTIONS.findIndex((s) => s.key === active);
                    setActive(SECTIONS[idx - 1].key);
                  }}
                  className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  ← Previous
                </button>
              ) : <div />}

              {SECTIONS.findIndex((s) => s.key === active) < SECTIONS.length - 1 ? (
                <button
                  onClick={() => {
                    const idx = SECTIONS.findIndex((s) => s.key === active);
                    setActive(SECTIONS[idx + 1].key);
                  }}
                  className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Next →
                </button>
              ) : <div />}
            </div>

            {active === "competitors" && (
              <div className="mt-4 text-xs text-zinc-600">
                ⚠️ Competitors are hypothesis-level unless you add real sources later.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function SectionRenderer({ active, bp }) {
  const v = bp?.[active];

  if (active === "competitors") {
    if (!v?.length) return <Empty />;
    return (
      <div className="space-y-3">
        {v.map((c, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">{c.name}</span>
              <span className="text-xs text-zinc-500 border border-zinc-800 rounded-md px-2 py-0.5 bg-zinc-900">
                {c.type}
              </span>
            </div>
            <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-zinc-500 mb-1">Strength</div>
                <div className="text-zinc-300">{c.strength}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500 mb-1">Weakness</div>
                <div className="text-zinc-300">{c.weakness}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (active === "mvp_features") {
    if (!v) return <Empty />;
    const cols = [
      { key: "must_have", label: "Must have", color: "text-emerald-400" },
      { key: "should_have", label: "Should have", color: "text-yellow-400" },
      { key: "nice_to_have", label: "Nice to have", color: "text-zinc-400" },
    ];
    return (
      <div className="grid sm:grid-cols-3 gap-4">
        {cols.map(({ key, label, color }) => (
          <div key={key} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <div className={`text-xs font-medium mb-3 ${color}`}>{label}</div>
            <ul className="space-y-2 text-sm text-zinc-300">
              {(v[key] || []).map((x, i) => (
                <li key={i} className="flex gap-2">
                  <span className={`mt-0.5 shrink-0 ${color}`}>•</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  if (active === "gtm_experiments") {
    if (!v?.length) return <Empty />;
    return (
      <div className="space-y-3">
        {v.map((e, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-zinc-100 border border-zinc-700 rounded-md px-2 py-0.5 bg-zinc-900">
                {e.channel}
              </span>
            </div>
            <div className="text-sm text-zinc-300">{e.experiment}</div>
            <div className="mt-2 text-xs text-zinc-500">
              <span className="text-zinc-600">Success metric: </span>{e.success_metric}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (active === "roadmap_30_days") {
    if (!v?.length) return <Empty />;
    return (
      <ol className="space-y-2">
        {v.map((x, i) => (
          <li key={i} className="flex gap-3 text-sm text-zinc-300">
            <span className="shrink-0 w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-500">
              {i + 1}
            </span>
            <span className="pt-0.5">{x}</span>
          </li>
        ))}
      </ol>
    );
  }

  if (Array.isArray(v)) {
    if (!v.length) return <Empty />;
    return (
      <ul className="space-y-2">
        {v.map((x, i) => (
          <li key={i} className="flex gap-2 text-sm text-zinc-300">
            <span className="text-zinc-600 shrink-0">•</span>
            <span>{x}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (!v) return <Empty />;
  return <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{String(v)}</div>;
}

function Empty() {
  return <div className="text-sm text-zinc-500 italic">No data for this section.</div>;
}
