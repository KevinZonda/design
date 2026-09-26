import { useEffect, type ReactNode } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { Breadcrumbs, Button, Pagination, Table, Tag } from '@kevinzonda/design/components'
import { FancyTabs, Note, Sidebar, CodeBox } from '@kevinzonda/design/extraComponents'
import { componentBySlug, componentDocs, type ComponentDoc } from './componentRegistry'
import { extraComponentBySlug, extraComponentDocs, type ExtraComponentDoc } from './extraComponentRegistry'
import { DocsFooter, DocsHeader } from './DocsChrome'
import { QuickReviewPage } from './QuickReviewPage'
import { LicensePage } from './LicensePage'
import { TypographyPage } from './TypographyPage'
import { localeFromPath, localizedPath, message, pageTitle, useLocale, type Locale } from './i18n'
import { localizedComponent, localizedExtraComponent } from './zhDocs'
import { chineseApiDescription } from './zhApi'
import { sitePath } from './sitePath'
import highlightedCode from '../generated/highlightedCode.json'
import './DocsLayout.css'
import './ComponentDocs.css'

const highlightedBySlug = highlightedCode as Record<string, string>

function CodeBlock({ slug, code }: { slug: string; code: string }) {
  return <CodeBox code={code} highlightedHtml={highlightedBySlug[slug]} />
}

function pathFor(slug: string, locale: Locale) {
  return sitePath(localizedPath(`/components/${slug}/`, locale))
}

function extraPathFor(slug: string, locale: Locale) {
  return sitePath(localizedPath(`/extra-components/${slug}/`, locale))
}

type DocsSection = 'components' | 'extra-components'

function SideNavigation({ currentSlug, section }: { currentSlug?: string; section: DocsSection | 'typography' }) {
  const locale = useLocale()
  if (section === 'typography') {
    return <Sidebar
      className="docs-sidebar"
      heading={message(locale, 'typography')}
      items={([
        ['headings', 'typographyHeadings'],
        ['captions', 'typographyCaptions'],
        ['inline-text', 'typographyInlineText'],
        ['paragraphs', 'typographyParagraphs'],
        ['api', 'reactApi'],
      ] as const).map(([key, labelKey]) => ({ key, label: message(locale, labelKey), href: `#${key}` }))}
      renderLink={(item, { className }) => <Link className={className} to={{ hash: item.href }}>{item.label}</Link>}
    />
  }
  const items = section === 'extra-components'
    ? extraComponentDocs.map((component) => ({ key: component.slug, label: component.name, href: localizedPath(`/extra-components/${component.slug}/`, locale) }))
    : componentDocs.map((component) => ({ key: component.slug, label: component.name, href: localizedPath(`/components/${component.slug}/`, locale) }))

  return <Sidebar
    className="docs-sidebar"
    heading={message(locale, section === 'extra-components' ? 'extraComponents' : 'components')}
    items={items}
    activeKey={currentSlug}
    renderLink={(item, { className, current }) => item.href !== undefined
      ? <Link className={className} to={item.href} onClick={item.onClick} aria-current={current ? 'page' : undefined}>{item.label}</Link>
      : <button className={className} type="button" onClick={item.onClick} aria-current={current ? 'page' : undefined}>{item.label}</button>}
  />
}

function OverviewPage() {
  const locale = useLocale()
  useEffect(() => { document.title = pageTitle(message(locale, 'components'), locale) }, [locale])
  return <DocsLayout>
    <div className="component-overview">
      <h1 className="govuk-heading-xl">{message(locale, 'components')}</h1>
      <p className="govuk-body-l">{message(locale, 'componentsIntro')}</p>
      <p className="govuk-body">{message(locale, 'componentsDetail')}</p>
      <div className="overview-actions"><Button href={sitePath(localizedPath('/quick-review/', locale))}>{message(locale, 'openQuickReview')}</Button><span>{message(locale, 'quickReviewHint')}</span></div>
      <ul className="official-component-list">{componentDocs.map((component) => <li key={component.slug}><Link className="govuk-link" to={localizedPath(`/components/${component.slug}/`, locale)}>{component.name}</Link>{component.status === 'trial' && <Tag color="orange">{message(locale, 'trial')}</Tag>}<p>{localizedComponent(component, locale).summary}</p></li>)}</ul>
    </div>
  </DocsLayout>
}

function ExampleBlock({ component, guidanceUrl }: { component: ComponentDoc | ExtraComponentDoc; guidanceUrl?: string }) {
  const locale = useLocale()
  return <section className="component-example" aria-labelledby="example-title">
    <div className="example-heading"><h2 className="govuk-heading-l" id="example-title">{message(locale, 'example')}</h2>{guidanceUrl && <a className="govuk-link" href={guidanceUrl} target="_blank" rel="noreferrer">{message(locale, 'guidance')}</a>}</div>
    <FancyTabs items={[
      { key: 'example', label: message(locale, 'preview'), children: <div className={`example-canvas ${component.wide ? 'example-canvas--wide' : ''}`}>{component.example()}</div> },
      { key: 'react', label: 'React', children: <CodeBlock slug={component.slug} code={component.code} /> },
    ]} />
  </section>
}

function ApiTable({ component }: { component: ComponentDoc | ExtraComponentDoc }) {
  const locale = useLocale()
  return <section className="component-api" aria-labelledby="api-title">
    <h2 className="govuk-heading-l" id="api-title">React API</h2>
    <p className="govuk-body">{message(locale, 'apiIntro')}</p>
    <div className="api-table-scroll"><Table rowKey="name" columns={[
      { title: message(locale, 'property'), dataIndex: 'name', rowHeader: true, render: (value) => <code>{String(value)}</code> },
      { title: message(locale, 'type'), dataIndex: 'type', render: (value) => <code>{String(value)}</code> },
      { title: message(locale, 'default'), dataIndex: 'defaultValue', render: (value) => value ? <code>{String(value)}</code> : '-' },
      { title: message(locale, 'description'), dataIndex: 'description' },
    ]} dataSource={locale === 'zh' ? component.api.map((prop) => ({ ...prop, description: chineseApiDescription(prop.description) })) : component.api} /></div>
  </section>
}

function ComponentPage({ component }: { component: ComponentDoc }) {
  const locale = useLocale()
  const doc = localizedComponent(component, locale)
  const index = componentDocs.findIndex((item) => item.slug === component.slug)
  const previous = componentDocs[index - 1]
  const next = componentDocs[index + 1]
  useEffect(() => { document.title = pageTitle(component.name, locale) }, [component, locale])
  return <DocsLayout currentSlug={component.slug}>
    <article className="component-doc">
      <Breadcrumbs className="doc-breadcrumbs" items={[{ label: message(locale, 'components'), href: sitePath(localizedPath('/components/', locale)) }, { label: component.name, current: true }]} />
      <div className="component-title-row"><h1 className="govuk-heading-xl">{component.name}</h1>{component.status === 'trial' && <Tag color="orange">{message(locale, 'trial')}</Tag>}</div>
      <p className="govuk-body-l component-summary">{doc.summary}</p>
      <ExampleBlock component={component} guidanceUrl={component.guidanceUrl === null ? undefined : component.guidanceUrl ?? `https://design-system.service.gov.uk/components/${component.slug}/`} />
      <ApiTable component={component} />
      <section className="guidance-section"><h2 className="govuk-heading-l">{message(locale, 'whenToUse')}</h2><p className="govuk-body">{doc.whenToUse}</p></section>
      <section className="guidance-section"><h2 className="govuk-heading-l">{message(locale, 'howItWorks')}</h2><p className="govuk-body">{doc.howItWorks}</p><Note className="implementation-note" title={message(locale, 'implementation')}><p>{message(locale, 'implementationDetail')}</p></Note></section>
      <Pagination className="component-pagination" label={message(locale, 'componentPages')} previous={previous ? { href: pathFor(previous.slug, locale), text: message(locale, 'previousComponent'), label: previous.name } : undefined} next={next ? { href: pathFor(next.slug, locale), text: message(locale, 'nextComponent'), label: next.name } : undefined} />
    </article>
  </DocsLayout>
}

function ExtraOverviewPage() {
  const locale = useLocale()
  const { hash } = useLocation()
  useEffect(() => { document.title = pageTitle(message(locale, 'extraComponents'), locale) }, [locale])
  const legacySlug = hash.slice(1).replace(/-(api|title)$/, '')
  if (extraComponentBySlug.has(legacySlug)) return <Navigate to={localizedPath(`/extra-components/${legacySlug}/${hash.endsWith('-api') ? '#api-title' : ''}`, locale)} replace />
  return <DocsLayout currentSection="extra-components">
    <div className="component-overview">
      <h1 className="govuk-heading-xl">{message(locale, 'extraComponents')}</h1>
      <p className="govuk-body-l">{message(locale, 'extraIntro')}</p>
      <p className="govuk-body">{message(locale, 'extraDetail')}</p>
      <ul className="official-component-list">{extraComponentDocs.map((component) => <li key={component.slug}><Link className="govuk-link" to={localizedPath(`/extra-components/${component.slug}/`, locale)}>{component.name}</Link><p>{localizedExtraComponent(component, locale).summary}</p></li>)}</ul>
    </div>
  </DocsLayout>
}

function ExtraComponentPage({ component }: { component: ExtraComponentDoc }) {
  const locale = useLocale()
  const doc = localizedExtraComponent(component, locale)
  const index = extraComponentDocs.findIndex((item) => item.slug === component.slug)
  const previous = extraComponentDocs[index - 1]
  const next = extraComponentDocs[index + 1]
  useEffect(() => { document.title = pageTitle(component.name, locale) }, [component, locale])
  return <DocsLayout currentSection="extra-components" currentSlug={component.slug}>
    <article className="component-doc">
      <Breadcrumbs className="doc-breadcrumbs" items={[{ label: message(locale, 'extraComponents'), href: sitePath(localizedPath('/extra-components/', locale)) }, { label: component.name, current: true }]} />
      <h1 className="govuk-heading-xl">{component.name}</h1>
      <p className="govuk-body-l component-summary">{doc.summary}</p>
      <ExampleBlock component={component} />
      <ApiTable component={component} />
      <section className="guidance-section" aria-labelledby="guidance-title"><h2 className="govuk-heading-l" id="guidance-title">{message(locale, 'whenToUse')}</h2><p className="govuk-body">{doc.whenToUse}</p></section>
      <section className="guidance-section"><h2 className="govuk-heading-l">{message(locale, 'howItWorks')}</h2><p className="govuk-body">{doc.howItWorks}</p></section>
      <Pagination className="component-pagination" label={message(locale, 'extraComponentPages')} previous={previous ? { href: extraPathFor(previous.slug, locale), text: message(locale, 'previousComponent'), label: previous.name } : undefined} next={next ? { href: extraPathFor(next.slug, locale), text: message(locale, 'nextComponent'), label: next.name } : undefined} />
    </article>
  </DocsLayout>
}

function DocsLayout({ children, currentSlug, currentSection = 'components' }: { children: ReactNode; currentSlug?: string; currentSection?: DocsSection | 'typography' }) {
  return <div className="app-shell govuk-frontend-supported"><DocsHeader current={currentSection} /><div className="site-width page-layout" id="top"><SideNavigation currentSlug={currentSlug} section={currentSection} /><main className="main-content" id="main-content">{children}</main></div><DocsFooter /></div>
}

function NotFoundPage({ section = 'components' }: { section?: DocsSection }) {
  const locale = useLocale()
  useEffect(() => { document.title = pageTitle(message(locale, 'notFound'), locale) }, [locale])
  const sectionLabel = message(locale, section === 'extra-components' ? 'extraComponents' : 'components')
  return <DocsLayout currentSection={section}><h1 className="govuk-heading-xl">{message(locale, 'notFound')}</h1><p className="govuk-body">{message(locale, 'notFoundDetail')}</p><Link className="govuk-link" to={localizedPath(section === 'extra-components' ? '/extra-components/' : '/components/', locale)}>{message(locale, 'returnTo')}{locale === 'zh' ? '' : ' '}{sectionLabel}</Link></DocsLayout>
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
    document.documentElement.lang = localeFromPath(pathname) === 'zh' ? 'zh-CN' : 'en'
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView())
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])
  return null
}

function LocaleRedirect() {
  const { pathname, search, hash } = useLocation()
  const legacyEnglish = /^\/(?:components|extra-components|quick-review|license|typography)(?:\/|$)/.test(pathname)
  return <Navigate to={`${localizedPath(pathname, legacyEnglish ? 'en' : 'zh')}${search}${hash}`} replace />
}

export default function App() {
  const prefixes = ['/zh', '/en'] as const
  return <>
    <RouteScroll />
    <Routes>
      {prefixes.flatMap((prefix) => [
        <Route key={`${prefix}-home`} path={prefix} element={<QuickReviewPage />} />,
        <Route key={`${prefix}-components`} path={`${prefix}/components`} element={<OverviewPage />} />,
        <Route key={`${prefix}-component`} path={`${prefix}/components/:slug`} element={<ComponentRoute />} />,
        <Route key={`${prefix}-typography`} path={`${prefix}/typography`} element={<DocsLayout currentSection="typography"><TypographyPage /></DocsLayout>} />,
        <Route key={`${prefix}-extras`} path={`${prefix}/extra-components`} element={<ExtraOverviewPage />} />,
        <Route key={`${prefix}-extra`} path={`${prefix}/extra-components/:slug`} element={<ExtraComponentRoute />} />,
        <Route key={`${prefix}-review`} path={`${prefix}/quick-review`} element={<QuickReviewPage />} />,
        <Route key={`${prefix}-license`} path={`${prefix}/license`} element={<LicensePage />} />,
      ])}
      <Route path="/zh/*" element={<NotFoundPage />} />
      <Route path="/en/*" element={<NotFoundPage />} />
      <Route path="*" element={<LocaleRedirect />} />
    </Routes>
  </>
}
