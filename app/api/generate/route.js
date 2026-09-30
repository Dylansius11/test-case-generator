import { NextResponse } from "next/server";
import { buildPrompt } from "@/lib/prompts";
import { generateWithAI } from "@/lib/ai-service";

/**
 * POST /api/generate
 *
 * Body: { programmingLanguage, testingFramework, sourceCode }
 *
 * Returns:
 *   200 { analysis, testCases, generatedCode, meta }
 *   400 { error } — missing / invalid input
 *   502 { error } — AI provider error
 *   500 { error } — unexpected server error
 */
export async function POST(request) {
  // ── 1. Parse body ───────────────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { programmingLanguage, testingFramework, sourceCode } = body ?? {};

  // ── 2. Validate inputs ──────────────────────────────────────────
  if (!programmingLanguage?.trim()) {
    return NextResponse.json({ error: "programmingLanguage is required." }, { status: 400 });
  }
  if (!testingFramework?.trim()) {
    return NextResponse.json({ error: "testingFramework is required." }, { status: 400 });
  }
  if (!sourceCode?.trim()) {
    return NextResponse.json({ error: "sourceCode is required. Please paste some code." }, { status: 400 });
  }
  if (sourceCode.trim().length < 10) {
    return NextResponse.json({ error: "Source code is too short to analyze." }, { status: 400 });
  }

  // ── 3. Build prompt ─────────────────────────────────────────────
  const prompt = buildPrompt({ programmingLanguage, testingFramework, sourceCode });

  // ── 4. Call AI provider ─────────────────────────────────────────
  let rawOutput;
  try {
    rawOutput = await generateWithAI(prompt);
  } catch (err) {
    console.error("[/api/generate] AI provider error:", err.message);
    return NextResponse.json(
      { error: "Unable to reach the AI provider. Please try again later." },
      { status: 502 }
    );
  }

  // ── 5. Parse and validate AI output ────────────────────────────
  let parsed;
  try {
    // Strip markdown code fences if the model wrapped the JSON anyway
    const cleaned = rawOutput
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "")
      .trim();

    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("[/api/generate] JSON parse failed. Raw output:", rawOutput);
    return NextResponse.json(
      { error: "The AI returned an unexpected response. Please try again." },
      { status: 500 }
    );
  }

  // Verify required shape
  if (!parsed.analysis || !Array.isArray(parsed.testCases) || !parsed.generatedCode) {
    console.error("[/api/generate] Unexpected AI response shape:", JSON.stringify(parsed).slice(0, 300));
    return NextResponse.json(
      { error: "The AI response was incomplete. Please try again." },
      { status: 500 }
    );
  }

  // ── 6. Return structured result ─────────────────────────────────
  return NextResponse.json({
    analysis: parsed.analysis,
    testCases: parsed.testCases,
    generatedCode: parsed.generatedCode,
    meta: {
      programmingLanguage,
      testingFramework,
      generatedAt: new Date().toISOString(),
    },
  });
}
