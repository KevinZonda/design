import type { CSSProperties } from 'react'

/**
 * Token shorthand. Numbers are pixel values.
 *
 * Spacing: `m15`, `mt20`, `mb0`, `ml8`, `mr8`, `mx12`, `my16` and the
 * `p*`/`pt*`/`pb*`/`pl*`/`pr*`/`px*`/`py*` padding equivalents. Negative
 * values are allowed for margins: `mt-20`.
 * Sizes: `fs19` (fontSize), `w370` (width), `h40` (height).
 */
export type KssToken =
  | `m${number}` | `mt${number}` | `mb${number}` | `ml${number}` | `mr${number}` | `mx${number}` | `my${number}`
  | `p${number}` | `pt${number}` | `pb${number}` | `pl${number}` | `pr${number}` | `px${number}` | `py${number}`
  | `fs${number}` | `w${number}` | `h${number}`

/** A token, or a falsy value that is skipped (enables `kss('mb0', loading && 'fs19')`). */
export type KssInput = KssToken | false | null | undefined | ''

const SPACE_PATTERN = /^(m|p)(x|y|t|b|l|r)?(-?\d+(?:\.\d+)?)$/
const SIZE_PATTERN = /^(fs|w|h)(\d+(?:\.\d+)?)$/

const SIDES: Record<string, string[]> = {
  '': [''],
  t: ['Top'],
  b: ['Bottom'],
  l: ['Left'],
  r: ['Right'],
  x: ['Left', 'Right'],
  y: ['Top', 'Bottom'],
}

const SIZE_PROPERTIES: Record<string, string> = {
  fs: 'fontSize',
  w: 'width',
  h: 'height',
}

const cache = new Map<string, CSSProperties>()

/**
 * Build a React `style` object from shorthand tokens.
 *
 * ```tsx
 * <Text style={kss('mb0')}>Small</Text>
 * // → { marginBottom: 0 }
 *
 * <Button style={kss('mb0', loading && 'fs19')}>…</Button>
 * // → { marginBottom: 0, fontSize: 19 } while loading, else { marginBottom: 0 }
 * ```
 *
 * Results are cached by token list, so repeated calls with the same tokens
 * return the same object.
 */
export function kss(...inputs: KssInput[]): CSSProperties {
  const tokens = inputs.filter((input): input is KssToken => Boolean(input))
  const key = tokens.join(' ')
  const cached = cache.get(key)
  if (cached) return cached

  const style: Record<string, number> = {}
  for (const token of tokens) {
    const space = SPACE_PATTERN.exec(token)
    if (space) {
      const base = space[1] === 'm' ? 'margin' : 'padding'
      for (const side of SIDES[space[2] ?? '']) style[`${base}${side}`] = Number(space[3])
      continue
    }
    const size = SIZE_PATTERN.exec(token)
    if (size) {
      style[SIZE_PROPERTIES[size[1]]] = Number(size[2])
      continue
    }
    throw new Error(`[kss] unknown token: "${token}"`)
  }

  const result = style as CSSProperties
  cache.set(key, result)
  return result
}
