import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import type { SemanticStyling } from '../components/index'
import '../styles/card.css'

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, SemanticStyling<'root' | 'header' | 'title' | 'extra' | 'body' | 'actions'> {
  title?: ReactNode
  /** Right-aligned content in the header, next to the title. */
  extra?: ReactNode
  children?: ReactNode
  /** Footer content separated from the body by a top border. */
  actions?: ReactNode
  /** Highlight the border with the brand colour on hover. */
  hoverable?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ title, extra, children, actions, hoverable = false, className = '', classNames, style, styles, ...props }, ref) {
  const hasHeader = title !== undefined || extra !== undefined
  return <div
    {...props}
    ref={ref}
    className={`kvzd-design-card ${hoverable ? 'kvzd-design-card--hoverable' : ''} ${classNames?.root ?? ''} ${className}`.trim()}
    style={{ ...styles?.root, ...style }}
  >
    {hasHeader && <div className={`kvzd-design-card__header ${classNames?.header ?? ''}`.trim()} style={styles?.header}>
      {title !== undefined && <div className={`kvzd-design-card__title ${classNames?.title ?? ''}`.trim()} style={styles?.title}>{title}</div>}
      {extra !== undefined && <div className={`kvzd-design-card__extra ${classNames?.extra ?? ''}`.trim()} style={styles?.extra}>{extra}</div>}
    </div>}
    {children !== undefined && <div className={`kvzd-design-card__body ${hasHeader ? 'kvzd-design-card__body--with-header' : ''} ${classNames?.body ?? ''}`.trim()} style={styles?.body}>{children}</div>}
    {actions !== undefined && <div className={`kvzd-design-card__actions ${classNames?.actions ?? ''}`.trim()} style={styles?.actions}>{actions}</div>}
  </div>
})
