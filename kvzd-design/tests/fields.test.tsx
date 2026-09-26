// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { Input, SearchInput, Select, Textarea } from '../src/components'

afterEach(() => {
  cleanup()
})

const options = [
  { label: 'Alpha', value: 'a' },
  { label: 'Beta', value: 'b' },
  { label: 'Gamma', value: 'c' },
]

test('input renders prefix and suffix inside a wrapper', () => {
  render(<Input label="Amount" prefix="£" suffix="per item" />)
  expect(document.querySelector('.kvzd-design-input__wrapper')).toBeTruthy()
  expect(document.querySelector('.kvzd-design-input__prefix')?.textContent).toBe('£')
  expect(document.querySelector('.kvzd-design-input__suffix')?.textContent).toBe('per item')
})

test('input keeps the flat structure without prefix, suffix or clear', () => {
  render(<Input label="Name" />)
  expect(document.querySelector('.kvzd-design-input__wrapper')).toBeNull()
  expect(document.querySelector('input')?.className).not.toContain('kvzd-design-input__input')
})

test('input allowClear clears an uncontrolled value and reports the change', () => {
  const seen: string[] = []
  render(<Input label="Name" defaultValue="hello" allowClear onChange={(event) => seen.push(event.target.value)} />)
  const clear = screen.getByRole('button', { name: 'Clear' })
  fireEvent.click(clear)
  expect(seen).toEqual([''])
  const input = screen.getByRole('textbox') as HTMLInputElement
  expect(input.value).toBe('')
  expect(document.activeElement).toBe(input)
  expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull()
})

test('input allowClear reports an empty change for a controlled value', () => {
  const seen: string[] = []
  render(<Input label="Name" value="hi" allowClear onChange={(event) => seen.push(event.target.value)} />)
  fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
  expect(seen).toEqual([''])
})

test('input hides the clear button when empty, disabled or readOnly', () => {
  const { rerender } = render(<Input label="Name" value="" allowClear onChange={() => {}} />)
  expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull()
  rerender(<Input label="Name" value="hi" allowClear disabled onChange={() => {}} />)
  expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull()
  rerender(<Input label="Name" value="hi" allowClear readOnly onChange={() => {}} />)
  expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull()
})

test('search input calls onSearch on Enter with the current value', () => {
  const onSearch = vi.fn()
  render(<SearchInput label="Search" onSearch={onSearch} />)
  const input = screen.getByRole('searchbox')
  fireEvent.change(input, { target: { value: 'tax' } })
  fireEvent.keyDown(input, { key: 'Enter' })
  expect(onSearch).toHaveBeenCalledWith('tax')
})

test('search input enter button triggers onSearch and defaults to "Search"', () => {
  const onSearch = vi.fn()
  render(<SearchInput label="Search" enterButton onSearch={onSearch} />)
  const button = screen.getByRole('button', { name: 'Search' })
  const input = screen.getByRole('searchbox')
  fireEvent.change(input, { target: { value: 'forms' } })
  fireEvent.click(button)
  expect(onSearch).toHaveBeenCalledWith('forms')
})

test('search input renders a spinner instead of the icon while loading', () => {
  render(<SearchInput label="Search" loading />)
  expect(document.querySelector('.kvzd-design-spinner')).toBeTruthy()
})

test('search input keeps the user-provided icon when not loading', () => {
  render(<SearchInput label="Search" icon={<span data-testid="icon">*</span>} />)
  expect(screen.getByTestId('icon')).toBeTruthy()
})

test('select multiple checks options and reports the selected values', () => {
  const onChange = vi.fn()
  render(<Select label="Pick" multiple options={options} onChange={onChange} />)
  fireEvent.click(screen.getByRole('button'))
  fireEvent.click(screen.getByLabelText('Alpha'))
  expect(onChange).toHaveBeenLastCalledWith(['a'])
  fireEvent.click(screen.getByLabelText('Beta'))
  expect(onChange).toHaveBeenLastCalledWith(['a', 'b'])
})

test('select multiple reflects a controlled value and closes on Escape', () => {
  const onChange = vi.fn()
  render(<Select label="Pick" multiple options={options} value={['a']} onChange={onChange} />)
  const trigger = screen.getByRole('button')
  expect(trigger.getAttribute('aria-haspopup')).toBe('listbox')
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  fireEvent.click(trigger)
  expect(trigger.getAttribute('aria-expanded')).toBe('true')
  expect((screen.getByRole('checkbox', { name: 'Alpha' }) as HTMLInputElement).checked).toBe(true)
  fireEvent.click(screen.getByRole('checkbox', { name: 'Beta' }))
  expect(onChange).toHaveBeenLastCalledWith(['a', 'b'])
  expect((screen.getByRole('checkbox', { name: 'Alpha' }) as HTMLInputElement).checked).toBe(true)
  expect((screen.getByRole('checkbox', { name: 'Beta' }) as HTMLInputElement).checked).toBe(false)
  fireEvent.keyDown(document.querySelector('.kvzd-design-select__popup')!, { key: 'Escape' })
  expect(screen.queryByRole('listbox')).toBeNull()
})

test('select multiple showSearch filters options case-insensitively', () => {
  render(<Select label="Pick" multiple showSearch options={options} />)
  fireEvent.click(screen.getByRole('button'))
  fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'ALP' } })
  expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeTruthy()
  expect(screen.queryByRole('checkbox', { name: 'Beta' })).toBeNull()
  expect(screen.queryByRole('checkbox', { name: 'Gamma' })).toBeNull()
})

test('select multiple shows a loading state in the popup and trigger', () => {
  render(<Select label="Pick" multiple loading options={options} />)
  fireEvent.click(screen.getByRole('button'))
  expect(screen.getByText('Loading…')).toBeTruthy()
  expect(document.querySelector('.kvzd-design-select__spinner .kvzd-design-spinner')).toBeTruthy()
})

test('select multiple closes when clicking outside', () => {
  render(<Select label="Pick" multiple options={options} />)
  fireEvent.click(screen.getByRole('button'))
  expect(screen.getByRole('listbox')).toBeTruthy()
  fireEvent.pointerDown(document.body)
  expect(screen.queryByRole('listbox')).toBeNull()
})

test('select single still renders a native select', () => {
  render(<Select label="Pick" options={options} placeholder="Choose" />)
  const select = document.querySelector('select') as HTMLSelectElement
  expect(select.className).toContain('govuk-select')
  expect(screen.queryByRole('button')).toBeNull()
})

test('textarea autoSize sets the height from the minimum rows', () => {
  render(<Textarea label="Details" autoSize />)
  const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
  expect(textarea.className).toContain('kvzd-design-textarea--autosize')
  expect(textarea.style.height).toBe('100px')
})

test('textarea autoSize honours minRows and maxRows', () => {
  render(<Textarea label="Details" autoSize={{ minRows: 2, maxRows: 4 }} />)
  const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
  expect(textarea.style.height).toBe('40px')
  expect(textarea.rows).toBe(2)
})
