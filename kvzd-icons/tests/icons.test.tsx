// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CaretDownIcon,
  CaretRightIcon,
  CaretUpIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CloseIcon,
  ErrorCircleIcon,
  FilterIcon,
  InfoCircleIcon,
  LockIcon,
  PaginationArrowNextIcon,
  PaginationArrowPrevIcon,
  Result404Icon,
  Result500Icon,
  ResultErrorIcon,
  ResultInfoIcon,
  ResultSuccessIcon,
  ResultWarningIcon,
  SearchIcon,
  ServiceLogoIcon,
  SpinnerIcon,
  StartArrowIcon,
  UserIcon,
  WarningTriangleIcon,
  iconPaths,
} from '../src'

afterEach(cleanup)

const STROKE_ICONS = [
  ['SearchIcon', SearchIcon],
  ['ClockIcon', ClockIcon],
  ['CloseIcon', CloseIcon],
  ['CheckIcon', CheckIcon],
  ['ChevronLeftIcon', ChevronLeftIcon],
  ['ChevronRightIcon', ChevronRightIcon],
  ['ChevronDownIcon', ChevronDownIcon],
  ['SpinnerIcon', SpinnerIcon],
  ['UserIcon', UserIcon],
  ['ResultSuccessIcon', ResultSuccessIcon],
  ['ResultErrorIcon', ResultErrorIcon],
  ['ResultInfoIcon', ResultInfoIcon],
  ['ResultWarningIcon', ResultWarningIcon],
  ['LockIcon', LockIcon],
  ['Result404Icon', Result404Icon],
  ['Result500Icon', Result500Icon],
] as const

const FILLED_ICONS = [
  ['CaretUpIcon', CaretUpIcon],
  ['CaretDownIcon', CaretDownIcon],
  ['CaretRightIcon', CaretRightIcon],
  ['FilterIcon', FilterIcon],
  ['ArrowLeftIcon', ArrowLeftIcon],
  ['ArrowRightIcon', ArrowRightIcon],
  ['StartArrowIcon', StartArrowIcon],
  ['PaginationArrowPrevIcon', PaginationArrowPrevIcon],
  ['PaginationArrowNextIcon', PaginationArrowNextIcon],
  ['CheckCircleIcon', CheckCircleIcon],
  ['InfoCircleIcon', InfoCircleIcon],
  ['WarningTriangleIcon', WarningTriangleIcon],
  ['ErrorCircleIcon', ErrorCircleIcon],
  ['ServiceLogoIcon', ServiceLogoIcon],
] as const

test.each([...STROKE_ICONS, ...FILLED_ICONS])('%s renders an svg with the 24 grid viewBox', (_name, Icon) => {
  const { container } = render(<Icon />)
  const svg = container.querySelector('svg')
  expect(svg).not.toBeNull()
  expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24')
  expect(svg?.getAttribute('aria-hidden')).toBe('true')
})

test.each(STROKE_ICONS)('%s uses stroke="currentColor" with round caps', (_name, Icon) => {
  const { container } = render(<Icon />)
  const svg = container.querySelector('svg')!
  expect(svg.getAttribute('stroke')).toBe('currentColor')
  expect(svg.getAttribute('fill')).toBe('none')
  expect(svg.getAttribute('stroke-linecap')).toBe('round')
  expect(svg.getAttribute('stroke-linejoin')).toBe('round')
})

test('core stroke icons default to stroke-width 2', () => {
  for (const [name, Icon] of STROKE_ICONS.slice(0, 9)) {
    const { container, unmount } = render(<Icon />)
    expect(container.querySelector('svg')!.getAttribute('stroke-width'), name).toBe('2')
    unmount()
  }
})

test.each(FILLED_ICONS)('%s uses fill="currentColor"', (_name, Icon) => {
  const { container } = render(<Icon />)
  const svg = container.querySelector('svg')!
  expect(svg.getAttribute('fill')).toBe('currentColor')
})

test('size prop maps to width and height', () => {
  const { container, rerender } = render(<SearchIcon size={20} />)
  const svg = () => container.querySelector('svg')!
  expect(svg().getAttribute('width')).toBe('20')
  expect(svg().getAttribute('height')).toBe('20')
  rerender(<SearchIcon size="2rem" />)
  expect(svg().getAttribute('width')).toBe('2rem')
})

test('strokeWidth prop overrides the default on stroke icons', () => {
  const { container } = render(<SearchIcon strokeWidth={3} />)
  expect(container.querySelector('svg')!.getAttribute('stroke-width')).toBe('3')
})

test('result icons default to the lighter 1.5 stroke', () => {
  const { container } = render(<ResultSuccessIcon />)
  expect(container.querySelector('svg')!.getAttribute('stroke-width')).toBe('1.5')
})

test('rest props spread onto the svg', () => {
  const { container } = render(<SearchIcon className="extra" data-testid="search-icon" role="img" />)
  const svg = container.querySelector('svg')!
  expect(svg.classList.contains('extra')).toBe(true)
  expect(svg.getAttribute('aria-hidden')).toBe('true')
})

test('spinner renders a low-opacity track and a quarter arc', () => {
  const { container } = render(<SpinnerIcon />)
  const track = container.querySelector('circle')!
  expect(track.getAttribute('opacity')).toBe('0.25')
  expect(container.querySelector('path')!.getAttribute('d')).toContain('a9 9 0 0 0-9-9')
})

test('filled status icons knock the glyph out with evenodd', () => {
  const { container } = render(<CheckCircleIcon />)
  expect(container.querySelector('path')!.getAttribute('fill-rule')).toBe('evenodd')
})

test('iconPaths covers all 30 icons with matching metadata', () => {
  const components = [...STROKE_ICONS, ...FILLED_ICONS].map(([name]) => name)
  expect(components).toHaveLength(30)
  expect(Object.keys(iconPaths)).toHaveLength(30)
  for (const [name] of [...STROKE_ICONS, ...FILLED_ICONS]) {
    const key = name.slice(0, -'Icon'.length).replace(/^[A-Z]/, (c) => c.toLowerCase())
    const entry = iconPaths[key]
    expect(entry, name).toBeDefined()
    expect(entry.viewBox).toBe('0 0 24 24')
    expect(entry.body.length).toBeGreaterThan(0)
    expect(entry.filled).toBe(FILLED_ICONS.some(([n]) => n === name))
  }
})
