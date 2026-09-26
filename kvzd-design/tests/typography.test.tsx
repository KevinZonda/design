// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { Paragraph, Text, Title, Typography, H1, H2, H3, H4, H5, H6 } from '../src/typography'

afterEach(cleanup)

test('Title renders a semantic heading with the GOV.UK class for its level', () => {
  render(<Title level={2}>Section heading</Title>)
  const heading = screen.getByRole('heading', { level: 2 })
  expect(heading.textContent).toBe('Section heading')
  expect(heading.className).toContain('govuk-heading-m')
})

test('Title maps levels to the default GOV.UK variants and supports variant overrides', () => {
  render(<>
    <Title level={1}>One</Title>
    <Title level={3}>Three</Title>
    <Title level={2} variant="xl">Big</Title>
  </>)
  expect(screen.getByRole('heading', { level: 1 }).className).toContain('govuk-heading-l')
  expect(screen.getByRole('heading', { level: 3 }).className).toContain('govuk-heading-s')
  expect(screen.getByRole('heading', { level: 2, name: 'Big' }).className).toContain('govuk-heading-xl')
})

test('Title renders the caption as a span before the heading by default', () => {
  render(<Title caption="Section 1">Page heading</Title>)
  const caption = screen.getByText('Section 1')
  expect(caption.tagName).toBe('SPAN')
  expect(caption.className).toContain('govuk-caption-l')
  expect(caption.compareDocumentPosition(screen.getByRole('heading')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
})

test('Title nests the caption inside the heading when captionInHeading is set', () => {
  render(<Title caption="Section 1" captionInHeading>Page heading</Title>)
  const heading = screen.getByRole('heading', { level: 1 })
  expect(heading.textContent).toBe('Section 1Page heading')
  expect(heading.querySelector('.govuk-caption-l')?.textContent).toBe('Section 1')
})

test('Title caption falls back to caption-m for the small heading variant', () => {
  render(<Title level={3} caption="Meta">Small heading</Title>)
  expect(screen.getByText('Meta').className).toContain('govuk-caption-m')
})

test('Title forwards ref and native props to the heading', () => {
  let node: HTMLHeadingElement | null = null
  render(<Title ref={(value) => { node = value }} data-testid="target" level={1}>Ref target</Title>)
  expect(node?.tagName).toBe('H1')
  expect(node?.getAttribute('data-testid')).toBe('target')
})

test('Text renders an inline span with body typography and overrides', () => {
  render(<p>Total: <Text variant="s" bold tabular breakWord>£1,234.00</Text></p>)
  const text = screen.getByText('£1,234.00')
  expect(text.tagName).toBe('SPAN')
  expect(text.className).toContain('govuk-body-s')
  expect(text.className).toContain('govuk-!-font-weight-bold')
  expect(text.className).toContain('govuk-!-font-tabular-numbers')
  expect(text.className).toContain('govuk-!-text-break-word')
})

test('Text supports explicit points from the GOV.UK type scale', () => {
  render(<Text size={48}>Display text</Text>)
  expect(screen.getByText('Display text').className).toContain('govuk-!-font-size-48')
})

test('Paragraph renders block body text as a paragraph element', () => {
  render(<Paragraph variant="l">Lead paragraph</Paragraph>)
  const paragraph = screen.getByText('Lead paragraph')
  expect(paragraph.tagName).toBe('P')
  expect(paragraph.className).toContain('govuk-body-l')
})

test('Typography exposes Title, Text and Paragraph', () => {
  render(<><Typography.Title level={1}>T</Typography.Title><Typography.Text>tx</Typography.Text><Typography.Paragraph>pg</Typography.Paragraph></>)
  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('T')
  expect(screen.getByText('tx').tagName).toBe('SPAN')
  expect(screen.getByText('pg').tagName).toBe('P')
})

test('H1-H6 render the matching heading level with the default variant', () => {
  render(<>
    <H1>One</H1>
    <H2>Two</H2>
    <H3>Three</H3>
    <H4>Four</H4>
    <H5>Five</H5>
    <H6>Six</H6>
  </>)
  expect(screen.getByRole('heading', { level: 1 }).className).toContain('govuk-heading-l')
  expect(screen.getByRole('heading', { level: 2 }).className).toContain('govuk-heading-m')
  expect(screen.getByRole('heading', { level: 3 }).className).toContain('govuk-heading-s')
  expect(screen.getByRole('heading', { level: 4 }).className).toContain('govuk-heading-s')
  expect(screen.getByRole('heading', { level: 5 }).className).toContain('govuk-heading-s')
  expect(screen.getByRole('heading', { level: 6 }).className).toContain('govuk-heading-s')
})

test('H1-H6 accept variant overrides and forward refs', () => {
  let node: HTMLHeadingElement | null = null
  render(<H2 variant="xl" ref={(value) => { node = value }}>Big section</H2>)
  expect(node?.tagName).toBe('H2')
  expect(node?.className).toContain('govuk-heading-xl')
})
