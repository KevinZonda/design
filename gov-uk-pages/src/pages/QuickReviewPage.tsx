import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SearchInput, Tag } from '@kvzd-design/gov-uk'
import { Sidebar } from '@kvzd-design/gov-uk-extends'
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
    <div className="app-shell govuk-frontend-supported">
      <DocsHeader current="quick-review" />

      <div className="site-width page-layout" id="top">
        <Sidebar className="docs-sidebar" heading={message(locale, 'components')} items={filteredComponents.map((component) => ({
          key: component.slug,
          label: component.name,
          href: `#${component.slug}`,
        }))} />

        <main id="main-content" className="main-content">
          <h1 className="govuk-heading-xl">{message(locale, 'quickReview')}</h1>
          <p className="govuk-body-l intro">{message(locale, 'reviewIntro')}</p>
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
            <h2 className="govuk-heading-l" id="index-title">{message(locale, 'componentIndex')}</h2>
            <ul>
              {filteredComponents.map((component) => (
                <li key={component.slug}><a href={`#${component.slug}`}>{component.name}</a></li>
              ))}
            </ul>
          </section>

          <section className="review-gallery" aria-labelledby="review-gallery-title">
            <div className="review-gallery__heading">
              <div>
                <h2 className="govuk-heading-l" id="review-gallery-title">{message(locale, 'allComponents')}</h2>
              </div>
              <span aria-live="polite">{filteredComponents.length} {message(locale, 'shown')}</span>
            </div>

            {filteredComponents.length > 0 ? (
              <div className="review-grid">
                {filteredComponents.map((component) => (
                  <article
                    className={`review-card ${component.wide ? 'review-card--wide' : ''}`.trim()}
                    id={component.slug}
                    key={component.slug}
                  >
                    <div className="review-card__header">
                      <div className="review-card__title-row">
                        <h3 className="govuk-heading-m">{component.name}</h3>
                        {component.status === 'trial' && <Tag color="orange">{message(locale, 'trial')}</Tag>}
                      </div>
                      <p className="govuk-body">{localizedComponent(component, locale).summary}</p>
                    </div>
                    <div className={`review-card__example example-canvas ${component.wide ? 'example-canvas--wide' : ''}`.trim()}>
                      {component.example()}
                    </div>
                    <div className="review-card__footer">
                      <Link className="govuk-link" to={localizedPath(`/components/${component.slug}/`, locale)}>
                        {message(locale, 'viewDocumentation')}
                      </Link>
                      <a className="govuk-link review-card__top-link" href="#top">{message(locale, 'backToTop')}</a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="review-empty" role="status">
                <h3 className="govuk-heading-m">{message(locale, 'noComponents')}</h3>
                <p className="govuk-body">{message(locale, 'tryDifferent')}</p>
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
