// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { TimePicker } from '../src/extraComponents/TimePicker'

afterEach(cleanup)

const getInput = () => screen.getByRole('textbox') as HTMLInputElement
const getToggle = () => screen.getByRole('button', { name: 'Choose time' })

test('uncontrolled timepicker types, normalises on blur and calls onChange', () => {
  const onChange = vi.fn()
  render(<TimePicker label="Time" onChange={onChange} />)
  const input = getInput()
  expect(input).toHaveProperty('value', '')
  expect(input.getAttribute('placeholder')).toBe('HH:mm')

  fireEvent.change(input, { target: { value: '9:5' } })
  expect(onChange).toHaveBeenLastCalledWith('9:5')
  fireEvent.blur(input)
  expect(input).toHaveProperty('value', '09:05')
})

test('invalid typed input falls back to the last valid value on blur', () => {
  render(<TimePicker label="Time" defaultValue="09:30" />)
  const input = getInput()
  expect(input).toHaveProperty('value', '09:30')

  fireEvent.change(input, { target: { value: 'abc' } })
  fireEvent.blur(input)
  expect(input).toHaveProperty('value', '09:30')

  fireEvent.change(input, { target: { value: '25:99' } })
  fireEvent.blur(input)
  expect(input).toHaveProperty('value', '09:30')
})

test('controlled timepicker follows value and still calls onChange', () => {
  const onChange = vi.fn()
  const view = render(<TimePicker label="Time" value="08:00" onChange={onChange} />)
  const input = getInput()
  fireEvent.change(input, { target: { value: '08:15' } })
  expect(onChange).toHaveBeenLastCalledWith('08:15')
  expect(input).toHaveProperty('value', '08:00')

  view.rerender(<TimePicker label="Time" value="08:15" onChange={onChange} />)
  expect(input).toHaveProperty('value', '08:15')
})

test('panel opens on toggle click and closes on Escape and outside click', () => {
  render(<TimePicker label="Time" />)
  expect(screen.queryByRole('listbox')).toBeNull()

  fireEvent.click(getToggle())
  expect(screen.getByRole('listbox')).toBeTruthy()

  fireEvent.keyDown(getInput(), { key: 'Escape' })
  expect(screen.queryByRole('listbox')).toBeNull()

  fireEvent.click(getToggle())
  expect(screen.getByRole('listbox')).toBeTruthy()
  fireEvent.pointerDown(document.body)
  expect(screen.queryByRole('listbox')).toBeNull()
})

test('panel opens when the input receives focus', () => {
  render(<TimePicker label="Time" />)
  fireEvent.focus(getInput())
  expect(screen.getByRole('listbox')).toBeTruthy()
})

test('selecting an hour fills the value and closes the panel', () => {
  const onChange = vi.fn()
  render(<TimePicker label="Time" onChange={onChange} />)
  fireEvent.click(getToggle())

  const options = screen.getAllByRole('option')
  expect(options).toHaveLength(24 + 60)
  fireEvent.click(screen.getAllByRole('option', { name: '09' })[0])
  expect(onChange).toHaveBeenLastCalledWith('09:00')
  expect(getInput()).toHaveProperty('value', '09:00')
  expect(screen.queryByRole('listbox')).toBeNull()
})

test('selecting a minute keeps the current hour', () => {
  const onChange = vi.fn()
  render(<TimePicker label="Time" defaultValue="09:15" onChange={onChange} />)
  fireEvent.click(getToggle())

  fireEvent.click(screen.getByRole('option', { name: '45' }))
  expect(onChange).toHaveBeenLastCalledWith('09:45')
  expect(getInput()).toHaveProperty('value', '09:45')
})

test('current value is highlighted in the panel', () => {
  render(<TimePicker label="Time" defaultValue="10:30" />)
  fireEvent.click(getToggle())
  expect(screen.getAllByRole('option', { name: '10' })[0].getAttribute('aria-selected')).toBe('true')
  expect(screen.getByRole('option', { name: '30' }).getAttribute('aria-selected')).toBe('true')
  expect(screen.getAllByRole('option', { name: '11' })[0].getAttribute('aria-selected')).toBe('false')
})

test('hourStep and minuteStep thin the option lists', () => {
  render(<TimePicker label="Time" hourStep={6} minuteStep={15} />)
  fireEvent.click(getToggle())
  const options = screen.getAllByRole('option')
  expect(options).toHaveLength(4 + 4)
  expect(options.map((o) => o.textContent)).toEqual(['00', '06', '12', '18', '00', '15', '30', '45'])
})

test('allowClear empties the value and calls onChange', () => {
  const onChange = vi.fn()
  render(<TimePicker label="Time" defaultValue="09:15" allowClear onChange={onChange} />)
  fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
  expect(onChange).toHaveBeenLastCalledWith('')
  expect(getInput()).toHaveProperty('value', '')
})

test('clear button is hidden without a value or when allowClear is off', () => {
  render(<TimePicker label="Time" allowClear />)
  expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull()
  cleanup()
  render(<TimePicker label="Time" defaultValue="09:15" />)
  expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull()
})

test('form group parts render: label, hint, error, status and describedby wiring', () => {
  render(<TimePicker label="Time" hint="Use 24 hour format" error="Invalid time" status="GMT" />)
  expect(screen.getByText('Use 24 hour format')).toBeTruthy()
  expect(screen.getByText('Invalid time')).toBeTruthy()
  expect(screen.getByText('GMT')).toBeTruthy()
  const input = getInput()
  expect(input.getAttribute('aria-invalid')).toBe('true')
  const describedBy = (input.getAttribute('aria-describedby') ?? '').split(' ')
  expect(describedBy).toHaveLength(3)
  expect(document.getElementById(describedBy[0])?.textContent).toContain('Use 24 hour format')
  expect(document.getElementById(describedBy[1])?.textContent).toContain('Invalid time')
  expect(document.getElementById(describedBy[2])?.textContent).toContain('GMT')
  expect(document.querySelector('.govuk-form-group--error')).toBeTruthy()
})

test('visuallyHiddenLabel keeps the label in the accessibility tree', () => {
  render(<TimePicker label="Time" visuallyHiddenLabel />)
  const label = document.querySelector('label')
  expect(label?.className).toContain('govuk-visually-hidden')
  expect(screen.getByRole('textbox', { name: 'Time' })).toBeTruthy()
})

test('width and semantic classNames/styles land on the right slots', () => {
  render(<TimePicker label="Time" width={5} classNames={{ input: 'my-input', list: 'my-list' }} styles={{ input: { color: 'red' } }} />)
  const input = getInput()
  expect(input.className).toContain('govuk-input--width-5')
  expect(input.className).toContain('my-input')
  expect(input.style.color).toBe('red')
  fireEvent.click(getToggle())
  expect(document.querySelector('.kvzd-design-timepicker__panel')?.className).toContain('my-list')
})

test('arrow keys move focus between panel options', () => {
  render(<TimePicker label="Time" />)
  fireEvent.click(getToggle())
  const panel = screen.getByRole('listbox')
  const options = panel.querySelectorAll<HTMLButtonElement>('[role="option"]')
  options[0].focus()
  fireEvent.keyDown(options[0], { key: 'ArrowDown' })
  expect(document.activeElement).toBe(options[1])
  fireEvent.keyDown(options[1], { key: 'ArrowDown' })
  expect(document.activeElement).toBe(options[2])
  fireEvent.keyDown(options[2], { key: 'ArrowUp' })
  expect(document.activeElement).toBe(options[1])
  fireEvent.keyDown(options[1], { key: 'Escape' })
  expect(screen.queryByRole('listbox')).toBeNull()
  expect(document.activeElement).toBe(getInput())
})

test('inputProps and native attributes pass through to the input', () => {
  render(<TimePicker label="Time" inputProps={{ 'data-testid': 'time-input' }} required name="arrival" />)
  const input = getInput()
  expect(input.getAttribute('data-testid')).toBe('time-input')
  expect(input.required).toBe(true)
  expect(input.getAttribute('name')).toBe('arrival')
})
