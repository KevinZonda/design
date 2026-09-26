import { Children, cloneElement, forwardRef, useId, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from 'react'
import type { SemanticStyling } from '../components/index'

export interface TooltipProps extends SemanticStyling<'root' | 'popup'> {
  title: ReactNode
  children: ReactElement
  placement?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'focus' | 'click'
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  style?: CSSProperties
}

export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip({ title, children, placement = 'top', trigger = 'hover', open, defaultOpen = false, onOpenChange, className = '', classNames, style, styles }, ref) {
  const [inner, setInner] = useState(defaultOpen)
  const expanded = open ?? inner
  const id = useId().replaceAll(':', '')
  const hoverCount = useRef(0)
  const setExpanded = (next: boolean) => { if (open === undefined) setInner(next); onOpenChange?.(next) }

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

  return <span ref={ref} className={`kvzd-design-tooltip ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
    {cloneElement(child, { ...describedBy, ...handlers, ...childProps })}
    {expanded && <span id={id} role="tooltip" className={`kvzd-design-tooltip__popup kvzd-design-tooltip--${placement} ${classNames?.popup ?? ''}`.trim()} style={styles?.popup}>
      {title}
      <span className="kvzd-design-tooltip__arrow" aria-hidden="true" />
    </span>}
  </span>
})
