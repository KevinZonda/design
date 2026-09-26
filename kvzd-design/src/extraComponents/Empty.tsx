import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import type { SemanticStyling } from '../components/index'

export interface EmptyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, SemanticStyling<'root' | 'illustration' | 'title' | 'content' | 'actions'> {
  title?: ReactNode
  illustration?: ReactNode
  actions?: ReactNode
}

export const Empty = forwardRef<HTMLDivElement, EmptyProps>(function Empty({ title = 'No results found', illustration, actions, children, className = '', classNames, style, styles, ...props }, ref) {
  return <div {...props} ref={ref} className={`kvzd-design-empty ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
    <div className={`kvzd-design-empty__illustration ${classNames?.illustration ?? ''}`.trim()} style={styles?.illustration} aria-hidden="true">{illustration ?? <span className="kvzd-design-empty__symbol">?</span>}</div>
    <h3 className={`govuk-heading-s kvzd-design-empty__title ${classNames?.title ?? ''}`.trim()} style={styles?.title}>{title}</h3>
    {children && <div className={`govuk-body kvzd-design-empty__content ${classNames?.content ?? ''}`.trim()} style={styles?.content}>{children}</div>}
    {actions && <div className={`kvzd-design-empty__actions ${classNames?.actions ?? ''}`.trim()} style={styles?.actions}>{actions}</div>}
  </div>
})
