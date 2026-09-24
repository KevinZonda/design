import { forwardRef, useId, useState, type CSSProperties, type HTMLAttributes, type MouseEvent, type ReactNode, type Ref } from 'react'
import { ClickTarget, type IClickBehaviour } from './clickBehaviour'
import type { SemanticStyling } from './styling'

export interface LinkItem extends IClickBehaviour { label: ReactNode; current?: boolean }
export interface BreadcrumbItem extends IClickBehaviour { label: ReactNode; current?: boolean }

export const SkipLink = forwardRef<HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement, IClickBehaviour & { children?: ReactNode; style?: CSSProperties }>(function SkipLink({ href, onClick, children = 'Skip to main content', style }, ref) {
  return <ClickTarget ref={ref} className="govuk-skip-link" style={style} href={href ?? (onClick ? undefined : '#main-content')} onClick={onClick}>{children}</ClickTarget>
})

export const BackLink = forwardRef<HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement, IClickBehaviour & { children?: ReactNode; style?: CSSProperties }>(function BackLink({ href, onClick, children = 'Back', style }, ref) {
  return <ClickTarget ref={ref} href={href} onClick={onClick} className="govuk-back-link" style={style}>{children}</ClickTarget>
})

export interface BreadcrumbsProps { items: BreadcrumbItem[]; collapseOnMobile?: boolean; className?: string; label?: string; style?: CSSProperties }
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs({ items, collapseOnMobile = false, className = '', label = 'Breadcrumb', style }, ref) {
  return <nav ref={ref} className={`govuk-breadcrumbs ${collapseOnMobile ? 'govuk-breadcrumbs--collapse-on-mobile' : ''} ${className}`.trim()} style={style} aria-label={label}>
    <ol className="govuk-breadcrumbs__list">
      {items.map((item, index) => {
        const current = item.current || (item.href === undefined && !item.onClick)
        return <li className="govuk-breadcrumbs__list-item" aria-current={current ? 'page' : undefined} key={`${item.href ?? 'current'}-${index}`}>
          {!current && (item.href !== undefined || item.onClick) ? <ClickTarget className="govuk-breadcrumbs__link" href={item.href} onClick={item.onClick}>{item.label}</ClickTarget> : item.label}
        </li>
      })}
    </ol>
  </nav>
})

export interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'>, SemanticStyling<'root' | 'container' | 'logo' | 'homeLink'> {
  title: ReactNode
  homeHref?: string
  homeOnClick?: IClickBehaviour['onClick']
  logo?: ReactNode
  containerClassName?: string
  fullWidth?: boolean
}

export const Header = forwardRef<HTMLElement, HeaderProps>(function Header({ title, homeHref, homeOnClick, logo, children, fullWidth = false, className = '', classNames, containerClassName = '', style, styles, ...props }, ref) {
  const base = 'govuk-generic-header'
  return <header {...props} ref={ref} className={`${base} ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
    <div className={`${base}__container ${fullWidth ? `${base}__container--full-width` : 'govuk-width-container'} ${classNames?.container ?? ''} ${containerClassName}`.trim()} style={styles?.container}>
      <div className={`${base}__logo ${classNames?.logo ?? ''}`.trim()} style={styles?.logo}>
        <ClickTarget className={`${base}__homepage-link ${classNames?.homeLink ?? ''}`.trim()} style={styles?.homeLink} href={homeHref ?? (homeOnClick ? undefined : '/')} onClick={homeOnClick}>
          {logo && <span className="kvzd-generic-header__logo-mark">{logo}</span>}{title}
        </ClickTarget>
      </div>
      {children}
    </div>
  </header>
})

export interface ServiceNavigationProps extends SemanticStyling<'root' | 'container'> {
  serviceName?: ReactNode
  serviceUrl?: string
  serviceOnClick?: IClickBehaviour['onClick']
  items?: LinkItem[]
  end?: ReactNode
  endAlign?: 'block' | 'inline'
  className?: string
  style?: CSSProperties
  containerClassName?: string
  navigationLabel?: string
  menuLabel?: string
  serviceLabel?: string
  collapseNavigationOnMobile?: boolean
  menuOpen?: boolean
  onMenuToggle?: (open: boolean) => void
}
export const ServiceNavigation = forwardRef<HTMLElement, ServiceNavigationProps>(function ServiceNavigation({ serviceName, serviceUrl, serviceOnClick, items = [], end, endAlign = 'block', className = '', classNames, style, styles, containerClassName = 'govuk-width-container', navigationLabel = 'Menu', menuLabel = 'Menu', serviceLabel = 'Service information', collapseNavigationOnMobile = items.length > 1, menuOpen, onMenuToggle }, ref) {
  const [innerOpen, setInnerOpen] = useState(false)
  const open = menuOpen ?? innerOpen
  const toggle = () => { const next = !open; if (menuOpen === undefined) setInnerOpen(next); onMenuToggle?.(next) }
  const navigationId = `service-navigation-${useId().replaceAll(':', '')}`
  const inner = <div className={`${containerClassName} ${end && endAlign === 'inline' ? 'govuk-service-navigation__inlining-container' : ''} ${classNames?.container ?? ''}`.trim()} style={styles?.container}>
    <div className="govuk-service-navigation__container">
      {serviceName && <span className="govuk-service-navigation__service-name">{serviceUrl !== undefined || serviceOnClick ? <ClickTarget href={serviceUrl} onClick={serviceOnClick} className="govuk-service-navigation__link">{serviceName}</ClickTarget> : <span className="govuk-service-navigation__text">{serviceName}</span>}</span>}
      {items.length > 0 && <nav aria-label={navigationLabel} className="govuk-service-navigation__wrapper">
        {collapseNavigationOnMobile && <button type="button" className="govuk-service-navigation__toggle kvzd-service-navigation__toggle" aria-controls={navigationId} aria-expanded={open} onClick={toggle}>{menuLabel}</button>}
        <ul className={`govuk-service-navigation__list ${collapseNavigationOnMobile && !open ? 'kvzd-service-navigation__list--closed' : ''}`} id={navigationId}>{items.map((item, index) => <li className={`govuk-service-navigation__item ${item.current ? 'govuk-service-navigation__item--active' : ''}`} key={item.href ?? index}><ClickTarget className="govuk-service-navigation__link" href={item.href} onClick={item.onClick} anchorProps={{ 'aria-current': item.current ? 'page' : undefined }}>{item.current ? <strong className="govuk-service-navigation__active-fallback">{item.label}</strong> : item.label}</ClickTarget></li>)}</ul>
      </nav>}
    </div>
    {end}
  </div>
  const rootClass = `govuk-service-navigation ${classNames?.root ?? ''} ${className}`.trim()
  return serviceName || end
    ? <section ref={ref} aria-label={serviceLabel} className={rootClass} style={{ ...styles?.root, ...style }}>{inner}</section>
    : <div ref={ref as Ref<HTMLDivElement>} className={rootClass} style={{ ...styles?.root, ...style }}>{inner}</div>
})

export const LanguageNavigation = forwardRef<HTMLElement, { items: (LinkItem & { lang?: string })[]; ariaLabel?: string; style?: CSSProperties }>(function LanguageNavigation({ items, ariaLabel = 'Choose language', style }, ref) {
  return <nav ref={ref} className="govuk-language-navigation" style={style} aria-label={ariaLabel}><ul className="govuk-language-navigation__list">{items.map((item, index) => {
    const current = item.current || (item.href === undefined && !item.onClick)
    return <li className="govuk-language-navigation__list-item" key={item.href ?? index}>
      {current
        ? <span className="govuk-language-navigation__text" aria-current="true" lang={item.lang}>{item.label}</span>
        : <ClickTarget className="govuk-language-navigation__link" href={item.href} onClick={item.onClick} anchorProps={{ hrefLang: item.lang, lang: item.lang, rel: 'alternate' }}>{item.label}</ClickTarget>}
    </li>
  })}</ul></nav>
})

export interface PaginationLink extends IClickBehaviour { label?: ReactNode; text?: ReactNode }
export interface PaginationProps {
  current?: number
  total?: number
  onChange?: (page: number) => void
  getHref?: (page: number) => string
  previous?: PaginationLink
  next?: PaginationLink
  className?: string
  style?: CSSProperties
  label?: string
}
function PaginationArrow({ direction }: { direction: 'prev' | 'next' }) {
  return <svg className={`govuk-pagination__icon govuk-pagination__icon--${direction}`} xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13"><path d={direction === 'prev' ? 'm6.5938-.0078-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2H3.7147l4.2931-4.293-1.414-1.414z' : 'm8.107-.0078-1.4136 1.414 4.2926 4.293H-2v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062L8.107-.0078z'} /></svg>
}
function PaginationBlockLink({ direction, link }: { direction: 'prev' | 'next'; link: PaginationLink }) {
  const title = link.text ?? (direction === 'prev' ? 'Previous' : 'Next')
  return <div className={`govuk-pagination__${direction}`}><ClickTarget className="govuk-link govuk-pagination__link" href={link.href} onClick={link.onClick} anchorProps={{ rel: direction }}>{direction === 'prev' && <PaginationArrow direction="prev" />}<span className={`govuk-pagination__link-title ${link.label ? '' : 'govuk-pagination__link-title--decorated'}`.trim()}>{title}</span>{link.label && <><span className="govuk-visually-hidden">:</span><span className="govuk-pagination__link-label">{link.label}</span></>}{direction === 'next' && <PaginationArrow direction="next" />}</ClickTarget></div>
}
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination({ current, total, onChange, getHref = (page) => `#page-${page}`, previous, next, className = '', label = 'Pagination', style }, ref) {
  const block = current === undefined || total === undefined
  if (block) return <nav ref={ref} className={`govuk-pagination govuk-pagination--block ${className}`.trim()} style={style} aria-label={label}>{previous && <PaginationBlockLink direction="prev" link={previous} />}{next && <PaginationBlockLink direction="next" link={next} />}</nav>
  const pages = Array.from({ length: total }, (_, index) => index + 1)
  const handlePage = (page: number) => onChange ? (event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); onChange(page) } : undefined
  return <nav ref={ref} className={`govuk-pagination ${className}`.trim()} style={style} aria-label={label}>
    {current > 1 && <div className="govuk-pagination__prev"><a className="govuk-link govuk-pagination__link" href={getHref(current - 1)} rel="prev" onClick={handlePage(current - 1)}><PaginationArrow direction="prev" /><span className="govuk-pagination__link-title">Previous<span className="govuk-visually-hidden"> page</span></span></a></div>}
    <ul className="govuk-pagination__list">{pages.map((page) => <li key={page} className={`govuk-pagination__item ${page === current ? 'govuk-pagination__item--current' : ''}`}><a className="govuk-link govuk-pagination__link" href={getHref(page)} aria-label={`Page ${page}`} aria-current={page === current ? 'page' : undefined} onClick={handlePage(page)}>{page}</a></li>)}</ul>
    {current < total && <div className="govuk-pagination__next"><a className="govuk-link govuk-pagination__link" href={getHref(current + 1)} rel="next" onClick={handlePage(current + 1)}><span className="govuk-pagination__link-title">Next<span className="govuk-visually-hidden"> page</span></span><PaginationArrow direction="next" /></a></div>}
  </nav>
})

export interface FooterProps extends SemanticStyling<'root' | 'container'> {
  meta?: LinkItem[]
  navigation?: Array<{ title: ReactNode; items: LinkItem[] }>
  description?: ReactNode
  copyright?: ReactNode
  className?: string
  style?: CSSProperties
  containerClassName?: string
}

export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer({ meta = [], navigation = [], description, copyright, className = '', classNames, style, styles, containerClassName = '' }, ref) {
  return <footer ref={ref} className={`govuk-footer ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
    <div className={`govuk-width-container ${classNames?.container ?? ''} ${containerClassName}`.trim()} style={styles?.container}>
      {navigation.length > 0 && <>
        <div className="govuk-footer__navigation">{navigation.map((section, index) => <div className="govuk-footer__section govuk-grid-column-full" key={index}>
          <h2 className="govuk-footer__heading govuk-heading-m">{section.title}</h2>
          <ul className="govuk-footer__list">{section.items.map((item, itemIndex) => <li className="govuk-footer__list-item" key={item.href ?? itemIndex}><ClickTarget className="govuk-footer__link" href={item.href} onClick={item.onClick}>{item.label}</ClickTarget></li>)}</ul>
        </div>)}</div>
        <hr className="govuk-footer__section-break" />
      </>}
      <div className="govuk-footer__meta">
        <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
          {meta.length > 0 && <ul className="govuk-footer__inline-list">{meta.map((item, index) => <li className="govuk-footer__inline-list-item" key={item.href ?? index}><ClickTarget className="govuk-footer__link" href={item.href} onClick={item.onClick}>{item.label}</ClickTarget></li>)}</ul>}
          {description && <span className="govuk-footer__licence-description">{description}</span>}
        </div>
        {copyright && <div className="govuk-footer__meta-item"><span>{copyright}</span></div>}
      </div>
    </div>
  </footer>
})
