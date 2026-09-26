// @vitest-environment jsdom
import { useState } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { FancyTable, type FancyTableColumn, type FancyTableFilterValues, type FancyTableSort } from '../src/extraComponents'

afterEach(() => cleanup())

interface Row { id: number; name: string; age: number }
const data: Row[] = Array.from({ length: 30 }, (_, index) => ({ id: index + 1, name: `Item ${index + 1}`, age: 20 + (index % 10) }))
const columns: FancyTableColumn<Row>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
  {
    key: 'age', title: 'Age', dataIndex: 'age', sorter: (a, b) => a.age - b.age,
    filters: [{ label: 'Twenty', value: '20' }, { label: 'Twenty-one', value: '21' }],
    onFilter: (value, record) => String(record.age) === value,
  },
]

function setup(extra: Record<string, unknown> = {}) {
  const onChange = vi.fn()
  render(<FancyTable columns={columns} dataSource={data} rowKey="id" pageSize={10} onChange={onChange} {...extra} />)
  return onChange
}

test('does not fire onChange on initial mount', () => {
  const onChange = setup()
  expect(onChange).not.toHaveBeenCalled()
})

test('clicking a sortable column header fires onChange once with sort and page 1', () => {
  const onChange = setup()
  fireEvent.click(screen.getByRole('button', { name: 'Name' }))
  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenLastCalledWith({ page: 1, pageSize: 10, sort: { columnKey: 'name', order: 'ascend' }, filters: {} })
})

test('changing page fires onChange with the new page', () => {
  const onChange = setup()
  fireEvent.click(screen.getByRole('button', { name: 'Page 2' }))
  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenLastCalledWith({ page: 2, pageSize: 10, sort: null, filters: {} })
})

test('changing a filter fires onChange once with filters and page reset to 1', () => {
  const onChange = setup()
  fireEvent.click(screen.getByRole('button', { name: 'Page 2' }))
  fireEvent.change(screen.getByRole('combobox', { name: 'Filter Age' }), { target: { value: '20' } })
  expect(onChange).toHaveBeenCalledTimes(2)
  expect(onChange).toHaveBeenLastCalledWith({ page: 1, pageSize: 10, sort: null, filters: { age: '20' } })
})

test('changing page size via size changer fires onChange with new pageSize and page 1', () => {
  const onChange = vi.fn()
  function Harness() {
    const [size, setSize] = useState(10)
    return <FancyTable columns={columns} dataSource={data} rowKey="id" pageSize={size} onPageSizeChange={setSize} showSizeChanger onChange={onChange} />
  }
  render(<Harness />)
  fireEvent.change(screen.getByRole('combobox', { name: 'Rows per page' }), { target: { value: '20' } })
  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenLastCalledWith({ page: 1, pageSize: 20, sort: null, filters: {} })
})

test('controlled mode: sort interaction fires onChange once with final state', () => {
  const onChange = vi.fn()
  function Harness() {
    const [sort, setSort] = useState<FancyTableSort | null>(null)
    const [page, setPage] = useState(1)
    const [filters, setFilters] = useState<FancyTableFilterValues>({})
    return <FancyTable columns={columns} dataSource={data} rowKey="id" pageSize={10} sort={sort} onSortChange={setSort} currentPage={page} onPageChange={setPage} filterValues={filters} onFilterChange={setFilters} onChange={onChange} />
  }
  render(<Harness />)
  fireEvent.click(screen.getByRole('button', { name: 'Age' }))
  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenLastCalledWith({ page: 1, pageSize: 10, sort: { columnKey: 'age', order: 'ascend' }, filters: {} })
})
