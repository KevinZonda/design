// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { Button } from '../src/components'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

test('loading button shows a spinner, sets aria-busy and ignores clicks', () => {
  const onClick = vi.fn()
  render(<Button loading onClick={onClick}>Save</Button>)
  const button = screen.getByRole('button', { name: 'Save' })
  expect(button.getAttribute('aria-busy')).toBe('true')
  expect(button.hasAttribute('disabled')).toBe(true)
  expect(button.querySelector('.kvzd-design-button__spinner')).toBeTruthy()
  fireEvent.click(button)
  expect(onClick).not.toHaveBeenCalled()
})

test('loading takes priority over a user supplied disabled and still blocks clicks', () => {
  const onClick = vi.fn()
  render(<Button loading disabled={false} onClick={onClick}>Save</Button>)
  const button = screen.getByRole('button', { name: 'Save' })
  expect(button.hasAttribute('disabled')).toBe(true)
  fireEvent.click(button)
  expect(onClick).not.toHaveBeenCalled()
})

test('spinner moves after the children when iconPosition is right', () => {
  const { container } = render(<Button loading iconPosition="right">Save</Button>)
  const button = container.querySelector('button')!
  expect(button.textContent).toBe('Save')
  const spinner = button.querySelector('.kvzd-design-button__spinner')!
  expect(Array.from(button.childNodes).at(-1)).toBe(spinner)
})

test('icon renders before children by default and after them when iconPosition is right', () => {
  const { container, rerender } = render(<Button icon={<svg data-testid="icon" />}>Save</Button>)
  let button = container.querySelector('button')!
  expect(Array.from(button.childNodes).at(0)).toBe(button.querySelector('[data-testid="icon"]'))
  expect(button.textContent).toBe('Save')

  rerender(<Button icon={<svg data-testid="icon" />} iconPosition="right">Save</Button>)
  button = container.querySelector('button')!
  const nodes = Array.from(button.childNodes)
  expect(nodes.at(-1)).toBe(button.querySelector('[data-testid="icon"]'))
})

test('isStartButton still renders its start icon alongside a custom icon', () => {
  const { container } = render(<Button isStartButton icon={<svg data-testid="icon" />}>Start</Button>)
  const button = container.querySelector('button')!
  expect(button.querySelector('[data-testid="icon"]')).toBeTruthy()
  expect(button.querySelector('.govuk-button__start-icon')).toBeTruthy()
  const order = Array.from(button.childNodes)
  expect(order[0]).toBe(button.querySelector('[data-testid="icon"]'))
  expect(order[1].textContent).toBe('Start')
  expect(order[2]).toBe(button.querySelector('.govuk-button__start-icon'))
})

test('loading link shows a spinner and blocks navigation and onClick', () => {
  const onClick = vi.fn()
  render(<Button loading href="/next" onClick={onClick}>Continue</Button>)
  const link = screen.getByRole('button', { name: 'Continue' })
  expect(link.getAttribute('aria-busy')).toBe('true')
  expect(link.querySelector('.kvzd-design-button__spinner')).toBeTruthy()
  fireEvent.click(link)
  expect(onClick).not.toHaveBeenCalled()
})

test('disabled link renders aria-disabled and blocks navigation and onClick', () => {
  const onClick = vi.fn()
  render(<Button disabled href="/next" onClick={onClick}>Continue</Button>)
  const link = screen.getByRole('button', { name: 'Continue' })
  expect(link.getAttribute('aria-disabled')).toBe('true')
  expect(link.classList.contains('govuk-button--disabled')).toBe(true)
  const defaultPrevented = !fireEvent.click(link, { cancelable: true })
  expect(defaultPrevented).toBe(true)
  expect(onClick).not.toHaveBeenCalled()
})

test('preventDoubleClick still fires onClick only once for rapid clicks', () => {
  const onClick = vi.fn()
  render(<Button preventDoubleClick onClick={onClick}>Continue</Button>)
  const button = screen.getByRole('button', { name: 'Continue' })
  fireEvent.click(button)
  fireEvent.click(button)
  expect(onClick).toHaveBeenCalledOnce()
})

test('preventDoubleClick allows a second click after the cooldown', () => {
  vi.useFakeTimers()
  const onClick = vi.fn()
  render(<Button preventDoubleClick onClick={onClick}>Continue</Button>)
  const button = screen.getByRole('button', { name: 'Continue' })
  fireEvent.click(button)
  vi.advanceTimersByTime(1500)
  fireEvent.click(button)
  expect(onClick).toHaveBeenCalledTimes(2)
})
