import { forwardRef, useRef } from 'react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, MouseEvent, ReactElement, ReactNode, Ref, RefAttributes } from 'react'

interface CommonButtonProps {
  children: ReactNode
  className?: string
  danger?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  isStartButton?: boolean
  loading?: boolean
  type?: 'primary' | 'secondary' | 'warning' | 'inverse'
}

type ButtonLinkProps = CommonButtonProps & { disabled?: boolean; href: string; htmlType?: never; preventDoubleClick?: never } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className' | 'href' | 'type'>
type ButtonActionProps = CommonButtonProps & { href?: never; htmlType?: ButtonHTMLAttributes<HTMLButtonElement>['type']; preventDoubleClick?: boolean } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'type'>
export type ButtonProps = ButtonLinkProps | ButtonActionProps

function StartIcon() {
  return <svg className="govuk-button__start-icon" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" aria-hidden="true" focusable="false"><path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" /></svg>
}

function LoadingIcon() {
  return <svg className="kvzd-design-button__spinner kvzd-design-spinner" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" /><path d="M8 2a6 6 0 016 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
}

export const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(function Button({ children, className = '', danger = false, href, htmlType = 'button', icon, iconPosition = 'left', isStartButton = false, loading = false, preventDoubleClick = false, type = 'primary', ...props }, ref) {
  const lastClickAt = useRef(0)
  const variant = danger ? 'warning' : type
  const variantClass = variant === 'primary' ? '' : `govuk-button--${variant}`
  const iconNode = loading ? <LoadingIcon /> : icon
  const leading = iconPosition === 'left' ? iconNode : undefined
  const trailing = iconPosition === 'right' ? iconNode : undefined
  const content = <>{leading}{isStartButton ? <span>{children}</span> : children}{trailing}{isStartButton && <StartIcon />}</>
  const busy = loading ? { 'aria-busy': true } : {}
  if (typeof href === 'string') {
    const { disabled: linkDisabled = false, onClick, onKeyDown, ...linkProps } = props as AnchorHTMLAttributes<HTMLAnchorElement> & { disabled?: boolean }
    const inert = linkDisabled || loading
    const linkClasses = `${classesFor(variantClass, isStartButton, className, inert)}`.trim()
    return <a {...linkProps} {...busy} ref={ref as Ref<HTMLAnchorElement>} className={linkClasses} href={href} role="button" draggable={linkProps.draggable ?? false} aria-disabled={inert ? true : linkProps['aria-disabled']} onClick={(event) => { if (inert) { event.preventDefault(); return } onClick?.(event) }} onKeyDown={(event) => { onKeyDown?.(event); if (!event.defaultPrevented && event.key === ' ') { event.preventDefault(); event.currentTarget.click() } }}>{content}</a>
  }
  const { disabled = false, onClick, ...buttonProps } = props as ButtonHTMLAttributes<HTMLButtonElement>
  const inert = disabled || loading
  const handleClick = preventDoubleClick ? (event: MouseEvent<HTMLButtonElement>) => {
    const now = Date.now()
    if (now - lastClickAt.current < 1000) { event.preventDefault(); return }
    lastClickAt.current = now
    onClick?.(event)
  } : onClick
  return <button {...buttonProps} {...busy} ref={ref as Ref<HTMLButtonElement>} type={htmlType} className={classesFor(variantClass, isStartButton, className, false)} disabled={inert} aria-disabled={inert ? true : buttonProps['aria-disabled']} onClick={loading ? (event: MouseEvent<HTMLButtonElement>) => { event.preventDefault() } : handleClick}>{content}</button>
}) as {
  (props: ButtonLinkProps & RefAttributes<HTMLAnchorElement>): ReactElement | null
  (props: ButtonActionProps & RefAttributes<HTMLButtonElement>): ReactElement | null
}

function classesFor(variantClass: string, isStartButton: boolean, className: string, disabled: boolean) {
  return `govuk-button ${variantClass} ${isStartButton ? 'govuk-button--start' : ''} ${disabled ? 'govuk-button--disabled' : ''} ${className}`.trim()
}

export const ButtonGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ButtonGroup({ children, className = '', ...props }, ref) {
  return <div {...props} ref={ref} className={`govuk-button-group ${className}`.trim()}>{children}</div>
})
