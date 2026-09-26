// @vitest-environment jsdom
import { useState } from 'react'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import { FancyTable, type FancyTableColumn } from '../src/extraComponents/FancyTable'

interface Row {
  id: number
  name: string
  tag: string
}

const data: Row[] = [
  { id: 1, name: 'alpha', tag: 'a' },
  { id: 2, name: 'bravo', tag: 'b' },
  { id: 3, name: 'charlie', tag: 'a' },
  { id: 4, name: 'delta', tag: 'c' },
  { id: 5, name: 'echo', tag: 'b' },
]

const columns: FancyTableColumn<Row>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name' },
  { key: 'tag', title: 'Tag', dataIndex: 'tag' },
]

afterEach(cleanup)

test('loading renders a spinner row and disables pagination buttons', () => {
  render(<FancyTable columns={columns} dataSource={data} rowKey="id" loading pageSize={2} />)
  expect(screen.getByRole('status', { name: 'Loading' })).toBeTruthy()
  expect(screen.queryByText('alpha')).toBeNull()
  expect(screen.getByRole('button', { name: 'Previous' }).disabled).toBe(true)
  expect(screen.getByRole('button', { name: 'Next' }).disabled).toBe(true)
  expect(screen.getByRole('button', { name: 'Page 2' }).disabled).toBe(true)
})

test('expandable rows render expanded content, toggle uncontrolled and respect rowExpandable', () => {
  render(<FancyTable columns={columns} dataSource={data} rowKey="id" expandable={{ expandedRowRender: (record) => `detail-${record.name}`, rowExpandable: (record) => record.id !== 2 }} />)
  const triggers = screen.getAllByRole('button', { name: 'Expand row' })
  expect(triggers).toHaveLength(4)
  fireEvent.click(triggers[0])
  expect(screen.getByText('detail-alpha')).toBeTruthy()
  const collapse = screen.getByRole('button', { name: 'Collapse row' })
  expect(collapse.getAttribute('aria-expanded')).toBe('true')
  fireEvent.click(collapse)
  expect(screen.queryByText('detail-alpha')).toBeNull()
  expect(screen.getAllByRole('button', { name: 'Expand row' })).toHaveLength(4)
  expect(screen.getAllByRole('button', { name: 'Expand row' })[0].getAttribute('aria-expanded')).toBe('false')
})

test('expandable and selectable coexist with expand column first', () => {
  const view = render(<FancyTable columns={columns} dataSource={data.slice(0, 2)} rowKey="id" selectable expandable={{ expandedRowRender: (record) => record.name }} />)
  const firstRow = view.container.querySelectorAll('tbody tr')[0]
  expect(firstRow.querySelector('.kvzd-design-fancy-table__expand')).toBeTruthy()
  expect(firstRow.querySelector('.kvzd-design-fancy-table__select')).toBeTruthy()
  fireEvent.click(within(firstRow as HTMLElement).getByRole('button', { name: 'Expand row' }))
  expect(view.container.querySelectorAll('tbody tr')).toHaveLength(3)
})

test('onRow click handler fires and rowClassName is applied to the row', () => {
  const onClick = vi.fn()
  const view = render(<FancyTable columns={columns} dataSource={data.slice(0, 2)} rowKey="id" rowClassName={(record) => `row-${record.id}`} onRow={() => ({ onClick })} />)
  const row = view.container.querySelector('tbody tr') as HTMLTableRowElement
  expect(row.className).toContain('row-1')
  fireEvent.click(row)
  expect(onClick).toHaveBeenCalledOnce()
})

test('onCell props are attached to the column cells', () => {
  const onClick = vi.fn()
  const cellColumns: FancyTableColumn<Row>[] = [{ key: 'name', title: 'Name', dataIndex: 'name', onCell: () => ({ onClick, className: 'cell-x' }) }]
  const view = render(<FancyTable columns={cellColumns} dataSource={data.slice(0, 1)} rowKey="id" />)
  const cell = view.container.querySelector('tbody td') as HTMLTableCellElement
  expect(cell.className).toContain('cell-x')
  fireEvent.click(cell)
  expect(onClick).toHaveBeenCalledOnce()
})

test('showSizeChanger changes visible row count and resets to the first page', () => {
  const onPageSizeChange = vi.fn()
  const onPageChange = vi.fn()
  function Harness() {
    const [pageSize, setPageSize] = useState(2)
    const [page, setPage] = useState(2)
    return <FancyTable columns={columns} dataSource={data} rowKey="id" pageSize={pageSize} currentPage={page}
      onPageSizeChange={(size) => { onPageSizeChange(size); setPageSize(size) }}
      onPageChange={(next) => { onPageChange(next); setPage(next) }}
      showSizeChanger pageSizeOptions={[2, 10]} />
  }
  render(<Harness />)
  expect(screen.getByText('charlie')).toBeTruthy()
  expect(screen.queryByText('alpha')).toBeNull()
  fireEvent.change(screen.getByLabelText('Rows per page'), { target: { value: '10' } })
  expect(onPageSizeChange).toHaveBeenCalledWith(10)
  expect(onPageChange).toHaveBeenLastCalledWith(1)
  expect(screen.getByText('alpha')).toBeTruthy()
  expect(screen.getByText('echo')).toBeTruthy()
})

test('page number buttons navigate with aria-current on the active page', () => {
  render(<FancyTable columns={columns} dataSource={data} rowKey="id" pageSize={2} />)
  fireEvent.click(screen.getByRole('button', { name: 'Page 3' }))
  expect(screen.getByRole('button', { name: 'Page 3' }).getAttribute('aria-current')).toBe('page')
  expect(screen.getByText('echo')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
  expect(screen.getByText('delta')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Page 1' }))
  expect(screen.getByText('alpha')).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Previous' }).disabled).toBe(true)
})

test('showTotal renders the record range', () => {
  render(<FancyTable columns={columns} dataSource={data} rowKey="id" pageSize={2} showTotal />)
  expect(screen.getByText('1-2 of 5 records')).toBeTruthy()
})

test('filterMultiple opens a panel and reports selected values as a string array', () => {
  const onFilterChange = vi.fn()
  const filterColumns: FancyTableColumn<Row>[] = [{ key: 'tag', title: 'Tag', dataIndex: 'tag', filters: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }, { label: 'C', value: 'c' }], onFilter: (value, record) => record.tag === value, filterMultiple: true }]
  render(<FancyTable columns={filterColumns} dataSource={data} rowKey="id" onFilterChange={onFilterChange} />)
  fireEvent.click(screen.getByRole('button', { name: 'Filter Tag' }))
  const panel = screen.getByRole('group', { name: 'Filter Tag' })
  fireEvent.click(within(panel).getByLabelText('A'))
  expect(onFilterChange).toHaveBeenLastCalledWith({ tag: ['a'] })
  fireEvent.click(within(panel).getByLabelText('B'))
  expect(onFilterChange).toHaveBeenLastCalledWith({ tag: ['a', 'b'] })
})

test('filterMultiple panel closes on Escape and on outside click', () => {
  const filterColumns: FancyTableColumn<Row>[] = [{ key: 'tag', title: 'Tag', dataIndex: 'tag', filters: [{ label: 'A', value: 'a' }], onFilter: (value, record) => record.tag === value, filterMultiple: true }]
  const view = render(<><div data-testid="outside" /><FancyTable columns={filterColumns} dataSource={data} rowKey="id" /></>)
  fireEvent.click(screen.getByRole('button', { name: 'Filter Tag' }))
  expect(screen.getByRole('group', { name: 'Filter Tag' })).toBeTruthy()
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(screen.queryByRole('group', { name: 'Filter Tag' })).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Filter Tag' }))
  fireEvent.mouseDown(screen.getByTestId('outside'))
  expect(screen.queryByRole('group', { name: 'Filter Tag' })).toBeNull()
  expect(view.container.querySelector('.kvzd-design-fancy-table__filter-panel')).toBeNull()
})

test('single-value filter select still works with string filterValues', () => {
  const onFilterChange = vi.fn()
  const filterColumns: FancyTableColumn<Row>[] = [{ key: 'tag', title: 'Tag', dataIndex: 'tag', filters: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }], onFilter: (value, record) => record.tag === value }]
  const view = render(<FancyTable columns={filterColumns} dataSource={data} rowKey="id" onFilterChange={onFilterChange} />)
  fireEvent.change(screen.getByLabelText('Filter Tag'), { target: { value: 'a' } })
  expect(onFilterChange).toHaveBeenLastCalledWith({ tag: 'a' })
  expect(view.container.querySelectorAll('tbody tr')).toHaveLength(2)
  expect(screen.queryByText('b')).toBeNull()
})
