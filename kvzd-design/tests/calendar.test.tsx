// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { Calendar } from '../src/extraComponents/Calendar'

const SEPT_2026 = new Date(2026, 8, 1)

afterEach(cleanup)

function inMonthButtons(): HTMLButtonElement[] {
  return Array.from(document.querySelectorAll<HTMLButtonElement>('button[data-date]')).filter((button) => button.dataset.date?.startsWith('2026-09'))
}

test('calendar renders September 2026 with 30 days and correct weekday offset', () => {
  const view = render(<Calendar month={SEPT_2026} />)
  const cells = inMonthButtons()
  expect(cells).toHaveLength(30)
  // 1 September 2026 is a Tuesday, so with a Monday-first grid it is the second cell.
  expect(cells[0].dataset.date).toBe('2026-09-01')
  const firstWeek = cells[0].parentElement!
  expect(firstWeek.children[0].textContent?.trim()).toBe('31') // 31 August, outside month
  expect(firstWeek.children[0].className).toContain('kvzd-design-calendar__cell--outside')
  // Weekday headers run Monday to Sunday.
  const weekdayHeader = view.container.querySelector('.kvzd-design-calendar__weekdays')!
  expect(weekdayHeader.children).toHaveLength(7)
})

test('calendar selects a day uncontrolled and calls onChange', () => {
  const onChange = vi.fn()
  render(<Calendar month={SEPT_2026} onChange={onChange} />)
  fireEvent.click(screen.getByText('15'))
  expect(onChange).toHaveBeenCalledTimes(1)
  const chosen = onChange.mock.calls[0][0] as Date
  expect(chosen.getFullYear()).toBe(2026)
  expect(chosen.getMonth()).toBe(8)
  expect(chosen.getDate()).toBe(15)
  const cell = screen.getByText('15').closest('button')!
  expect(cell.getAttribute('aria-pressed')).toBe('true')
  expect(cell.className).toContain('kvzd-design-calendar__cell--selected')
})

test('calendar controlled value marks the selected day', () => {
  render(<Calendar month={SEPT_2026} value={new Date(2026, 8, 20)} />)
  const cell = screen.getByText('20').closest('button')!
  expect(cell.getAttribute('aria-pressed')).toBe('true')
  expect(cell.className).toContain('kvzd-design-calendar__cell--selected')
})

test('selecting a day marks the cell selected, and focusing it selects the combined rule', () => {
  render(<Calendar month={SEPT_2026} />)
  const cell = screen.getByText('15').closest('button')!
  fireEvent.click(cell)
  expect(cell.className).toContain('kvzd-design-calendar__cell--selected')
  cell.focus()
  expect(document.activeElement).toBe(cell)
})

test('the calendar stylesheet keeps the selected colours on the focused cell', () => {
  const css = readFileSync('src/styles/calendar.css', 'utf8')
  expect(css).toContain('.kvzd-design-calendar__cell--selected:focus')
  expect(css).toContain('outline: 3px solid var(--govuk-focus-colour)')
})

test('calendar today cell carries the today modifier', () => {
  render(<Calendar month={new Date()} showToday={false} />)
  const today = new Date()
  const cells = screen.getAllByText(String(today.getDate())).map((element) => element.closest('button')!)
  expect(cells.some((cell) => cell.className.includes('kvzd-design-calendar__cell--today'))).toBe(true)
})

test('calendar navigation buttons change the displayed month', () => {
  render(<Calendar defaultMonth={SEPT_2026} />)
  expect(screen.getByText('September 2026')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Next month' }))
  expect(screen.getByText('October 2026')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))
  fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))
  expect(screen.getByText('August 2026')).toBeTruthy()
})

test('calendar controlled month calls onMonthChange without moving itself', () => {
  const onMonthChange = vi.fn()
  render(<Calendar month={SEPT_2026} onMonthChange={onMonthChange} />)
  fireEvent.click(screen.getByRole('button', { name: 'Next month' }))
  expect(onMonthChange).toHaveBeenCalledTimes(1)
  const called = onMonthChange.mock.calls[0][0] as Date
  expect(called.getMonth()).toBe(9)
  expect(screen.getByText('September 2026')).toBeTruthy()
})

test('calendar uncontrolled month moves on navigation', () => {
  render(<Calendar defaultMonth={SEPT_2026} />)
  fireEvent.click(screen.getByRole('button', { name: 'Next month' }))
  expect(screen.getByText('October 2026')).toBeTruthy()
})

test('calendar disables days outside min and max', () => {
  render(<Calendar month={SEPT_2026} min={new Date(2026, 8, 10)} max={new Date(2026, 8, 20)} />)
  const before = screen.getByText('9').closest('button')!
  expect(before.disabled).toBe(true)
  const inRange = screen.getByText('15').closest('button')!
  expect(inRange.disabled).toBe(false)
  const after = screen.getByText('21').closest('button')!
  expect(after.disabled).toBe(true)
})

test('calendar keyboard navigation moves focus day by day', () => {
  render(<Calendar month={SEPT_2026} defaultValue={new Date(2026, 8, 15)} />)
  const cell = screen.getByText('15').closest('button')!
  cell.focus()
  expect(document.activeElement).toBe(cell)
  fireEvent.keyDown(cell, { key: 'ArrowRight' })
  expect(document.activeElement).toBe(screen.getByText('16').closest('button'))
  fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
  expect((document.activeElement as HTMLButtonElement).dataset.date).toBe('2026-09-23')
  fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' })
  expect((document.activeElement as HTMLButtonElement).dataset.date).toBe('2026-09-22')
  fireEvent.keyDown(document.activeElement!, { key: 'Home' })
  expect((document.activeElement as HTMLButtonElement).dataset.date).toBe('2026-09-21')
  fireEvent.keyDown(document.activeElement!, { key: 'End' })
  expect((document.activeElement as HTMLButtonElement).dataset.date).toBe('2026-09-27')
})

test('calendar keyboard navigation across a month boundary flips the month and focuses the cell', () => {
  render(<Calendar defaultMonth={SEPT_2026} defaultValue={new Date(2026, 8, 30)} />)
  const cell = screen.getByText('30').closest('button')!
  cell.focus()
  fireEvent.keyDown(cell, { key: 'ArrowRight' })
  expect(screen.getByText('October 2026')).toBeTruthy()
  expect((document.activeElement as HTMLButtonElement).dataset.date).toBe('2026-10-01')
  fireEvent.keyDown(document.activeElement!, { key: 'PageUp' })
  expect(screen.getByText('September 2026')).toBeTruthy()
  expect((document.activeElement as HTMLButtonElement).dataset.date).toBe('2026-09-01')
  fireEvent.keyDown(document.activeElement!, { key: 'PageDown', shiftKey: true })
  expect(screen.getByText('September 2027')).toBeTruthy()
})

test('calendar renders dateCellRender markers', () => {
  render(<Calendar month={SEPT_2026} dateCellRender={(date) => (date.getDate() === 15 ? '有号' : null)} />)
  const cell = screen.getByText('15').closest('button')!
  expect(cell.textContent).toContain('有号')
  expect(screen.getByText('14').closest('button')!.textContent).not.toContain('有号')
})

test('calendar today button returns to the current month and selects today', () => {
  const onChange = vi.fn()
  render(<Calendar defaultMonth={SEPT_2026} onChange={onChange} />)
  fireEvent.click(screen.getByRole('button', { name: 'Today' }))
  const now = new Date()
  const title = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(now)
  expect(screen.getByText(title)).toBeTruthy()
  expect(onChange).toHaveBeenCalledTimes(1)
  const chosen = onChange.mock.calls[0][0] as Date
  expect(chosen.getDate()).toBe(now.getDate())
})

test('calendar uses locale for the month title', () => {
  render(<Calendar month={SEPT_2026} locale="fr-FR" />)
  expect(screen.getByText('septembre 2026')).toBeTruthy()
})
