import { cloneElement, createContext, forwardRef, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { FormEvent, FormHTMLAttributes, ReactElement, ReactNode } from 'react'
import { ErrorSummary } from '../components/index'

export type FormValue = FormDataEntryValue | FormDataEntryValue[] | undefined
export type FormValues = Record<string, FormValue>
export type ValidateTrigger = 'onChange' | 'onBlur' | 'submit'

export interface FormRule {
  required?: boolean
  pattern?: RegExp
  min?: number
  max?: number
  len?: number
  type?: 'string' | 'number' | 'email' | 'url'
  whitespace?: boolean
  validator?: (value: FormValue, values: FormValues) => string | undefined
  message?: string
}

export interface FormError {
  name: string
  message: string
  id: string
}

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'noValidate'> {
  initialValues?: Record<string, string | string[]>
  onFinish?: (values: FormValues) => void
  onFinishFailed?: (errors: FormError[], values: FormValues) => void
  validate?: (values: FormValues) => Array<Pick<FormError, 'name' | 'message'>>
  errorSummaryTitle?: ReactNode
  validateTrigger?: ValidateTrigger | ValidateTrigger[]
  scrollToFirstError?: boolean
  disabled?: boolean
}

export interface FormItemProps {
  name: string
  children: ReactElement<Record<string, unknown>>
  rules?: readonly FormRule[]
  multiple?: boolean
  focusId?: string
}

interface RegisteredField {
  name: string
  label: string
  id: string
  multiple: boolean
  rules: readonly FormRule[]
}

interface FormContextValue {
  errors: Record<string, string>
  initialValues: FormProps['initialValues']
  prefix: string
  disabled: boolean
  triggers: readonly ValidateTrigger[]
  register: (field: RegisteredField) => () => void
  setValue: (name: string, value: FormValue) => void
  validateFieldValue: (name: string, value: FormValue) => void
}

const FormContext = createContext<FormContextValue | null>(null)

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function empty(value: FormValue): boolean {
  if (Array.isArray(value)) return value.length === 0 || value.every(empty)
  if (value instanceof File) return value.name.length === 0
  if (typeof value === 'string') return value.trim().length === 0
  return value === undefined
}

function isValidUrl(value: FormValue): boolean {
  if (typeof value !== 'string' || value.trim().length === 0) return false
  try { new URL(value); return true } catch { return false }
}

function ruleSize(rule: FormRule, value: FormValue): { size: number; unit: string } | undefined {
  if (typeof value === 'number') return { size: value, unit: '' }
  if (rule.type === 'number' && typeof value === 'string') {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? undefined : { size: parsed, unit: '' }
  }
  if (typeof value === 'string') return { size: [...value].length, unit: ' characters' }
  if (Array.isArray(value)) return { size: value.length, unit: ' items' }
  return undefined
}

function validateField(field: RegisteredField, value: FormValue, values: FormValues): string | undefined {
  for (const rule of field.rules) {
    if (rule.required && rule.whitespace && typeof value === 'string' && value.length > 0 && value.trim().length === 0) {
      return rule.message ?? `Enter a valid ${field.label}`
    }
    if (rule.required && empty(value)) return rule.message ?? `Enter ${field.label}`
    if (empty(value)) continue
    if (rule.type === 'email' && (typeof value !== 'string' || !EMAIL_PATTERN.test(value))) {
      return rule.message ?? `Enter a valid ${field.label}`
    }
    if (rule.type === 'url' && !isValidUrl(value)) return rule.message ?? `Enter a valid ${field.label}`
    if (rule.type === 'number' && typeof value !== 'number' && (typeof value !== 'string' || Number.isNaN(Number(value)))) {
      return rule.message ?? `Enter a valid ${field.label}`
    }
    if (rule.pattern && typeof value === 'string' && !new RegExp(rule.pattern.source, rule.pattern.flags.replaceAll('g', '')).test(value)) {
      return rule.message ?? `Enter a valid ${field.label}`
    }
    if (rule.len !== undefined || rule.min !== undefined || rule.max !== undefined) {
      const measured = ruleSize(rule, value)
      if (measured) {
        const { size, unit } = measured
        if (rule.len !== undefined && size !== rule.len) return rule.message ?? `${field.label} must be exactly ${rule.len}${unit}`
        if (rule.min !== undefined && size < rule.min) return rule.message ?? `${field.label} must be at least ${rule.min}${unit}`
        if (rule.max !== undefined && size > rule.max) return rule.message ?? `${field.label} must be no more than ${rule.max}${unit}`
      }
    }
    const customError = rule.validator?.(value, values)
    if (customError) return customError
  }
  return undefined
}

function eventValue(arg: unknown): FormValue {
  if (arg && typeof arg === 'object' && 'target' in arg) {
    const target = (arg as { target: unknown }).target
    if (target && typeof target === 'object' && ('value' in target || 'checked' in target)) {
      const element = target as { value?: unknown; checked?: unknown; type?: unknown }
      if ((element.type === 'checkbox' || element.type === 'radio') && typeof element.checked === 'boolean') {
        return element.checked ? element.value as string : undefined
      }
      return element.value as FormValue
    }
  }
  return arg as FormValue
}

const FormRoot = forwardRef<HTMLFormElement, FormProps>(function Form({ children, className = '', disabled = false, errorSummaryTitle, initialValues, onFinish, onFinishFailed, scrollToFirstError = false, validate, validateTrigger, ...props }, ref) {
  const generatedId = useId().replaceAll(':', '')
  const fieldsRef = useRef(new Map<string, RegisteredField>())
  const valuesRef = useRef<FormValues>({ ...(initialValues as FormValues | undefined) })
  const summaryRef = useRef<HTMLDivElement>(null)
  const pendingFocus = useRef<'summary' | 'field' | null>(null)
  const [errors, setErrors] = useState<FormError[]>([])
  const errorsByName = useMemo(() => Object.fromEntries(errors.map((error) => [error.name, error.message])), [errors])
  const triggers = useMemo<readonly ValidateTrigger[]>(() => Array.isArray(validateTrigger) ? validateTrigger : [validateTrigger ?? 'submit'], [validateTrigger])
  const register = useCallback((field: RegisteredField) => {
    fieldsRef.current.set(field.name, field)
    return () => { fieldsRef.current.delete(field.name) }
  }, [])
  const setValue = useCallback((name: string, value: FormValue) => { valuesRef.current[name] = value }, [])
  const validateFieldValue = useCallback((name: string, value: FormValue) => {
    const field = fieldsRef.current.get(name)
    if (!field) return
    valuesRef.current[name] = value
    const message = validateField(field, value, { ...valuesRef.current })
    setErrors((previous) => {
      const rest = previous.filter((error) => error.name !== name)
      return message ? [...rest, { name, message, id: field.id }] : rest
    })
  }, [])

  useEffect(() => {
    const focusTarget = pendingFocus.current
    pendingFocus.current = null
    if (!focusTarget || errors.length === 0) return
    if (focusTarget === 'field') {
      const first = errors[0]
      const element = (document.getElementById(first.id) ?? document.getElementsByName(first.name)[0]) as HTMLElement | undefined
      if (element) {
        element.scrollIntoView?.({ behavior: 'smooth', block: 'center' })
        if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1')
        element.focus()
        return
      }
    }
    summaryRef.current?.focus()
  }, [errors])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const values: FormValues = {}
    const nextErrors: FormError[] = []

    for (const field of fieldsRef.current.values()) {
      const entries = data.getAll(field.name)
      const value = field.multiple ? entries : entries[0]
      values[field.name] = value
    }
    valuesRef.current = values

    for (const field of fieldsRef.current.values()) {
      const message = validateField(field, values[field.name], values)
      if (message) nextErrors.push({ name: field.name, message, id: field.id })
    }
    for (const error of validate?.(values) ?? []) {
      if (nextErrors.some((item) => item.name === error.name)) continue
      nextErrors.push({ ...error, id: fieldsRef.current.get(error.name)?.id ?? error.name })
    }

    setErrors(nextErrors)
    if (nextErrors.length > 0) {
      pendingFocus.current = scrollToFirstError ? 'field' : 'summary'
      onFinishFailed?.(nextErrors, values)
    } else onFinish?.(values)
  }

  return <FormContext.Provider value={{ errors: errorsByName, initialValues, prefix: `kvzd-design-form-${generatedId}`, disabled, triggers, register, setValue, validateFieldValue }}>
    <form {...props} ref={ref} className={className} noValidate onSubmit={handleSubmit}>
      {errors.length > 0 && <ErrorSummary ref={summaryRef} title={errorSummaryTitle} errors={errors.map((error) => ({ href: `#${error.id}`, children: error.message }))} />}
      {children}
    </form>
  </FormContext.Provider>
})

function FormItem({ children, focusId, multiple = false, name, rules = [] }: FormItemProps) {
  const context = useContext(FormContext)
  if (!context) throw new Error('Form.Item must be used inside Form')

  const { register } = context
  const childProps = children.props
  const id = (childProps.id as string | undefined) ?? `${context.prefix}-${name.replaceAll(/[^a-zA-Z0-9_-]/g, '-')}`
  const label = typeof childProps.label === 'string' ? childProps.label : typeof childProps.legend === 'string' ? childProps.legend : name
  useEffect(() => register({ name, label, id: focusId ?? id, multiple, rules }), [register, focusId, id, label, multiple, name, rules])

  const handleTrigger = (trigger: 'onChange' | 'onBlur') => (arg: unknown) => {
    const original = childProps[trigger]
    if (typeof original === 'function') (original as (value: unknown) => void)(arg)
    const value = eventValue(arg)
    context.setValue(name, value)
    if (context.triggers.includes(trigger)) context.validateFieldValue(name, value)
  }

  const injected: Record<string, unknown> = {
    id,
    name,
    error: context.errors[name] ?? childProps.error,
    onChange: handleTrigger('onChange'),
    onBlur: handleTrigger('onBlur'),
  }
  if (context.disabled && childProps.disabled === undefined) injected.disabled = true
  if (childProps.value === undefined && childProps.defaultValue === undefined && context.initialValues?.[name] !== undefined) {
    injected.defaultValue = context.initialValues[name]
  }
  return cloneElement(children, injected)
}

export const Form = Object.assign(FormRoot, { Item: FormItem })
