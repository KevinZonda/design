import { useEffect, type ReactNode } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { Breadcrumbs, Button, Pagination, Table, Tag } from '@kvzd-design/gov-uk'
import { FancyTabs, Note, Sidebar } from '@kvzd-design/gov-uk-extends'
import { componentBySlug, componentDocs, type ComponentDoc } from './componentRegistry'
import { extraComponentBySlug, extraComponentDocs, type ExtraComponentDoc } from './extraComponentRegistry'
import { DocsFooter, DocsHeader } from './DocsChrome'
import { QuickReviewPage } from './QuickReviewPage'
import { sitePath } from './sitePath'
import './DocsLayout.css'
import './ComponentDocs.css'

function pathFor(slug: string) {
  return sitePath(`/components/${slug}/`)
}

function extraPathFor(slug: string) {
  return sitePath(`/extra-components/${slug}/`)
}

type DocsSection = 'components' | 'extra-components'

function SideNavigation({ currentSlug, section }: { currentSlug?: string; section: DocsSection }) {
  const items = section === 'extra-components'
    ? extraComponentDocs.map((component) => ({ key: component.slug, label: component.name, href: `/extra-components/${component.slug}/` }))
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
      <p className="govuk-body">Each page includes a working example, a compact React API and implementation guidance aligned with GOV.UK Frontend 6.5.1.</p>
      <div className="overview-actions"><Button href={sitePath('/quick-review/')}>Open Quick Review</Button><span>Explore multiple components together in one interactive page.</span></div>
      <ul className="official-component-list">{componentDocs.map((component) => <li key={component.slug}><Link className="govuk-link" to={`/components/${component.slug}/`}>{component.name}</Link>{component.status === 'trial' && <Tag color="orange">Trial</Tag>}<p>{component.summary}</p></li>)}</ul>
    </div>
  </DocsLayout>
}

function ExampleBlock({ component, guidanceUrl }: { component: ComponentDoc | ExtraComponentDoc; guidanceUrl?: string }) {
  return <section className="component-example" aria-labelledby="example-title">
    <div className="example-heading"><h2 className="govuk-heading-l" id="example-title">Example</h2>{guidanceUrl && <a className="govuk-link" href={guidanceUrl} target="_blank" rel="noreferrer">View GOV.UK guidance</a>}</div>
    <FancyTabs items={[
      { key: 'example', label: 'Preview', children: <div className={`example-canvas ${component.wide ? 'example-canvas--wide' : ''}`}>{component.example()}</div> },
      { key: 'react', label: 'React', children: <pre className="code-block"><code>{component.code}</code></pre> },
    ]} />
  </section>
}

function ApiTable({ component }: { component: ComponentDoc | ExtraComponentDoc }) {
  return <section className="component-api" aria-labelledby="api-title">
    <h2 className="govuk-heading-l" id="api-title">React API</h2>
    <p className="govuk-body">Props accepted by this React component.</p>
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
      <div className="component-title-row"><h1 className="govuk-heading-xl">{component.name}</h1>{component.status === 'trial' && <Tag color="orange">Trial</Tag>}</div>
      <p className="govuk-body-l component-summary">{component.summary}</p>
      <ExampleBlock component={component} guidanceUrl={component.guidanceUrl === null ? undefined : component.guidanceUrl ?? `https://design-system.service.gov.uk/components/${component.slug}/`} />
      <ApiTable component={component} />
      <section className="guidance-section"><h2 className="govuk-heading-l">When to use this component</h2><p className="govuk-body">{component.whenToUse}</p></section>
      <section className="guidance-section"><h2 className="govuk-heading-l">How it works</h2><p className="govuk-body">{component.howItWorks}</p><Note className="implementation-note" title="React implementation"><p>State changes stay inside React. The rendered markup uses GOV.UK classes and semantic HTML, without initialising DOM-mutating GOV.UK JavaScript.</p></Note></section>
      <Pagination className="component-pagination" label="Component pages" previous={previous ? { href: pathFor(previous.slug), text: 'Previous component', label: previous.name } : undefined} next={next ? { href: pathFor(next.slug), text: 'Next component', label: next.name } : undefined} />
    </article>
  </DocsLayout>
}

function ExtraOverviewPage() {
  const { hash } = useLocation()
  useEffect(() => { document.title = 'Extra Components – KVZD GOV.UK React' }, [])
  const legacySlug = hash.slice(1).replace(/-(api|title)$/, '')
  if (extraComponentBySlug.has(legacySlug)) return <Navigate to={`/extra-components/${legacySlug}/${hash.endsWith('-api') ? '#api-title' : ''}`} replace />
  return <DocsLayout currentSection="extra-components">
    <div className="component-overview">
      <span className="govuk-caption-xl">KVZD Design</span>
      <h1 className="govuk-heading-xl">Extra Components</h1>
      <p className="govuk-body-l">Optional components for documentation, developer tools and other interfaces outside the official GOV.UK component set.</p>
      <p className="govuk-body">Each component has a live example, React code and its own API reference.</p>
      <ul className="official-component-list">{extraComponentDocs.map((component) => <li key={component.slug}><Link className="govuk-link" to={`/extra-components/${component.slug}/`}>{component.name}</Link><p>{component.summary}</p></li>)}</ul>
    </div>
  </DocsLayout>
}

function ExtraComponentPage({ component }: { component: ExtraComponentDoc }) {
  const index = extraComponentDocs.findIndex((item) => item.slug === component.slug)
  const previous = extraComponentDocs[index - 1]
  const next = extraComponentDocs[index + 1]
  useEffect(() => { document.title = `${component.name} – KVZD GOV.UK React` }, [component])
  return <DocsLayout currentSection="extra-components" currentSlug={component.slug}>
    <article className="component-doc">
      <Breadcrumbs className="doc-breadcrumbs" items={[{ label: 'Extra Components', href: sitePath('/extra-components/') }, { label: component.name, current: true }]} />
      <h1 className="govuk-heading-xl">{component.name}</h1>
      <p className="govuk-body-l component-summary">{component.summary}</p>
      <ExampleBlock component={component} />
      <ApiTable component={component} />
      <section className="guidance-section" aria-labelledby="guidance-title"><h2 className="govuk-heading-l" id="guidance-title">When to use this component</h2><p className="govuk-body">{component.whenToUse}</p></section>
      <section className="guidance-section"><h2 className="govuk-heading-l">How it works</h2><p className="govuk-body">{component.howItWorks}</p></section>
      <Pagination className="component-pagination" label="Extra component pages" previous={previous ? { href: extraPathFor(previous.slug), text: 'Previous component', label: previous.name } : undefined} next={next ? { href: extraPathFor(next.slug), text: 'Next component', label: next.name } : undefined} />
    </article>
  </DocsLayout>
}

function DocsLayout({ children, currentSlug, currentSection = 'components' }: { children: ReactNode; currentSlug?: string; currentSection?: DocsSection }) {
  return <div className="app-shell govuk-frontend-supported"><DocsHeader current={currentSection} /><div className="site-width page-layout" id="top"><SideNavigation currentSlug={currentSlug} section={currentSection} /><main className="main-content" id="main-content">{children}</main></div><DocsFooter /></div>
}

function NotFoundPage({ section = 'components' }: { section?: DocsSection }) {
  useEffect(() => { document.title = 'Page not found – KVZD GOV.UK React' }, [])
  return <DocsLayout currentSection={section}><h1 className="govuk-heading-xl">Page not found</h1><p className="govuk-body">The component page you requested does not exist.</p><Link className="govuk-link" to={section === 'extra-components' ? '/extra-components/' : '/components/'}>Return to {section === 'extra-components' ? 'Extra Components' : 'Components'}</Link></DocsLayout>
}

function ComponentRoute() {
  const { slug } = useParams()
  const component = slug ? componentBySlug.get(slug) : undefined
  return component ? <ComponentPage component={component} /> : <NotFoundPage />
}

function ExtraComponentRoute() {
  const { slug } = useParams()
  const component = slug ? extraComponentBySlug.get(slug) : undefined
  return component ? <ExtraComponentPage component={component} /> : <NotFoundPage section="extra-components" />
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
      <Route path="/extra-components" element={<ExtraOverviewPage />} />
      <Route path="/extra-components/:slug" element={<ExtraComponentRoute />} />
      <Route path="/quick-review" element={<QuickReviewPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </>
}
