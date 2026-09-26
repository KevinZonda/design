import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react'
import type { ClickBehaviourProps, SemanticStyling } from '../components/index'

export interface MenuItem extends ClickBehaviourProps {
  key: string
  label: ReactNode
  disabled?: boolean
  icon?: ReactNode
  danger?: boolean
  type?: 'item' | 'divider'
}

export interface MenuProps extends HTMLAttributes<HTMLDivElement>, SemanticStyling<'root' | 'item'> {
  items: MenuItem[]
  ariaLabel: string
  autoFocus?: boolean
  onAction?: (key: string) => void
  onEscape?: () => void
}

export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu({ items, ariaLabel, autoFocus = false, onAction, onEscape, className = '', classNames, style, styles, onKeyDown, ...props }, forwardedRef) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [activeKey, setActiveKey] = useState(items.find((item) => item.type !== 'divider' && !item.disabled)?.key)

  useEffect(() => {
    if (autoFocus) menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')?.focus()
  }, [autoFocus])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.key === 'Escape') { event.stopPropagation(); onEscape?.(); return }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    const controls = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? [])
    if (!controls.length) return
    event.preventDefault()
    const current = controls.indexOf(document.activeElement as HTMLElement)
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? controls.length - 1
      : event.key === 'ArrowDown' ? (current + 1) % controls.length : (current - 1 + controls.length) % controls.length
    controls[next]?.focus()
  }

  return <div
    ref={(node) => {
      menuRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    }}
    className={`kvzd-design-menu ${classNames?.root ?? ''} ${className}`.trim()}
    style={{ ...styles?.root, ...style }}
    role="menu"
    aria-label={ariaLabel}
    onKeyDown={handleKeyDown}
    {...props}
  >{items.map((item) => item.type === 'divider'
      ? <hr className="kvzd-design-menu__divider" role="separator" key={item.key} />
      : item.href !== undefined && !item.onClick && !item.disabled
        ? <a className={`kvzd-design-menu__item ${item.danger ? 'kvzd-design-menu__item--danger' : ''} ${classNames?.item ?? ''}`.trim()} style={styles?.item} role="menuitem" key={item.key} href={item.href} tabIndex={activeKey === item.key ? 0 : -1} onFocus={() => setActiveKey(item.key)} onClick={() => onAction?.(item.key)}>{item.icon !== undefined && item.icon !== null ? <span className="kvzd-design-menu__icon" aria-hidden="true">{item.icon}</span> : null}{item.label}</a>
        : <button className={`kvzd-design-menu__item ${item.danger ? 'kvzd-design-menu__item--danger' : ''} ${classNames?.item ?? ''}`.trim()} style={styles?.item} role="menuitem" key={item.key} type="button" tabIndex={!item.disabled && activeKey === item.key ? 0 : -1} disabled={item.disabled} aria-disabled={item.disabled || undefined} onFocus={() => setActiveKey(item.key)} onClick={(event) => { item.onClick?.(event); onAction?.(item.key) }}>{item.icon !== undefined && item.icon !== null ? <span className="kvzd-design-menu__icon" aria-hidden="true">{item.icon}</span> : null}{item.label}</button>)}</div>
})
