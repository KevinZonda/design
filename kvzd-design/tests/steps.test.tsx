// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { Steps } from '../src/extraComponents'

const ITEMS = [
  { key: 'a', title: 'Account' },
  { key: 'b', title: 'Details' },
  { key: 'c', title: 'Confirm' },
]

afterEach(cleanup)

test('steps marks current step with aria-current', () => {
  render(<Steps items={ITEMS} current={1} />)
  const items = screen.getAllByRole('listitem')
  expect(items).toHaveLength(3)
  expect(items[1].getAttribute('aria-current')).toBe('step')
  expect(items[0].getAttribute('aria-current')).toBeNull()
  expect(items[1].className).toContain('kvzd-design-steps__item--process')
  expect(items[0].className).toContain('kvzd-design-steps__item--finish')
  expect(items[2].className).toContain('kvzd-design-steps__item--wait')
})

test('steps clicks reachable step and calls onChange', () => {
  const onChange = vi.fn()
  render(<Steps items={ITEMS} current={0} onChange={onChange} />)
  fireEvent.click(screen.getAllByRole('listitem')[2])
  expect(onChange).toHaveBeenLastCalledWith(2)
})

test('steps disabled item does not trigger onChange', () => {
  const onChange = vi.fn()
  render(<Steps items={[...ITEMS, { key: 'd', title: 'Locked', disabled: true }]} onChange={onChange} />)
  const items = screen.getAllByRole('listitem')
  expect(items[3].className).toContain('kvzd-design-steps__item--disabled')
  fireEvent.click(items[3])
  expect(onChange).not.toHaveBeenCalled()
})

test('steps uncontrolled mode moves current on click', () => {
  const onChange = vi.fn()
  render(<Steps items={ITEMS} defaultCurrent={0} onChange={onChange} />)
  const items = screen.getAllByRole('listitem')
  expect(items[0].getAttribute('aria-current')).toBe('step')
  fireEvent.click(items[1])
  expect(onChange).toHaveBeenLastCalledWith(1)
  expect(screen.getAllByRole('listitem')[1].getAttribute('aria-current')).toBe('step')
})

test('steps controlled mode keeps current and still calls onChange', () => {
  const onChange = vi.fn()
  render(<Steps items={ITEMS} current={0} onChange={onChange} />)
  fireEvent.click(screen.getAllByRole('listitem')[2])
  expect(onChange).toHaveBeenLastCalledWith(2)
  expect(screen.getAllByRole('listitem')[0].getAttribute('aria-current')).toBe('step')
})

test('steps explicit status wins and finish icon renders', () => {
  render(<Steps items={[{ key: 'a', title: 'A' }, { key: 'b', title: 'B', status: 'error' as const }, { key: 'c', title: 'C' }]} current={2} />)
  const items = screen.getAllByRole('listitem')
  expect(items[1].className).toContain('kvzd-design-steps__item--error')
  expect(items[0].className).toContain('kvzd-design-steps__item--finish')
  expect(items[0].querySelector('svg')).toBeTruthy()
  expect(items[2].className).toContain('kvzd-design-steps__item--process')
})

test('steps renders direction and size classes', () => {
  render(<Steps items={ITEMS} direction="vertical" size="s" />)
  const list = screen.getByRole('list')
  expect(list.className).toContain('kvzd-design-steps--vertical')
  expect(list.className).toContain('kvzd-design-steps--s')
})

test('steps supports the large size', () => {
  render(<Steps items={ITEMS} size="l" />)
  expect(screen.getByRole('list').className).toContain('kvzd-design-steps--l')
})
