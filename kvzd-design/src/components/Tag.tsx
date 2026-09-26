import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'

export interface TagProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  color?: 'grey' | 'green' | 'teal' | 'turquoise' | 'blue' | 'purple' | 'magenta' | 'pink' | 'red' | 'orange' | 'yellow'
  closable?: boolean
  onClose?: () => void
}

export const Tag = forwardRef<HTMLElement, TagProps>(function Tag({ children, className = '', color, closable = false, onClose, ...props }, ref) {
  return <strong {...props} ref={ref} className={`govuk-tag ${color ? `govuk-tag--${color}` : ''} ${closable ? 'kvzd-design-tag--closable' : ''} ${className}`.trim()}>
    {children}
    {closable && <button type="button" className="kvzd-design-tag__close" aria-label="Close" onClick={(event) => { event.stopPropagation(); onClose?.() }}>×</button>}
  </strong>
})
