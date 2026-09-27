// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BellIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ClearCircleIcon,
  ClockIcon,
  CloseIcon,
  CopyIcon,
  DeleteIcon,
  DownloadIcon,
  DragIcon,
  EditIcon,
  ErrorCircleIcon,
  ExclamationIcon,
  EyeIcon,
  EyeInvisibleIcon,
  FileIcon,
  FileTextIcon,
  FilterIcon,
  HomeIcon,
  ImageIcon,
  InfoCircleIcon,
  KeyIcon,
  LinkIcon,
  LockIcon,
  LogoutIcon,
  MailIcon,
  MenuIcon,
  MinusIcon,
  MoreIcon,
  PaperClipIcon,
  PaginationArrowNextIcon,
  PaginationArrowPrevIcon,
  PhoneIcon,
  PlusIcon,
  QuestionCircleIcon,
  ReloadIcon,
  Result404Icon,
  Result500Icon,
  ResultErrorIcon,
  ResultInfoIcon,
  ResultSuccessIcon,
  ResultWarningIcon,
  SafetyIcon,
  SearchIcon,
  ServiceLogoIcon,
  SettingIcon,
  SpinnerIcon,
  StartArrowIcon,
  ToTopIcon,
  UploadIcon,
  UserFilledIcon,
  UserIcon,
  WarningTriangleIcon,
  iconPaths,
} from '../src'

afterEach(cleanup)

const STROKE_ICONS = [
  ['CloseIcon', CloseIcon],
  ['CheckIcon', CheckIcon],
  ['SpinnerIcon', SpinnerIcon],
  ['SearchIcon', SearchIcon],
  ['ClockIcon', ClockIcon],
  ['UserIcon', UserIcon],
  ['ChevronDownIcon', ChevronDownIcon],
  ['ChevronUpIcon', ChevronUpIcon],
  ['ChevronLeftIcon', ChevronLeftIcon],
  ['ChevronRightIcon', ChevronRightIcon],
  ['LockIcon', LockIcon],
  ['ResultSuccessIcon', ResultSuccessIcon],
  ['ResultErrorIcon', ResultErrorIcon],
  ['ResultInfoIcon', ResultInfoIcon],
  ['ResultWarningIcon', ResultWarningIcon],
  ['Result404Icon', Result404Icon],
  ['Result500Icon', Result500Icon],
  ['PlusIcon', PlusIcon],
  ['MinusIcon', MinusIcon],
  ['EditIcon', EditIcon],
  ['CopyIcon', CopyIcon],
  ['DeleteIcon', DeleteIcon],
  ['UploadIcon', UploadIcon],
  ['DownloadIcon', DownloadIcon],
  ['ReloadIcon', ReloadIcon],
  ['SettingIcon', SettingIcon],
  ['DragIcon', DragIcon],
  ['EyeIcon', EyeIcon],
  ['EyeInvisibleIcon', EyeInvisibleIcon],
  ['CalendarIcon', CalendarIcon],
  ['KeyIcon', KeyIcon],
  ['HomeIcon', HomeIcon],
  ['MenuIcon', MenuIcon],
  ['MoreIcon', MoreIcon],
  ['ToTopIcon', ToTopIcon],
  ['LinkIcon', LinkIcon],
  ['LogoutIcon', LogoutIcon],
  ['QuestionCircleIcon', QuestionCircleIcon],
  ['ExclamationIcon', ExclamationIcon],
  ['BellIcon', BellIcon],
  ['MailIcon', MailIcon],
  ['PhoneIcon', PhoneIcon],
  ['FileIcon', FileIcon],
  ['FileTextIcon', FileTextIcon],
  ['PaperClipIcon', PaperClipIcon],
  ['SafetyIcon', SafetyIcon],
  ['ImageIcon', ImageIcon],
] as const

const FILLED_ICONS = [
  ['CaretUpIcon', CaretUpIcon],
  ['CaretDownIcon', CaretDownIcon],
  ['CaretRightIcon', CaretRightIcon],
  ['CaretLeftIcon', CaretLeftIcon],
  ['FilterIcon', FilterIcon],
  ['UserFilledIcon', UserFilledIcon],
  ['ArrowRightIcon', ArrowRightIcon],
  ['ArrowLeftIcon', ArrowLeftIcon],
  ['ArrowDownIcon', ArrowDownIcon],
  ['ArrowUpIcon', ArrowUpIcon],
  ['StartArrowIcon', StartArrowIcon],
  ['PaginationArrowPrevIcon', PaginationArrowPrevIcon],
  ['PaginationArrowNextIcon', PaginationArrowNextIcon],
  ['CheckCircleIcon', CheckCircleIcon],
  ['InfoCircleIcon', InfoCircleIcon],
  ['WarningTriangleIcon', WarningTriangleIcon],
  ['ErrorCircleIcon', ErrorCircleIcon],
  ['ServiceLogoIcon', ServiceLogoIcon],
  ['ClearCircleIcon', ClearCircleIcon],
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
  for (const [name, Icon] of STROKE_ICONS.slice(0, 10)) {
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

test('rotated direction icons wrap the glyph in a rotate transform', () => {
  const { container } = render(<PaginationArrowNextIcon />)
  const group = container.querySelector('g')!
  expect(group.getAttribute('transform')).toBe('rotate(180 12 12)')
  // The canonical path is rendered untouched inside the group.
  expect(group.querySelector('path')!.getAttribute('d')).toContain('m10.55 1.5')
})

test('iconPaths covers all 66 icons with matching metadata', () => {
  const components = [...STROKE_ICONS, ...FILLED_ICONS].map(([name]) => name)
  expect(components).toHaveLength(66)
  expect(Object.keys(iconPaths)).toHaveLength(66)
  for (const [name] of [...STROKE_ICONS, ...FILLED_ICONS]) {
    const key = name.slice(0, -'Icon'.length).replace(/^[A-Z]/, (c) => c.toLowerCase())
    const entry = iconPaths[key]
    expect(entry, name).toBeDefined()
    expect(entry.viewBox).toBe('0 0 24 24')
    expect(entry.body.length).toBeGreaterThan(0)
    expect(entry.filled).toBe(FILLED_ICONS.some(([n]) => n === name))
  }
})

test('iconPaths bakes the rotation into derived direction icons', () => {
  expect(iconPaths.paginationArrowNext.body).toContain('rotate(180 12 12)')
  expect(iconPaths.paginationArrowPrev.body).not.toContain('rotate(')
  expect(iconPaths.chevronLeft.body).toContain('rotate(90 12 12)')
})
