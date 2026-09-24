import type { ReactNode } from 'react'
import {
  Accordion,
  BackLink,
  Breadcrumbs,
  Button,
  ButtonGroup,
  CharacterCount,
  Checkboxes,
  CookieBanner,
  DateInput,
  Details,
  ErrorMessage,
  ErrorSummary,
  ExitThisPage,
  Feedback,
  Fieldset,
  FileUpload,
  Footer,
  Header,
  InsetText,
  Input,
  LanguageNavigation,
  NotificationBanner,
  Pagination,
  Panel,
  PasswordInput,
  PhaseBanner,
  Radios,
  SearchInput,
  Select,
  ServiceNavigation,
  SkipLink,
  SummaryList,
  Table,
  Tabs,
  Tag,
  TaskList,
  Textarea,
  WarningText,
} from '@kevinzonda/design/components'

export interface ApiProp {
  name: string
  type: string
  defaultValue?: string
  description: string
}

export interface ComponentDoc {
  slug: string
  name: string
  summary: string
  whenToUse: string
  howItWorks: string
  code: string
  example: () => ReactNode
  api: ApiProp[]
  status?: 'trial'
  wide?: boolean
  guidanceUrl?: string | null
}

const text = (name: string, description: string): ApiProp => ({ name, type: 'ReactNode', description })
const items = (description: string): ApiProp => ({ name: 'items', type: 'Item[]', description })
const value = (description = 'Controlled value.'): ApiProp => ({ name: 'value', type: 'string', description })
const onChange = (description = 'Called when the value changes.'): ApiProp => ({ name: 'onChange', type: '(value) => void', description })

const caseTable = (title: string, rows: Array<{ manager: string; opened: number; closed: number }>) => <>
  <h2 className="govuk-heading-l">{title}</h2>
  <Table columns={[{ title: 'Case manager', dataIndex: 'manager' }, { title: 'Cases opened', dataIndex: 'opened' }, { title: 'Cases closed', dataIndex: 'closed' }]} dataSource={rows} />
</>

const genericServiceLogo = <svg width="28" height="30" viewBox="0 0 28 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <circle cx="13.5549" cy="4.21349" r="4.21349" />
  <circle cx="13.5549" cy="25.7865" r="4.21349" />
  <circle cx="22.8963" cy="9.6068" r="4.21349" />
  <circle cx="4.2135" cy="20.3932" r="4.21349" />
  <circle cx="22.8963" cy="20.3932" r="4.21349" />
  <circle cx="4.21351" cy="9.60674" r="4.21349" />
</svg>

export const componentDocs: ComponentDoc[] = [
  {
    slug: 'accordion',
    name: 'Accordion',
    summary: 'Let users show and hide sections of related content on a page.',
    whenToUse: 'Use an accordion when users need only a few sections at a time and the page would otherwise be difficult to scan. Prefer normal headings when most users need all the content.',
    howItWorks: 'Each section has a real button, exposes its expanded state and keeps the content in the document. React owns the state, including the show-all control.',
    code: `<Accordion items={[\n  { key: 'writing', heading: 'Writing well for the web', children: <p>...</p> },\n  { key: 'audience', heading: 'Know your audience', children: <p>...</p> }\n]} />`,
    example: () => <Accordion items={[
      { key: 'writing', heading: 'Writing well for the web', children: <p className="govuk-body">This is the content for Writing well for the web.</p> },
      { key: 'specialists', heading: 'Writing well for specialists', children: <p className="govuk-body">This is the content for Writing well for specialists.</p> },
      { key: 'audience', heading: 'Know your audience', children: <p className="govuk-body">This is the content for Know your audience.</p> },
      { key: 'reading', heading: 'How people read', children: <p className="govuk-body">This is the content for How people read.</p> },
    ]} />,
    api: [items('Accordion sections with a key, heading, optional summary and content.'), { name: 'showAllText', type: 'string', defaultValue: 'Show all sections', description: 'Label used to expand every section.' }, { name: 'openKeys', type: 'string[]', description: 'Optional controlled list of expanded section keys.' }, { name: 'onChange', type: '(openKeys: string[]) => void', description: 'Called after a section or the show-all control is toggled.' }, { name: 'ref', type: 'Ref<HTMLDivElement>', description: 'Accordion root element.' }],
  },
  {
    slug: 'back-link', name: 'Back link',
    summary: 'Help users return to the previous step in a multi-page service.',
    whenToUse: 'Use on question pages and other linear flows. Place it at the top of the main content and do not combine it with breadcrumbs.',
    howItWorks: 'The component renders a conventional link so browser behaviours such as opening in a new tab remain available.',
    code: `<BackLink href="/previous-step">Back</BackLink>`,
    example: () => <BackLink href="#back-link">Back</BackLink>,
    api: [{ name: 'href', type: 'string', description: 'Destination for the previous step.' }, text('children', 'Link label.')],
  },
  {
    slug: 'breadcrumbs', name: 'Breadcrumbs',
    summary: 'Show users where they are within a website hierarchy.',
    whenToUse: 'Use for websites with several levels of navigation. Do not use breadcrumbs for a simple linear transaction.',
    howItWorks: 'Provide items in hierarchy order. Omit href from the current item so it is rendered as text with aria-current.',
    code: `<Breadcrumbs items={[\n  { label: 'Home', href: '/' },\n  { label: 'Passports', href: '/passports' },\n  { label: 'Renew a passport', current: true }\n]} />`,
    example: () => <Breadcrumbs items={[{ label: 'Home', href: '#' }, { label: 'Passports, travel and living abroad', href: '#' }, { label: 'Travel abroad', current: true }]} />,
    api: [items('Ordered breadcrumb links and a text-only current item.'), { name: 'collapseOnMobile', type: 'boolean', defaultValue: 'false', description: 'Show a shortened trail on small screens.' }, { name: 'label', type: 'string', defaultValue: 'Breadcrumb', description: 'Accessible navigation label.' }],
  },
  {
    slug: 'button', name: 'Button',
    summary: 'Help users carry out an action such as saving information or starting a service.',
    whenToUse: 'Use one clear primary action per page. Use a start button on a service start page, and group related actions together. Avoid disabled buttons unless user research supports them.',
    howItWorks: 'Supply href for navigation or htmlType for a native form button. Start buttons include the GOV.UK arrow. ButtonGroup aligns buttons and links, and disabled form buttons receive both disabled and aria-disabled.',
    code: `<Button href="/start" isStartButton>Start now</Button>

<ButtonGroup>
  <Button htmlType="submit">Save and continue</Button>
  <Button type="secondary">Save as draft</Button>
  <a className="govuk-link" href="/cancel">Cancel</a>
</ButtonGroup>

<Button disabled>Disabled button</Button>`,
    example: () => <div className="button-examples"><Button href="#start" isStartButton>Start now</Button><ButtonGroup><Button htmlType="submit">Save and continue</Button><Button type="secondary">Save as draft</Button><a className="govuk-link" href="#cancel">Cancel</a></ButtonGroup><div className="button-examples__variants"><Button disabled>Disabled button</Button><Button danger>Delete account</Button><div className="button-examples__inverse"><Button type="inverse">Create an account</Button></div></div></div>,
    api: [text('children', 'Button label.'), { name: 'type', type: `'primary' | 'secondary' | 'warning' | 'inverse'`, defaultValue: 'primary', description: 'Visual hierarchy.' }, { name: 'href', type: 'string', description: 'Renders a link styled as a button.' }, { name: 'htmlType', type: `'button' | 'submit' | 'reset'`, defaultValue: 'button', description: 'Native button type when href is not supplied.' }, { name: 'isStartButton', type: 'boolean', defaultValue: 'false', description: 'Use start button styling and the arrow icon.' }, { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables a native button and adds aria-disabled. Not available for links.' }, { name: 'preventDoubleClick', type: 'boolean', defaultValue: 'false', description: 'Ignore another button click within one second. Not applied to links.' }, { name: 'danger', type: 'boolean', defaultValue: 'false', description: 'Shortcut for the warning treatment.' }],
  },
  {
    slug: 'character-count', name: 'Character count',
    summary: 'Help users know how much text they can enter when there is a strict limit.',
    whenToUse: 'Use only when the service has a genuine character or word limit. Explain the constraint before the user starts typing.',
    howItWorks: 'The live count is derived from the textarea value and announced politely to assistive technology.',
    code: `<CharacterCount label="Can you provide more detail?" maxLength={200} />`,
    example: () => <CharacterCount label="Can you provide more detail?" hint="Do not include personal information." maxLength={200} />,
    api: [text('label', 'Textarea label.'), { name: 'maxLength', type: 'number', defaultValue: '200', description: 'Maximum number of characters.' }, { name: 'maxWords', type: 'number', description: 'Optional word limit instead of character limit.' }, onChange()],
  },
  {
    slug: 'checkboxes', name: 'Checkboxes',
    summary: 'Let users select one or more options from a list.',
    whenToUse: 'Use when users may choose multiple answers. Use radios when only one choice is allowed.',
    howItWorks: 'Every checkbox has a visible label. Options may include hint text and conditional content.',
    code: `<Checkboxes name="waste" legend="Which types of waste do you transport?" hint="Select all that apply" defaultValue={['animal']} options={[\n  { label: 'Waste from animal carcasses', value: 'animal' },\n  { label: 'Waste from mines or quarries', value: 'mines' },\n  { label: 'Farm or agricultural waste', value: 'farm' }\n]} />`,
    example: () => <Checkboxes name="waste" legend="Which types of waste do you transport?" hint="Select all that apply" defaultValue={['animal']} options={[{ label: 'Waste from animal carcasses', value: 'animal' }, { label: 'Waste from mines or quarries', value: 'mines' }, { label: 'Farm or agricultural waste', value: 'farm' }]} />,
    api: [{ name: 'options', type: 'ChoiceOption[]', description: 'Checkbox labels, values, hints and conditional content.' }, { name: 'value', type: 'string[]', description: 'Controlled selected values.' }, { name: 'onChange', type: '(value: string[]) => void', description: 'Called with all selected values.' }, text('legend', 'Question shown as the fieldset legend.'), { name: 'ref', type: 'Ref<HTMLFieldSetElement>', description: 'Group fieldset.' }, { name: 'inputRefs', type: 'Record<string, Ref<HTMLInputElement>>', description: 'Refs for individual options, keyed by option value.' }, { name: 'inputProps', type: 'InputHTMLAttributes<HTMLInputElement>', description: 'Native event handlers and attributes shared by each checkbox.' }],
  },
  {
    slug: 'cookie-banner', name: 'Cookie banner',
    summary: 'Ask users for permission to set non-essential cookies.',
    whenToUse: 'Use when a service sets analytics or other non-essential cookies. Do not block access to the service while waiting for a choice.',
    howItWorks: 'The choice is saved in a first-party cookie for one year. The confirmation can be dismissed, and the banner stays hidden on return visits.',
    code: `<CookieBanner cookieName="my_service_cookie_consent" settingsHref="/cookies" onConsentChange={(choice) => setAnalyticsEnabled(choice === 'accepted')}>\n  We use analytics cookies to understand how you use the service.\n</CookieBanner>`,
    example: () => <CookieBanner cookieName="kvzd_docs_cookie_demo">We use some essential cookies to make this service work. We would also like to use analytics cookies.</CookieBanner>,
    api: [text('children', 'Cookie explanation.'), { name: 'cookieName', type: 'string', defaultValue: 'kvzd_cookie_consent', description: 'First-party cookie used to save consent for one year.' }, { name: 'settingsHref', type: 'string', description: 'Link to the service cookie settings page.' }, { name: 'onConsentChange', type: "(choice: 'accepted' | 'rejected' | null) => void", description: 'Reports the saved choice on mount and after a new choice.' }, { name: 'onAccept', type: '() => void', description: 'Called when analytics cookies are accepted.' }, { name: 'onReject', type: '() => void', description: 'Called when analytics cookies are rejected.' }],
    wide: true,
  },
  {
    slug: 'date-input', name: 'Date input',
    summary: 'Ask users for a memorable or known date using day, month and year fields.',
    whenToUse: 'Use for dates users already know, such as a date of birth. Use a calendar control only when users need to choose from available dates.',
    howItWorks: 'The three numeric inputs are grouped in a fieldset with one legend and return a single date value object.',
    code: `<DateInput legend="What is your date of birth?" hint="For example, 31 3 1980" />`,
    example: () => <DateInput legend="What is your date of birth?" hint="For example, 31 3 1980" namePrefix="dob" />,
    api: [text('legend', 'Question for the complete date.'), { name: 'value', type: '{ day?: string; month?: string; year?: string }', description: 'Controlled date value.' }, onChange('Called with the complete date value object.'), { name: 'ref', type: 'Ref<HTMLFieldSetElement>', description: 'Group fieldset.' }, { name: 'inputRefs', type: '{ day?, month?, year? }', description: 'Refs for the individual date fields.' }, { name: 'inputProps', type: 'InputHTMLAttributes<HTMLInputElement>', description: 'Native event handlers and attributes shared by the day, month and year fields.' }],
  },
  {
    slug: 'details', name: 'Details',
    summary: 'Make secondary information available without showing it by default.',
    whenToUse: 'Use for information only some users need. Do not hide information most users must read to complete the task.',
    howItWorks: 'This uses the native details and summary elements, so the basic interaction works without JavaScript.',
    code: `<Details summary="Help with nationality">We need this information to...</Details>`,
    example: () => <Details summary="Help with nationality">We need to know your nationality so we can work out which elections you are entitled to vote in.</Details>,
    api: [text('summary', 'Visible disclosure label.'), text('children', 'Content revealed when expanded.'), { name: 'open', type: 'boolean', description: 'Initial native open state.' }, { name: 'onToggle', type: 'ReactEventHandler<HTMLDetailsElement>', description: 'Native toggle event; read currentTarget.open for the new state.' }, { name: 'ref', type: 'Ref<HTMLDetailsElement>', description: 'Native details element.' }],
  },
  {
    slug: 'error-message', name: 'Error message',
    summary: 'Tell users what went wrong and how to fix it near the relevant field.',
    whenToUse: 'Show next to every field containing an error and repeat the same wording in the error summary.',
    howItWorks: 'A visually hidden prefix ensures the message is announced as an error without relying on colour.',
    code: `<ErrorMessage>Enter how many hours you work a week</ErrorMessage>`,
    example: () => <ErrorMessage>Enter how many hours you work a week</ErrorMessage>,
    api: [text('children', 'Clear, concise error text.'), { name: 'visuallyHiddenText', type: 'string', defaultValue: 'Error:', description: 'Prefix announced by assistive technology.' }],
  },
  {
    slug: 'error-summary', name: 'Error summary',
    summary: 'Summarise validation errors at the top of a page and link to each field.',
    whenToUse: 'Always show an error summary when validation fails, including when there is only one error.',
    howItWorks: 'Use the standard heading, keep link text identical to the inline error, and move focus to the summary after failed submission.',
    code: `<ErrorSummary errors={[\n  { children: 'Enter your full name', href: '#full-name' },\n  { children: 'Enter a valid date', href: '#date' }\n]} />`,
    example: () => <ErrorSummary errors={[{ children: 'Enter your full name', href: '#full-name' }, { children: 'The date your passport was issued must be in the past', href: '#passport-date' }]} />,
    api: [{ name: 'errors', type: 'ErrorItem[]', description: 'Error text and optional target links.' }, text('title', 'Summary heading.')],
  },
  {
    slug: 'exit-this-page', name: 'Exit this page',
    summary: 'Give users a prominent way to leave a sensitive service quickly.',
    whenToUse: 'Use on pages where being seen could put someone at risk. Explain that the control cannot remove browser history.',
    howItWorks: 'The link works without JavaScript. With JavaScript, its secondary link and three Shift presses within five seconds also exit, hiding the current page before navigation.',
    code: `<ExitThisPage href="https://www.bbc.co.uk/weather" />`,
    example: () => <ExitThisPage href="https://www.bbc.co.uk/weather" />,
    api: [{ name: 'href', type: 'string', defaultValue: 'https://www.bbc.co.uk/weather', description: 'Neutral exit destination.' }, text('children', 'Optional visible action label.'), { name: 'secondaryLabel', type: 'string', description: 'Accessible secondary exit link text.' }, { name: 'onExit', type: '() => void', description: 'Called before navigation from either exit method.' }],
  },
  {
    slug: 'feedback', name: 'Feedback', status: 'trial',
    summary: 'Collect quick page feedback and problem reports from users.',
    whenToUse: 'Use across a service when teams can review and act on the responses. Keep it separate from formal complaints or support channels.',
    howItWorks: 'The compact useful/not useful prompt can reveal a short problem report form without leaving the page.',
    code: `<Feedback onUseful={setUseful} onSubmit={sendFeedback} />`,
    example: () => <Feedback />,
    api: [{ name: 'onUseful', type: '(useful: boolean) => void', description: 'Records the quick usefulness response.' }, { name: 'onSubmit', type: '(message: string) => void', description: 'Receives a problem report.' }, { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the problem report form opens or closes.' }, { name: 'ref', type: 'Ref<HTMLElement>', description: 'Feedback section root element.' }],
    wide: true,
  },
  {
    slug: 'fieldset', name: 'Fieldset',
    summary: 'Group related form controls under one question or description.',
    whenToUse: 'Use with radios, checkboxes or connected inputs where the shared question is needed to understand each control.',
    howItWorks: 'The legend becomes the accessible name for the complete group and may include a page-level heading treatment.',
    code: `<Fieldset legend="What is your address?" legendSize="l" isPageHeading>
  <Input label="Address line 1" name="address-line-1" />
  <Input label="Address line 2 (optional)" name="address-line-2" />
  <Input label="Town or city" name="address-town" />
  <Input label="Postcode" name="address-postcode" width={10} />
</Fieldset>`,
    example: () => <Fieldset legend="What is your address?" legendSize="l" isPageHeading><Input label="Address line 1" name="address-line-1" /><Input label="Address line 2 (optional)" name="address-line-2" /><Input label="Town or city" name="address-town" /><Input label="Postcode" name="address-postcode" width={10} /></Fieldset>,
    api: [text('legend', 'Accessible name for the group.'), { name: 'legendSize', type: `'s' | 'm' | 'l' | 'xl'`, description: 'Optional legend emphasis.' }, { name: 'isPageHeading', type: 'boolean', defaultValue: 'false', description: 'Wrap the legend content in a level-one heading.' }, text('children', 'Related form controls.')],
  },
  {
    slug: 'file-upload', name: 'File upload',
    summary: 'Let users select and upload a file.',
    whenToUse: 'Use when the service genuinely needs a document or image. State accepted formats and size limits before upload.',
    howItWorks: 'The component preserves the native file input and adds consistent label, hint and error presentation.',
    code: `<FileUpload label="Upload a file" hint="PDF, JPG or PNG up to 10MB" name="evidence" />`,
    example: () => <FileUpload label="Upload a file" hint="PDF, JPG or PNG up to 10MB" name="evidence" accept=".pdf,.jpg,.jpeg,.png" />,
    api: [text('label', 'Visible file input label.'), text('hint', 'Accepted format and size guidance.'), text('error', 'Validation error.'), { name: 'accept', type: 'string', description: 'Native accepted file types.' }],
  },
  {
    slug: 'generic-footer', name: 'Generic footer', status: 'trial',
    summary: 'Add supporting links and organisation details at the end of a page.',
    whenToUse: 'Use for services outside GOV.UK that need a footer without Crown copyright or GOV.UK licence text.',
    howItWorks: 'Footer provides the layout. Supply the links and text appropriate to your organisation.',
    code: `<Footer meta={[{ label: 'Privacy', href: '/privacy' }]} description="Service information" copyright="© Example organisation" />`,
    example: () => <Footer meta={[{ label: 'Help', href: '#' }, { label: 'Privacy', href: '#' }]} description="Service information" copyright="© Example organisation" />,
    api: [{ name: 'navigation', type: 'FooterSection[]', description: 'Grouped footer navigation.' }, { name: 'meta', type: 'LinkItem[]', description: 'Supporting links.' }, text('description', 'Optional licence or service information.'), text('copyright', 'Optional organisation copyright statement.')],
    guidanceUrl: null,
    wide: true,
  },
  {
    slug: 'generic-header', name: 'Generic header', status: 'trial',
    summary: 'Provide a simple branded header for non-GOV.UK services.',
    whenToUse: 'Use when a service needs the design system interaction standards without presenting itself as GOV.UK.',
    howItWorks: 'Supply a service name and optional logo. The component deliberately avoids the GOV.UK logotype and does not include service navigation.',
    code: `<Header title="Service name" logo={<ServiceLogo />} />`,
    example: () => <Header title="Service name" logo={genericServiceLogo} />,
    api: [text('title', 'Service or organisation name.'), { name: 'logo', type: 'ReactNode', description: 'Optional image or SVG shown before the title.' }, { name: 'homeHref', type: 'string', defaultValue: '/', description: 'Home destination.' }, { name: 'fullWidth', type: 'boolean', defaultValue: 'false', description: 'Use a full-width container.' }],
    wide: true,
  },
  {
    slug: 'inset-text', name: 'Inset text',
    summary: 'Differentiate a short piece of supporting information from surrounding content.',
    whenToUse: 'Use sparingly for information that relates to nearby content but is not the main message.',
    howItWorks: 'A thick left border and spacing create emphasis without implying success, warning or error status.',
    code: `<InsetText>It can take up to 8 weeks to register a lasting power of attorney.</InsetText>`,
    example: () => <InsetText>It can take up to 8 weeks to register a lasting power of attorney.</InsetText>,
    api: [text('children', 'Supporting content.')],
  },
  {
    slug: 'language-navigation', name: 'Language navigation', status: 'trial',
    summary: 'Let users switch between languages offered by a service.',
    whenToUse: 'Use when the same service journey is available in two or more languages.',
    howItWorks: 'The current language is shown as text with aria-current; other languages are alternate links. The navigation has its own accessible label.',
    code: `<LanguageNavigation items={[{ label: 'English', lang: 'en', href: '/en', current: true }, { label: 'Cymraeg', lang: 'cy', href: '/cy' }]} />`,
    example: () => <LanguageNavigation items={[{ label: 'English', lang: 'en', href: '#english', current: true }, { label: 'Cymraeg', lang: 'cy', href: '#cymraeg' }]} />,
    api: [items('Languages, links, language tags and current state.'), { name: 'ariaLabel', type: 'string', defaultValue: 'Choose language', description: 'Accessible navigation label.' }],
  },
  {
    slug: 'notification-banner', name: 'Notification banner',
    summary: 'Tell users about an important change or successful action.',
    whenToUse: 'Use at the top of the main content for information needing attention. Use the success variant only after a completed action.',
    howItWorks: 'The success variant uses an alert role; informational banners use a labelled region to avoid unnecessary interruption.',
    code: `<NotificationBanner type="success">Your application has been sent.</NotificationBanner>`,
    example: () => <NotificationBanner type="success"><h3 className="govuk-notification-banner__heading">Your application has been sent.</h3><p className="govuk-body">You will receive a confirmation email.</p></NotificationBanner>,
    api: [{ name: 'type', type: `'info' | 'success'`, defaultValue: 'info', description: 'Semantic banner type.' }, text('title', 'Banner heading.'), text('children', 'Banner content.')],
  },
  {
    slug: 'pagination', name: 'Pagination',
    summary: 'Help users move through a long list split across pages.',
    whenToUse: 'Use when the content is too long to show on one page. Keep page sizes meaningful and preserve filters between pages.',
    howItWorks: 'Use current and total for numbered pages, or previous and next for the GOV.UK block navigation variant.',
    code: `<Pagination current={2} total={4} onChange={setPage} />`,
    example: () => <Pagination current={2} total={4} />,
    api: [{ name: 'current', type: 'number', description: 'Current page, starting at 1.' }, { name: 'total', type: 'number', description: 'Number of pages.' }, { name: 'previous', type: 'PaginationLink', description: 'Previous destination and optional descriptive label for block navigation.' }, { name: 'next', type: 'PaginationLink', description: 'Next destination and optional descriptive label for block navigation.' }, onChange('Called with the selected page number.'), { name: 'getHref', type: '(page: number) => string', description: 'Builds a link for each numbered page.' }],
  },
  {
    slug: 'panel', name: 'Panel',
    summary: 'Highlight important information on confirmation or interruption pages.',
    whenToUse: 'Use the confirmation variant after a completed transaction, or the interruption variant to pause a journey for important information.',
    howItWorks: 'The title is the main heading. Interruption panels can include actions to let users resume or change their journey.',
    code: `<Panel title="Application complete">Your reference number<br /><strong>HDJ2123F</strong></Panel>

<Panel variant="interruption" title="Is your age correct?" actions={<ButtonGroup><Button href="#continue" type="inverse">Yes, this is correct</Button><a className="govuk-link govuk-link--inverse" href="#change">No, change my age</a></ButtonGroup>}>
  <p className="govuk-body">You entered your age as <strong>109</strong>.</p>
</Panel>`,
    example: () => <div style={{ display: 'grid', gap: 30 }}><Panel title="Application complete">Your reference number<br /><strong>HDJ2123F</strong></Panel><Panel variant="interruption" title="Is your age correct?" actions={<ButtonGroup><Button href="#continue" type="inverse">Yes, this is correct</Button><a className="govuk-link govuk-link--inverse" href="#change">No, change my age</a></ButtonGroup>}><p className="govuk-body">You entered your age as <strong>109</strong>.</p></Panel></div>,
    api: [text('title', 'Panel heading.'), { name: 'variant', type: `'confirmation' | 'interruption'`, defaultValue: 'confirmation', description: 'Panel style and purpose.' }, { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', defaultValue: '1', description: 'Semantic heading level.' }, text('children', 'Supporting panel content.'), { name: 'actions', type: 'ReactNode', description: 'Buttons or links shown in the panel actions area; use inverse styles for interruption panels.' }],
  },
  {
    slug: 'password-input', name: 'Password input',
    summary: 'Let users enter a password and optionally reveal what they typed.',
    whenToUse: 'Use for passwords and similar secrets. Do not disable paste or password managers.',
    howItWorks: 'The show/hide control updates the native input type and communicates its pressed state.',
    code: `<PasswordInput label="Password" name="password" autoComplete="current-password" />`,
    example: () => <PasswordInput label="Password" name="password" autoComplete="current-password" />,
    api: [text('label', 'Input label.'), { name: 'showText', type: 'string', defaultValue: 'Show', description: 'Reveal control label.' }, { name: 'hideText', type: 'string', defaultValue: 'Hide', description: 'Mask control label.' }, { name: 'onVisibilityChange', type: '(visible: boolean) => void', description: 'Called when the show/hide control changes the input type.' }, { name: 'ref', type: 'Ref<HTMLInputElement>', description: 'Native password input; standard input event handlers are also supported.' }],
  },
  {
    slug: 'phase-banner', name: 'Phase banner',
    summary: 'Tell users a service is new or still being improved.',
    whenToUse: 'Use an alpha or beta banner while a service is being tested and provide a route for feedback.',
    howItWorks: 'A compact status tag is followed by a short explanation and feedback link.',
    code: `<PhaseBanner phase="Alpha">This is a new service - your <a href="#">feedback</a> will help us to improve it.</PhaseBanner>`,
    example: () => <PhaseBanner phase="Alpha">This is a new service - your <a className="govuk-link" href="#feedback">feedback</a> will help us to improve it.</PhaseBanner>,
    api: [{ name: 'phase', type: 'ReactNode', description: 'Phase label, usually Alpha or Beta.' }, text('children', 'Short explanation and feedback link.'), { name: 'className', type: 'string', description: 'Additional class for the banner container.' }],
  },
  {
    slug: 'radios', name: 'Radios',
    summary: 'Let users select one option from a list.',
    whenToUse: 'Use for a small set of mutually exclusive options. Show all choices rather than hiding them in a select when space allows.',
    howItWorks: 'The choices share a fieldset legend and may reveal conditional content after selection.',
    code: `<Radios name="contact" legend="How would you prefer to be contacted?" options={[\n  { label: 'Email', value: 'email' },\n  { label: 'Phone', value: 'phone' }\n]} />`,
    example: () => <Radios name="contact" legend="How would you prefer to be contacted?" options={[{ label: 'Email', value: 'email' }, { label: 'Phone', value: 'phone' }, { label: 'Text message', value: 'text' }]} />,
    api: [{ name: 'options', type: 'ChoiceOption[]', description: 'Radio options, hints and conditional content.' }, value(), onChange(), text('legend', 'Question for the group.'), { name: 'ref', type: 'Ref<HTMLFieldSetElement>', description: 'Group fieldset.' }, { name: 'inputRefs', type: 'Record<string, Ref<HTMLInputElement>>', description: 'Refs for individual options, keyed by option value.' }, { name: 'inputProps', type: 'InputHTMLAttributes<HTMLInputElement>', description: 'Native event handlers and attributes shared by each radio.' }],
  },
  {
    slug: 'search-input', name: 'Search input',
    summary: 'Let users enter a search query with a recognisable icon.',
    whenToUse: 'Use for searching or filtering content. Give the field a specific label; place result suggestions and search behaviour in the parent.',
    howItWorks: 'The native search input keeps keyboard and browser behaviour. The icon is decorative and can sit on either side, be replaced or be hidden.',
    code: `<SearchInput label="Search services" name="query" />\n<SearchInput label="Filter results" iconPosition="right" />`,
    example: () => <div className="search-input-examples"><SearchInput label="Search services" name="query" placeholder="Enter a service" /><SearchInput label="Filter results" iconPosition="right" placeholder="Filter by keyword" /></div>,
    api: [text('label', 'Accessible search field label.'), { name: 'iconPosition', type: `'left' | 'right'`, defaultValue: 'left', description: 'Side of the input containing the icon.' }, { name: 'icon', type: 'ReactNode', defaultValue: 'Search icon', description: 'Decorative icon. Pass null to hide it.' }, { name: 'visuallyHiddenLabel', type: 'boolean', defaultValue: 'false', description: 'Hide the label visually while keeping it available to assistive technology.' }, text('hint', 'Optional supporting guidance.'), text('error', 'Validation error.'), { name: 'value / onChange', type: 'native input props', description: 'Use controlled or uncontrolled search input behaviour.' }],
  },
  {
    slug: 'select', name: 'Select',
    summary: 'Let users choose one option from a compact native list.',
    whenToUse: 'Use only when users are familiar with the available choices or when the list would make radios impractical.',
    howItWorks: 'The native select keeps platform keyboard, touch and assistive technology behaviour.',
    code: `<Select label="Sort by" name="sort" options={[{ label: 'Recently updated', value: 'updated' }]} />`,
    example: () => <Select label="Sort by" name="sort" options={[{ label: 'Recently updated', value: 'updated' }, { label: 'Most viewed', value: 'viewed' }, { label: 'Most commented', value: 'commented' }]} />,
    api: [text('label', 'Select label.'), { name: 'options', type: 'Option[]', description: 'Labels and values.' }, text('error', 'Validation error.'), value()],
  },
  {
    slug: 'service-navigation', name: 'Service navigation',
    summary: 'Show a service name and navigation links below the main header.',
    whenToUse: 'Use when a service has meaningful sections or account-level destinations. Do not add navigation a short service does not need.',
    howItWorks: 'The service name and current navigation item are clearly distinguished inside a labelled navigation landmark.',
    code: `<ServiceNavigation serviceName="Service name" items={[{ label: 'Home', href: '/', current: true }]} />`,
    example: () => <ServiceNavigation serviceName="Apply for a passport" items={[{ label: 'Home', href: '#', current: true }, { label: 'Your applications', href: '#' }, { label: 'Messages', href: '#' }]} />,
    api: [text('serviceName', 'Service identity.'), { name: 'serviceUrl', type: 'string', description: 'Optional service home destination.' }, { name: 'serviceOnClick', type: 'IClickBehaviour["onClick"]', description: 'Optional click handler for the service name.' }, items('Navigation items accept optional href and onClick. The handler can prevent navigation.'), { name: 'menuOpen', type: 'boolean', description: 'Optional controlled state of the mobile menu.' }, { name: 'onMenuToggle', type: '(open: boolean) => void', description: 'Called when the mobile menu button is pressed.' }, { name: 'ref', type: 'Ref<HTMLElement>', description: 'Service navigation root element.' }],
    wide: true,
  },
  {
    slug: 'skip-link', name: 'Skip link',
    summary: 'Let keyboard users bypass repeated navigation and reach the main content.',
    whenToUse: 'Include as the first focusable element on every page with repeated header or navigation content.',
    howItWorks: 'The link is visually hidden until focused and points to the main content landmark.',
    code: `<SkipLink href="#main-content">Skip to main content</SkipLink>`,
    example: () => <div className="example-force-skip-link"><SkipLink href="#example-main">Skip to main content</SkipLink></div>,
    api: [{ name: 'href', type: 'string', defaultValue: '#main-content', description: 'ID of the main content area.' }, text('children', 'Link label.')],
  },
  {
    slug: 'summary-list', name: 'Summary list',
    summary: 'Display related information as key-value rows, optionally with actions.',
    whenToUse: 'Use for review and confirmation screens where users need to scan answers or record details.',
    howItWorks: 'Each row is a semantic description list entry; action links include visually hidden context.',
    code: `<SummaryList items={[{ key: 'Name', value: 'Sarah Philips', actions: [{ label: 'Change', href: '#' }] }]} />`,
    example: () => <SummaryList items={[{ key: 'Name', value: 'Sarah Philips', actions: [{ label: 'Change', href: '#', visuallyHiddenText: 'name' }] }, { key: 'Date of birth', value: '5 January 1978', actions: [{ label: 'Change', href: '#', visuallyHiddenText: 'date of birth' }] }, { key: 'Address', value: <>72 Guild Street<br />London<br />SE23 6FH</>, actions: [{ label: 'Change', href: '#', visuallyHiddenText: 'address' }] }]} />,
    api: [items('Key, value and optional contextual actions.'), { name: 'bordered', type: 'boolean', defaultValue: 'true', description: 'Show separators between rows.' }, { name: 'styles', type: "SummaryListProps['styles']", description: 'Inline styles for root, row, key, value, actions and link.' }, { name: 'classNames', type: "SummaryListProps['classNames']", description: 'CSS classes for root, row, key, value, actions and link.' }],
  },
  {
    slug: 'table', name: 'Table',
    summary: 'Present information in rows and columns for direct comparison.',
    whenToUse: 'Use when relationships between values are easier to understand in a grid. Do not use a table solely to lay out a page.',
    howItWorks: 'Column definitions map record fields to semantic headers and may format numeric values or identify row headers.',
    code: `<Table caption="Dates and amounts" columns={columns} dataSource={rows} />`,
    example: () => <Table caption="Dates and amounts" columns={[{ title: 'Date', dataIndex: 'date' }, { title: 'Amount', dataIndex: 'amount', numeric: true }]} dataSource={[{ date: 'First 6 weeks', amount: '£109.80 per week' }, { date: 'Next 33 weeks', amount: '£109.80 per week' }, { date: 'Total estimated pay', amount: '£4,282.20' }]} />,
    api: [{ name: 'columns', type: 'TableColumn<T>[]', description: 'Column titles, record keys, rowHeader flags and render functions.' }, { name: 'dataSource', type: 'T[]', description: 'Rows to render.' }, text('caption', 'Accessible table title.'), { name: 'styles', type: "TableProps<T>['styles']", description: 'Inline styles for root, caption, head, body, row, header and cell.' }, { name: 'classNames', type: "TableProps<T>['classNames']", description: 'CSS classes for root, caption, head, body, row, header and cell.' }],
  },
  {
    slug: 'tabs', name: 'Tabs',
    summary: 'Let users switch between related sections of content.',
    whenToUse: 'Use when users benefit from comparing a small number of peer sections. Avoid tabs for sequential steps.',
    howItWorks: 'At tablet widths and above, the selected tab controls a labelled panel. On smaller screens the component becomes a table of contents and shows every panel in order.',
    code: `<Tabs items={[{ key: 'past-day', label: 'Past day', children: <Table ... /> }]} />`,
    example: () => <Tabs items={[
      { key: 'past-day', label: 'Past day', children: caseTable('Past day', [{ manager: 'David Francis', opened: 3, closed: 0 }, { manager: 'Paul Farmer', opened: 1, closed: 0 }, { manager: 'Rita Patel', opened: 2, closed: 0 }]) },
      { key: 'past-week', label: 'Past week', children: caseTable('Past week', [{ manager: 'David Francis', opened: 24, closed: 18 }, { manager: 'Paul Farmer', opened: 16, closed: 20 }, { manager: 'Rita Patel', opened: 24, closed: 27 }]) },
      { key: 'past-month', label: 'Past month', children: caseTable('Past month', [{ manager: 'David Francis', opened: 98, closed: 95 }, { manager: 'Paul Farmer', opened: 122, closed: 131 }, { manager: 'Rita Patel', opened: 126, closed: 142 }]) },
      { key: 'past-year', label: 'Past year', children: <><h2 className="govuk-heading-l">Past year</h2><p className="govuk-body">There is no data for this year yet, check back later</p></> },
    ]} />,
    api: [items('Tab keys, labels and panel content.'), { name: 'activeKey', type: 'string', description: 'Controlled active tab.' }, { name: 'defaultActiveKey', type: 'string', description: 'Initial active tab.' }, onChange('Called with the selected tab key.')],
    wide: true,
  },
  {
    slug: 'tag', name: 'Tag',
    summary: 'Show the status of something in a compact label.',
    whenToUse: 'Use for statuses that help users scan a list or record. Do not use tags as buttons or rely on colour alone.',
    howItWorks: 'Short text and optional colour variants convey state while retaining high contrast.',
    code: `<Tag color="green">Completed</Tag>`,
    example: () => <div className="example-tag-row"><Tag>Alpha</Tag><Tag color="green">Completed</Tag><Tag color="yellow">Waiting</Tag><Tag color="red">Rejected</Tag><Tag color="orange">Trial</Tag></div>,
    api: [text('children', 'Short status text.'), { name: 'color', type: `'grey' | 'green' | 'teal' | 'turquoise' | 'blue' | 'purple' | 'magenta' | 'pink' | 'red' | 'orange' | 'yellow'`, description: 'Status colour treatment.' }],
  },
  {
    slug: 'task-list', name: 'Task list',
    summary: 'Show users the tasks they need to complete and the status of each one.',
    whenToUse: 'Use for longer services where users may complete sections in more than one session or order.',
    howItWorks: 'Each task link is associated with its visible status and may include a short hint.',
    code: `<TaskList items={[{ title: 'Company details', href: '#', status: 'Completed', statusColor: 'green' }]} />`,
    example: () => <TaskList items={[{ title: 'Company details', href: '#', status: 'Completed', statusColor: 'green' }, { title: 'Director information', href: '#', status: 'Incomplete', statusColor: 'blue' }, { title: 'Check and submit', href: '#', status: 'Cannot start yet' }]} />,
    api: [items('Task title, destination, hint and status.'), { name: 'styles', type: "TaskListProps['styles']", description: 'Inline styles for root, item, nameAndHint, link, hint and status.' }, { name: 'classNames', type: "TaskListProps['classNames']", description: 'CSS classes for root, item, nameAndHint, link, hint and status.' }],
  },
  {
    slug: 'text-input', name: 'Text input',
    summary: 'Let users enter a short amount of text.',
    whenToUse: 'Use for information such as names, reference numbers or email addresses. Set a sensible width based on the expected answer.',
    howItWorks: 'The label, hint and error IDs are wired automatically through aria-describedby. Native input attributes remain available.',
    code: `<Input label="What is the name of the event?" name="eventName" labelSize="l" />`,
    example: () => <Input label="What is the name of the event?" name="eventName" labelSize="l" />,
    api: [text('label', 'Visible and accessible input label.'), text('hint', 'Optional supporting guidance.'), text('error', 'Validation error.'), { name: 'width', type: '2 | 3 | 4 | 5 | 10 | 20 | 30', description: 'Expected-answer width.' }, { name: 'status', type: `'error'`, description: 'Visual and semantic error state.' }],
  },
  {
    slug: 'textarea', name: 'Textarea',
    summary: 'Let users enter more than one line of text.',
    whenToUse: 'Use when answers may be several words or sentences. Use a normal text input for short answers.',
    howItWorks: 'The native textarea retains resize and platform input behaviour while sharing label, hint and error handling with other fields.',
    code: `<Textarea label="Can you provide more detail?" name="moreDetail" rows={5} />`,
    example: () => <Textarea label="Can you provide more detail?" hint="Do not include personal or financial information." name="moreDetail" rows={5} />,
    api: [text('label', 'Textarea label.'), { name: 'rows', type: 'number', defaultValue: '5', description: 'Initial visible height.' }, text('hint', 'Optional guidance.'), text('error', 'Validation error.')],
  },
  {
    slug: 'warning-text', name: 'Warning text',
    summary: 'Warn users about important consequences of an action or inaction.',
    whenToUse: 'Use when users must understand a serious consequence. Keep the wording direct and do not overuse warnings.',
    howItWorks: 'The icon, strong text and visually hidden prefix communicate importance without relying on colour alone.',
    code: `<WarningText>You can be fined up to £5,000 if you do not register.</WarningText>`,
    example: () => <WarningText>You can be fined up to £5,000 if you do not register.</WarningText>,
    api: [text('children', 'Warning message.'), { name: 'iconFallbackText', type: 'string', defaultValue: 'Warning', description: 'Prefix for assistive technology.' }],
  },
]

export const componentBySlug = new Map(componentDocs.map((component) => [component.slug, component]))
