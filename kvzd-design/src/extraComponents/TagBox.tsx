import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export type TagBoxProps = HTMLAttributes<HTMLSpanElement>

export const TagBox = forwardRef<HTMLSpanElement, TagBoxProps>(function TagBox({ className = '', children, ...props }, ref) {
  return <span {...props} ref={ref} className={`kvzd-tag-box ${className}`.trim()}>{children}</span>
})
