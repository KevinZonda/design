import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react'

export namespace Theme {
  export interface ColourPalette {
    brand: string
    text: string
    inverseText: string
    templateBackground: string
    bodyBackground: string
    printText: string
    secondaryText: string
    focus: string
    focusText: string
    error: string
    success: string
    border: string
    inputBorder: string
    hover: string
    link: string
    linkVisited: string
    linkHover: string
    linkActive: string
    surfaceBackground: string
    surfaceText: string
    surfaceBorder: string
  }

  export interface ProviderProps extends HTMLAttributes<HTMLDivElement> {
    palette?: Partial<ColourPalette>
  }
}

type ColourVariable = `--govuk-${string}`
type ThemeStyle = CSSProperties & Partial<Record<ColourVariable, string>>

const colourVariables: Record<keyof Theme.ColourPalette, ColourVariable> = {
  brand: '--govuk-brand-colour',
  text: '--govuk-text-colour',
  inverseText: '--govuk-inverse-text-colour',
  templateBackground: '--govuk-template-background-colour',
  bodyBackground: '--govuk-body-background-colour',
  printText: '--govuk-print-text-colour',
  secondaryText: '--govuk-secondary-text-colour',
  focus: '--govuk-focus-colour',
  focusText: '--govuk-focus-text-colour',
  error: '--govuk-error-colour',
  success: '--govuk-success-colour',
  border: '--govuk-border-colour',
  inputBorder: '--govuk-input-border-colour',
  hover: '--govuk-hover-colour',
  link: '--govuk-link-colour',
  linkVisited: '--govuk-link-visited-colour',
  linkHover: '--govuk-link-hover-colour',
  linkActive: '--govuk-link-active-colour',
  surfaceBackground: '--govuk-surface-background-colour',
  surfaceText: '--govuk-surface-text-colour',
  surfaceBorder: '--govuk-surface-border-colour',
}

export const ThemeProvider = forwardRef<HTMLDivElement, Theme.ProviderProps>(function ThemeProvider({ palette = {}, className = '', style, ...props }, ref) {
  const themeStyle: ThemeStyle = {}

  for (const token of Object.keys(palette) as Array<keyof Theme.ColourPalette>) {
    const value = palette[token]
    if (value !== undefined) themeStyle[colourVariables[token]] = value
  }

  return <div {...props} ref={ref} className={`kvzd-design-theme-provider ${className}`.trim()} style={{ ...themeStyle, ...style }} />
})
