// @vitest-environment jsdom
import { useState } from 'react'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeAll, expect, test, vi } from 'vitest'
import { Modal } from '../src/extraComponents'

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) { this.setAttribute('open', '') }
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
})

afterEach(() => cleanup())

function renderModal(props: Partial<Parameters<typeof Modal>[0]> = {}) {
  const onClose = vi.fn()
  const view = render(<Modal open title="Test modal" onClose={onClose} {...props} />)
  const dialog = () => view.container.querySelector('dialog')!
  return { view, onClose, dialog }
}

test('keyboard=false ignores Escape, keyboard=true closes on Escape', () => {
  const blocked = renderModal({ keyboard: false })
  fireEvent(blocked.dialog(), new Event('cancel', { cancelable: true }))
  expect(blocked.onClose).not.toHaveBeenCalled()
  expect(blocked.dialog().hasAttribute('open')).toBe(true)
  cleanup()

  const allowed = renderModal()
  fireEvent(allowed.dialog(), new Event('cancel', { cancelable: true }))
  expect(allowed.onClose).toHaveBeenCalledOnce()
})

test('closable=false hides the close button', () => {
  renderModal({ closable: false })
  expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
})

test('width applies px for numbers and raw value for strings, centered adds the class', () => {
  const { view, dialog } = renderModal({ width: 480, centered: true })
  expect(dialog().style.width).toBe('480px')
  expect(dialog().className).toContain('kvzd-design-modal--centered')
  view.rerender(<Modal open title="Test modal" onClose={vi.fn()} width="50%" />)
  expect(dialog().style.width).toBe('50%')
})

test('builtin footer: OK calls onOk, Cancel calls onClose', () => {
  const onOk = vi.fn()
  const { onClose } = renderModal({ onOk })
  fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
  expect(onOk).toHaveBeenCalledOnce()
  expect(onClose).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(onClose).toHaveBeenCalledOnce()
})

test('builtin footer: confirmLoading disables OK and custom texts are used', () => {
  const onOk = vi.fn()
  renderModal({ onOk, confirmLoading: true, okText: 'Save', cancelText: 'Discard' })
  const ok = screen.getByRole('button', { name: 'Save' })
  expect(ok).toHaveProperty('disabled', true)
  fireEvent.click(ok)
  expect(onOk).not.toHaveBeenCalled()
  expect(screen.getByRole('button', { name: 'Discard' })).toBeTruthy()
})

test('builtin footer: async onOk keeps OK disabled until the promise settles', async () => {
  let resolveOk!: () => void
  const onOk = () => new Promise<void>((resolve) => { resolveOk = resolve })
  renderModal({ onOk })
  const ok = screen.getByRole('button', { name: 'Confirm' })
  fireEvent.click(ok)
  expect(ok).toHaveProperty('disabled', true)
  await act(async () => { resolveOk() })
  expect(screen.getByRole('button', { name: 'Confirm' })).toHaveProperty('disabled', false)
})

test('footer={null} renders no footer and a custom footer node takes priority over the builtin one', () => {
  const { view } = renderModal({ footer: null, onOk: vi.fn() })
  expect(view.container.querySelector('.kvzd-design-modal__footer')).toBeNull()
  cleanup()

  renderModal({ footer: <p>Custom footer</p>, onOk: vi.fn() })
  expect(screen.getByText('Custom footer')).toBeTruthy()
  expect(screen.queryByRole('button', { name: 'Confirm' })).toBeNull()
})

test('no footer props means no footer, cancelText alone does not render a footer', () => {
  const { view } = renderModal()
  expect(view.container.querySelector('.kvzd-design-modal__footer')).toBeNull()
  cleanup()

  renderModal({ cancelText: 'Discard' })
  expect(screen.queryByRole('button', { name: 'Discard' })).toBeNull()
  expect(document.querySelector('.kvzd-design-modal__footer')).toBeNull()
})

test('defaultOpen opens without the open prop and closes via the close button', () => {
  render(<Modal defaultOpen title="T" onClose={() => {}}><p>Body</p></Modal>)
  expect(document.querySelector('dialog')!.hasAttribute('open')).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Close' }))
  expect(document.querySelector('dialog')!.hasAttribute('open')).toBe(false)
})

test('okButtonProps and cancelButtonProps reach the builtin footer buttons', () => {
  render(<Modal open title="T" onClose={() => {}} onOk={() => {}} okButtonProps={{ 'data-testid': 'ok-btn' }} cancelButtonProps={{ className: 'cancel-x' }}>Body</Modal>)
  expect(screen.getByTestId('ok-btn')).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Cancel' }).className).toContain('cancel-x')
})

test('destroyOnClose unmounts body content after first close and restores it on reopen', () => {
  function Harness() {
    const [open, setOpen] = useState(true)
    return <><button onClick={() => setOpen(true)}>Trigger</button><Modal open={open} title="T" onClose={() => setOpen(false)} destroyOnClose><p>Body content</p></Modal></>
  }
  render(<Harness />)
  expect(screen.getByText('Body content')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Close' }))
  expect(screen.queryByText('Body content')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Trigger' }))
  expect(screen.getByText('Body content')).toBeTruthy()
})

test('focus is returned to the element that was focused before opening', () => {
  function Harness() {
    const [open, setOpen] = useState(false)
    return <><button onClick={() => setOpen(true)}>Trigger</button><Modal open={open} title="T" onClose={() => setOpen(false)}><p>Content</p></Modal></>
  }
  render(<Harness />)
  const trigger = screen.getByRole('button', { name: 'Trigger' })
  trigger.focus()
  fireEvent.click(trigger)
  fireEvent.click(screen.getByRole('button', { name: 'Close' }))
  expect(document.activeElement).toBe(trigger)
})

test('dialog close event returns focus even when closed without the open prop changing', () => {
  function Harness() {
    const [open, setOpen] = useState(false)
    return <><button onClick={() => setOpen(true)}>Trigger</button><Modal open={open} title="T" onClose={() => setOpen(false)}><p>Content</p></Modal></>
  }
  render(<Harness />)
  const trigger = screen.getByRole('button', { name: 'Trigger' })
  trigger.focus()
  fireEvent.click(trigger)
  const dialog = document.querySelector('dialog')!
  dialog.dispatchEvent(new Event('close'))
  expect(document.activeElement).toBe(trigger)
})
