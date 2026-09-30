/**
 * AI Service Layer — provider-agnostic abstraction.
 *
 * Primary:  IBM watsonx.ai  (set WATSONX_API_KEY, WATSONX_PROJECT_ID, WATSONX_URL)
 * Fallback: OpenAI-compatible (set OPENAI_API_KEY)
 * Dev mock: set AI_MOCK=true  (returns a hardcoded fixture — never in production)
 *
 * NEVER import this file on the client.  Server-side only.
 *
 * Environment variables (see .env.local.example):
 *   WATSONX_API_KEY       IBM Cloud IAM API key
 *   WATSONX_PROJECT_ID    watsonx.ai project ID
 *   WATSONX_URL           Base URL, e.g. https://us-south.ml.cloud.ibm.com
 *   WATSONX_MODEL_ID      Model ID, default: ibm/granite-13b-instruct-v2
 *
 *   OPENAI_API_KEY        OpenAI / compatible key (fallback provider)
 *   OPENAI_MODEL          Model name, default: gpt-4o-mini
 *   OPENAI_BASE_URL       Override base URL for OpenAI-compatible endpoints
 *
 *   AI_MOCK               Set to "true" to skip all AI calls (local dev only)
 */

// ── IBM watsonx.ai ────────────────────────────────────────────────────────────

/**
 * Obtain an IBM Cloud IAM bearer token from an API key.
 * Token TTL is ~1 h; for production consider caching it.
 */
async function getIBMToken(apiKey) {
  const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: apiKey,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`IBM IAM token error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.access_token;
}

/**
 * Call watsonx.ai text generation endpoint.
 */
async function callWatsonx(prompt) {
  const apiKey = process.env.WATSONX_API_KEY;
  const projectId = process.env.WATSONX_PROJECT_ID;
  const baseUrl = (process.env.WATSONX_URL || "https://us-south.ml.cloud.ibm.com").replace(/\/$/, "");
  const modelId = process.env.WATSONX_MODEL_ID || "meta-llama/llama-3-3-70b-instruct";

  const token = await getIBMToken(apiKey);

  const res = await fetch(`${baseUrl}/ml/v1/text/generation?version=2023-05-29`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model_id: modelId,
      project_id: projectId,
      input: prompt,
      parameters: {
        decoding_method: "greedy",
        max_new_tokens: 4096,
        min_new_tokens: 1,
        temperature: 0.1,
        repetition_penalty: 1.05,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`watsonx.ai error (${res.status}): ${text}`);
  }

  const data = await res.json();
  // watsonx returns results[0].generated_text
  return data?.results?.[0]?.generated_text ?? "";
}

// ── OpenAI / compatible ───────────────────────────────────────────────────────

async function callOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

// ── Dev mock ──────────────────────────────────────────────────────────────────

function mockResponse(prompt) {
  // Extract language/framework hints from the prompt for a slightly contextual mock
  const isJava = prompt.includes("Java");
  const fnName = isJava ? "calculateOrderTotal" : "calculate_order_total";

  return JSON.stringify({
    analysis: {
      summary:
        "The function calculates an order total from price × quantity, applies optional discount codes (SAVE10 = 10% off, SAVE20 = 20% off), and applies a bulk discount of 5% when the total exceeds 1,000,000. It raises errors for invalid price or quantity.",
      functionsDetected: [fnName],
      businessRulesDetected: [
        "Price must be greater than 0",
        "Quantity must be between 1 and 100",
        "SAVE10 discount code applies 10% off",
        "SAVE20 discount code applies 20% off",
        "Orders over 1,000,000 receive an additional 5% bulk discount",
      ],
      totalTestCases: 9,
    },
    testCases: [
      {
        id: "TC001",
        scenario: "Normal order without discount",
        input: "price=50, quantity=2, discount_code=None",
        expectedResult: "Returns 100.0",
        category: "Happy Path",
        priority: "High",
      },
      {
        id: "TC002",
        scenario: "Apply SAVE10 discount code",
        input: "price=100, quantity=1, discount_code='SAVE10'",
        expectedResult: "Returns 90.0",
        category: "Happy Path",
        priority: "High",
      },
      {
        id: "TC003",
        scenario: "Apply SAVE20 discount code",
        input: "price=100, quantity=1, discount_code='SAVE20'",
        expectedResult: "Returns 80.0",
        category: "Happy Path",
        priority: "High",
      },
      {
        id: "TC004",
        scenario: "Invalid price — zero",
        input: "price=0, quantity=1",
        expectedResult: "Raises ValueError: Price must be greater than 0",
        category: "Validation",
        priority: "High",
      },
      {
        id: "TC005",
        scenario: "Invalid price — negative",
        input: "price=-10, quantity=1",
        expectedResult: "Raises ValueError: Price must be greater than 0",
        category: "Negative",
        priority: "High",
      },
      {
        id: "TC006",
        scenario: "Quantity below minimum boundary",
        input: "price=10, quantity=0",
        expectedResult: "Raises ValueError: Quantity must be between 1 and 100",
        category: "Boundary",
        priority: "High",
      },
      {
        id: "TC007",
        scenario: "Quantity above maximum boundary",
        input: "price=10, quantity=101",
        expectedResult: "Raises ValueError: Quantity must be between 1 and 100",
        category: "Boundary",
        priority: "High",
      },
      {
        id: "TC008",
        scenario: "Unknown discount code is ignored",
        input: "price=100, quantity=1, discount_code='UNKNOWN'",
        expectedResult: "Returns 100.0 — unknown codes have no effect",
        category: "Edge Case",
        priority: "Medium",
      },
      {
        id: "TC009",
        scenario: "Bulk discount triggers when total exceeds 1,000,000",
        input: "price=20000, quantity=100",
        expectedResult: "Returns 1,900,000.0 (2,000,000 × 0.95)",
        category: "Boundary",
        priority: "Medium",
      },
    ],
    generatedCode: `import pytest\nfrom your_module import calculate_order_total\n\nclass TestCalculateOrderTotal:\n    def test_normal_order(self):\n        assert calculate_order_total(50, 2) == 100.0\n\n    def test_save10_discount(self):\n        assert calculate_order_total(100, 1, 'SAVE10') == 90.0\n\n    def test_save20_discount(self):\n        assert calculate_order_total(100, 1, 'SAVE20') == 80.0\n\n    def test_invalid_price_zero(self):\n        with pytest.raises(ValueError, match='Price must be greater than 0'):\n            calculate_order_total(0, 1)\n\n    def test_invalid_price_negative(self):\n        with pytest.raises(ValueError, match='Price must be greater than 0'):\n            calculate_order_total(-10, 1)\n\n    def test_quantity_below_min(self):\n        with pytest.raises(ValueError, match='Quantity must be between 1 and 100'):\n            calculate_order_total(10, 0)\n\n    def test_quantity_above_max(self):\n        with pytest.raises(ValueError, match='Quantity must be between 1 and 100'):\n            calculate_order_total(10, 101)\n\n    def test_unknown_discount_ignored(self):\n        assert calculate_order_total(100, 1, 'UNKNOWN') == 100.0\n\n    def test_bulk_discount_triggers(self):\n        assert calculate_order_total(20000, 100) == 1900000.0\n`,
  });
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Send a prompt to the configured AI provider and return the raw text response.
 *
 * Provider selection order:
 *   1. AI_MOCK=true                 → local dev fixture
 *   2. WATSONX_API_KEY present      → IBM watsonx.ai
 *   3. OPENAI_API_KEY present       → OpenAI / compatible
 *   4. None configured              → throws a clear setup error
 *
 * @param {string} prompt
 * @returns {Promise<string>} Raw model output (expected to be JSON text)
 */
export async function generateWithAI(prompt) {
  if (process.env.AI_MOCK === "true") {
    console.log("[ai-service] Using mock response (AI_MOCK=true)");
    return mockResponse(prompt);
  }

  if (process.env.WATSONX_API_KEY) {
    console.log("[ai-service] Using IBM watsonx.ai");
    return callWatsonx(prompt);
  }

  if (process.env.OPENAI_API_KEY) {
    console.log("[ai-service] Using OpenAI");
    return callOpenAI(prompt);
  }

  throw new Error(
    "No AI provider configured. Set WATSONX_API_KEY (preferred) or OPENAI_API_KEY, " +
      "or set AI_MOCK=true for local development."
  );
}
