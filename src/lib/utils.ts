// File: src/lib/utils.ts

/**
 * Utility function to conditionally join class names.
 * Filters out falsy values like null, undefined, or false.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
