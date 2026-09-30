/**
 * Master prompt builder for AI Test Case Generator.
 *
 * Builds a structured prompt that instructs the AI model to act as a
 * Senior QA / Test Automation Engineer and return a strict JSON payload.
 *
 * @param {object} params
 * @param {string} params.programmingLanguage
 * @param {string} params.testingFramework
 * @param {string} params.sourceCode
 * @returns {string} The complete prompt ready to send to any LLM.
 */
export function buildPrompt({ programmingLanguage, testingFramework, sourceCode }) {
  return `You are a Senior Software QA Engineer and Test Automation Engineer.

Analyze the provided source code.

Programming Language:
${programmingLanguage}

Testing Framework:
${testingFramework}

Source Code:
${sourceCode}

Your task is to analyze the code and generate meaningful software test cases.

Cover where applicable:
- Happy Path scenarios
- Negative scenarios
- Input validation
- Edge cases
- Boundary conditions
- Error handling
- Combinations of business rules

Do not invent behavior that cannot be verified from the provided source code.

For every test case return:
- id
- scenario
- input
- expectedResult
- category
- priority

Also generate executable automated test code using ${testingFramework}.

Before returning the result:
- Remove duplicate test cases
- Make sure expected results match the source code behavior
- Make sure test code is syntactically reasonable
- Do not include unsupported assumptions

Return ONLY valid JSON matching this exact structure (no markdown, no code fences, no extra text):

{
  "analysis": {
    "summary": "short explanation of the analyzed code",
    "functionsDetected": ["functionName"],
    "businessRulesDetected": ["rule description"],
    "totalTestCases": 0
  },
  "testCases": [
    {
      "id": "TC001",
      "scenario": "scenario description",
      "input": "input description",
      "expectedResult": "expected behavior",
      "category": "Happy Path",
      "priority": "High"
    }
  ],
  "generatedCode": "executable automated test code as a string"
}

Valid category values: Happy Path, Negative, Validation, Edge Case, Boundary
Valid priority values: High, Medium, Low
Do not wrap the JSON inside markdown code fences.`;
}
