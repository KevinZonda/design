import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'

export interface TagProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  color?: 'grey' | 'green' | 'teal' | 'turquoise' | 'blue' | 'purple' | 'magenta' | 'pink' | 'red' | 'orange' | 'yellow'
}

export const Tag = forwardRef<HTMLElement, TagProps>(function Tag({ children, className = '', color, ...props }, ref) {
  return <strong {...props} ref={ref} className={`govuk-tag ${color ? `govuk-tag--${color}` : ''} ${className}`.trim()}>{children}</strong>
})
