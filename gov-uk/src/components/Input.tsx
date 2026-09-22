import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: ReactNode
  hint?: ReactNode
  label: ReactNode
  labelSize?: 's' | 'm' | 'l' | 'xl'
  status?: 'error'
  width?: 2 | 3 | 4 | 5 | 10 | 20 | 30
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className = '', error, hint, id, label, labelSize, status, width, ...props }, ref) {
  const generatedId = useId()
  const inputId = id ?? `kvzd-input-${generatedId.replaceAll(':', '')}`
  const hasError = Boolean(error) || status === 'error'
  const describedBy = [hint && `${inputId}-hint`, error && `${inputId}-error`].filter(Boolean).join(' ')
  return (
    <div className={`govuk-form-group ${hasError ? 'govuk-form-group--error' : ''}`}>
      <label className={`govuk-label ${labelSize ? `govuk-label--${labelSize}` : ''}`.trim()} htmlFor={inputId}>{label}</label>
      {hint && <div className="govuk-hint" id={`${inputId}-hint`}>{hint}</div>}
      {error && <p className="govuk-error-message" id={`${inputId}-error`}><span className="govuk-visually-hidden">Error:</span> {error}</p>}
      <input {...props} ref={ref} id={inputId} aria-describedby={describedBy || undefined} aria-invalid={hasError || undefined} className={`govuk-input ${hasError ? 'govuk-input--error' : ''} ${width ? `govuk-input--width-${width}` : ''} ${className}`.trim()} />
    </div>
  )
})
