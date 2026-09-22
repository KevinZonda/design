import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

export interface NoteProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
}

export const Note = forwardRef<HTMLDivElement, NoteProps>(function Note({ title, children, className = '', ...props }, ref) {
  const hasTitle = title !== undefined && title !== null

  return <div {...props} ref={ref} className={`kvzd-note ${className}`.trim()}>
    {hasTitle && <strong className="kvzd-note__title">{title}</strong>}
    <div className={`kvzd-note__content ${hasTitle ? 'kvzd-note__content--with-title' : ''}`.trim()}>{children}</div>
  </div>
})
