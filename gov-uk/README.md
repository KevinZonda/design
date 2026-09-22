# @kvzd-design/gov-uk

React components based on GOV.UK Frontend **6.5.0**, with a compact API inspired by Ant Design.

## Install

```bash
pnpm add @kvzd-design/gov-uk govuk-frontend@6.5.0
```

## Usage

```tsx
import { Button, Input } from '@kvzd-design/gov-uk'
import '@kvzd-design/gov-uk/style.css'

export function Example() {
  return (
    <>
      <Input
        label="National Insurance number"
        hint="For example, QQ 12 34 56 C"
        name="nationalInsuranceNumber"
        width={20}
      />
      <Button type="primary">Save and continue</Button>
    </>
  )
}
```

## API principles

- Ant Design-style props such as `items`, `options`, `value`, `onChange`, `status` and `type`.
- Semantic HTML and GOV.UK class names underneath.
- React owns interactive state; GOV.UK's DOM-mutating JavaScript is not initialised.
- Controlled and uncontrolled modes are supported where they are useful.
- GOV.UK Frontend is pinned to exactly `6.5.0`.

### Click behaviour

Link items use the exported `IClickBehaviour` interface. Both `href` and
`onClick` are optional. An item with `href` renders an anchor; its `onClick`
handler runs first and can call `event.preventDefault()` to stop navigation.
An item with only `onClick` renders a button. An item with neither renders
plain text.

```tsx
<ServiceNavigation items={[
  { label: 'Home', href: '/' },
  { label: 'Review', href: '/review', onClick: (event) => {
    if (hasUnsavedChanges) event.preventDefault()
  } },
  { label: 'Open help', onClick: () => setHelpOpen(true) },
]} />
```

## Components

Accordion, BackLink, Breadcrumbs, Button, CharacterCount, Checkboxes,
CookieBanner, DateInput, Details, ErrorMessage, ErrorSummary, ExitThisPage,
Feedback, Fieldset, FileUpload, Footer, GenericHeader, Header, Hint, Input,
InsetText, Label, LanguageNavigation, NotificationBanner, Pagination, Panel,
PasswordInput, PhaseBanner, Radios, SearchInput, Select, ServiceNavigation, SkipLink,
SummaryList, Table, Tabs, Tag, TaskList, Textarea and WarningText.

## Development

From the repository root:

```bash
pnpm install
pnpm --filter @kvzd-design/gov-uk build
pnpm --filter @kvzd-design/gov-uk lint
```

The package contains only reusable React components and their styles. Its build
output is written to `dist-lib`. The documentation website lives in the sibling
`gov-uk-pages` workspace package.
