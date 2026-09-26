// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { Link } from '../src/components'
import { Typography } from '../src/typography'

afterEach(cleanup)

test('Link with href renders an anchor with the GOV.UK link class', () => {
  render(<Link href="/help">Get help</Link>)
  const link = screen.getByRole('link', { name: 'Get help' })
  expect(link.tagName).toBe('A')
  expect(link.getAttribute('href')).toBe('/help')
  expect(link.className).toBe('govuk-link')
})

test('Link combines the GOV.UK link modifiers', () => {
  render(<Link href="/nav" noVisitedState noUnderline muted>Navigation</Link>)
  const link = screen.getByRole('link', { name: 'Navigation' })
  expect(link.className).toContain('govuk-link--no-visited-state')
  expect(link.className).toContain('govuk-link--no-underline')
  expect(link.className).toContain('govuk-link--muted')
})

test('Link supports textColour and inverse variants', () => {
  render(<><Link href="/a" textColour>Text colour</Link><Link href="/b" inverse>Inverse</Link></>)
  expect(screen.getByRole('link', { name: 'Text colour' }).className).toContain('govuk-link--text-colour')
  expect(screen.getByRole('link', { name: 'Inverse' }).className).toContain('govuk-link--inverse')
})

test('Link with only onClick renders a button', () => {
  const onClick = vi.fn()
  render(<Link onClick={onClick}>Open dialog</Link>)
  const button = screen.getByRole('button', { name: 'Open dialog' })
  fireEvent.click(button)
  expect(onClick).toHaveBeenCalledTimes(1)
})

test('Link with href and onClick runs the handler and navigates unless prevented', () => {
  const onClick = vi.fn()
  render(<Link href="/docs" onClick={onClick}>Docs</Link>)
  const link = screen.getByRole('link', { name: 'Docs' })
  fireEvent.click(link)
  expect(onClick).toHaveBeenCalledTimes(1)
  expect(link.getAttribute('href')).toBe('/docs')
})

test('Link with neither href nor onClick renders plain text', () => {
  render(<Link>Plain</Link>)
  expect(screen.queryByRole('link')).toBeNull()
  expect(screen.getByText('Plain').tagName).toBe('SPAN')
})

test('Link forwards anchorProps such as target and rel', () => {
  render(<Link href="https://example.com" anchorProps={{ target: '_blank', rel: 'noreferrer' }}>External</Link>)
  const link = screen.getByRole('link', { name: 'External' })
  expect(link.getAttribute('target')).toBe('_blank')
  expect(link.getAttribute('rel')).toBe('noreferrer')
})

test('Link merges className and forwards ref', () => {
  let node: HTMLAnchorElement | null = null
  render(<Link ref={(value) => { node = value as HTMLAnchorElement | null }} href="/x" className="custom">Ref</Link>)
  expect(node?.className).toContain('govuk-link')
  expect(node?.className).toContain('custom')
})

test('Typography.Link renders the same Link component', () => {
  render(<Typography.Link href="/home">Home</Typography.Link>)
  const link = screen.getByRole('link', { name: 'Home' })
  expect(link.className).toBe('govuk-link')
})
