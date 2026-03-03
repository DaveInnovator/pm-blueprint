import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 8787;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

function requireKey() {
  if (!GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY in server environment.");
  }
}

const BLUEPRINT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    problem_statement: { type: "string" },
    icp: { type: "string" },
    positioning: { type: "string" },
    assumptions: { type: "array", items: { type: "string" } },
    competitors: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          type: { type: "string", enum: ["direct", "indirect", "alternative"] },
          strength: { type: "string" },
          weakness: { type: "string" },
        },
        required: ["name", "type", "strength", "weakness"],
      },
    },
    mvp_features: {
      type: "object",
      additionalProperties: false,
      properties: {
        must_have: { type: "array", items: { type: "string" } },
        should_have: { type: "array", items: { type: "string" } },
        nice_to_have: { type: "array", items: { type: "string" } },
      },
      required: ["must_have", "should_have", "nice_to_have"],
    },
    north_star_metric: { type: "string" },
    kpis: { type: "array", items: { type: "string" } },
    roadmap_30_days: { type: "array", items: { type: "string" } },
    gtm_experiments: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          channel: { type: "string" },
          experiment: { type: "string" },
          success_metric: { type: "string" },
        },
        required: ["channel", "experiment", "success_metric"],
      },
    },
  },
  required: [
    "problem_statement",
    "icp",
    "positioning",
    "assumptions",
    "competitors",
    "mvp_features",
    "north_star_metric",
    "kpis",
    "roadmap_30_days",
    "gtm_experiments",
  ],
};

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/generate-blueprint", async (req, res) => {
  try {
    requireKey();

    const { idea, target_user, market, revenue_model } = req.body || {};

    if (!idea || !target_user || !market || !revenue_model) {
      return res.status(400).json({ error: "Missing required inputs: idea, target_user, market, revenue_model." });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
    model: "moonshotai/kimi-k2-instruct-0905",
    messages: [
      {
        role: "system",
        content:
          "You are a senior Product Manager helping early-stage founders. Be concrete and execution-focused. Avoid fluff. If you must assume, list assumptions explicitly. Competitors should be framed as hypotheses unless the user provides names or links.",
      },
      {
        role: "user",
        content: `Create a startup blueprint.\n\nIdea: ${idea}\nTarget user: ${target_user}\nMarket: ${market}\nRevenue model: ${revenue_model}\n\nReturn ONLY valid JSON matching the schema.`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "blueprint",
        strict: true,
        schema: BLUEPRINT_SCHEMA,
      },
    },
    temperature: 0.7,
    max_tokens: 4096,
  }),
});

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq error:", errText);
      return res.status(500).json({ error: "Groq API error", details: errText });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      console.error("Unexpected Groq response shape:", JSON.stringify(data));
      return res.status(500).json({ error: "No content returned from model. Check server logs." });
    }

    let blueprint;
    try {
      blueprint = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse Groq response as JSON:", content);
      return res.status(500).json({ error: "Model returned invalid JSON." });
    }

    return res.json({ blueprint });
  } catch (e) {
    console.error("Server error:", e);
    return res.status(500).json({ error: e.message || "Internal server error." });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅  PM Blueprint API running at http://localhost:${PORT}`);
  console.log(`   Groq key: ${GROQ_API_KEY ? "✓ loaded" : "✗ MISSING — set GROQ_API_KEY"}\n`);
});
