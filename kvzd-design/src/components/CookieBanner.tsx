import { forwardRef, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { Button } from './Button'

export type CookieConsent = 'accepted' | 'rejected'

export interface CookieBannerProps {
  children: ReactNode
  title?: ReactNode
  ariaLabel?: string
  cookieName?: string
  onAccept?: () => void
  onReject?: () => void
  onConsentChange?: (consent: CookieConsent | null) => void
  acceptText?: ReactNode
  rejectText?: ReactNode
  hideText?: ReactNode
  acceptedText?: ReactNode
  rejectedText?: ReactNode
  settingsHref?: string
  settingsText?: string
  className?: string
  style?: CSSProperties
}

function readConsent(cookieName: string): CookieConsent | null {
  const prefix = `${encodeURIComponent(cookieName)}=`
  const cookie = document.cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(prefix))
  const value = cookie?.slice(prefix.length)
  return value === 'accepted' || value === 'rejected' ? value : null
}

function saveConsent(cookieName: string, consent: CookieConsent) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${encodeURIComponent(cookieName)}=${consent}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`
}

const noCookieSubscription = () => () => {}

export const CookieBanner = forwardRef<HTMLDivElement, CookieBannerProps>(function CookieBanner({
  acceptText = 'Accept analytics cookies',
  acceptedText = "You've accepted analytics cookies.",
  ariaLabel,
  children,
  className = '',
  cookieName = 'kvzd_cookie_consent',
  hideText = 'Hide cookie message',
  onAccept,
  onConsentChange,
  onReject,
  rejectText = 'Reject analytics cookies',
  rejectedText = "You've rejected analytics cookies.",
  settingsHref,
  settingsText = 'You can change your cookie settings at any time.',
  style,
  title = 'Cookies on this service',
}, ref) {
  const storedConsent = useSyncExternalStore(noCookieSubscription, () => readConsent(cookieName), () => undefined)
  const [phase, setPhase] = useState<'prompt' | 'confirmation' | 'hidden'>('prompt')
  const [choice, setChoice] = useState<CookieConsent | null>(null)
  const confirmationRef = useRef<HTMLDivElement>(null)
  const onConsentChangeRef = useRef(onConsentChange)
  const lastReportedConsent = useRef<CookieConsent | null | undefined>(undefined)

  useEffect(() => { onConsentChangeRef.current = onConsentChange }, [onConsentChange])

  useEffect(() => {
    if (storedConsent !== undefined && storedConsent !== lastReportedConsent.current) {
      lastReportedConsent.current = storedConsent
      onConsentChangeRef.current?.(storedConsent)
    }
  }, [cookieName, storedConsent])

  useEffect(() => {
    if (phase === 'confirmation') confirmationRef.current?.focus()
  }, [phase])

  const choose = (next: CookieConsent) => {
    saveConsent(cookieName, next)
    setChoice(next)
    setPhase('confirmation')
    lastReportedConsent.current = next
    onConsentChange?.(next)
    if (next === 'accepted') onAccept?.()
    else onReject?.()
  }

  if (storedConsent === undefined || phase === 'hidden' || (storedConsent && phase !== 'confirmation')) return null

  return <div ref={ref} className={`govuk-cookie-banner ${className}`.trim()} style={style} role="region" aria-label={ariaLabel ?? (typeof title === 'string' ? title : 'Cookies on this service')}>
    {phase === 'prompt'
      ? <div className="govuk-cookie-banner__message govuk-width-container">
        <div className="govuk-grid-row"><div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-cookie-banner__heading govuk-heading-m">{title}</h2>
          <div className="govuk-cookie-banner__content"><p className="govuk-body">{children}</p></div>
        </div></div>
        <div className="govuk-button-group">
          <Button onClick={() => choose('accepted')}>{acceptText}</Button>
          <Button onClick={() => choose('rejected')}>{rejectText}</Button>
        </div>
      </div>
      : <div ref={confirmationRef} className="govuk-cookie-banner__message govuk-width-container" role="alert" tabIndex={-1}>
        <div className="govuk-grid-row"><div className="govuk-grid-column-two-thirds">
          <div className="govuk-cookie-banner__content">
            <p className="govuk-body">{choice === 'accepted' ? acceptedText : rejectedText}{' '}{settingsHref && <a className="govuk-link" href={settingsHref}>{settingsText}</a>}</p>
          </div>
        </div></div>
        <div className="govuk-button-group"><Button onClick={() => setPhase('hidden')}>{hideText}</Button></div>
      </div>}
  </div>
})
