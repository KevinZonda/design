import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import type { SemanticStyling } from '@kvzd-design/gov-uk'

export interface EmptyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, SemanticStyling<'root' | 'illustration' | 'title' | 'description' | 'actions'> {
  title?: ReactNode
  description?: ReactNode
  illustration?: ReactNode
}

export const Empty = forwardRef<HTMLDivElement, EmptyProps>(function Empty({ title = 'No results found', description, illustration, children, className = '', classNames, style, styles, ...props }, ref) {
  return <div {...props} ref={ref} className={`kvzd-empty ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
    <div className={`kvzd-empty__illustration ${classNames?.illustration ?? ''}`.trim()} style={styles?.illustration} aria-hidden="true">{illustration ?? <span className="kvzd-empty__symbol">?</span>}</div>
    <h3 className={`govuk-heading-s kvzd-empty__title ${classNames?.title ?? ''}`.trim()} style={styles?.title}>{title}</h3>
    {description && <p className={`govuk-body kvzd-empty__description ${classNames?.description ?? ''}`.trim()} style={styles?.description}>{description}</p>}
    {children && <div className={`kvzd-empty__actions ${classNames?.actions ?? ''}`.trim()} style={styles?.actions}>{children}</div>}
  </div>
})
