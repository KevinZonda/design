// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { Checkboxes, Input, Select } from '../src/components'
import { Switch } from '../src/extraComponents'

afterEach(cleanup)

const options = [
  { label: 'Alpha', value: 'a' },
  { label: 'Beta', value: 'b' },
  { label: 'Gamma', value: 'c' },
]

test('switch with name renders a hidden input tracking the checked state', () => {
  render(<Switch name="enabled" aria-label="Enable" />)
  const hidden = document.querySelector('input[type="hidden"][name="enabled"]') as HTMLInputElement
  expect(hidden).toBeTruthy()
  expect(hidden.value).toBe('false')

  fireEvent.click(screen.getByRole('switch'))
  expect(hidden.value).toBe('true')

  fireEvent.click(screen.getByRole('switch'))
  expect(hidden.value).toBe('false')
})

test('switch without name renders no hidden input', () => {
  render(<Switch aria-label="Enable" />)
  expect(document.querySelector('input[type="hidden"]')).toBeNull()
})

test('controlled switch hidden input follows the checked prop', () => {
  const view = render(<Switch name="enabled" checked={false} aria-label="Enable" />)
  const hidden = document.querySelector('input[type="hidden"][name="enabled"]') as HTMLInputElement
  expect(hidden.value).toBe('false')
  view.rerender(<Switch name="enabled" checked aria-label="Enable" />)
  expect(hidden.value).toBe('true')
})

test('multiple select renders one hidden input per selected value', () => {
  const view = render(<Select multiple label="Pick" name="picks" options={options} defaultValue={['a', 'c']} />)
  const hidden = () => [...document.querySelectorAll('input[type="hidden"][name="picks"]')].map((el) => (el as HTMLInputElement).value)
  expect(hidden()).toEqual(['a', 'c'])

  fireEvent.click(screen.getByRole('button'))
  fireEvent.click(screen.getByLabelText('Beta'))
  expect(hidden()).toEqual(['a', 'c', 'b'])

  fireEvent.click(screen.getByLabelText('Alpha'))
  expect(hidden()).toEqual(['c', 'b'])

  view.unmount()
})

test('multiple select hidden inputs can be disabled with hiddenInput={false}', () => {
  render(<Select multiple label="Pick" name="picks" options={options} defaultValue={['a']} hiddenInput={false} />)
  expect(document.querySelector('input[type="hidden"][name="picks"]')).toBeNull()
})

test('checking an exclusive checkbox clears the other selections', () => {
  const seen: string[][] = []
  render(<Checkboxes name="f" legend="Choose" options={[{ label: 'Alpha', value: 'a' }, { label: 'Beta', value: 'b' }, { label: 'None of the above', value: 'none', exclusive: true }]} defaultValue={['a']} onChange={(v) => seen.push(v)} />)
  fireEvent.click(screen.getByLabelText('None of the above'))
  expect(seen.at(-1)).toEqual(['none'])
  expect((screen.getByLabelText('Alpha') as HTMLInputElement).checked).toBe(false)
  expect((screen.getByLabelText('None of the above') as HTMLInputElement).checked).toBe(true)
})

test('checking a regular checkbox clears the exclusive selection', () => {
  const seen: string[][] = []
  render(<Checkboxes name="f" legend="Choose" options={[{ label: 'Alpha', value: 'a' }, { label: 'None of the above', value: 'none', exclusive: true }]} defaultValue={['none']} onChange={(v) => seen.push(v)} />)
  fireEvent.click(screen.getByLabelText('Alpha'))
  expect(seen.at(-1)).toEqual(['a'])
  expect((screen.getByLabelText('None of the above') as HTMLInputElement).checked).toBe(false)
})

test('exclusive option renders a divider before it with configurable text', () => {
  const view = render(<Checkboxes name="f" legend="Choose" options={[{ label: 'Alpha', value: 'a' }, { label: 'None of the above', value: 'none', exclusive: true }]} />)
  const divider = document.querySelector('.govuk-checkboxes__divider')
  expect(divider?.textContent).toBe('or')
  view.rerender(<Checkboxes name="f" legend="Choose" exclusiveDividerText="oder" options={[{ label: 'Alpha', value: 'a' }, { label: 'Keine', value: 'none', exclusive: true }]} />)
  expect(document.querySelector('.govuk-checkboxes__divider')?.textContent).toBe('oder')
})

test('input merges a user-provided aria-describedby with the hint and error ids', () => {
  render(<Input label="Name" hint="As written on your passport" error="Enter your name" aria-describedby="extra-description" />)
  const input = document.querySelector('input') as HTMLInputElement
  expect(input.getAttribute('aria-describedby')).toBe(`extra-description ${input.id}-hint ${input.id}-error`)
})

test('input error forces aria-invalid while a user-provided aria-invalid is kept otherwise', () => {
  const { rerender } = render(<Input label="Name" aria-invalid={true} />)
  let input = document.querySelector('input') as HTMLInputElement
  expect(input.getAttribute('aria-invalid')).toBe('true')
  expect(input.className).not.toContain('govuk-input--error')
  expect(document.querySelector('.govuk-form-group--error')).toBeNull()

  rerender(<Input label="Name" error="Enter your name" aria-invalid={false} />)
  input = document.querySelector('input') as HTMLInputElement
  expect(input.getAttribute('aria-invalid')).toBe('true')
  expect(input.className).toContain('govuk-input--error')
  expect(document.querySelector('.govuk-form-group--error')).toBeTruthy()
})
