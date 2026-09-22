import type { AnchorHTMLAttributes, MouseEventHandler, ReactNode } from 'react'

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

export function ClickTarget({ href, onClick, children, className, anchorProps }: ClickTargetProps) {
  if (href !== undefined) {
    return <a {...anchorProps} className={className} href={href} onClick={(event) => onClick?.(event)}>{children}</a>
  }
  if (onClick) {
    return <button type="button" className={`${className ?? ''} kvzd-clickable-button`.trim()} onClick={(event) => onClick(event)} aria-current={anchorProps?.['aria-current']} aria-describedby={anchorProps?.['aria-describedby']}>{children}</button>
  }
  return <span aria-current={anchorProps?.['aria-current']} aria-describedby={anchorProps?.['aria-describedby']}>{children}</span>
}
