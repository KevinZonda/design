import type { IconData } from '../createIcon'

// Stroke-based action icons (fill="none" stroke="currentColor"), 24 grid.
// Sources: Steps (check), generic close/spinner.
export const close: IconData = {
  body: '<path d="M6 6l12 12M18 6L6 18"/>',
}

export const check: IconData = {
  // Steps check (20 grid) rescaled to 24.
  body: '<path d="M4.8 12.6l4.8 4.8 9.6-10.8"/>',
}

export const spinner: IconData = {
  // Unified spinner: low-opacity full-circle track plus a quarter arc.
  body: '<circle cx="12" cy="12" r="9" opacity="0.25"/><path d="M21 12a9 9 0 0 0-9-9"/>',
}
