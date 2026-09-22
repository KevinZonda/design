import { forwardRef, useId } from 'react'
import type { ReactNode } from 'react'
import type { InputProps } from './Input'
import type { SemanticStyling } from './styling'

export interface SearchInputProps extends Omit<InputProps, 'type' | 'width' | 'styles' | 'classNames'>, SemanticStyling<'root' | 'label' | 'hint' | 'error' | 'control' | 'input' | 'icon'> {
  /** Decorative icon shown inside the field. Pass null to hide it. */
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  /** Keep the accessible label while hiding it visually. */
  visuallyHiddenLabel?: boolean
}

const defaultSearchIcon = (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </svg>
)

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput({
  'aria-describedby': ariaDescribedBy,
  className = '',
  classNames,
  error,
  hint,
  icon = defaultSearchIcon,
  iconPosition = 'left',
  id,
  label,
  labelSize,
  status,
  style,
  styles,
  visuallyHiddenLabel = false,
  ...props
}, ref) {
  const generatedId = useId()
  const inputId = id ?? `kvzd-search-${generatedId.replaceAll(':', '')}`
  const hasError = Boolean(error) || status === 'error'
  const describedBy = [ariaDescribedBy, hint && `${inputId}-hint`, error && `${inputId}-error`].filter(Boolean).join(' ')

  return (
    <div className={`govuk-form-group ${hasError ? 'govuk-form-group--error' : ''} ${classNames?.root ?? ''}`.trim()} style={styles?.root}>
      <label className={`govuk-label ${visuallyHiddenLabel ? 'govuk-visually-hidden' : labelSize ? `govuk-label--${labelSize}` : ''} ${classNames?.label ?? ''}`.trim()} style={styles?.label} htmlFor={inputId}>{label}</label>
      {hint && <div className={`govuk-hint ${classNames?.hint ?? ''}`.trim()} style={styles?.hint} id={`${inputId}-hint`}>{hint}</div>}
      {error && <p className={`govuk-error-message ${classNames?.error ?? ''}`.trim()} style={styles?.error} id={`${inputId}-error`}><span className="govuk-visually-hidden">Error:</span> {error}</p>}
      <div className={`kvzd-search-input__control kvzd-search-input__control--${iconPosition} ${classNames?.control ?? ''}`.trim()} style={styles?.control}>
        <input
          {...props}
          ref={ref}
          id={inputId}
          type="search"
          aria-describedby={describedBy || undefined}
          aria-invalid={hasError || undefined}
          className={`govuk-input ${hasError ? 'govuk-input--error' : ''} ${icon ? 'kvzd-search-input__input' : ''} ${classNames?.input ?? ''} ${className}`.trim()}
          style={{ ...styles?.input, ...style }}
        />
        {icon && <span className={`kvzd-search-input__icon ${classNames?.icon ?? ''}`.trim()} style={styles?.icon} aria-hidden="true">{icon}</span>}
      </div>
    </div>
  )
})
