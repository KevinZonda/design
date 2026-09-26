import { forwardRef, useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, Key, ReactElement, ReactNode, Ref, RefAttributes } from 'react'
import { Tag } from './Tag'
import { ClickTarget, type IClickBehaviour } from './clickBehaviour'
import type { SemanticStyling } from './styling'

export interface TableColumn<T> { title: ReactNode; dataIndex: keyof T; key?: string; numeric?: boolean; rowHeader?: boolean; render?: (value: T[keyof T], record: T, index: number) => ReactNode }
export interface TableProps<T> extends SemanticStyling<'root' | 'caption' | 'head' | 'body' | 'row' | 'header' | 'cell'> { columns: TableColumn<T>[]; dataSource: T[]; caption?: ReactNode; rowKey?: keyof T | ((record: T) => Key); className?: string; style?: CSSProperties }
const TableWithRef = forwardRef(function Table<T extends object>({ caption, columns, dataSource, rowKey, className = '', style, styles, classNames }: TableProps<T>, ref: Ref<HTMLTableElement>) {
  const keyFor = (record: T, index: number) => typeof rowKey === 'function' ? rowKey(record) : rowKey ? String(record[rowKey]) : index
  return <table ref={ref} className={`govuk-table ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
    {caption && <caption className={`govuk-table__caption govuk-table__caption--m ${classNames?.caption ?? ''}`.trim()} style={styles?.caption}>{caption}</caption>}
    <thead className={`govuk-table__head ${classNames?.head ?? ''}`.trim()} style={styles?.head}>
      <tr className={`govuk-table__row ${classNames?.row ?? ''}`.trim()} style={styles?.row}>
        {columns.map((column) => <th className={`govuk-table__header ${column.numeric ? 'govuk-table__header--numeric' : ''} ${classNames?.header ?? ''}`.trim()} style={styles?.header} scope="col" key={column.key ?? String(column.dataIndex)}>{column.title}</th>)}
      </tr>
    </thead>
    <tbody className={`govuk-table__body ${classNames?.body ?? ''}`.trim()} style={styles?.body}>
      {dataSource.map((record, rowIndex) => <tr className={`govuk-table__row ${classNames?.row ?? ''}`.trim()} style={styles?.row} key={keyFor(record, rowIndex)}>
        {columns.map((column) => {
          const value = record[column.dataIndex]
          const content = column.render ? column.render(value, record, rowIndex) : String(value ?? '')
          const slot = column.rowHeader ? 'header' : 'cell'
          const base = column.rowHeader ? 'govuk-table__header' : 'govuk-table__cell'
          const classes = `${base} ${column.numeric ? `${base}--numeric` : ''} ${classNames?.[slot] ?? ''}`.trim()
          return column.rowHeader
            ? <th className={classes} style={styles?.header} scope="row" key={column.key ?? String(column.dataIndex)}>{content}</th>
            : <td className={classes} style={styles?.cell} key={column.key ?? String(column.dataIndex)}>{content}</td>
        })}
      </tr>)}
    </tbody>
  </table>
})
export const Table = TableWithRef as <T extends object>(props: TableProps<T> & RefAttributes<HTMLTableElement>) => ReactElement | null

export interface SummaryAction extends IClickBehaviour { label: ReactNode; visuallyHiddenText?: string }
export interface SummaryItem { key: ReactNode; value: ReactNode; actions?: SummaryAction[] }
export interface SummaryListProps extends SemanticStyling<'root' | 'row' | 'key' | 'value' | 'actions' | 'link'> { items: SummaryItem[]; bordered?: boolean; className?: string; style?: CSSProperties }
export const SummaryList = forwardRef<HTMLDListElement, SummaryListProps>(function SummaryList({ items, bordered = true, className = '', style, styles, classNames }, ref) {
  return <dl ref={ref} style={{ ...styles?.root, ...style }} className={`govuk-summary-list ${bordered ? '' : 'govuk-summary-list--no-border'} ${classNames?.root ?? ''} ${className}`.trim()}>
    {items.map((item, index) => <div className={`govuk-summary-list__row ${classNames?.row ?? ''}`.trim()} style={styles?.row} key={index}>
      <dt className={`govuk-summary-list__key ${classNames?.key ?? ''}`.trim()} style={styles?.key}>{item.key}</dt>
      <dd className={`govuk-summary-list__value ${classNames?.value ?? ''}`.trim()} style={styles?.value}>{item.value}</dd>
      {item.actions && <dd className={`govuk-summary-list__actions ${classNames?.actions ?? ''}`.trim()} style={styles?.actions}>
        {item.actions.map((action, actionIndex) => <span key={action.href ?? actionIndex}>{actionIndex > 0 && ' '}<ClickTarget className={`govuk-link ${classNames?.link ?? ''}`.trim()} style={styles?.link} href={action.href} onClick={action.onClick}>{action.label}{action.visuallyHiddenText && <span className="govuk-visually-hidden"> {action.visuallyHiddenText}</span>}</ClickTarget></span>)}
      </dd>}
    </div>)}
  </dl>
})

export interface TaskItem extends IClickBehaviour { title: ReactNode; status: ReactNode; hint?: ReactNode; statusColor?: Parameters<typeof Tag>[0]['color'] }
export interface TaskListProps extends SemanticStyling<'root' | 'item' | 'nameAndHint' | 'link' | 'hint' | 'status'> { items: TaskItem[]; className?: string; style?: CSSProperties }
export const TaskList = forwardRef<HTMLUListElement, TaskListProps>(function TaskList({ items, className = '', style, styles, classNames }, ref) {
  return <ul ref={ref} className={`govuk-task-list ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
    {items.map((item, index) => <li className={`govuk-task-list__item ${item.href !== undefined || item.onClick ? 'govuk-task-list__item--with-link' : ''} ${classNames?.item ?? ''}`.trim()} style={styles?.item} key={`${item.href ?? ''}-${index}`}>
      <div className={`govuk-task-list__name-and-hint ${classNames?.nameAndHint ?? ''}`.trim()} style={styles?.nameAndHint}>
        <ClickTarget className={`govuk-link govuk-task-list__link ${classNames?.link ?? ''}`.trim()} style={styles?.link} href={item.href} onClick={item.onClick} anchorProps={{ 'aria-describedby': `task-status-${index}` }}>{item.title}</ClickTarget>
        {item.hint && <div className={`govuk-task-list__hint ${classNames?.hint ?? ''}`.trim()} style={styles?.hint}>{item.hint}</div>}
      </div>
      <div className={`govuk-task-list__status ${classNames?.status ?? ''}`.trim()} style={styles?.status} id={`task-status-${index}`}>{item.statusColor ? <Tag color={item.statusColor}>{item.status}</Tag> : item.status}</div>
    </li>)}
  </ul>
})

export interface TabItem { key: string; label: ReactNode; children: ReactNode; disabled?: boolean }
export interface TabsProps extends SemanticStyling<'root' | 'title' | 'list' | 'tab' | 'panel'> { items: TabItem[]; activeKey?: string; defaultActiveKey?: string; onChange?: (key: string) => void; destroyOnInactive?: boolean; style?: CSSProperties }

function useTabsEnhanced() {
  const query = '(min-width: 40.0625em)'
  const [enhanced, setEnhanced] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const update = () => setEnhanced(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return enhanced
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs({ items, activeKey, defaultActiveKey, onChange, destroyOnInactive = false, style, styles, classNames }, ref) {
  const enhanced = useTabsEnhanced()
  const [inner, setInner] = useState(defaultActiveKey ?? items[0]?.key)
  const current = activeKey ?? inner
  const id = useId().replaceAll(':', '')
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const select = (key: string) => { const item = items.find((entry) => entry.key === key); if (item?.disabled) return; if (activeKey === undefined) setInner(key); onChange?.(key) }
  const move = (key: string) => { select(key); tabRefs.current[key]?.focus() }
  const step = (index: number, offset: number) => {
    for (let next = (index + offset + items.length) % items.length; next !== index; next = (next + offset + items.length) % items.length) {
      const nextItem = items[next]
      if (nextItem && !nextItem.disabled) return nextItem
    }
    return undefined
  }
  return <div className={`govuk-tabs ${classNames?.root ?? ''}`.trim()} style={{ ...styles?.root, ...style }} ref={ref}>
    <h2 className={`govuk-tabs__title ${classNames?.title ?? ''}`.trim()} style={styles?.title}>Contents</h2>
    <ul className={`govuk-tabs__list ${classNames?.list ?? ''}`.trim()} style={styles?.list} role={enhanced ? 'tablist' : undefined}>
      {items.map((item, index) => {
        const panelId = `${id}-panel-${item.key}`
        const tabId = `${id}-tab-${item.key}`
        const selected = item.key === current
        return <li className={`govuk-tabs__list-item ${enhanced && selected ? 'govuk-tabs__list-item--selected' : ''}`.trim()} role={enhanced ? 'presentation' : undefined} key={item.key}>
          <a
            className={`govuk-tabs__tab ${item.disabled ? 'govuk-tabs__tab--disabled' : ''} ${classNames?.tab ?? ''}`.trim()}
            style={styles?.tab}
            href={item.disabled ? undefined : `#${panelId}`}
            role={enhanced ? 'tab' : undefined}
            id={enhanced ? tabId : undefined}
            aria-controls={enhanced ? panelId : undefined}
            aria-selected={enhanced ? selected : undefined}
            aria-disabled={item.disabled || undefined}
            tabIndex={enhanced ? (selected && !item.disabled ? 0 : -1) : item.disabled ? -1 : undefined}
            ref={(node) => { tabRefs.current[item.key] = node }}
            onClick={enhanced || item.disabled ? (event) => { event.preventDefault(); select(item.key) } : undefined}
            onKeyDown={enhanced ? (event) => {
              if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
              event.preventDefault()
              const nextItem = step(index, event.key === 'ArrowRight' ? 1 : -1)
              if (nextItem) move(nextItem.key)
            } : undefined}
          >{item.label}</a>
        </li>
      })}
    </ul>
    {items.map((item) => {
      const selected = item.key === current
      if (destroyOnInactive && !selected) return null
      const panelId = `${id}-panel-${item.key}`
      return <section
        className={`govuk-tabs__panel ${enhanced && !selected ? 'govuk-tabs__panel--hidden' : ''} ${classNames?.panel ?? ''}`.trim()}
        style={styles?.panel}
        role={enhanced ? 'tabpanel' : undefined}
        id={panelId}
        aria-labelledby={enhanced ? `${id}-tab-${item.key}` : undefined}
        key={item.key}
        hidden={enhanced && !selected}
      >{item.children}</section>
    })}
  </div>
})

export interface AccordionItem { key: string; heading: ReactNode; summary?: ReactNode; children: ReactNode; expanded?: boolean }
export interface AccordionProps { items: AccordionItem[]; showAllText?: string; hideAllText?: string; openKeys?: string[]; onChange?: (openKeys: string[]) => void; style?: CSSProperties }
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion({ items, showAllText = 'Show all sections', hideAllText = 'Hide all sections', openKeys: controlledOpenKeys, onChange, style }, ref) {
  const accordionId = useId().replaceAll(':', '')
  const [innerOpenKeys, setInnerOpenKeys] = useState(() => items.filter((item) => item.expanded).map((item) => item.key))
  const openKeys = controlledOpenKeys ?? innerOpenKeys
  const allOpen = items.every((item) => openKeys.includes(item.key))
  const update = (next: string[]) => { if (controlledOpenKeys === undefined) setInnerOpenKeys(next); onChange?.(next) }
  const toggle = (key: string) => update(openKeys.includes(key) ? openKeys.filter((item) => item !== key) : [...openKeys, key])
  return <div className="govuk-accordion" id={accordionId} ref={ref} style={style}>
    <div className="govuk-accordion__controls">
      <button className="govuk-accordion__show-all" type="button" aria-expanded={allOpen} onClick={() => update(allOpen ? [] : items.map((item) => item.key))}>
        <span className={`govuk-accordion-nav__chevron ${allOpen ? '' : 'govuk-accordion-nav__chevron--down'}`} aria-hidden="true" />
        <span className="govuk-accordion__show-all-text">{allOpen ? hideAllText : showAllText}</span>
      </button>
    </div>
    {items.map((item, index) => {
      const expanded = openKeys.includes(item.key)
      const headingId = `${accordionId}-heading-${index + 1}`
      const contentId = `${accordionId}-content-${index + 1}`
      return <section className={`govuk-accordion__section ${expanded ? 'govuk-accordion__section--expanded' : ''}`} key={item.key}>
        <div className="govuk-accordion__section-header">
          <h2 className="govuk-accordion__section-heading">
            <button type="button" className="govuk-accordion__section-button" aria-controls={contentId} aria-expanded={expanded} onClick={() => toggle(item.key)}>
              <span className="govuk-accordion__section-heading-text" id={headingId}><span className="govuk-accordion__section-heading-text-focus">{item.heading}</span></span>
              <span className="govuk-visually-hidden govuk-accordion__section-heading-divider">, </span>
              {item.summary && <><span className="govuk-accordion__section-summary govuk-body"><span className="govuk-accordion__section-summary-focus">{item.summary}</span></span><span className="govuk-visually-hidden govuk-accordion__section-heading-divider">, </span></>}
              <span className="govuk-accordion__section-toggle" data-nosnippet=""><span className="govuk-accordion__section-toggle-focus"><span className={`govuk-accordion-nav__chevron ${expanded ? '' : 'govuk-accordion-nav__chevron--down'}`} aria-hidden="true" /><span className="govuk-accordion__section-toggle-text">{expanded ? 'Hide' : 'Show'}</span></span></span>
            </button>
          </h2>
        </div>
        <div className="govuk-accordion__section-content" id={contentId} aria-labelledby={headingId} hidden={!expanded}>{item.children}</div>
      </section>
    })}
  </div>
})
