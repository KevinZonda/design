import { createElement, forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'

export interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  actions?: ReactNode
  children?: ReactNode
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  title: ReactNode
  variant?: 'confirmation' | 'interruption'
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(function Panel({ actions, children, className = '', headingLevel = 1, title, variant = 'confirmation', ...props }, ref) {
  return <div {...props} ref={ref} className={`govuk-panel govuk-panel--${variant} ${className}`.trim()}>
    {createElement(`h${headingLevel}`, { className: 'govuk-panel__title' }, title)}
    {children != null && <div className="govuk-panel__body">{children}</div>}
    {actions != null && <div className="govuk-panel__actions">{actions}</div>}
  </div>
})
