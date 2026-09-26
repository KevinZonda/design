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

export interface FormInstance {
  getFieldValue: (name: string) => FormValue
  getFieldsValue: () => FormValues
  setFieldValue: (name: string, value: FormDataEntryValue | string[]) => void
  setFieldsValue: (values: Record<string, FormDataEntryValue | string[]>) => void
  validateFields: () => Promise<FormValues>
  resetFields: () => void
  submit: () => void
}

const defaultMessages = {
  required: 'Enter ${label}',
  pattern: 'Enter a valid ${label}',
  email: 'Enter a valid ${label} in the format name@example.com',
  url: 'Enter a valid ${label} URL',
  min: '${label} must be at least ${min}${unit}',
  max: '${label} must be no more than ${max}${unit}',
  len: '${label} must be exactly ${len}${unit}',
  whitespace: 'Enter a valid ${label}',
  number: 'Enter a valid ${label}',
}

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'noValidate'> {
  form?: FormInstance
  initialValues?: Record<string, string | string[]>
  messages?: Partial<Record<keyof typeof defaultMessages, string>>
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
  dependencies?: string[]
}

export interface FormListField {
  key: number
  name: string
  index: number
}

export interface FormListOperations {
  add: (defaultValue?: FormDataEntryValue | string[]) => void
  remove: (index: number) => void
}

export interface FormListProps {
  name: string
  children: (fields: FormListField[], operations: FormListOperations) => ReactNode
}

interface RegisteredField {
  name: string
  label: string
  id: string
  multiple: boolean
  rules: readonly FormRule[]
  initialValue?: FormValue
}

interface FormContextValue {
  errors: Record<string, string>
  initialValues: FormProps['initialValues']
  prefix: string
  disabled: boolean
  triggers: readonly ValidateTrigger[]
  register: (field: RegisteredField) => () => void
  registerDependencies: (name: string, dependencies: readonly string[]) => () => void
  setValue: (name: string, value: FormValue) => void
  validateFieldValue: (name: string, value: FormValue) => void
  getListLength: (name: string) => number
  getListKeys: (name: string) => readonly number[]
  addListItem: (name: string, defaultValue?: FormDataEntryValue | string[]) => void
  removeListItem: (name: string, index: number) => void
  listDefault: (name: string) => FormDataEntryValue | string[] | undefined
}

interface BoundFormInstance extends FormInstance {
  __bind: (impl: FormInstance) => () => void
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

function fillMessage(template: string, vars: Record<string, string | number>): string {
  return template.replaceAll(/\$\{(\w+)\}/g, (raw, key: string) => (key in vars ? String(vars[key]) : raw))
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

function validateField(field: RegisteredField, value: FormValue, values: FormValues, messages: typeof defaultMessages): string | undefined {
  const label = { label: field.label }
  for (const rule of field.rules) {
    if (rule.required && rule.whitespace && typeof value === 'string' && value.length > 0 && value.trim().length === 0) {
      return rule.message ?? fillMessage(messages.whitespace, label)
    }
    if (rule.required && empty(value)) return rule.message ?? fillMessage(messages.required, label)
    if (empty(value)) continue
    if (rule.type === 'email' && (typeof value !== 'string' || !EMAIL_PATTERN.test(value))) {
      return rule.message ?? fillMessage(messages.email, label)
    }
    if (rule.type === 'url' && !isValidUrl(value)) return rule.message ?? fillMessage(messages.url, label)
    if (rule.type === 'number' && typeof value !== 'number' && (typeof value !== 'string' || Number.isNaN(Number(value)))) {
      return rule.message ?? fillMessage(messages.number, label)
    }
    if (rule.pattern && typeof value === 'string' && !new RegExp(rule.pattern.source, rule.pattern.flags.replaceAll('g', '')).test(value)) {
      return rule.message ?? fillMessage(messages.pattern, label)
    }
    if (rule.len !== undefined || rule.min !== undefined || rule.max !== undefined) {
      const measured = ruleSize(rule, value)
      if (measured) {
        const { size, unit } = measured
        if (rule.len !== undefined && size !== rule.len) return rule.message ?? fillMessage(messages.len, { ...label, len: rule.len, unit })
        if (rule.min !== undefined && size < rule.min) return rule.message ?? fillMessage(messages.min, { ...label, min: rule.min, unit })
        if (rule.max !== undefined && size > rule.max) return rule.message ?? fillMessage(messages.max, { ...label, max: rule.max, unit })
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

function isCheckable(element: HTMLElement): element is HTMLInputElement {
  return element instanceof HTMLInputElement && (element.type === 'checkbox' || element.type === 'radio')
}

function nativeValueSetter(element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
  const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype
    : element instanceof HTMLSelectElement ? HTMLSelectElement.prototype
      : HTMLInputElement.prototype
  return Object.getOwnPropertyDescriptor(prototype, 'value')!.set!
}

function fieldElements(field: RegisteredField): HTMLElement[] {
  const byId = document.getElementById(field.id)
  if (byId instanceof HTMLInputElement || byId instanceof HTMLTextAreaElement || byId instanceof HTMLSelectElement) return [byId]
  return Array.from(document.getElementsByName(field.name)).filter((element): element is HTMLElement => element instanceof HTMLElement)
}

function writeFieldValue(field: RegisteredField, value: FormValue): void {
  const elements = fieldElements(field)
  if (elements.length === 0) return
  if (isCheckable(elements[0])) {
    const selected = Array.isArray(value) ? value.map(String) : value === undefined || value === null ? [] : [String(value)]
    for (const element of elements) {
      if (!isCheckable(element)) continue
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'checked')!.set!
      setter.call(element, selected.includes(element.value))
      element.dispatchEvent(new Event('change', { bubbles: true }))
    }
    return
  }
  const text = Array.isArray(value) ? value.join(', ') : value === undefined || value === null ? '' : String(value)
  const target = elements[0] as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  nativeValueSetter(target).call(target, text)
  target.dispatchEvent(new Event('input', { bubbles: true }))
  target.dispatchEvent(new Event('change', { bubbles: true }))
}

function createFormInstance(): BoundFormInstance {
  let impl: FormInstance | null = null
  let warned = false
  const current = (): FormInstance | null => {
    if (impl) return impl
    if (!warned) {
      warned = true
      console.warn('[kvzd-design] Form.useForm() instance is not bound to a <Form form={instance}> yet; this call is a no-op')
    }
    return null
  }
  return {
    __bind: (next) => {
      impl = next
      return () => { if (impl === next) impl = null }
    },
    getFieldValue: (name) => current()?.getFieldValue(name),
    getFieldsValue: () => current()?.getFieldsValue() ?? {},
    setFieldValue: (name, value) => { current()?.setFieldValue(name, value) },
    setFieldsValue: (values) => { current()?.setFieldsValue(values) },
    validateFields: () => current()?.validateFields() ?? Promise.resolve({}),
    resetFields: () => { current()?.resetFields() },
    submit: () => { current()?.submit() },
  }
}

export function useForm(): [FormInstance] {
  const instance = useMemo(() => createFormInstance(), [])
  return [instance]
}

const FormRoot = forwardRef<HTMLFormElement, FormProps>(function Form({ children, className = '', disabled = false, errorSummaryTitle, form, initialValues, messages: messageOverrides, onFinish, onFinishFailed, scrollToFirstError = false, validate, validateTrigger, ...props }, ref) {
  const generatedId = useId().replaceAll(':', '')
  const fieldsRef = useRef(new Map<string, RegisteredField>())
  const valuesRef = useRef<FormValues>({ ...(initialValues as FormValues | undefined) })
  const formElementRef = useRef<HTMLFormElement | null>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const pendingFocus = useRef<'summary' | 'field' | null>(null)
  const dependentsRef = useRef(new Map<string, readonly string[]>())
  const pendingDefaultsRef = useRef(new Map<string, FormDataEntryValue | string[]>())
  const listKeysRef = useRef(new Map<string, number[]>())
  const listKeyCounter = useRef(0)
  const [errors, setErrors] = useState<FormError[]>([])
  const [listLengths, setListLengths] = useState<Record<string, number>>({})
  const errorsByName = useMemo(() => Object.fromEntries(errors.map((error) => [error.name, error.message])), [errors])
  const triggers = useMemo<readonly ValidateTrigger[]>(() => Array.isArray(validateTrigger) ? validateTrigger : [validateTrigger ?? 'submit'], [validateTrigger])
  const messages = useMemo(() => ({ ...defaultMessages, ...messageOverrides }), [messageOverrides])
  const register = useCallback((field: RegisteredField) => {
    fieldsRef.current.set(field.name, field)
    return () => { fieldsRef.current.delete(field.name) }
  }, [])
  const registerDependencies = useCallback((name: string, dependencies: readonly string[]) => {
    dependentsRef.current.set(name, dependencies)
    return () => { dependentsRef.current.delete(name) }
  }, [])
  const validateFieldValue = useCallback((name: string, value: FormValue) => {
    const field = fieldsRef.current.get(name)
    if (!field) return
    valuesRef.current[name] = value
    const message = validateField(field, value, { ...valuesRef.current }, messages)
    setErrors((previous) => {
      const rest = previous.filter((error) => error.name !== name)
      return message ? [...rest, { name, message, id: field.id }] : rest
    })
  }, [messages])
  const notifyDependents = useCallback((changed: string) => {
    for (const [name, dependencies] of dependentsRef.current) {
      if (dependencies.includes(changed)) validateFieldValue(name, valuesRef.current[name])
    }
  }, [validateFieldValue])
  const setValue = useCallback((name: string, value: FormValue) => {
    valuesRef.current[name] = value
    notifyDependents(name)
  }, [notifyDependents])

  const getListLength = useCallback((name: string) => listLengths[name] ?? 0, [listLengths])
  const getListKeys = useCallback((name: string) => listKeysRef.current.get(name) ?? [], [])
  const addListItem = useCallback((name: string, defaultValue?: FormDataEntryValue | string[]) => {
    const keys = listKeysRef.current.get(name) ?? []
    listKeyCounter.current += 1
    listKeysRef.current.set(name, [...keys, listKeyCounter.current])
    const key = `${name}.${keys.length}`
    if (defaultValue === undefined) pendingDefaultsRef.current.delete(key)
    else pendingDefaultsRef.current.set(key, defaultValue)
    setListLengths((previous) => ({ ...previous, [name]: (previous[name] ?? 0) + 1 }))
  }, [])
  const removeListItem = useCallback((name: string, index: number) => {
    const keys = listKeysRef.current.get(name) ?? []
    const length = keys.length
    if (index < 0 || index >= length) return
    listKeysRef.current.set(name, keys.filter((_, i) => i !== index))
    for (let i = index; i < length - 1; i++) valuesRef.current[`${name}.${i}`] = valuesRef.current[`${name}.${i + 1}`]
    delete valuesRef.current[`${name}.${length - 1}`]
    const pending = new Map<string, FormDataEntryValue | string[]>()
    for (const [key, value] of pendingDefaultsRef.current) {
      if (!key.startsWith(`${name}.`)) { pending.set(key, value); continue }
      const i = Number(key.slice(name.length + 1))
      if (i < index) pending.set(key, value)
      else if (i > index && i < length) pending.set(`${name}.${i - 1}`, value)
    }
    pendingDefaultsRef.current = pending
    setListLengths((previous) => ({ ...previous, [name]: length - 1 }))
  }, [])
  const listDefault = useCallback((name: string) => pendingDefaultsRef.current.get(name), [])

  const applyFieldValue = (name: string, value: FormDataEntryValue | string[]) => {
    valuesRef.current[name] = value
    const field = fieldsRef.current.get(name)
    if (field) writeFieldValue(field, value)
    notifyDependents(name)
  }

  const collectValues = useCallback((): FormValues => {
    const data = formElementRef.current ? new FormData(formElementRef.current) : undefined
    const values: FormValues = {}
    for (const field of fieldsRef.current.values()) {
      const entries = data?.getAll(field.name) ?? []
      const value = field.multiple ? entries : entries[0]
      values[field.name] = value
    }
    valuesRef.current = values
    return values
  }, [])

  const runValidation = (values: FormValues): FormError[] => {
    const nextErrors: FormError[] = []
    for (const field of fieldsRef.current.values()) {
      const message = validateField(field, values[field.name], values, messages)
      if (message) nextErrors.push({ name: field.name, message, id: field.id })
    }
    for (const error of validate?.(values) ?? []) {
      if (nextErrors.some((item) => item.name === error.name)) continue
      nextErrors.push({ ...error, id: fieldsRef.current.get(error.name)?.id ?? error.name })
    }
    return nextErrors
  }

  const finishSubmit = () => {
    const values = collectValues()
    const nextErrors = runValidation(values)
    setErrors(nextErrors)
    if (nextErrors.length > 0) {
      pendingFocus.current = scrollToFirstError ? 'field' : 'summary'
      onFinishFailed?.(nextErrors, values)
    } else onFinish?.(values)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    finishSubmit()
  }

  const implRef = useRef<FormInstance | null>(null)
  useEffect(() => {
    implRef.current = {
      getFieldValue: (name) => valuesRef.current[name],
      getFieldsValue: () => ({ ...valuesRef.current }),
      setFieldValue: (name, value) => applyFieldValue(name, value),
      setFieldsValue: (values) => { for (const [name, value] of Object.entries(values)) applyFieldValue(name, value) },
      validateFields: () => {
        const values = collectValues()
        const nextErrors = runValidation(values)
        setErrors(nextErrors)
        return nextErrors.length > 0 ? Promise.reject(nextErrors) : Promise.resolve(values)
      },
      resetFields: () => {
        for (const field of fieldsRef.current.values()) {
          const initial = field.initialValue ?? (field.multiple ? [] : '')
          valuesRef.current[field.name] = initial
          writeFieldValue(field, initial)
        }
        setErrors([])
      },
      submit: () => {
        const element = formElementRef.current
        if (element && typeof element.requestSubmit === 'function') element.requestSubmit()
        else finishSubmit()
      },
    }
  })
  const stableImpl = useMemo<FormInstance>(() => ({
    getFieldValue: (name) => implRef.current?.getFieldValue(name) as FormValue,
    getFieldsValue: () => implRef.current?.getFieldsValue() ?? {},
    setFieldValue: (name, value) => { implRef.current?.setFieldValue(name, value) },
    setFieldsValue: (values) => { implRef.current?.setFieldsValue(values) },
    validateFields: () => implRef.current?.validateFields() ?? Promise.resolve({}),
    resetFields: () => { implRef.current?.resetFields() },
    submit: () => { implRef.current?.submit() },
  }), [])

  useEffect(() => {
    if (!form) return
    return (form as BoundFormInstance).__bind(stableImpl)
  }, [form, stableImpl])

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

  const setFormRef = (node: HTMLFormElement | null) => {
    formElementRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as { current: HTMLFormElement | null }).current = node
  }

  return <FormContext.Provider value={{ errors: errorsByName, initialValues, prefix: `kvzd-design-form-${generatedId}`, disabled, triggers, register, registerDependencies, setValue, validateFieldValue, getListLength, getListKeys, addListItem, removeListItem, listDefault }}>
    <form {...props} ref={setFormRef} className={className} noValidate onSubmit={handleSubmit}>
      {errors.length > 0 && <ErrorSummary ref={summaryRef} title={errorSummaryTitle} errors={errors.map((error) => ({ href: `#${error.id}`, children: error.message }))} />}
      {children}
    </form>
  </FormContext.Provider>
})

function FormItem({ children, dependencies, focusId, multiple = false, name, rules = [] }: FormItemProps) {
  const context = useContext(FormContext)
  if (!context) throw new Error('Form.Item must be used inside Form')

  const { register, registerDependencies } = context
  const childProps = children.props
  const id = (childProps.id as string | undefined) ?? `${context.prefix}-${name.replaceAll(/[^a-zA-Z0-9_-]/g, '-')}`
  const label = typeof childProps.label === 'string' ? childProps.label : typeof childProps.legend === 'string' ? childProps.legend : name
  const listDefault = context.listDefault(name)
  const initialValue = (childProps.defaultValue as FormValue | undefined) ?? context.initialValues?.[name] ?? listDefault
  useEffect(() => register({ name, label, id: focusId ?? id, multiple, rules, initialValue }), [register, focusId, id, label, multiple, name, rules, initialValue])
  useEffect(() => {
    if (!dependencies || dependencies.length === 0) return
    return registerDependencies(name, dependencies)
  }, [registerDependencies, name, dependencies])

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
  const fallbackDefault = context.initialValues?.[name] ?? listDefault
  if (childProps.value === undefined && childProps.defaultValue === undefined && fallbackDefault !== undefined) {
    injected.defaultValue = fallbackDefault
  }
  return cloneElement(children, injected)
}

function FormList({ children, name }: FormListProps) {
  const context = useContext(FormContext)
  if (!context) throw new Error('Form.List must be used inside Form')

  const length = context.getListLength(name)
  const keys = context.getListKeys(name)
  const fields = Array.from({ length }, (_, index) => ({ key: keys[index] ?? index, name: `${name}.${index}`, index }))
  return <>{children(fields, { add: (defaultValue) => context.addListItem(name, defaultValue), remove: (index) => context.removeListItem(name, index) })}</>
}

export const Form = Object.assign(FormRoot, { Item: FormItem, List: FormList, useForm })
