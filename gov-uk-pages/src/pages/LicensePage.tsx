import { useEffect } from 'react'
import { DocsFooter, DocsHeader } from './DocsChrome'
import { message, pageTitle, useLocale } from './i18n'
import govukFrontendLicense from './govuk-frontend-LICENSE.txt?raw'
import './LicensePage.css'

export function LicensePage() {
  const locale = useLocale()

  useEffect(() => {
    document.title = pageTitle(message(locale, 'govukLicense'), locale)
  }, [locale])

  return <div className="app-shell govuk-frontend-supported">
    <DocsHeader current="license" />
    <main className="site-width license-page" id="main-content">
      <h1 className="govuk-heading-xl">{message(locale, 'govukLicense')}</h1>
      <p className="govuk-body-l">GOV.UK Frontend 6.5.1 · MIT License</p>
      <p className="govuk-body">{message(locale, 'licenseIntro')}</p>
      <p className="govuk-body"><a className="govuk-link" href="https://github.com/alphagov/govuk-frontend/blob/main/LICENSE.txt">{message(locale, 'licenseSource')}</a></p>
      <pre className="license-page__notice">{govukFrontendLicense.trimEnd()}</pre>
    </main>
    <DocsFooter />
  </div>
}
