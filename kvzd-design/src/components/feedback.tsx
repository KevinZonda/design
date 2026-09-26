import { forwardRef, useId, useState } from 'react'
import type { CSSProperties, DetailsHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { Button } from './Button'
import { Tag } from './Tag'
import { ClickTarget, type ClickBehaviourProps } from './clickBehaviour'

export interface DetailsProps extends DetailsHTMLAttributes<HTMLDetailsElement> { summary: ReactNode }
export const Details = forwardRef<HTMLDetailsElement, DetailsProps>(function Details({ summary, children, className = '', ...props }, ref) { return <details {...props} ref={ref} className={`govuk-details ${className}`.trim()}><summary className="govuk-details__summary"><span className="govuk-details__summary-text">{summary}</span></summary><div className="govuk-details__text">{children}</div></details> })
export const InsetText = forwardRef<HTMLDivElement, { children: ReactNode; className?: string; style?: CSSProperties }>(function InsetText({ children, className = '', style }, ref) { return <div ref={ref} className={`govuk-inset-text ${className}`.trim()} style={style}>{children}</div> })
export const WarningText = forwardRef<HTMLDivElement, { children: ReactNode; iconFallbackText?: string; className?: string; style?: CSSProperties }>(function WarningText({ children, iconFallbackText = 'Warning', className = '', style }, ref) { return <div ref={ref} className={`govuk-warning-text ${className}`.trim()} style={style}><span className="govuk-warning-text__icon" aria-hidden="true">!</span><strong className="govuk-warning-text__text"><span className="govuk-visually-hidden">{iconFallbackText}</span>{children}</strong></div> })

export interface ErrorItem extends ClickBehaviourProps { children: ReactNode }
export interface ErrorSummaryProps { title?: ReactNode; errors: ErrorItem[]; className?: string; style?: CSSProperties }
export const ErrorSummary = forwardRef<HTMLDivElement, ErrorSummaryProps>(function ErrorSummary({ title = 'There is a problem', errors, className = '', style }, ref) {
  return <div ref={ref} className={`govuk-error-summary ${className}`.trim()} style={style} role="alert" tabIndex={-1}><h2 className="govuk-error-summary__title">{title}</h2><div className="govuk-error-summary__body"><ul className="govuk-list govuk-error-summary__list">{errors.map((error, index) => <li key={index}><ClickTarget href={error.href} onClick={error.onClick}>{error.children}</ClickTarget></li>)}</ul></div></div>
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

export interface FeedbackProps {
  onUseful?: (useful: boolean) => void
  onSubmit?: (message: string) => void
  onOpenChange?: (open: boolean) => void
  usefulPromptText?: ReactNode
  yesText?: ReactNode
  noText?: ReactNode
  reportText?: ReactNode
  titleText?: ReactNode
  sendText?: ReactNode
  thankYouText?: ReactNode
  ariaLabel?: string
  className?: string
  style?: CSSProperties
}
export const Feedback = forwardRef<HTMLElement, FeedbackProps>(function Feedback({ onUseful, onSubmit, onOpenChange, usefulPromptText = 'Is this page useful?', yesText = 'Yes', noText = 'No', reportText = 'Report a problem with this page', titleText = 'What went wrong?', sendText = 'Send', thankYouText = 'Thank you for your feedback.', ariaLabel = 'Feedback', className = '', style }, ref) {
  const [open, setOpen] = useState(false); const [message, setMessage] = useState(''); const [sent, setSent] = useState(false)
  const messageId = `kvzd-design-feedback-${useId().replaceAll(':', '')}`
  return <section ref={ref} className={`govuk-feedback ${className}`.trim()} style={style} aria-label={ariaLabel}>
    {sent ? <p className="govuk-body"><strong>{thankYouText}</strong></p> : <>
      <div className="kvzd-design-feedback__prompt"><span>{usefulPromptText}</span><Button variant="secondary" onClick={() => onUseful?.(true)}>{yesText}</Button><Button variant="secondary" onClick={() => onUseful?.(false)}>{noText}</Button><button className="govuk-link" type="button" onClick={() => { const next = !open; setOpen(next); onOpenChange?.(next) }}>{reportText}</button></div>
      {open && <div className="kvzd-design-feedback__form"><label className="govuk-label govuk-label--m" htmlFor={messageId}>{titleText}</label><textarea id={messageId} className="govuk-textarea" rows={4} value={message} onChange={(event) => setMessage(event.target.value)} /><Button onClick={() => { onSubmit?.(message); setSent(true) }}>{sendText}</Button></div>}
    </>}
  </section>
})

export const Surface = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Surface({ children, className = '', ...props }, ref) { return <div {...props} ref={ref} className={`kvzd-design-surface ${className}`.trim()}>{children}</div> })
