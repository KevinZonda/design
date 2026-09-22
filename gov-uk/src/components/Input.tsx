import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import type { SemanticStyling } from './styling'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, SemanticStyling<'root' | 'label' | 'hint' | 'error' | 'input'> {
  error?: ReactNode
  hint?: ReactNode
  label: ReactNode
  labelSize?: 's' | 'm' | 'l' | 'xl'
  status?: 'error'
  width?: 2 | 3 | 4 | 5 | 10 | 20 | 30
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className = '', classNames, error, hint, id, label, labelSize, status, style, styles, width, ...props }, ref) {
  const generatedId = useId()
  const inputId = id ?? `kvzd-input-${generatedId.replaceAll(':', '')}`
  const hasError = Boolean(error) || status === 'error'
  const describedBy = [hint && `${inputId}-hint`, error && `${inputId}-error`].filter(Boolean).join(' ')
  return (
    <div className={`govuk-form-group ${hasError ? 'govuk-form-group--error' : ''} ${classNames?.root ?? ''}`.trim()} style={styles?.root}>
      <label className={`govuk-label ${labelSize ? `govuk-label--${labelSize}` : ''} ${classNames?.label ?? ''}`.trim()} style={styles?.label} htmlFor={inputId}>{label}</label>
      {hint && <div className={`govuk-hint ${classNames?.hint ?? ''}`.trim()} style={styles?.hint} id={`${inputId}-hint`}>{hint}</div>}
      {error && <p className={`govuk-error-message ${classNames?.error ?? ''}`.trim()} style={styles?.error} id={`${inputId}-error`}><span className="govuk-visually-hidden">Error:</span> {error}</p>}
      <input {...props} ref={ref} id={inputId} aria-describedby={describedBy || undefined} aria-invalid={hasError || undefined} className={`govuk-input ${hasError ? 'govuk-input--error' : ''} ${width ? `govuk-input--width-${width}` : ''} ${classNames?.input ?? ''} ${className}`.trim()} style={{ ...styles?.input, ...style }} />
    </div>
  )
})
