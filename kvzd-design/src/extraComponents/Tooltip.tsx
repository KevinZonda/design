import { Children, cloneElement, forwardRef, useEffect, useId, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { SemanticStyling } from '../components/index'

export interface TooltipProps extends SemanticStyling<'root' | 'popup'> {
  title: ReactNode
  children: ReactElement
  placement?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'focus' | 'click'
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Mount the popup into a custom container with fixed positioning; useful inside overflow-clipping scroll areas. */
  getPopupContainer?: () => HTMLElement
  className?: string
  style?: CSSProperties
}

const fixedOffset: Record<TooltipProps['placement'] & string, { top?: string; left?: string; right?: string; transform: string }> = {
  top: { transform: 'translate(-50%, calc(-100% - 8px))' },
  bottom: { transform: 'translate(-50%, 8px)' },
  left: { transform: 'translate(calc(-100% - 8px), -50%)' },
  right: { transform: 'translate(8px, -50%)' },
}

export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip({ title, children, placement = 'top', trigger = 'hover', open, defaultOpen = false, onOpenChange, getPopupContainer, className = '', classNames, style, styles }, ref) {
  const [inner, setInner] = useState(defaultOpen)
  const expanded = open ?? inner
  const id = useId().replaceAll(':', '')
  const hoverCount = useRef(0)
  const rootRef = useRef<HTMLSpanElement | null>(null)
  const [fixedStyle, setFixedStyle] = useState<CSSProperties | null>(null)
  const setExpanded = (next: boolean) => { if (open === undefined) setInner(next); onOpenChange?.(next) }

  useEffect(() => {
    if (!expanded || !getPopupContainer) return
    const update = () => {
      const rect = rootRef.current?.getBoundingClientRect()
      if (!rect) return
      const anchor = {
        top: { top: `${rect.top}px`, left: `${rect.left + rect.width / 2}px` },
        bottom: { top: `${rect.bottom}px`, left: `${rect.left + rect.width / 2}px` },
        left: { top: `${rect.top + rect.height / 2}px`, left: `${rect.left}px` },
        right: { top: `${rect.top + rect.height / 2}px`, left: `${rect.right}px` },
      }[placement]
      setFixedStyle({ position: 'fixed', ...anchor, transform: fixedOffset[placement].transform, zIndex: 30 })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true) }
  }, [expanded, placement, getPopupContainer])

  const plainTitle = typeof title === 'string' || typeof title === 'number'
  const child = Children.only(children)
  const childProps = child.props as Record<string, unknown>
  const describedBy: Record<string, string | undefined> = { 'aria-describedby': expanded && plainTitle ? id : undefined }

  const handlers = trigger === 'click'
    ? { onClick: () => setExpanded(!expanded) }
    : trigger === 'focus'
      ? { onFocus: () => setExpanded(true), onBlur: () => setExpanded(false) }
      : {
          onMouseEnter: () => { hoverCount.current += 1; setExpanded(true) },
          onMouseLeave: () => { hoverCount.current = Math.max(0, hoverCount.current - 1); if (!hoverCount.current) setExpanded(false) },
          onFocus: () => setExpanded(true),
          onBlur: () => setExpanded(false),
        }

  const popup = expanded ? <span id={id} role="tooltip" className={`kvzd-design-tooltip__popup kvzd-design-tooltip--${placement} ${getPopupContainer ? 'kvzd-design-tooltip__popup--fixed' : ''} ${classNames?.popup ?? ''}`.trim()} style={{ ...styles?.popup, ...(getPopupContainer ? fixedStyle : {}) }}>
    {title}
    <span className="kvzd-design-tooltip__arrow" aria-hidden="true" />
  </span> : null

  return <span ref={(node) => { rootRef.current = node; if (typeof ref === 'function') ref(node); else if (ref) (ref as { current: HTMLSpanElement | null }).current = node }} className={`kvzd-design-tooltip ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
    {cloneElement(child, { ...describedBy, ...handlers, ...childProps })}
    {getPopupContainer && popup ? createPortal(popup, getPopupContainer()) : popup}
  </span>
})
