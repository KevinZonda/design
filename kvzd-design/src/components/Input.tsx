import { forwardRef, useId, useRef, useState } from 'react'
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react'
import { ErrorMessage } from './forms'
import type { SemanticStyling } from './styling'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>, SemanticStyling<'root' | 'label' | 'hint' | 'error' | 'input' | 'wrapper' | 'prefix' | 'suffix' | 'count'> {
  allowClear?: boolean
  error?: ReactNode
  hint?: ReactNode
  label: ReactNode
  labelSize?: 's' | 'm' | 'l' | 'xl'
  prefix?: ReactNode
  showCount?: boolean | { max?: number }
  suffix?: ReactNode
  width?: 2 | 3 | 4 | 5 | 10 | 20 | 30
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ 'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid, allowClear = false, className = '', classNames, defaultValue, disabled, error, hint, id, label, labelSize, onChange, prefix, readOnly, showCount = false, style, styles, suffix, value, width, ...props }, ref) {
  const generatedId = useId()
  const inputId = id ?? `kvzd-design-input-${generatedId.replaceAll(':', '')}`
  const hasError = Boolean(error)
  const describedBy = [ariaDescribedBy, hint && `${inputId}-hint`, error && `${inputId}-error`].filter(Boolean).join(' ')
  const [inner, setInner] = useState(String(defaultValue ?? ''))
  const currentValue = value ?? inner
  const showClear = allowClear && !disabled && !readOnly && currentValue !== '' && currentValue !== undefined
  const inputRef = useRef<HTMLInputElement>(null)
  const setRefs = (node: HTMLInputElement | null) => {
    inputRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as { current: HTMLInputElement | null }).current = node
  }
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => { if (value === undefined) setInner(event.target.value); onChange?.(event) }
  const clear = () => {
    const input = inputRef.current
    if (!input) return
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
    setter.call(input, '')
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.focus()
  }
  const inputElement = <input {...props} ref={setRefs} id={inputId} value={currentValue} disabled={disabled} readOnly={readOnly} onChange={handleChange} aria-describedby={describedBy || undefined} aria-invalid={hasError ? true : ariaInvalid} className={`govuk-input ${hasError ? 'govuk-input--error' : ''} ${width ? `govuk-input--width-${width}` : ''} ${(prefix || suffix || allowClear) ? 'kvzd-design-input__input' : ''} ${classNames?.input ?? ''} ${className}`.trim()} style={{ ...styles?.input, ...style }} />
  const countElement = showCount
    ? <div className={`kvzd-design-input__count ${classNames?.count ?? ''}`.trim()} style={styles?.count} aria-hidden="true">{String(currentValue ?? '').length}{typeof showCount === 'object' && showCount.max !== undefined ? ` / ${showCount.max}` : ''}</div>
    : null
  if (!prefix && !suffix && !allowClear) {
    return (
      <div className={`govuk-form-group ${hasError ? 'govuk-form-group--error' : ''} ${classNames?.root ?? ''}`.trim()} style={styles?.root}>
        <label className={`govuk-label ${labelSize ? `govuk-label--${labelSize}` : ''} ${classNames?.label ?? ''}`.trim()} style={styles?.label} htmlFor={inputId}>{label}</label>
        {hint && <div className={`govuk-hint ${classNames?.hint ?? ''}`.trim()} style={styles?.hint} id={`${inputId}-hint`}>{hint}</div>}
        {error && <ErrorMessage id={`${inputId}-error`} className={classNames?.error} style={styles?.error}>{error}</ErrorMessage>}
        {inputElement}
        {countElement}
      </div>
    )
  }
  return (
    <div className={`govuk-form-group ${hasError ? 'govuk-form-group--error' : ''} ${classNames?.root ?? ''}`.trim()} style={styles?.root}>
      <label className={`govuk-label ${labelSize ? `govuk-label--${labelSize}` : ''} ${classNames?.label ?? ''}`.trim()} style={styles?.label} htmlFor={inputId}>{label}</label>
      {hint && <div className={`govuk-hint ${classNames?.hint ?? ''}`.trim()} style={styles?.hint} id={`${inputId}-hint`}>{hint}</div>}
      {error && <ErrorMessage id={`${inputId}-error`} className={classNames?.error} style={styles?.error}>{error}</ErrorMessage>}
      <div className={`kvzd-design-input__wrapper ${classNames?.wrapper ?? ''}`.trim()} style={styles?.wrapper}>
        {prefix && <span className={`kvzd-design-input__prefix ${classNames?.prefix ?? ''}`.trim()} style={styles?.prefix} aria-hidden="true">{prefix}</span>}
        {inputElement}
        {(suffix || showClear) && <span className={`kvzd-design-input__suffix ${classNames?.suffix ?? ''}`.trim()} style={styles?.suffix}>{suffix}{showClear && <button type="button" className="kvzd-design-input__clear" aria-label="Clear" onClick={clear}>×</button>}</span>}
      </div>
      {countElement}
    </div>
  )
})
