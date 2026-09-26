import { useState, type Key } from 'react'
import { Paragraph, Text } from '@kevinzonda/design'
import { kss } from '@kevinzonda/design/kss'
import { Button, Input, Link, Tag } from '@kevinzonda/design/components'
import { Alert, Avatar, Calendar, Card, Col, Dropdown, FancyTable, Form, Menu, Modal, Progress, Result, Row, Slider, Steps, Switch, TimePicker, Tooltip, Transfer } from '@kevinzonda/design/extraComponents'

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
    {submitted && <Paragraph role="status">{submitted}</Paragraph>}
  </>
}

export function ModalExample() {
  const [open, setOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)
  return <>
    <Button onClick={() => setOpen(true)}>Open modal</Button>
    <Modal open={open} title="Confirm your action" onClose={() => setOpen(false)}
      okText="Confirm" cancelText="Cancel" confirmLoading={confirming}
      onOk={() => {
        setConfirming(true)
        setTimeout(() => { setConfirming(false); setOpen(false) }, 1200)
      }}>
      <Paragraph>Check the details before continuing. The built-in footer confirm button shows a loading state while the request runs.</Paragraph>
    </Modal>
  </>
}

export function SwitchExample() {
  const [email, setEmail] = useState(true)
  const [sms, setSms] = useState(false)
  return <div className="switch-example">
    <div className="switch-example__row">
      <Switch aria-label="Small email notifications switch" size="s" checked={email} onChange={setEmail} />
      <Text style={kss('mb0')}>Small</Text>
    </div>
    <div className="switch-example__row">
      <Switch aria-label="Medium SMS notifications switch" checked={sms} onChange={setSms} checkedChildren="On" unCheckedChildren="Off">SMS notifications</Switch>
      <Text style={kss('mb0')}>Medium with checked and unchecked text</Text>
    </div>
    <div className="switch-example__row">
      <Switch aria-label="Large loading switch" size="l" loading />
      <Text style={kss('mb0')}>Large and loading</Text>
    </div>
    <div className="switch-example__row">
      <Switch aria-label="Disabled switch" disabled />
      <Text style={kss('mb0')}>Disabled</Text>
    </div>
  </div>
}

export function TooltipExample() {
  return <div className="tooltip-example">
    <Tooltip title="Opens above the trigger" placement="top"><Button variant="secondary" style={kss('mb0')}>Top</Button></Tooltip>
    <Tooltip title="Opens below the trigger" placement="bottom"><Button variant="secondary" style={kss('mb0')}>Bottom</Button></Tooltip>
    <Tooltip title="Opens to the left" placement="left"><Button variant="secondary" style={kss('mb0')}>Left</Button></Tooltip>
    <Tooltip title="Opens to the right" placement="right"><Button variant="secondary" style={kss('mb0')}>Right</Button></Tooltip>
  </div>
}

export function MenuExample() {
  const [selected, setSelected] = useState('No action selected')
  return <><Menu ariaLabel="Record actions" items={[
    { key: 'view', label: 'View record', onClick: () => setSelected('View record selected') },
    { key: 'edit', label: 'Edit record', onClick: () => setSelected('Edit record selected') },
    { key: 'delete', label: 'Delete record', disabled: true },
  ]} /><Paragraph className="govuk-!-margin-top-4" aria-live="polite">{selected}</Paragraph></>
}

export function DropdownExample() {
  const [selected, setSelected] = useState('Choose an action')
  return <><Dropdown label="Actions" ariaLabel="Application actions" items={[
    { key: 'view', label: 'View application' },
    { key: 'download', label: 'Download details' },
  ]} onAction={(key) => setSelected(key === 'view' ? 'View application selected' : 'Download details selected')} />
    <Paragraph className="govuk-!-margin-top-4" aria-live="polite">{selected}</Paragraph></>
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
      expandedRowRender: (record) => <Text>Application {record.id} is currently <strong>{record.status.toLowerCase()}</strong>.</Text>,
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
  /><Paragraph className="govuk-!-margin-top-4" aria-live="polite">{selected.length} selected</Paragraph></>
}

export function AlertExample() {
  const [closed, setClosed] = useState(false)
  return <div className="alert-example">
    <Alert type="success" title="Application sent">You will receive a confirmation email.</Alert>
    <Alert type="info" title="New version available">Refresh the page to get the latest changes.</Alert>
    <Alert type="warning" title="Session ending soon">You will be signed out in 5 minutes.</Alert>
    {closed
      ? <Button variant="secondary" onClick={() => setClosed(false)}>Restore error alert</Button>
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
      extra={<><Button>View status</Button><Button variant="secondary">Start another</Button></>}
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
    <Text style={kss('mb0', 'ml8')}>Image, initials, square fallback and small sizes</Text>
  </div>
}

export function GridExample() {
  return <div className="grid-example">
    <Row>
      <Col width="one-half"><div className="grid-example-cell">one-half</div></Col>
      <Col width="one-half"><div className="grid-example-cell">one-half</div></Col>
    </Row>
    <Row>
      <Col width="one-third"><div className="grid-example-cell">one-third</div></Col>
      <Col width="two-thirds"><div className="grid-example-cell">two-thirds</div></Col>
    </Row>
    <Row>
      <Col width="one-quarter" fromDesktop><div className="grid-example-cell">one-quarter fromDesktop</div></Col>
      <Col width="three-quarters" fromDesktop><div className="grid-example-cell">three-quarters fromDesktop</div></Col>
    </Row>
  </div>
}

export function CardExample() {
  return <div className="card-example">
    <Card title="Application overview" extra={<Tag color="green">Active</Tag>} hoverable>
      <Paragraph className="govuk-!-margin-bottom-0">Reference KZ-2026-0917 was submitted on 12 September 2026 and is being reviewed.</Paragraph>
    </Card>
    <Card title="Supporting evidence" actions={<Link href="#example-title">Attach a file</Link>}>
      <Paragraph className="govuk-!-margin-bottom-0">Upload documents that support your application. Each file must be smaller than 10 MB.</Paragraph>
    </Card>
  </div>
}

export function CalendarExample() {
  const [selected, setSelected] = useState<Date | null>(() => {
    const date = new Date()
    date.setDate(date.getDate() + 2)
    return date
  })
  const [min, max] = (() => {
    const start = new Date()
    start.setDate(start.getDate() - 1)
    const end = new Date()
    end.setDate(end.getDate() + 27)
    return [start, end]
  })()
  return <div className="calendar-example">
    <Calendar
      value={selected}
      onChange={setSelected}
      min={min}
      max={max}
      dateCellRender={(date) => date.getDay() === 0 || date.getDay() === 6 ? '·' : null}
    />
    <Paragraph className="govuk-!-margin-top-4" aria-live="polite">
      {selected ? `Selected ${selected.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}. Weekends show a marker; only the next 28 days are selectable.` : 'No date selected.'}
    </Paragraph>
  </div>
}

const transferData = [
  { key: 'passport', label: 'Passport', description: 'Certified copy of the photo page' },
  { key: 'payslips', label: 'Payslips', description: 'Covering the last 3 months' },
  { key: 'bank', label: 'Bank statements', description: 'Statements for the last 3 months' },
  { key: 'dbs', label: 'DBS check', description: 'Basic disclosure certificate', disabled: true },
  { key: 'reference', label: 'Reference letter', description: 'From your current employer' },
  { key: 'degree', label: 'Degree certificate', description: 'Copy of your highest qualification' },
  { key: 'utility', label: 'Utility bill', description: 'Dated within the last 3 months' },
]

export function TransferExample() {
  const [targetKeys, setTargetKeys] = useState<Key[]>(['passport'])
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([])
  return <><Transfer
    dataSource={transferData}
    titles={['Available documents', 'Documents to upload']}
    targetKeys={targetKeys}
    selectedKeys={selectedKeys}
    onChange={(next) => setTargetKeys(next)}
    onSelectChange={(next) => setSelectedKeys(next)}
    showSearch
  />
    <Paragraph className="govuk-!-margin-top-4" aria-live="polite">{targetKeys.length} of {transferData.length} documents selected for upload</Paragraph>
  </>
}

const sliderMarks = [
  { value: 0, label: '0' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
]

const rangeMarks = [
  { value: 0, label: '£0' },
  { value: 50, label: '£50' },
  { value: 100, label: '£100' },
]

export function SliderExample() {
  const [volume, setVolume] = useState(40)
  const [budget, setBudget] = useState<[number, number]>([20, 80])
  return <div className="slider-example">
    <Slider
      ariaLabel="Case volume"
      min={0}
      max={100}
      step={5}
      marks={sliderMarks}
      value={volume}
      onChange={(value) => setVolume(value as number)}
    />
    <Slider
      ariaLabel="Budget"
      range
      min={0}
      max={100}
      marks={rangeMarks}
      value={budget}
      onChange={(value) => setBudget(value as [number, number])}
    />
    <Paragraph className="govuk-!-margin-top-4" aria-live="polite">
      Case volume {volume}. Budget between £{budget[0]} and £{budget[1]}.
    </Paragraph>
  </div>
}

export function TimePickerExample() {
  const [time, setTime] = useState('09:30')
  return <div className="timepicker-example">
    <TimePicker
      label="Appointment time"
      hint="For example, 09:30"
      value={time}
      onChange={setTime}
      minuteStep={15}
      allowClear
    />
    <Paragraph className="govuk-!-margin-top-4" aria-live="polite">
      {time ? `Selected time: ${time}` : 'No time selected.'}
    </Paragraph>
  </div>
}
