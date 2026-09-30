"use client";

import { LANGUAGES, FRAMEWORKS } from "@/lib/constants";
import { CaretDown } from "@phosphor-icons/react";

export function LanguageSelect({ value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium tracking-wider uppercase"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
        Language
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg px-3.5 py-2.5 pr-9 text-sm font-medium outline-none cursor-pointer transition-all duration-150"
          style={{
            background: "var(--surface-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(34,197,94,0.5)";
            e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.06)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border)";
            e.target.style.boxShadow = "none";
          }}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}
              style={{ background: "var(--surface-elevated)", color: "var(--text-primary)" }}>
              {lang.label}
            </option>
          ))}
        </select>
        <CaretDown
          size={14}
          weight="bold"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-muted)" }}
        />
      </div>
    </div>
  );
}

export function FrameworkSelect({ language, value, onChange }) {
  const options = FRAMEWORKS[language] || [];

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium tracking-wider uppercase"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
        Framework
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg px-3.5 py-2.5 pr-9 text-sm font-medium outline-none cursor-pointer transition-all duration-150"
          style={{
            background: "var(--surface-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(34,197,94,0.5)";
            e.target.style.boxShadow = "0 0 0 3px rgba(34,197,94,0.06)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border)";
            e.target.style.boxShadow = "none";
          }}
        >
          {options.map((fw) => (
            <option key={fw.value} value={fw.value}
              style={{ background: "var(--surface-elevated)", color: "var(--text-primary)" }}>
              {fw.label}
            </option>
          ))}
        </select>
        <CaretDown
          size={14}
          weight="bold"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--text-muted)" }}
        />
      </div>
    </div>
  );
}
