import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  size?: 's' | 'm' | 'l' | 'xl'
  visible?: boolean
}

export const Divider = forwardRef<HTMLHRElement, DividerProps>(function Divider({ className = '', size = 'm', visible = true, ...props }, ref) {
  const sizeClass = size === 's' ? 'kvzd-design-divider--s' : `govuk-section-break--${size}`
  return <hr {...props} ref={ref} className={`govuk-section-break ${sizeClass} ${visible ? 'govuk-section-break--visible' : ''} ${className}`.trim()} />
})
