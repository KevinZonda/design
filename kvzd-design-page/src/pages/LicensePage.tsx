import { useEffect } from 'react'
import { Typography } from '@kevinzonda/design'
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
      <Typography.Title level={1} variant="xl">{message(locale, 'govukLicense')}</Typography.Title>
      <Typography.Paragraph variant="l">GOV.UK Frontend 6.5.1 · MIT License</Typography.Paragraph>
      <Typography.Paragraph>{message(locale, 'licenseIntro')}</Typography.Paragraph>
      <Typography.Paragraph><a className="govuk-link" href="https://github.com/alphagov/govuk-frontend/blob/main/LICENSE.txt">{message(locale, 'licenseSource')}</a></Typography.Paragraph>
      <pre className="license-page__notice">{govukFrontendLicense.trimEnd()}</pre>
    </main>
    <DocsFooter />
  </div>
}
