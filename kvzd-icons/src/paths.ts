import type { IconData } from './createIcon'
import * as actions from './data/actions'
import * as arrows from './data/arrows'
import * as status from './data/status'
import * as result from './data/result'
import * as brand from './data/brand'

export interface IconPathEntry {
  viewBox: string
  /** Raw inner SVG markup, ready to be embedded in a data URI for CSS masks. */
  body: string
  filled: boolean
}

const entries = { ...actions, ...arrows, ...status, ...result, ...brand }

/** Raw path data for every icon, keyed by icon name without the `Icon` suffix. */
export const iconPaths: Record<string, IconPathEntry> = Object.fromEntries(
  Object.entries(entries).map(([name, data]: [string, IconData]) => [
    name,
    { viewBox: data.viewBox ?? '0 0 24 24', body: data.body, filled: data.filled ?? false },
  ]),
)
