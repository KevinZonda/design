import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import type { SemanticStyling } from '../components/index'

export interface SwitchProps extends SemanticStyling<'root' | 'handle'> {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  name?: string
  disabled?: boolean
  loading?: boolean
  size?: 's' | 'm' | 'l'
  children?: ReactNode
  'aria-label'?: string
  className?: string
  style?: ButtonHTMLAttributes<HTMLButtonElement>['style']
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch({ checked, defaultChecked = false, onChange, name, disabled = false, loading = false, size = 'm', children, className = '', classNames, style, styles, ...props }, ref) {
  const [inner, setInner] = useState(defaultChecked)
  const isChecked = checked ?? inner
  const blocked = disabled || loading

  const toggle = () => {
    if (blocked) return
    const next = !isChecked
    if (checked === undefined) setInner(next)
    onChange?.(next)
  }

  return <button
    {...props}
    ref={ref}
    type="button"
    role="switch"
    aria-checked={isChecked}
    aria-label={typeof children === 'string' ? undefined : props['aria-label']}
    disabled={disabled}
    className={`kvzd-design-switch kvzd-design-switch--${size} ${isChecked ? 'kvzd-design-switch--checked' : ''} ${blocked ? 'kvzd-design-switch--blocked' : ''} ${classNames?.root ?? ''} ${className}`.trim()}
    style={{ ...styles?.root, ...style }}
    onClick={toggle}
  >
    {name !== undefined && <input type="hidden" name={name} value={isChecked ? 'true' : 'false'} />}
    <span className={`kvzd-design-switch__handle ${classNames?.handle ?? ''}`.trim()} style={styles?.handle}>
      {loading && <svg className="kvzd-design-switch__spinner kvzd-design-spinner" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="32 12" />
      </svg>}
    </span>
    {typeof children === 'string' ? <span className="govuk-visually-hidden">{children}</span> : children}
  </button>
})
