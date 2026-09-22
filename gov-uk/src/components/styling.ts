import type { CSSProperties } from 'react'

/** Styles for the named, stable parts of a composite component. */
export interface SemanticStyling<Slot extends string> {
  styles?: Partial<Record<Slot, CSSProperties>>
  classNames?: Partial<Record<Slot, string>>
}
