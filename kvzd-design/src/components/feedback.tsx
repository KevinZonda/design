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
  return <div ref={ref} className="govuk-error-summary" style={style} role="alert" tabIndex={-1}><h2 className="govuk-error-summary__title">{title}</h2><div className="govuk-error-summary__body"><ul className="govuk-list govuk-error-summary__list">{errors.map((error, index) => <li key={index}><ClickTarget href={error.href} onClick={error.onClick}>{error.children}</ClickTarget></li>)}</ul></div></div>
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

export { CookieBanner, type CookieBannerProps, type CookieConsent } from './CookieBanner'
export { ExitThisPage, type ExitThisPageProps } from './ExitThisPage'

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
