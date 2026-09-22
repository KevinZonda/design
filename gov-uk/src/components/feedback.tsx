import { forwardRef, useState } from 'react'
import type { CSSProperties, DetailsHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { Button } from './Button'
import { Tag } from './Tag'
import { ClickTarget, type IClickBehaviour } from './clickBehaviour'

export interface DetailsProps extends DetailsHTMLAttributes<HTMLDetailsElement> { summary: ReactNode }
export const Details = forwardRef<HTMLDetailsElement, DetailsProps>(function Details({ summary, children, className = '', ...props }, ref) { return <details {...props} ref={ref} className={`govuk-details ${className}`.trim()}><summary className="govuk-details__summary"><span className="govuk-details__summary-text">{summary}</span></summary><div className="govuk-details__text">{children}</div></details> })
export const InsetText = forwardRef<HTMLDivElement, { children: ReactNode; style?: CSSProperties }>(function InsetText({ children, style }, ref) { return <div ref={ref} className="govuk-inset-text" style={style}>{children}</div> })
export const WarningText = forwardRef<HTMLDivElement, { children: ReactNode; iconFallbackText?: string; style?: CSSProperties }>(function WarningText({ children, iconFallbackText = 'Warning', style }, ref) { return <div ref={ref} className="govuk-warning-text" style={style}><span className="govuk-warning-text__icon" aria-hidden="true">!</span><strong className="govuk-warning-text__text"><span className="govuk-visually-hidden">{iconFallbackText}</span>{children}</strong></div> })

export interface ErrorItem extends IClickBehaviour { children: ReactNode }
export interface ErrorSummaryProps { title?: ReactNode; errors: ErrorItem[]; style?: CSSProperties }
export const ErrorSummary = forwardRef<HTMLDivElement, ErrorSummaryProps>(function ErrorSummary({ title = 'There is a problem', errors, style }, ref) {
  return <div ref={ref} className="govuk-error-summary" style={style} data-module="govuk-error-summary" role="alert" tabIndex={-1}><h2 className="govuk-error-summary__title">{title}</h2><div className="govuk-error-summary__body"><ul className="govuk-list govuk-error-summary__list">{errors.map((error, index) => <li key={index}><ClickTarget href={error.href} onClick={error.onClick}>{error.children}</ClickTarget></li>)}</ul></div></div>
})

export const NotificationBanner = forwardRef<HTMLDivElement, { children: ReactNode; title?: ReactNode; type?: 'info' | 'success'; className?: string; style?: CSSProperties }>(function NotificationBanner({ children, title, type = 'info', className = '', style }, ref) {
  return <div ref={ref} className={`govuk-notification-banner ${type === 'success' ? 'govuk-notification-banner--success' : ''} ${className}`.trim()} style={style} role={type === 'success' ? 'alert' : 'region'} aria-label={typeof title === 'string' ? title : type === 'success' ? 'Success' : 'Important'}><div className="govuk-notification-banner__header"><h2 className="govuk-notification-banner__title">{title ?? (type === 'success' ? 'Success' : 'Important')}</h2></div><div className="govuk-notification-banner__content">{children}</div></div>
})

export const PhaseBanner = forwardRef<HTMLDivElement, { phase: ReactNode; children: ReactNode; className?: string; style?: CSSProperties }>(function PhaseBanner({ phase, children, className = '', style }, ref) {
  return <div ref={ref} className={`govuk-phase-banner govuk-width-container ${className}`.trim()} style={style}>
    <p className="govuk-phase-banner__content">
      <Tag className="govuk-phase-banner__content__tag">{phase}</Tag>
      <span className="govuk-phase-banner__text">{children}</span>
    </p>
  </div>
})

export interface CookieBannerProps { title?: ReactNode; children: ReactNode; onAccept?: () => void; onReject?: () => void; acceptText?: string; rejectText?: string; style?: CSSProperties }
export const CookieBanner = forwardRef<HTMLDivElement, CookieBannerProps>(function CookieBanner({ acceptText = 'Accept analytics cookies', children, onAccept, onReject, rejectText = 'Reject analytics cookies', style, title = 'Cookies on this service' }, ref) {
  const [choice, setChoice] = useState<'accepted' | 'rejected' | null>(null)
  if (choice) return <div ref={ref} className="govuk-cookie-banner" style={style} role="region" aria-label="Cookies"><div className="govuk-cookie-banner__message govuk-width-container"><div className="govuk-grid-row"><div className="govuk-grid-column-two-thirds"><p className="govuk-body">Your cookie preferences have been saved.</p></div></div></div></div>
  return <div ref={ref} className="govuk-cookie-banner" style={style} role="region" aria-label="Cookies"><div className="govuk-cookie-banner__message govuk-width-container"><div className="govuk-grid-row"><div className="govuk-grid-column-two-thirds"><h2 className="govuk-cookie-banner__heading govuk-heading-m">{title}</h2><div className="govuk-cookie-banner__content"><p className="govuk-body">{children}</p></div></div></div><div className="govuk-button-group"><Button onClick={() => { setChoice('accepted'); onAccept?.() }}>{acceptText}</Button><Button onClick={() => { setChoice('rejected'); onReject?.() }}>{rejectText}</Button></div></div></div>
})

export const ExitThisPage = forwardRef<HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement, IClickBehaviour & { children?: ReactNode; style?: CSSProperties }>(function ExitThisPage({ href, onClick, children = 'Exit this page', style }, ref) { return <ClickTarget ref={ref} href={href} onClick={onClick} className="govuk-exit-this-page__button govuk-button govuk-button--warning" style={style} anchorProps={{ role: 'button', rel: 'nofollow noreferrer' }}>{children}<span aria-hidden="true"> ⇥</span></ClickTarget> })

export const Feedback = forwardRef<HTMLElement, { onUseful?: (useful: boolean) => void; onSubmit?: (message: string) => void; onOpenChange?: (open: boolean) => void; style?: CSSProperties }>(function Feedback({ onUseful, onSubmit, onOpenChange, style }, ref) {
  const [open, setOpen] = useState(false); const [message, setMessage] = useState(''); const [sent, setSent] = useState(false)
  return <section ref={ref} className="govuk-feedback" style={style} aria-label="Feedback">
    {sent ? <p className="govuk-body"><strong>Thank you for your feedback.</strong></p> : <>
      <div className="govuk-feedback__prompt"><span>Is this page useful?</span><Button type="secondary" onClick={() => onUseful?.(true)}>Yes</Button><Button type="secondary" onClick={() => onUseful?.(false)}>No</Button><button className="govuk-link" type="button" onClick={() => { const next = !open; setOpen(next); onOpenChange?.(next) }}>Report a problem with this page</button></div>
      {open && <div className="govuk-feedback__form"><label className="govuk-label govuk-label--m" htmlFor="feedback-message">What went wrong?</label><textarea id="feedback-message" className="govuk-textarea" rows={4} value={message} onChange={(event) => setMessage(event.target.value)} /><Button onClick={() => { onSubmit?.(message); setSent(true) }}>Send</Button></div>}
    </>}
  </section>
})

export const Surface = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Surface({ children, className = '', ...props }, ref) { return <div {...props} ref={ref} className={`kvzd-surface ${className}`.trim()}>{children}</div> })
