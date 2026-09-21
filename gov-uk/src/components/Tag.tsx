import type { HTMLAttributes, ReactNode } from 'react'

export interface TagProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  color?: 'grey' | 'green' | 'turquoise' | 'blue' | 'purple' | 'pink' | 'red' | 'orange' | 'yellow'
}

export function Tag({ children, className = '', color, ...props }: TagProps) {
  return <strong {...props} className={`govuk-tag ${color ? `govuk-tag--${color}` : ''} ${className}`.trim()}>{children}</strong>
}
