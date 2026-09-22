import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Input, Tag } from '@kvzd-design/gov-uk'
import { Sidebar } from '@kvzd-design/gov-uk-extends'
import './QuickReviewPage.css'
import { DocsFooter, DocsHeader } from './DocsChrome'
import { componentDocs } from './componentRegistry'

export function QuickReviewPage() {
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.title = 'Quick Review – KVZD GOV.UK React'
  }, [])

  const filteredComponents = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return componentDocs
    return componentDocs.filter((component) =>
      `${component.name} ${component.summary}`.toLowerCase().includes(needle),
    )
  }, [query])

  return (
    <div className="app-shell govuk-frontend-supported">
      <DocsHeader current="quick-review" />

      <div className="site-width page-layout" id="top">
        <Sidebar className="review-sidebar" heading="Components" items={filteredComponents.map((component) => ({
          key: component.slug,
          label: component.name,
          href: `#${component.slug}`,
        }))}>
          <Input
            className="side-nav__search"
            id="component-search"
            type="search"
            label="Filter components"
            labelSize="s"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <p className="side-nav__count" aria-live="polite">
            Showing {filteredComponents.length} of {componentDocs.length}
          </p>
        </Sidebar>

        <main id="main-content" className="main-content">
          <div className="eyebrow">React component library</div>
          <h1 className="govuk-heading-xl">Quick Review</h1>
          <p className="govuk-body-l intro">
            Review every component in one place. Examples are interactive and use the
            same source as the individual documentation pages.
          </p>
          <div className="release-note">
            <Tag color="blue">Baseline</Tag>
            <span>Locked to GOV.UK Frontend 6.5.0</span>
            <span className="release-note__count">{componentDocs.length} components covered</span>
          </div>

          <section className="component-index" aria-labelledby="index-title">
            <p className="section-kicker">Jump to a component</p>
            <h2 className="govuk-heading-l" id="index-title">Component index</h2>
            <ul>
              {filteredComponents.map((component) => (
                <li key={component.slug}><a href={`#${component.slug}`}>{component.name}</a></li>
              ))}
            </ul>
          </section>

          <section className="review-gallery" aria-labelledby="review-gallery-title">
            <div className="review-gallery__heading">
              <div>
                <p className="section-kicker">Live examples</p>
                <h2 className="govuk-heading-l" id="review-gallery-title">All components</h2>
              </div>
              <span aria-live="polite">{filteredComponents.length} shown</span>
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
                        {component.status === 'trial' && <Tag color="blue">Trial</Tag>}
                      </div>
                      <p className="govuk-body">{component.summary}</p>
                    </div>
                    <div className={`review-card__example example-canvas ${component.wide ? 'example-canvas--wide' : ''}`.trim()}>
                      {component.example()}
                    </div>
                    <div className="review-card__footer">
                      <Link className="govuk-link" to={`/components/${component.slug}/`}>
                        View documentation
                      </Link>
                      <a className="govuk-link review-card__top-link" href="#top">Back to top</a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="review-empty" role="status">
                <h3 className="govuk-heading-m">No components found</h3>
                <p className="govuk-body">Try a different component name or description.</p>
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
