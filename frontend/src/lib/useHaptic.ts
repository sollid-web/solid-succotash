export function triggerHaptic(durationMs = 8) {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return
  try {
    navigator.vibrate(durationMs)
  } catch {
    // unsupported or blocked — silently no-op
  }
}

export function useHaptic() {
  return triggerHaptic
}
