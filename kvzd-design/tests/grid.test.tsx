// @vitest-environment jsdom
import { createRef } from 'react'
import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { Col, Row } from '../src/extraComponents/Grid'

afterEach(cleanup)

test('row renders govuk-grid-row and forwards ref', () => {
  const ref = createRef<HTMLDivElement>()
  const { container } = render(<Row ref={ref}>content</Row>)
  const row = container.querySelector('.govuk-grid-row')
  expect(row).toBeTruthy()
  expect(row!.textContent).toBe('content')
  expect(ref.current).toBe(row)
})

test('row merges className and style', () => {
  const { container } = render(<Row className="my-row" style={{ gap: 8 }} />)
  const row = container.querySelector('.govuk-grid-row') as HTMLElement
  expect(row.className).toContain('my-row')
  expect(row.style.gap).toBe('8px')
})

test('col defaults to full width', () => {
  const { container } = render(<Col />)
  expect(container.querySelector('.govuk-grid-column-full')).toBeTruthy()
})

test('col maps each width to the govuk grid column class', () => {
  const widths = ['full', 'one-half', 'one-third', 'two-thirds', 'one-quarter', 'three-quarters'] as const
  for (const width of widths) {
    const { container, unmount } = render(<Col width={width} />)
    expect(container.querySelector(`.govuk-grid-column-${width}`)).toBeTruthy()
    unmount()
  }
})

test('col fromDesktop adds the from-desktop modifier', () => {
  const { container } = render(<Col width="one-half" fromDesktop />)
  expect(container.querySelector('.govuk-grid-column-one-half-from-desktop')).toBeTruthy()
})

test('col forwards ref and merges className and style', () => {
  const ref = createRef<HTMLDivElement>()
  const { container } = render(<Col ref={ref} width="two-thirds" className="my-col" style={{ padding: 4 }}>x</Col>)
  const col = container.querySelector('.govuk-grid-column-two-thirds') as HTMLElement
  expect(ref.current).toBe(col)
  expect(col.className).toContain('my-col')
  expect(col.style.padding).toBe('4px')
})
