import type { AnchorHTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from '@kevinzonda/design/components'

type AnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className' | 'href' | 'onClick'>

/** Router-flavoured wrapper around the library Link: the real href keeps navigation working, while a plain left click is upgraded to client-side navigation. */
export function DocsLink({ to, className, onClick, anchorProps, children }: { to: string; className?: string; onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>; anchorProps?: AnchorProps; children: ReactNode }) {
  const navigate = useNavigate()
  return <Link href={to} className={className} anchorProps={anchorProps} onClick={(event) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (to.startsWith('#')) navigate({ hash: to })
    else navigate(to)
  }}>{children}</Link>
}
