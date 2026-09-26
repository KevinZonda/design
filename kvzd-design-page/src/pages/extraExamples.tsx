import { useState, type Key } from 'react'
import { Button, Input } from '@kevinzonda/design/components'
import { Dropdown, FancyTable, Form, Menu, Modal, Switch, Tooltip } from '@kevinzonda/design/extraComponents'

export function FormExample() {
  const [submitted, setSubmitted] = useState('')
  return <>
    <Form onFinish={(values) => setSubmitted(`Submitted for ${values.fullName}`)} onFinishFailed={() => setSubmitted('')}>
      <Form.Item name="fullName" rules={[{ required: true, message: 'Enter your full name' }]}>
        <Input label="Full name" />
      </Form.Item>
      <Form.Item name="email" rules={[{ required: true, message: 'Enter your email address' }, { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' }]}>
        <Input label="Email address" type="email" />
      </Form.Item>
      <Button htmlType="submit">Continue</Button>
    </Form>
    {submitted && <p className="govuk-body" role="status">{submitted}</p>}
  </>
}

export function ModalExample() {
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  return <>
    <button className="govuk-button" type="button" onClick={() => setOpen(true)}>Open modal</button>
    <Modal open={open} title="Confirm your action" onClose={() => setOpen(false)}
      okText="Confirm" cancelText="Cancel" confirmLoading={confirming}
      onOk={() => {
        setConfirming(true)
        setTimeout(() => { setConfirming(false); setOpen(false) }, 1200)
      }}>
      <p className="govuk-body">Check the details before continuing. The built-in footer confirm button shows a loading state while the request runs.</p>
    </Modal>
  </>
}

export function SwitchExample() {
  const [email, setEmail] = useState(true)
  const [sms, setSms] = useState(false)
  return <div className="switch-example">
    <div className="switch-example__row">
      <Switch aria-label="Small email notifications switch" size="s" checked={email} onChange={setEmail} />
      <span className="govuk-body">Small</span>
    </div>
    <div className="switch-example__row">
      <Switch aria-label="Medium SMS notifications switch" checked={sms} onChange={setSms} checkedChildren="On" unCheckedChildren="Off">SMS notifications</Switch>
      <span className="govuk-body">Medium with checked and unchecked content</span>
    </div>
    <div className="switch-example__row">
      <Switch aria-label="Large loading switch" size="l" loading />
      <span className="govuk-body">Large and loading</span>
    </div>
    <div className="switch-example__row">
      <Switch aria-label="Disabled switch" disabled />
      <span className="govuk-body">Disabled</span>
    </div>
  </div>
}

export function TooltipExample() {
  return <div className="tooltip-example">
    <Tooltip title="Opens above the trigger" placement="top"><button className="govuk-button govuk-button--secondary" type="button">Top</button></Tooltip>
    <Tooltip title="Opens below the trigger" placement="bottom"><button className="govuk-button govuk-button--secondary" type="button">Bottom</button></Tooltip>
    <Tooltip title="Opens to the left" placement="left"><button className="govuk-button govuk-button--secondary" type="button">Left</button></Tooltip>
    <Tooltip title="Opens to the right" placement="right"><button className="govuk-button govuk-button--secondary" type="button">Right</button></Tooltip>
  </div>
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
    expandable={{
      expandedRowRender: (record) => <span className="govuk-body">Application {record.id} is currently <strong>{record.status.toLowerCase()}</strong>.</span>,
    }}
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
