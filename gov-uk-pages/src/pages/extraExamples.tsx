import { useState, type Key } from 'react'
import { Dropdown, FancyTable, Menu, Modal } from '@kvzd-design/gov-uk-extends'

export function ModalExample() {
  const [open, setOpen] = useState(false)
  return <>
    <button className="govuk-button" type="button" onClick={() => setOpen(true)}>Open modal</button>
    <Modal open={open} title="Confirm your action" onClose={() => setOpen(false)} footer={<><button className="govuk-button" type="button" onClick={() => setOpen(false)}>Confirm</button><button className="govuk-button govuk-button--secondary" type="button" onClick={() => setOpen(false)}>Cancel</button></>}>
      <p className="govuk-body">Check the details before continuing.</p>
    </Modal>
  </>
}

export function MenuExample() {
  const [selected, setSelected] = useState('No action selected')
  return <><Menu ariaLabel="Record actions" items={[
    { key: 'view', label: 'View record', onClick: () => setSelected('View record selected') },
    { key: 'edit', label: 'Edit record', onClick: () => setSelected('Edit record selected') },
    { key: 'delete', label: 'Delete record', disabled: true },
  ]} /><p className="govuk-body govuk-!-margin-top-4" aria-live="polite">{selected}</p></>
}

export function DropdownExample() {
  const [selected, setSelected] = useState('Choose an action')
  return <><Dropdown label="Actions" menuLabel="Application actions" items={[
    { key: 'view', label: 'View application' },
    { key: 'download', label: 'Download details' },
  ]} onAction={(key) => setSelected(key === 'view' ? 'View application selected' : 'Download details selected')} />
    <p className="govuk-body govuk-!-margin-top-4" aria-live="polite">{selected}</p></>
}

const exampleRows = [
  { id: 'A-101', applicant: 'Amira Khan', status: 'In review' },
  { id: 'A-102', applicant: 'Ben Carter', status: 'Submitted' },
  { id: 'A-103', applicant: 'Chen Li', status: 'Approved' },
  { id: 'A-104', applicant: 'Dana Morgan', status: 'In review' },
  { id: 'A-105', applicant: 'Eli Taylor', status: 'Submitted' },
]

export function FancyTableExample() {
  const [selected, setSelected] = useState<Key[]>([])
  return <><FancyTable
    caption="Applications"
    rowKey="id"
    dataSource={exampleRows}
    selectable
    selectedRowKeys={selected}
    onSelectionChange={setSelected}
    pageSize={3}
    columns={[
      { key: 'id', title: 'Reference', dataIndex: 'id', rowHeader: true, sorter: (a, b) => a.id.localeCompare(b.id) },
      { key: 'applicant', title: 'Applicant', dataIndex: 'applicant', sorter: (a, b) => a.applicant.localeCompare(b.applicant) },
      { key: 'status', title: 'Status', dataIndex: 'status', filters: [
        { label: 'Submitted', value: 'Submitted' },
        { label: 'In review', value: 'In review' },
        { label: 'Approved', value: 'Approved' },
      ], onFilter: (value, row) => row.status === value },
    ]}
  /><p className="govuk-body govuk-!-margin-top-4" aria-live="polite">{selected.length} selected</p></>
}
