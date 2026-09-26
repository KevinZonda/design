import { createElement, forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { Link } from '../components/Link'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export type HeadingVariant = 'xl' | 'l' | 'm' | 's'
export type BodyVariant = 'l' | 'm' | 's'
/** Points from the GOV.UK type scale, used to override the font size. */
export type ScalePoint = 16 | 19 | 24 | 27 | 36 | 48 | 80

const headingVariantFor = (level: HeadingLevel): HeadingVariant => level === 1 ? 'l' : level === 2 ? 'm' : 's'
// GOV.UK only ships caption classes for xl, l and m; small headings reuse caption-m.
const captionVariantFor = (variant: HeadingVariant): HeadingVariant => variant === 's' ? 'm' : variant
const bodyClass = (variant: BodyVariant) => variant === 'l' ? 'govuk-body-l' : variant === 's' ? 'govuk-body-s' : 'govuk-body'

export interface TitleProps extends Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> {
  children: ReactNode
  /** Semantic heading level. Also picks the default visual variant: l for 1, m for 2, s for 3 and below. */
  level?: HeadingLevel
  /** Visual style override. Defaults to the GOV.UK hierarchy for the level. */
  variant?: HeadingVariant
  /** Caption rendered above the heading, or inside it when captionInHeading is set. */
  caption?: ReactNode
  /** Nest the caption inside the heading. Use when the caption is part of the page heading. */
  captionInHeading?: boolean
}

export const Title = forwardRef<HTMLHeadingElement, TitleProps>(function Title({ caption, captionInHeading = false, children, className = '', level = 1, variant, ...props }, ref) {
  const resolvedVariant = variant ?? headingVariantFor(level)
  const captionNode = caption !== undefined
    ? <span className={`govuk-caption-${captionVariantFor(resolvedVariant)}`}>{caption}</span>
    : null
  const heading = createElement(`h${level}`, {
    ...props,
    ref,
    className: `govuk-heading-${resolvedVariant} ${className}`.trim(),
  }, captionInHeading && captionNode ? <>{captionNode}{children}</> : children)
  return captionInHeading || captionNode === null ? heading : <>{captionNode}{heading}</>
})

export interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  /** Body typography variant: large, regular or small. */
  variant?: BodyVariant
  /** Overrides the font size with a point from the GOV.UK type scale. */
  size?: ScalePoint
  bold?: boolean
  tabular?: boolean
  breakWord?: boolean
}

export const Text = forwardRef<HTMLSpanElement, TextProps>(function Text({ bold = false, breakWord = false, className = '', size, tabular = false, variant = 'm', ...props }, ref) {
  return <span {...props} ref={ref} className={[
    bodyClass(variant),
    size !== undefined && `govuk-!-font-size-${size}`,
    bold && 'govuk-!-font-weight-bold',
    tabular && 'govuk-!-font-tabular-numbers',
    breakWord && 'govuk-!-text-break-word',
    className,
  ].filter(Boolean).join(' ').trim()} />
})

export interface ParagraphProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Body typography variant: large, regular or small. */
  variant?: BodyVariant
  bold?: boolean
  tabular?: boolean
  breakWord?: boolean
}

export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(function Paragraph({ bold = false, breakWord = false, className = '', tabular = false, variant = 'm', ...props }, ref) {
  return <p {...props} ref={ref} className={[
    bodyClass(variant),
    bold && 'govuk-!-font-weight-bold',
    tabular && 'govuk-!-font-tabular-numbers',
    breakWord && 'govuk-!-text-break-word',
    className,
  ].filter(Boolean).join(' ').trim()} />
})

export const Typography = { Link, Paragraph, Text, Title }
