import { forwardRef, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { SemanticStyling } from '@kvzd-design/gov-uk'
import { Menu, type MenuItem } from './Menu'

export interface DropdownProps extends SemanticStyling<'root' | 'trigger' | 'popup'> {
  label: ReactNode
  items: MenuItem[]
  menuLabel: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onAction?: (key: string) => void
  className?: string
  style?: CSSProperties
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(function Dropdown({ label, items, menuLabel, open, defaultOpen = false, onOpenChange, onAction, className = '', classNames, style, styles }, ref) {
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

  return <div ref={(node) => {
    rootRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }} className={`kvzd-dropdown ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
    <button ref={triggerRef} className={`govuk-button govuk-button--secondary kvzd-dropdown__trigger ${classNames?.trigger ?? ''}`.trim()} style={styles?.trigger} type="button" aria-haspopup="menu" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{label}<span className="kvzd-dropdown__chevron" aria-hidden="true" /></button>
    {expanded && <div className={`kvzd-dropdown__popup ${classNames?.popup ?? ''}`.trim()} style={styles?.popup}><Menu items={items} ariaLabel={menuLabel} autoFocus onAction={(key) => { onAction?.(key); setExpanded(false); triggerRef.current?.focus() }} onEscape={() => { setExpanded(false); triggerRef.current?.focus() }} /></div>}
  </div>
})
