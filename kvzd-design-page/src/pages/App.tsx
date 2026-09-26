import { useEffect, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { H1, H2, Paragraph } from '@kevinzonda/design'
import { Breadcrumbs, Button, Link, Pagination, Table, Tag } from '@kevinzonda/design/components'
import { FancyTabs, Note, Sidebar, CodeBox } from '@kevinzonda/design/extraComponents'
import { componentBySlug, componentDocs, type ComponentDoc } from './componentRegistry'
import { extraComponentBySlug, extraComponentDocs, type ExtraComponentDoc } from './extraComponentRegistry'
import { DocsFooter, DocsHeader } from './DocsChrome'
import { DocsLink } from './DocsLink'
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
      renderLink={(item, { className }) => <DocsLink className={className} to={item.href ?? '#'}>{item.label}</DocsLink>}
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
      ? <DocsLink className={className} to={item.href} onClick={item.onClick} anchorProps={{ 'aria-current': current ? 'page' : undefined }}>{item.label}</DocsLink>
      : <button className={className} type="button" onClick={item.onClick} aria-current={current ? 'page' : undefined}>{item.label}</button>}
  />
}

function OverviewPage() {
  const locale = useLocale()
  useEffect(() => { document.title = pageTitle(message(locale, 'components'), locale) }, [locale])
  return <DocsLayout>
    <div className="component-overview">
      <H1 variant="xl" style={{ marginBottom: 22 }}>{message(locale, 'components')}</H1>
      <Paragraph variant="l">{message(locale, 'componentsIntro')}</Paragraph>
      <Paragraph>{message(locale, 'componentsDetail')}</Paragraph>
      <div className="overview-actions"><Button href={sitePath(localizedPath('/quick-review/', locale))} style={{ flex: 'none', margin: 0 }}>{message(locale, 'openQuickReview')}</Button><span>{message(locale, 'quickReviewHint')}</span></div>
      <ul className="official-component-list">{componentDocs.map((component) => <li key={component.slug}><DocsLink className="govuk-link" to={localizedPath(`/components/${component.slug}/`, locale)}>{component.name}</DocsLink>{component.status === 'trial' && <Tag color="orange" style={{ verticalAlign: 3 }}>{message(locale, 'trial')}</Tag>}<p>{localizedComponent(component, locale).summary}</p></li>)}</ul>
    </div>
  </DocsLayout>
}

function ExampleBlock({ component, guidanceUrl }: { component: ComponentDoc | ExtraComponentDoc; guidanceUrl?: string }) {
  const locale = useLocale()
  return <section className="component-example" aria-labelledby="example-title">
    <div className="example-heading"><H2 variant="l" id="example-title" style={{ marginBottom: 18 }}>{message(locale, 'example')}</H2>{guidanceUrl && <Link href={guidanceUrl} anchorProps={{ target: '_blank', rel: 'noreferrer' }}>{message(locale, 'guidance')}</Link>}</div>
    <FancyTabs items={[
      { key: 'example', label: message(locale, 'preview'), children: <div className={`example-canvas ${component.wide ? 'example-canvas--wide' : ''}`}>{component.example()}</div> },
      { key: 'react', label: 'React', children: <CodeBlock slug={component.slug} code={component.code} /> },
    ]} />
  </section>
}

function ApiTable({ component }: { component: ComponentDoc | ExtraComponentDoc }) {
  const locale = useLocale()
  return <section className="component-api" aria-labelledby="api-title">
    <H2 variant="l" id="api-title">React API</H2>
    <Paragraph>{message(locale, 'apiIntro')}</Paragraph>
    <div className="api-table-scroll"><Table styles={{ root: { minWidth: 680 } }} rowKey="name" columns={[
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
      <div className="component-title-row"><H1 variant="xl" style={{ marginBottom: 16 }}>{component.name}</H1>{component.status === 'trial' && <Tag color="orange" style={{ marginBottom: 16 }}>{message(locale, 'trial')}</Tag>}</div>
      <Paragraph variant="l" className="component-summary">{doc.summary}</Paragraph>
      <ExampleBlock component={component} guidanceUrl={component.guidanceUrl === null ? undefined : component.guidanceUrl ?? `https://design-system.service.gov.uk/components/${component.slug}/`} />
      <ApiTable component={component} />
      <section className="guidance-section"><H2 variant="l">{message(locale, 'whenToUse')}</H2><Paragraph>{doc.whenToUse}</Paragraph></section>
      <section className="guidance-section"><H2 variant="l">{message(locale, 'howItWorks')}</H2><Paragraph>{doc.howItWorks}</Paragraph><Note className="implementation-note" title={message(locale, 'implementation')}><p>{message(locale, 'implementationDetail')}</p></Note></section>
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
      <H1 variant="xl">{message(locale, 'extraComponents')}</H1>
      <Paragraph variant="l">{message(locale, 'extraIntro')}</Paragraph>
      <Paragraph>{message(locale, 'extraDetail')}</Paragraph>
      <ul className="official-component-list">{extraComponentDocs.map((component) => <li key={component.slug}><DocsLink className="govuk-link" to={localizedPath(`/extra-components/${component.slug}/`, locale)}>{component.name}</DocsLink><p>{localizedExtraComponent(component, locale).summary}</p></li>)}</ul>
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
      <H1 variant="xl">{component.name}</H1>
      <Paragraph variant="l" className="component-summary">{doc.summary}</Paragraph>
      <ExampleBlock component={component} />
      <ApiTable component={component} />
      <section className="guidance-section" aria-labelledby="guidance-title"><H2 variant="l" id="guidance-title">{message(locale, 'whenToUse')}</H2><Paragraph>{doc.whenToUse}</Paragraph></section>
      <section className="guidance-section"><H2 variant="l">{message(locale, 'howItWorks')}</H2><Paragraph>{doc.howItWorks}</Paragraph></section>
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
  return <DocsLayout currentSection={section}><H1 variant="xl">{message(locale, 'notFound')}</H1><Paragraph>{message(locale, 'notFoundDetail')}</Paragraph><DocsLink className="govuk-link" to={localizedPath(section === 'extra-components' ? '/extra-components/' : '/components/', locale)}>{message(locale, 'returnTo')}{locale === 'zh' ? '' : ' '}{sectionLabel}</DocsLink></DocsLayout>
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
