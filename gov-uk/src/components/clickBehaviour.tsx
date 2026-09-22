import { forwardRef } from 'react'
import type { AnchorHTMLAttributes, MouseEventHandler, ReactNode, Ref } from 'react'

/** A destination, a click action, or both. The handler may prevent navigation. */
export interface IClickBehaviour {
  href?: string
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
}

export interface ClickTargetProps extends IClickBehaviour {
  children: ReactNode
  className?: string
  anchorProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className' | 'href' | 'onClick'>
}

export const ClickTarget = forwardRef<HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement, ClickTargetProps>(function ClickTarget({ href, onClick, children, className, anchorProps }, ref) {
  if (href !== undefined) {
    return <a {...anchorProps} ref={ref as Ref<HTMLAnchorElement>} className={className} href={href} onClick={(event) => onClick?.(event)}>{children}</a>
  }
  if (onClick) {
    return <button ref={ref as Ref<HTMLButtonElement>} type="button" className={`${className ?? ''} kvzd-clickable-button`.trim()} onClick={(event) => onClick(event)} aria-current={anchorProps?.['aria-current']} aria-describedby={anchorProps?.['aria-describedby']}>{children}</button>
  }
  return <span ref={ref as Ref<HTMLSpanElement>} aria-current={anchorProps?.['aria-current']} aria-describedby={anchorProps?.['aria-describedby']}>{children}</span>
})
