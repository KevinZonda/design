// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { Input, Select } from '../src/components'
import { Alert, Avatar, Form, Modal, Progress, Result, Steps, Tooltip } from '../src/extraComponents'

afterEach(cleanup)

test('Form.Item label is injected into the field and used for validation messages', async () => {
  render(
    <Form>
      <Form.Item name="fullName" label="Full name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <button type="submit">Send</button>
    </Form>,
  )
  fireEvent.click(screen.getByText('Send'))
  expect((await screen.findAllByText('Enter Full name')).length).toBeGreaterThan(0)
  expect(screen.getByText('Full name', { selector: 'label' })).toBeTruthy()
})

test('Form.Item help overrides the error display and extra renders supplementary text', () => {
  render(
    <Form>
      <Form.Item name="email" help="We will only use this to contact you." extra="No spam, ever.">
        <Input label="Email" />
      </Form.Item>
    </Form>,
  )
  expect(screen.getByText('We will only use this to contact you.')).toBeTruthy()
  expect(screen.getByText('No spam, ever.')).toBeTruthy()
  expect(document.querySelector('.kvzd-design-form-item')).toBeTruthy()
})

test('Select single with showSearch filters options and selects a value', () => {
  const onChange = vi.fn()
  render(
    <Select
      showSearch
      name="country"
      label="Country"
      onChange={onChange}
      options={[
        { label: 'France', value: 'fr' },
        { label: 'Germany', value: 'de' },
      ]}
    />,
  )
  fireEvent.click(screen.getByRole('button'))
  fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'ger' } })
  expect(screen.queryByText('France')).toBeNull()
  fireEvent.click(screen.getByText('Germany'))
  expect(onChange).toHaveBeenCalledWith('de')
  const hidden = document.querySelector('input[type="hidden"][name="country"]')
  expect(hidden && (hidden as HTMLInputElement).value).toBe('de')
})

test('Select single stays native without showSearch', () => {
  render(<Select label="Sort" options={[{ label: 'Newest', value: 'new' }]} />)
  expect(document.querySelector('select.govuk-select')).toBeTruthy()
})

test('Tooltip getPopupContainer mounts the popup into a custom container', () => {
  const host = document.createElement('div')
  document.body.appendChild(host)
  render(
    <Tooltip title="Copied" trigger="click" getPopupContainer={() => host}>
      <button type="button">Copy</button>
    </Tooltip>,
  )
  fireEvent.click(screen.getByText('Copy'))
  expect(host.querySelector('[role="tooltip"]')).toBeTruthy()
  expect(host.querySelector('.kvzd-design-tooltip__popup--fixed')).toBeTruthy()
  host.remove()
})

test('Progress circle exposes progressbar semantics and steps renders segments', () => {
  const { container, rerender } = render(<Progress type="circle" percent={45} />)
  const svg = container.querySelector('svg[role="progressbar"]')
  expect(svg?.getAttribute('aria-valuenow')).toBe('45')
  expect(container.querySelector('.kvzd-design-progress--circle')).toBeTruthy()

  rerender(<Progress type="steps" percent={60} stepsCount={5} />)
  const filled = container.querySelectorAll('.kvzd-design-progress__segment--filled')
  expect(filled.length).toBe(3)

  rerender(<Progress type="dashboard" percent={80} gapDegree={20} />)
  expect(container.querySelector('.kvzd-design-progress--circle')).toBeTruthy()

  rerender(<Progress percent={120} />)
  expect(container.querySelector('.kvzd-design-progress--success')).toBeTruthy()
})

test('Steps progressDot renders dots and keeps a check for finished steps', () => {
  const { container } = render(
    <Steps
      progressDot
      current={1}
      items={[
        { key: 'a', title: 'Done' },
        { key: 'b', title: 'Now' },
        { key: 'c', title: 'Later' },
      ]}
    />,
  )
  expect(container.querySelector('.kvzd-design-steps--dot')).toBeTruthy()
  expect(container.querySelectorAll('.kvzd-design-steps__dot').length).toBe(2)
  expect(container.querySelector('.kvzd-design-steps__item--finish svg')).toBeTruthy()
})

test('Modal mask={false} adds the no-mask class', () => {
  HTMLDialogElement.prototype.showModal = function () { this.open = true }
  HTMLDialogElement.prototype.close = function () { this.open = false }
  render(<Modal open mask={false} title="Plain" onClose={() => {}}>content</Modal>)
  expect(document.querySelector('dialog.kvzd-design-modal--no-mask')).toBeTruthy()
})

test('Input showCount renders the character counter with an optional max', () => {
  render(<Input label="Summary" defaultValue="hello" showCount={{ max: 20 }} />)
  expect(screen.getByText('5 / 20')).toBeTruthy()
  render(<Input label="Tags" defaultValue="abc" showCount />)
  expect(screen.getByText('3')).toBeTruthy()
})

test('Alert action renders an action area', () => {
  render(<Alert type="info" title="Item archived" action={<button type="button">Undo</button>} />)
  expect(document.querySelector('.kvzd-design-alert__action')).toBeTruthy()
  expect(screen.getByText('Undo')).toBeTruthy()
})

test('Result renders status icon, title, subtitle and extra actions', () => {
  render(
    <Result
      status="success"
      title="Application submitted"
      subTitle="Reference KZ-2026-0917"
      extra={<button type="button">View status</button>}
    >
      <p>We have emailed a copy of your answers.</p>
    </Result>,
  )
  expect(screen.getByRole('status')).toBeTruthy()
  expect(screen.getByText('Application submitted')).toBeTruthy()
  expect(screen.getByText('Reference KZ-2026-0917')).toBeTruthy()
  expect(screen.getByText('View status')).toBeTruthy()
  expect(document.querySelector('.kvzd-design-result--success svg')).toBeTruthy()
})

test('Avatar renders images, initials, named sizes and shapes', () => {
  const { container, rerender } = render(<Avatar src="/face.png" alt="Ada" size="l" />)
  const img = container.querySelector('img')
  expect(img?.getAttribute('src')).toBe('/face.png')
  expect(img?.getAttribute('alt')).toBe('Ada')
  expect((container.firstChild as HTMLElement).style.width).toBe('40px')

  rerender(<Avatar shape="square" size={48} bgColor="#000000">AK</Avatar>)
  const root = container.querySelector('.kvzd-design-avatar--square') as HTMLElement
  expect(root).toBeTruthy()
  expect(root.style.width).toBe('48px')
  expect(root.textContent).toBe('AK')

  rerender(<Avatar size="m" />)
  expect(container.querySelector('.kvzd-design-avatar__text svg')).toBeTruthy()
})
