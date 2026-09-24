import type { Plugin } from 'postcss'

// The generic Header and Footer do not render GOV.UK branding. Remove the
// upstream rules for the unused branded header and Royal Arms before Vite
// resolves CSS URLs, so the package has no dangling crest asset reference.
export function stripGovukBranding(): Plugin {
  return {
    postcssPlugin: 'strip-govuk-branding',
    Rule(rule) {
      const selectors = rule.selectors.filter((selector) =>
        !/\.govuk-header(?:__|\b)/.test(selector)
        && !/\.govuk-footer__(?:copyright-logo|crown)(?:\b|:)/.test(selector),
      )
      if (selectors.length === 0) rule.remove()
      else if (selectors.length !== rule.selectors.length) rule.selectors = selectors
    },
    AtRule(atRule) {
      // GOV.UK Frontend includes an old IE-only media query that Lightning CSS
      // cannot parse; current browsers ignore it too.
      if (atRule.name === 'media' && atRule.params.includes('\\0')) atRule.remove()
    },
  }
}
