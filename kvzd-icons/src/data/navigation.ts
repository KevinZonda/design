import type { IconData } from '../createIcon'

// Navigation chrome icons, 24 grid. Added 2026-09, geometry from Lucide (ISC).
export const home: IconData = {
  // Lucide house.
  body: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
}

export const menu: IconData = {
  body: '<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>',
}

export const more: IconData = {
  // Lucide ellipsis; the dots are filled like resultInfo's accent dot.
  body: '<circle cx="5" cy="12" r="1.75" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.75" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.75" fill="currentColor" stroke="none"/>',
}

export const toTop: IconData = {
  // Lucide arrow-up-to-line.
  body: '<path d="M5 3h14"/><path d="m18 13-6-6-6 6"/><path d="M12 7v14"/>',
}

export const link: IconData = {
  body: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
}

export const logout: IconData = {
  // Lucide log-out.
  body: '<path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>',
}
