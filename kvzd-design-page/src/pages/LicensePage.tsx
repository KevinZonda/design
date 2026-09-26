import { useEffect } from 'react'
import { H1, Paragraph } from '@kevinzonda/design'
import { Link } from '@kevinzonda/design/components'
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
      <H1 variant="xl">{message(locale, 'govukLicense')}</H1>
      <Paragraph variant="l">GOV.UK Frontend 6.5.1 - MIT License</Paragraph>
      <Paragraph>{message(locale, 'licenseIntro')}</Paragraph>
      <Paragraph><Link href="https://github.com/alphagov/govuk-frontend/blob/main/LICENSE.txt">{message(locale, 'licenseSource')}</Link></Paragraph>
      <pre className="license-page__notice">{govukFrontendLicense.trimEnd()}</pre>
    </main>
    <DocsFooter />
  </div>
}
