import { forwardRef, useRef } from 'react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, MouseEvent, ReactElement, ReactNode, Ref, RefAttributes } from 'react'

interface CommonButtonProps {
  children: ReactNode
  className?: string
  danger?: boolean
  isStartButton?: boolean
  type?: 'primary' | 'secondary' | 'warning' | 'inverse'
}

type ButtonLinkProps = CommonButtonProps & { href: string; htmlType?: never; preventDoubleClick?: never } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className' | 'href' | 'type'>
type ButtonActionProps = CommonButtonProps & { href?: never; htmlType?: ButtonHTMLAttributes<HTMLButtonElement>['type']; preventDoubleClick?: boolean } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'type'>
export type ButtonProps = ButtonLinkProps | ButtonActionProps

function StartIcon() {
  return <svg className="govuk-button__start-icon" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" aria-hidden="true" focusable="false"><path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" /></svg>
}

export const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(function Button({ children, className = '', danger = false, href, htmlType = 'button', isStartButton = false, preventDoubleClick = false, type = 'primary', ...props }, ref) {
  const lastClickAt = useRef(0)
  const variant = danger ? 'warning' : type
  const variantClass = variant === 'primary' ? '' : `govuk-button--${variant}`
  const classes = `govuk-button ${variantClass} ${isStartButton ? 'govuk-button--start' : ''} ${className}`.trim()
  const content = <>{isStartButton ? <span>{children}</span> : children}{isStartButton && <StartIcon />}</>
  if (typeof href === 'string') {
    const { onKeyDown, ...linkProps } = props as AnchorHTMLAttributes<HTMLAnchorElement>
    return <a {...linkProps} ref={ref as Ref<HTMLAnchorElement>} className={classes} href={href} role="button" draggable={linkProps.draggable ?? false} onKeyDown={(event) => { onKeyDown?.(event); if (!event.defaultPrevented && event.key === ' ') { event.preventDefault(); event.currentTarget.click() } }}>{content}</a>
  }
  const { disabled, onClick, ...buttonProps } = props as ButtonHTMLAttributes<HTMLButtonElement>
  const handleClick = preventDoubleClick ? (event: MouseEvent<HTMLButtonElement>) => {
    const now = Date.now()
    if (now - lastClickAt.current < 1000) { event.preventDefault(); return }
    lastClickAt.current = now
    onClick?.(event)
  } : onClick
  return <button {...buttonProps} ref={ref as Ref<HTMLButtonElement>} type={htmlType} className={classes} disabled={disabled} aria-disabled={disabled ? true : buttonProps['aria-disabled']} onClick={handleClick}>{content}</button>
}) as {
  (props: ButtonLinkProps & RefAttributes<HTMLAnchorElement>): ReactElement | null
  (props: ButtonActionProps & RefAttributes<HTMLButtonElement>): ReactElement | null
}

export const ButtonGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ButtonGroup({ children, className = '', ...props }, ref) {
  return <div {...props} ref={ref} className={`govuk-button-group ${className}`.trim()}>{children}</div>
})
