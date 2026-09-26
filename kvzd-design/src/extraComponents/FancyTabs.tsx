import { forwardRef, useId, useRef, useState, type HTMLAttributes } from 'react'
import type { SemanticStyling, TabsProps } from '../components/index'

export type FancyTabsProps = Omit<TabsProps, 'styles' | 'classNames' | 'destroyOnClose'>
  & Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children' | 'style' | 'className'>
  & SemanticStyling<'root' | 'list' | 'tab' | 'panel'>
  & { destroyOnClose?: boolean }

export const FancyTabs = forwardRef<HTMLDivElement, FancyTabsProps>(function FancyTabs({ items, activeKey, defaultActiveKey, onChange, destroyOnClose = false, style, styles, classNames, className = '', ...props }, ref) {
  const [inner, setInner] = useState(defaultActiveKey ?? items.find((item) => !item.disabled)?.key)
  const current = activeKey ?? inner
  const id = useId().replaceAll(':', '')
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const select = (key: string) => {
    if (items.find((item) => item.key === key)?.disabled) return
    if (activeKey === undefined) setInner(key)
    onChange?.(key)
  }

  const move = (key: string) => {
    select(key)
    tabRefs.current[key]?.focus()
  }

  const step = (index: number, offset: number) => {
    for (let next = (index + offset + items.length) % items.length; next !== index; next = (next + offset + items.length) % items.length) {
      const nextItem = items[next]
      if (nextItem && !nextItem.disabled) return nextItem
    }
    return undefined
  }

  return <div ref={ref} className={`kvzd-design-fancy-tabs ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }} {...props}>
    <div className={`kvzd-design-fancy-tabs__list ${classNames?.list ?? ''}`.trim()} style={styles?.list} role="tablist">
      {items.map((item, index) => {
        const selected = item.key === current
        const tabId = `${id}-tab-${item.key}`
        const panelId = `${id}-panel-${item.key}`
        return <button
          className={`kvzd-design-fancy-tabs__tab ${item.disabled ? 'kvzd-design-fancy-tabs__tab--disabled' : ''} ${classNames?.tab ?? ''}`.trim()}
          style={styles?.tab}
          id={tabId}
          key={item.key}
          type="button"
          role="tab"
          aria-controls={panelId}
          aria-selected={selected}
          aria-disabled={item.disabled || undefined}
          tabIndex={selected && !item.disabled ? 0 : -1}
          ref={(node) => { tabRefs.current[item.key] = node }}
          onClick={() => select(item.key)}
          onKeyDown={(event) => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
            event.preventDefault()
            const nextItem = step(index, event.key === 'ArrowRight' ? 1 : -1)
            if (nextItem) move(nextItem.key)
          }}
        >{item.label}</button>
      })}
    </div>
    {items.map((item) => {
      const selected = item.key === current
      if (destroyOnClose && !selected) return null
      return <div
        className={`kvzd-design-fancy-tabs__panel ${classNames?.panel ?? ''}`.trim()}
        style={styles?.panel}
        id={`${id}-panel-${item.key}`}
        key={item.key}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${item.key}`}
        hidden={!selected}
      >{item.children}</div>
    })}
  </div>
})
