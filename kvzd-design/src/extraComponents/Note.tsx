import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import type { SemanticStyling } from '../components/index'

export interface NoteProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, SemanticStyling<'root' | 'title' | 'content'> {
  title?: ReactNode
}

export const Note = forwardRef<HTMLDivElement, NoteProps>(function Note({ title, children, className = '', classNames, style, styles, ...props }, ref) {
  const hasTitle = title !== undefined && title !== null

  return <div {...props} ref={ref} className={`kvzd-design-note ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
    {hasTitle && <strong className={`kvzd-design-note__title ${classNames?.title ?? ''}`.trim()} style={styles?.title}>{title}</strong>}
    <div className={`kvzd-design-note__content ${hasTitle ? 'kvzd-design-note__content--with-title' : ''} ${classNames?.content ?? ''}`.trim()} style={styles?.content}>{children}</div>
  </div>
})
