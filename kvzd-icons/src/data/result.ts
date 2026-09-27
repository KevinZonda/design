import type { IconData } from '../createIcon'

// Result-page icons from kvzd-design Result.tsx, redrawn from the 72 grid onto
// the 24 grid (divide by 3). Strokes scale to 1.5 (rings/frames) and 1.9-2.25
// (accent strokes), keeping the original visual weight.
const RESULT_STROKE_WIDTH = 1.5

export const resultSuccess: IconData = {
  strokeWidth: RESULT_STROKE_WIDTH,
  body: '<circle cx="12" cy="12" r="11.33" stroke-width="1.5"/><path d="M7.33 12.5l3.33 3.33 6.34-7.33" stroke-width="1.9"/>',
}

export const resultError: IconData = {
  strokeWidth: RESULT_STROKE_WIDTH,
  body: '<circle cx="12" cy="12" r="11.33" stroke-width="1.5"/><path d="M8.33 8.33l7.34 7.34M15.67 8.33l-7.34 7.34" stroke-width="1.9"/>',
}

export const resultInfo: IconData = {
  strokeWidth: RESULT_STROKE_WIDTH,
  body: '<circle cx="12" cy="12" r="11.33" stroke-width="1.5"/><path d="M12 10.67V16" stroke-width="2.25"/><circle cx="12" cy="7.33" r="1.17" fill="currentColor" stroke="none"/>',
}

export const resultWarning: IconData = {
  strokeWidth: RESULT_STROKE_WIDTH,
  body: '<path d="M12 2.67L22.67 20.67H1.33z" stroke-width="1.5"/><path d="M12 9.33V14" stroke-width="2.25"/><circle cx="12" cy="16.67" r="1.13" fill="currentColor" stroke="none"/>',
}

export const result404: IconData = {
  strokeWidth: RESULT_STROKE_WIDTH,
  // Two ghost eyes with a clear gap, and the original 45° slash passing
  // through the midpoint of the eye axis (perpendicular-aligned).
  body: '<circle cx="7" cy="12" r="2.5" stroke-width="1.5"/><circle cx="17" cy="12" r="2.5" stroke-width="1.5"/><path d="M4 20L20 4" stroke-width="1.5"/>',
}

export const result500: IconData = {
  strokeWidth: RESULT_STROKE_WIDTH,
  body: '<rect x="2.67" y="5.33" width="18.67" height="11.33" rx="1.33" stroke-width="1.5"/><path d="M8 19.33h8M12 16.67v2.67" stroke-width="1.5"/><path d="M8.67 8.67l2.67 2-2.67 2M12.67 12.67h3.33" stroke-width="1.5"/>',
}
