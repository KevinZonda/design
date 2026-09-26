// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { Transfer } from '../src/extraComponents/Transfer'

const DATA = [
  { key: 'apple', label: 'Apple', description: 'A fruit' },
  { key: 'carrot', label: 'Carrot', description: 'A vegetable' },
  { key: 'desk', label: 'Desk', disabled: true },
  { key: 'egg', label: 'Egg' },
]

afterEach(cleanup)

function panel(direction: 'left' | 'right'): HTMLElement {
  return document.querySelector(`.kvzd-design-transfer__panel--${direction}`)!
}

test('transfer renders both panels with titles and splits items', () => {
  render(<Transfer dataSource={DATA} defaultTargetKeys={['egg']} />)
  expect(panel('left').textContent).toContain('Source')
  expect(panel('right').textContent).toContain('Target')
  expect(panel('left').textContent).toContain('Apple')
  expect(panel('left').textContent).not.toContain('Egg')
  expect(panel('right').textContent).toContain('Egg')
  expect(panel('left').textContent).toContain('3 items')
  expect(panel('right').textContent).toContain('1 item')
})

test('transfer moves selected items right and reports direction and movedKeys', () => {
  const onChange = vi.fn()
  render(<Transfer dataSource={DATA} defaultTargetKeys={['egg']} onChange={onChange} />)
  fireEvent.click(screen.getByLabelText(/Apple/))
  fireEvent.click(screen.getByLabelText(/Carrot/))
  const add = screen.getByRole('button', { name: 'Add selected items to the target list' })
  expect(add.disabled).toBe(false)
  fireEvent.click(add)
  expect(onChange).toHaveBeenCalledTimes(1)
  const [keys, direction, moved] = onChange.mock.calls[0]
  expect(direction).toBe('right')
  expect(moved).toEqual(['apple', 'carrot'])
  expect(keys).toEqual(['egg', 'apple', 'carrot'])
  // Uncontrolled: items moved across panels and selection was cleared.
  expect(panel('right').textContent).toContain('Apple')
  expect(panel('left').textContent).not.toContain('Apple')
  expect((screen.getByLabelText(/Apple/) as HTMLInputElement).checked).toBe(false)
})

test('transfer moves selected items left with direction left', () => {
  const onChange = vi.fn()
  render(<Transfer dataSource={DATA} defaultTargetKeys={['egg', 'desk']} onChange={onChange} />)
  fireEvent.click(screen.getByLabelText('Egg'))
  fireEvent.click(screen.getByRole('button', { name: 'Remove selected items from the target list' }))
  const [keys, direction, moved] = onChange.mock.calls[0]
  expect(direction).toBe('left')
  expect(moved).toEqual(['egg'])
  expect(keys).toEqual(['desk'])
})

test('transfer respects controlled targetKeys', () => {
  const onChange = vi.fn()
  render(<Transfer dataSource={DATA} targetKeys={[]} onChange={onChange} />)
  fireEvent.click(screen.getByLabelText(/Apple/))
  fireEvent.click(screen.getByRole('button', { name: 'Add selected items to the target list' }))
  expect(onChange).toHaveBeenCalledTimes(1)
  // Controlled: panel contents do not change until the parent updates targetKeys.
  expect(panel('right').textContent).not.toContain('Apple')
})

test('transfer skips disabled items when moving', () => {
  const onChange = vi.fn()
  render(<Transfer dataSource={DATA} defaultTargetKeys={[]} onChange={onChange} />)
  // Disabled items cannot be checked at all.
  expect((screen.getByLabelText(/Desk/) as HTMLInputElement).disabled).toBe(true)
  fireEvent.click(screen.getByLabelText(/Apple/))
  fireEvent.click(screen.getByRole('button', { name: 'Add selected items to the target list' }))
  const [keys, , moved] = onChange.mock.calls[0]
  expect(moved).toEqual(['apple'])
  expect(keys).toEqual(['apple'])
})

test('transfer add button is disabled when nothing movable is selected', () => {
  render(<Transfer dataSource={DATA} />)
  const add = screen.getByRole('button', { name: 'Add selected items to the target list' })
  expect(add.disabled).toBe(true)
  expect(screen.getByRole('button', { name: 'Remove selected items from the target list' }).disabled).toBe(true)
})

test('transfer search filters the source list by label', () => {
  render(<Transfer dataSource={DATA} showSearch />)
  const search = panel('left').querySelector('input')!
  fireEvent.change(search, { target: { value: 'car' } })
  expect(panel('left').textContent).toContain('Carrot')
  expect(panel('left').textContent).not.toContain('Apple')
  fireEvent.change(search, { target: { value: 'zzz' } })
  expect(panel('left').textContent).toContain('No matches')
})

test('transfer honours a custom filterOption', () => {
  render(<Transfer dataSource={DATA} showSearch filterOption={(input, item) => item.description === input} />)
  const search = panel('left').querySelector('input')!
  fireEvent.change(search, { target: { value: 'A vegetable' } })
  expect(panel('left').textContent).toContain('Carrot')
  expect(panel('left').textContent).not.toContain('Apple')
})

test('transfer shows a no-data hint for an empty list', () => {
  render(<Transfer dataSource={DATA} defaultTargetKeys={['apple', 'carrot', 'desk', 'egg']} />)
  expect(panel('left').textContent).toContain('No data')
  expect(panel('left').querySelector('ul')).toBeNull()
})

test('transfer onSelectChange reports the panel direction', () => {
  const onSelectChange = vi.fn()
  render(<Transfer dataSource={DATA} onSelectChange={onSelectChange} />)
  fireEvent.click(screen.getByLabelText(/Apple/))
  expect(onSelectChange).toHaveBeenLastCalledWith(['apple'], 'left')
})

test('transfer uses custom titles and operations', () => {
  render(<Transfer dataSource={DATA} titles={['Available', 'Chosen']} operations={['To target', 'To source']} />)
  expect(panel('left').textContent).toContain('Available')
  expect(panel('right').textContent).toContain('Chosen')
  expect(screen.getByRole('button', { name: 'Add selected items to the target list' }).textContent).toBe('To target')
  expect(screen.getByRole('button', { name: 'Remove selected items from the target list' }).textContent).toBe('To source')
})

test('transfer move buttons carry direction icons and colour variants', () => {
  render(<Transfer dataSource={DATA} />)
  const add = screen.getByRole('button', { name: 'Add selected items to the target list' })
  const remove = screen.getByRole('button', { name: 'Remove selected items from the target list' })
  expect(add.classList.contains('govuk-button--warning')).toBe(false)
  expect(remove.classList.contains('govuk-button--warning')).toBe(true)
  const icons = document.querySelectorAll('.kvzd-design-transfer__operation-icon')
  expect(icons).toHaveLength(2)
  expect(icons[0].querySelector('path')!.getAttribute('d')).toBe('M0 0l8 6-8 6z')
  expect(icons[1].querySelector('path')!.getAttribute('d')).toBe('M8 0L0 6l8 6z')
})

test('transfer disabled disables checkboxes and move buttons', () => {
  render(<Transfer dataSource={DATA} disabled />)
  expect((screen.getByLabelText(/Apple/) as HTMLInputElement).disabled).toBe(true)
  expect(screen.getByRole('button', { name: 'Add selected items to the target list' }).disabled).toBe(true)
  expect(screen.getByRole('button', { name: 'Remove selected items from the target list' }).disabled).toBe(true)
})
