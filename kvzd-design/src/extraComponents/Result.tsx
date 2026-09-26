import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import type { SemanticStyling } from '../components/index'

export type ResultStatus = 'success' | 'error' | 'info' | 'warning' | '403' | '404' | '500'

export interface ResultProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, SemanticStyling<'root' | 'icon' | 'title' | 'subtitle' | 'extra'> {
  status?: ResultStatus
  title: ReactNode
  /** Override the built-in status icon. */
  icon?: ReactNode
  /** Action area such as primary and secondary buttons. */
  extra?: ReactNode
}

const ICONS: Record<ResultStatus, ReactNode> = {
  success: <svg viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="34" fill="none" stroke="currentColor" strokeWidth="4" /><path d="M22 37.5l10 10 19-22" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  error: <svg viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="34" fill="none" stroke="currentColor" strokeWidth="4" /><path d="M25 25l22 22M47 25L25 47" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></svg>,
  info: <svg viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="34" fill="none" stroke="currentColor" strokeWidth="4" /><path d="M36 32v16" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /><circle cx="36" cy="22" r="3.5" fill="currentColor" /></svg>,
  warning: <svg viewBox="0 0 72 72" aria-hidden="true"><path d="M36 8L68 62H4z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" /><path d="M36 28v14" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /><circle cx="36" cy="50" r="3.4" fill="currentColor" /></svg>,
  '403': <svg viewBox="0 0 72 72" aria-hidden="true"><rect x="14" y="30" width="44" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="4" /><path d="M24 30v-8a12 12 0 0 1 24 0v8" fill="none" stroke="currentColor" strokeWidth="4" /><circle cx="36" cy="44" r="4" fill="currentColor" /><path d="M36 47v6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>,
  '404': <svg viewBox="0 0 72 72" aria-hidden="true"><circle cx="24" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="4" /><circle cx="48" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="4" /><path d="M12 60L60 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>,
  '500': <svg viewBox="0 0 72 72" aria-hidden="true"><rect x="8" y="16" width="56" height="34" rx="4" fill="none" stroke="currentColor" strokeWidth="4" /><path d="M24 58h24M36 50v8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /><path d="M26 26l8 6-8 6M38 38h10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
}

export const Result = forwardRef<HTMLDivElement, ResultProps>(function Result({ status = 'info', title, icon, extra, children, className = '', classNames, style, styles, ...props }, ref) {
  return <div
    {...props}
    ref={ref}
    role={status === 'error' || status === 'warning' ? 'alert' : 'status'}
    className={`kvzd-design-result kvzd-design-result--${status} ${classNames?.root ?? ''} ${className}`.trim()}
    style={{ ...styles?.root, ...style }}
  >
    <div className={`kvzd-design-result__icon ${classNames?.icon ?? ''}`.trim()} style={styles?.icon}>{icon ?? ICONS[status]}</div>
    <h2 className={`kvzd-design-result__title ${classNames?.title ?? ''}`.trim()} style={styles?.title}>{title}</h2>
    {children && <div className={`kvzd-design-result__subtitle ${classNames?.subtitle ?? ''}`.trim()} style={styles?.subtitle}>{children}</div>}
    {extra && <div className={`kvzd-design-result__extra ${classNames?.extra ?? ''}`.trim()} style={styles?.extra}>{extra}</div>}
  </div>
})
