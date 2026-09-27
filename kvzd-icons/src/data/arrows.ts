import { rotateIcon, type IconData } from '../createIcon'

// Filled direction glyphs (fill="currentColor"), centred on the 24 grid.
// Each family keeps ONE canonical path; the other directions are pure rotations
// of it (rotateIcon), so a shape fix applies to every direction at once.
// Sources: FancyTable (sort carets, expand caret), Transfer (direction
// triangles), Button (start arrow), GOV.UK pagination arrows.
//
// Rotation cheat sheet (SVG rotate is clockwise on screen):
//   90 = point right/down, 180 = reverse, 270 = point left/up.

// FancyTable sort-up triangle (12x16: 6,1 11,7 1,7) recentred on the 24 grid.
export const caretUp: IconData = {
  filled: true,
  body: '<polygon points="6,15 18,15 12,7.5"/>',
}
export const caretDown: IconData = rotateIcon(caretUp, 180)
export const caretRight: IconData = rotateIcon(caretUp, 90)
export const caretLeft: IconData = rotateIcon(caretUp, 270)

// Calendar chevron (20 grid: m5 7.5 5 5L15 7.5) rescaled to 24.
export const chevronDown: IconData = {
  body: '<path d="m5.4 9 6.6 6.6L18.6 9"/>',
}
export const chevronUp: IconData = rotateIcon(chevronDown, 180)
export const chevronLeft: IconData = rotateIcon(chevronDown, 90)
export const chevronRight: IconData = rotateIcon(chevronDown, 270)

// Transfer direction triangle (8x12) rescaled 2x and centred.
export const arrowRight: IconData = {
  filled: true,
  body: '<polygon points="4,0 20,12 4,24"/>',
}
export const arrowLeft: IconData = rotateIcon(arrowRight, 180)
export const arrowDown: IconData = rotateIcon(arrowRight, 90)
export const arrowUp: IconData = rotateIcon(arrowRight, 270)

// GOV.UK start icon (33x40) scaled 0.6x, centred horizontally in 24.
export const startArrow: IconData = {
  filled: true,
  body: '<path d="M2.1 0h7.8l12 12-12 12H2.1l12-12z"/>',
}

// GOV.UK pagination arrow (15x13) rescaled 1.6x into the 24 grid and
// vertically centred (the shaft bleeds off the tail edge, as in the original).
export const paginationArrowPrev: IconData = {
  filled: true,
  body: '<path d="m10.55 1.5l-10.76 10.76 10.79 10.25 2.2-2.32-6.7-6.36h20.63v-3.2H5.94l6.87-6.87-2.26-2.26z"/>',
}
export const paginationArrowNext: IconData = rotateIcon(paginationArrowPrev, 180)
