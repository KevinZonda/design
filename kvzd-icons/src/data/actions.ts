import type { IconData } from '../createIcon'

// Stroke-based action icons (fill="none" stroke="currentColor"), 24 grid.
// Sources: SearchInput (search, spinner), TimePicker (clock), Steps (check),
// Calendar (chevrons), Avatar (user, redrawn as stroke per design decision).
export const search: IconData = {
  body: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
}

export const clock: IconData = {
  body: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
}

export const close: IconData = {
  body: '<path d="M6 6l12 12M18 6L6 18"/>',
}

export const check: IconData = {
  // Steps check (20 grid) rescaled to 24.
  body: '<path d="M4.8 12.6l4.8 4.8 9.6-10.8"/>',
}

export const chevronLeft: IconData = {
  // Calendar chevron (20 grid) rescaled to 24.
  body: '<path d="M15 5.4 8.4 12l6.6 6.6"/>',
}

export const chevronRight: IconData = {
  body: '<path d="m9 5.4 6.6 6.6L9 18.6"/>',
}

export const chevronDown: IconData = {
  // New: same stroke style as the left/right chevrons, folded downward.
  body: '<path d="m5.4 9 6.6 6.6L18.6 9"/>',
}

export const spinner: IconData = {
  // Unified spinner: low-opacity full-circle track plus a quarter arc.
  body: '<circle cx="12" cy="12" r="9" opacity="0.25"/><path d="M21 12a9 9 0 0 0-9-9"/>',
}

export const user: IconData = {
  // Avatar person redrawn in the stroke family: round head + shoulder line.
  body: '<circle cx="12" cy="8" r="3.75"/><path d="M4 20c0-3.9 3.6-6.25 8-6.25S20 16.1 20 20"/>',
}
