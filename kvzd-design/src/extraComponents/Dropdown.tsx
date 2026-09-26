import { forwardRef, useCallback, useEffect, useRef, useState, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import type { SemanticStyling } from '../components/index'
import { Menu, type MenuItem } from './Menu'

export interface DropdownProps extends HTMLAttributes<HTMLDivElement>, SemanticStyling<'root' | 'trigger' | 'popup'> {
  label: ReactNode
  items: MenuItem[]
  ariaLabel: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onAction?: (key: string) => void
  trigger?: 'click' | 'hover'
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** Disable the trigger button without hiding the dropdown. */
  disabled?: boolean
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(function Dropdown({ label, items, ariaLabel, open, defaultOpen = false, onOpenChange, onAction, trigger = 'click', placement = 'bottom', disabled = false, className = '', classNames, style, styles, onMouseEnter, onMouseLeave, ...props }, ref) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen)
  const expanded = open ?? innerOpen
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const setExpanded = useCallback((next: boolean) => { if (open === undefined) setInnerOpen(next); onOpenChange?.(next) }, [open, onOpenChange])

  useEffect(() => {
    if (!expanded) return
    const outside = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) setExpanded(false) }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [expanded, setExpanded])

  const handleMouseEnter = (event: MouseEvent<HTMLDivElement>) => { onMouseEnter?.(event); if (trigger === 'hover' && !disabled) setExpanded(true) }
  const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => { onMouseLeave?.(event); if (trigger === 'hover') setExpanded(false) }

  return <div
    ref={(node) => {
      rootRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    }}
    className={`kvzd-design-dropdown ${classNames?.root ?? ''} ${className}`.trim()}
    style={{ ...styles?.root, ...style }}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    {...props}
  >
    <button ref={triggerRef} className={`govuk-button govuk-button--secondary kvzd-design-dropdown__trigger ${classNames?.trigger ?? ''}`.trim()} style={styles?.trigger} type="button" disabled={disabled} aria-haspopup="menu" aria-expanded={expanded} onClick={() => trigger === 'click' && !disabled && setExpanded(!expanded)}>{label}<span className="kvzd-design-dropdown__chevron" aria-hidden="true" /></button>
    {expanded && <div className={`kvzd-design-dropdown__popup kvzd-design-dropdown--${placement} ${classNames?.popup ?? ''}`.trim()} style={styles?.popup}><Menu items={items} ariaLabel={ariaLabel} autoFocus onAction={(key) => { onAction?.(key); setExpanded(false); triggerRef.current?.focus() }} onEscape={() => { setExpanded(false); triggerRef.current?.focus() }} /></div>}
  </div>
})
