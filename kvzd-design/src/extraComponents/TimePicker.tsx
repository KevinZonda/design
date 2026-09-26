import { forwardRef, useEffect, useId, useRef, useState } from 'react'
import type { ChangeEvent, InputHTMLAttributes, KeyboardEvent, ReactNode } from 'react'
import { ErrorMessage } from '../components/forms'
import type { InputProps } from '../components/Input'
import type { SemanticStyling } from '../components/styling'
import '../styles/timepicker.css'

export interface TimePickerProps extends Omit<InputProps, 'type' | 'prefix' | 'suffix' | 'allowClear' | 'showCount' | 'value' | 'defaultValue' | 'onChange' | 'styles' | 'classNames'>, SemanticStyling<'root' | 'label' | 'hint' | 'error' | 'status' | 'control' | 'input' | 'list' | 'option' | 'clear' | 'toggle'> {
  /** Controlled value in 'HH:mm' (24-hour) format. */
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Step between minute options in the panel. */
  minuteStep?: number
  /** Step between hour options in the panel. */
  hourStep?: number
  /** Show a clear button that empties the value. */
  allowClear?: boolean
  placeholder?: string
  /** Extra status line rendered after the error and included in aria-describedby. */
  status?: ReactNode
  /** Keep the accessible label while hiding it visually. */
  visuallyHiddenLabel?: boolean
  /** Extra props spread onto the native input. */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'id'>
}

const pad = (n: number) => String(n).padStart(2, '0')
const TIME_PATTERN = /^(\d{1,2}):(\d{1,2})$/

/** Normalise loose 'H:mm'-style input into 'HH:mm', or return null when invalid. */
const normalizeTime = (text: string): string | null => {
  const match = TIME_PATTERN.exec(text.trim())
  if (!match) return null
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (hour > 23 || minute > 59) return null
  return `${pad(hour)}:${pad(minute)}`
}

const stepValues = (limit: number, step: number) => {
  const interval = step > 0 ? Math.floor(step) : 1
  const values: number[] = []
  for (let i = 0; i < limit; i += interval) values.push(i)
  return values
}

const clockIcon = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" strokeLinecap="round" />
  </svg>
)

export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(function TimePicker({
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  allowClear = false,
  className = '',
  classNames,
  defaultValue,
  disabled,
  error,
  hint,
  hourStep = 1,
  id,
  inputProps,
  label,
  labelSize,
  minuteStep = 1,
  onBlur,
  onChange,
  onFocus,
  onKeyDown,
  placeholder = 'HH:mm',
  status,
  style,
  styles,
  value,
  visuallyHiddenLabel = false,
  width,
  ...props
}, ref) {
  const generatedId = useId().replaceAll(':', '')
  const inputId = id ?? `kvzd-design-time-${generatedId}`
  const hasError = Boolean(error)
  const describedBy = [ariaDescribedBy, hint && `${inputId}-hint`, error && `${inputId}-error`, status && `${inputId}-status`].filter(Boolean).join(' ')
  const [committed, setCommitted] = useState(() => normalizeTime(defaultValue ?? '') ?? '')
  const [draft, setDraft] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const suppressOpenRef = useRef(false)
  const shown = value ?? draft ?? committed
  const currentTime = normalizeTime(shown)

  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])

  const setRefs = (node: HTMLInputElement | null) => {
    inputRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as { current: HTMLInputElement | null }).current = node
  }

  const commit = (next: string) => {
    setCommitted(next)
    setDraft(null)
    onChange?.(next)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) setDraft(event.target.value)
    onChange?.(event.target.value)
  }
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(event)
    if (value !== undefined) return
    if (normalizeTime(shown) !== null) {
      setCommitted(normalizeTime(shown) as string)
      setDraft(null)
    } else {
      setDraft(null)
    }
  }
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    onFocus?.(event)
    if (suppressOpenRef.current) return
    if (!disabled) setOpen(true)
  }
  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.key === 'Escape') setOpen(false)
  }
  const handleControlKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') setOpen(false)
  }

  /** Close the panel and move focus back to the input without re-opening on focus. */
  const closeAndFocus = () => {
    suppressOpenRef.current = true
    setOpen(false)
    inputRef.current?.focus()
    setTimeout(() => { suppressOpenRef.current = false }, 0)
  }

  const select = (part: 'hour' | 'minute', num: number) => {
    const hour = part === 'hour' ? num : currentTime !== null ? Number(currentTime.slice(0, 2)) : 0
    const minute = part === 'minute' ? num : currentTime !== null ? Number(currentTime.slice(3, 5)) : 0
    commit(`${pad(hour)}:${pad(minute)}`)
    closeAndFocus()
  }

  const clear = () => {
    commit('')
    inputRef.current?.focus()
  }

  const moveOptionFocus = (direction: 1 | -1) => {
    const panel = panelRef.current
    if (!panel) return
    const options = Array.from(panel.querySelectorAll<HTMLButtonElement>('[role="option"]'))
    if (options.length === 0) return
    const index = options.indexOf(document.activeElement as HTMLButtonElement)
    const next = options[(index + direction + options.length) % options.length]
    next?.focus()
  }
  const handlePanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      closeAndFocus()
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      moveOptionFocus(event.key === 'ArrowDown' ? 1 : -1)
    }
  }

  const hours = stepValues(24, hourStep)
  const minutes = stepValues(60, minuteStep)
  const selectedHour = currentTime !== null ? Number(currentTime.slice(0, 2)) : null
  const selectedMinute = currentTime !== null ? Number(currentTime.slice(3, 5)) : null
  const showClear = allowClear && !disabled && shown !== ''

  const optionButton = (num: number, part: 'hour' | 'minute', selected: boolean) => (
    <button
      key={num}
      type="button"
      role="option"
      tabIndex={-1}
      aria-selected={selected}
      className={`kvzd-design-timepicker__option ${selected ? 'kvzd-design-timepicker__option--selected' : ''} ${classNames?.option ?? ''}`.trim()}
      style={styles?.option}
      onClick={() => select(part, num)}
    >
      {pad(num)}
    </button>
  )

  return (
    <div ref={rootRef} className={`govuk-form-group kvzd-design-timepicker ${hasError ? 'govuk-form-group--error' : ''} ${classNames?.root ?? ''}`.trim()} style={styles?.root}>
      <label className={`govuk-label ${visuallyHiddenLabel ? 'govuk-visually-hidden' : labelSize ? `govuk-label--${labelSize}` : ''} ${classNames?.label ?? ''}`.trim()} style={styles?.label} htmlFor={inputId}>{label}</label>
      {hint && <div className={`govuk-hint ${classNames?.hint ?? ''}`.trim()} style={styles?.hint} id={`${inputId}-hint`}>{hint}</div>}
      {error && <ErrorMessage id={`${inputId}-error`} className={classNames?.error} style={styles?.error}>{error}</ErrorMessage>}
      {status && <div className={`govuk-hint kvzd-design-timepicker__status ${classNames?.status ?? ''}`.trim()} style={styles?.status} id={`${inputId}-status`}>{status}</div>}
      <div className={`kvzd-design-timepicker__control ${classNames?.control ?? ''}`.trim()} style={styles?.control} onKeyDown={handleControlKeyDown}>
        <div className="kvzd-design-timepicker__field">
          <input
            {...inputProps}
            {...props}
            ref={setRefs}
            id={inputId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={shown}
            disabled={disabled}
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleInputKeyDown}
            aria-describedby={describedBy || undefined}
            aria-invalid={hasError ? true : ariaInvalid}
            aria-haspopup="listbox"
            aria-expanded={open}
            className={`govuk-input ${hasError ? 'govuk-input--error' : ''} ${width ? `govuk-input--width-${width}` : ''} kvzd-design-timepicker__input ${showClear ? 'kvzd-design-timepicker__input--with-clear' : ''} ${classNames?.input ?? ''} ${className}`.trim()}
            style={{ ...styles?.input, ...style }}
          />
          {showClear && <button type="button" className={`kvzd-design-timepicker__clear ${classNames?.clear ?? ''}`.trim()} style={styles?.clear} aria-label="Clear" onClick={clear}>×</button>}
        </div>
        <button
          type="button"
          className={`kvzd-design-timepicker__toggle ${classNames?.toggle ?? ''}`.trim()}
          style={styles?.toggle}
          disabled={disabled}
          aria-label="Choose time"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {clockIcon}
        </button>
      </div>
      {open && (
        <div ref={panelRef} className={`kvzd-design-timepicker__panel ${classNames?.list ?? ''}`.trim()} style={styles?.list} role="listbox" aria-labelledby={inputId} onKeyDown={handlePanelKeyDown}>
          <div className="kvzd-design-timepicker__column">{hours.map((h) => optionButton(h, 'hour', selectedHour === h))}</div>
          <div className="kvzd-design-timepicker__column">{minutes.map((m) => optionButton(m, 'minute', selectedMinute === m))}</div>
        </div>
      )}
    </div>
  )
})
