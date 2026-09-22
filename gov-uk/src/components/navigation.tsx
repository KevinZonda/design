import { useId, useState, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { ClickTarget, type IClickBehaviour } from './clickBehaviour'

export interface LinkItem extends IClickBehaviour { label: ReactNode; current?: boolean }
export interface BreadcrumbItem extends IClickBehaviour { label: ReactNode; current?: boolean }

export function SkipLink({ href, onClick, children = 'Skip to main content' }: IClickBehaviour & { children?: ReactNode }) {
  return <ClickTarget className="govuk-skip-link" href={href ?? (onClick ? undefined : '#main-content')} onClick={onClick}>{children}</ClickTarget>
}

export function BackLink({ href, onClick, children = 'Back' }: IClickBehaviour & { children?: ReactNode }) {
  return <ClickTarget href={href} onClick={onClick} className="govuk-back-link">{children}</ClickTarget>
}

export interface BreadcrumbsProps { items: BreadcrumbItem[]; collapseOnMobile?: boolean; className?: string; label?: string }
export function Breadcrumbs({ items, collapseOnMobile = false, className = '', label = 'Breadcrumb' }: BreadcrumbsProps) {
  return <nav className={`govuk-breadcrumbs ${collapseOnMobile ? 'govuk-breadcrumbs--collapse-on-mobile' : ''} ${className}`.trim()} aria-label={label}>
    <ol className="govuk-breadcrumbs__list">
      {items.map((item, index) => {
        const current = item.current || (item.href === undefined && !item.onClick)
        return <li className="govuk-breadcrumbs__list-item" aria-current={current ? 'page' : undefined} key={`${item.href ?? 'current'}-${index}`}>
          {!current && (item.href !== undefined || item.onClick) ? <ClickTarget className="govuk-breadcrumbs__link" href={item.href} onClick={item.onClick}>{item.label}</ClickTarget> : item.label}
        </li>
      })}
    </ol>
  </nav>
}

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  homepageUrl?: string
  homepageOnClick?: IClickBehaviour['onClick']
  productName?: ReactNode
  logo?: ReactNode
  containerClassName?: string
  fullWidth?: boolean
}

function GovUkLogo() {
  return <svg focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 324 60" height="30" width="162" fill="currentColor" className="govuk-header__logotype" aria-label="GOV.UK">
    <title>GOV.UK</title>
    <g>
      <circle cx="20" cy="17.6" r="3.7" /><circle cx="10.2" cy="23.5" r="3.7" /><circle cx="3.7" cy="33.2" r="3.7" /><circle cx="31.7" cy="30.6" r="3.7" /><circle cx="43.3" cy="17.6" r="3.7" /><circle cx="53.2" cy="23.5" r="3.7" /><circle cx="59.7" cy="33.2" r="3.7" />
      <path d="M33.1,9.8c.2-.1.3-.3.5-.5l4.6,2.4v-6.8l-4.6,1.5c-.1-.2-.3-.3-.5-.5l1.9-5.9h-6.7l1.9,5.9c-.2.1-.3.3-.5.5l-4.6-1.5v6.8l4.6-2.4c.1.2.3.3.5.5l-2.6,8c-.9,2.8,1.2,5.7,4.1,5.7h0c3,0,5.1-2.9,4.1-5.7l-2.6-8ZM37,37.9s-3.4,3.8-4.1,6.1c2.2,0,4.2-.5,6.4-2.8l-.7,8.5c-2-2.8-4.4-4.1-5.7-3.8.1,3.1.5,6.7,5.8,7.2,3.7.3,6.7-1.5,7-3.8.4-2.6-2-4.3-3.7-1.6-1.4-4.5,2.4-6.1,4.9-3.2-1.9-4.5-1.8-7.7,2.4-10.9,3,4,2.6,7.3-1.2,11.1,2.4-1.3,6.2,0,4,4.6-1.2-2.8-3.7-2.2-4.2.2-.3,1.7.7,3.7,3,4.2,1.9.3,4.7-.9,7-5.9-1.3,0-2.4.7-3.9,1.7l2.4-8c.6,2.3,1.4,3.7,2.2,4.5.6-1.6.5-2.8,0-5.3l5,1.8c-2.6,3.6-5.2,8.7-7.3,17.5-7.4-1.1-15.7-1.7-24.5-1.7h0c-8.8,0-17.1.6-24.5,1.7-2.1-8.9-4.7-13.9-7.3-17.5l5-1.8c-.5,2.5-.6,3.7,0,5.3.8-.8,1.6-2.3,2.2-4.5l2.4,8c-1.5-1-2.6-1.7-3.9-1.7,2.3,5,5.2,6.2,7,5.9,2.3-.4,3.3-2.4,3-4.2-.5-2.4-3-3.1-4.2-.2-2.2-4.6,1.6-6,4-4.6-3.7-3.7-4.2-7.1-1.2-11.1,4.2,3.2,4.3,6.4,2.4,10.9,2.5-2.8,6.3-1.3,4.9,3.2-1.8-2.7-4.1-1-3.7,1.6.3,2.3,3.3,4.1,7,3.8,5.4-.5,5.7-4.2,5.8-7.2-1.3-.2-3.7,1-5.7,3.8l-.7-8.5c2.2,2.3,4.2,2.7,6.4,2.8-.7-2.3-4.1-6.1-4.1-6.1h10.6,0Z" />
    </g>
    <circle className="govuk-logo-dot" cx="226" cy="36" r="7.3" />
    <path d="M93.94 41.25c.4 1.81 1.2 3.21 2.21 4.62 1 1.4 2.21 2.41 3.61 3.21s3.21 1.2 5.22 1.2 3.61-.4 4.82-1c1.4-.6 2.41-1.4 3.21-2.41.8-1 1.4-2.01 1.61-3.01s.4-2.01.4-3.01v.14h-10.86v-7.02h20.07v24.08h-8.03v-5.56c-.6.8-1.38 1.61-2.19 2.41-.8.8-1.81 1.2-2.81 1.81-1 .4-2.21.8-3.41 1.2s-2.41.4-3.81.4a18.56 18.56 0 0 1-14.65-6.63c-1.6-2.01-3.01-4.41-3.81-7.02s-1.4-5.62-1.4-8.83.4-6.02 1.4-8.83a20.45 20.45 0 0 1 19.46-13.65c3.21 0 4.01.2 5.82.8 1.81.4 3.61 1.2 5.02 2.01 1.61.8 2.81 2.01 4.01 3.21s2.21 2.61 2.81 4.21l-7.63 4.41c-.4-1-1-1.81-1.61-2.61-.6-.8-1.4-1.4-2.21-2.01-.8-.6-1.81-1-2.81-1.4-1-.4-2.21-.4-3.61-.4-2.01 0-3.81.4-5.22 1.2-1.4.8-2.61 1.81-3.61 3.21s-1.61 2.81-2.21 4.62c-.4 1.81-.6 3.71-.6 5.42s.8 5.22.8 5.22Zm57.8-27.9c3.21 0 6.22.6 8.63 1.81 2.41 1.2 4.82 2.81 6.62 4.82S170.2 24.39 171 27s1.4 5.62 1.4 8.83-.4 6.02-1.4 8.83-2.41 5.02-4.01 7.02-4.01 3.61-6.62 4.82-5.42 1.81-8.63 1.81-6.22-.6-8.63-1.81-4.82-2.81-6.42-4.82-3.21-4.41-4.01-7.02-1.4-5.62-1.4-8.83.4-6.02 1.4-8.83 2.41-5.02 4.01-7.02 4.01-3.61 6.42-4.82 5.42-1.81 8.63-1.81Zm0 36.73c1.81 0 3.61-.4 5.02-1s2.61-1.81 3.61-3.01 1.81-2.81 2.21-4.41c.4-1.81.8-3.61.8-5.62 0-2.21-.2-4.21-.8-6.02s-1.2-3.21-2.21-4.62c-1-1.2-2.21-2.21-3.61-3.01s-3.21-1-5.02-1-3.61.4-5.02 1c-1.4.8-2.61 1.81-3.61 3.01s-1.81 2.81-2.21 4.62c-.4 1.81-.8 3.61-.8 5.62 0 2.41.2 4.21.8 6.02.4 1.81 1.2 3.21 2.21 4.41s2.21 2.21 3.61 3.01c1.4.8 3.21 1 5.02 1Zm36.32 7.96-12.24-44.15h9.83l8.43 32.77h.4l8.23-32.77h9.83L200.3 58.04h-12.24Zm74.14-7.96c2.18 0 3.51-.6 3.51-.6 1.2-.6 2.01-1 2.81-1.81s1.4-1.81 1.81-2.81a13 13 0 0 0 .8-4.01V13.9h8.63v28.15c0 2.41-.4 4.62-1.4 6.62-.8 2.01-2.21 3.61-3.61 5.02s-3.41 2.41-5.62 3.21-4.62 1.2-7.02 1.2-5.02-.4-7.02-1.2c-2.21-.8-4.01-1.81-5.62-3.21s-2.81-3.01-3.61-5.02-1.4-4.21-1.4-6.62V13.9h8.63v26.95c0 1.61.2 3.01.8 4.01.4 1.2 1.2 2.21 2.01 2.81.8.8 1.81 1.4 2.81 1.81 0 0 1.34.6 3.51.6Zm34.22-36.18v18.92l15.65-18.92h10.82l-15.03 17.32 16.03 26.83h-10.21l-11.44-20.21-5.62 6.22v13.99h-8.83V13.9" />
  </svg>
}

export function Header({ children, className = '', containerClassName = '', homepageUrl, homepageOnClick, logo, productName, fullWidth = false, ...props }: HeaderProps) {
  return <header {...props} className={`govuk-header ${className}`.trim()} data-module="govuk-header">
    <div className={`govuk-header__container ${fullWidth ? 'govuk-header__container--full-width' : 'govuk-width-container'} ${containerClassName}`.trim()}>
      <div className="govuk-header__logo">
        <ClickTarget href={homepageUrl ?? (homepageOnClick ? undefined : '//gov.uk')} onClick={homepageOnClick} className="govuk-header__homepage-link">{logo ?? <GovUkLogo />}{productName && <span className="govuk-header__product-name">{productName}</span>}</ClickTarget>
      </div>
      {children}
    </div>
  </header>
}

export interface GenericHeaderProps { title: ReactNode; homeHref?: string; homeOnClick?: IClickBehaviour['onClick']; logo?: ReactNode; fullWidth?: boolean; className?: string }
export function GenericHeader({ title, homeHref, homeOnClick, logo, fullWidth = false, className = '' }: GenericHeaderProps) {
  return <div className={`govuk-generic-header ${className}`.trim()}>
    <div className={`govuk-generic-header__container ${fullWidth ? 'govuk-generic-header__container--full-width' : 'govuk-width-container'}`}>
      <div className="govuk-generic-header__logo">
        <ClickTarget className="govuk-generic-header__homepage-link" href={homeHref ?? (homeOnClick ? undefined : '/')} onClick={homeOnClick}>
          {logo && <span className="kvzd-generic-header__logo-mark">{logo}</span>}{title}
        </ClickTarget>
      </div>
    </div>
  </div>
}

export interface ServiceNavigationProps {
  serviceName?: ReactNode
  serviceUrl?: string
  serviceOnClick?: IClickBehaviour['onClick']
  items?: LinkItem[]
  end?: ReactNode
  endAlign?: 'block' | 'inline'
  className?: string
  containerClassName?: string
  navigationLabel?: string
  collapseNavigationOnMobile?: boolean
}
export function ServiceNavigation({ serviceName, serviceUrl, serviceOnClick, items = [], end, endAlign = 'block', className = '', containerClassName = 'govuk-width-container', navigationLabel = 'Menu', collapseNavigationOnMobile = items.length > 1 }: ServiceNavigationProps) {
  const [open, setOpen] = useState(false)
  const navigationId = `service-navigation-${useId().replaceAll(':', '')}`
  const inner = <div className={`${containerClassName} ${end && endAlign === 'inline' ? 'govuk-service-navigation__inlining-container' : ''}`.trim()}>
    <div className="govuk-service-navigation__container">
      {serviceName && <span className="govuk-service-navigation__service-name">{serviceUrl !== undefined || serviceOnClick ? <ClickTarget href={serviceUrl} onClick={serviceOnClick} className="govuk-service-navigation__link">{serviceName}</ClickTarget> : <span className="govuk-service-navigation__text">{serviceName}</span>}</span>}
      {items.length > 0 && <nav aria-label={navigationLabel} className="govuk-service-navigation__wrapper">
        {collapseNavigationOnMobile && <button type="button" className="govuk-service-navigation__toggle kvzd-service-navigation__toggle" aria-controls={navigationId} aria-expanded={open} onClick={() => setOpen((value) => !value)}>Menu</button>}
        <ul className={`govuk-service-navigation__list ${collapseNavigationOnMobile && !open ? 'kvzd-service-navigation__list--closed' : ''}`} id={navigationId}>{items.map((item, index) => <li className={`govuk-service-navigation__item ${item.current ? 'govuk-service-navigation__item--active' : ''}`} key={item.href ?? index}><ClickTarget className="govuk-service-navigation__link" href={item.href} onClick={item.onClick} anchorProps={{ 'aria-current': item.current ? 'page' : undefined }}>{item.current ? <strong className="govuk-service-navigation__active-fallback">{item.label}</strong> : item.label}</ClickTarget></li>)}</ul>
      </nav>}
    </div>
    {end}
  </div>
  const rootClass = `govuk-service-navigation ${className}`.trim()
  return serviceName || end
    ? <section aria-label="Service information" className={rootClass} data-module="govuk-service-navigation">{inner}</section>
    : <div className={rootClass} data-module="govuk-service-navigation">{inner}</div>
}

export function LanguageNavigation({ items, ariaLabel = 'Choose language' }: { items: LinkItem[]; ariaLabel?: string }) {
  return <nav className="govuk-language-navigation" aria-label={ariaLabel}><ul className="govuk-language-navigation__list">{items.map((item, index) => <li className="govuk-language-navigation__list-item" key={item.href ?? index}><ClickTarget className="govuk-language-navigation__link" href={item.href} onClick={item.onClick} anchorProps={{ hrefLang: typeof item.label === 'string' ? item.label.toLowerCase() : undefined, 'aria-current': item.current ? 'page' : undefined }}>{item.label}</ClickTarget></li>)}</ul></nav>
}

export interface PaginationLink extends IClickBehaviour { label?: ReactNode; text?: ReactNode }
export interface PaginationProps {
  current?: number
  total?: number
  onChange?: (page: number) => void
  getHref?: (page: number) => string
  previous?: PaginationLink
  next?: PaginationLink
  className?: string
  label?: string
}
function PaginationArrow({ direction }: { direction: 'prev' | 'next' }) {
  return <svg className={`govuk-pagination__icon govuk-pagination__icon--${direction}`} xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13"><path d={direction === 'prev' ? 'm6.5938-.0078-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2H3.7147l4.2931-4.293-1.414-1.414z' : 'm8.107-.0078-1.4136 1.414 4.2926 4.293H-2v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062L8.107-.0078z'} /></svg>
}
function PaginationBlockLink({ direction, link }: { direction: 'prev' | 'next'; link: PaginationLink }) {
  const title = link.text ?? (direction === 'prev' ? 'Previous' : 'Next')
  return <div className={`govuk-pagination__${direction}`}><ClickTarget className="govuk-link govuk-pagination__link" href={link.href} onClick={link.onClick} anchorProps={{ rel: direction }}>{direction === 'prev' && <PaginationArrow direction="prev" />}<span className={`govuk-pagination__link-title ${link.label ? '' : 'govuk-pagination__link-title--decorated'}`.trim()}>{title}</span>{link.label && <><span className="govuk-visually-hidden">:</span><span className="govuk-pagination__link-label">{link.label}</span></>}{direction === 'next' && <PaginationArrow direction="next" />}</ClickTarget></div>
}
export function Pagination({ current, total, onChange, getHref = (page) => `#page-${page}`, previous, next, className = '', label = 'Pagination' }: PaginationProps) {
  const block = current === undefined || total === undefined
  if (block) return <nav className={`govuk-pagination govuk-pagination--block ${className}`.trim()} aria-label={label}>{previous && <PaginationBlockLink direction="prev" link={previous} />}{next && <PaginationBlockLink direction="next" link={next} />}</nav>
  const pages = Array.from({ length: total }, (_, index) => index + 1)
  const handlePage = (page: number) => onChange ? (event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); onChange(page) } : undefined
  return <nav className={`govuk-pagination ${className}`.trim()} aria-label={label}>
    {current > 1 && <div className="govuk-pagination__prev"><a className="govuk-link govuk-pagination__link" href={getHref(current - 1)} rel="prev" onClick={handlePage(current - 1)}><PaginationArrow direction="prev" /><span className="govuk-pagination__link-title">Previous<span className="govuk-visually-hidden"> page</span></span></a></div>}
    <ul className="govuk-pagination__list">{pages.map((page) => <li key={page} className={`govuk-pagination__item ${page === current ? 'govuk-pagination__item--current' : ''}`}><a className="govuk-link govuk-pagination__link" href={getHref(page)} aria-label={`Page ${page}`} aria-current={page === current ? 'page' : undefined} onClick={handlePage(page)}>{page}</a></li>)}</ul>
    {current < total && <div className="govuk-pagination__next"><a className="govuk-link govuk-pagination__link" href={getHref(current + 1)} rel="next" onClick={handlePage(current + 1)}><span className="govuk-pagination__link-title">Next<span className="govuk-visually-hidden"> page</span></span><PaginationArrow direction="next" /></a></div>}
  </nav>
}

export interface FooterProps { meta?: LinkItem[]; navigation?: Array<{ title: ReactNode; items: LinkItem[] }> }
export function Footer({ meta = [], navigation = [] }: FooterProps) {
  return <footer className="govuk-footer"><div className="govuk-width-container">{navigation.length > 0 && <><div className="govuk-footer__navigation">{navigation.map((section, index) => <div className="govuk-footer__section govuk-grid-column-full" key={index}><h2 className="govuk-footer__heading govuk-heading-m">{section.title}</h2><ul className="govuk-footer__list">{section.items.map((item, itemIndex) => <li className="govuk-footer__list-item" key={item.href ?? itemIndex}><ClickTarget className="govuk-footer__link" href={item.href} onClick={item.onClick}>{item.label}</ClickTarget></li>)}</ul></div>)}</div><hr className="govuk-footer__section-break" /></>}<div className="govuk-footer__meta"><div className="govuk-footer__meta-item govuk-footer__meta-item--grow">{meta.length > 0 && <ul className="govuk-footer__inline-list">{meta.map((item, index) => <li className="govuk-footer__inline-list-item" key={item.href ?? index}><ClickTarget className="govuk-footer__link" href={item.href} onClick={item.onClick}>{item.label}</ClickTarget></li>)}</ul>}<span className="govuk-footer__licence-description">All content is available under the Open Government Licence v3.0, except where otherwise stated.</span></div><div className="govuk-footer__meta-item"><span>© Crown copyright</span></div></div></div></footer>
}
