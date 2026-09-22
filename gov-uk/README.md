# @kvzd-design/gov-uk

React components based on GOV.UK Frontend **6.5.1**, with a compact API inspired by Ant Design.

## Install

```bash
pnpm add @kvzd-design/gov-uk govuk-frontend@6.5.1
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

## Buttons

Start buttons, disabled buttons and button groups use the GOV.UK Frontend styles:

```tsx
import { Button, ButtonGroup } from '@kvzd-design/gov-uk'

<Button href="/start" isStartButton>Start now</Button>
<ButtonGroup>
  <Button htmlType="submit" preventDoubleClick>Save and continue</Button>
  <Button type="secondary">Save as draft</Button>
</ButtonGroup>
<Button disabled>Disabled button</Button>
```

## API principles

- Ant Design-style props such as `items`, `options`, `value`, `onChange`, `status` and `type`.
- Semantic HTML and GOV.UK class names underneath.
- React owns interactive state; GOV.UK's DOM-mutating JavaScript is not initialised.
- Controlled and uncontrolled modes are supported where they are useful.
- GOV.UK Frontend is pinned to exactly `6.5.1`.

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

### Refs and event handlers

Components forward `ref` to their native element. Form components forward it
to the input, textarea or select so it can be focused directly. `Button`
forwards to an anchor when `href` is set and to a button otherwise. Grouped
fields forward their main `ref` to the fieldset; use `inputRefs` to access a
specific checkbox, radio or date input. Their `inputProps` pass native handlers
such as `onBlur` and `onFocus` to each input.

```tsx
import { useRef } from 'react'

function Example() {
  const emailRef = useRef<HTMLInputElement>(null)
  const dayRef = useRef<HTMLInputElement>(null)

  return <>
    <Input ref={emailRef} label="Email address" name="email" onBlur={validateEmail} />
    <DateInput inputRefs={{ day: dayRef }} inputProps={{ onBlur: validateDate }} />
  </>
}
```

Stateful components report changes through `onChange` (`Accordion`),
`onMenuToggle` (`ServiceNavigation`), `onVisibilityChange` (`PasswordInput`),
`onOpenChange` (`Feedback`) and native `onToggle` (`Details`).

## Components

Accordion, BackLink, Breadcrumbs, Button, ButtonGroup, CharacterCount, Checkboxes,
CookieBanner, DateInput, Details, ErrorMessage, ErrorSummary, ExitThisPage,
Feedback, Fieldset, FileUpload, Footer, FooterGovUk, Header, HeaderGovUk, Hint, Input,
InsetText, Label, LanguageNavigation, NotificationBanner, Pagination, Panel,
PasswordInput, PhaseBanner, Radios, SearchInput, Select, ServiceNavigation, SkipLink,
SummaryList, Table, Tabs, Tag, TaskList, Textarea and WarningText.

`Header` and `Footer` provide the generic versions. `HeaderGovUk` and
`FooterGovUk` compose them with GOV.UK branding and footer wording. Use `Header`
where older examples used `GenericHeader`.

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
