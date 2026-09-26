import { forwardRef, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Button, type SemanticStyling } from '../components/index'

export interface ModalProps extends SemanticStyling<'root' | 'header' | 'title' | 'close' | 'body' | 'footer'> {
  open: boolean
  title: ReactNode
  children: ReactNode
  onClose: () => void
  footer?: ReactNode | null
  closeLabel?: string
  closeOnBackdrop?: boolean
  keyboard?: boolean
  closable?: boolean
  width?: number | string
  centered?: boolean
  okText?: ReactNode
  cancelText?: ReactNode
  onOk?: () => void | Promise<void>
  confirmLoading?: boolean
  destroyOnClose?: boolean
  className?: string
  style?: CSSProperties
}

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal({ open, title, children, onClose, footer, closeLabel = 'Close', closeOnBackdrop = true, keyboard = true, closable = true, width, centered = false, okText = 'Confirm', cancelText = 'Cancel', onOk, confirmLoading = false, destroyOnClose = false, className = '', classNames, style, styles }, forwardedRef) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const restoreFocusRef = useRef<Element | null>(null)
  const titleId = useId()
  const [internalLoading, setInternalLoading] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const okPending = confirmLoading || internalLoading

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      restoreFocusRef.current = document.activeElement
      dialog.showModal()
      setHasOpened(true)
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  const handleOk = () => {
    if (!onOk || okPending) return
    const result = onOk()
    if (result && typeof result.then === 'function') {
      setInternalLoading(true)
      result.finally(() => setInternalLoading(false))
    }
  }

  const showBuiltinFooter = footer === undefined && (onOk !== undefined || okText !== 'Confirm' || cancelText !== 'Cancel')
  const footerContent = footer !== undefined ? footer : showBuiltinFooter
    ? <><Button type="secondary" onClick={onClose}>{cancelText}</Button><Button className="kvzd-design-modal__ok" loading={okPending} onClick={handleOk}>{okText}</Button></>
    : null

  const renderBody = !(destroyOnClose && hasOpened && !open)

  return <dialog
    ref={(node) => {
      dialogRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    }}
    className={`kvzd-design-modal ${centered ? 'kvzd-design-modal--centered' : ''} ${classNames?.root ?? ''} ${className}`.trim()}
    style={{ width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined, ...styles?.root, ...style }}
    aria-labelledby={titleId}
    onCancel={(event) => { if (!keyboard) { event.preventDefault(); return } event.preventDefault(); onClose() }}
    onClose={() => {
      const target = restoreFocusRef.current
      restoreFocusRef.current = null
      if (target instanceof HTMLElement && document.contains(target)) target.focus()
    }}
    onClick={(event) => {
      const dialog = dialogRef.current
      if (!closeOnBackdrop || event.target !== dialog) return
      const bounds = dialog.getBoundingClientRect()
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose()
    }}
  >
    <div className={`kvzd-design-modal__header ${classNames?.header ?? ''}`.trim()} style={styles?.header}>
      <h2 className={`govuk-heading-m kvzd-design-modal__title ${classNames?.title ?? ''}`.trim()} style={styles?.title} id={titleId}>{title}</h2>
      {closable && <button className={`kvzd-design-modal__close ${classNames?.close ?? ''}`.trim()} style={styles?.close} type="button" aria-label={closeLabel} onClick={onClose}>×</button>}
    </div>
    {renderBody && <div className={`kvzd-design-modal__body ${classNames?.body ?? ''}`.trim()} style={styles?.body}>{children}</div>}
    {footerContent !== null && footerContent !== undefined && footerContent !== false && <div className={`kvzd-design-modal__footer ${classNames?.footer ?? ''}`.trim()} style={styles?.footer}>{footerContent}</div>}
  </dialog>
})
