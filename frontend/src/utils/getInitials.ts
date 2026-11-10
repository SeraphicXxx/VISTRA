// Shared helper for deriving up-to-two-letter initials from a full name.
export function getInitials(name: string = ""): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}