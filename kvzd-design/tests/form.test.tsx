// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { Checkboxes, Input } from '../src/components'
import { Form } from '../src/extraComponents/Form'

afterEach(() => {
  cleanup()
  delete (Element.prototype as { scrollIntoView?: unknown }).scrollIntoView
})

function renderSubmitForm(children: React.ReactNode, props: Partial<React.ComponentProps<typeof Form>> = {}) {
  const onFinish = vi.fn()
  const onFinishFailed = vi.fn()
  const view = render(<Form onFinish={onFinish} onFinishFailed={onFinishFailed} {...props}>{children}<button type="submit">Submit</button></Form>)
  const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  return { view, onFinish, onFinishFailed, submit }
}

function expectError(text: RegExp) {
  expect(screen.getAllByText(text).length).toBeGreaterThan(0)
}

function expectNoError(text: RegExp) {
  expect(screen.queryAllByText(text).length).toBe(0)
}

test('validateTrigger onChange shows the field error without focusing the error summary', () => {
  render(<Form validateTrigger="onChange">
    <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
      <Input label="Email address" />
    </Form.Item>
  </Form>)
  const input = screen.getByLabelText('Email address')

  fireEvent.change(input, { target: { value: 'not-an-email' } })
  expectError(/Enter a valid Email address/)
  expect(document.activeElement).not.toBe(screen.getByRole('alert'))

  fireEvent.change(input, { target: { value: 'person@example.com' } })
  expectNoError(/Enter a valid Email address/)
})

test('validateTrigger onBlur validates on blur and chains existing handlers', () => {
  const onChange = vi.fn()
  const onBlur = vi.fn()
  render(<Form validateTrigger={['onBlur']}>
    <Form.Item name="name" rules={[{ required: true }]}>
      <Input label="Full name" onChange={onChange} onBlur={onBlur} />
    </Form.Item>
  </Form>)
  const input = screen.getByLabelText('Full name')

  fireEvent.change(input, { target: { value: 'x' } })
  expect(onChange).toHaveBeenCalled()
  fireEvent.change(input, { target: { value: '' } })
  expectNoError(/Enter Full name/)
  fireEvent.blur(input)
  expect(onBlur).toHaveBeenCalled()
  expectError(/Enter Full name/)
})

test('min, max and len rules report their default messages', () => {
  const { onFinish, submit } = renderSubmitForm(<>
    <Form.Item name="min" rules={[{ min: 3 }]}><Input label="Min field" /></Form.Item>
    <Form.Item name="max" rules={[{ max: 5 }]}><Input label="Max field" /></Form.Item>
    <Form.Item name="len" rules={[{ len: 4 }]}><Input label="Len field" /></Form.Item>
  </>)

  fireEvent.change(screen.getByLabelText('Min field'), { target: { value: 'ab' } })
  fireEvent.change(screen.getByLabelText('Max field'), { target: { value: 'abcdef' } })
  fireEvent.change(screen.getByLabelText('Len field'), { target: { value: 'abc' } })
  submit()
  expectError(/Min field must be at least 3 characters/)
  expectError(/Max field must be no more than 5 characters/)
  expectError(/Len field must be exactly 4 characters/)
  expect(onFinish).not.toHaveBeenCalled()

  fireEvent.change(screen.getByLabelText('Min field'), { target: { value: 'abc' } })
  fireEvent.change(screen.getByLabelText('Max field'), { target: { value: 'abcde' } })
  fireEvent.change(screen.getByLabelText('Len field'), { target: { value: 'abcd' } })
  submit()
  expect(onFinish).toHaveBeenCalledOnce()
})

test('type email and url rules validate format', () => {
  const { onFinish, submit } = renderSubmitForm(<>
    <Form.Item name="email" rules={[{ type: 'email' }]}><Input label="Email address" /></Form.Item>
    <Form.Item name="website" rules={[{ type: 'url' }]}><Input label="Website" /></Form.Item>
  </>)

  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'a b@c' } })
  fireEvent.change(screen.getByLabelText('Website'), { target: { value: 'not a url' } })
  submit()
  expectError(/Enter a valid Email address/)
  expectError(/Enter a valid Website/)

  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'person@example.com' } })
  fireEvent.change(screen.getByLabelText('Website'), { target: { value: 'https://example.com/path' } })
  submit()
  expect(onFinish).toHaveBeenCalledOnce()
})

test('type number compares min and max by numeric value', () => {
  const { submit } = renderSubmitForm(
    <Form.Item name="age" rules={[{ type: 'number', min: 18, max: 65 }]}><Input label="Age" /></Form.Item>,
  )
  fireEvent.change(screen.getByLabelText('Age'), { target: { value: '12' } })
  submit()
  expectError(/Age must be at least 18/)

  fireEvent.change(screen.getByLabelText('Age'), { target: { value: '70' } })
  submit()
  expectError(/Age must be no more than 65/)

  fireEvent.change(screen.getByLabelText('Age'), { target: { value: 'abc' } })
  submit()
  expectError(/Enter a valid Age/)
})

test('multiple fields measure min and max by item count', () => {
  const { submit } = renderSubmitForm(
    <Form.Item name="colours" multiple rules={[{ min: 2, max: 3 }]}>
      <Checkboxes legend="Colours" name="colours" options={[{ label: 'Red', value: 'red' }, { label: 'Green', value: 'green' }, { label: 'Blue', value: 'blue' }, { label: 'Yellow', value: 'yellow' }]} />
    </Form.Item>,
  )
  fireEvent.click(screen.getByLabelText('Red'))
  submit()
  expectError(/Colours must be at least 2 items/)

  for (const colour of ['Green', 'Blue', 'Yellow']) fireEvent.click(screen.getByLabelText(colour))
  submit()
  expectError(/Colours must be no more than 3 items/)
})

test('whitespace rule rejects blank-only values with its own default message', () => {
  const { submit } = renderSubmitForm(
    <Form.Item name="code" rules={[{ required: true, whitespace: true }]}><Input label="Code" /></Form.Item>,
  )
  fireEvent.change(screen.getByLabelText('Code'), { target: { value: '   ' } })
  submit()
  expectError(/Enter a valid Code/)
})

test('submit failure focuses the error summary by default', () => {
  const { submit } = renderSubmitForm(
    <Form.Item name="name" rules={[{ required: true }]}><Input label="Full name" /></Form.Item>,
  )
  submit()
  expect(document.activeElement).toBe(screen.getByRole('alert'))
})

test('scrollToFirstError scrolls to and focuses the first invalid field', () => {
  const scrollIntoView = vi.fn()
  Element.prototype.scrollIntoView = scrollIntoView
  const { submit } = renderSubmitForm(
    <Form.Item name="name" rules={[{ required: true }]}><Input label="Full name" /></Form.Item>,
    { scrollToFirstError: true },
  )
  submit()
  expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' })
  expect(document.activeElement).toBe(screen.getByLabelText('Full name'))
})

test('form disabled disables fields unless explicitly overridden', () => {
  render(<Form disabled>
    <Form.Item name="a"><Input label="Field A" /></Form.Item>
    <Form.Item name="b"><Input label="Field B" disabled={false} /></Form.Item>
  </Form>)
  expect(screen.getByLabelText('Field A')).toHaveProperty('disabled', true)
  expect(screen.getByLabelText('Field B')).toHaveProperty('disabled', false)
})
