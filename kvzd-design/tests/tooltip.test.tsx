// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { Tooltip } from '../src/extraComponents'

afterEach(cleanup)

test('tooltip opens on hover and closes on leave', () => {
  render(<Tooltip title="Helpful text"><button type="button">Trigger</button></Tooltip>)
  const trigger = screen.getByRole('button', { name: 'Trigger' })
  expect(screen.queryByRole('tooltip')).toBeNull()

  fireEvent.mouseEnter(trigger)
  const popup = screen.getByRole('tooltip')
  expect(popup.textContent).toContain('Helpful text')
  expect(trigger.getAttribute('aria-describedby')).toBe(popup.id)

  fireEvent.mouseLeave(trigger)
  expect(screen.queryByRole('tooltip')).toBeNull()
  expect(trigger.getAttribute('aria-describedby')).toBeNull()
})

test('tooltip opens on focus and applies placement class', () => {
  render(<Tooltip title="Tip" placement="bottom"><button type="button">Trigger</button></Tooltip>)
  const trigger = screen.getByRole('button', { name: 'Trigger' })
  fireEvent.focus(trigger)
  expect(screen.getByRole('tooltip').className).toContain('kvzd-design-tooltip--bottom')
  fireEvent.blur(trigger)
  expect(screen.queryByRole('tooltip')).toBeNull()
})

test('click trigger toggles the tooltip', () => {
  render(<Tooltip title="Tip" trigger="click"><button type="button">Trigger</button></Tooltip>)
  const trigger = screen.getByRole('button', { name: 'Trigger' })
  fireEvent.click(trigger)
  expect(screen.getByRole('tooltip')).toBeTruthy()
  fireEvent.click(trigger)
  expect(screen.queryByRole('tooltip')).toBeNull()
})

test('controlled open follows the open prop and reports changes', () => {
  const onOpenChange = vi.fn()
  const view = render(<Tooltip title="Tip" open={false} onOpenChange={onOpenChange}><button type="button">Trigger</button></Tooltip>)
  const trigger = screen.getByRole('button', { name: 'Trigger' })
  fireEvent.mouseEnter(trigger)
  expect(onOpenChange).toHaveBeenLastCalledWith(true)
  expect(screen.queryByRole('tooltip')).toBeNull()

  view.rerender(<Tooltip title="Tip" open onOpenChange={onOpenChange}><button type="button">Trigger</button></Tooltip>)
  expect(screen.getByRole('tooltip')).toBeTruthy()
})

test('tooltip renders an arrow and wraps a single child', () => {
  render(<Tooltip title="Tip"><span>Trigger</span></Tooltip>)
  fireEvent.mouseEnter(screen.getByText('Trigger'))
  expect(screen.getByRole('tooltip').querySelector('.kvzd-design-tooltip__arrow')).toBeTruthy()
})

test('tooltip chains the child original handlers and keeps its aria-describedby when closed', () => {
  const onMouseEnter = vi.fn()
  const onMouseLeave = vi.fn()
  render(<Tooltip title="Tip"><button type="button" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} aria-describedby="own-desc">Trigger</button></Tooltip>)
  const trigger = screen.getByRole('button', { name: 'Trigger' })
  expect(trigger.getAttribute('aria-describedby')).toBe('own-desc')
  fireEvent.mouseEnter(trigger)
  expect(onMouseEnter).toHaveBeenCalledOnce()
  expect(trigger.getAttribute('aria-describedby')).toBe(screen.getByRole('tooltip').id)
  fireEvent.mouseLeave(trigger)
  expect(onMouseLeave).toHaveBeenCalledOnce()
  expect(trigger.getAttribute('aria-describedby')).toBe('own-desc')
})
