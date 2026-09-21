import { useId, useRef, useState } from 'react'
import type { Key, ReactNode } from 'react'
import { Tag } from './Tag'

export interface TableColumn<T> { title: ReactNode; dataIndex: keyof T; key?: string; numeric?: boolean; rowHeader?: boolean; render?: (value: T[keyof T], record: T, index: number) => ReactNode }
export interface TableProps<T> { columns: TableColumn<T>[]; dataSource: T[]; caption?: ReactNode; rowKey?: keyof T | ((record: T) => Key) }
export function Table<T extends object>({ caption, columns, dataSource, rowKey }: TableProps<T>) {
  const keyFor = (record: T, index: number) => typeof rowKey === 'function' ? rowKey(record) : rowKey ? String(record[rowKey]) : index
  return <table className="govuk-table">{caption && <caption className="govuk-table__caption govuk-table__caption--m">{caption}</caption>}<thead className="govuk-table__head"><tr className="govuk-table__row">{columns.map((column) => <th className={`govuk-table__header ${column.numeric ? 'govuk-table__header--numeric' : ''}`} scope="col" key={column.key ?? String(column.dataIndex)}>{column.title}</th>)}</tr></thead><tbody className="govuk-table__body">{dataSource.map((record, rowIndex) => <tr className="govuk-table__row" key={keyFor(record, rowIndex)}>{columns.map((column) => { const value = record[column.dataIndex]; const content = column.render ? column.render(value, record, rowIndex) : String(value ?? ''); const classes = `${column.rowHeader ? 'govuk-table__header' : 'govuk-table__cell'} ${column.numeric ? `${column.rowHeader ? 'govuk-table__header' : 'govuk-table__cell'}--numeric` : ''}`.trim(); return column.rowHeader ? <th className={classes} scope="row" key={column.key ?? String(column.dataIndex)}>{content}</th> : <td className={classes} key={column.key ?? String(column.dataIndex)}>{content}</td> })}</tr>)}</tbody></table>
}

export interface SummaryItem { key: ReactNode; value: ReactNode; actions?: Array<{ label: ReactNode; href: string; visuallyHiddenText?: string }> }
export function SummaryList({ items, bordered = true }: { items: SummaryItem[]; bordered?: boolean }) { return <dl className={`govuk-summary-list ${bordered ? '' : 'govuk-summary-list--no-border'}`}>{items.map((item, index) => <div className="govuk-summary-list__row" key={index}><dt className="govuk-summary-list__key">{item.key}</dt><dd className="govuk-summary-list__value">{item.value}</dd>{item.actions && <dd className="govuk-summary-list__actions">{item.actions.map((action, actionIndex) => <span key={action.href}>{actionIndex > 0 && ' '}<a className="govuk-link" href={action.href}>{action.label}{action.visuallyHiddenText && <span className="govuk-visually-hidden"> {action.visuallyHiddenText}</span>}</a></span>)}</dd>}</div>)}</dl> }

export interface TaskItem { title: ReactNode; href: string; status: ReactNode; hint?: ReactNode; statusColor?: Parameters<typeof Tag>[0]['color'] }
export function TaskList({ items }: { items: TaskItem[] }) { return <ul className="govuk-task-list">{items.map((item, index) => <li className="govuk-task-list__item govuk-task-list__item--with-link" key={`${item.href}-${index}`}><div className="govuk-task-list__name-and-hint"><a className="govuk-link govuk-task-list__link" href={item.href} aria-describedby={`task-status-${index}`}>{item.title}</a>{item.hint && <div className="govuk-task-list__hint">{item.hint}</div>}</div><div className="govuk-task-list__status" id={`task-status-${index}`}>{item.statusColor ? <Tag color={item.statusColor}>{item.status}</Tag> : item.status}</div></li>)}</ul> }

export interface TabItem { key: string; label: ReactNode; children: ReactNode }
export interface TabsProps { items: TabItem[]; activeKey?: string; defaultActiveKey?: string; onChange?: (key: string) => void }
export function Tabs({ items, activeKey, defaultActiveKey, onChange }: TabsProps) {
  const [inner, setInner] = useState(defaultActiveKey ?? items[0]?.key); const current = activeKey ?? inner; const id = useId().replaceAll(':', ''); const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const select = (key: string) => { if (activeKey === undefined) setInner(key); onChange?.(key) }
  const move = (key: string) => { select(key); tabRefs.current[key]?.focus() }
  return <div className="govuk-tabs"><h2 className="govuk-tabs__title">Contents</h2><ul className="govuk-tabs__list" role="tablist">{items.map((item, index) => { const panelId = `${id}-panel-${item.key}`; const selected = item.key === current; return <li className={`govuk-tabs__list-item ${selected ? 'govuk-tabs__list-item--selected' : ''}`} role="presentation" key={item.key}><a className="govuk-tabs__tab" href={`#${panelId}`} role="tab" id={`${id}-tab-${item.key}`} aria-controls={panelId} aria-selected={selected} tabIndex={selected ? 0 : -1} ref={(node) => { tabRefs.current[item.key] = node }} onClick={(event) => { event.preventDefault(); select(item.key) }} onKeyDown={(event) => { if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return; event.preventDefault(); const offset = event.key === 'ArrowRight' ? 1 : -1; const next = (index + offset + items.length) % items.length; const nextItem = items[next]; if (nextItem) move(nextItem.key) }}>{item.label}</a></li> })}</ul>{items.map((item) => <section className={`govuk-tabs__panel ${item.key !== current ? 'govuk-tabs__panel--hidden' : ''}`} role="tabpanel" id={`${id}-panel-${item.key}`} aria-labelledby={`${id}-tab-${item.key}`} key={item.key} hidden={item.key !== current}>{item.children}</section>)}</div>
}

export interface AccordionItem { key: string; heading: ReactNode; summary?: ReactNode; children: ReactNode; expanded?: boolean }
export function Accordion({ items, showAllText = 'Show all sections', hideAllText = 'Hide all sections' }: { items: AccordionItem[]; showAllText?: string; hideAllText?: string }) {
  const accordionId = useId().replaceAll(':', '')
  const [openKeys, setOpenKeys] = useState(() => items.filter((item) => item.expanded).map((item) => item.key)); const allOpen = openKeys.length === items.length
  const toggle = (key: string) => setOpenKeys((keys) => keys.includes(key) ? keys.filter((item) => item !== key) : [...keys, key])
  return <div className="govuk-accordion" id={accordionId}>
    <div className="govuk-accordion__controls">
      <button className="govuk-accordion__show-all" type="button" aria-expanded={allOpen} onClick={() => setOpenKeys(allOpen ? [] : items.map((item) => item.key))}>
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
}
