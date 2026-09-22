import type { HTMLAttributes } from 'react'

export type TagBoxProps = HTMLAttributes<HTMLSpanElement>

export function TagBox({ className = '', children, ...props }: TagBoxProps) {
  return <span {...props} className={`kvzd-tag-box ${className}`.trim()}>{children}</span>
}
