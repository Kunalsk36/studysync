/**
 * Merge conditional class names. Falsy values are skipped.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
