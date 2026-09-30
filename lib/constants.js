export const LANGUAGES = [
  { value: "python", label: "Python", mono: "PY" },
  { value: "javascript", label: "JavaScript", mono: "JS" },
  { value: "java", label: "Java", mono: "JV" },
  { value: "typescript", label: "TypeScript", mono: "TS" },
];

export const FRAMEWORKS = {
  python: [
    { value: "pytest", label: "Pytest" },
    { value: "unittest", label: "unittest" },
  ],
  javascript: [
    { value: "jest", label: "Jest" },
    { value: "vitest", label: "Vitest" },
    { value: "mocha", label: "Mocha" },
  ],
  java: [
    { value: "junit", label: "JUnit 5" },
    { value: "testng", label: "TestNG" },
  ],
  typescript: [
    { value: "jest", label: "Jest" },
    { value: "vitest", label: "Vitest" },
  ],
};

export const PRIORITY_COLORS = {
  High: { text: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)" },
  Medium: { text: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
  Low: { text: "#71717a", bg: "rgba(113,113,122,0.1)", border: "rgba(113,113,122,0.25)" },
};

export const CATEGORY_COLORS = {
  "Happy Path":    { text: "#60a5fa", bg: "rgba(96,165,250,0.08)" },
  "Edge Case":     { text: "#c084fc", bg: "rgba(192,132,252,0.08)" },
  "Regression":    { text: "#fb923c", bg: "rgba(251,146,60,0.08)" },
  "Boundary":      { text: "#34d399", bg: "rgba(52,211,153,0.08)" },
  "Error Handling":{ text: "#f87171", bg: "rgba(248,113,113,0.08)" },
  "Negative":      { text: "#f87171", bg: "rgba(248,113,113,0.08)" },
  "Validation":    { text: "#fbbf24", bg: "rgba(251,191,36,0.08)" },
};

export const PLACEHOLDER_CODE = {
  python: `def calculate_discount(price, discount_percent):
    """
    Calculate the final price after applying a discount.
    
    Args:
        price: Original price (must be positive)
        discount_percent: Discount percentage (0-100)
    
    Returns:
        float: Final discounted price
    """
    if price < 0:
        raise ValueError("Price cannot be negative")
    if not (0 <= discount_percent <= 100):
        raise ValueError("Discount must be between 0 and 100")
    
    discount_amount = price * (discount_percent / 100)
    return price - discount_amount`,

  javascript: `function calculateDiscount(price, discountPercent) {
  /**
   * Calculate the final price after applying a discount.
   * @param {number} price - Original price (must be positive)
   * @param {number} discountPercent - Discount percentage (0-100)
   * @returns {number} Final discounted price
   */
  if (price < 0) {
    throw new Error("Price cannot be negative");
  }
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error("Discount must be between 0 and 100");
  }
  const discountAmount = price * (discountPercent / 100);
  return price - discountAmount;
}`,

  typescript: `function calculateDiscount(price: number, discountPercent: number): number {
  /**
   * Calculate the final price after applying a discount.
   * @param price - Original price (must be positive)
   * @param discountPercent - Discount percentage (0-100)
   * @returns Final discounted price
   */
  if (price < 0) {
    throw new Error("Price cannot be negative");
  }
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error("Discount must be between 0 and 100");
  }
  const discountAmount = price * (discountPercent / 100);
  return price - discountAmount;
}`,

  java: `public class PriceCalculator {
    /**
     * Calculate the final price after applying a discount.
     *
     * @param price           Original price (must be positive)
     * @param discountPercent Discount percentage (0-100)
     * @return Final discounted price
     * @throws IllegalArgumentException if inputs are out of range
     */
    public double calculateDiscount(double price, double discountPercent) {
        if (price < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        if (discountPercent < 0 || discountPercent > 100) {
            throw new IllegalArgumentException("Discount must be between 0 and 100");
        }
        double discountAmount = price * (discountPercent / 100);
        return price - discountAmount;
    }
}`,
};
