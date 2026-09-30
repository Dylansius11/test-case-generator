"use client";

import { useState, useCallback } from "react";
import {
  Lightning,
  Flask,
  Sparkle,
  ArrowRight,
  WarningCircle,
  GithubLogo,
} from "@phosphor-icons/react";
import { LanguageSelect, FrameworkSelect } from "@/components/Selects";
import { CodeInput } from "@/components/CodeInput";
import { ResultSection } from "@/components/ResultSection";
import { FRAMEWORKS } from "@/lib/constants";

export default function Home() {
  const [language, setLanguage] = useState("python");
  const [framework, setFramework] = useState("pytest");
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // When language changes, reset framework to first available option
  function handleLanguageChange(lang) {
    setLanguage(lang);
    const firstFramework = FRAMEWORKS[lang]?.[0]?.value || "";
    setFramework(firstFramework);
    setResult(null);
    setError(null);
  }

  const lineCount = code ? code.split("\n").length : 0;

  const handleGenerate = useCallback(async () => {
    if (!code.trim()) {
      setError("Please paste some source code before generating test cases.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programmingLanguage: language,
          testingFramework: framework,
          sourceCode: code,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Generation failed. Please try again.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [language, framework, code]);

  const hasOutput = result || isLoading;

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "var(--background)" }}>
      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-30 flex items-center justify-between px-6 h-14"
        style={{
          background: "rgba(9,9,11,0.85)",
          borderBottom: "1px solid var(--border-subtle)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ background: "var(--accent-dim)", border: "1px solid rgba(34,197,94,0.2)" }}
          >
            <Flask size={15} weight="fill" style={{ color: "var(--accent)" }} />
          </div>
          <span className="text-sm font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
            TestGen
          </span>
          <span
            className="hidden sm:inline text-xs px-2 py-0.5 rounded-full"
            style={{
              color: "var(--accent)",
              background: "var(--accent-dim)",
              border: "1px solid rgba(34,197,94,0.15)",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            AI
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium transition-colors duration-150"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <GithubLogo size={15} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <div
            className="h-4 w-px"
            style={{ background: "var(--border)" }}
          />
          <span
            className="text-xs"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
          >
            v0.1.0
          </span>
        </div>
      </nav>

      {/* ── Main content ────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkle size={13} weight="fill" style={{ color: "var(--accent)" }} />
            <span
              className="text-[11px] font-medium tracking-[0.12em] uppercase"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
            >
              AI-Powered
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight leading-none mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Test Case Generator
          </h1>
          <p className="text-sm leading-relaxed max-w-lg" style={{ color: "var(--text-secondary)" }}>
            Paste source code, select your stack, and get structured test cases with automated
            test code — ready to run in your test suite.
          </p>
        </header>

        {/* Two-column layout: Input | Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* ── LEFT: Input panel ─────────────────────────────── */}
          <div
            className="rounded-2xl p-6 space-y-5 glow-border"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Config row */}
            <div className="grid grid-cols-2 gap-4">
              <LanguageSelect value={language} onChange={handleLanguageChange} />
              <FrameworkSelect
                language={language}
                value={framework}
                onChange={setFramework}
              />
            </div>

            {/* Code input */}
            <CodeInput
              value={code}
              onChange={(v) => { setCode(v); setError(null); }}
              language={language}
              lineCount={lineCount}
            />

            {/* Error message */}
            {error && (
              <div
                className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm slide-up"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#fca5a5",
                }}
              >
                <WarningCircle size={16} weight="fill" className="shrink-0 mt-0.5" style={{ color: "#f87171" }} />
                <span>{error}</span>
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed"
              style={{
                background: isLoading
                  ? "rgba(34,197,94,0.15)"
                  : "var(--accent)",
                color: isLoading ? "var(--accent)" : "#09090b",
                border: isLoading ? "1px solid rgba(34,197,94,0.3)" : "1px solid transparent",
                boxShadow: isLoading ? "none" : "0 1px 20px rgba(34,197,94,0.18), 0 1px 4px rgba(34,197,94,0.12)",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = "#16a34a";
                  e.currentTarget.style.boxShadow = "0 1px 28px rgba(34,197,94,0.3), 0 1px 6px rgba(34,197,94,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = "var(--accent)";
                  e.currentTarget.style.boxShadow = "0 1px 20px rgba(34,197,94,0.18), 0 1px 4px rgba(34,197,94,0.12)";
                }
              }}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Generating…
                </>
              ) : (
                <>
                  <Lightning size={16} weight="fill" />
                  Generate Test Cases
                  <ArrowRight size={14} weight="bold" className="ml-0.5" />
                </>
              )}
            </button>

            {/* Stat row */}
            <StatRow language={language} framework={framework} lineCount={lineCount} />
          </div>

          {/* ── RIGHT: Output panel ───────────────────────────── */}
          <div className="lg:sticky lg:top-[4.5rem]">
            {hasOutput ? (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <ResultSection result={result} isLoading={isLoading} />
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer
        className="mt-auto px-6 py-5 flex items-center justify-between"
        style={{
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
          AI Test Case Generator — HacTiv University Hackathon
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
          Next.js · Tailwind · API-ready
        </span>
      </footer>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function StatRow({ language, framework, lineCount }) {
  const items = [
    { label: "Language", value: language },
    { label: "Framework", value: framework },
    { label: "Lines", value: lineCount || "—" },
  ];

  return (
    <div
      className="flex items-center gap-0 rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--border-subtle)" }}
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className="flex-1 px-3 py-2.5 text-center"
          style={{
            borderRight: i < items.length - 1 ? "1px solid var(--border-subtle)" : "none",
            background: "var(--surface-elevated)",
          }}
        >
          <p
            className="text-[10px] tracking-wider uppercase mb-0.5"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
          >
            {item.label}
          </p>
          <p
            className="text-xs font-semibold tabular-nums"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-geist-mono)" }}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="rounded-2xl flex flex-col items-center justify-center text-center py-20 px-8"
      style={{
        background: "var(--surface)",
        border: "1px dashed var(--border)",
        minHeight: "420px",
      }}
    >
      {/* Animated concentric rings */}
      <div className="relative mb-8 w-16 h-16">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "var(--accent-glow)",
            border: "1px solid rgba(34,197,94,0.12)",
            animation: "pulse-dot 3s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-2 rounded-full"
          style={{
            background: "var(--accent-dim)",
            border: "1px solid rgba(34,197,94,0.2)",
            animation: "pulse-dot 3s ease-in-out infinite 0.3s",
          }}
        />
        <div
          className="absolute inset-4 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.3)",
          }}
        >
          <Flask size={14} weight="fill" style={{ color: "var(--accent)" }} />
        </div>
      </div>

      <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        Waiting for your code
      </h3>
      <p className="text-xs leading-relaxed max-w-xs" style={{ color: "var(--text-muted)" }}>
        Paste source code in the editor, configure your stack, and hit{" "}
        <span style={{ color: "var(--text-secondary)" }}>Generate Test Cases</span>.
      </p>

      {/* Step hints */}
      <div className="mt-8 flex flex-col gap-2 w-full max-w-xs text-left">
        {[
          "Select language & framework",
          "Paste your source code",
          "Click Generate Test Cases",
        ].map((step, i) => (
          <div key={step} className="flex items-center gap-2.5">
            <span
              className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold tabular-nums"
              style={{
                background: "var(--surface-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                fontFamily: "var(--font-geist-mono)",
              }}
            >
              {i + 1}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
