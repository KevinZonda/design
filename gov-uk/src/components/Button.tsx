import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

interface CommonButtonProps {
  children: ReactNode
  className?: string
  danger?: boolean
  type?: 'primary' | 'secondary' | 'warning' | 'inverse'
}

export type ButtonProps = CommonButtonProps & (
  | ({ href: string; htmlType?: never } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className' | 'href' | 'type'>)
  | ({ href?: never; htmlType?: ButtonHTMLAttributes<HTMLButtonElement>['type'] } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'type'>)
)

export function Button({ children, className = '', danger = false, href, htmlType = 'button', type = 'primary', ...props }: ButtonProps) {
  const variant = danger ? 'warning' : type
  const variantClass = variant === 'primary' ? '' : `govuk-button--${variant}`
  const classes = `govuk-button ${variantClass} ${className}`.trim()
  if (typeof href === 'string') {
    return <a {...props as AnchorHTMLAttributes<HTMLAnchorElement>} className={classes} data-module="govuk-button" href={href} role="button">{children}</a>
  }
  return <button {...props as ButtonHTMLAttributes<HTMLButtonElement>} type={htmlType} className={classes} data-module="govuk-button">{children}</button>
}
