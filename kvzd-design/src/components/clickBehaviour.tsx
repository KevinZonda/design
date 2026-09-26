import { forwardRef } from 'react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, HTMLAttributes, MouseEventHandler, ReactNode, Ref } from 'react'

/** A destination, a click action, or both. The handler may prevent navigation. */
export interface ClickBehaviourProps {
  href?: string
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
}

export interface ClickTargetProps extends ClickBehaviourProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  anchorProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className' | 'href' | 'onClick'>
}

export const ClickTarget = forwardRef<HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement, ClickTargetProps>(function ClickTarget({ href, onClick, children, className = '', style, anchorProps }, ref) {
  const { className: anchorClassName, style: anchorStyle, href: _href, onClick: _anchorOnClick, ...rest } = (anchorProps ?? {}) as AnchorHTMLAttributes<HTMLAnchorElement>
  const mergedClassName = `${className} ${anchorClassName ?? ''}`.trim()
  const mergedStyle = { ...anchorStyle, ...style }
  if (href !== undefined) {
    return <a {...rest} ref={ref as Ref<HTMLAnchorElement>} className={className} style={style ?? anchorStyle} href={href} onClick={(event) => onClick?.(event)}>{children}</a>
  }
  if (onClick) {
    return <button {...(rest as unknown as ButtonHTMLAttributes<HTMLButtonElement>)} ref={ref as Ref<HTMLButtonElement>} type="button" className={`${mergedClassName} kvzd-design-clickable-button`.trim()} style={mergedStyle} onClick={(event) => onClick(event)}>{children}</button>
  }
  return <span {...(rest as unknown as HTMLAttributes<HTMLSpanElement>)} ref={ref as Ref<HTMLSpanElement>} className={mergedClassName} style={mergedStyle}>{children}</span>
})
