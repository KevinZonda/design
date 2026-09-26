import { forwardRef, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ChangeEvent, FieldsetHTMLAttributes, InputHTMLAttributes, MouseEvent, ReactNode, Ref, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import type { SemanticStyling } from './styling'
import { dateOrder } from './dateOrder'
import type { DateInputOrder } from './dateOrder'

export const Hint = forwardRef<HTMLDivElement, { id?: string; children: ReactNode; className?: string; style?: CSSProperties }>(function Hint({ id, children, className = '', style }, ref) { return <div ref={ref} id={id} className={`govuk-hint ${className}`.trim()} style={style}>{children}</div> })
export const Label = forwardRef<HTMLLabelElement, { htmlFor?: string; children: ReactNode; size?: 's' | 'm' | 'l' | 'xl'; className?: string; style?: CSSProperties }>(function Label({ htmlFor, children, size, className = '', style }, ref) { return <label ref={ref} className={`govuk-label ${size ? `govuk-label--${size}` : ''} ${className}`.trim()} htmlFor={htmlFor} style={style}>{children}</label> })
export const ErrorMessage = forwardRef<HTMLParagraphElement, { id?: string; children: ReactNode; visuallyHiddenText?: string; className?: string; style?: CSSProperties }>(function ErrorMessage({ id, children, visuallyHiddenText = 'Error:', className = '', style }, ref) { return <p ref={ref} id={id} className={`govuk-error-message ${className}`.trim()} style={style}><span className="govuk-visually-hidden">{visuallyHiddenText}</span> {children}</p> })

export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> { legend: ReactNode; legendSize?: 's' | 'm' | 'l' | 'xl'; isPageHeading?: boolean; hint?: ReactNode; error?: ReactNode }
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset({ children, className = '', error, hint, isPageHeading = false, legend, legendSize, ...props }, ref) {
  return <fieldset {...props} ref={ref} className={`govuk-fieldset ${className}`.trim()}><legend className={`govuk-fieldset__legend ${legendSize ? `govuk-fieldset__legend--${legendSize}` : ''}`.trim()}>{isPageHeading ? <h1 className="govuk-fieldset__heading">{legend}</h1> : legend}</legend>{hint && <Hint>{hint}</Hint>}{error && <ErrorMessage>{error}</ErrorMessage>}{children}</fieldset>
})

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, SemanticStyling<'root' | 'label' | 'hint' | 'error' | 'textarea'> { label: ReactNode; labelSize?: 's' | 'm' | 'l' | 'xl'; hint?: ReactNode; error?: ReactNode; rows?: number; autoSize?: boolean | { minRows?: number; maxRows?: number } }
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ 'aria-describedby': ariaDescribedBy, 'aria-invalid': ariaInvalid, autoSize, className = '', classNames, error, hint, id, label, labelSize, onChange, rows = 5, style, styles, ...props }, ref) {
  const uid = useId(); const fieldId = id ?? `kvzd-design-textarea-${uid.replaceAll(':', '')}`; const described = [ariaDescribedBy, hint && `${fieldId}-hint`, error && `${fieldId}-error`].filter(Boolean).join(' ')
  const areaRef = useRef<HTMLTextAreaElement>(null)
  const setRefs = (node: HTMLTextAreaElement | null) => { areaRef.current = node; if (typeof ref === 'function') ref(node); else if (ref) (ref as { current: HTMLTextAreaElement | null }).current = node }
  useEffect(() => {
    const el = areaRef.current
    if (!el || !autoSize) return
    el.style.height = '0px'
    const computed = getComputedStyle(el)
    const lineHeight = Number.parseFloat(computed.lineHeight) || Number.parseFloat(computed.fontSize) * 1.25 || 20
    const minRows = (typeof autoSize === 'object' ? autoSize.minRows : undefined) ?? rows
    const maxRows = typeof autoSize === 'object' ? autoSize.maxRows : undefined
    let height = Math.max(el.scrollHeight, minRows * lineHeight)
    if (maxRows !== undefined) { height = Math.min(height, maxRows * lineHeight); el.style.overflowY = el.scrollHeight > maxRows * lineHeight ? 'auto' : 'hidden' }
    el.style.height = `${height}px`
  })
  return <div className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''} ${classNames?.root ?? ''}`.trim()} style={styles?.root}><Label htmlFor={fieldId} size={labelSize ?? 'm'} className={classNames?.label} style={styles?.label}>{label}</Label>{hint && <Hint id={`${fieldId}-hint`} className={classNames?.hint} style={styles?.hint}>{hint}</Hint>}{error && <ErrorMessage id={`${fieldId}-error`} className={classNames?.error} style={styles?.error}>{error}</ErrorMessage>}<textarea {...props} ref={setRefs} id={fieldId} rows={typeof autoSize === 'object' ? autoSize.minRows ?? rows : rows} aria-describedby={described || undefined} aria-invalid={error ? true : ariaInvalid} onChange={(event) => { onChange?.(event) }} className={`govuk-textarea ${error ? 'govuk-textarea--error' : ''} ${autoSize ? 'kvzd-design-textarea--autosize' : ''} ${classNames?.textarea ?? ''} ${className}`.trim()} style={{ ...styles?.textarea, ...style }} /></div>
})

export interface Option { label: ReactNode; value: string; disabled?: boolean }
interface SelectBaseProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'multiple' | 'value' | 'defaultValue' | 'onChange'>, SemanticStyling<'root' | 'label' | 'hint' | 'error' | 'select'> { label: ReactNode; labelSize?: 's' | 'm' | 'l' | 'xl'; hint?: ReactNode; error?: ReactNode; options: Option[]; placeholder?: string }
export interface SingleSelectProps extends SelectBaseProps { multiple?: false; value?: string; defaultValue?: string; onChange?: (value: string, event: ChangeEvent<HTMLSelectElement> | MouseEvent<HTMLButtonElement>) => void; showSearch?: boolean; loading?: boolean }
export interface MultipleSelectProps extends SelectBaseProps { multiple: true; value?: string[]; defaultValue?: string[]; onChange?: (value: string[]) => void; showSearch?: boolean; loading?: boolean; hiddenInput?: boolean }
export type SelectProps = SingleSelectProps | MultipleSelectProps

const selectSpinner = (
  <svg className="kvzd-design-spinner" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.25" />
    <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

const SelectSingle = forwardRef<HTMLSelectElement | HTMLButtonElement, SingleSelectProps>(function SelectSingle({ className = '', classNames, defaultValue, error, hint, id, label, labelSize, loading = false, onChange, options, placeholder, showSearch = false, style, styles, value, ...props }, ref) {
  const uid = useId(); const fieldId = id ?? `kvzd-design-select-${uid.replaceAll(':', '')}`; const described = [hint && `${fieldId}-hint`, error && `${fieldId}-error`].filter(Boolean).join(' ')
  const setRefs = (node: HTMLSelectElement | HTMLButtonElement | null) => { if (typeof ref === 'function') ref(node); else if (ref) (ref as { current: HTMLSelectElement | HTMLButtonElement | null }).current = node }
  if (showSearch) return <SelectSingleSearchable {...props} className={className} classNames={classNames} defaultValue={defaultValue} error={error} fieldId={fieldId} hint={hint} id={id} label={label} labelSize={labelSize} loading={loading} onChange={onChange} options={options} placeholder={placeholder} described={described} style={style} styles={styles} value={value} ref={setRefs} />
  return <div className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''} ${classNames?.root ?? ''}`.trim()} style={styles?.root}><Label htmlFor={fieldId} size={labelSize ?? 'm'} className={classNames?.label} style={styles?.label}>{label}</Label>{hint && <Hint id={`${fieldId}-hint`} className={classNames?.hint} style={styles?.hint}>{hint}</Hint>}{error && <ErrorMessage id={`${fieldId}-error`} className={classNames?.error} style={styles?.error}>{error}</ErrorMessage>}<select {...props} ref={setRefs} id={fieldId} defaultValue={defaultValue} value={value} disabled={loading || props.disabled} onChange={onChange ? (event) => onChange(event.target.value, event) : undefined} aria-describedby={described || undefined} aria-invalid={error ? true : undefined} className={`govuk-select ${error ? 'govuk-select--error' : ''} ${classNames?.select ?? ''} ${className}`.trim()} style={{ ...styles?.select, ...style }}>{placeholder && <option value="">{placeholder}</option>}{options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}</select>{loading && <span className="kvzd-design-select__spinner">{selectSpinner}</span>}</div>
})

interface SelectSingleSearchableProps extends Omit<SingleSelectProps, 'showSearch' | 'id'> { fieldId: string; described: string; id?: string }

const SelectSingleSearchable = forwardRef<HTMLButtonElement, SelectSingleSearchableProps>(function SelectSingleSearchable({ className = '', classNames, defaultValue = '', described, disabled, error, fieldId, hint, label, labelSize, loading = false, name, onChange, options, placeholder = '', style, styles, value }, ref) {
  const [inner, setInner] = useState(defaultValue); const selected = value ?? inner
  const [open, setOpen] = useState(false); const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null); const triggerRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])
  const choose = (optionValue: string, event: MouseEvent<HTMLButtonElement>) => { if (value === undefined) setInner(optionValue); onChange?.(optionValue, event); setOpen(false); triggerRef.current?.focus() }
  const filtered = query.trim() ? options.filter((option) => String(option.label).toLowerCase().includes(query.trim().toLowerCase())) : options
  const selectedOption = options.find((option) => option.value === selected)
  const labelText = selectedOption ? String(selectedOption.label) : placeholder
  return <div ref={rootRef} className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''} kvzd-design-select ${classNames?.root ?? ''}`.trim()} style={{ ...styles?.root, ...style }}>{name !== undefined && <input type="hidden" name={name} value={selected} />}<Label htmlFor={fieldId} size={labelSize ?? 'm'} className={classNames?.label} style={styles?.label}>{label}</Label>{hint && <Hint id={`${fieldId}-hint`} className={classNames?.hint} style={styles?.hint}>{hint}</Hint>}{error && <ErrorMessage id={`${fieldId}-error`} className={classNames?.error} style={styles?.error}>{error}</ErrorMessage>}
    <button ref={(node) => { triggerRef.current = node; if (typeof ref === 'function') ref(node); else if (ref) (ref as { current: HTMLButtonElement | null }).current = node }} type="button" id={fieldId} disabled={disabled} aria-describedby={described || undefined} aria-haspopup="listbox" aria-expanded={open} aria-disabled={disabled || undefined} className={`govuk-select kvzd-design-select__trigger ${error ? 'govuk-select--error' : ''} ${open ? 'kvzd-design-select__trigger--open' : ''} ${classNames?.select ?? ''} ${className}`.trim()} style={styles?.select} onClick={() => setOpen(!open)} onKeyDown={(event) => { if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus() } }}><span className="kvzd-design-select__value">{labelText}</span>{loading && <span className="kvzd-design-select__spinner">{selectSpinner}</span>}<span className="kvzd-design-select__chevron" aria-hidden="true" /></button>
    {open && <div className="kvzd-design-select__popup" role="listbox" aria-labelledby={fieldId} onKeyDown={(event) => { if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus() } }}>
      <input type="text" className="govuk-input govuk-input--width-20 kvzd-design-select__search" placeholder="Search" value={query} onChange={(event) => setQuery(event.target.value)} />
      {loading ? <div className="kvzd-design-select__loading">Loading…</div> : filtered.length === 0 ? <div className="kvzd-design-select__loading">No matches</div> : filtered.map((option) => <div key={option.value} className="kvzd-design-select__option"><button type="button" role="option" aria-selected={selected === option.value} disabled={option.disabled} className={`kvzd-design-select__choice ${selected === option.value ? 'kvzd-design-select__choice--selected' : ''}`} onClick={(event) => choose(option.value, event)}>{option.label}</button></div>)}
    </div>}
  </div>
})

const SelectMultiple = forwardRef<HTMLButtonElement, MultipleSelectProps>(function SelectMultiple({ className = '', classNames, defaultValue = [], disabled, error, hiddenInput = true, hint, id, label, labelSize, loading = false, name, onChange, options, placeholder = '', showSearch = false, style, styles, value }, ref) {
  const uid = useId(); const fieldId = id ?? `kvzd-design-select-${uid.replaceAll(':', '')}`; const described = [hint && `${fieldId}-hint`, error && `${fieldId}-error`].filter(Boolean).join(' ')
  const [inner, setInner] = useState<string[]>(defaultValue); const selected = value ?? inner
  const [open, setOpen] = useState(false); const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null); const triggerRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])
  const update = (optionValue: string, checked: boolean) => { const next = checked ? [...selected, optionValue] : selected.filter((item) => item !== optionValue); if (value === undefined) setInner(next); onChange?.(next) }
  const filtered = showSearch && query.trim() ? options.filter((option) => String(option.label).toLowerCase().includes(query.trim().toLowerCase())) : options
  const selectedLabels = options.filter((option) => selected.includes(option.value)).map((option) => String(option.label))
  const labelText = selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder
  return <div ref={rootRef} className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''} kvzd-design-select ${classNames?.root ?? ''}`.trim()} style={{ ...styles?.root, ...style }}>{hiddenInput && name !== undefined && selected.map((item) => <input key={item} type="hidden" name={name} value={item} />)}<Label htmlFor={fieldId} size={labelSize ?? 'm'} className={classNames?.label} style={styles?.label}>{label}</Label>{hint && <Hint id={`${fieldId}-hint`} className={classNames?.hint} style={styles?.hint}>{hint}</Hint>}{error && <ErrorMessage id={`${fieldId}-error`} className={classNames?.error} style={styles?.error}>{error}</ErrorMessage>}
    <button ref={(node) => { triggerRef.current = node; if (typeof ref === 'function') ref(node); else if (ref) (ref as { current: HTMLButtonElement | null }).current = node }} type="button" id={fieldId} disabled={disabled} aria-describedby={described || undefined} aria-haspopup="listbox" aria-expanded={open} aria-disabled={disabled || undefined} className={`govuk-select kvzd-design-select__trigger ${error ? 'govuk-select--error' : ''} ${open ? 'kvzd-design-select__trigger--open' : ''} ${classNames?.select ?? ''} ${className}`.trim()} style={styles?.select} onClick={() => setOpen(!open)} onKeyDown={(event) => { if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus() } }}><span className="kvzd-design-select__value">{labelText}</span>{loading && <span className="kvzd-design-select__spinner">{selectSpinner}</span>}<span className="kvzd-design-select__chevron" aria-hidden="true" /></button>
    {open && <div className="kvzd-design-select__popup" role="listbox" aria-multiselectable="true" aria-labelledby={fieldId} onKeyDown={(event) => { if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus() } }}>
      {showSearch && <input type="text" className="govuk-input govuk-input--width-20 kvzd-design-select__search" placeholder="Search" value={query} onChange={(event) => setQuery(event.target.value)} />}
      {loading ? <div className="kvzd-design-select__loading">Loading…</div> : filtered.map((option) => <div key={option.value} className="govuk-checkboxes__item kvzd-design-select__option"><input className="govuk-checkboxes__input" id={`${fieldId}-${option.value}`} type="checkbox" checked={selected.includes(option.value)} disabled={option.disabled} onChange={(event) => update(option.value, event.target.checked)} /><label className="govuk-label govuk-checkboxes__label" htmlFor={`${fieldId}-${option.value}`}>{option.label}</label></div>)}
    </div>}
  </div>
})

export const Select = forwardRef<HTMLSelectElement | HTMLButtonElement, SelectProps>(function Select(props, ref) {
  const setRefs = (node: HTMLSelectElement | HTMLButtonElement | null) => { if (typeof ref === 'function') ref(node); else if (ref) (ref as { current: HTMLSelectElement | HTMLButtonElement | null }).current = node }
  if (props.multiple) return <SelectMultiple {...props} ref={setRefs} />
  return <SelectSingle {...props} ref={setRefs} />
})

export interface ChoiceOption extends Option { hint?: ReactNode; conditional?: ReactNode; exclusive?: boolean }
export interface ChoiceGroupProps { name: string; legend: ReactNode; options: ChoiceOption[]; value?: string[]; defaultValue?: string[]; onChange?: (value: string[]) => void; hint?: ReactNode; error?: ReactNode; small?: boolean; className?: string; style?: CSSProperties; inputRefs?: Record<string, Ref<HTMLInputElement>>; inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'checked' | 'value' | 'defaultChecked' | 'defaultValue' | 'onChange' | 'name' | 'type' | 'id'>; exclusiveDividerText?: string }
export const Checkboxes = forwardRef<HTMLFieldSetElement, ChoiceGroupProps>(function Checkboxes({ defaultValue = [], error, exclusiveDividerText = 'or', hint, inputProps, inputRefs, legend, name, onChange, options, small = false, className = '', style, value }, ref) {
  const [inner, setInner] = useState(defaultValue); const selected = value ?? inner
  const exclusiveValues = useMemo(() => new Set(options.filter((option) => option.exclusive).map((option) => option.value)), [options])
  const update = (optionValue: string, checked: boolean) => { const next = checked ? (exclusiveValues.has(optionValue) ? [optionValue] : [...selected.filter((item) => !exclusiveValues.has(item)), optionValue]) : selected.filter((item) => item !== optionValue); if (value === undefined) setInner(next); onChange?.(next) }
  return <div className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''} ${className}`.trim()}><Fieldset ref={ref} style={style} legend={legend} hint={hint} error={error}><div className={`govuk-checkboxes ${small ? 'govuk-checkboxes--small' : ''}`}>{options.map((option) => <div key={option.value}>{option.exclusive && <div className="govuk-checkboxes__divider">{exclusiveDividerText}</div>}<div className="govuk-checkboxes__item"><input {...inputProps} ref={inputRefs?.[option.value]} className="govuk-checkboxes__input" id={`${name}-${option.value}`} name={name} type="checkbox" value={option.value} checked={selected.includes(option.value)} disabled={option.disabled || inputProps?.disabled} onChange={(event) => update(option.value, event.target.checked)} /><label className="govuk-label govuk-checkboxes__label" htmlFor={`${name}-${option.value}`}>{option.label}</label>{option.hint && <div className="govuk-hint govuk-checkboxes__hint">{option.hint}</div>}</div>{option.conditional && selected.includes(option.value) && <div className="govuk-checkboxes__conditional">{option.conditional}</div>}</div>)}</div></Fieldset></div>
})

export interface RadioGroupProps extends Omit<ChoiceGroupProps, 'value' | 'defaultValue' | 'onChange'> { value?: string; defaultValue?: string; onChange?: (value: string) => void; inline?: boolean }
export const Radios = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function Radios({ defaultValue, error, hint, inline = false, inputProps, inputRefs, legend, name, onChange, options, small = false, style, value }, ref) {
  const [inner, setInner] = useState(defaultValue); const selected = value ?? inner
  const update = (next: string) => { if (value === undefined) setInner(next); onChange?.(next) }
  return <div className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''}`}><Fieldset ref={ref} style={style} legend={legend} hint={hint} error={error}><div className={`govuk-radios ${inline ? 'govuk-radios--inline' : ''} ${small ? 'govuk-radios--small' : ''}`}>{options.map((option) => <div key={option.value}><div className="govuk-radios__item"><input {...inputProps} ref={inputRefs?.[option.value]} className="govuk-radios__input" id={`${name}-${option.value}`} name={name} type="radio" value={option.value} checked={selected === option.value} disabled={option.disabled || inputProps?.disabled} onChange={() => update(option.value)} /><label className="govuk-label govuk-radios__label" htmlFor={`${name}-${option.value}`}>{option.label}</label>{option.hint && <div className="govuk-hint govuk-radios__hint">{option.hint}</div>}</div>{option.conditional && selected === option.value && <div className="govuk-radios__conditional">{option.conditional}</div>}</div>)}</div></Fieldset></div>
})

export interface DateValue { day?: string; month?: string; year?: string }
export interface DateInputProps { value?: DateValue; defaultValue?: DateValue; onChange?: (value: DateValue) => void; order?: DateInputOrder; legend?: ReactNode; hint?: ReactNode; error?: ReactNode; namePrefix?: string; className?: string; style?: CSSProperties; autoComplete?: boolean | string; inputRefs?: Partial<Record<keyof DateValue, Ref<HTMLInputElement>>>; inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'name' | 'id'> }
const dateFields = { day: ['Day', 2], month: ['Month', 2], year: ['Year', 4] } as const
const dmy = ['day', 'month', 'year'] as const
const mdy = ['month', 'day', 'year'] as const
const ymd = ['year', 'month', 'day'] as const
const dateFieldOrder: Record<DateInputOrder, readonly (keyof DateValue)[]> = { DMY: dmy, MDY: mdy, YMD: ymd, GBR: dmy, USA: mdy, CHN: ymd }
export const DateInput = forwardRef<HTMLFieldSetElement, DateInputProps>(function DateInput({ value, defaultValue = {}, onChange, order = dateOrder.DMY, legend = 'Date', hint, error, namePrefix = 'date', autoComplete = true, className = '', inputProps, inputRefs, style }, ref) {
  const [inner, setInner] = useState(defaultValue); const current = value ?? inner
  const uid = useId(); const fieldId = `kvzd-design-date-${uid.replaceAll(':', '')}`
  const change = (key: keyof DateValue) => (event: ChangeEvent<HTMLInputElement>) => { const next = { ...current, [key]: event.target.value }; if (value === undefined) setInner(next); onChange?.(next) }
  const autoCompleteFor = (key: keyof DateValue) => inputProps?.autoComplete ?? (autoComplete === false ? undefined : typeof autoComplete === 'string' ? autoComplete : `bday-${key}`)
  return <div className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''} ${className}`.trim()}><Fieldset ref={ref} style={style} legend={legend} hint={hint} error={error}><div className="govuk-date-input">{dateFieldOrder[order].map((key) => { const [label, width] = dateFields[key]; return <div className="govuk-date-input__item" key={key}><label className="govuk-label govuk-date-input__label" htmlFor={`${fieldId}-${key}`}>{label}</label><input {...inputProps} ref={inputRefs?.[key]} className={`govuk-input govuk-date-input__input govuk-input--width-${width} ${error ? 'govuk-input--error' : ''}`} id={`${fieldId}-${key}`} name={`${namePrefix}-${key}`} inputMode="numeric" autoComplete={autoCompleteFor(key)} value={current[key] ?? ''} onChange={change(key)} /></div> })}</div></Fieldset></div>
})

export interface FileUploadProps extends InputHTMLAttributes<HTMLInputElement>, SemanticStyling<'root' | 'label' | 'hint' | 'error' | 'input'> { label: ReactNode; hint?: ReactNode; error?: ReactNode }
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload({ className = '', classNames, error, hint, id, label, style, styles, ...props }, ref) {
  const uid = useId(); const fieldId = id ?? `kvzd-design-upload-${uid.replaceAll(':', '')}`
  return <div className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''} ${classNames?.root ?? ''}`.trim()} style={styles?.root}><Label htmlFor={fieldId} size="m" className={classNames?.label} style={styles?.label}>{label}</Label>{hint && <Hint className={classNames?.hint} style={styles?.hint}>{hint}</Hint>}{error && <ErrorMessage className={classNames?.error} style={styles?.error}>{error}</ErrorMessage>}<input {...props} ref={ref} id={fieldId} type="file" className={`govuk-file-upload ${error ? 'govuk-file-upload--error' : ''} ${classNames?.input ?? ''} ${className}`.trim()} style={{ ...styles?.input, ...style }} /></div>
})

export interface CharacterCountProps extends Omit<TextareaProps, 'maxLength' | 'styles' | 'classNames'>, SemanticStyling<'root' | 'formGroup' | 'label' | 'hint' | 'error' | 'textarea' | 'message'> { maxLength?: number; maxWords?: number }
export const CharacterCount = forwardRef<HTMLTextAreaElement, CharacterCountProps>(function CharacterCount({
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  className = '',
  classNames,
  defaultValue,
  id,
  maxLength = 200,
  maxWords,
  onBlur,
  onChange,
  onFocus,
  styles,
  value,
  ...props
}, ref) {
  const generatedId = useId().replaceAll(':', '')
  const fieldId = id ?? `kvzd-design-character-count-${generatedId}`
  const infoId = `${fieldId}-info`
  const [inner, setInner] = useState(String(defaultValue ?? ''))
  const [focused, setFocused] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const changedSinceFocus = useRef(false)
  const text = String(value ?? inner)
  const count = useMemo(() => maxWords !== undefined ? text.match(/\S+/g)?.length ?? 0 : text.length, [maxWords, text])
  const maximum = maxWords ?? maxLength
  const remaining = maximum - count
  const unit = maxWords !== undefined ? 'word' : 'character'
  const countMessage = remaining === 0 ? `You have no ${unit}s remaining`
    : `You have ${Math.abs(remaining)} ${unit}${Math.abs(remaining) === 1 ? '' : 's'} ${remaining < 0 ? 'too many' : 'remaining'}`

  useEffect(() => {
    if (!focused || !changedSinceFocus.current) return
    const timeout = setTimeout(() => setAnnouncement(countMessage), 1000)
    return () => clearTimeout(timeout)
  }, [countMessage, focused])

  return <div className={`govuk-character-count ${classNames?.root ?? ''}`.trim()} style={styles?.root}>
    <Textarea
      {...props}
      id={fieldId}
      ref={ref}
      value={text}
      aria-describedby={[ariaDescribedBy, infoId].filter(Boolean).join(' ')}
      aria-invalid={remaining < 0 ? true : ariaInvalid}
      className={`${remaining < 0 ? 'govuk-textarea--error' : ''} ${className}`.trim()}
      styles={{ root: styles?.formGroup, label: styles?.label, hint: styles?.hint, error: styles?.error, textarea: styles?.textarea }}
      classNames={{ root: classNames?.formGroup, label: classNames?.label, hint: classNames?.hint, error: classNames?.error, textarea: classNames?.textarea }}
      onFocus={(event) => { changedSinceFocus.current = false; setAnnouncement(''); setFocused(true); onFocus?.(event) }}
      onBlur={(event) => { setFocused(false); setAnnouncement(''); onBlur?.(event) }}
      onChange={(event) => { changedSinceFocus.current = true; if (value === undefined) setInner(event.target.value); onChange?.(event) }}
    />
    <div id={infoId} className="govuk-hint govuk-character-count__message govuk-visually-hidden">You can enter up to {maximum} {unit}{maximum === 1 ? '' : 's'}</div>
    <div className={`govuk-hint govuk-character-count__message ${remaining < 0 ? 'govuk-error-message' : ''} ${classNames?.message ?? ''}`.trim()} style={styles?.message} aria-hidden="true">{countMessage}</div>
    <div className="govuk-character-count__sr-status govuk-visually-hidden" aria-live="polite">{announcement}</div>
  </div>
})

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>, SemanticStyling<'root' | 'label' | 'wrapper' | 'input' | 'toggle'> { label?: ReactNode; showText?: string; hideText?: string; onVisibilityChange?: (visible: boolean) => void }
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput({ className = '', classNames, label = 'Password', showText = 'Show', hideText = 'Hide', onVisibilityChange, style, styles, ...props }, ref) {
  const [visible, setVisible] = useState(false); const uid = useId(); const id = props.id ?? `kvzd-design-password-${uid.replaceAll(':', '')}`
  return <div className={`govuk-form-group govuk-password-input ${classNames?.root ?? ''}`.trim()} style={styles?.root}><Label htmlFor={id} className={classNames?.label} style={styles?.label}>{label}</Label><div className={`govuk-input__wrapper govuk-password-input__wrapper ${classNames?.wrapper ?? ''}`.trim()} style={styles?.wrapper}><input {...props} ref={ref} id={id} className={`govuk-input govuk-password-input__input ${classNames?.input ?? ''} ${className}`.trim()} style={{ ...styles?.input, ...style }} type={visible ? 'text' : 'password'} spellCheck={false} autoCapitalize="none" /><button className={`govuk-button govuk-button--secondary govuk-password-input__toggle ${classNames?.toggle ?? ''}`.trim()} style={styles?.toggle} type="button" aria-controls={id} aria-label={`${visible ? hideText : showText} password`} aria-pressed={visible} onClick={() => { const next = !visible; setVisible(next); onVisibilityChange?.(next) }}>{visible ? hideText : showText}</button></div></div>
})
