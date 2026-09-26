import { forwardRef } from 'react'
import type { CSSProperties, MouseEventHandler, ReactNode, Ref } from 'react'
import { ClickTarget } from './clickBehaviour'

export interface LinkProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** A destination, a click action, or both. The handler may prevent navigation. */
  href?: string
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
  /** Skip the visited link colour, for example in navigation that is not page navigation. */
  noVisitedState?: boolean
  noUnderline?: boolean
  /** Muted link colour for less emphasis. */
  muted?: boolean
  /** Use the text colour instead of the link colour. */
  textColour?: boolean
  /** Use the inverse link colours, for dark backgrounds. */
  inverse?: boolean
  /** Extra attributes forwarded to the rendered anchor, such as target or rel. */
  anchorProps?: React.ComponentProps<typeof ClickTarget>['anchorProps']
}

export const Link = forwardRef<HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement, LinkProps>(function Link({ children, className = '', style, href, onClick, noVisitedState = false, noUnderline = false, muted = false, textColour = false, inverse = false, anchorProps }, ref) {
  const classes = [
    'govuk-link',
    noVisitedState && 'govuk-link--no-visited-state',
    noUnderline && 'govuk-link--no-underline',
    muted && 'govuk-link--muted',
    textColour && 'govuk-link--text-colour',
    inverse && 'govuk-link--inverse',
    className,
  ].filter(Boolean).join(' ').trim()
  return <ClickTarget ref={ref as Ref<HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement>} href={href} onClick={onClick} className={classes} style={style} anchorProps={anchorProps}>{children}</ClickTarget>
})
