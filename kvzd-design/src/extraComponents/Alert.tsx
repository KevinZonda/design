import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import type { SemanticStyling } from '../components/index'

export type AlertType = 'success' | 'info' | 'warning' | 'error'

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, SemanticStyling<'root' | 'icon' | 'title' | 'message' | 'description' | 'action' | 'close'> {
  type?: AlertType
  title?: ReactNode
  description?: ReactNode
  /** Action area aligned to the right of the alert, such as an undo button. */
  action?: ReactNode
  closable?: boolean
  onClose?: () => void
  closeText?: string
  showIcon?: boolean
}

const ICONS: Record<AlertType, ReactNode> = {
  success: <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  info: <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M10 9v5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /><circle cx="10" cy="6" r="1.4" fill="currentColor" /></svg>,
  warning: <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2L19 18H1z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M10 8v5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /><circle cx="10" cy="15.4" r="1.3" fill="currentColor" /></svg>,
  error: <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>,
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert({ type = 'info', title, description, action, closable = false, onClose, closeText, showIcon = true, children, className = '', classNames, style, styles, ...props }, ref) {
  return <div
    {...props}
    ref={ref}
    role={type === 'error' || type === 'warning' ? 'alert' : 'status'}
    className={`kvzd-design-alert kvzd-design-alert--${type} ${classNames?.root ?? ''} ${className}`.trim()}
    style={{ ...styles?.root, ...style }}
  >
    {showIcon && <span className={`kvzd-design-alert__icon ${classNames?.icon ?? ''}`.trim()} style={styles?.icon}>{ICONS[type]}</span>}
    <div className="kvzd-design-alert__body">
      {title && <p className={`kvzd-design-alert__title ${classNames?.title ?? ''}`.trim()} style={styles?.title}>{title}</p>}
      {children && <div className={`kvzd-design-alert__message ${classNames?.message ?? ''}`.trim()} style={styles?.message}>{children}</div>}
      {description && <div className={`kvzd-design-alert__description ${classNames?.description ?? ''}`.trim()} style={styles?.description}>{description}</div>}
    </div>
    {action && <div className={`kvzd-design-alert__action ${classNames?.action ?? ''}`.trim()} style={styles?.action}>{action}</div>}
    {closable && <button type="button" className={`kvzd-design-alert__close ${classNames?.close ?? ''}`.trim()} style={styles?.close} aria-label="Close" onClick={onClose}>{closeText ?? '×'}</button>}
  </div>
})
