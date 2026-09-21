import { useEffect, useState, type ReactNode } from 'react'
import { Breadcrumbs, Button, Pagination, Table, Tag } from '@kvzd-design/gov-uk'
import { componentBySlug, componentDocs, type ComponentDoc } from './componentRegistry'
import { DocsFooter, DocsHeader } from './DocsChrome'
import { QuickReviewPage } from './QuickReviewPage'
import './DocsLayout.css'
import './ComponentDocs.css'

function pathFor(slug: string) {
  return `/components/${slug}/`
}

function SideNavigation({ currentSlug }: { currentSlug?: string }) {
  return <nav className="app-subnav" aria-labelledby="app-subnav-heading">
    <h2 className="govuk-visually-hidden" id="app-subnav-heading">Pages in this section</h2>
    <ul className="app-subnav__section">{componentDocs.map((component) => <li key={component.slug} className={`app-subnav__section-item ${component.slug === currentSlug ? 'app-subnav__section-item--current' : ''}`.trim()}><a className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline" href={pathFor(component.slug)} aria-current={component.slug === currentSlug ? 'page' : undefined}>{component.name}</a></li>)}</ul>
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
  const [tab, setTab] = useState<'example' | 'react'>('example')
  return <section className="component-example" aria-labelledby="example-title">
    <div className="example-heading"><h2 className="govuk-heading-l" id="example-title">Example</h2><a className="govuk-link" href={`https://design-system.service.gov.uk/components/${component.slug}/`} target="_blank" rel="noreferrer">View GOV.UK guidance</a></div>
    <div className="example-tabs" role="tablist" aria-label="Example views">
      <button id="example-preview-tab" type="button" role="tab" aria-controls="example-preview-panel" aria-selected={tab === 'example'} onClick={() => setTab('example')}>Preview</button>
      <button id="example-react-tab" type="button" role="tab" aria-controls="example-react-panel" aria-selected={tab === 'react'} onClick={() => setTab('react')}>React</button>
    </div>
    {tab === 'example'
      ? <div id="example-preview-panel" role="tabpanel" aria-labelledby="example-preview-tab" className={`example-canvas ${component.wide ? 'example-canvas--wide' : ''}`}>{component.example()}</div>
      : <pre id="example-react-panel" role="tabpanel" aria-labelledby="example-react-tab" className="code-block"><code>{component.code}</code></pre>}
  </section>
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

function DocsLayout({ children, currentSlug }: { children: ReactNode; currentSlug?: string }) {
  return <div className="app-shell govuk-frontend-supported"><DocsHeader /><div className="site-width page-layout" id="top"><SideNavigation currentSlug={currentSlug} /><main className="main-content" id="main-content">{children}</main></div><DocsFooter /></div>
}

function NotFoundPage() {
  useEffect(() => { document.title = 'Page not found – KVZD GOV.UK React' }, [])
  return <DocsLayout><h1 className="govuk-heading-xl">Page not found</h1><p className="govuk-body">The component page you requested does not exist.</p><a className="govuk-link" href="/components/">Return to components</a></DocsLayout>
}

export default function App() {
  const cleanPath = window.location.pathname.replace(/\/+$/, '') || '/'
  if (cleanPath === '/quick-review') return <QuickReviewPage />
  if (cleanPath === '/' || cleanPath === '/components') return <OverviewPage />
  const match = cleanPath.match(/^\/components\/([^/]+)$/)
  const component = match ? componentBySlug.get(match[1]) : undefined
  return component ? <ComponentPage component={component} /> : <NotFoundPage />
}
