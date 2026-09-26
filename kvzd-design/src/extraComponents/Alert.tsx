import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react'
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
  /** Accessible label of the close button. */
  closeLabel?: string
  /** Override the built-in type icon. */
  icon?: ReactNode
  showIcon?: boolean
}

// Mask-based knockouts: the glyph is cut out of a solid shape, so the icon
// background stays transparent instead of painting a fill colour.
const renderIcon = (type: AlertType, maskId: string): ReactNode => {
  const mask = `url(#${maskId})`
  switch (type) {
    case 'success':
      return <svg viewBox="0 0 20 20" aria-hidden="true">
        <mask id={maskId}>
          <rect width="20" height="20" fill="#fff" />
          <path d="M5.6 10.4l2.9 2.9 6-6.6" fill="none" stroke="#000" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </mask>
        <circle cx="10" cy="10" r="9" fill="currentColor" mask={mask} />
      </svg>
    case 'info':
      return <svg viewBox="0 0 20 20" aria-hidden="true">
        <mask id={maskId}>
          <rect width="20" height="20" fill="#fff" />
          <path d="M10 9.3V15" fill="none" stroke="#000" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="10" cy="6.3" r="1.5" fill="#000" />
        </mask>
        <circle cx="10" cy="10" r="9" fill="currentColor" mask={mask} />
      </svg>
    case 'warning':
      return <svg viewBox="0 0 20 20" aria-hidden="true">
        <mask id={maskId}>
          <rect width="20" height="20" fill="#fff" />
          <path d="M10 8.2v4.6" fill="none" stroke="#000" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="10" cy="15.3" r="1.4" fill="#000" />
        </mask>
        <path d="M10 2.2L18.4 17.5H1.6z" fill="currentColor" mask={mask} />
      </svg>
    case 'error':
      return <svg viewBox="0 0 20 20" aria-hidden="true">
        <mask id={maskId}>
          <rect width="20" height="20" fill="#fff" />
          <path d="M7.2 7.2l5.6 5.6M12.8 7.2l-5.6 5.6" fill="none" stroke="#000" strokeWidth="2.4" strokeLinecap="round" />
        </mask>
        <circle cx="10" cy="10" r="9" fill="currentColor" mask={mask} />
      </svg>
  }
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert({ type = 'info', title, description, action, closable = false, onClose, closeText, closeLabel = 'Close', icon, showIcon = true, children, className = '', classNames, style, styles, ...props }, ref) {
  const iconMaskId = `kvzd-alert-icon-${useId().replaceAll(':', '')}`
  return <div
    {...props}
    ref={ref}
    role={type === 'error' || type === 'warning' ? 'alert' : 'status'}
    className={`kvzd-design-alert kvzd-design-alert--${type} ${classNames?.root ?? ''} ${className}`.trim()}
    style={{ ...styles?.root, ...style }}
  >
    {showIcon && <span className={`kvzd-design-alert__icon ${classNames?.icon ?? ''}`.trim()} style={styles?.icon}>{icon ?? renderIcon(type, iconMaskId)}</span>}
    <div className="kvzd-design-alert__body">
      {title && <p className={`kvzd-design-alert__title ${classNames?.title ?? ''}`.trim()} style={styles?.title}>{title}</p>}
      {children && <div className={`kvzd-design-alert__message ${classNames?.message ?? ''}`.trim()} style={styles?.message}>{children}</div>}
      {description && <div className={`kvzd-design-alert__description ${classNames?.description ?? ''}`.trim()} style={styles?.description}>{description}</div>}
    </div>
    {action && <div className={`kvzd-design-alert__action ${classNames?.action ?? ''}`.trim()} style={styles?.action}>{action}</div>}
    {closable && <button type="button" className={`kvzd-design-alert__close ${classNames?.close ?? ''}`.trim()} style={styles?.close} aria-label={closeLabel} onClick={onClose}>{closeText ?? '×'}</button>}
  </div>
})
