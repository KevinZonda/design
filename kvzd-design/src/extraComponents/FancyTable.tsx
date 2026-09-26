import { forwardRef, Fragment, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type HTMLAttributes, type Key, type ReactElement, type ReactNode, type Ref, type RefAttributes, type TdHTMLAttributes } from 'react'
import type { SemanticStyling } from '../components/index'
import { Empty } from './Empty'
import { Loading } from './Loading'

export type FancyTableSortOrder = 'ascend' | 'descend'
export interface FancyTableSort { columnKey: string; order: FancyTableSortOrder }
export type FancyTableFilterValues = Record<string, string | string[]>

export interface FancyTableColumn<T> {
  key: string
  title: ReactNode
  dataIndex: keyof T
  render?: (value: T[keyof T], record: T, index: number) => ReactNode
  sorter?: (a: T, b: T) => number
  filters?: { label: string; value: string }[]
  onFilter?: (value: string, record: T) => boolean
  filterLabel?: string
  filterMultiple?: boolean
  onCell?: (record: T, rowIndex: number) => Omit<TdHTMLAttributes<HTMLTableCellElement>, 'key'>
  numeric?: boolean
  rowHeader?: boolean
}

export interface FancyTableExpandable<T> {
  expandedRowRender?: (record: T, index: number) => ReactNode
  rowExpandable?: (record: T) => boolean
  expandedRowKeys?: Key[]
  defaultExpandedRowKeys?: Key[]
  onExpandedRowsChange?: (keys: Key[]) => void
}

export interface FancyTableProps<T> extends SemanticStyling<'root' | 'scroll' | 'table' | 'pagination'> {
  columns: FancyTableColumn<T>[]
  dataSource: T[]
  rowKey: keyof T | ((record: T) => Key)
  caption?: ReactNode
  loading?: boolean
  selectable?: boolean
  selectedRowKeys?: Key[]
  defaultSelectedRowKeys?: Key[]
  onSelectionChange?: (keys: Key[]) => void
  sort?: FancyTableSort | null
  defaultSort?: FancyTableSort | null
  onSortChange?: (sort: FancyTableSort | null) => void
  filterValues?: FancyTableFilterValues
  defaultFilterValues?: FancyTableFilterValues
  onFilterChange?: (values: FancyTableFilterValues) => void
  expandable?: FancyTableExpandable<T>
  rowClassName?: (record: T, index: number) => string
  onRow?: (record: T, index: number) => Omit<HTMLAttributes<HTMLTableRowElement>, 'key'>
  pageSize?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  showTotal?: boolean | ((total: number, range: [number, number]) => ReactNode)
  showSizeChanger?: boolean
  pageSizeOptions?: number[]
  onPageSizeChange?: (size: number) => void
  onChange?: (change: { page: number; pageSize: number | undefined; sort: FancyTableSort | null; filters: FancyTableFilterValues }) => void
  emptyContent?: ReactNode
  className?: string
  style?: CSSProperties
}

interface SmallCheckboxProps {
  id: string
  checked: boolean
  disabled?: boolean
  label: ReactNode
  onChange: (checked: boolean) => void
}

function SmallCheckbox({ id, checked, disabled, label, onChange }: SmallCheckboxProps) {
  return <div className="govuk-checkboxes govuk-checkboxes--small">
    <div className="govuk-checkboxes__item">
      <input className="govuk-checkboxes__input" id={id} type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
      <label className="govuk-label govuk-checkboxes__label" htmlFor={id}>{label}</label>
    </div>
  </div>
}

const FancyTableWithRef = forwardRef(function FancyTable<T extends object>({
  columns, dataSource, rowKey, caption, loading = false, selectable = false, selectedRowKeys, defaultSelectedRowKeys = [], onSelectionChange,
  sort, defaultSort = null, onSortChange, filterValues, defaultFilterValues = {}, onFilterChange,
  expandable, rowClassName, onRow,
  pageSize, currentPage, onPageChange, showTotal = false, showSizeChanger = false, pageSizeOptions = [10, 20, 50], onPageSizeChange,
  onChange, emptyContent, className = '', classNames, style, styles,
}: FancyTableProps<T>, ref: Ref<HTMLTableElement>) {
  const uid = useId().replace(/:/g, '')
  const [innerSelected, setInnerSelected] = useState<Key[]>(defaultSelectedRowKeys)
  const [innerSort, setInnerSort] = useState<FancyTableSort | null>(defaultSort)
  const [innerFilters, setInnerFilters] = useState<FancyTableFilterValues>(defaultFilterValues)
  const [innerPage, setInnerPage] = useState(1)
  const [innerPageSize, setInnerPageSize] = useState<number | undefined>(pageSize && Number.isFinite(pageSize) && pageSize >= 1 ? Math.floor(pageSize) : undefined)
  const [innerExpanded, setInnerExpanded] = useState<Key[]>(expandable?.defaultExpandedRowKeys ?? [])
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const selected = selectedRowKeys ?? innerSelected
  const activeSort = sort === undefined ? innerSort : sort
  const activeFilters = filterValues ?? innerFilters
  const activeExpanded = expandable?.expandedRowKeys ?? innerExpanded
  const keyFor = (record: T): Key => typeof rowKey === 'function' ? rowKey(record) : record[rowKey] as Key
  const expandableColumn = Boolean(expandable?.expandedRowRender)
  const columnCount = columns.length + (selectable ? 1 : 0) + (expandableColumn ? 1 : 0)

  useEffect(() => {
    if (openFilter === null) return
    const onPointerDown = (event: MouseEvent) => { if (!(event.target as HTMLElement | null)?.closest?.('.kvzd-design-fancy-table__filter-wrap')) setOpenFilter(null) }
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpenFilter(null) }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openFilter])

  const sortedData = useMemo(() => {
    const filtered = dataSource.filter((record) => columns.every((column) => {
      const value = activeFilters[column.key]
      if (!value || !column.onFilter) return true
      if (Array.isArray(value)) return value.length > 0 ? value.every((item) => column.onFilter!(item, record)) : true
      return column.onFilter(value, record)
    }))
    const column = columns.find((item) => item.key === activeSort?.columnKey)
    return column?.sorter && activeSort
      ? [...filtered].sort((a, b) => column.sorter!(a, b) * (activeSort.order === 'ascend' ? 1 : -1))
      : filtered
  }, [activeFilters, activeSort, columns, dataSource])

  const activePageSize = pageSize ?? innerPageSize
  const effectivePageSize = activePageSize && Number.isFinite(activePageSize) && activePageSize >= 1 ? Math.floor(activePageSize) : undefined
  const pageCount = effectivePageSize ? Math.max(1, Math.ceil(sortedData.length / effectivePageSize)) : 1
  const page = Math.min(Math.max(1, currentPage ?? innerPage), pageCount)
  const visibleData = effectivePageSize ? sortedData.slice((page - 1) * effectivePageSize, page * effectivePageSize) : sortedData
  const visibleKeys = visibleData.map(keyFor)
  const allVisibleSelected = visibleKeys.length > 0 && visibleKeys.every((key) => selected.includes(key))
  const pageItems: (number | 'ellipsis')[] = []
  if (effectivePageSize) {
    pageItems.push(1)
    const windowStart = Math.max(2, page - 1)
    const windowEnd = Math.min(pageCount - 1, page + 1)
    if (windowStart > 2) pageItems.push('ellipsis')
    for (let item = windowStart; item <= windowEnd; item++) pageItems.push(item)
    if (windowEnd < pageCount - 1) pageItems.push('ellipsis')
    if (pageCount > 1) pageItems.push(pageCount)
  }
  const totalCount = sortedData.length
  const rangeStart = totalCount === 0 || !effectivePageSize ? 0 : (page - 1) * effectivePageSize + 1
  const rangeEnd = effectivePageSize ? Math.min(page * effectivePageSize, totalCount) : totalCount
  const totalContent = typeof showTotal === 'function' ? showTotal(totalCount, [rangeStart, rangeEnd])
    : showTotal ? (totalCount === 0 ? `0 of ${totalCount} records` : `${rangeStart}-${rangeEnd} of ${totalCount} records`) : null

  const updateSelection = (keys: Key[]) => { if (selectedRowKeys === undefined) setInnerSelected(keys); onSelectionChange?.(keys) }
  const updatePage = (next: number) => { if (currentPage === undefined) setInnerPage(next); onPageChange?.(next) }
  const updateExpanded = (key: Key, expand: boolean) => {
    const next = expand ? [...new Set([...activeExpanded, key])] : activeExpanded.filter((item) => item !== key)
    if (expandable?.expandedRowKeys === undefined) setInnerExpanded(next)
    expandable?.onExpandedRowsChange?.(next)
  }
  const toggleSort = (columnKey: string) => {
    const next: FancyTableSort | null = activeSort?.columnKey !== columnKey ? { columnKey, order: 'ascend' }
      : activeSort.order === 'ascend' ? { columnKey, order: 'descend' } : null
    if (sort === undefined) setInnerSort(next)
    onSortChange?.(next)
    updatePage(1)
  }
  const updateFilter = (columnKey: string, value: string | string[]) => {
    const next = { ...activeFilters, [columnKey]: value }
    if (filterValues === undefined) setInnerFilters(next)
    onFilterChange?.(next)
    updatePage(1)
  }
  const toggleMultiFilter = (columnKey: string, value: string, checked: boolean) => {
    const current = activeFilters[columnKey]
    const values = Array.isArray(current) ? current : current ? [current] : []
    updateFilter(columnKey, checked ? [...new Set([...values, value])] : values.filter((item) => item !== value))
  }
  const changePageSize = (size: number) => {
    if (pageSize === undefined) setInnerPageSize(size)
    onPageSizeChange?.(size)
    updatePage(1)
  }

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const firstRenderRef = useRef(true)
  useEffect(() => {
    if (firstRenderRef.current) { firstRenderRef.current = false; return }
    onChangeRef.current?.({ page, pageSize: effectivePageSize, sort: activeSort, filters: activeFilters })
  }, [page, effectivePageSize, activeSort, activeFilters])

  return <div className={`kvzd-design-fancy-table ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
    <div className={`kvzd-design-fancy-table__scroll ${classNames?.scroll ?? ''}`.trim()} style={styles?.scroll}><table ref={ref} className={`govuk-table kvzd-design-fancy-table__table ${classNames?.table ?? ''}`.trim()} style={styles?.table} aria-busy={loading || undefined}>
      {caption && <caption className="govuk-table__caption govuk-table__caption--m">{caption}</caption>}
      <thead className="govuk-table__head"><tr className="govuk-table__row">
        {expandableColumn && <th className="govuk-table__header kvzd-design-fancy-table__expand" scope="col" />}
        {selectable && <th className="govuk-table__header kvzd-design-fancy-table__select" scope="col"><SmallCheckbox id={`${uid}-select-all`} checked={allVisibleSelected} disabled={!visibleKeys.length || loading} label={<span className="govuk-visually-hidden">Select all rows on this page</span>} onChange={() => updateSelection(allVisibleSelected ? selected.filter((key) => !visibleKeys.includes(key)) : [...new Set([...selected, ...visibleKeys])])} /></th>}
        {columns.map((column) => {
          const filterLabel = column.filterLabel ?? `Filter ${typeof column.title === 'string' ? column.title : column.key}`
          return <th className={`govuk-table__header ${column.numeric ? 'govuk-table__header--numeric' : ''}`} scope="col" key={column.key} aria-sort={activeSort?.columnKey === column.key ? (activeSort.order === 'ascend' ? 'ascending' : 'descending') : undefined}>
            {column.sorter ? <button className="kvzd-design-fancy-table__sort" type="button" onClick={() => toggleSort(column.key)}>
              {column.title}
              <svg className="kvzd-design-fancy-table__sort-icon" data-order={activeSort?.columnKey === column.key ? activeSort.order : 'none'} viewBox="0 0 12 16" aria-hidden="true" focusable="false">
                <polygon className="kvzd-design-fancy-table__sort-up" points="6,1 11,7 1,7" />
                <polygon className="kvzd-design-fancy-table__sort-down" points="1,9 11,9 6,15" />
              </svg>
            </button> : column.title}
            {column.filters && column.onFilter && (column.filterMultiple ? <span className="kvzd-design-fancy-table__filter-wrap">
              <button className="kvzd-design-fancy-table__filter-trigger" type="button" aria-label={filterLabel} aria-haspopup="true" aria-expanded={openFilter === column.key} onClick={() => setOpenFilter(openFilter === column.key ? null : column.key)}>
                Filter
                <svg className="kvzd-design-fancy-table__filter-icon" viewBox="0 0 12 16" aria-hidden="true" focusable="false"><polygon points="2,6 10,6 6,11" /></svg>
              </button>
              {openFilter === column.key && <div className="kvzd-design-fancy-table__filter-panel" role="group" aria-label={filterLabel}>
                {column.filters.map((filter, filterIndex) => {
                  const current = activeFilters[column.key]
                  const values = Array.isArray(current) ? current : current ? [current] : []
                  const filterId = `${uid}-filter-${column.key}-${filterIndex}`
                  return <SmallCheckbox key={filter.value} id={filterId} checked={values.includes(filter.value)} label={filter.label} onChange={(checked) => toggleMultiFilter(column.key, filter.value, checked)} />
                })}
              </div>}
            </span> : <select className="govuk-select kvzd-design-fancy-table__filter" aria-label={filterLabel} value={typeof activeFilters[column.key] === 'string' ? activeFilters[column.key] as string : ''} onChange={(event) => updateFilter(column.key, event.target.value)}><option value="">All</option>{column.filters.map((filter) => <option key={filter.value} value={filter.value}>{filter.label}</option>)}</select>)}
          </th>
        })}
      </tr></thead>
      <tbody className="govuk-table__body">{loading ? <tr className="govuk-table__row kvzd-design-fancy-table__loading-row"><td className="govuk-table__cell" colSpan={columnCount}><Loading variant="spinner" label="Loading" /></td></tr>
        : visibleData.length ? visibleData.map((record, rowIndex) => {
          const key = keyFor(record)
          const isExpanded = expandableColumn && activeExpanded.includes(key)
          const expandableRow = !expandable?.rowExpandable || expandable.rowExpandable(record)
          const rowProps = onRow?.(record, rowIndex) ?? {}
          const rowClass = `govuk-table__row ${rowClassName?.(record, rowIndex) ?? ''} ${rowProps.className ?? ''}`.trim()
          return <Fragment key={key}>
            <tr {...rowProps} className={rowClass}>
              {expandableColumn && <td className="govuk-table__cell kvzd-design-fancy-table__expand">{expandableRow && <button className="kvzd-design-fancy-table__expand-trigger" type="button" aria-expanded={isExpanded} aria-label={isExpanded ? 'Collapse row' : 'Expand row'} onClick={() => updateExpanded(key, !isExpanded)}>
                <svg className="kvzd-design-fancy-table__expand-icon" data-expanded={isExpanded} viewBox="0 0 16 16" aria-hidden="true" focusable="false"><polygon points="5,3 11,8 5,13" /></svg>
              </button>}</td>}
              {selectable && <td className="govuk-table__cell kvzd-design-fancy-table__select"><SmallCheckbox id={`${uid}-row-${String(key)}`} checked={selected.includes(key)} label={<span className="govuk-visually-hidden">Select row {String(key)}</span>} onChange={() => updateSelection(selected.includes(key) ? selected.filter((item) => item !== key) : [...selected, key])} /></td>}
              {columns.map((column) => {
                const value = record[column.dataIndex]
                const content = column.render ? column.render(value, record, rowIndex) : String(value ?? '')
                const cellProps = column.onCell?.(record, rowIndex) ?? {}
                const classes = `${column.rowHeader ? 'govuk-table__header' : 'govuk-table__cell'} ${column.numeric ? `${column.rowHeader ? 'govuk-table__header' : 'govuk-table__cell'}--numeric` : ''} ${cellProps.className ?? ''}`.trim()
                return column.rowHeader ? <th {...cellProps} className={classes} scope="row" key={column.key}>{content}</th> : <td {...cellProps} className={classes} key={column.key}>{content}</td>
              })}
            </tr>
            {isExpanded && expandable?.expandedRowRender && <tr className="kvzd-design-fancy-table__expanded-row"><td className="govuk-table__cell kvzd-design-fancy-table__expanded" colSpan={columnCount}>{expandable.expandedRowRender(record, rowIndex)}</td></tr>}
          </Fragment>
        }) : <tr className="govuk-table__row"><td className="govuk-table__cell" colSpan={columnCount}>{emptyContent ?? <Empty title="No records found" />}</td></tr>}</tbody>
    </table></div>
    {effectivePageSize && (pageCount > 1 || showSizeChanger || showTotal) && <nav className={`kvzd-design-fancy-table__pagination ${classNames?.pagination ?? ''}`.trim()} style={styles?.pagination} aria-label="Table pages">
      {totalContent && <span className="kvzd-design-fancy-table__total">{totalContent}</span>}
      <ul className="kvzd-design-fancy-table__pages">
        <li><button className="govuk-button govuk-button--secondary kvzd-design-fancy-table__page-button" type="button" disabled={loading || page <= 1} onClick={() => updatePage(page - 1)}>Previous</button></li>
        {pageItems.map((item, index) => item === 'ellipsis'
          ? <li key={`ellipsis-${index}`}><span className="kvzd-design-fancy-table__ellipsis" aria-hidden="true">&hellip;</span></li>
          : <li key={item}><button className="govuk-button govuk-button--secondary kvzd-design-fancy-table__page-button" type="button" aria-label={`Page ${item}`} aria-current={item === page ? 'page' : undefined} disabled={loading} onClick={() => updatePage(item)}>{item}</button></li>)}
        <li><button className="govuk-button govuk-button--secondary kvzd-design-fancy-table__page-button" type="button" disabled={loading || page >= pageCount} onClick={() => updatePage(page + 1)}>Next</button></li>
      </ul>
      {showSizeChanger && <select className="govuk-select kvzd-design-fancy-table__page-size" aria-label="Rows per page" value={effectivePageSize} disabled={loading} onChange={(event) => changePageSize(Number(event.target.value))}>
        {pageSizeOptions.map((option) => <option key={option} value={option}>{option} rows</option>)}
      </select>}
    </nav>}
  </div>
})

export const FancyTable = FancyTableWithRef as <T extends object>(props: FancyTableProps<T> & RefAttributes<HTMLTableElement>) => ReactElement | null
