import { forwardRef, useState, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import type { SemanticStyling } from '../components/index'

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onChange' | 'size'>, SemanticStyling<'root' | 'handle'> {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  name?: string
  disabled?: boolean
  loading?: boolean
  size?: 's' | 'm' | 'l'
  checkedChildren?: ReactNode
  unCheckedChildren?: ReactNode
  children?: ReactNode
  /** Accessible name of the switch; takes precedence over string children. */
  label?: string
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch({ checked, defaultChecked = false, onChange, name, disabled = false, loading = false, size = 'm', checkedChildren, unCheckedChildren, children, label, className = '', classNames, style, styles, onClick, 'aria-label': ariaLabel, ...props }, ref) {
  const [inner, setInner] = useState(defaultChecked)
  const isChecked = checked ?? inner
  const blocked = disabled || loading
  const accessibleName = label ?? (typeof children === 'string' ? undefined : ariaLabel)
  if (import.meta.env?.DEV && accessibleName === undefined && typeof children !== 'string') {
    console.warn('[kvzd-design] Switch needs an accessible name: pass the `label` prop, an aria-label, or string children')
  }

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || blocked) return
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
    aria-label={accessibleName}
    disabled={disabled}
    className={`kvzd-design-switch kvzd-design-switch--${size} ${isChecked ? 'kvzd-design-switch--checked' : ''} ${blocked ? 'kvzd-design-switch--blocked' : ''} ${classNames?.root ?? ''} ${className}`.trim()}
    style={{ ...styles?.root, ...style }}
    onClick={toggle}
  >
    {name !== undefined && <input type="hidden" name={name} value={isChecked ? 'true' : 'false'} />}
    <span className="kvzd-design-switch__inner" aria-hidden="true">
      {checkedChildren !== undefined && <span className="kvzd-design-switch__text kvzd-design-switch__text--checked">{checkedChildren}</span>}
      {unCheckedChildren !== undefined && <span className="kvzd-design-switch__text kvzd-design-switch__text--unchecked">{unCheckedChildren}</span>}
    </span>
    <span className={`kvzd-design-switch__handle ${classNames?.handle ?? ''}`.trim()} style={styles?.handle}>
      {loading && <svg className="kvzd-design-switch__spinner kvzd-design-spinner" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="32 12" />
      </svg>}
    </span>
    {typeof children === 'string' ? <span className="govuk-visually-hidden">{children}</span> : children}
  </button>
})
