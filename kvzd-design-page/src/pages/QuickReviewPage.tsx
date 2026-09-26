import { useEffect, useMemo, useState } from 'react'
import { H1, H2, H3, Paragraph } from '@kevinzonda/design'
import { kss } from '@kevinzonda/design/kss'
import { Link, SearchInput, Tag } from '@kevinzonda/design/components'
import { ShowcaseBox, Sidebar } from '@kevinzonda/design/extraComponents'
import './QuickReviewPage.css'
import { DocsFooter, DocsHeader } from './DocsChrome'
import { DocsLink } from './DocsLink'
import { componentDocs } from './componentRegistry'
import { localizedPath, message, pageTitle, useLocale } from './i18n'
import { localizedComponent } from './zhDocs'

export function QuickReviewPage() {
  const locale = useLocale()
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.title = pageTitle(message(locale, 'quickReview'), locale)
  }, [locale])

  const filteredComponents = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return componentDocs
    return componentDocs.filter((component) =>
      `${component.name} ${localizedComponent(component, locale).summary}`.toLowerCase().includes(needle),
    )
  }, [query, locale])

  return (
    <div className="app-shell govuk-frontend-supported quick-review-page">
      <DocsHeader current="quick-review" />

      <div className="site-width page-layout" id="top">
        <Sidebar className="docs-sidebar" heading={message(locale, 'components')} items={filteredComponents.map((component) => ({
          key: component.slug,
          label: component.name,
          href: `#${component.slug}`,
        }))} />

        <main id="main-content" className="main-content">
          <H1 variant="xl">{message(locale, 'quickReview')}</H1>
          <Paragraph variant="l" className="intro">{message(locale, 'reviewIntro')}</Paragraph>
          <div className="release-note">
            <Tag color="blue">{message(locale, 'baseline')}</Tag>
            <span>{message(locale, 'lockedTo')}</span>
            <span className="release-note__count">{componentDocs.length} {message(locale, 'componentsCovered')}</span>
          </div>

          <div className="review-filter">
            <SearchInput
              className="review-filter__search"
              styles={{ root: kss('mb10') }}
              id="component-search"
              label={message(locale, 'filterComponents')}
              labelSize="s"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <p className="review-filter__count" aria-live="polite">
              {locale === 'zh' ? `显示 ${filteredComponents.length} 个，共 ${componentDocs.length} 个` : `${message(locale, 'showing')} ${filteredComponents.length} ${message(locale, 'of')} ${componentDocs.length}`}
            </p>
          </div>

          <section className="component-index" aria-labelledby="index-title">
            <H2 variant="l" id="index-title">{message(locale, 'componentIndex')}</H2>
            <ul>
              {filteredComponents.map((component) => (
                <li key={component.slug}><Link href={`#${component.slug}`} noVisitedState>{component.name}</Link></li>
              ))}
            </ul>
          </section>

          <section className="review-gallery" aria-labelledby="review-gallery-title">
            <div className="review-gallery__heading">
              <div>
                <H2 variant="l" id="review-gallery-title">{message(locale, 'allComponents')}</H2>
              </div>
              <span aria-live="polite">{filteredComponents.length} {message(locale, 'shown')}</span>
            </div>

            {filteredComponents.length > 0 ? (
              <div className="review-grid">
                {filteredComponents.map((component) => (
                  <ShowcaseBox
                    className={component.wide ? 'review-card--wide' : ''}
                    classNames={{ content: component.wide ? 'example-canvas--wide' : undefined }}
                    description={localizedComponent(component, locale).summary}
                    footer={<>
                      <DocsLink className="govuk-link" to={localizedPath(`/components/${component.slug}/`, locale)}>
                        {message(locale, 'viewDocumentation')}
                      </DocsLink>
                      <Link href="#top" className="review-card__top-link">{message(locale, 'backToTop')}</Link>
                    </>}
                    headerExtra={component.status === 'trial' ? <Tag color="orange">{message(locale, 'trial')}</Tag> : undefined}
                    headingLevel={3}
                    id={component.slug}
                    key={component.slug}
                    title={component.name}
                  >
                    {component.example()}
                  </ShowcaseBox>
                ))}
              </div>
            ) : (
              <div className="review-empty" role="status">
                <H3 variant="m">{message(locale, 'noComponents')}</H3>
                <Paragraph>{message(locale, 'tryDifferent')}</Paragraph>
              </div>
            )}
          </section>
        </main>
      </div>

      <DocsFooter />
    </div>
  )
}

export default QuickReviewPage
