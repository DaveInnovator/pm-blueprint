import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("projects")
      .select("id, idea, target_user, market, revenue_model, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setProjects(data || []));
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    nav("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-sm text-zinc-500">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-sm text-zinc-400">You're not logged in.</div>
          <Link
            to="/login"
            className="mt-3 inline-block rounded-xl bg-zinc-100 text-zinc-950 px-4 py-2 text-sm font-medium hover:bg-white"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-900">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-zinc-100 flex items-center justify-center">
            <span className="text-zinc-950 text-xs font-bold">PM</span>
          </div>
          <span className="font-semibold tracking-tight">Blueprint</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 hidden sm:block">{user.email}</span>
          <Link
            to="/new"
            className="rounded-xl bg-zinc-100 text-zinc-950 px-4 py-2 text-sm font-medium hover:bg-white transition-colors"
          >
            + New project
          </Link>
          <button
            onClick={signOut}
            className="rounded-xl border border-zinc-800 px-4 py-2 text-sm hover:bg-zinc-900 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">Your projects</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {projects.length === 0
              ? "Nothing here yet. Create your first blueprint."
              : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="grid gap-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              to={`/project/${p.id}`}
              className="group rounded-2xl border border-zinc-900 bg-zinc-900/20 p-5 hover:bg-zinc-900/50 hover:border-zinc-800 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="font-medium line-clamp-2 flex-1">{p.idea}</div>
                <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors text-lg mt-0.5">→</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {[p.target_user, p.market, p.revenue_model].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-xs text-zinc-600">{formatDate(p.created_at)}</div>
            </Link>
          ))}

          {projects.length === 0 && (
            <Link
              to="/new"
              className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center hover:border-zinc-600 hover:bg-zinc-900/20 transition-all"
            >
              <div className="text-2xl mb-2">+</div>
              <div className="text-sm text-zinc-400">Create your first project</div>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
