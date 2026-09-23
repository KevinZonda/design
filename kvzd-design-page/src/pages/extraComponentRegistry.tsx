import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Empty, FancyTabs, Loading, Note, ShowcaseBox, Sidebar, TagBox } from '@kevinzonda/design/extraComponents'
import type { ApiProp } from './componentRegistry'
import { DropdownExample, FancyTableExample, FormExample, MenuExample, ModalExample } from './extraExamples'

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
    children: <p>Review the application before continuing.</p>,
  },
  {
    key: 'details',
    label: 'Details',
    children: <p>The application contains 3 sections.</p>,
  },
]} />`

const sidebarCode = `<Sidebar
  heading="Pages in this section"
  currentKey="history"
  items={[
    { key: 'accordion', label: 'Accordion', href: '/accordion/', children: [
      { key: 'history', label: 'History', href: '/accordion/history/' },
    ] },
    { key: 'fancy-tabs', label: 'FancyTabs', href: '/fancy-tabs/' },
  ]}
/>

<Sidebar
  heading="Documentation"
  collapsible
  currentKey="sidebar-api"
  items={[
    { key: 'examples', label: 'Examples', children: [
      { key: 'sidebar', label: 'Sidebar', href: '/sidebar/', children: [
        { key: 'sidebar-api', label: 'React API', href: '/sidebar/#api-title' },
      ] },
    ] },
  ]}
/>`

export const extraComponentDocs: ExtraComponentDoc[] = [
  {
    slug: 'modal',
    name: 'Modal',
    summary: 'A focused dialog for a short decision or task that must be completed before returning to the page.',
    whenToUse: 'Use for a brief confirmation or focused task. Keep longer journeys on normal pages.',
    howItWorks: 'A native dialog enters the top layer and keeps keyboard focus inside it. Escape, the close button and optional backdrop clicks request closure through onClose.',
    code: `<Modal open={open} title="Confirm your action" onClose={() => setOpen(false)}
  footer={<button type="button" onClick={confirm}>Confirm</button>}>
  <p>Check the details before continuing.</p>
</Modal>`,
    example: () => <ModalExample />,
    api: [
      { name: 'open', type: 'boolean', description: 'Controls whether the dialog is shown.' },
      { name: 'title', type: 'ReactNode', description: 'Visible heading and accessible dialog name.' },
      { name: 'children', type: 'ReactNode', description: 'Dialog content.' },
      { name: 'footer', type: 'ReactNode', description: 'Optional action area.' },
      { name: 'onClose', type: '() => void', description: 'Called when the user requests closure; update open in the parent.' },
      { name: 'closeOnBackdrop', type: 'boolean', defaultValue: 'true', description: 'Allow backdrop clicks to request closure.' },
      { name: 'closeLabel', type: 'string', defaultValue: 'Close', description: 'Accessible name of the close button.' },
      { name: 'ref', type: 'Ref<HTMLDialogElement>', description: 'Native dialog element.' },
    ],
  },
  {
    slug: 'empty',
    name: 'Empty',
    summary: 'A clear state for a list, table or search with no records to display.',
    whenToUse: 'Show when a view has no data or a filter returns no results. Explain the reason or offer a next step when useful.',
    howItWorks: 'A visible heading, optional description and action sit inside a neutral surface. The illustration is decorative and can be replaced.',
    code: `<Empty title="No applications found" description="Try changing your filters.">
  <button type="button">Clear filters</button>
</Empty>`,
    example: () => <Empty title="No applications found" description="Try changing your filters." />,
    api: [
      { name: 'title', type: 'ReactNode', defaultValue: 'No results found', description: 'Short explanation of the empty state.' },
      { name: 'description', type: 'ReactNode', description: 'Optional guidance beneath the title.' },
      { name: 'illustration', type: 'ReactNode', description: 'Optional decorative graphic.' },
      { name: 'children', type: 'ReactNode', description: 'Optional action area.' },
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
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Loading root element.' },
    ],
  },
  {
    slug: 'divider',
    name: 'Divider',
    summary: 'Separate sections of content with the GOV.UK section break style.',
    whenToUse: 'Use between distinct content sections when spacing alone is not enough. Avoid adding a line between every field or paragraph.',
    howItWorks: 'Renders a semantic hr with GOV.UK section break spacing. Set visible to false for a spacing-only break.',
    code: `<p className="govuk-body">First section</p>\n<Divider size="m" />\n<p className="govuk-body">Second section</p>`,
    example: () => <div><p className="govuk-body">First section</p><Divider size="m" /><p className="govuk-body">Second section</p></div>,
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
    code: `<Menu ariaLabel="Record actions" items={[
  { key: 'view', label: 'View record', onClick: viewRecord },
  { key: 'edit', label: 'Edit record', onClick: editRecord },
]} />`,
    example: () => <MenuExample />,
    api: [
      { name: 'items', type: 'MenuItem[]', description: 'Actions with key, label, optional href, onClick and disabled.' },
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
    code: `<Dropdown label="Actions" menuLabel="Application actions"
  items={[{ key: 'view', label: 'View application', onClick: viewApplication }]}
/>`,
    example: () => <DropdownExample />,
    api: [
      { name: 'label', type: 'ReactNode', description: 'Trigger button content.' },
      { name: 'menuLabel', type: 'string', description: 'Accessible name for the action menu.' },
      { name: 'items', type: 'MenuItem[]', description: 'Actions shown in the menu.' },
      { name: 'open / defaultOpen', type: 'boolean', description: 'Controlled or initial open state.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the menu requests a state change.' },
      { name: 'onAction', type: '(key: string) => void', description: 'Called after an item is activated.' },
      { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Dropdown root element.' },
    ],
  },
  {
    slug: 'fancy-table',
    name: 'FancyTable',
    summary: 'A data table with optional sorting, filtering, row selection and client-side pagination.',
    whenToUse: 'Use for records that need comparison and direct interaction. Keep the standard Table for simple read-only data.',
    howItWorks: 'Column comparators and filter functions process the supplied data locally. Selection can be controlled or internal; Select all applies to the current page.',
    code: `<FancyTable rowKey="id" dataSource={rows} selectable pageSize={10}
  columns={[
    { key: 'name', title: 'Name', dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name) },
    { key: 'status', title: 'Status', dataIndex: 'status',
      filters: [{ label: 'Submitted', value: 'Submitted' }],
      onFilter: (value, row) => row.status === value },
  ]}
/>`,
    example: () => <FancyTableExample />,
    wide: true,
    api: [
      { name: 'columns', type: 'FancyTableColumn<T>[]', description: 'Column definitions; add sorter for sortable headers.' },
      { name: 'dataSource', type: 'T[]', description: 'Records displayed by the table.' },
      { name: 'rowKey', type: 'keyof T | (record: T) => Key', description: 'Stable unique key for each row.' },
      { name: 'selectable', type: 'boolean', defaultValue: 'false', description: 'Show row and current-page selection controls.' },
      { name: 'selectedRowKeys / defaultSelectedRowKeys', type: 'Key[]', description: 'Controlled or initial selected row keys.' },
      { name: 'onSelectionChange', type: '(keys: Key[]) => void', description: 'Called when the selection changes.' },
      { name: 'sort / defaultSort', type: 'FancyTableSort | null', description: 'Controlled or initial column and direction.' },
      { name: 'onSortChange', type: '(sort: FancyTableSort | null) => void', description: 'Called when the sort changes.' },
      { name: 'filterValues / defaultFilterValues', type: 'Record<string, string>', description: 'Controlled or initial filter values by column key.' },
      { name: 'onFilterChange', type: '(values: Record<string, string>) => void', description: 'Called when a column filter changes.' },
      { name: 'pageSize / currentPage', type: 'number', description: 'Local page size and optional controlled page.' },
      { name: 'onPageChange', type: '(page: number) => void', description: 'Called when the page changes.' },
      { name: 'emptyContent', type: 'ReactNode', description: 'Content displayed when there are no records.' },
      { name: 'ref', type: 'Ref<HTMLTableElement>', description: 'Table element.' },
    ],
  },
  {
    slug: 'fancy-tabs',
    name: 'FancyTabs',
    summary: 'A stronger tab treatment for switching between views such as a live preview and its React source.',
    whenToUse: <>Use when an interface needs a more prominent tab treatment than the standard <Link className="govuk-link" to="/en/components/tabs/">Tabs</Link> component.</>,
    howItWorks: 'It shares the standard Tabs props and manages the selected panel in React. Arrow keys move between tabs.',
    code: fancyTabsCode,
    example: () => <FancyTabs items={[
      { key: 'summary', label: 'Summary', children: <p className="govuk-body govuk-!-margin-top-4">Review the application before continuing.</p> },
      { key: 'details', label: 'Details', children: <p className="govuk-body govuk-!-margin-top-4">The application contains 3 sections.</p> },
    ]} />,
    api: [
      { name: 'items', type: 'TabItem[]', description: 'Tab keys, labels and panel content.' },
      { name: 'activeKey', type: 'string', description: 'Controlled active tab.' },
      { name: 'defaultActiveKey', type: 'string', description: 'Initial active tab.' },
      { name: 'onChange', type: '(key: string) => void', description: 'Called with the selected tab key.' },
    ],
  },
  {
    slug: 'form',
    name: 'Form',
    summary: 'Collect and validate related answers with GOV.UK field errors and an error summary.',
    whenToUse: 'Use when a page has several answers that must be validated together on submission.',
    howItWorks: 'Form.Item connects a field to a native form. On submission, Form reads FormData, validates registered rules, preserves entered answers, displays inline errors and focuses the error summary.',
    code: `<Form onFinish={(values) => save(values)}>
  <Form.Item name="fullName" rules={[{ required: true, message: 'Enter your full name' }]}>
    <Input label="Full name" />
  </Form.Item>
  <Button htmlType="submit">Continue</Button>
</Form>`,
    example: () => <FormExample />,
    api: [
      { name: 'initialValues', type: 'Record<string, string | string[]>', description: 'Initial values for registered fields.' },
      { name: 'onFinish', type: '(values: FormValues) => void', description: 'Called when every field passes validation.' },
      { name: 'onFinishFailed', type: '(errors: FormError[], values: FormValues) => void', description: 'Called when submission finds errors.' },
      { name: 'validate', type: '(values: FormValues) => { name: string; message: string }[]', description: 'Optional form-level validation for related fields.' },
      { name: 'errorSummaryTitle', type: 'ReactNode', defaultValue: 'There is a problem', description: 'Heading displayed above validation links.' },
      { name: 'Form.Item name', type: 'string', description: 'Native field name used to read its submitted value.' },
      { name: 'Form.Item rules', type: 'FormRule[]', description: 'Required, pattern or custom validation rules checked on submit.' },
      { name: 'Form.Item multiple', type: 'boolean', defaultValue: 'false', description: 'Read all values for a checkbox group.' },
      { name: 'Form.Item focusId', type: 'string', description: 'ID targeted from the error summary for grouped fields.' },
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
  <p>State changes stay inside React.</p>
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
      <p className="govuk-body"><strong>Nested navigation</strong></p>
      <div className="sidebar-example">
        <Sidebar heading="Pages in this section" currentKey="history" items={[
          { key: 'accordion', label: 'Accordion', href: '#example-title', children: [
            { key: 'history', label: 'History', href: '#api-title' },
          ] },
          { key: 'fancy-tabs', label: 'FancyTabs', href: '#guidance-title' },
        ]} />
      </div>
      <p className="govuk-body"><strong>Collapsible navigation</strong></p>
      <div className="sidebar-example">
        <Sidebar heading="Documentation" collapsible currentKey="sidebar-api" items={[
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
      { name: 'currentKey', type: 'string', description: 'Key of the current link and branch.' },
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
    <a href="/components/back-link/">View documentation</a>
    <a href="#top">Back to top</a>
  </>}
>
  <BackLink href="#previous">Back</BackLink>
</ShowcaseBox>`,
    example: () => <ShowcaseBox
      title="Back link"
      description="Help users return to the previous step in a multi-page service."
      footer={<><a className="govuk-link" href="#example-title">View documentation</a><a className="govuk-link" href="#top">Back to top</a></>}
    ><a className="govuk-back-link" href="#example-title">Back</a></ShowcaseBox>,
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
    whenToUse: <>Use for metadata that does not communicate a status. Use the standard <Link className="govuk-link" to="/en/components/tag/">Tag</Link> when the label communicates a status.</>,
    howItWorks: 'It renders a span and accepts standard span attributes and an optional className.',
    code: '<TagBox>6.5.1</TagBox>',
    example: () => <div className="tag-box-example"><TagBox>6.5.1</TagBox><TagBox>Release candidate</TagBox></div>,
    api: [
      { name: 'children', type: 'ReactNode', description: 'Short text or other inline content displayed inside the box.' },
      { name: 'className', type: 'string', description: 'Additional CSS class for positioning or local styling.' },
    ],
  },
]

export const extraComponentBySlug = new Map(extraComponentDocs.map((component) => [component.slug, component]))
