import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const FEATURES = [
  {
    icon: "🎯",
    title: "Problem & ICP",
    desc: "Instantly surfaces your core problem statement and ideal customer profile.",
  },
  {
    icon: "⚔️",
    title: "Competitor Analysis",
    desc: "Maps the competitive landscape so you know exactly where you stand.",
  },
  {
    icon: "🏗️",
    title: "MVP Features",
    desc: "Prioritised must-have, should-have, and nice-to-have features — no fluff.",
  },
  {
    icon: "📅",
    title: "30-Day Roadmap",
    desc: "A concrete execution plan for your first month, not just vague advice.",
  },
  {
    icon: "🚀",
    title: "GTM Experiments",
    desc: "Go-to-market experiments with channels, tactics, and success metrics.",
  },
  {
    icon: "⭐",
    title: "North Star Metric",
    desc: "The one number that tells you if your startup is actually working.",
  },
];

const STEPS = [
  { num: "01", title: "Describe your idea", desc: "Tell us what you're building, who it's for, and how you'll make money." },
  { num: "02", title: "We generate the blueprint", desc: "AI builds a full product blueprint in seconds — structured, actionable, honest." },
  { num: "03", title: "Ship with clarity", desc: "Use your blueprint to prioritise, build, and go to market with confidence." },
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "600px",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.03) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "all 0.3s",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          background: scrolled ? "rgba(9,9,11,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "#f4f4f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#09090b", fontSize: "11px", fontWeight: 700 }}>PM</span>
          </div>
          <span style={{ fontWeight: 600, letterSpacing: "-0.02em", fontSize: "15px" }}>Blueprint</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            to="/login"
            style={{
              fontSize: "14px",
              color: "#a1a1aa",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "10px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#a1a1aa")}
          >
            Sign in
          </Link>
          <Link
            to="/login"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#09090b",
              background: "#f4f4f5",
              textDecoration: "none",
              padding: "8px 18px",
              borderRadius: "10px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f4f4f5")}
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 24px 80px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "999px",
            padding: "6px 14px",
            marginBottom: "32px",
            fontSize: "12px",
            color: "#a1a1aa",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#22c55e",
              display: "inline-block",
            }}
          />
          AI-powered product blueprints
        </div>

        <h1
          style={{
            fontSize: "clamp(42px, 7vw, 80px)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            marginBottom: "24px",
            maxWidth: "800px",
          }}
        >
          Your startup blueprint, <span style={{ color: "#71717a" }}>generated in seconds.</span>
        </h1>

        <p
          style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "#71717a",
            maxWidth: "540px",
            lineHeight: 1.6,
            marginBottom: "40px",
          }}
        >
          Describe your idea. Get a full product strategy — problem statement, ICP, competitors, MVP features, roadmap, and
          GTM experiments — instantly.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            to="/login"
            style={{
              fontSize: "15px",
              fontWeight: 500,
              color: "#09090b",
              background: "#f4f4f5",
              textDecoration: "none",
              padding: "14px 28px",
              borderRadius: "14px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f4f4f5")}
          >
            Build your blueprint →
          </Link>

          {/* ✅ FIXED: proper <a> opening tag */}
          <a
            href="#how"
            style={{
              fontSize: "15px",
              color: "#71717a",
              textDecoration: "none",
              padding: "14px 28px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#71717a";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            See how it works
          </a>
        </div>

        {/* Fake blueprint preview card */}
        <div
          style={{
            marginTop: "72px",
            width: "100%",
            maxWidth: "720px",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.02)",
            padding: "24px",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            {["Problem", "ICP", "MVP", "Roadmap", "GTM"].map((t) => (
              <span
                key={t}
                style={{
                  fontSize: "12px",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#71717a",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <div style={{ fontSize: "13px", color: "#52525b", marginBottom: "12px" }}>Problem statement</div>

          <div
            style={{
              fontSize: "15px",
              color: "#d4d4d8",
              lineHeight: 1.6,
              marginBottom: "20px",
              borderLeft: "2px solid rgba(255,255,255,0.08)",
              paddingLeft: "16px",
            }}
          >
            Early-stage founders waste weeks writing product specs with no structure. There's no fast, opinionated tool that
            turns a raw idea into an actionable plan within minutes.
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            {["North Star", "KPIs", "Assumptions"].map((label) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                  padding: "12px",
                }}
              >
                <div style={{ fontSize: "11px", color: "#52525b", marginBottom: "6px" }}>{label}</div>
                <div
                  style={{
                    height: "8px",
                    borderRadius: "4px",
                    background: "rgba(255,255,255,0.06)",
                    marginBottom: "6px",
                    width: "80%",
                  }}
                />
                <div
                  style={{
                    height: "8px",
                    borderRadius: "4px",
                    background: "rgba(255,255,255,0.04)",
                    width: "55%",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: "100px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div
            style={{
              fontSize: "12px",
              color: "#52525b",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            How it works
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.03em" }}>
            Three steps to clarity
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {STEPS.map((s) => (
            <div
              key={s.num}
              style={{
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
                padding: "28px",
              }}
            >
              <div style={{ fontSize: "12px", color: "#3f3f46", fontWeight: 600, marginBottom: "16px", letterSpacing: "0.05em" }}>
                {s.num}
              </div>
              <div style={{ fontSize: "17px", fontWeight: 600, marginBottom: "10px", letterSpacing: "-0.02em" }}>{s.title}</div>
              <div style={{ fontSize: "14px", color: "#71717a", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "100px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div
            style={{
              fontSize: "12px",
              color: "#52525b",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            What's inside
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.03em" }}>
            Everything a PM would build.<br />In seconds.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
                padding: "24px",
                transition: "border-color 0.2s, background 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "12px" }}>{f.icon}</div>
              <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "8px", letterSpacing: "-0.02em" }}>{f.title}</div>
              <div style={{ fontSize: "13px", color: "#71717a", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center" }}>
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            background: "rgba(255,255,255,0.02)",
            padding: "60px 40px",
          }}
        >
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "16px" }}>
            Ready to build?
          </h2>
          <p style={{ fontSize: "16px", color: "#71717a", marginBottom: "32px", lineHeight: 1.6 }}>
            Stop guessing. Get a blueprint that actually tells you what to build, who to target, and how to grow.
          </p>
          <Link
            to="/login"
            style={{
              fontSize: "15px",
              fontWeight: 500,
              color: "#09090b",
              background: "#f4f4f5",
              textDecoration: "none",
              padding: "14px 32px",
              borderRadius: "14px",
              display: "inline-block",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f4f4f5")}
          >
            Create your first blueprint →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "24px",
          textAlign: "center",
          fontSize: "13px",
          color: "#3f3f46",
        }}
      >
        PM Blueprint — built for founders who ship.
      </footer>
    </div>
  );
}