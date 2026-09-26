import { forwardRef, useId, useState } from 'react'
import type { ChangeEvent, KeyboardEvent, ReactNode } from 'react'
import type { InputProps } from './Input'
import type { SemanticStyling } from './styling'

export interface SearchInputProps extends Omit<InputProps, 'type' | 'prefix' | 'suffix' | 'allowClear' | 'styles' | 'classNames'>, SemanticStyling<'root' | 'label' | 'hint' | 'error' | 'control' | 'input' | 'icon' | 'button'> {
  /** Decorative icon shown inside the field. Pass null to hide it. Replaced by the loading spinner while loading. */
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  /** Keep the accessible label while hiding it visually. */
  visuallyHiddenLabel?: boolean
  /** Called with the current value when Enter is pressed or the enter button is clicked. */
  onSearch?: (value: string) => void
  /** Show a spinner instead of the icon. */
  loading?: boolean
  /** Render a submit-style button after the field. Pass true for the default "Search" label. */
  enterButton?: ReactNode
  /** Native type of the enter button. Defaults to 'button'. */
  enterButtonHtmlType?: 'button' | 'submit' | 'reset'
}

const defaultSearchIcon = (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </svg>
)

const spinner = (
  <svg className="kvzd-design-spinner" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.25" />
    <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput({
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  className = '',
  classNames,
  defaultValue,
  error,
  enterButton,
  enterButtonHtmlType = 'button',
  hint,
  icon = defaultSearchIcon,
  iconPosition = 'left',
  id,
  label,
  labelSize,
  loading = false,
  onChange,
  onKeyDown,
  onSearch,
  style,
  styles,
  value,
  visuallyHiddenLabel = false,
  width,
  ...props
}, ref) {
  const generatedId = useId()
  const inputId = id ?? `kvzd-design-search-${generatedId.replaceAll(':', '')}`
  const hasError = Boolean(error)
  const describedBy = [ariaDescribedBy, hint && `${inputId}-hint`, error && `${inputId}-error`].filter(Boolean).join(' ')
  const [inner, setInner] = useState(String(defaultValue ?? ''))
  const currentValue = String(value ?? inner)
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => { if (value === undefined) setInner(event.target.value); onChange?.(event) }
  const search = () => onSearch?.(currentValue)
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => { onKeyDown?.(event); if (event.key === 'Enter') onSearch?.(currentValue) }
  const shownIcon = loading ? spinner : icon

  const field = (
    <div className={`kvzd-design-search-input__control kvzd-design-search-input__control--${iconPosition} ${classNames?.control ?? ''}`.trim()} style={styles?.control}>
      <input
        {...props}
        ref={ref}
        id={inputId}
        type="search"
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-describedby={describedBy || undefined}
        aria-invalid={hasError ? true : ariaInvalid}
        className={`govuk-input ${hasError ? 'govuk-input--error' : ''} ${width ? `govuk-input--width-${width}` : ''} ${shownIcon ? 'kvzd-design-search-input__input' : ''} ${classNames?.input ?? ''} ${className}`.trim()}
        style={{ ...styles?.input, ...style }}
      />
      {shownIcon && <span className={`kvzd-design-search-input__icon ${classNames?.icon ?? ''}`.trim()} style={styles?.icon} aria-hidden="true">{shownIcon}</span>}
    </div>
  )

  return (
    <div className={`govuk-form-group ${hasError ? 'govuk-form-group--error' : ''} ${classNames?.root ?? ''}`.trim()} style={styles?.root}>
      <label className={`govuk-label ${visuallyHiddenLabel ? 'govuk-visually-hidden' : labelSize ? `govuk-label--${labelSize}` : ''} ${classNames?.label ?? ''}`.trim()} style={styles?.label} htmlFor={inputId}>{label}</label>
      {hint && <div className={`govuk-hint ${classNames?.hint ?? ''}`.trim()} style={styles?.hint} id={`${inputId}-hint`}>{hint}</div>}
      {error && <p className={`govuk-error-message ${classNames?.error ?? ''}`.trim()} style={styles?.error} id={`${inputId}-error`}><span className="govuk-visually-hidden">Error:</span> {error}</p>}
      {enterButton === undefined ? field : (
        <div className="kvzd-design-search-input__combo">
          {field}
          <button type={enterButtonHtmlType} className={`govuk-button kvzd-design-search-input__button ${classNames?.button ?? ''}`.trim()} style={styles?.button} onClick={search}>{enterButton === true ? 'Search' : enterButton}</button>
        </div>
      )}
    </div>
  )
})
