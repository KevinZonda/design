import { useId, useState, type ReactNode } from 'react'
import { ClickTarget, type IClickBehaviour } from '@kvzd-design/gov-uk'

interface SidebarItemBase {
  key: string
  label: ReactNode
  children?: SidebarItem[]
}

export interface SidebarLinkItem extends SidebarItemBase, IClickBehaviour {}

export interface SidebarGroupItem extends SidebarItemBase {
  href?: never
  onClick?: never
}

export type SidebarItem = SidebarLinkItem | SidebarGroupItem

export interface SidebarProps {
  heading: ReactNode
  items: SidebarItem[]
  currentKey?: string
  collapsible?: boolean
  className?: string
  renderLink?: (item: SidebarLinkItem, options: { className: string; current: boolean }) => ReactNode
}

function containsKey(items: SidebarItem[], key: string | undefined): boolean {
  return key !== undefined && items.some((item) => item.key === key || containsKey(item.children ?? [], key))
}

function SidebarNode({ item, currentKey, collapsible, depth, renderLink }: {
  item: SidebarItem
  currentKey?: string
  collapsible: boolean
  depth: number
  renderLink?: SidebarProps['renderLink']
}) {
  const childrenId = useId()
  const hasChildren = Boolean(item.children?.length)
  const current = item.key === currentKey
  const currentInChildren = containsKey(item.children ?? [], currentKey)
  const [expansion, setExpansion] = useState({ currentKey, currentInChildren, expanded: currentInChildren })
  const expanded = !collapsible || (expansion.currentKey === currentKey && expansion.currentInChildren === currentInChildren
    ? expansion.expanded
    : currentInChildren)
  const toggle = () => setExpansion({ currentKey, currentInChildren, expanded: !expanded })

  const linkClassName = 'kvzd-sidebar__link govuk-link govuk-link--no-visited-state govuk-link--no-underline'
  const toggleLabel = typeof item.label === 'string' ? item.label : 'section'

  return <li className={`kvzd-sidebar__item ${depth === 0 && (current || currentInChildren) ? 'kvzd-sidebar__item--highlighted' : ''}`.trim()}>
    <div className="kvzd-sidebar__row">
      {item.href !== undefined || item.onClick !== undefined
        ? (renderLink
          ? renderLink(item as SidebarLinkItem, { className: linkClassName, current })
          : <ClickTarget className={linkClassName} href={item.href} onClick={item.onClick} anchorProps={{ 'aria-current': current ? 'page' : undefined }}>{item.label}</ClickTarget>)
        : hasChildren && collapsible
          ? <button className="kvzd-sidebar__group" type="button" aria-expanded={expanded} aria-controls={childrenId} onClick={toggle}>{item.label}<span className="kvzd-sidebar__chevron" aria-hidden="true" /></button>
          : <span className="kvzd-sidebar__group-label">{item.label}</span>}
      {collapsible && hasChildren && (item.href !== undefined || item.onClick !== undefined) && <button
        className="kvzd-sidebar__toggle"
        type="button"
        aria-label={`${expanded ? 'Collapse' : 'Expand'} ${toggleLabel}`}
        aria-expanded={expanded}
        aria-controls={childrenId}
        onClick={toggle}
      />}
    </div>
    {hasChildren && <ul className="kvzd-sidebar__list kvzd-sidebar__list--nested" id={childrenId} hidden={!expanded}>
      {item.children?.map((child) => <SidebarNode key={child.key} item={child} currentKey={currentKey} collapsible={collapsible} depth={depth + 1} renderLink={renderLink} />)}
    </ul>}
  </li>
}

export function Sidebar({ heading, items, currentKey, collapsible = false, className = '', renderLink }: SidebarProps) {
  const headingId = useId()

  return <nav className={`kvzd-sidebar ${className}`.trim()} aria-labelledby={headingId}>
    <h2 className="govuk-heading-s kvzd-sidebar__heading" id={headingId}>{heading}</h2>
    <ul className="kvzd-sidebar__list">
      {items.map((item) => <SidebarNode key={item.key} item={item} currentKey={currentKey} collapsible={collapsible} depth={0} renderLink={renderLink} />)}
    </ul>
  </nav>
}
