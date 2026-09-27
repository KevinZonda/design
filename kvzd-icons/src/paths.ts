import { viewBoxCenter, type IconData } from './createIcon'
import * as actions from './data/actions'
import * as arrows from './data/arrows'
import * as status from './data/status'
import * as result from './data/result'
import * as brand from './data/brand'
import * as forms from './data/forms'

export interface IconPathEntry {
  viewBox: string
  /** Raw inner SVG markup, ready to be embedded in a data URI for CSS masks. */
  body: string
  filled: boolean
}

const entries = { ...actions, ...forms, ...arrows, ...status, ...result, ...brand }

/** Raw path data for every icon, keyed by icon name without the `Icon` suffix. */
export const iconPaths: Record<string, IconPathEntry> = Object.fromEntries(
  Object.entries(entries).map(([name, data]: [string, IconData]) => {
    const viewBox = data.viewBox ?? '0 0 24 24'
    // Bake the rotation in: consumers of the raw markup (e.g. CSS masks) do not
    // run the React renderer that applies IconData.rotate.
    const body = data.rotate
      ? `<g transform="rotate(${data.rotate} ${viewBoxCenter(viewBox)})">${data.body}</g>`
      : data.body
    return [name, { viewBox, body, filled: data.filled ?? false }]
  }),
)
