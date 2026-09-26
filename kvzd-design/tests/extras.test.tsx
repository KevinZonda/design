// @vitest-environment jsdom
import { act } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { Tabs, Tag } from '../src/components'
import { Dropdown, FancyTabs, Loading, Menu } from '../src/extraComponents'

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: true,
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  })
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

test('loading stays hidden inside its delay and appears when it elapses', () => {
  vi.useFakeTimers()
  render(<Loading delay={500} />)
  expect(screen.queryByRole('status')).toBeNull()
  act(() => vi.advanceTimersByTime(499))
  expect(screen.queryByRole('status')).toBeNull()
  act(() => vi.advanceTimersByTime(1))
  expect(screen.getByRole('status')).toBeTruthy()
})

test('loading renders fullscreen overlay class', () => {
  render(<Loading fullscreen />)
  expect(document.querySelector('.kvzd-design-loading--fullscreen')).toBeTruthy()
})

test('closable tag calls onClose without propagating the click', () => {
  const onClose = vi.fn()
  const onParent = vi.fn()
  render(<div onClick={onParent}><Tag closable onClose={onClose}>Active</Tag></div>)
  fireEvent.click(screen.getByRole('button', { name: 'Close' }))
  expect(onClose).toHaveBeenCalledOnce()
  expect(onParent).not.toHaveBeenCalled()
})

test('tabs skip disabled items and do not activate them', () => {
  const onChange = vi.fn()
  render(<Tabs items={[
    { key: 'a', label: 'Tab A', children: 'Panel A' },
    { key: 'b', label: 'Tab B', children: 'Panel B', disabled: true },
    { key: 'c', label: 'Tab C', children: 'Panel C' },
  ]} onChange={onChange} />)
  const tabB = screen.getByRole('tab', { name: 'Tab B' })
  expect(tabB.getAttribute('aria-disabled')).toBe('true')
  fireEvent.click(tabB)
  expect(onChange).not.toHaveBeenCalled()
})

test('tabs with destroyOnClose do not render inactive panels', () => {
  render(<Tabs destroyOnClose items={[
    { key: 'a', label: 'Tab A', children: <p>Panel A content</p> },
    { key: 'b', label: 'Tab B', children: <p>Panel B content</p> },
  ]} />)
  expect(screen.getByText('Panel A content')).toBeTruthy()
  expect(screen.queryByText('Panel B content')).toBeNull()
  fireEvent.click(screen.getByRole('tab', { name: 'Tab B' }))
  expect(screen.getByText('Panel B content')).toBeTruthy()
  expect(screen.queryByText('Panel A content')).toBeNull()
})

test('fancy tabs skip disabled items and destroy inactive panels on demand', () => {
  const onChange = vi.fn()
  render(<FancyTabs destroyOnClose items={[
    { key: 'a', label: 'Tab A', children: <p>Panel A content</p> },
    { key: 'b', label: 'Tab B', children: <p>Panel B content</p>, disabled: true },
    { key: 'c', label: 'Tab C', children: <p>Panel C content</p> },
  ]} onChange={onChange} />)
  const tabB = screen.getByRole('tab', { name: 'Tab B' })
  expect(tabB.getAttribute('aria-disabled')).toBe('true')
  fireEvent.click(tabB)
  expect(onChange).not.toHaveBeenCalled()
  fireEvent.keyDown(screen.getByRole('tab', { name: 'Tab A' }), { key: 'ArrowRight' })
  expect(onChange).toHaveBeenLastCalledWith('c')
  expect(screen.getByText('Panel C content')).toBeTruthy()
  expect(screen.queryByText('Panel B content')).toBeNull()
})

test('dropdown opens on hover and honours placement class', () => {
  render(<Dropdown trigger="hover" placement="top" label="Actions" ariaLabel="Actions" items={[{ key: 'a', label: 'Item A' }]} />)
  const root = document.querySelector('.kvzd-design-dropdown') as HTMLElement
  fireEvent.mouseEnter(root)
  expect(screen.getByRole('menu')).toBeTruthy()
  expect(document.querySelector('.kvzd-design-dropdown--top')).toBeTruthy()
  fireEvent.mouseLeave(root)
  expect(screen.queryByRole('menu')).toBeNull()
})

test('dropdown keeps click trigger and outside click dismissal', () => {
  render(<><Dropdown label="Actions" ariaLabel="Actions" items={[{ key: 'a', label: 'Item A' }]} /><button type="button">Outside</button></>)
  fireEvent.click(screen.getByRole('button', { name: /Actions/ }))
  expect(screen.getByRole('menu')).toBeTruthy()
  fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }))
  expect(screen.queryByRole('menu')).toBeNull()
})

test('menu renders danger items, icons and dividers', () => {
  render(<Menu ariaLabel="Menu" items={[
    { key: 'a', label: 'Item A', icon: <svg data-testid="icon-a" /> },
    { type: 'divider', key: 'div-1' },
    { key: 'b', label: 'Item B', danger: true },
  ]} />)
  expect(screen.getByTestId('icon-a')).toBeTruthy()
  expect(document.querySelector('.kvzd-design-menu__icon')?.getAttribute('aria-hidden')).toBe('true')
  expect(document.querySelector('.kvzd-design-menu__divider')).toBeTruthy()
  expect(document.querySelector('.kvzd-design-menu__item--danger')?.textContent).toContain('Item B')
})
