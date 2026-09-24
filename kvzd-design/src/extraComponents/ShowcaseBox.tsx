import { createElement, forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import type { SemanticStyling } from '../components/index'

export interface ShowcaseBoxProps extends Omit<HTMLAttributes<HTMLElement>, 'title'>, SemanticStyling<'root' | 'header' | 'titleRow' | 'title' | 'headerExtra' | 'description' | 'content' | 'footer'> {
  children?: ReactNode
  description?: ReactNode
  footer?: ReactNode
  headerExtra?: ReactNode
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  title: ReactNode
}

export const ShowcaseBox = forwardRef<HTMLElement, ShowcaseBoxProps>(function ShowcaseBox({
  children,
  className = '',
  classNames,
  description,
  footer,
  headerExtra,
  headingLevel = 2,
  style,
  styles,
  title,
  ...props
}, ref) {
  return <article {...props} ref={ref} className={`kvzd-design-showcase-box ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
    <div className={`kvzd-design-showcase-box__header ${classNames?.header ?? ''}`.trim()} style={styles?.header}>
      <div className={`kvzd-design-showcase-box__title-row ${classNames?.titleRow ?? ''}`.trim()} style={styles?.titleRow}>
        {createElement(`h${headingLevel}`, {
          className: `govuk-heading-m kvzd-design-showcase-box__title ${classNames?.title ?? ''}`.trim(),
          style: styles?.title,
        }, title)}
        {headerExtra != null && <div className={`kvzd-design-showcase-box__header-extra ${classNames?.headerExtra ?? ''}`.trim()} style={styles?.headerExtra}>{headerExtra}</div>}
      </div>
      {description != null && <div className={`govuk-body kvzd-design-showcase-box__description ${classNames?.description ?? ''}`.trim()} style={styles?.description}>{description}</div>}
    </div>
    <div className={`kvzd-design-showcase-box__content ${classNames?.content ?? ''}`.trim()} style={styles?.content}>{children}</div>
    {footer != null && <div className={`kvzd-design-showcase-box__footer ${classNames?.footer ?? ''}`.trim()} style={styles?.footer}>{footer}</div>}
  </article>
})
