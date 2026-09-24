import { cloneElement, createContext, forwardRef, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { FormEvent, FormHTMLAttributes, ReactElement, ReactNode } from 'react'
import { ErrorSummary } from '../components/index'

export type FormValue = FormDataEntryValue | FormDataEntryValue[] | undefined
export type FormValues = Record<string, FormValue>

export interface FormRule {
  required?: boolean
  pattern?: RegExp
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
  register: (field: RegisteredField) => () => void
}

const FormContext = createContext<FormContextValue | null>(null)

function empty(value: FormValue): boolean {
  if (Array.isArray(value)) return value.length === 0 || value.every(empty)
  if (value instanceof File) return value.name.length === 0
  return value === undefined || value.trim().length === 0
}

function validateField(field: RegisteredField, value: FormValue, values: FormValues): string | undefined {
  for (const rule of field.rules) {
    if (rule.required && empty(value)) return rule.message ?? `Enter ${field.label}`
    if (empty(value)) continue
    if (rule.pattern && typeof value === 'string' && !new RegExp(rule.pattern.source, rule.pattern.flags.replaceAll('g', '')).test(value)) {
      return rule.message ?? `Enter a valid ${field.label}`
    }
    const customError = rule.validator?.(value, values)
    if (customError) return customError
  }
  return undefined
}

const FormRoot = forwardRef<HTMLFormElement, FormProps>(function Form({ children, className = '', errorSummaryTitle, initialValues, onFinish, onFinishFailed, validate, ...props }, ref) {
  const generatedId = useId().replaceAll(':', '')
  const fieldsRef = useRef(new Map<string, RegisteredField>())
  const summaryRef = useRef<HTMLDivElement>(null)
  const [errors, setErrors] = useState<FormError[]>([])
  const errorsByName = useMemo(() => Object.fromEntries(errors.map((error) => [error.name, error.message])), [errors])
  const register = useCallback((field: RegisteredField) => {
    fieldsRef.current.set(field.name, field)
    return () => { fieldsRef.current.delete(field.name) }
  }, [])

  useEffect(() => { if (errors.length > 0) summaryRef.current?.focus() }, [errors])

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

    for (const field of fieldsRef.current.values()) {
      const message = validateField(field, values[field.name], values)
      if (message) nextErrors.push({ name: field.name, message, id: field.id })
    }
    for (const error of validate?.(values) ?? []) {
      if (nextErrors.some((item) => item.name === error.name)) continue
      nextErrors.push({ ...error, id: fieldsRef.current.get(error.name)?.id ?? error.name })
    }

    setErrors(nextErrors)
    if (nextErrors.length > 0) onFinishFailed?.(nextErrors, values)
    else onFinish?.(values)
  }

  return <FormContext.Provider value={{ errors: errorsByName, initialValues, prefix: `kvzd-design-form-${generatedId}`, register }}>
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
  const id = (children.props.id as string | undefined) ?? `${context.prefix}-${name.replaceAll(/[^a-zA-Z0-9_-]/g, '-')}`
  const label = typeof children.props.label === 'string' ? children.props.label : name
  useEffect(() => register({ name, label, id: focusId ?? id, multiple, rules }), [register, focusId, id, label, multiple, name, rules])

  const injected: Record<string, unknown> = { id, name, error: context.errors[name] ?? children.props.error }
  if (children.props.value === undefined && children.props.defaultValue === undefined && context.initialValues?.[name] !== undefined) {
    injected.defaultValue = context.initialValues[name]
  }
  return cloneElement(children, injected)
}

export const Form = Object.assign(FormRoot, { Item: FormItem })
