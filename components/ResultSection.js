"use client";

import { useState } from "react";
import {
  CheckSquare,
  Code,
  CopySimple,
  Check,
  MagnifyingGlass,
  Function as FunctionIcon,
  ListBullets,
  Hash,
} from "@phosphor-icons/react";
import { PRIORITY_COLORS, CATEGORY_COLORS } from "@/lib/constants";

// ── Badges ────────────────────────────────────────────────────────────────────

function PriorityBadge({ priority }) {
  const color = PRIORITY_COLORS[priority] || PRIORITY_COLORS["Low"];
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase"
      style={{
        color: color.text,
        background: color.bg,
        border: `1px solid ${color.border}`,
        fontFamily: "var(--font-geist-mono)",
      }}
    >
      {priority}
    </span>
  );
}

function CategoryBadge({ category }) {
  const color = CATEGORY_COLORS[category] || { text: "#a1a1aa", bg: "rgba(161,161,170,0.08)" };
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium"
      style={{
        color: color.text,
        background: color.bg,
        fontFamily: "var(--font-geist-mono)",
      }}
    >
      {category}
    </span>
  );
}

// ── Analysis Section ──────────────────────────────────────────────────────────

function AnalysisSection({ analysis }) {
  if (!analysis) return null;

  const { summary, functionsDetected = [], businessRulesDetected = [], totalTestCases } = analysis;

  return (
    <div
      className="rounded-xl p-4 slide-up"
      style={{
        background: "var(--surface-elevated)",
        border: "1px solid var(--border)",
        animationDelay: "0s",
        animationFillMode: "both",
        opacity: 0,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <MagnifyingGlass size={14} style={{ color: "var(--accent)" }} />
        <h2 className="text-xs font-semibold tracking-wide uppercase" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
          Code Analysis
        </h2>
      </div>

      {/* Summary */}
      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
        {summary}
      </p>

      {/* Stat chips */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { icon: <FunctionIcon size={12} />, label: "Functions", value: functionsDetected.length },
          { icon: <ListBullets size={12} />, label: "Rules", value: businessRulesDetected.length },
          { icon: <Hash size={12} />, label: "Test Cases", value: totalTestCases },
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center rounded-lg py-2 px-1"
            style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)" }}
          >
            <div className="flex items-center gap-1 mb-1" style={{ color: "var(--accent)" }}>
              {icon}
            </div>
            <span
              className="text-base font-bold tabular-nums"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-geist-mono)" }}
            >
              {value}
            </span>
            <span className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "var(--text-muted)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Functions detected */}
      {functionsDetected.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
            Functions Detected
          </p>
          <div className="flex flex-wrap gap-1.5">
            {functionsDetected.map((fn) => (
              <span
                key={fn}
                className="rounded-md px-2 py-0.5 text-[11px]"
                style={{
                  background: "var(--accent-dim)",
                  color: "var(--accent)",
                  border: "1px solid rgba(34,197,94,0.15)",
                  fontFamily: "var(--font-geist-mono)",
                }}
              >
                {fn}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Business rules */}
      {businessRulesDetected.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
            Business Rules
          </p>
          <ul className="space-y-1">
            {businessRulesDetected.map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                <span className="shrink-0 mt-1 w-1 h-1 rounded-full" style={{ background: "var(--accent)" }} />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Test Case Card ────────────────────────────────────────────────────────────

function TestCaseCard({ testCase, index }) {
  // Support both old mock shape (name/description) and new AI shape (scenario/input/expectedResult)
  const title = testCase.scenario || testCase.name || "Untitled";
  const inputStr = testCase.input;
  const expected = testCase.expectedResult;
  const description = testCase.description;

  return (
    <div
      className="group rounded-xl p-4 transition-all duration-200 slide-up"
      style={{
        background: "var(--surface-elevated)",
        border: "1px solid var(--border-subtle)",
        animationDelay: `${index * 0.06}s`,
        animationFillMode: "both",
        opacity: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.background = "#1c1c20";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-subtle)";
        e.currentTarget.style.background = "var(--surface-elevated)";
      }}
    >
      {/* Header row: id + title + priority */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <span
            className="mt-0.5 shrink-0 text-[10px] font-bold tabular-nums"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
          >
            {String(testCase.id).padStart(2, "0")}
          </span>
          <p className="text-sm font-medium leading-snug" style={{ color: "var(--text-primary)" }}>
            {title}
          </p>
        </div>
        <div className="shrink-0">
          <PriorityBadge priority={testCase.priority} />
        </div>
      </div>

      {/* Body: prefer new AI fields, fall back to description */}
      <div className="ml-6 space-y-1.5 mb-3">
        {inputStr && (
          <div className="flex gap-1.5">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider w-16" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>Input</span>
            <span className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{inputStr}</span>
          </div>
        )}
        {expected && (
          <div className="flex gap-1.5">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider w-16" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>Expected</span>
            <span className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{expected}</span>
          </div>
        )}
        {description && !inputStr && (
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{description}</p>
        )}
      </div>

      {/* Category badge */}
      <div className="ml-6">
        <CategoryBadge category={testCase.category} />
      </div>
    </div>
  );
}

// ── Code Block ────────────────────────────────────────────────────────────────

function CodeBlock({ code, framework }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available in insecure context
    }
  }

  return (
    <div
      className="rounded-xl overflow-hidden slide-up"
      style={{
        border: "1px solid var(--border)",
        background: "var(--surface)",
        animationDelay: "0.3s",
        animationFillMode: "both",
        opacity: 0,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: "var(--border-subtle)", background: "var(--surface-elevated)" }}
      >
        <div className="flex items-center gap-2">
          <Code size={14} style={{ color: "var(--accent)" }} />
          <span
            className="text-xs font-medium"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-geist-mono)" }}
          >
            {framework}_tests
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 active:scale-95"
          style={{
            color: copied ? "var(--accent)" : "var(--text-secondary)",
            background: copied ? "var(--accent-dim)" : "transparent",
            border: `1px solid ${copied ? "rgba(34,197,94,0.25)" : "var(--border-subtle)"}`,
          }}
        >
          {copied ? <Check size={11} weight="bold" /> : <CopySimple size={11} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code body */}
      <pre
        className="code-area overflow-auto"
        style={{ padding: "1.25rem", color: "var(--text-secondary)", maxHeight: "460px" }}
      >
        <code style={{ color: "var(--text-primary)" }}>{code}</code>
      </pre>
    </div>
  );
}

// ── Skeleton Loading ──────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-xl p-4" style={{ border: "1px solid var(--border-subtle)" }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex gap-2.5 flex-1">
          <div className="shimmer w-5 h-3 rounded mt-0.5 shrink-0" />
          <div className="shimmer h-4 rounded flex-1" />
        </div>
        <div className="shimmer w-14 h-5 rounded-md shrink-0" />
      </div>
      <div className="ml-6 space-y-2">
        <div className="shimmer h-3 rounded w-full" />
        <div className="shimmer h-3 rounded w-4/5" />
      </div>
    </div>
  );
}

// ── ResultSection (exported) ──────────────────────────────────────────────────

export function ResultSection({ result, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Analysis skeleton */}
        <div className="rounded-xl p-4" style={{ border: "1px solid var(--border)" }}>
          <div className="shimmer w-28 h-3.5 rounded mb-3" />
          <div className="shimmer h-3 rounded w-full mb-1.5" />
          <div className="shimmer h-3 rounded w-3/4 mb-4" />
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg py-3" style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)" }}>
                <div className="shimmer w-8 h-6 rounded mx-auto mb-1" />
                <div className="shimmer w-12 h-2.5 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Test cases skeleton */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="shimmer w-24 h-3.5 rounded" />
            <div className="shimmer w-8 h-3.5 rounded" />
          </div>
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>

        {/* Code block skeleton */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b"
            style={{ borderColor: "var(--border-subtle)", background: "var(--surface-elevated)" }}
          >
            <div className="shimmer w-28 h-3.5 rounded" />
            <div className="shimmer w-14 h-6 rounded-md" />
          </div>
          <div className="p-5 space-y-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="shimmer h-3 rounded" style={{ width: `${55 + (i * 13) % 35}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const { analysis, testCases, generatedCode, meta } = result;

  return (
    <div className="space-y-6">
      {/* Analysis */}
      <AnalysisSection analysis={analysis} />

      {/* Test Cases */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckSquare size={16} style={{ color: "var(--accent)" }} />
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Test Cases
            </h2>
            <span
              className="text-xs font-bold tabular-nums px-1.5 py-0.5 rounded-md"
              style={{
                color: "var(--accent)",
                background: "var(--accent-dim)",
                fontFamily: "var(--font-geist-mono)",
              }}
            >
              {testCases.length}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "var(--accent)" }} />
            <span
              className="text-[11px] tracking-wider uppercase"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
            >
              {meta.testingFramework} · {meta.programmingLanguage}
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          {testCases.map((tc, i) => (
            <TestCaseCard key={tc.id} testCase={tc} index={i} />
          ))}
        </div>
      </div>

      {/* Generated Code */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Code size={16} style={{ color: "var(--accent)" }} />
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Generated Test Code
          </h2>
        </div>
        <CodeBlock code={generatedCode} framework={meta.testingFramework} />
      </div>
    </div>
  );
}
