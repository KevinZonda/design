import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { FancyTabs, Sidebar, TagBox } from '@kvzd-design/gov-uk-extends'
import type { ApiProp } from './componentRegistry'

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
    slug: 'fancy-tabs',
    name: 'FancyTabs',
    summary: 'A stronger tab treatment for switching between views such as a live preview and its React source.',
    whenToUse: <>Use when an interface needs a more prominent tab treatment than the standard <Link className="govuk-link" to="/components/tabs/">Tabs</Link> component.</>,
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
    slug: 'tag-box',
    name: 'TagBox',
    summary: 'A neutral outlined label for short metadata such as a version number.',
    whenToUse: <>Use for metadata that does not communicate a status. Use the standard <Link className="govuk-link" to="/components/tag/">Tag</Link> when the label communicates a status.</>,
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
