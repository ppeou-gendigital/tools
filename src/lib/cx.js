// Tiny className concatenator. Skips falsy values so we can do:
//   cx(styles.button, disabled && styles.disabled, className)
export function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}
