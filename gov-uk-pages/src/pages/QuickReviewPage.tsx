import { useEffect, useMemo, useState } from 'react'
import './QuickReviewPage.css'
import {
  Accordion,
  Breadcrumbs,
  Button,
  Checkboxes,
  Details,
  Input,
  NotificationBanner,
  Panel,
  Tabs,
  Tag,
  WarningText,
} from '@kvzd-design/gov-uk'
import { DocsFooter, DocsHeader } from './DocsChrome'

const components = [
  'Accordion', 'Back link', 'Breadcrumbs', 'Button', 'Character count',
  'Checkboxes', 'Cookie banner', 'Date input', 'Details', 'Error message',
  'Error summary', 'Exit this page', 'Feedback', 'Fieldset', 'File upload',
  'Generic header', 'GOV.UK footer', 'GOV.UK header', 'Inset text',
  'Language navigation', 'Notification banner', 'Pagination', 'Panel',
  'Password input', 'Phase banner', 'Radios', 'Select', 'Service navigation',
  'Skip link', 'Summary list', 'Table', 'Tabs', 'Tag', 'Task list',
  'Text input', 'Textarea', 'Warning text',
] as const

function slugify(value: string) {
  return value.toLowerCase().replaceAll('.', '').replaceAll(' ', '-')
}

export function QuickReviewPage() {
  const [query, setQuery] = useState('')
  const [email, setEmail] = useState('')
  useEffect(() => { document.title = 'Quick Review – KVZD GOV.UK React'; window.scrollTo(0, 0) }, [])
  const filteredComponents = useMemo(
    () => components.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  )

  return (
    <div className="app-shell govuk-frontend-supported">
      <DocsHeader current="quick-review" />

      <div className="site-width page-layout" id="top">
        <aside className="side-nav" aria-label="Components">
          <h2>Components</h2>
          <Input
            className="side-nav__search"
            id="component-search"
            type="search"
            label="Filter components"
            labelSize="s"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ul>
            {filteredComponents.map((component) => (
              <li key={component}><a href={`#${slugify(component)}`}>{component}</a></li>
            ))}
          </ul>
        </aside>

        <main id="main-content" className="main-content">
          <div className="eyebrow">React component library</div>
          <h1 className="govuk-heading-xl">Components</h1>
          <p className="govuk-body-l intro">
            Reusable React components for building clear, accessible public services.
            The API is deliberately small; the behaviour follows GOV.UK Frontend 6.5.0.
          </p>
          <div className="release-note">
            <Tag color="blue">Baseline</Tag>
            <span>Locked to GOV.UK Frontend 6.5.0</span>
            <span className="release-note__count">37 GOV.UK components covered</span>
          </div>

          <section className="showcase" aria-labelledby="showcase-title">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Quick preview</p>
                <h2 className="govuk-heading-l" id="showcase-title">Simple props, production markup</h2>
              </div>
              <code>{'<Button type="primary" />'}</code>
            </div>
            <div className="showcase__grid">
              <div className="demo-card" id="button">
                <h3 className="govuk-heading-m">Button</h3>
                <p className="govuk-body">Use buttons to help users carry out an action.</p>
                <div className="demo-row">
                  <Button type="primary">Save and continue</Button>
                  <Button type="secondary">Save draft</Button>
                  <Button danger>Delete</Button>
                </div>
              </div>
              <div className="demo-card" id="text-input">
                <h3 className="govuk-heading-m">Text input</h3>
                <Input
                  label="Email address"
                  hint="We’ll only use this to contact you about your application."
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>
            <Panel id="panel" title="Application complete" className="showcase__panel">
              Your reference number<br /><strong>HDJ2123F</strong>
            </Panel>

            <div className="interaction-lab">
              <h3 className="govuk-heading-m">React-managed interaction</h3>
              <Tabs
                items={[
                  {
                    key: 'forms',
                    label: 'Forms',
                    children: <Checkboxes name="contact" legend="How should we contact you?" options={[{ label: 'Email', value: 'email' }, { label: 'Text message', value: 'text' }, { label: 'Phone call', value: 'phone' }]} />,
                  },
                  {
                    key: 'navigation',
                    label: 'Navigation',
                    children: <Breadcrumbs items={[{ label: 'Home', href: '#home' }, { label: 'Passports', href: '#passports' }, { label: 'Renew a passport', current: true }]} />,
                  },
                  {
                    key: 'feedback',
                    label: 'Feedback',
                    children: <><NotificationBanner title="Important">Your session will expire in 5 minutes.</NotificationBanner><WarningText>You can be fined if you do not register.</WarningText></>,
                  },
                ]}
              />
              <Accordion items={[{ key: 'eligibility', heading: 'Eligibility', summary: 'Who can use this service', children: <p className="govuk-body">You can use this service if you are 18 or over and live in the UK.</p> }, { key: 'documents', heading: 'Documents you need', summary: 'Evidence and identity', children: <Details summary="Accepted proof of identity">Passport, driving licence or biometric residence permit.</Details> }]} />
            </div>
          </section>

          <section className="component-index" aria-labelledby="index-title">
            <p className="section-kicker">Component index</p>
            <h2 className="govuk-heading-l" id="index-title">All components</h2>
            <ul>
              {filteredComponents.map((component) => (
                <li key={component}><a href={`#${slugify(component)}`}>{component}</a></li>
              ))}
            </ul>
          </section>
        </main>
      </div>

      <DocsFooter />
    </div>
  )
}

export default QuickReviewPage
