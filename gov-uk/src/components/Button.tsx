import { forwardRef } from 'react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactElement, ReactNode, Ref, RefAttributes } from 'react'

interface CommonButtonProps {
  children: ReactNode
  className?: string
  danger?: boolean
  type?: 'primary' | 'secondary' | 'warning' | 'inverse'
}

type ButtonLinkProps = CommonButtonProps & { href: string; htmlType?: never } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className' | 'href' | 'type'>
type ButtonActionProps = CommonButtonProps & { href?: never; htmlType?: ButtonHTMLAttributes<HTMLButtonElement>['type'] } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'type'>
export type ButtonProps = ButtonLinkProps | ButtonActionProps

export const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(function Button({ children, className = '', danger = false, href, htmlType = 'button', type = 'primary', ...props }, ref) {
  const variant = danger ? 'warning' : type
  const variantClass = variant === 'primary' ? '' : `govuk-button--${variant}`
  const classes = `govuk-button ${variantClass} ${className}`.trim()
  if (typeof href === 'string') {
    return <a {...props as AnchorHTMLAttributes<HTMLAnchorElement>} ref={ref as Ref<HTMLAnchorElement>} className={classes} data-module="govuk-button" href={href} role="button">{children}</a>
  }
  return <button {...props as ButtonHTMLAttributes<HTMLButtonElement>} ref={ref as Ref<HTMLButtonElement>} type={htmlType} className={classes} data-module="govuk-button">{children}</button>
}) as {
  (props: ButtonLinkProps & RefAttributes<HTMLAnchorElement>): ReactElement | null
  (props: ButtonActionProps & RefAttributes<HTMLButtonElement>): ReactElement | null
}
