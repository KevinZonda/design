import { forwardRef } from 'react'
import type { AnchorHTMLAttributes, CSSProperties, MouseEventHandler, ReactNode, Ref } from 'react'

/** A destination, a click action, or both. The handler may prevent navigation. */
export interface IClickBehaviour {
  href?: string
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
}

export interface ClickTargetProps extends IClickBehaviour {
  children: ReactNode
  className?: string
  style?: CSSProperties
  anchorProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className' | 'href' | 'onClick'>
}

export const ClickTarget = forwardRef<HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement, ClickTargetProps>(function ClickTarget({ href, onClick, children, className, style, anchorProps }, ref) {
  if (href !== undefined) {
    return <a {...anchorProps} ref={ref as Ref<HTMLAnchorElement>} className={className} style={style ?? anchorProps?.style} href={href} onClick={(event) => onClick?.(event)}>{children}</a>
  }
  if (onClick) {
    return <button ref={ref as Ref<HTMLButtonElement>} type="button" className={`${className ?? ''} kvzd-clickable-button`.trim()} style={style} onClick={(event) => onClick(event)} aria-current={anchorProps?.['aria-current']} aria-describedby={anchorProps?.['aria-describedby']}>{children}</button>
  }
  return <span ref={ref as Ref<HTMLSpanElement>} style={style} aria-current={anchorProps?.['aria-current']} aria-describedby={anchorProps?.['aria-describedby']}>{children}</span>
})
