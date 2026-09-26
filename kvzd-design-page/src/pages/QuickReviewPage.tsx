import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Typography } from '@kevinzonda/design'
import { SearchInput, Tag } from '@kevinzonda/design/components'
import { ShowcaseBox, Sidebar } from '@kevinzonda/design/extraComponents'
import './QuickReviewPage.css'
import { DocsFooter, DocsHeader } from './DocsChrome'
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
          <Typography.Title level={1} variant="xl">{message(locale, 'quickReview')}</Typography.Title>
          <Typography.Paragraph variant="l" className="intro">{message(locale, 'reviewIntro')}</Typography.Paragraph>
          <div className="release-note">
            <Tag color="blue">{message(locale, 'baseline')}</Tag>
            <span>{message(locale, 'lockedTo')}</span>
            <span className="release-note__count">{componentDocs.length} {message(locale, 'componentsCovered')}</span>
          </div>

          <div className="review-filter">
            <SearchInput
              className="review-filter__search"
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
            <Typography.Title level={2} variant="l" id="index-title">{message(locale, 'componentIndex')}</Typography.Title>
            <ul>
              {filteredComponents.map((component) => (
                <li key={component.slug}><a className="govuk-link govuk-link--no-visited-state" href={`#${component.slug}`}>{component.name}</a></li>
              ))}
            </ul>
          </section>

          <section className="review-gallery" aria-labelledby="review-gallery-title">
            <div className="review-gallery__heading">
              <div>
                <Typography.Title level={2} variant="l" id="review-gallery-title">{message(locale, 'allComponents')}</Typography.Title>
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
                      <Link className="govuk-link" to={localizedPath(`/components/${component.slug}/`, locale)}>
                        {message(locale, 'viewDocumentation')}
                      </Link>
                      <a className="govuk-link review-card__top-link" href="#top">{message(locale, 'backToTop')}</a>
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
                <Typography.Title level={3} variant="m">{message(locale, 'noComponents')}</Typography.Title>
                <Typography.Paragraph>{message(locale, 'tryDifferent')}</Typography.Paragraph>
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
