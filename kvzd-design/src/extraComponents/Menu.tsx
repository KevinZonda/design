import { forwardRef, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import type { IClickBehaviour, SemanticStyling } from '../components/index'

export interface MenuItem extends IClickBehaviour {
  key: string
  label: ReactNode
  disabled?: boolean
}

export interface MenuProps extends SemanticStyling<'root' | 'item'> {
  items: MenuItem[]
  ariaLabel: string
  autoFocus?: boolean
  onAction?: (key: string) => void
  onEscape?: () => void
  className?: string
  style?: CSSProperties
}

export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu({ items, ariaLabel, autoFocus = false, onAction, onEscape, className = '', classNames, style, styles }, forwardedRef) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [activeKey, setActiveKey] = useState(items.find((item) => !item.disabled)?.key)

  useEffect(() => {
    if (autoFocus) menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])')?.focus()
  }, [autoFocus])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
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
    className={`kvzd-menu ${classNames?.root ?? ''} ${className}`.trim()}
    style={{ ...styles?.root, ...style }}
    role="menu"
    aria-label={ariaLabel}
    onKeyDown={onKeyDown}
  >{items.map((item) => item.href !== undefined && !item.onClick && !item.disabled
      ? <a className={`kvzd-menu__item ${classNames?.item ?? ''}`.trim()} style={styles?.item} role="menuitem" key={item.key} href={item.href} tabIndex={activeKey === item.key ? 0 : -1} onFocus={() => setActiveKey(item.key)} onClick={() => onAction?.(item.key)}>{item.label}</a>
      : <button className={`kvzd-menu__item ${classNames?.item ?? ''}`.trim()} style={styles?.item} role="menuitem" key={item.key} type="button" tabIndex={!item.disabled && activeKey === item.key ? 0 : -1} disabled={item.disabled} aria-disabled={item.disabled || undefined} onFocus={() => setActiveKey(item.key)} onClick={(event) => { item.onClick?.(event); onAction?.(item.key) }}>{item.label}</button>)}</div>
})
