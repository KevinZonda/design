import type { IconData } from '../createIcon'

// Feedback and messaging icons, 24 grid. Added 2026-09, geometry from
// Lucide (ISC), redrawn angular (straight lines, right angles and 45°
// diagonals only — no Béziers) to match the GOV.UK-flavoured stroke family.
// The round outer ring of questionCircle stays, as do the filled square
// accent dots (the square answer to resultInfo's round dot).
export const questionCircle: IconData = {
  // Round ring (same language as user/search/clock) with a square-cornered
  // question-mark body and a filled square dot.
  body: '<circle cx="12" cy="12" r="9"/><path d="M15 8H9.5V12H13.5V15"/><rect x="11.25" y="16" width="1.5" height="1.5" fill="currentColor" stroke="none"/>',
}

export const exclamation: IconData = {
  // Straight stem plus a filled square dot, recentred vertically.
  body: '<path d="M12 6.5v8.5"/><rect x="11.25" y="16.25" width="1.5" height="1.5" fill="currentColor" stroke="none"/>',
}

export const bell: IconData = {
  // Trapezoid bell (narrow top, straight flaring sides), a wider straight
  // brim line and a filled square clapper.
  body: '<polygon points="10,5 14,5 17,14.5 7,14.5"/><path d="M5.5 16.5h13"/><rect x="11.25" y="18" width="1.5" height="1.5" fill="currentColor" stroke="none"/>',
}

export const mail: IconData = {
  // Square-cornered envelope with a straight V flap.
  body: '<rect x="3.5" y="5.5" width="17" height="13"/><path d="M4 7.5l8 6 8-6"/>',
}

export const phone: IconData = {
  // Angular handset silhouette: two right-angled ear/mouth blocks joined by
  // 45° diagonals (every segment H, V or 45°).
  body: '<polygon points="7,3.5 10.5,3.5 10.5,8.5 17,15 17,18.5 13.5,18.5 7,12"/>',
}

export const file: IconData = {
  // Square-cornered sheet with a folded dog-ear.
  body: '<path d="M6.5 3.5h7l4 4v13h-11z"/><path d="M13.5 3.5v4h4"/>',
}

export const fileText: IconData = {
  // Angular file plus three text rules (the last one short).
  body: '<path d="M6.5 3.5h7l4 4v13h-11z"/><path d="M13.5 3.5v4h4"/><path d="M9 12h6"/><path d="M9 15h6"/><path d="M9 18h4"/>',
}

export const paperClip: IconData = {
  // Square-spiral clip: one continuous wire of H/V/45° runs — outer loop,
  // inner turn, both ends meeting at the top-right cap.
  body: '<path d="M19 8V5H16L6.5 14.5V18H9.5L16 11.5V14H13.5L19 8.5"/>',
}

export const safety: IconData = {
  // Pentagon shield (pointed base) with an angular check.
  body: '<polygon points="12,3 19.5,5.5 19.5,11.5 12,20.5 4.5,11.5 4.5,5.5"/><path d="M8.5 12.5l2.5 2.5 4.5-5.5"/>',
}

export const image: IconData = {
  // Square-cornered frame, filled square sun and angular mountain lines.
  body: '<rect x="3.5" y="4.5" width="17" height="15"/><rect x="7.75" y="7.75" width="2.5" height="2.5" fill="currentColor" stroke="none"/><path d="M4 18l4.5-5.5 3.5 3.5L16.5 11l3.5 3.5"/>',
}
