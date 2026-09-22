import { forwardRef, useEffect, useId, useRef, type CSSProperties, type ReactNode } from 'react'
import type { SemanticStyling } from '../components/index'

export interface ModalProps extends SemanticStyling<'root' | 'header' | 'title' | 'close' | 'body' | 'footer'> {
  open: boolean
  title: ReactNode
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
  closeLabel?: string
  closeOnBackdrop?: boolean
  className?: string
  style?: CSSProperties
}

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal({ open, title, children, onClose, footer, closeLabel = 'Close', closeOnBackdrop = true, className = '', classNames, style, styles }, forwardedRef) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return <dialog
    ref={(node) => {
      dialogRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    }}
    className={`kvzd-modal ${classNames?.root ?? ''} ${className}`.trim()}
    style={{ ...styles?.root, ...style }}
    aria-labelledby={titleId}
    onCancel={(event) => { event.preventDefault(); onClose() }}
    onClick={(event) => {
      const dialog = dialogRef.current
      if (!closeOnBackdrop || event.target !== dialog) return
      const bounds = dialog.getBoundingClientRect()
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose()
    }}
  >
    <div className={`kvzd-modal__header ${classNames?.header ?? ''}`.trim()} style={styles?.header}>
      <h2 className={`govuk-heading-m kvzd-modal__title ${classNames?.title ?? ''}`.trim()} style={styles?.title} id={titleId}>{title}</h2>
      <button className={`kvzd-modal__close ${classNames?.close ?? ''}`.trim()} style={styles?.close} type="button" aria-label={closeLabel} onClick={onClose}>×</button>
    </div>
    <div className={`kvzd-modal__body ${classNames?.body ?? ''}`.trim()} style={styles?.body}>{children}</div>
    {footer && <div className={`kvzd-modal__footer ${classNames?.footer ?? ''}`.trim()} style={styles?.footer}>{footer}</div>}
  </dialog>
})
