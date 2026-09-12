// Formats an ISO-style date string ("2026-09-18") into a readable
// long-form date ("September 18, 2026"). Falls back to the raw string
// if it can't be parsed, so a bad value never crashes the UI.
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

// Compact version ("Sep 18") for tight spaces like metric tiles, where
// the full long-form date would overflow or force awkward truncation.
export function formatShortDate(dateStr: string): string {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}