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

// Generic action glyphs added 2026-09, geometry from Lucide (ISC).
export const plus: IconData = {
  body: '<path d="M5 12h14"/><path d="M12 5v14"/>',
}

export const minus: IconData = {
  body: '<path d="M5 12h14"/>',
}

export const edit: IconData = {
  // Lucide pencil.
  body: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
}

export const copy: IconData = {
  body: '<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
}

export const trash: IconData = {
  // Lucide trash-2 (upstream renamed to trash). Exported as `trash`
  // because `delete` is a reserved word; paths.ts re-keys it to `delete`
  // so iconPaths matches DeleteIcon.
  body: '<path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
}

export const upload: IconData = {
  body: '<path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
}

export const download: IconData = {
  body: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
}

export const reload: IconData = {
  // Lucide rotate-cw.
  body: '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
}

export const setting: IconData = {
  // Lucide settings.
  body: '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>',
}

export const drag: IconData = {
  // Lucide grip-vertical; the dots are filled like resultInfo's accent dot.
  body: '<circle cx="9" cy="5" r="1.75" fill="currentColor" stroke="none"/><circle cx="15" cy="5" r="1.75" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1.75" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.75" fill="currentColor" stroke="none"/><circle cx="9" cy="19" r="1.75" fill="currentColor" stroke="none"/><circle cx="15" cy="19" r="1.75" fill="currentColor" stroke="none"/>',
}
