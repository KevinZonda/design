import type { FC, ReactNode } from 'react'
import type { IconProps } from './types'

export interface IconData {
  /** Raw inner SVG markup (self-closing <circle>, <path> or <polygon> tags only). */
  body: string
  /** Filled icons use fill="currentColor"; stroke-based icons use stroke="currentColor". */
  filled?: boolean
  viewBox?: string
  /** Default stroke width for stroke-based icons. Defaults to 2. */
  strokeWidth?: number
  /** Rotate the glyph around the viewBox centre; used to derive icon directions
   * (e.g. prev/next arrows) from a single canonical path. Lossless for both
   * fill and stroke icons. */
  rotate?: 90 | 180 | 270
}

/** Derive a rotated variant of an icon without duplicating its path data. */
export function rotateIcon(data: IconData, rotate: 90 | 180 | 270): IconData {
  return { ...data, rotate }
}

/** Centre point "cx cy" of a viewBox string, for rotate() transforms. */
export function viewBoxCenter(viewBox: string): string {
  const [x, y, width, height] = viewBox.split(' ').map(Number)
  return `${x + width / 2} ${y + height / 2}`
}

const TAG_PATTERN = /<(circle|path|polygon|rect)\s+([^/>]*?)\/?>(?:<\/\1>)?/g
const ATTR_PATTERN = /([\w-]+)="([^"]*)"/g
const NUMBER_PATTERN = /^-?\d+(\.\d+)?$/

function parseAttributes(raw: string): Record<string, string | number> {
  const attrs: Record<string, string | number> = {}
  for (const match of raw.matchAll(ATTR_PATTERN)) {
    const name = match[1].replaceAll(/-(\w)/g, (_, letter: string) => letter.toUpperCase())
    attrs[name] = NUMBER_PATTERN.test(match[2]) ? Number(match[2]) : match[2]
  }
  return attrs
}

function parseBody(body: string): ReactNode[] {
  return [...body.matchAll(TAG_PATTERN)].map((match, index) => {
    const attrs = parseAttributes(match[2])
    switch (match[1]) {
      case 'circle':
        return <circle key={index} {...attrs} />
      case 'polygon':
        return <polygon key={index} {...attrs} />
      case 'rect':
        return <rect key={index} {...attrs} />
      default:
        return <path key={index} {...attrs} />
    }
  })
}

export function createIcon(displayName: string, data: IconData): FC<IconProps> {
  const { body, filled = false, viewBox = '0 0 24 24', rotate } = data
  const content = parseBody(body)
  const defaultStrokeWidth = data.strokeWidth ?? 2
  const Icon: FC<IconProps> = ({ size = 24, strokeWidth = defaultStrokeWidth, ...rest }) => (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? undefined : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {rotate ? <g transform={`rotate(${rotate} ${viewBoxCenter(viewBox)})`}>{content}</g> : content}
    </svg>
  )
  Icon.displayName = displayName
  return Icon
}
