// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { Switch } from '../src/extraComponents'

afterEach(cleanup)

test('switch toggles on click and calls onChange', () => {
  const onChange = vi.fn()
  render(<Switch aria-label="Enable" onChange={onChange} />)
  const sw = screen.getByRole('switch')
  expect(sw.getAttribute('aria-checked')).toBe('false')

  fireEvent.click(sw)
  expect(onChange).toHaveBeenLastCalledWith(true)
  expect(sw.getAttribute('aria-checked')).toBe('true')

  fireEvent.click(sw)
  expect(onChange).toHaveBeenLastCalledWith(false)
  expect(sw.getAttribute('aria-checked')).toBe('false')
})

test('controlled switch follows checked and still calls onChange', () => {
  const onChange = vi.fn()
  const view = render(<Switch checked={false} onChange={onChange} aria-label="Enable" />)
  const sw = screen.getByRole('switch')
  fireEvent.click(sw)
  expect(onChange).toHaveBeenLastCalledWith(true)
  expect(sw.getAttribute('aria-checked')).toBe('false')

  view.rerender(<Switch checked onChange={onChange} aria-label="Enable" />)
  expect(sw.getAttribute('aria-checked')).toBe('true')
})

test('disabled and loading switches do not toggle', () => {
  const onChange = vi.fn()
  const view = render(<Switch disabled onChange={onChange} aria-label="Enable" />)
  const sw = screen.getByRole('switch')
  fireEvent.click(sw)
  expect(onChange).not.toHaveBeenCalled()
  expect(sw.getAttribute('aria-checked')).toBe('false')
  view.unmount()

  render(<Switch loading onChange={onChange} aria-label="Enable" />)
  const loading = screen.getByRole('switch')
  fireEvent.click(loading)
  expect(onChange).not.toHaveBeenCalled()
  expect(loading.querySelector('svg')).toBeTruthy()
})

test('switch renders size and checked class', () => {
  render(<Switch size="l" defaultChecked aria-label="Enable" />)
  const sw = screen.getByRole('switch')
  expect(sw.className).toContain('kvzd-design-switch--l')
  expect(sw.className).toContain('kvzd-design-switch--checked')
})

test('switch shows On and Off text in the track when configured', () => {
  const { unmount } = render(<Switch defaultChecked checkedChildren="On" unCheckedChildren="Off" aria-label="Enable" />)
  expect(screen.getByRole('switch').textContent).toContain('On')
  unmount()
  render(<Switch checkedChildren="On" unCheckedChildren="Off" aria-label="Enable" />)
  expect(screen.getByRole('switch').textContent).toContain('Off')
})

test('switch uses string children as accessible label', () => {
  render(<Switch>Airplane mode</Switch>)
  expect(screen.getByRole('switch', { name: 'Airplane mode' })).toBeTruthy()
})

test('switch label prop sets the aria-label without visible children', () => {
  render(<Switch label="Enable sync" />)
  expect(screen.getByRole('switch', { name: 'Enable sync' })).toBeTruthy()
})
