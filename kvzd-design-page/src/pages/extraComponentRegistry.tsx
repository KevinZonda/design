import type { ReactNode } from 'react'
import { Paragraph } from '@kevinzonda/design'
import { BackLink, Button, Link } from '@kevinzonda/design/components'
import { Divider, Empty, FancyTabs, Loading, Note, ShowcaseBox, Sidebar, TagBox, CodeBox } from '@kevinzonda/design/extraComponents'
import type { ApiProp } from './componentRegistry'
import { DocsLink } from './DocsLink'
import { DropdownExample, FancyTableExample, FormExample, MenuExample, ModalExample, AlertExample, ProgressExample, ResultExample, AvatarExample, StepsExample, SwitchExample, TooltipExample, GridExample, CardExample, CalendarExample, TransferExample, SliderExample, TimePickerExample } from './extraExamples'

export interface ExtraComponentDoc {
  slug: string
  name: string
  summary: string
  whenToUse: ReactNode
  howItWorks: ReactNode
  code: string
  example: () => ReactNode
  api: ApiProp[]
  wide?: boolean
}

const fancyTabsCode = `<FancyTabs items={[
  {
    key: 'summary',
    label: 'Summary',
    children: <Paragraph className="govuk-!-margin-top-4">Review the application before continuing.</Paragraph>,
  },
  {
    key: 'details',
    label: 'Details',
    children: <Paragraph className="govuk-!-margin-top-4">The application contains 3 sections.</Paragraph>,
  },
]} />`

const sidebarCode = `<Paragraph><strong>Nested navigation</strong></Paragraph>
<div className="sidebar-example">
  <Sidebar
    heading="Pages in this section"
    activeKey="history"
    items={[
      { key: 'accordion', label: 'Accordion', href: '#example-title', children: [
        { key: 'history', label: 'History', href: '#api-title' },
      ] },
      { key: 'fancy-tabs', label: 'FancyTabs', href: '#guidance-title' },
    ]}
  />
</div>

<Paragraph><strong>Collapsible navigation</strong></Paragraph>
<div className="sidebar-example">
  <Sidebar
    heading="Documentation"
    collapsible
    activeKey="sidebar-api"
    items={[
      { key: 'examples', label: 'Examples', children: [
        { key: 'fancy-tabs', label: 'FancyTabs', href: '#example-title' },
        { key: 'sidebar', label: 'Sidebar', href: '#example-title', children: [
          { key: 'sidebar-api', label: 'React API', href: '#api-title' },
        ] },
      ] },
      { key: 'reference', label: 'Reference', children: [
        { key: 'guidance', label: 'When to use', href: '#guidance-title' },
      ] },
    ]}
  />
</div>`

export const extraComponentDocs: ExtraComponentDoc[] = [
  {
    slug: 'modal',
    name: 'Modal',
    summary: 'A focused dialog for a short decision or task that must be completed before returning to the page.',
    whenToUse: 'Use for a brief confirmation or focused task. Keep longer journeys on normal pages.',
    howItWorks: 'A native dialog enters the top layer and keeps keyboard focus inside it. Escape, the close button and optional backdrop clicks request closure through onClose, and focus returns to the element that opened the dialog.',
    code: `const [open, setOpen] = useState(false)
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
</>`,
    example: () => <ModalExample />,
    api: [
      { name: 'open', type: 'boolean', description: 'Controls whether the dialog is shown.' },
      { name: 'title', type: 'ReactNode', description: 'Visible heading and accessible dialog name.' },
      { name: 'children', type: 'ReactNode', description: 'Dialog content.' },
      { name: 'footer', type: 'ReactNode', description: 'Optional action area; when omitted and onOk or custom okText or cancelText is supplied, a built-in footer is rendered.' },
      { name: 'onClose', type: '() => void', description: 'Called when the user requests closure; update open in the parent.' },
      { name: 'closeOnBackdrop', type: 'boolean', defaultValue: 'true', description: 'Allow backdrop clicks to request closure.' },
      { name: 'mask', type: 'boolean', defaultValue: 'true', description: 'Show the default dark backdrop; pass false to let the page show through.' },
      { name: 'closeLabel', type: 'string', defaultValue: 'Close', description: 'Accessible name of the close button.' },
      { name: 'width', type: 'number | string', description: 'Dialog width in pixels or any CSS length.' },
      { name: 'centered', type: 'boolean', defaultValue: 'false', description: 'Centre the dialog vertically.' },
      { name: 'keyboard', type: 'boolean', defaultValue: 'true', description: 'Allow Escape to request closure.' },
      { name: 'closable', type: 'boolean', defaultValue: 'true', description: 'Show the close button.' },
      { name: 'okText', type: 'ReactNode', defaultValue: 'Confirm', description: 'Label of the built-in footer confirm action.' },
      { name: 'cancelText', type: 'ReactNode', defaultValue: 'Cancel', description: 'Label of the built-in footer cancel action.' },
      { name: 'onOk', type: '() => void | Promise<void>', description: 'Called by the built-in footer confirm action; a returned promise keeps the confirm button loading until it settles.' },
      { name: 'confirmLoading', type: 'boolean', defaultValue: 'false', description: 'Loading state of the built-in footer confirm button.' },
      { name: 'destroyOnClose', type: 'boolean', defaultValue: 'false', description: 'Remove the dialog content from the DOM after the dialog has been closed once.' },
      { name: 'afterOpenChange', type: '(open: boolean) => void', description: 'Called after each open state change.' },
      { name: 'afterClose', type: '() => void', description: 'Called once after the dialog closes.' },
      { name: 'ref', type: 'Ref<HTMLDialogElement>', description: 'Native dialog element.' },
    ],
  },
  {
    slug: 'empty',
    name: 'Empty',
    summary: 'A clear state for a list, table or search with no records to display.',
    whenToUse: 'Show when a view has no data or a filter returns no results. Explain the reason or offer a next step when useful.',
    howItWorks: 'A visible heading, main content and optional actions sit inside a neutral surface. Pass the main content as children and actions through the actions prop. The illustration is decorative and can be replaced.',
    code: `<Empty title="No applications found" actions={<Button>Clear filters</Button>}>
  Try changing your filters.
</Empty>`,
    example: () => <Empty title="No applications found" actions={<Button>Clear filters</Button>}>Try changing your filters.</Empty>,
    api: [
      { name: 'title', type: 'ReactNode', defaultValue: 'No results found', description: 'Short explanation of the empty state.' },
      { name: 'children', type: 'ReactNode', description: 'Main content beneath the title.' },
      { name: 'actions', type: 'ReactNode', description: 'Optional action area, such as buttons.' },
      { name: 'illustration', type: 'ReactNode', description: 'Optional decorative graphic.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Empty state root element.' },
    ],
  },
  {
    slug: 'loading',
    name: 'Loading',
    summary: 'Spinner and skeleton treatments for content that is still loading.',
    whenToUse: 'Use the spinner for a short wait and the skeleton when the structure of the pending content is known.',
    howItWorks: 'Both variants expose a status label to assistive technology. Animation stops when reduced motion is requested.',
    code: `<Loading size="l" label="Loading applications" />
<Loading variant="skeleton" size="s" lines={3} label="Loading results" />`,
    example: () => <div className="extra-loading-example"><Loading size="l" label="Loading applications" /><Loading variant="skeleton" size="s" lines={3} label="Loading results" /></div>,
    api: [
      { name: 'variant', type: "'spinner' | 'skeleton'", defaultValue: 'spinner', description: 'Visual loading treatment.' },
      { name: 'size', type: "'s' | 'm' | 'l'", defaultValue: 'm', description: 'Size of the spinner or skeleton rows.' },
      { name: 'label', type: 'string', defaultValue: 'Loading', description: 'Accessible loading status.' },
      { name: 'lines', type: 'number', defaultValue: '3', description: 'Number of skeleton rows.' },
      { name: 'delay', type: 'number', defaultValue: '0', description: 'Delay in milliseconds before the loading state is shown.' },
      { name: 'fullscreen', type: 'boolean', defaultValue: 'false', description: 'Overlay the entire viewport.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Loading root element.' },
    ],
  },
  {
    slug: 'divider',
    name: 'Divider',
    summary: 'Separate sections of content with the GOV.UK section break style.',
    whenToUse: 'Use between distinct content sections when spacing alone is not enough. Avoid adding a line between every field or paragraph.',
    howItWorks: 'Renders a semantic hr with GOV.UK section break spacing. Set visible to false for a spacing-only break.',
    code: `<Paragraph>First section</Paragraph>\n<Divider size="m" />\n<Paragraph>Second section</Paragraph>`,
    example: () => <div><Paragraph>First section</Paragraph><Divider size="m" /><Paragraph>Second section</Paragraph></div>,
    api: [
      { name: 'size', type: "'m' | 'l' | 'xl'", defaultValue: 'm', description: 'GOV.UK spacing around the section break.' },
      { name: 'visible', type: 'boolean', defaultValue: 'true', description: 'Show the divider line; false leaves a spacing-only break.' },
      { name: 'ref', type: 'Ref<HTMLHRElement>', description: 'Native horizontal rule element.' },
    ],
  },
  {
    slug: 'menu',
    name: 'Menu',
    summary: 'A compact list of actions with keyboard navigation.',
    whenToUse: 'Use for a short group of related actions. Use ordinary navigation links for primary page navigation.',
    howItWorks: 'Arrow keys and Home/End move focus among enabled actions. Items can use href or onClick; when both are supplied, onClick takes precedence.',
    code: `const [selected, setSelected] = useState('No action selected')
return <>
  <Menu ariaLabel="Record actions" items={[
    { key: 'view', label: 'View record', onClick: () => setSelected('View record selected') },
    { key: 'edit', label: 'Edit record', onClick: () => setSelected('Edit record selected') },
    { key: 'delete', label: 'Delete record', disabled: true },
  ]} />
  <Paragraph className="govuk-!-margin-top-4" aria-live="polite">{selected}</Paragraph>
</>`,
    example: () => <MenuExample />,
    api: [
      { name: 'items', type: 'MenuItem[]', description: 'Actions with key, label, optional href, onClick, icon, danger styling or disabled; set type to divider for a separator.' },
      { name: 'ariaLabel', type: 'string', description: 'Accessible name for the menu.' },
      { name: 'autoFocus', type: 'boolean', defaultValue: 'false', description: 'Focus the first enabled action on mount.' },
      { name: 'onAction', type: '(key: string) => void', description: 'Called after an action is activated.' },
      { name: 'onEscape', type: '() => void', description: 'Called when Escape is pressed.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Menu root element.' },
    ],
  },
  {
    slug: 'dropdown',
    name: 'Dropdown',
    summary: 'A button that opens a compact action menu.',
    whenToUse: 'Use when several secondary actions share a single place in a toolbar or record row.',
    howItWorks: 'The trigger exposes its expanded state. The menu opens with focus on its first action and closes on selection, Escape or an outside click.',
    code: `const [selected, setSelected] = useState('Choose an action')
return <>
  <Dropdown label="Actions" ariaLabel="Application actions" items={[
    { key: 'view', label: 'View application' },
    { key: 'download', label: 'Download details' },
  ]} onAction={(key) => setSelected(key === 'view' ? 'View application selected' : 'Download details selected')} />
  <Paragraph className="govuk-!-margin-top-4" aria-live="polite">{selected}</Paragraph>
</>`,
    example: () => <DropdownExample />,
    api: [
      { name: 'label', type: 'ReactNode', description: 'Trigger button content.' },
      { name: 'ariaLabel', type: 'string', description: 'Accessible name for the action menu.' },
      { name: 'items', type: 'MenuItem[]', description: 'Actions shown in the menu.' },
      { name: 'open / defaultOpen', type: 'boolean', description: 'Controlled or initial open state.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the menu requests a state change.' },
      { name: 'onAction', type: '(key: string) => void', description: 'Called after an item is activated.' },
      { name: 'trigger', type: "'click' | 'hover'", defaultValue: 'click', description: 'Interaction that opens the menu.' },
      { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", defaultValue: 'bottom', description: 'Where the menu appears relative to the trigger.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Dropdown root element.' },
    ],
  },
  {
    slug: 'fancy-table',
    name: 'FancyTable',
    summary: 'A data table with optional sorting, filtering, row selection and client-side pagination.',
    whenToUse: 'Use for records that need comparison and direct interaction. Keep the standard Table for simple read-only data.',
    howItWorks: 'Column comparators and filter functions process the supplied data locally. Selection can be controlled or internal; Select all applies to the current page.',
    code: `const [selected, setSelected] = useState([])
const exampleRows = [
  { id: 'A-101', applicant: 'Amira Khan', status: 'In review' },
  { id: 'A-102', applicant: 'Ben Carter', status: 'Submitted' },
  { id: 'A-103', applicant: 'Chen Li', status: 'Approved' },
  { id: 'A-104', applicant: 'Dana Morgan', status: 'In review' },
  { id: 'A-105', applicant: 'Eli Taylor', status: 'Submitted' },
]
return <>
  <FancyTable
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
  />
  <Paragraph className="govuk-!-margin-top-4" aria-live="polite">{selected.length} selected</Paragraph>
</>`,
    example: () => <FancyTableExample />,
    wide: true,
    api: [
      { name: 'columns', type: 'FancyTableColumn<T>[]', description: 'Column definitions with optional sorter, filters, onFilter, filterMultiple and onCell.' },
      { name: 'dataSource', type: 'T[]', description: 'Records displayed by the table.' },
      { name: 'rowKey', type: 'keyof T | (record: T) => Key', description: 'Stable unique key for each row.' },
      { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Replace the body with a loading indicator and mark the table busy.' },
      { name: 'selectable', type: 'boolean', defaultValue: 'false', description: 'Show row and current-page selection controls.' },
      { name: 'selectedRowKeys / defaultSelectedRowKeys', type: 'Key[]', description: 'Controlled or initial selected row keys.' },
      { name: 'onSelectionChange', type: '(keys: Key[]) => void', description: 'Called when the selection changes.' },
      { name: 'sort / defaultSort', type: 'FancyTableSort | null', description: 'Controlled or initial column and direction.' },
      { name: 'onSortChange', type: '(sort: FancyTableSort | null) => void', description: 'Called when the sort changes.' },
      { name: 'filterValues / defaultFilterValues', type: 'Record<string, string | string[]>', description: 'Controlled or initial filter values by column key.' },
      { name: 'onFilterChange', type: '(values: Record<string, string | string[]>) => void', description: 'Called when a column filter changes.' },
      { name: 'onChange', type: '(change: { page: number; pageSize: number | undefined; sort: FancyTableSort | null; filters: Record<string, string | string[]> }) => void', description: 'Aggregate callback for remote data mode, fired after any pagination, sort or filter change.' },
      { name: 'expandable', type: 'FancyTableExpandable<T>', description: 'Row expansion with expandedRowRender, optional rowExpandable and controlled or initial expanded row keys.' },
      { name: 'rowClassName', type: '(record: T, index: number) => string', description: 'Additional class for each row.' },
      { name: 'onRow', type: '(record: T, index: number) => HTMLAttributes<HTMLTableRowElement>', description: 'Native attributes and handlers applied to each row.' },
      { name: 'pageSize / currentPage', type: 'number', description: 'Local page size and optional controlled page.' },
      { name: 'onPageChange', type: '(page: number) => void', description: 'Called when the page changes.' },
      { name: 'showTotal', type: 'boolean | ((total: number, range: [number, number]) => ReactNode)', description: 'Show record totals beside the pagination; a function renders custom text.' },
      { name: 'showSizeChanger', type: 'boolean', defaultValue: 'false', description: 'Let users change the page size.' },
      { name: 'pageSizeOptions', type: 'number[]', defaultValue: '[10, 20, 50]', description: 'Page sizes offered by the size changer.' },
      { name: 'onPageSizeChange', type: '(size: number) => void', description: 'Called when the page size changes.' },
      { name: 'emptyContent', type: 'ReactNode', description: 'Content displayed when there are no records.' },
      { name: 'ref', type: 'Ref<HTMLTableElement>', description: 'Table element.' },
    ],
  },
  {
    slug: 'fancy-tabs',
    name: 'FancyTabs',
    summary: 'A stronger tab treatment for switching between views such as a live preview and its React source.',
    whenToUse: <>Use when an interface needs a more prominent tab treatment than the standard <DocsLink className="govuk-link" to="/en/components/tabs/">Tabs</DocsLink> component.</>,
    howItWorks: 'It shares the standard Tabs props and manages the selected panel in React. Arrow keys move between tabs.',
    code: fancyTabsCode,
    example: () => <FancyTabs items={[
      { key: 'summary', label: 'Summary', children: <Paragraph className="govuk-!-margin-top-4">Review the application before continuing.</Paragraph> },
      { key: 'details', label: 'Details', children: <Paragraph className="govuk-!-margin-top-4">The application contains 3 sections.</Paragraph> },
    ]} />,
    api: [
      { name: 'items', type: 'TabItem[]', description: 'Tab keys, labels and panel content. Items can be disabled to make their tab non-interactive.' },
      { name: 'activeKey', type: 'string', description: 'Controlled active tab.' },
      { name: 'defaultActiveKey', type: 'string', description: 'Initial active tab.' },
      { name: 'onChange', type: '(key: string) => void', description: 'Called with the selected tab key.' },
      { name: 'destroyOnClose', type: 'boolean', defaultValue: 'false', description: 'Remove inactive panel content from the DOM instead of hiding it.' },
    ],
  },
  {
    slug: 'form',
    name: 'Form',
    summary: 'Collect and validate related answers with GOV.UK field errors and an error summary.',
    whenToUse: 'Use when a page has several answers that must be validated together on submission.',
    howItWorks: 'Form.Item connects a field to a native form. On submission, Form reads FormData, validates registered rules, preserves entered answers, displays inline errors and focuses the error summary.',
    code: `const [submitted, setSubmitted] = useState('')
return <>
  <Form onFinish={(values) => setSubmitted('Submitted for ' + values.fullName)} onFinishFailed={() => setSubmitted('')}>
    <Form.Item name="fullName" rules={[{ required: true, message: 'Enter your full name' }]}>
      <Input label="Full name" />
    </Form.Item>
    <Form.Item name="email" rules={[{ required: true, message: 'Enter your email address' }, { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' }]}>
      <Input label="Email address" type="email" />
    </Form.Item>
    <Button htmlType="submit">Continue</Button>
  </Form>
  {submitted && <Paragraph role="status">{submitted}</Paragraph>}
</>`,
    example: () => <FormExample />,
    api: [
      { name: 'initialValues', type: 'Record<string, string | string[]>', description: 'Initial values for registered fields.' },
      { name: 'onFinish', type: '(values: FormValues) => void', description: 'Called when every field passes validation.' },
      { name: 'onFinishFailed', type: '(errors: FormError[], values: FormValues) => void', description: 'Called when submission finds errors.' },
      { name: 'validate', type: '(values: FormValues) => { name: string; message: string }[]', description: 'Optional form-level validation for related fields.' },
      { name: 'validateTrigger', type: "'onChange' | 'onBlur' | 'submit' | array", defaultValue: 'submit', description: 'When registered rules run; pass an array to validate on several events.' },
      { name: 'scrollToFirstError', type: 'boolean', defaultValue: 'false', description: 'Move focus to the first field with an error after a failed submission.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disable every field inside the form.' },
      { name: 'messages', type: 'Partial<ValidateMessages>', description: 'Override the built-in validation message templates; supports ${label} and rule value interpolation.' },
      { name: 'form', type: 'FormInstance', description: 'Bind a Form.useForm() instance to the form for imperative operations.' },
      { name: 'Form.useForm', type: '() => [FormInstance]', description: 'Create an instance with getFieldValue, getFieldsValue, setFieldValue, setFieldsValue, validateFields, resetFields and submit.' },
      { name: 'Form.List', type: '(fields, { add, remove }) => ReactNode', description: 'Render a dynamic group of named fields such as passengers.0, passengers.1.' },
      { name: 'errorSummaryTitle', type: 'ReactNode', defaultValue: 'There is a problem', description: 'Heading displayed above validation links.' },
      { name: 'Form.Item name', type: 'string', description: 'Native field name used to read its submitted value.' },
      { name: 'Form.Item rules', type: 'FormRule[]', description: 'Required, pattern, min, max, len, type, whitespace or custom rules; checked according to validateTrigger.' },
      { name: 'Form.Item dependencies', type: 'string[]', description: 'Re-validate this field when one of the listed fields changes.' },
      { name: 'Form.Item label', type: 'ReactNode', description: 'Label injected into the field when it has none; also used in validation messages.' },
      { name: 'Form.Item help', type: 'ReactNode', description: 'Custom help text; when set it replaces the validation error display.' },
      { name: 'Form.Item extra', type: 'ReactNode', description: 'Supplementary text always shown beneath the field.' },
      { name: 'Form.Item multiple', type: 'boolean', defaultValue: 'false', description: 'Read all values for a checkbox group.' },
      { name: 'Form.Item focusTargetId', type: 'string', description: 'ID targeted from the error summary for grouped fields.' },
      { name: 'ref', type: 'Ref<HTMLFormElement>', description: 'Native form element.' },
    ],
  },
  {
    slug: 'note',
    name: 'Note',
    summary: 'Highlight a short implementation note or other supporting information.',
    whenToUse: 'Use for supporting guidance that needs more emphasis than ordinary body text without implying a warning or success state.',
    howItWorks: 'The optional title appears above the content. Note accepts normal div attributes, so a page can add a class for local spacing.',
    code: `<Note title="React implementation">
  <p>State changes stay inside React. The rendered markup uses GOV.UK classes and semantic HTML.</p>
</Note>`,
    example: () => <Note title="React implementation"><p>State changes stay inside React. The rendered markup uses GOV.UK classes and semantic HTML.</p></Note>,
    api: [
      { name: 'title', type: 'ReactNode', description: 'Optional bold label above the content.' },
      { name: 'children', type: 'ReactNode', description: 'Supporting content inside the note.' },
      { name: 'className', type: 'string', description: 'Additional CSS class for local spacing or styling.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Note root element.' },
    ],
  },
  {
    slug: 'sidebar',
    name: 'Sidebar',
    summary: 'Nested navigation for related pages or sections, with optional expand and collapse controls.',
    whenToUse: 'Use for a group of related documentation pages. Enable collapsible groups when a large navigation tree needs to be shortened.',
    howItWorks: 'Links render as anchors by default. Groups can contain nested children; renderLink can supply a client-side router link. The active branch is highlighted.',
    code: sidebarCode,
    example: () => <>
      <Paragraph><strong>Nested navigation</strong></Paragraph>
      <div className="sidebar-example">
        <Sidebar heading="Pages in this section" activeKey="history" items={[
          { key: 'accordion', label: 'Accordion', href: '#example-title', children: [
            { key: 'history', label: 'History', href: '#api-title' },
          ] },
          { key: 'fancy-tabs', label: 'FancyTabs', href: '#guidance-title' },
        ]} />
      </div>
      <Paragraph><strong>Collapsible navigation</strong></Paragraph>
      <div className="sidebar-example">
        <Sidebar heading="Documentation" collapsible activeKey="sidebar-api" items={[
          { key: 'examples', label: 'Examples', children: [
            { key: 'fancy-tabs', label: 'FancyTabs', href: '#example-title' },
            { key: 'sidebar', label: 'Sidebar', href: '#example-title', children: [
              { key: 'sidebar-api', label: 'React API', href: '#api-title' },
            ] },
          ] },
          { key: 'reference', label: 'Reference', children: [
            { key: 'guidance', label: 'When to use', href: '#guidance-title' },
          ] },
        ]} />
      </div>
    </>,
    api: [
      { name: 'heading', type: 'ReactNode', description: 'Visible heading and navigation label.' },
      { name: 'items', type: 'SidebarItem[]', description: 'Links can have nested children; items without href or onClick are group headings.' },
      { name: 'activeKey', type: 'string', description: 'Key of the current link and branch.' },
      { name: 'collapsible', type: 'boolean', defaultValue: 'false', description: 'Add expand and collapse controls to items with children.' },
      { name: 'renderLink', type: '(item, options) => ReactNode', description: 'Optional link renderer for a client-side router.' },
      { name: 'onExpandChange', type: '(key: string, expanded: boolean) => void', description: 'Called when a collapsible group is toggled.' },
      { name: 'ref', type: 'Ref<HTMLElement>', description: 'Sidebar navigation root element.' },
    ],
  },
  {
    slug: 'showcase-box',
    name: 'ShowcaseBox',
    summary: 'Present a component or pattern with a title, description, live example and related links.',
    whenToUse: 'Use in design system galleries or documentation pages where several components need a consistent preview container.',
    howItWorks: 'The heading level is configurable, optional header and footer slots accept any React content, and the top accent follows the active brand colour token.',
    code: `<ShowcaseBox
  title="Back link"
  description="Help users return to the previous step in a multi-page service."
  footer={<>
    <Link href="#example-title">View documentation</Link>
    <Link href="#top">Back to top</Link>
  </>}
>
  <BackLink href="#example-title">Back</BackLink>
</ShowcaseBox>`,
    example: () => <ShowcaseBox
      title="Back link"
      description="Help users return to the previous step in a multi-page service."
      footer={<><Link href="#example-title">View documentation</Link><Link href="#top">Back to top</Link></>}
    ><BackLink href="#example-title">Back</BackLink></ShowcaseBox>,
    api: [
      { name: 'title', type: 'ReactNode', description: 'Heading shown above the preview.' },
      { name: 'description', type: 'ReactNode', description: 'Optional supporting text beneath the heading.' },
      { name: 'children', type: 'ReactNode', description: 'The component or pattern being showcased.' },
      { name: 'headerExtra', type: 'ReactNode', description: 'Optional content aligned opposite the heading, such as a status tag.' },
      { name: 'footer', type: 'ReactNode', description: 'Optional links or actions beneath the preview.' },
      { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', defaultValue: '2', description: 'Semantic level of the showcase heading.' },
      { name: 'styles / classNames', type: 'SemanticStyling', description: 'Overrides for named parts of the component.' },
      { name: 'ref', type: 'Ref<HTMLElement>', description: 'Showcase article element.' },
    ],
  },
  {
    slug: 'tag-box',
    name: 'TagBox',
    summary: 'A neutral outlined label for short metadata such as a version number.',
    whenToUse: <>Use for metadata that does not communicate a status. Use the standard <DocsLink className="govuk-link" to="/en/components/tag/">Tag</DocsLink> when the label communicates a status.</>,
    howItWorks: 'It renders a span and accepts standard span attributes and an optional className.',
    code: `<div className="tag-box-example">\n  <TagBox>6.5.1</TagBox>\n  <TagBox>Release candidate</TagBox>\n</div>`,
    example: () => <div className="tag-box-example"><TagBox>6.5.1</TagBox><TagBox>Release candidate</TagBox></div>,
    api: [
      { name: 'children', type: 'ReactNode', description: 'Short text or other inline content displayed inside the box.' },
      { name: 'className', type: 'string', description: 'Additional CSS class for positioning or local styling.' },
    ],
  },
  {
    slug: 'switch',
    name: 'Switch',
    summary: 'A binary toggle for a setting that takes effect immediately.',
    whenToUse: 'Use for on/off settings that apply as soon as they are changed. Use checkboxes or radios when the choice is submitted with a form.',
    howItWorks: 'The toggle is a button with role switch and an aria-checked state. A string child becomes a visually hidden label. The track shows On and Off text beside the knob by default; customise it with checkedChildren and unCheckedChildren. Loading shows a spinner in the handle and blocks interaction.',
    code: `const [email, setEmail] = useState(true)
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
</div>`,
    example: () => <SwitchExample />,
    api: [
      { name: 'checked', type: 'boolean', description: 'Controlled checked state.' },
      { name: 'defaultChecked', type: 'boolean', defaultValue: 'false', description: 'Initial checked state.' },
      { name: 'onChange', type: '(checked: boolean) => void', description: 'Called with the new state when the toggle is pressed.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Prevent interaction.' },
      { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Show a spinner in the handle and block interaction.' },
      { name: 'size', type: "'s' | 'm' | 'l'", defaultValue: 'm', description: 'Toggle size.' },
      { name: 'checkedChildren', type: 'ReactNode', defaultValue: "'On'", description: 'Text shown in the track while checked.' },
      { name: 'unCheckedChildren', type: 'ReactNode', defaultValue: "'Off'", description: 'Text shown in the track while unchecked.' },
      { name: 'children', type: 'ReactNode', description: 'A string becomes a visually hidden label; other content renders beside the toggle.' },
      { name: 'aria-label', type: 'string', description: 'Accessible name when children are not a plain string.' },
      { name: 'name', type: 'string', description: 'Render a hidden input so the checked state submits with a native form.' },
      { name: 'ref', type: 'Ref<HTMLButtonElement>', description: 'Native toggle button.' },
    ],
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    summary: 'A short label that appears next to an element to explain it.',
    whenToUse: 'Use for brief explanations of icons, buttons or status text. Do not hide information users must read to complete a task; use visible hint text instead.',
    howItWorks: 'The single child element is cloned and given the trigger handlers. With plain text or number content, the trigger receives aria-describedby while the popup is open, and the popup itself has role tooltip.',
    code: `<div className="tooltip-example">
  <Tooltip title="Opens above the trigger" placement="top"><Button variant="secondary" style={kss('mb0')}>Top</Button></Tooltip>
  <Tooltip title="Opens below the trigger" placement="bottom"><Button variant="secondary" style={kss('mb0')}>Bottom</Button></Tooltip>
  <Tooltip title="Opens to the left" placement="left"><Button variant="secondary" style={kss('mb0')}>Left</Button></Tooltip>
  <Tooltip title="Opens to the right" placement="right"><Button variant="secondary" style={kss('mb0')}>Right</Button></Tooltip>
</div>`,
    example: () => <TooltipExample />,
    api: [
      { name: 'title', type: 'ReactNode', description: 'Content of the tooltip.' },
      { name: 'children', type: 'ReactElement', description: 'Single element that triggers the tooltip.' },
      { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", defaultValue: 'top', description: 'Where the tooltip appears relative to the trigger.' },
      { name: 'trigger', type: "'hover' | 'focus' | 'click'", defaultValue: 'hover', description: 'Interaction that shows the tooltip.' },
      { name: 'open / defaultOpen', type: 'boolean', description: 'Controlled or initial open state.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the tooltip requests a state change.' },
      { name: 'getPopupContainer', type: '() => HTMLElement', description: 'Mount the popup into a custom container with fixed positioning; useful inside overflow-clipping scroll areas.' },
      { name: 'ref', type: 'Ref<HTMLSpanElement>', description: 'Tooltip wrapper element.' },
    ],
  },
  {
    slug: 'alert',
    name: 'Alert',
    summary: 'Show a short success, informational, warning or error message about a recent action.',
    whenToUse: 'Use for the outcome of an action on the page, such as a save completing or a request failing. Use the error summary for form validation errors.',
    howItWorks: 'Error and warning alerts use the alert role so they are announced immediately; success and info alerts use the status role. An optional icon matches the type, and a closable alert shows a close button.',
    code: `const [closed, setClosed] = useState(false)
return <div className="alert-example">
  <Alert type="success" title="Application sent">You will receive a confirmation email.</Alert>
  <Alert type="info" title="New version available">Refresh the page to get the latest changes.</Alert>
  <Alert type="warning" title="Session ending soon">You will be signed out in 5 minutes.</Alert>
  {closed
    ? <Button variant="secondary" onClick={() => setClosed(false)}>Restore error alert</Button>
    : <Alert type="error" title="There is a problem" closable onClose={() => setClosed(true)}>Check the details you entered and try again.</Alert>}
</div>`,
    example: () => <AlertExample />,
    api: [
      { name: 'type', type: "'success' | 'info' | 'warning' | 'error'", defaultValue: 'info', description: 'Semantic alert type.' },
      { name: 'title', type: 'ReactNode', description: 'Bold heading of the alert.' },
      { name: 'children', type: 'ReactNode', description: 'Main message content beneath the title.' },
      { name: 'description', type: 'ReactNode', description: 'Optional secondary text beneath the message.' },
      { name: 'closable', type: 'boolean', defaultValue: 'false', description: 'Show a close button.' },
      { name: 'onClose', type: '() => void', description: 'Called when the close button is pressed.' },
      { name: 'closeText', type: 'string', description: 'Custom close button text; defaults to a multiplication sign.' },
      { name: 'showIcon', type: 'boolean', defaultValue: 'true', description: 'Show the icon matching the alert type.' },
      { name: 'action', type: 'ReactNode', description: 'Action area aligned to the right of the alert, such as an undo button.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Alert root element.' },
    ],
  },
  {
    slug: 'steps',
    name: 'Steps',
    summary: 'Show users where they are in a short linear sequence of steps.',
    whenToUse: 'Use for a short, linear sequence such as setup or a submission flow. Keep longer or non-linear journeys on separate pages.',
    howItWorks: 'Steps before the current index are finished and later steps are waiting, unless an item overrides its status. Clicking a step calls onChange with its index, and the active step carries aria-current.',
    code: `const [current, setCurrent] = useState(1)
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
</div>`,
    example: () => <StepsExample />,
    api: [
      { name: 'items', type: 'StepItem[]', description: 'Steps with key, title, optional description, status, disabled and icon.' },
      { name: 'current', type: 'number', description: 'Controlled active step index, starting at 0.' },
      { name: 'defaultCurrent', type: 'number', defaultValue: '0', description: 'Initial active step index.' },
      { name: 'onChange', type: '(index: number) => void', description: 'Called with the index of the step the user selected.' },
      { name: 'direction', type: "'horizontal' | 'vertical'", defaultValue: 'horizontal', description: 'Layout of the step list.' },
      { name: 'size', type: "'s' | 'm'", defaultValue: 'm', description: 'Step indicator size.' },
      { name: 'progressDot', type: 'boolean', defaultValue: 'false', description: 'Render dot indicators instead of numbered circles; finished steps keep a check.' },
      { name: 'ref', type: 'Ref<HTMLOListElement>', description: 'Steps list element.' },
    ],
  },
  {
    slug: 'progress',
    name: 'Progress',
    summary: 'Show how far along a task, upload or loading operation is.',
    whenToUse: 'Use for measurable progress such as a file upload or a multi-step save. Use Loading for waits without a known percentage.',
    howItWorks: 'The bar exposes role progressbar with aria-valuenow set to the clamped percentage. A value of 100 or more automatically uses the success treatment.',
    code: `<div className="progress-example">
  <Progress percent={30} />
  <Progress percent={60} status="active" />
  <Progress percent={100} />
  <Progress percent={45} status="exception" />
  <Progress percent={75} color="#1d70b8" size="s" />
</div>`,
    example: () => <ProgressExample />,
    api: [
      { name: 'percent', type: 'number', description: 'Progress value between 0 and 100; values outside the range are clamped.' },
      { name: 'status', type: "'normal' | 'active' | 'success' | 'exception'", defaultValue: 'normal', description: 'Visual state of the bar; 100% or more always renders as success.' },
      { name: 'showInfo', type: 'boolean', defaultValue: 'true', description: 'Show the percentage next to the bar.' },
      { name: 'size', type: "'s' | 'm'", defaultValue: 'm', description: 'Bar size.' },
      { name: 'color', type: 'string', description: 'Custom colour of the filled portion.' },
      { name: 'type', type: "'line' | 'circle' | 'dashboard' | 'steps'", defaultValue: 'line', description: 'Visual treatment: line, circle, dashboard or steps.' },
      { name: 'width', type: 'number', description: 'Width and height of circle and dashboard types in pixels.' },
      { name: 'gapDegree', type: 'number', defaultValue: '8', description: 'Gap of the dashboard type as a percentage of the circumference.' },
      { name: 'stepsCount', type: 'number', description: 'Number of segments for the steps type.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Progress root element.' },
    ],
  },
  {
    slug: 'result',
    name: 'Result',
    summary: 'Present the outcome of a page-level operation such as a submitted application or a failed payment.',
    whenToUse: 'Use after a form submission, payment or async operation resolves to a clear outcome. Keep the message short and offer the most likely next action.',
    howItWorks: 'Each status renders a matching icon and colour unless you supply your own. Pass supporting text as children; the extra area holds primary and secondary actions. Error and warning results use the alert role so they are announced immediately.',
    code: `<div className="result-example">
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
</div>`,
    example: () => <ResultExample />,
    api: [
      { name: 'status', type: "'success' | 'error' | 'info' | 'warning' | '403' | '404' | '500'", defaultValue: 'info', description: 'Result status; one of success, error, info, warning, 403, 404 or 500.' },
      { name: 'title', type: 'ReactNode', description: 'Main result heading.' },
      { name: 'children', type: 'ReactNode', description: 'Supporting text beneath the title.' },
      { name: 'icon', type: 'ReactNode', description: 'Override the built-in status icon.' },
      { name: 'extra', type: 'ReactNode', description: 'Action area such as primary and secondary buttons.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Result root element.' },
    ],
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    summary: 'Display a user or entity as an image, initials or a fallback icon.',
    whenToUse: 'Use in headers, record rows or comment lists to identify a person or organisation. Prefer initials or text over images alone when the audience is unknown.',
    howItWorks: 'An image src takes precedence, then text children such as initials, then a generic person icon. The shape accepts circle or square, and size accepts a named token or a pixel value.',
    code: `<div className="avatar-example">
  <Avatar src="/team/ada.png" alt="Ada Lovelace" size="l" />
  <Avatar size="l" bgColor="#1d70b8">AK</Avatar>
  <Avatar shape="square" size="l" />
  <Avatar size="s" />
  <Text style={kss('mb0', 'ml8')}>Image, initials, square fallback and small sizes</Text>
</div>`,
    example: () => <AvatarExample />,
    api: [
      { name: 'src', type: 'string', description: 'Image source; initials or a fallback icon are shown otherwise.' },
      { name: 'alt', type: 'string', defaultValue: "''", description: 'Accessible name for the image variant.' },
      { name: 'icon', type: 'ReactNode', description: 'Fallback icon when there is no image or text.' },
      { name: 'children', type: 'ReactNode', description: 'Initials or short text shown when there is no image.' },
      { name: 'shape', type: "'circle' | 'square'", defaultValue: 'circle', description: 'Circle or square outline.' },
      { name: 'size', type: "number | 's' | 'm' | 'l' | 'xl'", defaultValue: "'m'", description: 'Named size or pixel size of the avatar.' },
      { name: 'bgColor', type: 'string', description: 'Background colour for text or icon avatars.' },
      { name: 'color', type: 'string', description: 'Text and icon colour for text or icon avatars.' },
      { name: 'ref', type: 'Ref<HTMLSpanElement>', description: 'Avatar root element.' },
    ],
  },
  {
    slug: 'code-box',
    name: 'CodeBox',
    summary: 'Render a bordered code block with syntax highlighting.',
    whenToUse: 'Use to show configuration or usage snippets inside documentation and tool pages. Pass pre-highlighted HTML at build time when the snippet is static.',
    howItWorks: 'Without highlightedHtml the component lazily loads Shiki and highlights on the client, rendering escaped plain text first. Token colours follow the GitHub Light palette on a white background.',
    code: `<CodeBox code={\`<Button onClick={save}>Save and continue</Button>\`} lang="tsx" />`,
    example: () => <CodeBox code={`<FancyTable
  columns={[{ key: 'name', title: 'Name', dataIndex: 'name' }]}
  dataSource={[{ name: 'Amira Khan' }, { name: 'Chen Li' }]}
  rowKey="name"
/>`} lang="tsx" />,
    api: [
      { name: 'code', type: 'string', description: 'Raw source to display and highlight.' },
      { name: 'lang', type: "'tsx' | 'typescript' | 'javascript' | 'json' | 'css' | 'html' | 'shellscript'", defaultValue: "'tsx'", description: 'Language used for client-side highlighting.' },
      { name: 'highlightedHtml', type: 'string', description: 'Pre-highlighted HTML; skips the runtime highlighter when provided.' },
      { name: 'className / style', type: 'string / CSSProperties', description: 'Root element overrides.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'CodeBox root element.' },
    ],
  },
  {
    slug: 'grid',
    name: 'Grid',
    summary: 'Lay out page content in columns with Row and Col, a thin wrapper over the GOV.UK grid.',
    whenToUse: 'Use to structure page content into columns with familiar GOV.UK widths and breakpoints. For form alignment the standard components already handle their own layout.',
    howItWorks: 'Row renders the govuk-grid-row class and Col renders govuk-grid-column-<width> for one of six fractions. Set fromDesktop to use the -from-desktop variant, which spans the full row below the desktop breakpoint. Both accept standard div attributes and className.',
    code: `<Row>
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
</Row>`,
    example: () => <GridExample />,
    api: [
      { name: 'Row children', type: 'ReactNode', description: 'Columns and other content inside the grid row.' },
      { name: 'Col width', type: "'full' | 'one-half' | 'one-third' | 'two-thirds' | 'one-quarter' | 'three-quarters'", defaultValue: "'full'", description: 'Column width mapped to the matching govuk-grid-column class.' },
      { name: 'Col fromDesktop', type: 'boolean', defaultValue: 'false', description: 'Apply the width only from the desktop breakpoint up; below it the column spans the full row.' },
      { name: 'Col children', type: 'ReactNode', description: 'Content inside the column.' },
      { name: 'className', type: 'string', description: 'Extra classes merged onto the row or column div.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Row or column div element.' },
    ],
  },
  {
    slug: 'card',
    name: 'Card',
    summary: 'Group related content in a container with an optional header, footer actions and hover highlight.',
    whenToUse: <>Use to group related information, summaries or actions on a page. Use the <DocsLink className="govuk-link" to="/en/components/panel/">Panel</DocsLink> component when showing the confirmed result of a transaction.</>,
    howItWorks: 'The title and extra render in a header row, children in the body, and actions in a footer separated by a top border. Set hoverable to highlight the border with the brand colour on hover. classNames and styles target the root, header, title, extra, body and actions parts.',
    code: `<div className="card-example">
  <Card title="Application overview" extra={<Tag color="green">Active</Tag>} hoverable>
    <Paragraph>Reference KZ-2026-0917 was submitted on 12 September 2026 and is being reviewed.</Paragraph>
  </Card>
  <Card title="Supporting evidence" actions={<Link href="#">Attach a file</Link>}>
    <Paragraph>Upload documents that support your application. Each file must be smaller than 10 MB.</Paragraph>
  </Card>
</div>`,
    example: () => <CardExample />,
    api: [
      { name: 'title', type: 'ReactNode', description: 'Heading shown in the card header.' },
      { name: 'extra', type: 'ReactNode', description: 'Right-aligned content in the header, next to the title.' },
      { name: 'children', type: 'ReactNode', description: 'Body content of the card.' },
      { name: 'actions', type: 'ReactNode', description: 'Footer content separated from the body by a top border.' },
      { name: 'hoverable', type: 'boolean', defaultValue: 'false', description: 'Highlight the border with the brand colour on hover.' },
      { name: 'styles / classNames', type: 'SemanticStyling', description: 'Overrides for the root, header, title, extra, body and actions parts.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Card root element.' },
    ],
  },
  {
    slug: 'calendar',
    name: 'Calendar',
    summary: 'Pick a single day from a month view with keyboard navigation, min and max limits.',
    whenToUse: <>Use when users must choose a day from a limited set, such as an appointment slot. When the user already knows the date, the <DocsLink className="govuk-link" to="/en/components/date-input/">DateInput</DocsLink> component is usually faster.</>,
    howItWorks: 'The selected day and the visible month can each be controlled or left internal, with previous and next buttons and an optional Today button. Arrow keys move by day or week, Home and End jump to the week ends, and PageUp and PageDown move by month or, with Shift, by year. min and max disable out-of-range days, dateCellRender adds a marker in the corner of a day cell, and locale controls weekday and month names.',
    code: `const [selected, setSelected] = useState(initialDate)
return <>
  <Calendar
    value={selected}
    onChange={setSelected}
    min={minDate}
    max={maxDate}
    dateCellRender={(date) => isWeekend(date) ? '·' : null}
  />
  <Paragraph aria-live="polite">{selected ? selected.toLocaleDateString('en-GB') : 'No date selected'}</Paragraph>
</>`,
    example: () => <CalendarExample />,
    api: [
      { name: 'value', type: 'Date | null', description: 'Selected day (controlled); pass null for no selection.' },
      { name: 'defaultValue', type: 'Date | null', defaultValue: 'null', description: 'Initially selected day when uncontrolled.' },
      { name: 'onChange', type: '(date: Date) => void', description: 'Called with the selected day.' },
      { name: 'min / max', type: 'Date', description: 'Earliest and latest selectable day; out-of-range days are disabled.' },
      { name: 'dateCellRender', type: '(date: Date) => ReactNode', description: 'Extra marker rendered in the bottom-right corner of a day cell.' },
      { name: 'month', type: 'Date', description: 'Displayed month (controlled).' },
      { name: 'defaultMonth', type: 'Date', description: 'Initially displayed month when uncontrolled; defaults to the selected day or today.' },
      { name: 'onMonthChange', type: '(month: Date) => void', description: 'Called when the visible month changes.' },
      { name: 'showToday', type: 'boolean', defaultValue: 'true', description: 'Show a Today button that jumps back to the current month and day.' },
      { name: 'locale', type: 'string', defaultValue: "'en-GB'", description: 'BCP 47 locale used for weekday and month names; the week starts on Monday.' },
      { name: 'styles / classNames', type: 'SemanticStyling', description: 'Overrides for the root, header, nav, title, grid, weekdays and cell parts.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Calendar root element.' },
    ],
  },
  {
    slug: 'transfer',
    name: 'Transfer',
    summary: 'Move items between a source and a target list with checkboxes and optional search.',
    whenToUse: 'Use when users pick a subset of items from a larger set, such as assigning permissions or choosing table columns. Use checkboxes or a select for a single choice.',
    howItWorks: 'Items are split by targetKeys between two panels; checked items move with the Add and Remove buttons. Disabled items cannot be checked or moved. showSearch filters both lists through filterOption, which defaults to a case-insensitive label match. targetKeys and selectedKeys support controlled usage. A one-way mode is not supported yet.',
    code: `const [targetKeys, setTargetKeys] = useState(['passport'])
const [selectedKeys, setSelectedKeys] = useState([])
return <Transfer
  dataSource={transferData}
  titles={['Available documents', 'Documents to upload']}
  targetKeys={targetKeys}
  selectedKeys={selectedKeys}
  onChange={(next) => setTargetKeys(next)}
  onSelectChange={(next) => setSelectedKeys(next)}
  showSearch
/>`,
    example: () => <TransferExample />,
    api: [
      { name: 'dataSource', type: 'TransferItem[]', description: 'Items with key, optional label, description and disabled.' },
      { name: 'targetKeys', type: 'Key[]', description: 'Keys of items shown in the right-hand target panel (controlled).' },
      { name: 'defaultTargetKeys', type: 'Key[]', defaultValue: '[]', description: 'Initial target keys when uncontrolled.' },
      { name: 'onChange', type: '(targetKeys: Key[], direction: TransferDirection, movedKeys: Key[]) => void', description: 'Called after items move between panels.' },
      { name: 'selectedKeys', type: 'Key[]', description: 'Keys of checked items across both panels (controlled).' },
      { name: 'defaultSelectedKeys', type: 'Key[]', defaultValue: '[]', description: 'Initial checked keys when uncontrolled.' },
      { name: 'onSelectChange', type: '(selectedKeys: Key[], direction: TransferDirection) => void', description: 'Called when the checked items change.' },
      { name: 'titles', type: '[ReactNode, ReactNode]', defaultValue: "['Source', 'Target']", description: 'Panel titles for the source and target lists.' },
      { name: 'showSearch', type: 'boolean', defaultValue: 'false', description: 'Show a search input above each list.' },
      { name: 'filterOption', type: '(input: string, item: TransferItem) => boolean', description: 'Custom filter used by both search inputs; defaults to a case-insensitive label match.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disable the whole component.' },
      { name: 'operations', type: '[ReactNode, ReactNode]', defaultValue: "['Add', 'Remove']", description: 'Labels of the two move buttons. A direction triangle always renders beside the label.' },
      { name: 'styles / classNames', type: 'SemanticStyling', description: 'Overrides for the root, panel, header, body, list, item, search, operations and operation parts.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Transfer root element.' },
    ],
  },
  {
    slug: 'slider',
    name: 'Slider',
    summary: 'Pick a single value or a [lower, upper] range from a track, with optional tick marks and a value tooltip.',
    whenToUse: <>Use for coarse adjustments where the exact number does not matter, such as a volume or an approximate budget. GOV.UK advises sliders only for approximate values; when the user must enter a precise value, use the <DocsLink className="govuk-link" to="/en/components/text-input/">Text input</DocsLink> or <DocsLink className="govuk-link" to="/en/components/select/">Select</DocsLink> component instead.</>,
    howItWorks: 'The track contains one or two native range inputs. The value and range can each be controlled or left internal; in range mode the lower handle cannot pass the upper one. Marks render ticks with optional labels under the track, and the tooltip shows the current value on hover, always or never. Set reverse to anchor the fill at the right edge, so it drains as the value grows. Arrow keys move by step and screen readers announce each handle, with minimum and maximum labels in range mode.',
    code: `const [volume, setVolume] = useState(40)
const [budget, setBudget] = useState<[number, number]>([20, 80])
const [remaining, setRemaining] = useState(60)
return <div className="slider-example">
  <Slider
    ariaLabel="Case volume"
    min={0}
    max={100}
    step={5}
    marks={[
      { value: 0, label: '0' },
      { value: 50, label: '50' },
      { value: 100, label: '100' },
    ]}
    value={volume}
    onChange={(value) => setVolume(value as number)}
  />
  <Slider
    ariaLabel="Time remaining"
    reverse
    min={0}
    max={100}
    marks={[
      { value: 0, label: '0' },
      { value: 50, label: '50' },
      { value: 100, label: '100' },
    ]}
    value={remaining}
    onChange={(value) => setRemaining(value as number)}
  />
  <Slider
    ariaLabel="Budget"
    range
    min={0}
    max={100}
    marks={[
      { value: 0, label: '£0' },
      { value: 50, label: '£50' },
      { value: 100, label: '£100' },
    ]}
    value={budget}
    onChange={(value) => setBudget(value as [number, number])}
  />
  <Paragraph className="govuk-!-margin-top-4" aria-live="polite">
    Case volume {volume}. Time remaining {remaining}. Budget between £{budget[0]} and £{budget[1]}.
  </Paragraph>
</div>`,
    example: () => <SliderExample />,
    api: [
      { name: 'min / max', type: 'number', defaultValue: '0 / 100', description: 'Minimum and maximum selectable values.' },
      { name: 'step', type: 'number', defaultValue: '1', description: 'Increment between selectable values.' },
      { name: 'range', type: 'boolean', defaultValue: 'false', description: 'Render two handles for selecting a [lower, upper] range.' },
      { name: 'reverse', type: 'boolean', defaultValue: 'false', description: 'Anchor the fill at the right edge so it drains as the value grows (depletion style).' },
      { name: 'value', type: 'number | [number, number]', description: 'Selected value, or [lower, upper] in range mode (controlled).' },
      { name: 'defaultValue', type: 'number | [number, number]', description: 'Initial value when uncontrolled; defaults to min, or [min, max] in range mode.' },
      { name: 'onChange', type: '(value: number | [number, number]) => void', description: 'Called with the new value when a handle moves.' },
      { name: 'marks', type: 'SliderMark[]', description: 'Tick marks rendered under the track, with optional labels.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Prevent interaction.' },
      { name: 'tooltip', type: "'hover' | 'always' | 'never'", defaultValue: "'hover'", description: 'When to show the current value bubble.' },
      { name: 'ariaLabel', type: 'string', description: 'Accessible name; in range mode each handle gets `${ariaLabel} minimum` / `maximum`.' },
      { name: 'name', type: 'string', description: 'Form field name; in range mode the handles submit as `${name}-lower` / `${name}-upper`.' },
      { name: 'styles / classNames', type: 'SemanticStyling', description: 'Overrides for the root, track, rail, fill, thumb, mark and tooltip parts.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Slider root element.' },
    ],
  },
  {
    slug: 'timepicker',
    name: 'TimePicker',
    summary: 'Enter or pick a time of day in 24-hour HH:mm format, with an optional two-column hour and minute panel.',
    whenToUse: <>Use for recent or frequent times where typing HH:mm or picking from a short panel is faster than three separate selects, such as an appointment start. When users must enter a memorable or approximate time, or you need a 12-hour AM/PM format, the standard <DocsLink className="govuk-link" to="/en/components/select/">Select</DocsLink> component with separate hour and minute selects (the GOV.UK approach for memorable dates) may be easier to explain; Text input alone is better when no panel is wanted.</>,
    howItWorks: 'The input accepts loose H:mm text and normalises it to HH:mm when uncontrolled. Focusing the input or pressing the clock toggle opens a 24-hour listbox with an hour and a minute column, trimmed by hourStep and minuteStep and centred on the current value; ArrowUp and ArrowDown move between options, Escape closes the panel and returns focus to the input, and choosing an option commits the value. The label, hint and error are wired through aria-describedby, and status adds an extra described line.',
    code: `const [time, setTime] = useState('09:30')
return <>
  <TimePicker
    label="Appointment time"
    hint="For example, 09:30"
    value={time}
    onChange={setTime}
    minuteStep={15}
    allowClear
  />
  <Paragraph className="govuk-!-margin-top-4" aria-live="polite">
    {time ? \`Selected time: \${time}\` : 'No time selected.'}
  </Paragraph>
</>`,
    example: () => <TimePickerExample />,
    api: [
      { name: 'value', type: 'string', description: 'Controlled value in HH:mm (24-hour) format.' },
      { name: 'defaultValue', type: 'string', description: 'Initial value when uncontrolled.' },
      { name: 'onChange', type: '(value: string) => void', description: 'Called with the raw text while typing and the committed HH:mm value when a time is picked or cleared.' },
      { name: 'minuteStep / hourStep', type: 'number', defaultValue: '1 / 1', description: 'Step between minute and hour options in the panel.' },
      { name: 'allowClear', type: 'boolean', defaultValue: 'false', description: 'Show a clear button that empties the value.' },
      { name: 'placeholder', type: 'string', defaultValue: "'HH:mm'", description: 'Placeholder text shown in the empty input.' },
      { name: 'label', type: 'ReactNode', description: 'Visible and accessible input label.' },
      { name: 'hint', type: 'ReactNode', description: 'Optional supporting guidance.' },
      { name: 'error', type: 'ReactNode', description: 'Validation error.' },
      { name: 'status', type: 'ReactNode', description: 'Extra status line rendered after the error and included in aria-describedby.' },
      { name: 'width', type: '2 | 3 | 4 | 5 | 10 | 20 | 30', description: 'Expected-answer width.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Prevent interaction.' },
      { name: 'visuallyHiddenLabel', type: 'boolean', defaultValue: 'false', description: 'Keep the accessible label while hiding it visually.' },
      { name: 'inputProps', type: 'InputHTMLAttributes', description: 'Extra props spread onto the native input.' },
      { name: 'styles / classNames', type: 'SemanticStyling', description: 'Overrides for the root, label, hint, error, status, control, input, list, option, clear and toggle parts.' },
      { name: 'ref', type: 'Ref<HTMLInputElement>', description: 'Native input element.' },
    ],
  },
]

export const extraComponentBySlug = new Map(extraComponentDocs.map((component) => [component.slug, component]))
