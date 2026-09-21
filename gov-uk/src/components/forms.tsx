import { useId, useMemo, useState } from 'react'
import type { ChangeEvent, FieldsetHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

export function Hint({ id, children }: { id?: string; children: ReactNode }) { return <div id={id} className="govuk-hint">{children}</div> }
export function Label({ htmlFor, children, size }: { htmlFor?: string; children: ReactNode; size?: 's' | 'm' | 'l' | 'xl' }) { return <label className={`govuk-label ${size ? `govuk-label--${size}` : ''}`} htmlFor={htmlFor}>{children}</label> }
export function ErrorMessage({ id, children, visuallyHiddenText = 'Error:' }: { id?: string; children: ReactNode; visuallyHiddenText?: string }) { return <p id={id} className="govuk-error-message"><span className="govuk-visually-hidden">{visuallyHiddenText}</span> {children}</p> }

export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> { legend: ReactNode; legendSize?: 's' | 'm' | 'l' | 'xl'; isPageHeading?: boolean; hint?: ReactNode; error?: ReactNode }
export function Fieldset({ children, className = '', error, hint, isPageHeading = false, legend, legendSize, ...props }: FieldsetProps) {
  return <fieldset {...props} className={`govuk-fieldset ${className}`.trim()}><legend className={`govuk-fieldset__legend ${legendSize ? `govuk-fieldset__legend--${legendSize}` : ''}`.trim()}>{isPageHeading ? <h1 className="govuk-fieldset__heading">{legend}</h1> : legend}</legend>{hint && <Hint>{hint}</Hint>}{error && <ErrorMessage>{error}</ErrorMessage>}{children}</fieldset>
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { label: ReactNode; hint?: ReactNode; error?: ReactNode; rows?: number }
export function Textarea({ className = '', error, hint, id, label, rows = 5, ...props }: TextareaProps) {
  const uid = useId(); const fieldId = id ?? `kvzd-textarea-${uid.replaceAll(':', '')}`; const described = [hint && `${fieldId}-hint`, error && `${fieldId}-error`].filter(Boolean).join(' ')
  return <div className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''}`}><Label htmlFor={fieldId} size="m">{label}</Label>{hint && <Hint id={`${fieldId}-hint`}>{hint}</Hint>}{error && <ErrorMessage id={`${fieldId}-error`}>{error}</ErrorMessage>}<textarea {...props} id={fieldId} rows={rows} aria-describedby={described || undefined} aria-invalid={error ? true : undefined} className={`govuk-textarea ${error ? 'govuk-textarea--error' : ''} ${className}`.trim()} /></div>
}

export interface Option { label: ReactNode; value: string; disabled?: boolean }
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> { label: ReactNode; hint?: ReactNode; error?: ReactNode; options: Option[]; placeholder?: string }
export function Select({ className = '', error, hint, id, label, options, placeholder, ...props }: SelectProps) {
  const uid = useId(); const fieldId = id ?? `kvzd-select-${uid.replaceAll(':', '')}`; const described = [hint && `${fieldId}-hint`, error && `${fieldId}-error`].filter(Boolean).join(' ')
  return <div className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''}`}><Label htmlFor={fieldId} size="m">{label}</Label>{hint && <Hint id={`${fieldId}-hint`}>{hint}</Hint>}{error && <ErrorMessage id={`${fieldId}-error`}>{error}</ErrorMessage>}<select {...props} id={fieldId} aria-describedby={described || undefined} className={`govuk-select ${error ? 'govuk-select--error' : ''} ${className}`.trim()}>{placeholder && <option value="">{placeholder}</option>}{options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}</select></div>
}

export interface ChoiceOption extends Option { hint?: ReactNode; conditional?: ReactNode }
interface ChoiceGroupProps { name: string; legend: ReactNode; options: ChoiceOption[]; value?: string[]; defaultValue?: string[]; onChange?: (value: string[]) => void; hint?: ReactNode; error?: ReactNode; small?: boolean }
export function Checkboxes({ defaultValue = [], error, hint, legend, name, onChange, options, small = false, value }: ChoiceGroupProps) {
  const [inner, setInner] = useState(defaultValue); const selected = value ?? inner
  const update = (optionValue: string, checked: boolean) => { const next = checked ? [...selected, optionValue] : selected.filter((item) => item !== optionValue); if (value === undefined) setInner(next); onChange?.(next) }
  return <div className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''}`}><Fieldset legend={legend} hint={hint} error={error}><div className={`govuk-checkboxes ${small ? 'govuk-checkboxes--small' : ''}`} data-module="govuk-checkboxes">{options.map((option) => <div key={option.value}><div className="govuk-checkboxes__item"><input className="govuk-checkboxes__input" id={`${name}-${option.value}`} name={name} type="checkbox" value={option.value} checked={selected.includes(option.value)} disabled={option.disabled} onChange={(event) => update(option.value, event.target.checked)} /><label className="govuk-label govuk-checkboxes__label" htmlFor={`${name}-${option.value}`}>{option.label}</label>{option.hint && <div className="govuk-hint govuk-checkboxes__hint">{option.hint}</div>}</div>{option.conditional && selected.includes(option.value) && <div className="govuk-checkboxes__conditional">{option.conditional}</div>}</div>)}</div></Fieldset></div>
}

interface RadioGroupProps extends Omit<ChoiceGroupProps, 'value' | 'defaultValue' | 'onChange'> { value?: string; defaultValue?: string; onChange?: (value: string) => void; inline?: boolean }
export function Radios({ defaultValue, error, hint, inline = false, legend, name, onChange, options, small = false, value }: RadioGroupProps) {
  const [inner, setInner] = useState(defaultValue); const selected = value ?? inner
  const update = (next: string) => { if (value === undefined) setInner(next); onChange?.(next) }
  return <div className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''}`}><Fieldset legend={legend} hint={hint} error={error}><div className={`govuk-radios ${inline ? 'govuk-radios--inline' : ''} ${small ? 'govuk-radios--small' : ''}`} data-module="govuk-radios">{options.map((option) => <div key={option.value}><div className="govuk-radios__item"><input className="govuk-radios__input" id={`${name}-${option.value}`} name={name} type="radio" value={option.value} checked={selected === option.value} disabled={option.disabled} onChange={() => update(option.value)} /><label className="govuk-label govuk-radios__label" htmlFor={`${name}-${option.value}`}>{option.label}</label>{option.hint && <div className="govuk-hint govuk-radios__hint">{option.hint}</div>}</div>{option.conditional && selected === option.value && <div className="govuk-radios__conditional">{option.conditional}</div>}</div>)}</div></Fieldset></div>
}

export interface DateValue { day?: string; month?: string; year?: string }
export function DateInput({ value, defaultValue = {}, onChange, legend = 'Date', hint, error, namePrefix = 'date' }: { value?: DateValue; defaultValue?: DateValue; onChange?: (value: DateValue) => void; legend?: ReactNode; hint?: ReactNode; error?: ReactNode; namePrefix?: string }) {
  const [inner, setInner] = useState(defaultValue); const current = value ?? inner
  const change = (key: keyof DateValue) => (event: ChangeEvent<HTMLInputElement>) => { const next = { ...current, [key]: event.target.value }; if (value === undefined) setInner(next); onChange?.(next) }
  return <div className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''}`}><Fieldset legend={legend} hint={hint} error={error}><div className="govuk-date-input">{([['day', 'Day', 2], ['month', 'Month', 2], ['year', 'Year', 4]] as const).map(([key, label, width]) => <div className="govuk-date-input__item" key={key}><label className="govuk-label govuk-date-input__label" htmlFor={`${namePrefix}-${key}`}>{label}</label><input className={`govuk-input govuk-date-input__input govuk-input--width-${width} ${error ? 'govuk-input--error' : ''}`} id={`${namePrefix}-${key}`} name={`${namePrefix}-${key}`} inputMode="numeric" value={current[key] ?? ''} onChange={change(key)} /></div>)}</div></Fieldset></div>
}

export interface FileUploadProps extends InputHTMLAttributes<HTMLInputElement> { label: ReactNode; hint?: ReactNode; error?: ReactNode }
export function FileUpload({ className = '', error, hint, id, label, ...props }: FileUploadProps) {
  const uid = useId(); const fieldId = id ?? `kvzd-upload-${uid.replaceAll(':', '')}`
  return <div className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''}`}><Label htmlFor={fieldId} size="m">{label}</Label>{hint && <Hint>{hint}</Hint>}{error && <ErrorMessage>{error}</ErrorMessage>}<input {...props} id={fieldId} type="file" className={`govuk-file-upload ${error ? 'govuk-file-upload--error' : ''} ${className}`.trim()} /></div>
}

export interface CharacterCountProps extends Omit<TextareaProps, 'maxLength'> { maxLength?: number; maxWords?: number }
export function CharacterCount({ maxLength = 200, maxWords, onChange, value, defaultValue, ...props }: CharacterCountProps) {
  const [inner, setInner] = useState(String(defaultValue ?? '')); const text = String(value ?? inner)
  const count = useMemo(() => maxWords ? text.trim().split(/\s+/).filter(Boolean).length : text.length, [maxWords, text]); const maximum = maxWords ?? maxLength; const remaining = maximum - count
  return <div className="govuk-character-count" data-module="govuk-character-count"><Textarea {...props} value={text} onChange={(event) => { if (value === undefined) setInner(event.target.value); onChange?.(event) }} /><div className={`govuk-hint govuk-character-count__message ${remaining < 0 ? 'govuk-error-message' : ''}`} aria-live="polite">You have {Math.abs(remaining)} {maxWords ? 'word' : 'character'}{Math.abs(remaining) === 1 ? '' : 's'} {remaining < 0 ? 'too many' : 'remaining'}</div></div>
}

export function PasswordInput({ className = '', label = 'Password', showText = 'Show', hideText = 'Hide', ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label?: ReactNode; showText?: string; hideText?: string }) {
  const [visible, setVisible] = useState(false); const uid = useId(); const id = props.id ?? `kvzd-password-${uid.replaceAll(':', '')}`
  return <div className="govuk-form-group govuk-password-input"><Label htmlFor={id}>{label}</Label><div className="govuk-input__wrapper govuk-password-input__wrapper"><input {...props} id={id} className={`govuk-input govuk-password-input__input ${className}`.trim()} type={visible ? 'text' : 'password'} spellCheck={false} autoCapitalize="none" /><button className="govuk-button govuk-button--secondary govuk-password-input__toggle" type="button" aria-controls={id} aria-label={`${visible ? hideText : showText} password`} aria-pressed={visible} onClick={() => setVisible((current) => !current)}>{visible ? hideText : showText}</button></div></div>
}
