import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import '../styles/grid.css'

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export const Row = forwardRef<HTMLDivElement, RowProps>(function Row({ children, className = '', style, ...props }, ref) {
  return <div {...props} ref={ref} className={`govuk-grid-row ${className}`.trim()} style={style}>{children}</div>
})

export type ColWidth = 'full' | 'one-half' | 'one-third' | 'two-thirds' | 'one-quarter' | 'three-quarters'

export interface ColProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  /** Column width; maps to `govuk-grid-column-${width}`. */
  width?: ColWidth
  /** Apply the width only from the desktop breakpoint up (full width below it). */
  fromDesktop?: boolean
}

export const Col = forwardRef<HTMLDivElement, ColProps>(function Col({ children, width = 'full', fromDesktop = false, className = '', style, ...props }, ref) {
  return <div {...props} ref={ref} className={`govuk-grid-column-${width}${fromDesktop ? '-from-desktop' : ''} ${className}`.trim()} style={style}>{children}</div>
})
