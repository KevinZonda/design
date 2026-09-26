// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { Progress } from '../src/extraComponents'

afterEach(cleanup)

const getBar = () => screen.getByRole('progressbar')

test('progress renders role and aria values', () => {
  render(<Progress percent={45} />)
  const bar = getBar()
  expect(bar.getAttribute('aria-valuemin')).toBe('0')
  expect(bar.getAttribute('aria-valuemax')).toBe('100')
  expect(bar.getAttribute('aria-valuenow')).toBe('45')
  expect(bar.style.width).toBe('45%')
})

test('progress clamps out-of-range values', () => {
  const view = render(<Progress percent={150} />)
  expect(getBar().getAttribute('aria-valuenow')).toBe('100')
  expect(getBar().style.width).toBe('100%')
  view.rerender(<Progress percent={-10} />)
  expect(getBar().getAttribute('aria-valuenow')).toBe('0')
  expect(getBar().style.width).toBe('0%')
})

test('progress percent 100 becomes success automatically', () => {
  render(<Progress percent={100} />)
  expect(getBar().closest('.kvzd-design-progress')!.className).toContain('kvzd-design-progress--success')
})

test('progress explicit status class applies below 100', () => {
  render(<Progress percent={30} status="exception" />)
  expect(getBar().closest('.kvzd-design-progress')!.className).toContain('kvzd-design-progress--exception')
})

test('progress shows percent text by default and hides with showInfo', () => {
  const view = render(<Progress percent={45} />)
  expect(screen.getByText('45%')).toBeTruthy()
  view.rerender(<Progress percent={45} showInfo={false} />)
  expect(screen.queryByText('45%')).toBeNull()
})

test('progress color overrides bar background', () => {
  render(<Progress percent={50} color="#ff00ff" />)
  expect(getBar().style.backgroundColor).toContain('rgb(255, 0, 255)')
})

test('progress accepts trailColor and strokeWidth', () => {
  render(<Progress percent={50} strokeWidth={12} />)
  expect(getBar().style.height).toBe('12px')
  const { container } = render(<Progress type="circle" percent={50} trailColor="#eeeeee" strokeWidth={10} />)
  const track = container.querySelector('.kvzd-design-progress__track') as SVGCircleElement
  expect(track.getAttribute('stroke')).toBe('#eeeeee')
  expect(track.getAttribute('stroke-width')).toBe('10')
})
