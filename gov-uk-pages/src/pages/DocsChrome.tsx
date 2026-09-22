import { useMemo, useState, type MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Footer, HeaderGovUk, SearchInput, ServiceNavigation, SkipLink } from '@kvzd-design/gov-uk'
import { TagBox } from '@kvzd-design/gov-uk-extends'
import { componentDocs } from './componentRegistry'
import { sitePath } from './sitePath'
import './DocsChrome.css'

function DocsSearch() {
  const navigate = useNavigate()
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
    if (result) navigate(`/components/${result.slug}/`)
  }

  return <form className="site-search" role="search" onSubmit={(event) => { event.preventDefault(); goToResult() }} onFocus={() => setOpen(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false) }}>
    <SearchInput id="site-search" label="Search GOV.UK React components" visuallyHiddenLabel placeholder="Search GOV.UK React" autoComplete="off" value={query} role="combobox" aria-autocomplete="list" aria-expanded={showResults} aria-controls="site-search-results" aria-activedescendant={showResults && matches[activeIndex] ? `site-search-result-${matches[activeIndex].slug}` : undefined} onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); setOpen(true) }} onKeyDown={(event) => {
      if (event.key === 'Escape') { setOpen(false); return }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
      event.preventDefault()
      if (!matches.length) return
      const offset = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => (index + offset + matches.length) % matches.length)
      setOpen(true)
    }} />
    {showResults && <div className="site-search__results" id="site-search-results" role="listbox">
      {matches.length > 0 ? matches.map((component, index) => <Link id={`site-search-result-${component.slug}`} role="option" aria-selected={index === activeIndex} className={index === activeIndex ? 'is-active' : undefined} to={`/components/${component.slug}/`} key={component.slug} onMouseEnter={() => setActiveIndex(index)}><strong>{component.name}</strong><span>{component.summary}</span></Link>) : <p>No components found</p>}
    </div>}
  </form>
}

export function DocsHeader({ current = 'components' }: { current?: 'components' | 'extra-components' | 'quick-review' }) {
  const navigate = useNavigate()
  const navigateOnClick = (path: string) => (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(path)
  }

  return <>
    <SkipLink href="#main-content" />
    <HeaderGovUk
      className="docs-header"
      containerClassName="site-width docs-header__container"
      homepageUrl={sitePath('/components/')}
      logo={<span className="docs-brand-mark">KVZD Design</span>}
      productName="GOV.UK React"
    >
      <DocsSearch />
    </HeaderGovUk>
    <ServiceNavigation
      className="docs-service-navigation"
      containerClassName="site-width"
      navigationLabel="Documentation"
      items={[
        { label: 'Components', href: sitePath('/components/'), onClick: navigateOnClick('/components/'), current: current === 'components' },
        { label: 'Extra Components', href: sitePath('/extra-components/'), onClick: navigateOnClick('/extra-components/'), current: current === 'extra-components' },
        { label: 'Quick Review', href: sitePath('/quick-review/'), onClick: navigateOnClick('/quick-review/'), current: current === 'quick-review' },
        { label: 'Source', href: 'https://github.com/alphagov/govuk-frontend' },
      ]}
      end={<TagBox className="version-chip">6.5.1</TagBox>}
      endAlign="inline"
    />
  </>
}

export function DocsFooter() {
  return <Footer containerClassName="site-width" meta={[{ label: 'KVZD Design', href: sitePath('/components/') }]} description="React components based on GOV.UK Frontend 6.5.1" />
}
