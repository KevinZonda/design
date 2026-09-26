import { forwardRef, useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type DialogHTMLAttributes, type ReactNode } from 'react'
import { Button, type SemanticStyling } from '../components/index'

export interface ModalProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'title' | 'onClose'>, SemanticStyling<'root' | 'header' | 'title' | 'close' | 'body' | 'footer'> {
  open?: boolean
  defaultOpen?: boolean
  title: ReactNode
  children: ReactNode
  onClose: () => void
  footer?: ReactNode | null
  closeLabel?: string
  closeOnBackdrop?: boolean
  /** Show the default dark backdrop. Pass false to let the page show through. */
  mask?: boolean
  keyboard?: boolean
  closable?: boolean
  width?: number | string
  centered?: boolean
  okText?: ReactNode
  cancelText?: ReactNode
  onOk?: () => void | Promise<void>
  /** Extra props spread onto the builtin OK button. */
  okButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>
  /** Extra props spread onto the builtin Cancel button. */
  cancelButtonProps?: ButtonHTMLAttributes<HTMLButtonElement>
  confirmLoading?: boolean
  destroyOnClose?: boolean
  afterOpenChange?: (open: boolean) => void
  afterClose?: () => void
}

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal({ open, defaultOpen = false, title, children, onClose, footer, closeLabel = 'Close', closeOnBackdrop = true, mask = true, keyboard = true, closable = true, width, centered = false, okText = 'Confirm', cancelText = 'Cancel', onOk, okButtonProps, cancelButtonProps, confirmLoading = false, destroyOnClose = false, afterOpenChange, afterClose, className = '', classNames, style, styles, onCancel, onClick, ...props }, forwardedRef) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const restoreFocusRef = useRef<Element | null>(null)
  const titleId = useId()
  const bodyId = useId()
  const [innerOpen, setInnerOpen] = useState(defaultOpen)
  const [internalLoading, setInternalLoading] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const expanded = open ?? innerOpen
  const okPending = confirmLoading || internalLoading

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (expanded && !dialog.open) {
      restoreFocusRef.current = document.activeElement
      dialog.showModal()
      setHasOpened(true)
      afterOpenChange?.(true)
    }
    if (!expanded && dialog.open) {
      dialog.close()
      afterOpenChange?.(false)
      afterClose?.()
    }
  }, [expanded])

  const closeModal = () => {
    if (open === undefined) setInnerOpen(false)
    onClose()
  }

  const handleOk = () => {
    if (!onOk || okPending) return
    const result = onOk()
    if (result && typeof result.then === 'function') {
      setInternalLoading(true)
      result.finally(() => setInternalLoading(false))
    }
  }

  const showBuiltinFooter = footer === undefined && onOk !== undefined
  const okClassName = `kvzd-design-modal__ok ${okButtonProps?.className ?? ''}`.trim()
  const footerContent = footer !== undefined ? footer : showBuiltinFooter
    ? <><Button variant="secondary" {...cancelButtonProps} onClick={(event) => { cancelButtonProps?.onClick?.(event); closeModal() }}>{cancelText}</Button><Button className={okClassName} {...okButtonProps} loading={okPending} onClick={(event) => { okButtonProps?.onClick?.(event); handleOk() }}>{okText}</Button></>
    : null

  const renderBody = !(destroyOnClose && hasOpened && !expanded)

  return <dialog
    ref={(node) => {
      dialogRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    }}
    className={`kvzd-design-modal ${centered ? 'kvzd-design-modal--centered' : ''} ${mask ? '' : 'kvzd-design-modal--no-mask'} ${classNames?.root ?? ''} ${className}`.trim()}
    style={{ width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined, ...styles?.root, ...style }}
    aria-labelledby={titleId}
    aria-describedby={renderBody ? bodyId : undefined}
    onCancel={(event) => { onCancel?.(event); if (event.defaultPrevented) return; if (!keyboard) { event.preventDefault(); return } event.preventDefault(); closeModal() }}
    onClose={() => {
      const target = restoreFocusRef.current
      restoreFocusRef.current = null
      if (target instanceof HTMLElement && document.contains(target)) target.focus()
    }}
    onClick={(event) => {
      onClick?.(event)
      if (event.defaultPrevented) return
      const dialog = dialogRef.current
      if (!closeOnBackdrop || event.target !== dialog) return
      const bounds = dialog.getBoundingClientRect()
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeModal()
    }}
    {...props}
  >
    <div className={`kvzd-design-modal__header ${classNames?.header ?? ''}`.trim()} style={styles?.header}>
      <h2 className={`govuk-heading-m kvzd-design-modal__title ${classNames?.title ?? ''}`.trim()} style={styles?.title} id={titleId}>{title}</h2>
      {closable && <button className={`kvzd-design-modal__close ${classNames?.close ?? ''}`.trim()} style={styles?.close} type="button" aria-label={closeLabel} onClick={closeModal}>×</button>}
    </div>
    {renderBody && <div className={`kvzd-design-modal__body ${classNames?.body ?? ''}`.trim()} style={styles?.body} id={bodyId}>{children}</div>}
    {footerContent !== null && footerContent !== undefined && <div className={`kvzd-design-modal__footer ${classNames?.footer ?? ''}`.trim()} style={styles?.footer}>{footerContent}</div>}
  </dialog>
})
