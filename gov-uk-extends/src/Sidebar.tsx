import { useId, type ReactNode } from 'react'

export interface SidebarItem {
  key: string
  label: ReactNode
  href: string
}

export interface SidebarProps {
  heading: ReactNode
  items: SidebarItem[]
  currentKey?: string
  children?: ReactNode
  className?: string
  renderLink?: (item: SidebarItem, options: { className: string; current: boolean }) => ReactNode
}

export function Sidebar({ heading, items, currentKey, children, className = '', renderLink }: SidebarProps) {
  const headingId = useId()

  return <nav className={`kvzd-sidebar ${className}`.trim()} aria-labelledby={headingId}>
    <h2 className="govuk-heading-s kvzd-sidebar__heading" id={headingId}>{heading}</h2>
    {children}
    <ul className="kvzd-sidebar__list">
      {items.map((item) => {
        const current = item.key === currentKey
        const linkClassName = 'kvzd-sidebar__link govuk-link'
        return <li className={`kvzd-sidebar__item ${current ? 'kvzd-sidebar__item--current' : ''}`.trim()} key={item.key}>
          {renderLink
            ? renderLink(item, { className: linkClassName, current })
            : <a className={linkClassName} href={item.href} aria-current={current ? 'page' : undefined}>{item.label}</a>}
        </li>
      })}
    </ul>
  </nav>
}
