// @vitest-environment jsdom
import { act } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { Input } from '../src/components'
import { Form, type FormError, type FormInstance, type FormValues } from '../src/extraComponents/Form'

afterEach(() => {
  cleanup()
  delete (Element.prototype as { scrollIntoView?: unknown }).scrollIntoView
})

let instance: FormInstance

function Harness({ children, ...props }: Partial<React.ComponentProps<typeof Form>> & { children: React.ReactNode }) {
  const [form] = Form.useForm()
  instance = form
  return <Form form={form} {...props}>{children}</Form>
}

function renderInstanceForm(children: React.ReactNode, props: Partial<React.ComponentProps<typeof Form>> = {}) {
  const onFinish = vi.fn()
  const onFinishFailed = vi.fn()
  render(<Harness {...props} onFinish={onFinish} onFinishFailed={onFinishFailed}>{children}</Harness>)
  return { onFinish, onFinishFailed }
}

test('useForm setFieldValue writes the DOM value and syncs getFieldsValue', () => {
  renderInstanceForm(<Form.Item name="email" rules={[{ required: true }]}><Input label="Email address" /></Form.Item>)
  const input = screen.getByLabelText('Email address') as HTMLInputElement

  act(() => instance.setFieldValue('email', 'person@example.com'))

  expect(input.value).toBe('person@example.com')
  expect(instance.getFieldValue('email')).toBe('person@example.com')
  expect(instance.getFieldsValue()).toEqual({ email: 'person@example.com' })
})

test('useForm setFieldsValue updates several fields at once', () => {
  renderInstanceForm(<>
    <Form.Item name="first"><Input label="First name" /></Form.Item>
    <Form.Item name="last"><Input label="Last name" /></Form.Item>
  </>)
  act(() => instance.setFieldsValue({ first: 'Ada', last: 'Lovelace' }))
  expect((screen.getByLabelText('First name') as HTMLInputElement).value).toBe('Ada')
  expect(instance.getFieldsValue()).toEqual({ first: 'Ada', last: 'Lovelace' })
})

test('validateFields resolves with values when valid and rejects with errors when invalid', async () => {
  renderInstanceForm(<Form.Item name="email" rules={[{ required: true, type: 'email' }]}><Input label="Email address" /></Form.Item>)

  await act(async () => {
    await expect(instance.validateFields()).rejects.toSatisfy((errors: FormError[]) => errors[0].name === 'email')
  })
  expect(screen.getAllByText(/Enter Email address/).length).toBeGreaterThan(0)

  act(() => instance.setFieldValue('email', 'person@example.com'))
  await act(async () => {
    await expect(instance.validateFields()).resolves.toEqual({ email: 'person@example.com' })
  })
  expect(screen.queryAllByText(/Enter Email address/).length).toBe(0)
})

test('resetFields restores initialValues and clears errors', () => {
  renderInstanceForm(
    <Form.Item name="name" rules={[{ required: true }]}><Input label="Full name" /></Form.Item>,
    { initialValues: { name: 'Alice' } },
  )
  const input = screen.getByLabelText('Full name') as HTMLInputElement
  expect(input.value).toBe('Alice')

  fireEvent.change(input, { target: { value: 'Bob' } })
  act(() => instance.resetFields())
  expect(input.value).toBe('Alice')
  expect(instance.getFieldsValue()).toEqual({ name: 'Alice' })

  fireEvent.change(input, { target: { value: '' } })
  act(() => { void instance.validateFields().catch(() => undefined) })
  expect(screen.getAllByText(/Enter Full name/).length).toBeGreaterThan(0)

  act(() => instance.resetFields())
  expect(input.value).toBe('Alice')
  expect(instance.getFieldsValue()).toEqual({ name: 'Alice' })
  expect(screen.queryAllByText(/Enter Full name/).length).toBe(0)
})

test('submit triggers onFinish with the collected values', () => {
  const { onFinish, onFinishFailed } = renderInstanceForm(
    <Form.Item name="name" rules={[{ required: true }]}><Input label="Full name" /></Form.Item>,
  )
  act(() => instance.submit())
  expect(onFinish).not.toHaveBeenCalled()
  expect(onFinishFailed).toHaveBeenCalledOnce()

  act(() => instance.setFieldValue('name', 'Alice'))
  act(() => instance.submit())
  expect(onFinish).toHaveBeenCalledWith({ name: 'Alice' })
})

test('unbound instance methods are no-ops and warn only once', () => {
  let unbound: FormInstance | undefined
  function Probe() {
    const [form] = Form.useForm()
    unbound = form
    return null
  }
  render(<Probe />)
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

  act(() => unbound!.setFieldValue('x', 'y'))
  act(() => unbound!.submit())
  expect(warn).toHaveBeenCalledTimes(1)
  expect(unbound!.getFieldsValue()).toEqual({})
  expect(warn).toHaveBeenCalledTimes(1)
  warn.mockRestore()
})

test('Form.List add renders fields with default values and remove drops them', () => {
  const { onFinish } = renderInstanceForm(<>
    <Form.List name="passengers">
      {(fields, { add, remove }) => (
        <div>
          {fields.map((field) => (
            <Form.Item key={field.key} name={field.name} rules={[{ required: true }]}>
              <Input label={`Passenger ${field.index + 1}`} />
            </Form.Item>
          ))}
          <button type="button" onClick={() => add()}>Add passenger</button>
          <button type="button" onClick={() => remove(0)}>Remove first</button>
        </div>
      )}
    </Form.List>
    <button type="submit">Submit</button>
  </>)

  expect(screen.queryByLabelText('Passenger 1')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Add passenger' }))
  expect(screen.getByLabelText('Passenger 1')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Add passenger' }))
  expect(screen.getByLabelText('Passenger 2')).toBeTruthy()

  fireEvent.change(screen.getByLabelText('Passenger 1'), { target: { value: 'Alice' } })
  fireEvent.change(screen.getByLabelText('Passenger 2'), { target: { value: 'Bob' } })
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  expect(onFinish).toHaveBeenCalledWith({ 'passengers.0': 'Alice', 'passengers.1': 'Bob' })

  fireEvent.click(screen.getByRole('button', { name: 'Remove first' }))
  expect(screen.queryByLabelText('Passenger 2')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  expect(onFinish).toHaveBeenLastCalledWith({ 'passengers.0': 'Bob' })
})

test('Form.List add seeds the new field with a default value', () => {
  renderInstanceForm(<>
    <Form.List name="stops">
      {(fields, { add }) => (
        <div>
          {fields.map((field) => (
            <Form.Item key={field.key} name={field.name}>
              <Input label={`Stop ${field.index + 1}`} />
            </Form.Item>
          ))}
          <button type="button" onClick={() => add('Euston')}>Add stop</button>
        </div>
      )}
    </Form.List>
  </>)
  fireEvent.click(screen.getByRole('button', { name: 'Add stop' }))
  expect((screen.getByLabelText('Stop 1') as HTMLInputElement).value).toBe('Euston')
})

test('dependencies revalidate the dependent field when a dependency changes', () => {
  renderInstanceForm(<>
    <Form.Item name="password" rules={[{ required: true }]}><Input label="Password" /></Form.Item>
    <Form.Item
      name="confirm"
      dependencies={['password']}
      rules={[{ validator: (value, values) => (value !== values.password ? 'Passwords do not match' : undefined) }]}
    >
      <Input label="Confirm password" />
    </Form.Item>
  </>)

  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } })
  fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'nope' } })
  expect(screen.queryAllByText(/Passwords do not match/).length).toBe(0)

  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'changed' } })
  expect(screen.getAllByText(/Passwords do not match/).length).toBeGreaterThan(0)

  fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'changed' } })
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } })
  expect(screen.queryAllByText(/Passwords do not match/).length).toBeGreaterThan(0)
  fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'secret' } })
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'final' } })
  expect(screen.getAllByText(/Passwords do not match/).length).toBeGreaterThan(0)
})

test('messages prop overrides the default templates with variable interpolation', () => {
  const { onFinishFailed } = renderInstanceForm(<>
    <Form.Item name="name" rules={[{ required: true }]}><Input label="Your name" /></Form.Item>
    <Form.Item name="code" rules={[{ min: 3 }]}><Input label="Code" /></Form.Item>
  </>, { messages: { required: 'Please provide ${label}', min: '${label} needs at least ${min}${unit}' } })

  fireEvent.change(screen.getByLabelText('Code'), { target: { value: 'ab' } })
  act(() => instance.submit())
  expect(onFinishFailed).toHaveBeenCalled()
  expect(screen.getAllByText(/Please provide Your name/).length).toBeGreaterThan(0)
  expect(screen.getAllByText(/Code needs at least 3 characters/).length).toBeGreaterThan(0)
})

test('rule.message still takes precedence over messages templates', () => {
  const { onFinishFailed } = renderInstanceForm(
    <Form.Item name="name" rules={[{ required: true, message: 'Name is mandatory' }]}><Input label="Your name" /></Form.Item>,
    { messages: { required: 'Please provide ${label}' } },
  )
  act(() => instance.submit())
  expect(onFinishFailed).toHaveBeenCalled()
  expect(screen.getAllByText(/Name is mandatory/).length).toBeGreaterThan(0)
})

test('instance setFieldValue drives validation errors away like a user edit', () => {
  const { onFinish } = renderInstanceForm(
    <Form.Item name="name" rules={[{ required: true }]}><Input label="Full name" /></Form.Item>,
    { validateTrigger: 'onChange' },
  )
  act(() => { void instance.validateFields().catch(() => undefined) })
  expect(screen.getAllByText(/Enter Full name/).length).toBeGreaterThan(0)

  act(() => instance.setFieldValue('name', 'Alice'))
  expect(screen.queryAllByText(/Enter Full name/).length).toBe(0)

  act(() => instance.submit())
  expect(onFinish).toHaveBeenCalledWith({ name: 'Alice' } satisfies FormValues)
})
