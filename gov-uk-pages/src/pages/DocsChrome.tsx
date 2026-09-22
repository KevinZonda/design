import { useMemo, useState, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Footer, HeaderGovUk, LanguageNavigation, SearchInput, ServiceNavigation, SkipLink } from '@kvzd-design/gov-uk'
import { TagBox } from '@kvzd-design/gov-uk-extends'
import { componentDocs } from './componentRegistry'
import { extraComponentDocs } from './extraComponentRegistry'
import { localizedPath, message, pathInLocale, useLocale } from './i18n'
import { localizedComponent, localizedExtraComponent } from './zhDocs'
import { sitePath } from './sitePath'
import './DocsChrome.css'

const searchItems = [
  ...componentDocs.map((component) => ({ ...component, zhSummary: localizedComponent(component, 'zh').summary, path: `/components/${component.slug}/`, resultId: `component-${component.slug}` })),
  ...extraComponentDocs.map((component) => ({ ...component, zhSummary: localizedExtraComponent(component, 'zh').summary, path: `/extra-components/${component.slug}/`, resultId: `extra-component-${component.slug}` })),
]

function DocsSearch() {
  const locale = useLocale()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return []
    return searchItems.filter((component) => `${component.name} ${locale === 'zh' ? component.zhSummary : component.summary}`.toLowerCase().includes(needle)).slice(0, 8)
  }, [query, locale])
  const showResults = open && query.trim().length > 0
  const goToResult = (index = activeIndex) => {
    const result = matches[index] ?? matches[0]
    if (result) navigate(localizedPath(result.path, locale))
  }

  return <form className="site-search" role="search" onSubmit={(event) => { event.preventDefault(); goToResult() }} onFocus={() => setOpen(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false) }}>
    <SearchInput id="site-search" label={message(locale, 'search')} visuallyHiddenLabel placeholder={message(locale, 'search')} autoComplete="off" value={query} role="combobox" aria-autocomplete="list" aria-expanded={showResults} aria-controls="site-search-results" aria-activedescendant={showResults && matches[activeIndex] ? `site-search-result-${matches[activeIndex].resultId}` : undefined} onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); setOpen(true) }} onKeyDown={(event) => {
      if (event.key === 'Escape') { setOpen(false); return }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
      event.preventDefault()
      if (!matches.length) return
      const offset = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => (index + offset + matches.length) % matches.length)
      setOpen(true)
    }} />
    {showResults && <div className="site-search__results" id="site-search-results" role="listbox">
      {matches.length > 0 ? matches.map((component, index) => <Link id={`site-search-result-${component.resultId}`} role="option" aria-selected={index === activeIndex} className={index === activeIndex ? 'is-active' : undefined} to={localizedPath(component.path, locale)} key={component.resultId} onMouseEnter={() => setActiveIndex(index)}><strong>{component.name}</strong><span>{locale === 'zh' ? component.zhSummary : component.summary}</span></Link>) : <p>{message(locale, 'noComponents')}</p>}
    </div>}
  </form>
}

export function DocsHeader({ current = 'components' }: { current?: 'components' | 'extra-components' | 'quick-review' | 'license' }) {
  const locale = useLocale()
  const location = useLocation()
  const navigate = useNavigate()
  const navigateOnClick = (path: string) => (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(path)
  }

  return <>
    <SkipLink href="#main-content">{message(locale, 'skipToContent')}</SkipLink>
    <HeaderGovUk
      className="docs-header"
      containerClassName="site-width docs-header__container"
      homepageUrl={sitePath(localizedPath('/', locale))}
      logo={<span className="docs-brand-mark">{message(locale, 'brand')}</span>}
      productName={<TagBox className="docs-brand-tag">{message(locale, 'basedOn')}</TagBox>}
    >
      <DocsSearch />
    </HeaderGovUk>
    <ServiceNavigation
      className="docs-service-navigation"
      containerClassName="site-width"
      navigationLabel={message(locale, 'documentation')}
      menuLabel={message(locale, 'menu')}
      serviceLabel={message(locale, 'serviceInformation')}
      items={[
        { label: message(locale, 'quickReview'), href: sitePath(localizedPath('/quick-review/', locale)), onClick: navigateOnClick(localizedPath('/quick-review/', locale)), current: current === 'quick-review' },
        { label: message(locale, 'components'), href: sitePath(localizedPath('/components/', locale)), onClick: navigateOnClick(localizedPath('/components/', locale)), current: current === 'components' },
        { label: message(locale, 'extraComponents'), href: sitePath(localizedPath('/extra-components/', locale)), onClick: navigateOnClick(localizedPath('/extra-components/', locale)), current: current === 'extra-components' },
        { label: message(locale, 'source'), href: 'https://github.com/alphagov/govuk-frontend' },
        { label: message(locale, 'govukLicense'), href: sitePath(localizedPath('/license/', locale)), onClick: navigateOnClick(localizedPath('/license/', locale)), current: current === 'license' },
      ]}
      end={<div className="docs-nav-end">
        <LanguageNavigation ariaLabel={message(locale, 'chooseLanguage')} items={(['en', 'zh'] as const).map((language) => {
          const path = `${pathInLocale(location.pathname, language)}${location.search}${location.hash}`
          return { label: language === 'zh' ? '中文' : 'English', lang: language === 'zh' ? 'zh-CN' : 'en', href: sitePath(path), onClick: navigateOnClick(path), current: locale === language }
        })} />
        <TagBox className="version-chip">6.5.1</TagBox>
      </div>}
      endAlign="inline"
    />
  </>
}

export function DocsFooter() {
  const locale = useLocale()
  return <Footer containerClassName="site-width" meta={[{ label: message(locale, 'brand'), href: sitePath(localizedPath('/', locale)) }]} description={message(locale, 'footerDescription')} />
}
