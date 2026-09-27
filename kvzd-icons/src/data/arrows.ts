import type { IconData } from '../createIcon'

// Filled arrow/table glyphs (fill="currentColor"), centred on the 24 grid.
// Sources: FancyTable (sort triangles, filter funnel, caret), Transfer (direction
// triangles), Button (start arrow), GOV.UK pagination arrows.
export const caretUp: IconData = {
  filled: true,
  body: '<polygon points="6,15 18,15 12,7.5"/>',
}

export const caretDown: IconData = {
  filled: true,
  // FancyTable sort-down triangle (12x16) rescaled 1.5x and centred.
  body: '<polygon points="6,9 18,9 12,16.5"/>',
}

export const caretRight: IconData = {
  filled: true,
  // FancyTable expand caret (16x16) rescaled 1.5x and centred.
  body: '<polygon points="9,4.5 18,12 9,19.5"/>',
}

export const filter: IconData = {
  filled: true,
  // FancyTable filter funnel (12x16) rescaled 1.5x and centred.
  body: '<polygon points="6,9 18,9 12,16.5"/>',
}

export const arrowLeft: IconData = {
  filled: true,
  // Transfer direction triangle (8x12) rescaled 2x and centred.
  body: '<polygon points="20,0 4,12 20,24"/>',
}

export const arrowRight: IconData = {
  filled: true,
  body: '<polygon points="4,0 20,12 4,24"/>',
}

export const startArrow: IconData = {
  filled: true,
  // GOV.UK start icon (33x40) scaled 0.6x, centred horizontally in 24.
  body: '<path d="M2.1 0h7.8l12 12-12 12H2.1l12-12z"/>',
}

export const paginationArrowPrev: IconData = {
  filled: true,
  // GOV.UK pagination arrow (15x13) rescaled 1.6x into the 24 grid and
  // vertically centred (the shaft bleeds off the tail edge, as in the original).
  body: '<path d="m10.55 1.5l-10.76 10.76 10.79 10.25 2.2-2.32-6.7-6.36h20.63v-3.2H5.94l6.87-6.87-2.26-2.26z"/>',
}

export const paginationArrowNext: IconData = {
  filled: true,
  body: '<path d="m12.97 1.5l-2.26 2.26 6.87 6.87H-3.2v3.2h20.63l-6.7 6.36 2.2 2.32 10.79-10.25z"/>',
}
