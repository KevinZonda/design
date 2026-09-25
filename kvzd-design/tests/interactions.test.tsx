// @vitest-environment jsdom
import { act } from 'react'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { Button, CharacterCount, Checkboxes, CookieBanner, DateInput, dateOrder, ErrorSummary, ExitThisPage, LanguageNavigation, Radios, ServiceNavigation } from '../src/components'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  document.cookie = 'kvzd_test_consent=; Max-Age=0; Path=/'
  document.body.className = ''
})

test('date input changes field order without changing the date value keys', () => {
  const onChange = vi.fn()
  const props = { legend: 'Date of birth', defaultValue: { day: '25', month: '09', year: '2026' }, onChange }
  const view = render(<DateInput {...props} />)
  const fields = () => Array.from(view.container.querySelectorAll<HTMLInputElement>('.govuk-date-input input'))
  expect(fields().map((field) => field.name)).toEqual(['date-day', 'date-month', 'date-year'])

  view.rerender(<DateInput {...props} order={dateOrder.CHN} />)
  expect(fields().map((field) => [field.name, field.value])).toEqual([
    ['date-year', '2026'], ['date-month', '09'], ['date-day', '25'],
  ])
  fireEvent.change(fields()[0], { target: { value: '2027' } })
  expect(onChange).toHaveBeenLastCalledWith({ day: '25', month: '09', year: '2027' })

  view.rerender(<DateInput {...props} order={dateOrder.USA} />)
  expect(fields().map((field) => [field.name, field.value])).toEqual([
    ['date-month', '09'], ['date-day', '25'], ['date-year', '2027'],
  ])

  view.rerender(<DateInput {...props} order={dateOrder.GBR} />)
  expect(fields().map((field) => field.name)).toEqual(['date-day', 'date-month', 'date-year'])
})

test('cookie choice persists, confirmation receives focus and can be hidden', async () => {
  const onConsentChange = vi.fn()
  const onAccept = vi.fn()
  const props = { cookieName: 'kvzd_test_consent', onConsentChange, onAccept, children: 'We use analytics cookies.' }
  const view = render(<CookieBanner {...props} />)

  fireEvent.click(await screen.findByRole('button', { name: 'Accept analytics cookies' }))
  expect(document.cookie).toContain('kvzd_test_consent=accepted')
  expect(onAccept).toHaveBeenCalledOnce()
  expect(onConsentChange.mock.calls.map(([choice]) => choice)).toEqual([null, 'accepted'])
  expect(document.activeElement).toBe(screen.getByRole('alert'))

  fireEvent.click(screen.getByRole('button', { name: 'Hide cookie message' }))
  expect(screen.queryByRole('region', { name: 'Cookies on this service' })).toBeNull()

  view.unmount()
  render(<CookieBanner {...props} />)
  await waitFor(() => expect(onConsentChange).toHaveBeenLastCalledWith('accepted'))
  expect(screen.queryByRole('region', { name: 'Cookies on this service' })).toBeNull()
})

test('rejecting cookies stores the choice and reports it once', async () => {
  const onReject = vi.fn()
  const onConsentChange = vi.fn()
  render(<CookieBanner cookieName="kvzd_test_consent" onReject={onReject} onConsentChange={onConsentChange}>Analytics cookies are optional.</CookieBanner>)
  fireEvent.click(await screen.findByRole('button', { name: 'Reject analytics cookies' }))
  expect(document.cookie).toContain('kvzd_test_consent=rejected')
  expect(onReject).toHaveBeenCalledOnce()
  expect(onConsentChange.mock.calls.map(([choice]) => choice)).toEqual([null, 'rejected'])
  expect(screen.getByRole('alert').textContent).toContain("You've rejected analytics cookies.")
})

test('exit shortcut announces progress and covers the page before navigating', () => {
  const onExit = vi.fn()
  render(<ExitThisPage href="#safe" onExit={onExit} />)
  expect(screen.getByRole('button', { name: /Emergency Exit this page/i }).getAttribute('href')).toBe('#safe')
  expect(screen.getByRole('link', { name: 'Emergency exit this page' })).toBeTruthy()

  fireEvent.keyUp(document, { key: 'Shift', shiftKey: false })
  expect(screen.getByRole('status').textContent).toContain('2 more times')
  fireEvent.keyUp(document, { key: 'Shift', shiftKey: false })
  expect(screen.getByRole('status').textContent).toContain('1 more time')
  fireEvent.keyUp(document, { key: 'Shift', shiftKey: false })
  expect(onExit).toHaveBeenCalledOnce()
  expect(document.querySelector('.govuk-exit-this-page-overlay')?.textContent).toBe('Loading.')
  expect(document.body.classList.contains('govuk-exit-this-page-hide-content')).toBe(true)

  fireEvent(window, new Event('pageshow'))
  expect(document.querySelector('.govuk-exit-this-page-overlay')).toBeNull()
})

test('exit shortcut expires and the secondary link activates the same exit', () => {
  vi.useFakeTimers()
  const onExit = vi.fn()
  render(<ExitThisPage href="#safe" onExit={onExit} />)
  fireEvent.keyUp(document, { key: 'Shift', shiftKey: false })
  act(() => vi.advanceTimersByTime(4000))
  fireEvent.keyUp(document, { key: 'Shift', shiftKey: false })
  act(() => vi.advanceTimersByTime(1000))
  expect(screen.getByRole('status').textContent).toBe('Exit this page expired.')
  expect(onExit).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('link', { name: 'Emergency exit this page' }))
  expect(onExit).toHaveBeenCalledOnce()
  expect(document.querySelector('.govuk-exit-this-page-overlay')).toBeTruthy()
})

test('character count gives a static limit and delays live updates while typing', () => {
  render(<CharacterCount label="Details" hint="Be brief" maxLength={5} />)
  const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
  const describedBy = textarea.getAttribute('aria-describedby') ?? ''
  expect(describedBy).toContain(`${textarea.id}-info`)
  expect(describedBy).toContain(`${textarea.id}-hint`)
  expect(document.getElementById(`${textarea.id}-info`)?.textContent).toBe('You can enter up to 5 characters')

  vi.useFakeTimers()
  fireEvent.focus(textarea)
  fireEvent.change(textarea, { target: { value: 'abcdef' } })
  expect(textarea.getAttribute('aria-invalid')).toBe('true')
  expect(screen.getByText('You have 1 character too many').getAttribute('aria-hidden')).toBe('true')
  expect(document.querySelector('.govuk-character-count__sr-status')?.textContent).toBe('')
  act(() => vi.advanceTimersByTime(1000))
  expect(document.querySelector('.govuk-character-count__sr-status')?.textContent).toBe('You have 1 character too many')
})

test('React-managed controls do not request GOV.UK JavaScript initialisation', () => {
  const { container } = render(<>
    <Button>Continue</Button>
    <Checkboxes name="choices" legend="Choose" options={[{ label: 'One', value: 'one' }]} />
    <Radios name="answer" legend="Answer" options={[{ label: 'Yes', value: 'yes' }]} />
    <CharacterCount label="Details" />
    <ServiceNavigation items={[{ label: 'Home', href: '/' }, { label: 'Help', href: '/help' }]} />
    <ErrorSummary errors={[{ children: 'Enter a value', href: '#value' }]} />
  </>)
  expect(container.querySelector('[data-module]')).toBeNull()
})

test('language navigation shows the current language as text and alternatives as links', () => {
  render(<LanguageNavigation items={[{ label: 'English', lang: 'en', href: '/en', current: true }, { label: 'Cymraeg', lang: 'cy', href: '/cy' }]} />)
  expect(screen.queryByRole('link', { name: 'English' })).toBeNull()
  expect(screen.getByText('English').getAttribute('aria-current')).toBe('true')
  const alternative = screen.getByRole('link', { name: 'Cymraeg' })
  expect(alternative.getAttribute('rel')).toBe('alternate')
  expect(alternative.getAttribute('hreflang')).toBe('cy')
})
