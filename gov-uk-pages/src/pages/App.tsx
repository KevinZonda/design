import { useEffect, type ReactNode } from 'react'
import { Breadcrumbs, Button, Pagination, Table, Tag } from '@kvzd-design/gov-uk'
import { FancyTabs } from '@kvzd-design/gov-uk-extends'
import { componentBySlug, componentDocs, type ComponentDoc } from './componentRegistry'
import { DocsFooter, DocsHeader } from './DocsChrome'
import { QuickReviewPage } from './QuickReviewPage'
import './DocsLayout.css'
import './ComponentDocs.css'

function pathFor(slug: string) {
  return `/components/${slug}/`
}

type DocsSection = 'components' | 'extra-components'

const extraComponentNavigation = [
  { slug: 'fancy-tabs', name: 'FancyTabs', href: '/extra-components/#fancy-tabs' },
]

function SideNavigation({ currentSlug, section }: { currentSlug?: string; section: DocsSection }) {
  const items = section === 'extra-components'
    ? extraComponentNavigation
    : componentDocs.map((component) => ({ ...component, href: pathFor(component.slug) }))

  return <nav className="app-subnav" aria-labelledby="app-subnav-heading">
    <h2 className="govuk-heading-s app-subnav__heading" id="app-subnav-heading">{section === 'extra-components' ? 'Extra Components' : 'Components'}</h2>
    <ul className="app-subnav__section">{items.map((component) => <li key={component.slug} className={`app-subnav__section-item ${component.slug === currentSlug ? 'app-subnav__section-item--current' : ''}`.trim()}><a className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline" href={component.href} aria-current={component.slug === currentSlug ? 'page' : undefined}>{component.name}</a></li>)}</ul>
  </nav>
}

function OverviewPage() {
  useEffect(() => { document.title = 'Components – KVZD GOV.UK React' }, [])
  return <DocsLayout>
    <div className="component-overview">
      <span className="govuk-caption-xl">GOV.UK React</span>
      <h1 className="govuk-heading-xl">Components</h1>
      <p className="govuk-body-l">Reusable React components for building consistent, accessible public services.</p>
      <p className="govuk-body">Each page includes a working example, a compact React API and implementation guidance aligned with GOV.UK Frontend 6.5.0.</p>
      <div className="overview-actions"><Button href="/quick-review/">Open Quick Review</Button><span>Explore multiple components together in one interactive page.</span></div>
      <ul className="official-component-list">{componentDocs.map((component) => <li key={component.slug}><a className="govuk-link" href={pathFor(component.slug)}>{component.name}</a>{component.status === 'trial' && <Tag color="blue">Trial</Tag>}<p>{component.summary}</p></li>)}</ul>
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

function ExtraComponentsPage() {
  useEffect(() => { document.title = 'Extra Components – KVZD GOV.UK React'; window.scrollTo(0, 0) }, [])
  return <DocsLayout currentSection="extra-components" currentSlug="fancy-tabs">
    <article className="component-doc extra-components-page">
      <Breadcrumbs className="doc-breadcrumbs" items={[{ label: 'KVZD Design', href: '/components/' }, { label: 'Extra Components', current: true }]} />
      <span className="govuk-caption-xl">KVZD Design</span>
      <h1 className="govuk-heading-xl">Extra Components</h1>
      <p className="govuk-body-l component-summary">Optional components for documentation, developer tools and other interfaces that sit outside the official GOV.UK component set.</p>
      <section id="fancy-tabs" aria-labelledby="fancy-tabs-title">
        <h2 className="govuk-heading-l" id="fancy-tabs-title">FancyTabs</h2>
        <p className="govuk-body">A stronger tab treatment for switching between views such as a live preview and its React source. It has the same interface as the standard <a className="govuk-link" href="/components/tabs/">Tabs</a> component.</p>
        <div className="extra-component-example">
          <FancyTabs items={[
            { key: 'preview', label: 'Preview', children: <div className="extra-component-example__panel"><FancyTabs items={[
              { key: 'summary', label: 'Summary', children: <p className="govuk-body govuk-!-margin-top-4">Review the application before continuing.</p> },
              { key: 'details', label: 'Details', children: <p className="govuk-body govuk-!-margin-top-4">The application contains 3 sections.</p> },
            ]} /></div> },
            { key: 'react', label: 'React', children: <pre className="code-block"><code>{fancyTabsCode}</code></pre> },
          ]} />
        </div>
        <h3 className="govuk-heading-m extra-component-api-title">React API</h3>
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
  useEffect(() => { document.title = `${component.name} – KVZD GOV.UK React`; window.scrollTo(0, 0) }, [component])
  return <DocsLayout currentSlug={component.slug}>
    <article className="component-doc">
      <Breadcrumbs className="doc-breadcrumbs" items={[{ label: 'Components', href: '/components/' }, { label: component.name, current: true }]} />
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
  return <DocsLayout><h1 className="govuk-heading-xl">Page not found</h1><p className="govuk-body">The component page you requested does not exist.</p><a className="govuk-link" href="/components/">Return to components</a></DocsLayout>
}

export default function App() {
  const cleanPath = window.location.pathname.replace(/\/+$/, '') || '/'
  if (cleanPath === '/quick-review') return <QuickReviewPage />
  if (cleanPath === '/extra-components') return <ExtraComponentsPage />
  if (cleanPath === '/' || cleanPath === '/components') return <OverviewPage />
  const match = cleanPath.match(/^\/components\/([^/]+)$/)
  const component = match ? componentBySlug.get(match[1]) : undefined
  return component ? <ComponentPage component={component} /> : <NotFoundPage />
}
