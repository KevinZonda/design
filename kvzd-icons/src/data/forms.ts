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

// Input-adjacent glyphs added 2026-09, geometry from Lucide (ISC).
// eye/eyeInvisible/calendar were redrawn angular (straight lines and right
// angles) to match the GOV.UK-flavoured stroke family.
export const eye: IconData = {
  // Angular redraw: hexagonal almond (pointed ends, straight edges) with a
  // square pupil instead of the Lucide arcs + round iris.
  body: '<polygon points="2.5,12 8,7 16,7 21.5,12 16,17 8,17"/><rect x="9.5" y="9.5" width="5" height="5"/>',
}

export const eyeInvisible: IconData = {
  // Angular redraw of the hex eye plus a 45° slash.
  body: '<polygon points="2.5,12 8,7 16,7 21.5,12 16,17 8,17"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M5 19L19 5"/>',
}

export const calendar: IconData = {
  // Angular redraw: square-cornered page, straight binder tabs, straight
  // header rule.
  body: '<rect x="3.5" y="5.5" width="17" height="15"/><path d="M8.5 3v4"/><path d="M15.5 3v4"/><path d="M3.5 10.5h17"/>',
}

export const key: IconData = {
  // Lucide key-round; the keyhole is a filled dot like resultInfo's.
  body: '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r="1.25" fill="currentColor" stroke="none"/>',
}

export const clearCircle: IconData = {
  filled: true,
  // Same evenodd construction as status.errorCircle: solid disc plus a
  // single 12-vertex X knockout (the union of two 45° rectangles), sized
  // like the Lucide x stroke icon, so the pair always matches.
  body: '<path fill-rule="evenodd" d="M1.2 12A10.8 10.8 0 1 0 22.8 12A10.8 10.8 0 1 0 1.2 12zM17.2 15.15L15.15 17.2L12 14.05L8.85 17.2L6.8 15.15L9.95 12L6.8 8.85L8.85 6.8L12 9.95L15.15 6.8L17.2 8.85L14.05 12z"/>',
}
