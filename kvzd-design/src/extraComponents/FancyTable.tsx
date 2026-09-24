import { forwardRef, useMemo, useState, type CSSProperties, type Key, type ReactElement, type ReactNode, type Ref, type RefAttributes } from 'react'
import type { SemanticStyling } from '../components/index'
import { Empty } from './Empty'

export type FancyTableSortOrder = 'ascend' | 'descend'
export interface FancyTableSort { columnKey: string; order: FancyTableSortOrder }

export interface FancyTableColumn<T> {
  key: string
  title: ReactNode
  dataIndex: keyof T
  render?: (value: T[keyof T], record: T, index: number) => ReactNode
  sorter?: (a: T, b: T) => number
  filters?: { label: string; value: string }[]
  onFilter?: (value: string, record: T) => boolean
  filterLabel?: string
  numeric?: boolean
  rowHeader?: boolean
}

export interface FancyTableProps<T> extends SemanticStyling<'root' | 'scroll' | 'table' | 'pagination'> {
  columns: FancyTableColumn<T>[]
  dataSource: T[]
  rowKey: keyof T | ((record: T) => Key)
  caption?: ReactNode
  selectable?: boolean
  selectedRowKeys?: Key[]
  defaultSelectedRowKeys?: Key[]
  onSelectionChange?: (keys: Key[]) => void
  sort?: FancyTableSort | null
  defaultSort?: FancyTableSort | null
  onSortChange?: (sort: FancyTableSort | null) => void
  filterValues?: Record<string, string>
  defaultFilterValues?: Record<string, string>
  onFilterChange?: (values: Record<string, string>) => void
  pageSize?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  emptyContent?: ReactNode
  className?: string
  style?: CSSProperties
}

const FancyTableWithRef = forwardRef(function FancyTable<T extends object>({
  columns, dataSource, rowKey, caption, selectable = false, selectedRowKeys, defaultSelectedRowKeys = [], onSelectionChange,
  sort, defaultSort = null, onSortChange, filterValues, defaultFilterValues = {}, onFilterChange,
  pageSize, currentPage, onPageChange, emptyContent, className = '', classNames, style, styles,
}: FancyTableProps<T>, ref: Ref<HTMLTableElement>) {
  const [innerSelected, setInnerSelected] = useState<Key[]>(defaultSelectedRowKeys)
  const [innerSort, setInnerSort] = useState<FancyTableSort | null>(defaultSort)
  const [innerFilters, setInnerFilters] = useState(defaultFilterValues)
  const [innerPage, setInnerPage] = useState(1)
  const selected = selectedRowKeys ?? innerSelected
  const activeSort = sort === undefined ? innerSort : sort
  const activeFilters = filterValues ?? innerFilters
  const keyFor = (record: T): Key => typeof rowKey === 'function' ? rowKey(record) : record[rowKey] as Key

  const sortedData = useMemo(() => {
    const filtered = dataSource.filter((record) => columns.every((column) => !activeFilters[column.key] || !column.onFilter || column.onFilter(activeFilters[column.key], record)))
    const column = columns.find((item) => item.key === activeSort?.columnKey)
    return column?.sorter && activeSort
      ? [...filtered].sort((a, b) => column.sorter!(a, b) * (activeSort.order === 'ascend' ? 1 : -1))
      : filtered
  }, [activeFilters, activeSort, columns, dataSource])

  const effectivePageSize = pageSize && Number.isFinite(pageSize) && pageSize >= 1 ? Math.floor(pageSize) : undefined
  const pageCount = effectivePageSize ? Math.max(1, Math.ceil(sortedData.length / effectivePageSize)) : 1
  const page = Math.min(Math.max(1, currentPage ?? innerPage), pageCount)
  const visibleData = effectivePageSize ? sortedData.slice((page - 1) * effectivePageSize, page * effectivePageSize) : sortedData
  const visibleKeys = visibleData.map(keyFor)
  const allVisibleSelected = visibleKeys.length > 0 && visibleKeys.every((key) => selected.includes(key))

  const updateSelection = (keys: Key[]) => { if (selectedRowKeys === undefined) setInnerSelected(keys); onSelectionChange?.(keys) }
  const updatePage = (next: number) => { if (currentPage === undefined) setInnerPage(next); onPageChange?.(next) }
  const toggleSort = (columnKey: string) => {
    const next: FancyTableSort | null = activeSort?.columnKey !== columnKey ? { columnKey, order: 'ascend' }
      : activeSort.order === 'ascend' ? { columnKey, order: 'descend' } : null
    if (sort === undefined) setInnerSort(next)
    onSortChange?.(next)
    updatePage(1)
  }
  const updateFilter = (columnKey: string, value: string) => {
    const next = { ...activeFilters, [columnKey]: value }
    if (filterValues === undefined) setInnerFilters(next)
    onFilterChange?.(next)
    updatePage(1)
  }

  return <div className={`kvzd-design-fancy-table ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
    <div className={`kvzd-design-fancy-table__scroll ${classNames?.scroll ?? ''}`.trim()} style={styles?.scroll}><table ref={ref} className={`govuk-table kvzd-design-fancy-table__table ${classNames?.table ?? ''}`.trim()} style={styles?.table}>
      {caption && <caption className="govuk-table__caption govuk-table__caption--m">{caption}</caption>}
      <thead className="govuk-table__head"><tr className="govuk-table__row">
        {selectable && <th className="govuk-table__header kvzd-design-fancy-table__select" scope="col"><input type="checkbox" aria-label="Select all rows on this page" checked={allVisibleSelected} disabled={!visibleKeys.length} onChange={() => updateSelection(allVisibleSelected ? selected.filter((key) => !visibleKeys.includes(key)) : [...new Set([...selected, ...visibleKeys])])} /></th>}
        {columns.map((column) => <th className={`govuk-table__header ${column.numeric ? 'govuk-table__header--numeric' : ''}`} scope="col" key={column.key} aria-sort={activeSort?.columnKey === column.key ? (activeSort.order === 'ascend' ? 'ascending' : 'descending') : undefined}>
          {column.sorter ? <button className="kvzd-design-fancy-table__sort" type="button" onClick={() => toggleSort(column.key)}>
            {column.title}
            <svg className="kvzd-design-fancy-table__sort-icon" data-order={activeSort?.columnKey === column.key ? activeSort.order : 'none'} viewBox="0 0 12 16" aria-hidden="true" focusable="false">
              <polygon className="kvzd-design-fancy-table__sort-up" points="6,1 11,7 1,7" />
              <polygon className="kvzd-design-fancy-table__sort-down" points="1,9 11,9 6,15" />
            </svg>
          </button> : column.title}
          {column.filters && column.onFilter && <select className="govuk-select kvzd-design-fancy-table__filter" aria-label={column.filterLabel ?? `Filter ${typeof column.title === 'string' ? column.title : column.key}`} value={activeFilters[column.key] ?? ''} onChange={(event) => updateFilter(column.key, event.target.value)}><option value="">All</option>{column.filters.map((filter) => <option key={filter.value} value={filter.value}>{filter.label}</option>)}</select>}
        </th>)}
      </tr></thead>
      <tbody className="govuk-table__body">{visibleData.length ? visibleData.map((record, rowIndex) => {
        const key = keyFor(record)
        return <tr className="govuk-table__row" key={key}>
          {selectable && <td className="govuk-table__cell kvzd-design-fancy-table__select"><input type="checkbox" aria-label={`Select row ${String(key)}`} checked={selected.includes(key)} onChange={() => updateSelection(selected.includes(key) ? selected.filter((item) => item !== key) : [...selected, key])} /></td>}
          {columns.map((column) => {
            const value = record[column.dataIndex]
            const content = column.render ? column.render(value, record, rowIndex) : String(value ?? '')
            const classes = `${column.rowHeader ? 'govuk-table__header' : 'govuk-table__cell'} ${column.numeric ? `${column.rowHeader ? 'govuk-table__header' : 'govuk-table__cell'}--numeric` : ''}`.trim()
            return column.rowHeader ? <th className={classes} scope="row" key={column.key}>{content}</th> : <td className={classes} key={column.key}>{content}</td>
          })}
        </tr>
      }) : <tr className="govuk-table__row"><td className="govuk-table__cell" colSpan={columns.length + (selectable ? 1 : 0)}>{emptyContent ?? <Empty title="No records found" />}</td></tr>}</tbody>
    </table></div>
    {effectivePageSize && pageCount > 1 && <nav className={`kvzd-design-fancy-table__pagination ${classNames?.pagination ?? ''}`.trim()} style={styles?.pagination} aria-label="Table pages">
      <button className="govuk-button govuk-button--secondary" type="button" disabled={page <= 1} onClick={() => updatePage(page - 1)}>Previous</button>
      <span aria-live="polite">Page {page} of {pageCount}</span>
      <button className="govuk-button govuk-button--secondary" type="button" disabled={page >= pageCount} onClick={() => updatePage(page + 1)}>Next</button>
    </nav>}
  </div>
})

export const FancyTable = FancyTableWithRef as <T extends object>(props: FancyTableProps<T> & RefAttributes<HTMLTableElement>) => ReactElement | null
