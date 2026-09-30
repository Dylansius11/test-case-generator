"use client";

import { useRef } from "react";
import { ClipboardText, ArrowCounterClockwise } from "@phosphor-icons/react";
import { PLACEHOLDER_CODE } from "@/lib/constants";

export function CodeInput({ value, onChange, language, lineCount }) {
  const textareaRef = useRef(null);

  function handleLoadExample() {
    onChange(PLACEHOLDER_CODE[language] || "");
    textareaRef.current?.focus();
  }

  function handleClear() {
    onChange("");
    textareaRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-1.5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <label
          className="text-xs font-medium tracking-wider uppercase"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
        >
          Source Code
        </label>
        <div className="flex items-center gap-2">
          {value && (
            <span className="text-xs tabular-nums" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
              {lineCount} {lineCount === 1 ? "line" : "lines"}
            </span>
          )}
          {value ? (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-all duration-150 active:scale-95"
              style={{ color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.borderColor = "var(--border-subtle)";
              }}
            >
              <ArrowCounterClockwise size={11} weight="bold" />
              Clear
            </button>
          ) : (
            <button
              onClick={handleLoadExample}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-all duration-150 active:scale-95"
              style={{ color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--accent)";
                e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.borderColor = "var(--border-subtle)";
              }}
            >
              <ClipboardText size={11} weight="bold" />
              Load example
            </button>
          )}
        </div>
      </div>

      {/* Textarea with line numbers effect */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          border: "1px solid var(--border)",
          background: "var(--surface)",
        }}
      >
        {/* Fake top bar */}
        <div
          className="flex items-center gap-1.5 px-4 py-2.5 border-b"
          style={{ borderColor: "var(--border-subtle)", background: "var(--surface-elevated)" }}
        >
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
          <span
            className="ml-2 text-[11px] tracking-wider"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
          >
            source.{language === "python" ? "py" : language === "java" ? "java" : language === "typescript" ? "ts" : "js"}
          </span>
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`// Paste your ${language} code here...\n// The AI will analyze it and generate comprehensive test cases.`}
          spellCheck={false}
          className="code-area w-full resize-none outline-none bg-transparent"
          rows={18}
          style={{
            padding: "1rem 1.25rem",
            color: "var(--text-primary)",
            caretColor: "var(--accent)",
          }}
        />
      </div>
    </div>
  );
}
