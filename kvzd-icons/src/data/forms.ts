import type { IconData } from '../createIcon'

// Form- and input-adjacent icons, 24 grid. Sources: SearchInput (search),
// TimePicker (clock), FancyTable (filter), Avatar (user stroke redraw and
// the original filled person), Result (lock).
export const search: IconData = {
  body: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
}

export const clock: IconData = {
  body: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
}

export const filter: IconData = {
  filled: true,
  // FancyTable filter trigger (12x16: 2,6 10,6 6,11) rescaled 1.5x. A smaller,
  // wider triangle than the sort carets — it is a funnel glyph, not a caret.
  body: '<polygon points="3,9 15,9 9,16.5"/>',
}

export const user: IconData = {
  // Avatar person redrawn in the stroke family: round head + shoulder line.
  body: '<circle cx="12" cy="8" r="3.75"/><path d="M4 20c0-3.9 3.6-6.25 8-6.25S20 16.1 20 20"/>',
}

export const userFilled: IconData = {
  filled: true,
  // The original Avatar person (24 grid), kept for solid-colour contexts.
  body: '<circle cx="12" cy="8.5" r="4"/><path d="M4 20c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5v1H4z"/>',
}

export const lock: IconData = {
  strokeWidth: 1.5,
  // The 403 lock from Result.tsx (72 grid / 3).
  body: '<rect x="4.67" y="10" width="14.67" height="10" rx="1.33" stroke-width="1.5"/><path d="M8 10V6.67a4 4 0 0 1 8 0V10" stroke-width="1.5"/><circle cx="12" cy="14.67" r="1.33" fill="currentColor" stroke="none"/><path d="M12 16v2" stroke-width="1.5"/>',
}
