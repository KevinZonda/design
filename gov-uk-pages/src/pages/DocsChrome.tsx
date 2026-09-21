import { useMemo, useState } from 'react'
import { ServiceNavigation, SkipLink } from '@kvzd-design/gov-uk'
import { componentDocs } from './componentRegistry'
import './DocsChrome.css'

function pathFor(slug: string) {
  return `/components/${slug}/`
}

function DocsSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return []
    return componentDocs.filter((component) => `${component.name} ${component.summary}`.toLowerCase().includes(needle)).slice(0, 8)
  }, [query])
  const showResults = open && query.trim().length > 0
  const goToResult = (index = activeIndex) => {
    const result = matches[index] ?? matches[0]
    if (result) window.location.assign(pathFor(result.slug))
  }

  return <form className="site-search" role="search" onSubmit={(event) => { event.preventDefault(); goToResult() }} onFocus={() => setOpen(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false) }}>
    <label className="govuk-visually-hidden" htmlFor="site-search">Search GOV.UK React components</label>
    <span className="site-search__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg></span>
    <input id="site-search" type="search" placeholder="Search GOV.UK React" autoComplete="off" value={query} role="combobox" aria-autocomplete="list" aria-expanded={showResults} aria-controls="site-search-results" aria-activedescendant={showResults && matches[activeIndex] ? `site-search-result-${matches[activeIndex].slug}` : undefined} onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); setOpen(true) }} onKeyDown={(event) => {
      if (event.key === 'Escape') { setOpen(false); return }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
      event.preventDefault()
      if (!matches.length) return
      const offset = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => (index + offset + matches.length) % matches.length)
      setOpen(true)
    }} />
    {showResults && <div className="site-search__results" id="site-search-results" role="listbox">
      {matches.length > 0 ? matches.map((component, index) => <a id={`site-search-result-${component.slug}`} role="option" aria-selected={index === activeIndex} className={index === activeIndex ? 'is-active' : undefined} href={pathFor(component.slug)} key={component.slug} onMouseEnter={() => setActiveIndex(index)}><strong>{component.name}</strong><span>{component.summary}</span></a>) : <p>No components found</p>}
    </div>}
  </form>
}

export function DocsHeader({ current = 'components' }: { current?: 'components' | 'quick-review' }) {
  return <>
    <SkipLink href="#main-content" />
    <header className="site-header">
      <div className="site-width site-header__inner">
        <a className="site-brand" href="/components/" aria-label="KVZD Design home"><span className="site-brand__crown" aria-hidden="true">◆</span><span>KVZD Design</span></a>
        <span className="site-product">GOV.UK React</span>
        <DocsSearch />
        <button className="site-menu" type="button">Menu</button>
      </div>
    </header>
    <ServiceNavigation
      className="docs-service-navigation"
      containerClassName="site-width"
      navigationLabel="Documentation"
      items={[
        { label: 'Components', href: '/components/', current: current === 'components' },
        { label: 'Quick Review', href: '/quick-review/', current: current === 'quick-review' },
        { label: 'Source', href: 'https://github.com/alphagov/govuk-frontend' },
      ]}
      end={<span className="version-chip">6.5.0</span>}
      endAlign="inline"
    />
  </>
}

export function DocsFooter() {
  return <footer className="site-footer"><div className="site-width site-footer__inner"><strong>KVZD Design</strong><span>React components based on GOV.UK Frontend 6.5.0</span></div></footer>
}
