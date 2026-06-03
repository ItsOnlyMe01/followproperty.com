/**
 * Shared formatter utilities for PDF generation and UI components.
 */

/**
 * Checks if a value is empty, none, or not configured.
 * @param {any} val 
 * @returns {boolean}
 */
export function isEmpty(val) {
  if (val === null || val === undefined) return true;
  if (typeof val === "string") {
    const clean = val.trim().toLowerCase();
    return (
      clean === "" ||
      clean === "none" ||
      clean === "null" ||
      clean === "undefined" ||
      clean === "not configured" ||
      clean === "—" ||
      clean === "-"
    );
  }
  if (Array.isArray(val)) {
    return val.length === 0;
  }
  return false;
}

/**
 * Formats currency values in Indian layout (Crores / Lakhs)
 * @param {number|string} val 
 * @param {string} symbol - Prefix symbol (e.g. "₹" or "INR ")
 * @returns {string}
 */
export function formatCurrency(val, symbol = "INR ") {
  if (isEmpty(val)) return "";
  const parsed = Number(val);
  if (isNaN(parsed)) return String(val);

  if (parsed >= 10000000) {
    const formatted = (parsed / 10000000).toFixed(2);
    const trimmed = formatted.endsWith(".00") ? parseFloat(formatted) : formatted;
    return `${symbol}${trimmed} Cr`;
  }
  if (parsed >= 100000) {
    const formatted = (parsed / 100000).toFixed(2);
    const trimmed = formatted.endsWith(".00") ? parseFloat(formatted) : formatted;
    return `${symbol}${trimmed} L`;
  }
  return `${symbol}${parsed.toLocaleString("en-IN")}`;
}

/**
 * Formats price ranges using Indian layout currency formatting.
 * @param {number|string} min 
 * @param {number|string} max 
 * @param {string} symbol 
 * @returns {string}
 */
export function formatPriceRange(min, max, symbol = "INR ") {
  if (isEmpty(min) && isEmpty(max)) return "Price on Request";
  if (isEmpty(min)) return formatCurrency(max, symbol);
  if (isEmpty(max) || max === min) return formatCurrency(min, symbol);
  return `${formatCurrency(min, symbol)} – ${formatCurrency(max, symbol)}`;
}

/**
 * Formats area ranges or single area values with a sq.ft suffix.
 * @param {number|string} min 
 * @param {number|string} max 
 * @param {string} superArea 
 * @param {string} avgArea 
 * @returns {string}
 */
export function formatAreaRange(min, max, superArea, avgArea) {
  const rawArea = superArea || avgArea;
  if (!isEmpty(rawArea) && typeof rawArea === "string" && (rawArea.includes("-") || rawArea.toLowerCase().includes("to"))) {
    let clean = rawArea.trim();
    if (!clean.toLowerCase().includes("sq.ft") && !clean.toLowerCase().includes("sq. ft")) {
      clean = `${clean} sq.ft`;
    }
    return clean;
  }
  
  const numMin = Number(min);
  const numMax = Number(max);
  
  if (!isNaN(numMin) && !isNaN(numMax) && numMin > 0 && numMax > 0 && numMin !== numMax) {
    return `${numMin.toLocaleString()} – ${numMax.toLocaleString()} sq.ft`;
  }
  
  const val = min || max || rawArea;
  if (isEmpty(val)) return "";
  return isNaN(Number(val)) ? String(val) : `${Number(val).toLocaleString()} sq.ft`;
}
