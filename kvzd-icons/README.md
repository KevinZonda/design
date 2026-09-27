# @kevinzonda/icons

SVG icon library for the KevinZonda Design System, built for React. Every icon renders on a normalised `0 0 24 24` grid and inherits the current text colour via `currentColor` — no colours are hard-coded.

Two visual families:

- **Stroke-based** (core actions): `fill="none" stroke="currentColor"`, round line caps and joins, default stroke width 2.
- **Filled** (carets, arrows, status, brand): `fill="currentColor"`; knock-outs use `fillRule="evenodd"`.

## Install

```sh
pnpm add @kevinzonda/icons
```

## Usage

```tsx
import { SearchIcon, CheckCircleIcon } from '@kevinzonda/icons'

<SearchIcon size={20} className="my-icon" aria-hidden />
<CheckCircleIcon size="2rem" />
```

- `size?: number | string` — applied to both `width` and `height`, defaults to `24`.
- `strokeWidth?: number` — stroke-based icons only, defaults to `2` (result-page icons default to `1.5`).
- All remaining SVG props are spread onto the `<svg>` element.
- Icons are decorative by default (`aria-hidden="true"`); pass any aria attribute to override.

## Raw paths (CSS mask)

`iconPaths` exposes the raw path data for non-React usage, keyed by icon name without the `Icon` suffix:

```ts
import { iconPaths } from '@kevinzonda/icons'

const { viewBox, body, filled } = iconPaths.search
const css = `
  background: currentColor;
  mask: url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>`)}") center / contain no-repeat;
`
```

Each entry contains `viewBox`, the inner SVG markup as a `body` string, and a `filled` flag.

## Scripts

- `pnpm build` — bundle to `dist-lib` with Vite and emit type declarations.
- `pnpm lint` — oxlint.
- `pnpm test` — vitest.
