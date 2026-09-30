# AI Test Case Generator

An AI-powered application that analyzes source code and automatically generates structured software test cases and executable automated test code.

Built for the **HacTiv University Hackathon** — powered by IBM watsonx.ai.

---

## Overview

Paste any function or class, choose your language and testing framework, and the AI returns:

- A **code analysis** summary with detected functions and business rules
- A structured list of **test cases** (ID, scenario, input, expected result, category, priority)
- **Executable test code** ready to drop into your test suite

No setup friction. No context switching. From code to tests in seconds.

---

## Features

- **Language support** — Python, JavaScript, TypeScript, Java
- **Framework support** — Pytest, unittest, Jest, Vitest, Mocha, JUnit 5, TestNG
- **AI analysis** — detects functions, business rules, edge cases, boundary conditions
- **Structured output** — test cases with priority and category badges
- **Generated code** — copy-ready test file for the chosen framework
- **Dark terminal UI** — zero visual noise, developer-native aesthetic
- **IBM watsonx.ai integration** — with OpenAI-compatible fallback

---

## How It Works

```
User Input (language, framework, source code)
      ↓
  Frontend (Next.js)
      ↓
  POST /api/generate
      ↓
  Master Prompt Builder  (lib/prompts.js)
      ↓
  AI Service Layer       (lib/ai-service.js)
      ↓
  IBM watsonx.ai / OpenAI
      ↓
  JSON: { analysis, testCases, generatedCode }
      ↓
  Parse + Validate
      ↓
  Display Results in UI
```

---

## Architecture

```
test-case-generator/
├── app/
│   ├── page.js              ← Main page — state, form, layout
│   ├── layout.js            ← Root layout, Geist fonts
│   ├── globals.css          ← CSS variables, animations
│   └── api/
│       └── generate/
│           └── route.js     ← POST /api/generate — validates input, calls AI
├── components/
│   ├── Selects.js           ← Language + Framework dropdowns
│   ├── CodeInput.js         ← Code textarea with terminal chrome
│   └── ResultSection.js     ← Analysis panel + test case cards + code block
├── lib/
│   ├── constants.js         ← Languages, frameworks, badge colors
│   ├── prompts.js           ← Master prompt builder function
│   └── ai-service.js        ← AI provider abstraction (watsonx / OpenAI / mock)
├── .env.local.example       ← Environment variable reference (safe to commit)
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19 |
| Styling | Tailwind CSS v4 |
| Icons | Phosphor Icons |
| Fonts | Geist + Geist Mono (next/font) |
| AI (primary) | IBM watsonx.ai |
| AI (fallback) | OpenAI / compatible |
| Runtime | Node.js 20+ |

---

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd test-case-generator
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

### 3. Run locally

```bash
npm run dev
# → http://localhost:3000
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `WATSONX_API_KEY` | Yes (if using watsonx) | IBM Cloud IAM API key |
| `WATSONX_PROJECT_ID` | Yes (if using watsonx) | watsonx.ai Project ID |
| `WATSONX_URL` | No | Regional endpoint (default: `https://us-south.ml.cloud.ibm.com`) |
| `WATSONX_MODEL_ID` | No | Model ID (default: `meta-llama/llama-3-3-70b-instruct`) |
| `OPENAI_API_KEY` | Yes (if using OpenAI) | OpenAI or compatible API key |
| `OPENAI_MODEL` | No | Model name (default: `gpt-4o-mini`) |
| `OPENAI_BASE_URL` | No | Override for OpenAI-compatible APIs |
| `AI_MOCK` | No | Set `true` to use fixture data — local dev only |

Provider selection order: `AI_MOCK=true` → `WATSONX_API_KEY` → `OPENAI_API_KEY`

---

## Running Locally (quick start without AI keys)

Add this to `.env.local` to use the built-in mock response:

```env
AI_MOCK=true
```

Then run `npm run dev` and paste any code to see the UI working end-to-end.

---

## Sample Input

**Language:** Python  
**Framework:** Pytest

```python
def calculate_order_total(price, quantity, discount_code=None):
    if price <= 0:
        raise ValueError("Price must be greater than 0")

    if quantity < 1 or quantity > 100:
        raise ValueError("Quantity must be between 1 and 100")

    total = price * quantity

    if discount_code == "SAVE10":
        total *= 0.90
    elif discount_code == "SAVE20":
        total *= 0.80

    if total > 1_000_000:
        total *= 0.95

    return round(total, 2)
```

Expected output includes test cases for: normal order, SAVE10/SAVE20 discounts, invalid price, boundary quantities, unknown discount code, bulk discount trigger.

---

## Future Development

- [ ] Syntax highlighting in code input and output (Shiki / Prism)
- [ ] Export test cases as `.xlsx` or `.csv`
- [ ] Save/load sessions (localStorage)
- [ ] Multi-function analysis (entire file upload)
- [ ] CI integration snippet generator
- [ ] More languages: Go, Rust, C#, PHP
- [ ] Custom prompt editor for power users
