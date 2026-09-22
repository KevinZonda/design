import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  size?: 'm' | 'l' | 'xl'
  visible?: boolean
}

export const Divider = forwardRef<HTMLHRElement, DividerProps>(function Divider({ className = '', size = 'm', visible = true, ...props }, ref) {
  return <hr {...props} ref={ref} className={`govuk-section-break govuk-section-break--${size} ${visible ? 'govuk-section-break--visible' : ''} ${className}`.trim()} />
})
