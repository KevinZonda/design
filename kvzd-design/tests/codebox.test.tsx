// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'
import { CodeBox } from '../src/extraComponents'

afterEach(cleanup)

test('codebox renders pre-highlighted html verbatim', () => {
  const highlighted = '<span class="line">&lt;Button /&gt;</span>'
  const { container } = render(<CodeBox code="<Button />" highlightedHtml={highlighted} />)
  expect(container.querySelector('.kvzd-design-code-box__pre code')?.innerHTML).toBe(highlighted)
})

test('codebox escapes raw code as the initial fallback', () => {
  const { container } = render(<CodeBox code={'<Button kind="primary" />'} />)
  const code = container.querySelector('.kvzd-design-code-box__pre code')
  expect(code?.textContent).toBe('<Button kind="primary" />')
  expect(code?.querySelectorAll('span').length).toBe(0)
})

test('codebox applies root className and style overrides', () => {
  const { container } = render(<CodeBox code="x" className="extra" style={{ maxWidth: 400 }} />)
  const root = container.firstElementChild as HTMLElement
  expect(root.className).toContain('kvzd-design-code-box')
  expect(root.className).toContain('extra')
  expect(root.style.maxWidth).toBe('400px')
})
