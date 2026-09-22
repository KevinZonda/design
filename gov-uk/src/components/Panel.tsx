import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'

export interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> { children?: ReactNode; title: ReactNode }

export const Panel = forwardRef<HTMLDivElement, PanelProps>(function Panel({ children, className = '', title, ...props }, ref) {
  return <div {...props} ref={ref} className={`govuk-panel govuk-panel--confirmation ${className}`.trim()}><h2 className="govuk-panel__title">{title}</h2>{children && <div className="govuk-panel__body">{children}</div>}</div>
})
