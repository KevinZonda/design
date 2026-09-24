# @kevinzonda/design

React components based on GOV.UK Frontend **6.5.1**, with a compact API inspired by Ant Design.

## Install

```bash
pnpm add @kevinzonda/design
```

## Usage

```tsx
import { Button, Input } from '@kevinzonda/design/components'
import '@kevinzonda/design/style.css'

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
import { Button, ButtonGroup } from '@kevinzonda/design/components'

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
- These components do not output GOV.UK `data-module` markers. Do not initialise
  GOV.UK Frontend JavaScript on their DOM nodes; the React components own those
  interactions.
- Controlled and uncontrolled modes are supported where they are useful.
- GOV.UK Frontend is pinned to exactly `6.5.1`.

### Styling

Every component accepts a React `style` object on its primary element. For
form controls such as `Input`, `SearchInput` and `Textarea`, that element is the
native input or textarea; for grouped choices it is the fieldset. Existing
`className` props retain their current targets.

Composite components including `Input`, `SearchInput`, `Panel`, `Tabs`,
`Header`, `ServiceNavigation`, `Footer`, `Table`, `SummaryList` and `TaskList`
also expose `styles` and `classNames` objects. Their typed keys name the part
being customised. `style` takes precedence over `styles.root`.

```tsx
<Input
  label="Reference number"
  style={{ width: 240 }}
  styles={{ root: { marginBottom: 20 }, label: { fontWeight: 700 } }}
  classNames={{ input: 'reference-input' }}
/>

<Panel
  title="Application complete"
  styles={{ body: { maxWidth: 480 } }}
>
  Your reference number is HDJ2123F.
</Panel>

<SummaryList
  items={[{ key: 'Name', value: 'Sarah Philips' }]}
  styles={{ key: { width: 180 }, value: { maxWidth: 480 } }}
/>
```

Use CSS classes for responsive and interaction states; inline styles are best
for values that depend on runtime data.

### Theme colours

`ThemeProvider` overrides the GOV.UK colour variables for its descendants. The
palette is partial, so omitted colours inherit from a parent provider or retain
the defaults from GOV.UK Frontend. Providers can be nested to theme one section
of an application.

```tsx
import { ThemeProvider, type Theme } from '@kevinzonda/design'
import '@kevinzonda/design/style.css'

const palette = {
  brand: '#005ea5',
  link: '#005ea5',
  focus: '#ffdd00',
  surfaceBackground: '#f3f2f1',
} satisfies Partial<Theme.ColourPalette>

<ThemeProvider palette={palette}>
  <App />
</ThemeProvider>
```

The provider forwards its ref and standard `div` attributes to its scoped root.
Use `Theme.ColourPalette` when defining a complete palette and
`Partial<Theme.ColourPalette>` for an override.

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

### Cookie consent and emergency exit

`CookieBanner` saves an accepted or rejected choice in a first-party cookie for
one year. It shows a focusable confirmation message after a choice, and hides
it when the user selects **Hide cookie message**. On a return visit it stays
hidden. Use `cookieName` when multiple services share a host; use
`onConsentChange` to learn the saved choice on mount and after a new choice.
Only load non-essential cookies when the choice is `accepted`. Supply a link
to your service's cookie settings with `settingsHref`.

```tsx
<CookieBanner
  cookieName="my_service_cookie_consent"
  settingsHref="/cookies"
  onConsentChange={(choice) => setAnalyticsEnabled(choice === 'accepted')}
>
  We use analytics cookies to understand how you use this service.
</CookieBanner>
```

`ExitThisPage` uses a normal link to a neutral destination so it still works
without JavaScript. With JavaScript, clicking it, focusing its secondary link
or pressing Shift three times within five seconds hides the current page and
navigates in the same tab. Render only one instance per page. It does not erase
browser history; follow the GOV.UK “Exit a page quickly” pattern when using it
in a sensitive service.

```tsx
<ExitThisPage href="https://www.bbc.co.uk/weather" />
```

The package also includes [extra components](EXTRA_COMPONENTS.md) such as
`Modal`, `Form`, `FancyTable` and `Dropdown`. Import them from
`@kevinzonda/design/extraComponents`, or import both groups from
`@kevinzonda/design`.

### Migrating existing imports

- Replace `@kvzd-design/gov-uk` with `@kevinzonda/design/components`.
- Replace `@kvzd-design/gov-uk-extends` with `@kevinzonda/design/extraComponents`.
- Replace the two old stylesheet imports with one import of
  `@kevinzonda/design/style.css`.

## Development

From the repository root:

```bash
pnpm install
pnpm --filter @kevinzonda/design build
pnpm --filter @kevinzonda/design lint
```

The package contains reusable React components and their styles. Its build
output is written to `dist-lib`. The documentation website lives in the sibling
`kvzd-design-page` workspace package.
