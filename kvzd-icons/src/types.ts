import type { SVGProps } from 'react'

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'strokeWidth'> & {
  /** Pixel size or CSS size applied to both width and height. Defaults to 24. */
  size?: number | string
  /** Stroke width for stroke-based icons. Defaults to 2. */
  strokeWidth?: number
}
