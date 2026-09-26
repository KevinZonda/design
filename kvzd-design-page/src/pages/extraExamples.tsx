import { useState, type Key } from 'react'
import { Typography } from '@kevinzonda/design'
import { Button, Input } from '@kevinzonda/design/components'
import { Alert, Avatar, Dropdown, FancyTable, Form, Menu, Modal, Progress, Result, Steps, Switch, Tooltip } from '@kevinzonda/design/extraComponents'

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
    {submitted && <Typography.Paragraph role="status">{submitted}</Typography.Paragraph>}
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
      <Typography.Paragraph>Check the details before continuing. The built-in footer confirm button shows a loading state while the request runs.</Typography.Paragraph>
    </Modal>
  </>
}

export function SwitchExample() {
  const [email, setEmail] = useState(true)
  const [sms, setSms] = useState(false)
  return <div className="switch-example">
    <div className="switch-example__row">
      <Switch aria-label="Small email notifications switch" size="s" checked={email} onChange={setEmail} />
      <Typography.Text>Small</Typography.Text>
    </div>
    <div className="switch-example__row">
      <Switch aria-label="Medium SMS notifications switch" checked={sms} onChange={setSms} checkedChildren="On" unCheckedChildren="Off">SMS notifications</Switch>
      <Typography.Text>Medium with checked and unchecked text</Typography.Text>
    </div>
    <div className="switch-example__row">
      <Switch aria-label="Large loading switch" size="l" loading />
      <Typography.Text>Large and loading</Typography.Text>
    </div>
    <div className="switch-example__row">
      <Switch aria-label="Disabled switch" disabled />
      <Typography.Text>Disabled</Typography.Text>
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
  ]} /><Typography.Paragraph className="govuk-!-margin-top-4" aria-live="polite">{selected}</Typography.Paragraph></>
}

export function DropdownExample() {
  const [selected, setSelected] = useState('Choose an action')
  return <><Dropdown label="Actions" ariaLabel="Application actions" items={[
    { key: 'view', label: 'View application' },
    { key: 'download', label: 'Download details' },
  ]} onAction={(key) => setSelected(key === 'view' ? 'View application selected' : 'Download details selected')} />
    <Typography.Paragraph className="govuk-!-margin-top-4" aria-live="polite">{selected}</Typography.Paragraph></>
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
      expandedRowRender: (record) => <Typography.Text>Application {record.id} is currently <strong>{record.status.toLowerCase()}</strong>.</Typography.Text>,
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
  /><Typography.Paragraph className="govuk-!-margin-top-4" aria-live="polite">{selected.length} selected</Typography.Paragraph></>
}

export function AlertExample() {
  const [closed, setClosed] = useState(false)
  return <div className="alert-example">
    <Alert type="success" title="Application sent">You will receive a confirmation email.</Alert>
    <Alert type="info" title="New version available">Refresh the page to get the latest changes.</Alert>
    <Alert type="warning" title="Session ending soon">You will be signed out in 5 minutes.</Alert>
    {closed
      ? <button className="govuk-button govuk-button--secondary" type="button" onClick={() => setClosed(false)}>Restore error alert</button>
      : <Alert type="error" title="There is a problem" closable onClose={() => setClosed(true)}>Check the details you entered and try again.</Alert>}
  </div>
}

export function StepsExample() {
  const [current, setCurrent] = useState(1)
  return <div className="steps-example">
    <Steps
      current={current}
      onChange={setCurrent}
      items={[
        { key: 'details', title: 'Your details', description: 'Name and address' },
        { key: 'upload', title: 'Upload evidence' },
        { key: 'check', title: 'Check answers', disabled: true },
        { key: 'submit', title: 'Submit' },
      ]}
    />
    <Steps
      direction="vertical"
      size="s"
      defaultCurrent={1}
      items={[
        { key: 'account', title: 'Create account' },
        { key: 'verify', title: 'Verify email', status: 'error', description: 'The link has expired' },
        { key: 'start', title: 'Start application' },
      ]}
    />
  </div>
}

export function ProgressExample() {
  return <div className="progress-example">
    <Progress percent={30} />
    <Progress percent={60} status="active" />
    <Progress percent={100} />
    <Progress percent={45} status="exception" />
    <Progress percent={75} color="#1d70b8" size="s" />
  </div>
}

export function ResultExample() {
  return <div className="result-example">
    <Result
      status="success"
      title="Application submitted"
      extra={<><button className="govuk-button" type="button">View status</button><button className="govuk-button govuk-button--secondary" type="button">Start another</button></>}
    >
      Reference KZ-2026-0917. We have emailed a copy of your answers.
    </Result>
    <Result
      status="404"
      title="Page not found"
    >
      Check the web address or return to the service home page.
    </Result>
  </div>
}

export function AvatarExample() {
  return <div className="avatar-example">
    <Avatar src={"data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#b1b4b6"/><circle cx="32" cy="24" r="12" fill="#ffffff"/><ellipse cx="32" cy="52" rx="20" ry="14" fill="#ffffff"/></svg>')} alt="Ada Lovelace" size="l" />
    <Avatar size="l" bgColor="#1d70b8">AK</Avatar>
    <Avatar shape="square" size="l" />
    <Avatar size="s" />
    <Typography.Text>Image, initials, square fallback and small sizes</Typography.Text>
  </div>
}
