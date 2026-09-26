// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { Alert } from '../src/extraComponents'

afterEach(cleanup)

test('alert renders each type with matching class and role', () => {
  const view = render(<>
    <Alert type="success" title="Done">Saved</Alert>
    <Alert type="info" title="Note">FYI</Alert>
    <Alert type="warning" title="Careful">Watch out</Alert>
    <Alert type="error" title="Failed">Broken</Alert>
  </>)
  const [success, info, warning, error] = view.container.querySelectorAll('.kvzd-design-alert')
  expect(success.className).toContain('kvzd-design-alert--success')
  expect(success.getAttribute('role')).toBe('status')
  expect(info.className).toContain('kvzd-design-alert--info')
  expect(info.getAttribute('role')).toBe('status')
  expect(warning.className).toContain('kvzd-design-alert--warning')
  expect(warning.getAttribute('role')).toBe('alert')
  expect(error.className).toContain('kvzd-design-alert--error')
  expect(error.getAttribute('role')).toBe('alert')
})

test('alert defaults to info', () => {
  render(<Alert>Message</Alert>)
  expect(screen.getByRole('status').className).toContain('kvzd-design-alert--info')
})

test('alert renders title, message and description', () => {
  render(<Alert title="Title" description="Extra">Body</Alert>)
  const alert = screen.getByRole('status')
  expect(alert.textContent).toContain('Title')
  expect(alert.textContent).toContain('Body')
  expect(alert.textContent).toContain('Extra')
  expect(alert.querySelector('.kvzd-design-alert__title')).toBeTruthy()
  expect(alert.querySelector('.kvzd-design-alert__description')).toBeTruthy()
})

test('alert closable button calls onClose', () => {
  const onClose = vi.fn()
  render(<Alert closable onClose={onClose}>Body</Alert>)
  const button = screen.getByRole('button', { name: 'Close' })
  fireEvent.click(button)
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('alert closeText overrides default close label content', () => {
  render(<Alert closable closeText="Dismiss">Body</Alert>)
  expect(screen.getByRole('button', { name: 'Close' }).textContent).toBe('Dismiss')
})

test('alert shows icon by default and hides it with showIcon false', () => {
  const view = render(<Alert title="T">Body</Alert>)
  expect(view.container.querySelector('.kvzd-design-alert__icon')).toBeTruthy()
  view.rerender(<Alert showIcon={false} title="T">Body</Alert>)
  expect(view.container.querySelector('.kvzd-design-alert__icon')).toBeNull()
})
