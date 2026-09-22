import { useState } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { Button } from './Button'
import { Tag } from './Tag'
import { ClickTarget, type IClickBehaviour } from './clickBehaviour'

export function Details({ summary, children, open = false }: { summary: ReactNode; children: ReactNode; open?: boolean }) { return <details className="govuk-details" open={open}><summary className="govuk-details__summary"><span className="govuk-details__summary-text">{summary}</span></summary><div className="govuk-details__text">{children}</div></details> }
export function InsetText({ children }: { children: ReactNode }) { return <div className="govuk-inset-text">{children}</div> }
export function WarningText({ children, iconFallbackText = 'Warning' }: { children: ReactNode; iconFallbackText?: string }) { return <div className="govuk-warning-text"><span className="govuk-warning-text__icon" aria-hidden="true">!</span><strong className="govuk-warning-text__text"><span className="govuk-visually-hidden">{iconFallbackText}</span>{children}</strong></div> }

export interface ErrorItem extends IClickBehaviour { children: ReactNode }
export function ErrorSummary({ title = 'There is a problem', errors }: { title?: ReactNode; errors: ErrorItem[] }) {
  return <div className="govuk-error-summary" data-module="govuk-error-summary" role="alert" tabIndex={-1}><h2 className="govuk-error-summary__title">{title}</h2><div className="govuk-error-summary__body"><ul className="govuk-list govuk-error-summary__list">{errors.map((error, index) => <li key={index}><ClickTarget href={error.href} onClick={error.onClick}>{error.children}</ClickTarget></li>)}</ul></div></div>
}

export function NotificationBanner({ children, title, type = 'info', className = '' }: { children: ReactNode; title?: ReactNode; type?: 'info' | 'success'; className?: string }) {
  return <div className={`govuk-notification-banner ${type === 'success' ? 'govuk-notification-banner--success' : ''} ${className}`.trim()} role={type === 'success' ? 'alert' : 'region'} aria-label={typeof title === 'string' ? title : type === 'success' ? 'Success' : 'Important'}><div className="govuk-notification-banner__header"><h2 className="govuk-notification-banner__title">{title ?? (type === 'success' ? 'Success' : 'Important')}</h2></div><div className="govuk-notification-banner__content">{children}</div></div>
}

export function PhaseBanner({ phase, children, className = '' }: { phase: ReactNode; children: ReactNode; className?: string }) {
  return <div className={`govuk-phase-banner govuk-width-container ${className}`.trim()}>
    <p className="govuk-phase-banner__content">
      <Tag className="govuk-phase-banner__content__tag">{phase}</Tag>
      <span className="govuk-phase-banner__text">{children}</span>
    </p>
  </div>
}

export interface CookieBannerProps { title?: ReactNode; children: ReactNode; onAccept?: () => void; onReject?: () => void; acceptText?: string; rejectText?: string }
export function CookieBanner({ acceptText = 'Accept analytics cookies', children, onAccept, onReject, rejectText = 'Reject analytics cookies', title = 'Cookies on this service' }: CookieBannerProps) {
  const [choice, setChoice] = useState<'accepted' | 'rejected' | null>(null)
  if (choice) return <div className="govuk-cookie-banner" role="region" aria-label="Cookies"><div className="govuk-cookie-banner__message govuk-width-container"><div className="govuk-grid-row"><div className="govuk-grid-column-two-thirds"><p className="govuk-body">Your cookie preferences have been saved.</p></div></div></div></div>
  return <div className="govuk-cookie-banner" role="region" aria-label="Cookies"><div className="govuk-cookie-banner__message govuk-width-container"><div className="govuk-grid-row"><div className="govuk-grid-column-two-thirds"><h2 className="govuk-cookie-banner__heading govuk-heading-m">{title}</h2><div className="govuk-cookie-banner__content"><p className="govuk-body">{children}</p></div></div></div><div className="govuk-button-group"><Button onClick={() => { setChoice('accepted'); onAccept?.() }}>{acceptText}</Button><Button onClick={() => { setChoice('rejected'); onReject?.() }}>{rejectText}</Button></div></div></div>
}

export function ExitThisPage({ href, onClick, children = 'Exit this page' }: IClickBehaviour & { children?: ReactNode }) { return <ClickTarget href={href} onClick={onClick} className="govuk-exit-this-page__button govuk-button govuk-button--warning" anchorProps={{ role: 'button', rel: 'nofollow noreferrer' }}>{children}<span aria-hidden="true"> ⇥</span></ClickTarget> }

export function Feedback({ onUseful, onSubmit }: { onUseful?: (useful: boolean) => void; onSubmit?: (message: string) => void }) {
  const [open, setOpen] = useState(false); const [message, setMessage] = useState(''); const [sent, setSent] = useState(false)
  return <section className="govuk-feedback" aria-label="Feedback">{sent ? <p className="govuk-body"><strong>Thank you for your feedback.</strong></p> : <><div className="govuk-feedback__prompt"><span>Is this page useful?</span><Button type="secondary" onClick={() => onUseful?.(true)}>Yes</Button><Button type="secondary" onClick={() => onUseful?.(false)}>No</Button><button className="govuk-link" type="button" onClick={() => setOpen((current) => !current)}>Report a problem with this page</button></div>{open && <div className="govuk-feedback__form"><label className="govuk-label govuk-label--m" htmlFor="feedback-message">What went wrong?</label><textarea id="feedback-message" className="govuk-textarea" rows={4} value={message} onChange={(event) => setMessage(event.target.value)} /><Button onClick={() => { onSubmit?.(message); setSent(true) }}>Send</Button></div>}</>}</section>
}

export function Surface({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) { return <div {...props} className={`kvzd-surface ${className}`.trim()}>{children}</div> }
