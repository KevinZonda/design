import { forwardRef, useId, useRef, useState } from 'react'
import type { SemanticStyling, TabsProps } from '../components/index'

export type FancyTabsProps = Omit<TabsProps, 'styles' | 'classNames'> & SemanticStyling<'root' | 'list' | 'tab' | 'panel'>

export const FancyTabs = forwardRef<HTMLDivElement, FancyTabsProps>(function FancyTabs({ items, activeKey, defaultActiveKey, onChange, style, styles, classNames }, ref) {
  const [inner, setInner] = useState(defaultActiveKey ?? items[0]?.key)
  const current = activeKey ?? inner
  const id = useId().replaceAll(':', '')
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const select = (key: string) => {
    if (activeKey === undefined) setInner(key)
    onChange?.(key)
  }

  const move = (key: string) => {
    select(key)
    tabRefs.current[key]?.focus()
  }

  return <div ref={ref} className={`kvzd-design-fancy-tabs ${classNames?.root ?? ''}`.trim()} style={{ ...styles?.root, ...style }}>
    <div className={`kvzd-design-fancy-tabs__list ${classNames?.list ?? ''}`.trim()} style={styles?.list} role="tablist">
      {items.map((item, index) => {
        const selected = item.key === current
        const tabId = `${id}-tab-${item.key}`
        const panelId = `${id}-panel-${item.key}`
        return <button
          className={`kvzd-design-fancy-tabs__tab ${classNames?.tab ?? ''}`.trim()}
          style={styles?.tab}
          id={tabId}
          key={item.key}
          type="button"
          role="tab"
          aria-controls={panelId}
          aria-selected={selected}
          tabIndex={selected ? 0 : -1}
          ref={(node) => { tabRefs.current[item.key] = node }}
          onClick={() => select(item.key)}
          onKeyDown={(event) => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
            event.preventDefault()
            const offset = event.key === 'ArrowRight' ? 1 : -1
            const next = (index + offset + items.length) % items.length
            const nextItem = items[next]
            if (nextItem) move(nextItem.key)
          }}
        >{item.label}</button>
      })}
    </div>
    {items.map((item) => {
      const selected = item.key === current
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
