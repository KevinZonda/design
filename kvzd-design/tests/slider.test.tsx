// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { Slider } from '../src/extraComponents/Slider'

afterEach(cleanup)

test('uncontrolled single slider updates and calls onChange', () => {
  const onChange = vi.fn()
  render(<Slider ariaLabel="Volume" onChange={onChange} />)
  const slider = screen.getByRole('slider')
  expect(slider).toHaveProperty('value', '0')

  fireEvent.change(slider, { target: { value: '40' } })
  expect(onChange).toHaveBeenLastCalledWith(40)
  expect(slider).toHaveProperty('value', '40')
  expect(slider.getAttribute('min')).toBe('0')
  expect(slider.getAttribute('max')).toBe('100')
})

test('controlled single slider follows value and still calls onChange', () => {
  const onChange = vi.fn()
  const view = render(<Slider ariaLabel="Volume" value={30} onChange={onChange} />)
  const slider = screen.getByRole('slider')
  expect(slider).toHaveProperty('value', '30')

  fireEvent.change(slider, { target: { value: '55' } })
  expect(onChange).toHaveBeenLastCalledWith(55)
  expect(slider).toHaveProperty('value', '30')

  view.rerender(<Slider ariaLabel="Volume" value={55} onChange={onChange} />)
  expect(slider).toHaveProperty('value', '55')
})

test('single slider honours defaultValue, min, max and step', () => {
  render(<Slider ariaLabel="Price" min={10} max={50} step={5} defaultValue={20} />)
  const slider = screen.getByRole('slider')
  expect(slider).toHaveProperty('value', '20')
  expect(slider.getAttribute('min')).toBe('10')
  expect(slider.getAttribute('max')).toBe('50')
  expect(slider.getAttribute('step')).toBe('5')
})

test('range slider composes [lo, hi] from both handles', () => {
  const onChange = vi.fn()
  render(<Slider ariaLabel="Price" range defaultValue={[20, 60]} onChange={onChange} />)
  const [lower, upper] = screen.getAllByRole('slider')
  expect(lower).toHaveProperty('value', '20')
  expect(upper).toHaveProperty('value', '60')
  expect(lower.getAttribute('aria-label')).toBe('Price minimum')
  expect(upper.getAttribute('aria-label')).toBe('Price maximum')

  fireEvent.change(lower, { target: { value: '35' } })
  expect(onChange).toHaveBeenLastCalledWith([35, 60])
  expect(lower).toHaveProperty('value', '35')

  fireEvent.change(upper, { target: { value: '80' } })
  expect(onChange).toHaveBeenLastCalledWith([35, 80])
  expect(upper).toHaveProperty('value', '80')
})

test('range handles never cross: lower clamps to upper and upper to lower', () => {
  const onChange = vi.fn()
  render(<Slider ariaLabel="Price" range defaultValue={[20, 60]} onChange={onChange} />)
  const [lower, upper] = screen.getAllByRole('slider')

  fireEvent.change(lower, { target: { value: '90' } })
  expect(onChange).toHaveBeenLastCalledWith([60, 60])
  expect(lower).toHaveProperty('value', '60')

  fireEvent.change(upper, { target: { value: '10' } })
  expect(onChange).toHaveBeenLastCalledWith([60, 60])
  expect(upper).toHaveProperty('value', '60')
})

test('controlled range slider emits constrained pair without self-updating', () => {
  const onChange = vi.fn()
  const view = render(<Slider ariaLabel="Price" range value={[20, 80]} onChange={onChange} />)
  const [lower] = screen.getAllByRole('slider')
  fireEvent.change(lower, { target: { value: '95' } })
  expect(onChange).toHaveBeenLastCalledWith([80, 80])
  expect(lower).toHaveProperty('value', '20')

  view.rerender(<Slider ariaLabel="Price" range value={[40, 90]} onChange={onChange} />)
  const handles = screen.getAllByRole('slider')
  expect(handles[0]).toHaveProperty('value', '40')
  expect(handles[1]).toHaveProperty('value', '90')
})

test('range handles expose the full min/max so positions match the fill', () => {
  render(<Slider ariaLabel="Price" range min={10} max={90} defaultValue={[30, 70]} />)
  const [lower, upper] = screen.getAllByRole('slider')
  expect(lower.getAttribute('min')).toBe('10')
  expect(lower.getAttribute('max')).toBe('90')
  expect(upper.getAttribute('min')).toBe('10')
  expect(upper.getAttribute('max')).toBe('90')
})

test('marks render dots and labels positioned on the track', () => {
  render(<Slider ariaLabel="Volume" defaultValue={0} marks={[{ value: 0, label: '0' }, { value: 50, label: '50' }, { value: 100, label: '100' }, { value: 200, label: 'out' }]} />)
  const marks = document.querySelector('.kvzd-design-slider__marks') as HTMLElement
  expect(marks.textContent).toContain('0')
  expect(marks.textContent).toContain('50')
  expect(marks.textContent).toContain('100')
  expect(marks.textContent).not.toContain('out')
  expect(document.querySelectorAll('.kvzd-design-slider__mark')).toHaveLength(3)
  expect(document.querySelectorAll('.kvzd-design-slider__mark-dot')).toHaveLength(3)
})

test('disabled slider renders disabled inputs', () => {
  render(<Slider ariaLabel="Volume" disabled defaultValue={40} />)
  expect(screen.getByRole('slider')).toHaveProperty('disabled', true)
  render(<Slider ariaLabel="Range" range disabled />)
  const handles = screen.getAllByRole('slider')
  expect(handles[0]).toHaveProperty('disabled', true)
  expect(handles[1]).toHaveProperty('disabled', true)
})

test('tooltip shows current value without a live region', () => {
  const { unmount, container } = render(<Slider ariaLabel="Volume" defaultValue={40} tooltip="always" />)
  const bubble = container.querySelector('.kvzd-design-slider__tooltip') as HTMLElement
  expect(bubble.textContent).toBe('40')
  expect(bubble.getAttribute('aria-hidden')).toBe('true')
  expect(screen.queryByRole('status')).toBeNull()

  unmount()
  render(<Slider ariaLabel="Volume" defaultValue={40} tooltip="never" />)
  expect(document.querySelector('.kvzd-design-slider__tooltip')).toBeNull()
})

test('range tooltip renders both values and raises one when handles are close', () => {
  const { container } = render(<Slider ariaLabel="Price" range defaultValue={[48, 52]} tooltip="always" />)
  const bubbles = Array.from(container.querySelectorAll('.kvzd-design-slider__tooltip'))
  expect(bubbles.map((b) => b.textContent)).toEqual(['48', '52'])
  expect(bubbles[1].className).toContain('kvzd-design-slider__tooltip--raised')
})

test('slider submits under name, with -lower/-upper suffixes in range mode', () => {
  render(<Slider ariaLabel="Volume" name="volume" defaultValue={40} />)
  expect(screen.getByRole('slider')).toHaveProperty('name', 'volume')

  render(<Slider ariaLabel="Range" range name="price" defaultValue={[20, 60]} />)
  const [lower, upper] = screen.getAllByRole('slider', { name: /Range/ })
  expect(lower).toHaveProperty('name', 'price-lower')
  expect(upper).toHaveProperty('name', 'price-upper')
})

test('fill slot accepts classNames and styles overrides', () => {
  const { container } = render(
    <Slider
      ariaLabel="Volume"
      defaultValue={40}
      classNames={{ fill: 'my-fill' }}
      styles={{ fill: { background: 'red' } }}
    />
  )
  const fill = container.querySelector('.kvzd-design-slider__fill') as HTMLElement
  expect(fill.className).toContain('my-fill')
  expect(fill.style.background).toBe('red')
})

test('slider exposes native range keyboard and aria value attributes', () => {
  render(<Slider ariaLabel="Volume" min={0} max={10} defaultValue={5} />)
  const slider = screen.getByRole('slider', { name: 'Volume' })
  expect(slider.getAttribute('type')).toBe('range')
  expect(slider.getAttribute('min')).toBe('0')
  expect(slider.getAttribute('max')).toBe('10')
  expect(slider).toHaveProperty('value', '5')
})

test('handle gets a pressed class while the pointer is down', () => {
  render(<Slider ariaLabel="Volume" defaultValue={40} />)
  const slider = screen.getByRole('slider', { name: 'Volume' })

  fireEvent.pointerDown(slider)
  expect(slider.className).toContain('kvzd-design-slider__input--pressed')

  fireEvent.pointerUp(slider)
  expect(slider.className).not.toContain('kvzd-design-slider__input--pressed')
})
