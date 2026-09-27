import type { IconData } from '../createIcon'

// Filled status glyphs (fill="currentColor", fillRule="evenodd").
// Redrawn from kvzd-design Alert.tsx: the 20-grid mask-based icons are rebuilt
// as a solid shape with the glyph knocked out via evenodd subpaths (no masks).
// Coordinates scaled 1.2x onto the 24 grid (2.4 strokes become 2.88-wide
// knockouts). The check keeps round caps and a round join; the info/warning
// stems are stadium shapes (round caps), matching the original round linecaps.
export const checkCircle: IconData = {
  filled: true,
  // The check keeps the original round caps and round join: a 1.44-radius
  // outer join arc at the elbow and semicircle caps at both ends.
  body: '<path fill-rule="evenodd" d="M1.2 12A10.8 10.8 0 1 0 22.8 12A10.8 10.8 0 1 0 1.2 12zM5.7 13.5L9.18 16.98A1.44 1.44 0 0 0 11.27 16.93L18.47 9.01A1.44 1.44 0 1 0 16.33 7.07L10.15 13.87L7.74 11.46A1.44 1.44 0 1 0 5.7 13.5z"/>',
}

export const infoCircle: IconData = {
  filled: true,
  body: '<path fill-rule="evenodd" d="M1.2 12A10.8 10.8 0 1 0 22.8 12A10.8 10.8 0 1 0 1.2 12zM10.56 11.16A1.44 1.44 0 0 1 13.44 11.16L13.44 18A1.44 1.44 0 0 1 10.56 18zM10.2 7.56A1.8 1.8 0 1 0 13.8 7.56A1.8 1.8 0 1 0 10.2 7.56z"/>',
}

export const warningTriangle: IconData = {
  filled: true,
  body: '<path fill-rule="evenodd" d="M12 2.64L22.08 21L1.92 21zM10.56 9.84A1.44 1.44 0 0 1 13.44 9.84L13.44 15.36A1.44 1.44 0 0 1 10.56 15.36zM10.32 18.36A1.68 1.68 0 1 0 13.68 18.36A1.68 1.68 0 1 0 10.32 18.36z"/>',
}

export const errorCircle: IconData = {
  filled: true,
  // The X knockout is a single 12-vertex polygon (the union of two 45°
  // rectangles), so the crossing stays solid under evenodd.
  body: '<path fill-rule="evenodd" d="M1.2 12A10.8 10.8 0 1 0 22.8 12A10.8 10.8 0 1 0 1.2 12zM17.2 15.15L15.15 17.2L12 14.05L8.85 17.2L6.8 15.15L9.95 12L6.8 8.85L8.85 6.8L12 9.95L15.15 6.8L17.2 8.85L14.05 12z"/>',
}
