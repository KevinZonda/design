import { useEffect, type ReactNode } from 'react'
import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { Breadcrumbs, Button, Pagination, Table, Tag } from '@kvzd-design/gov-uk'
import { FancyTabs, Sidebar, TagBox } from '@kvzd-design/gov-uk-extends'
import { componentBySlug, componentDocs, type ComponentDoc } from './componentRegistry'
import { DocsFooter, DocsHeader } from './DocsChrome'
import { QuickReviewPage } from './QuickReviewPage'
import { sitePath } from './sitePath'
import './DocsLayout.css'
import './ComponentDocs.css'

function pathFor(slug: string) {
  return sitePath(`/components/${slug}/`)
}

type DocsSection = 'components' | 'extra-components'

const extraComponentNavigation = [
  { key: 'fancy-tabs', label: 'FancyTabs', href: '/extra-components/#fancy-tabs' },
  { key: 'sidebar', label: 'Sidebar', href: '/extra-components/#sidebar' },
  { key: 'tag-box', label: 'TagBox', href: '/extra-components/#tag-box' },
]

function SideNavigation({ currentSlug, section }: { currentSlug?: string; section: DocsSection }) {
  const items = section === 'extra-components'
    ? extraComponentNavigation
    : componentDocs.map((component) => ({ key: component.slug, label: component.name, href: `/components/${component.slug}/` }))

  return <Sidebar
    className="docs-sidebar"
    heading={section === 'extra-components' ? 'Extra Components' : 'Components'}
    items={items}
    currentKey={currentSlug}
    renderLink={(item, { className, current }) => item.href !== undefined
      ? <Link className={className} to={item.href} onClick={item.onClick} aria-current={current ? 'page' : undefined}>{item.label}</Link>
      : <button className={className} type="button" onClick={item.onClick} aria-current={current ? 'page' : undefined}>{item.label}</button>}
  />
}

function OverviewPage() {
  useEffect(() => { document.title = 'Components – KVZD GOV.UK React' }, [])
  return <DocsLayout>
    <div className="component-overview">
      <span className="govuk-caption-xl">GOV.UK React</span>
      <h1 className="govuk-heading-xl">Components</h1>
      <p className="govuk-body-l">Reusable React components for building consistent, accessible public services.</p>
      <p className="govuk-body">Each page includes a working example, a compact React API and implementation guidance aligned with GOV.UK Frontend 6.5.0.</p>
      <div className="overview-actions"><Button href={sitePath('/quick-review/')}>Open Quick Review</Button><span>Explore multiple components together in one interactive page.</span></div>
      <ul className="official-component-list">{componentDocs.map((component) => <li key={component.slug}><Link className="govuk-link" to={`/components/${component.slug}/`}>{component.name}</Link>{component.status === 'trial' && <Tag color="blue">Trial</Tag>}<p>{component.summary}</p></li>)}</ul>
    </div>
  </DocsLayout>
}

function ExampleBlock({ component }: { component: ComponentDoc }) {
  return <section className="component-example" aria-labelledby="example-title">
    <div className="example-heading"><h2 className="govuk-heading-l" id="example-title">Example</h2><a className="govuk-link" href={`https://design-system.service.gov.uk/components/${component.slug}/`} target="_blank" rel="noreferrer">View GOV.UK guidance</a></div>
    <FancyTabs items={[
      { key: 'example', label: 'Preview', children: <div className={`example-canvas ${component.wide ? 'example-canvas--wide' : ''}`}>{component.example()}</div> },
      { key: 'react', label: 'React', children: <pre className="code-block"><code>{component.code}</code></pre> },
    ]} />
  </section>
}

const fancyTabsCode = `<FancyTabs items={[
  {
    key: 'summary',
    label: 'Summary',
    children: <p className="govuk-body govuk-!-margin-top-4">Review the application before continuing.</p>,
  },
  {
    key: 'details',
    label: 'Details',
    children: <p className="govuk-body govuk-!-margin-top-4">The application contains 3 sections.</p>,
  },
]} />`

const sidebarCode = `<Sidebar
  heading="Pages in this section"
  currentKey="history"
  items={[
    { key: 'accordion', label: 'Accordion', href: '#sidebar', children: [
      { key: 'history', label: 'History', href: '#sidebar-api' },
    ] },
    { key: 'fancy-tabs', label: 'FancyTabs', href: '#fancy-tabs' },
  ]}
/>

<Sidebar
  heading="Documentation"
  collapsible
  currentKey="sidebar-api"
  items={[
    { key: 'examples', label: 'Examples', children: [
      { key: 'sidebar', label: 'Sidebar', href: '#sidebar', children: [
        { key: 'sidebar-api', label: 'React API', href: '#sidebar-api' },
      ] },
    ] },
  ]}
/>`

const tagBoxCode = `<TagBox>6.5.0</TagBox>`

function ExtraComponentsPage() {
  const { hash } = useLocation()
  useEffect(() => { document.title = 'Extra Components – KVZD GOV.UK React' }, [])
  return <DocsLayout currentSection="extra-components" currentSlug={hash === '#tag-box' ? 'tag-box' : hash === '#sidebar' ? 'sidebar' : 'fancy-tabs'}>
    <article className="component-doc extra-components-page">
      <Breadcrumbs className="doc-breadcrumbs" items={[{ label: 'KVZD Design', href: sitePath('/components/') }, { label: 'Extra Components', current: true }]} />
      <span className="govuk-caption-xl">KVZD Design</span>
      <h1 className="govuk-heading-xl">Extra Components</h1>
      <p className="govuk-body-l component-summary">Optional components for documentation, developer tools and other interfaces that sit outside the official GOV.UK component set.</p>
      <section id="fancy-tabs" aria-labelledby="fancy-tabs-title">
        <h2 className="govuk-heading-l" id="fancy-tabs-title">FancyTabs</h2>
        <p className="govuk-body">A stronger tab treatment for switching between views such as a live preview and its React source. It has the same interface as the standard <Link className="govuk-link" to="/components/tabs/">Tabs</Link> component.</p>
        <div className="extra-component-example">
          <FancyTabs items={[
            { key: 'preview', label: 'Preview', children: <div className="extra-component-example__panel"><FancyTabs items={[
              { key: 'summary', label: 'Summary', children: <p className="govuk-body govuk-!-margin-top-4">Review the application before continuing.</p> },
              { key: 'details', label: 'Details', children: <p className="govuk-body govuk-!-margin-top-4">The application contains 3 sections.</p> },
            ]} /></div> },
            { key: 'react', label: 'React', children: <pre className="code-block"><code>{fancyTabsCode}</code></pre> },
          ]} />
        </div>
        <h3 className="govuk-heading-m extra-component-api-title" id="fancy-tabs-api">React API</h3>
        <p className="govuk-body">Import it from <code className="inline-code">@kvzd-design/gov-uk-extends</code>. The props are shared with <code className="inline-code">TabsProps</code> from the base package.</p>
        <div className="api-table-scroll"><Table rowKey="name" columns={[
          { title: 'Property', dataIndex: 'name', rowHeader: true, render: (value) => <code>{String(value)}</code> },
          { title: 'Type', dataIndex: 'type', render: (value) => <code>{String(value)}</code> },
          { title: 'Description', dataIndex: 'description' },
        ]} dataSource={[
          { name: 'items', type: 'TabItem[]', description: 'Tab keys, labels and panel content.' },
          { name: 'activeKey', type: 'string', description: 'Controlled active tab.' },
          { name: 'defaultActiveKey', type: 'string', description: 'Initial active tab.' },
          { name: 'onChange', type: '(key: string) => void', description: 'Called with the selected tab key.' },
        ]} /></div>
      </section>
      <section id="sidebar" aria-labelledby="sidebar-title">
        <h2 className="govuk-heading-l" id="sidebar-title">Sidebar</h2>
        <p className="govuk-body">Nested navigation follows the GOV.UK Design System sidebar style. Set <code className="inline-code">collapsible</code> when users need to expand and collapse groups.</p>
        <div className="extra-component-example">
          <FancyTabs items={[
            { key: 'preview', label: 'Preview', children: <div className="extra-component-example__panel">
              <p className="govuk-body"><strong>Nested navigation</strong></p>
              <div className="sidebar-example">
                <Sidebar heading="Pages in this section" currentKey="history" items={[
                  { key: 'accordion', label: 'Accordion', href: '#sidebar', children: [
                    { key: 'history', label: 'History', href: '#sidebar-api' },
                  ] },
                  { key: 'fancy-tabs', label: 'FancyTabs', href: '#fancy-tabs' },
                ]} />
              </div>
              <p className="govuk-body"><strong>Collapsible navigation</strong></p>
              <div className="sidebar-example">
                <Sidebar heading="Documentation" collapsible currentKey="sidebar-api" items={[
                  { key: 'examples', label: 'Examples', children: [
                    { key: 'fancy-tabs', label: 'FancyTabs', href: '#fancy-tabs' },
                    { key: 'sidebar', label: 'Sidebar', href: '#sidebar', children: [
                      { key: 'sidebar-api', label: 'React API', href: '#sidebar-api' },
                    ] },
                  ] },
                  { key: 'reference', label: 'Reference', children: [
                    { key: 'fancy-tabs-api', label: 'FancyTabs API', href: '#fancy-tabs-api' },
                  ] },
                ]} />
              </div>
            </div> },
            { key: 'react', label: 'React', children: <pre className="code-block"><code>{sidebarCode}</code></pre> },
          ]} />
        </div>
        <h3 className="govuk-heading-m extra-component-api-title" id="sidebar-api">React API</h3>
        <p className="govuk-body">Import it from <code className="inline-code">@kvzd-design/gov-uk-extends</code>. Links render as anchors by default; use <code className="inline-code">renderLink</code> to integrate a client-side router.</p>
        <div className="api-table-scroll"><Table rowKey="name" columns={[
          { title: 'Property', dataIndex: 'name', rowHeader: true, render: (value) => <code>{String(value)}</code> },
          { title: 'Type', dataIndex: 'type', render: (value) => <code>{String(value)}</code> },
          { title: 'Description', dataIndex: 'description' },
        ]} dataSource={[
          { name: 'heading', type: 'ReactNode', description: 'Visible heading and navigation label.' },
          { name: 'items', type: 'SidebarItem[]', description: 'Links can have nested children; items without href are group headings.' },
          { name: 'currentKey', type: 'string', description: 'Key of the current link and branch.' },
          { name: 'collapsible', type: 'boolean', description: 'Add expand and collapse controls to items with children. Default: false.' },
          { name: 'renderLink', type: '(item, options) => ReactNode', description: 'Optional link renderer for a client-side router.' },
        ]} /></div>
      </section>
      <section id="tag-box" aria-labelledby="tag-box-title">
        <h2 className="govuk-heading-l" id="tag-box-title">TagBox</h2>
        <p className="govuk-body">A neutral outlined label for short metadata such as a version number. Use the standard <Link className="govuk-link" to="/components/tag/">Tag</Link> component when a label communicates a status.</p>
        <div className="extra-component-example">
          <FancyTabs items={[
            { key: 'preview', label: 'Preview', children: <div className="extra-component-example__panel tag-box-example"><TagBox>6.5.0</TagBox><TagBox>Release candidate</TagBox></div> },
            { key: 'react', label: 'React', children: <pre className="code-block"><code>{tagBoxCode}</code></pre> },
          ]} />
        </div>
        <h3 className="govuk-heading-m extra-component-api-title">React API</h3>
        <p className="govuk-body">Import it from <code className="inline-code">@kvzd-design/gov-uk-extends</code>. It renders a <code className="inline-code">span</code> and accepts standard span attributes.</p>
        <div className="api-table-scroll"><Table rowKey="name" columns={[
          { title: 'Property', dataIndex: 'name', rowHeader: true, render: (value) => <code>{String(value)}</code> },
          { title: 'Type', dataIndex: 'type', render: (value) => <code>{String(value)}</code> },
          { title: 'Description', dataIndex: 'description' },
        ]} dataSource={[
          { name: 'children', type: 'ReactNode', description: 'Short text or other inline content displayed inside the box.' },
          { name: 'className', type: 'string', description: 'Additional CSS class for positioning or local styling.' },
        ]} /></div>
      </section>
    </article>
  </DocsLayout>
}

function ApiTable({ component }: { component: ComponentDoc }) {
  return <section className="component-api" aria-labelledby="api-title">
    <h2 className="govuk-heading-l" id="api-title">React API</h2>
    <p className="govuk-body">The public interface is intentionally smaller than the original Nunjucks macro options.</p>
    <div className="api-table-scroll"><Table rowKey="name" columns={[
      { title: 'Property', dataIndex: 'name', rowHeader: true, render: (value) => <code>{String(value)}</code> },
      { title: 'Type', dataIndex: 'type', render: (value) => <code>{String(value)}</code> },
      { title: 'Default', dataIndex: 'defaultValue', render: (value) => value ? <code>{String(value)}</code> : '—' },
      { title: 'Description', dataIndex: 'description' },
    ]} dataSource={component.api} /></div>
  </section>
}

function ComponentPage({ component }: { component: ComponentDoc }) {
  const index = componentDocs.findIndex((item) => item.slug === component.slug)
  const previous = componentDocs[index - 1]
  const next = componentDocs[index + 1]
  useEffect(() => { document.title = `${component.name} – KVZD GOV.UK React` }, [component])
  return <DocsLayout currentSlug={component.slug}>
    <article className="component-doc">
      <Breadcrumbs className="doc-breadcrumbs" items={[{ label: 'Components', href: sitePath('/components/') }, { label: component.name, current: true }]} />
      <div className="component-title-row"><h1 className="govuk-heading-xl">{component.name}</h1>{component.status === 'trial' && <Tag color="blue">Trial</Tag>}</div>
      <p className="govuk-body-l component-summary">{component.summary}</p>
      <ExampleBlock component={component} />
      <ApiTable component={component} />
      <section className="guidance-section"><h2 className="govuk-heading-l">When to use this component</h2><p className="govuk-body">{component.whenToUse}</p></section>
      <section className="guidance-section"><h2 className="govuk-heading-l">How it works</h2><p className="govuk-body">{component.howItWorks}</p><div className="implementation-note"><strong>React implementation</strong><p>State changes stay inside React. The rendered markup uses GOV.UK classes and semantic HTML, without initialising DOM-mutating GOV.UK JavaScript.</p></div></section>
      <Pagination className="component-pagination" label="Component pages" previous={previous ? { href: pathFor(previous.slug), text: 'Previous component', label: previous.name } : undefined} next={next ? { href: pathFor(next.slug), text: 'Next component', label: next.name } : undefined} />
    </article>
  </DocsLayout>
}

function DocsLayout({ children, currentSlug, currentSection = 'components' }: { children: ReactNode; currentSlug?: string; currentSection?: DocsSection }) {
  return <div className="app-shell govuk-frontend-supported"><DocsHeader current={currentSection} /><div className="site-width page-layout" id="top"><SideNavigation currentSlug={currentSlug} section={currentSection} /><main className="main-content" id="main-content">{children}</main></div><DocsFooter /></div>
}

function NotFoundPage() {
  useEffect(() => { document.title = 'Page not found – KVZD GOV.UK React' }, [])
  return <DocsLayout><h1 className="govuk-heading-xl">Page not found</h1><p className="govuk-body">The component page you requested does not exist.</p><Link className="govuk-link" to="/components/">Return to components</Link></DocsLayout>
}

function ComponentRoute() {
  const { slug } = useParams()
  const component = slug ? componentBySlug.get(slug) : undefined
  return component ? <ComponentPage component={component} /> : <NotFoundPage />
}

function RouteScroll() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView())
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])
  return null
}

export default function App() {
  return <>
    <RouteScroll />
    <Routes>
      <Route path="/" element={<OverviewPage />} />
      <Route path="/components" element={<OverviewPage />} />
      <Route path="/components/:slug" element={<ComponentRoute />} />
      <Route path="/extra-components" element={<ExtraComponentsPage />} />
      <Route path="/quick-review" element={<QuickReviewPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </>
}
