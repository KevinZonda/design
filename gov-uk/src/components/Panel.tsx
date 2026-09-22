import { createElement, forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import type { SemanticStyling } from './styling'

export interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, SemanticStyling<'root' | 'title' | 'body' | 'actions'> {
  actions?: ReactNode
  children?: ReactNode
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  title: ReactNode
  variant?: 'confirmation' | 'interruption'
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(function Panel({ actions, children, className = '', classNames, headingLevel = 1, style, styles, title, variant = 'confirmation', ...props }, ref) {
  return <div {...props} ref={ref} className={`govuk-panel govuk-panel--${variant} ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
    {createElement(`h${headingLevel}`, { className: `govuk-panel__title ${classNames?.title ?? ''}`.trim(), style: styles?.title }, title)}
    {children != null && <div className={`govuk-panel__body ${classNames?.body ?? ''}`.trim()} style={styles?.body}>{children}</div>}
    {actions != null && <div className={`govuk-panel__actions ${classNames?.actions ?? ''}`.trim()} style={styles?.actions}>{actions}</div>}
  </div>
})
