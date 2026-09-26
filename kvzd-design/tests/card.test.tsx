// @vitest-environment jsdom
import { createRef } from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { Card } from '../src/extraComponents/Card'

afterEach(cleanup)

test('card renders root with base class and forwards ref', () => {
  const ref = createRef<HTMLDivElement>()
  const { container } = render(<Card ref={ref}>body</Card>)
  const root = container.querySelector('.kvzd-design-card') as HTMLElement
  expect(root).toBeTruthy()
  expect(ref.current).toBe(root)
  expect(root.textContent).toContain('body')
})

test('card renders header with title and right-aligned extra', () => {
  const { container } = render(<Card title="Card title" extra={<a href="#more">More</a>}>body</Card>)
  const header = container.querySelector('.kvzd-design-card__header')
  expect(header).toBeTruthy()
  const title = container.querySelector('.kvzd-design-card__title')
  expect(title!.textContent).toBe('Card title')
  const extra = container.querySelector('.kvzd-design-card__extra')
  expect(extra!.textContent).toBe('More')
})

test('card renders extra-only header without title element', () => {
  const { container } = render(<Card extra={<span>tag</span>}>body</Card>)
  expect(container.querySelector('.kvzd-design-card__header')).toBeTruthy()
  expect(container.querySelector('.kvzd-design-card__title')).toBeNull()
  expect(container.querySelector('.kvzd-design-card__extra')!.textContent).toBe('tag')
})

test('card omits header and body wrapper when slots are absent', () => {
  const { container } = render(<Card />)
  expect(container.querySelector('.kvzd-design-card__header')).toBeNull()
  expect(container.querySelector('.kvzd-design-card__body')).toBeNull()
  expect(container.querySelector('.kvzd-design-card__actions')).toBeNull()
})

test('card renders actions footer with content', () => {
  const { container } = render(<Card actions={<button type="button">Go</button>}>body</Card>)
  const actions = container.querySelector('.kvzd-design-card__actions')
  expect(actions).toBeTruthy()
  expect(actions!.textContent).toBe('Go')
})

test('hoverable adds hoverable class and keeps it on mouse over', () => {
  const { container } = render(<Card hoverable>body</Card>)
  const root = container.querySelector('.kvzd-design-card') as HTMLElement
  expect(root.className).toContain('kvzd-design-card--hoverable')
  fireEvent.mouseOver(root)
  expect(root.className).toContain('kvzd-design-card--hoverable')
})

test('non-hoverable card has no hoverable class', () => {
  const { container } = render(<Card>body</Card>)
  expect(container.querySelector('.kvzd-design-card')!.className).not.toContain('kvzd-design-card--hoverable')
})

test('card merges className and style on root', () => {
  const { container } = render(<Card className="my-card" style={{ marginTop: 8 }}>body</Card>)
  const root = container.querySelector('.kvzd-design-card') as HTMLElement
  expect(root.className).toContain('my-card')
  expect(root.style.marginTop).toBe('8px')
})

test('card applies classNames and styles to each slot', () => {
  const { container } = render(
    <Card
      title="t"
      extra="e"
      actions="a"
      classNames={{ root: 'cn-root', header: 'cn-header', title: 'cn-title', extra: 'cn-extra', body: 'cn-body', actions: 'cn-actions' }}
      styles={{ title: { color: 'rgb(1, 2, 3)' }, actions: { paddingTop: 6 } }}
    >
      body
    </Card>,
  )
  const root = container.querySelector('.kvzd-design-card') as HTMLElement
  expect(root.className).toContain('cn-root')
  expect((container.querySelector('.kvzd-design-card__header') as HTMLElement).className).toContain('cn-header')
  const title = container.querySelector('.kvzd-design-card__title') as HTMLElement
  expect(title.className).toContain('cn-title')
  expect(title.style.color).toBe('rgb(1, 2, 3)')
  expect((container.querySelector('.kvzd-design-card__extra') as HTMLElement).className).toContain('cn-extra')
  expect((container.querySelector('.kvzd-design-card__body') as HTMLElement).className).toContain('cn-body')
  const actions = container.querySelector('.kvzd-design-card__actions') as HTMLElement
  expect(actions.className).toContain('cn-actions')
  expect(actions.style.paddingTop).toBe('6px')
})
