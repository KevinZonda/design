# Extra components

Optional React components for KVZD GOV.UK applications.

```bash
pnpm add @kevinzonda/design
```

Import the package stylesheet for both component groups:

```ts
import '@kevinzonda/design/style.css'
```

```tsx
import { FancyTabs } from '@kevinzonda/design/extraComponents'

<FancyTabs items={[
  { key: 'preview', label: 'Preview', children: <Preview /> },
  { key: 'react', label: 'React', children: <Code /> },
]} />
```

`FancyTabs` has the same props as `Tabs` from `@kevinzonda/design/components`.

Extension components accept `style` on their outer element. Composite
components such as `FancyTabs`, `Note`, `Sidebar`, `Dropdown` and `Modal` also
accept typed `styles` and `classNames` objects for their named inner parts.

`ShowcaseBox` presents a component or pattern with a heading, description,
preview content and optional footer. Its top accent uses
`--govuk-brand-colour`, so it follows the active theme.

```tsx
import { ShowcaseBox } from '@kevinzonda/design/extraComponents'

<ShowcaseBox
  title="Back link"
  description="Help users return to the previous step."
  footer={<a href="/components/back-link/">View documentation</a>}
>
  <BackLink href="/previous-step/">Back</BackLink>
</ShowcaseBox>
```

`Note` highlights supporting content with an optional title. It accepts normal `div` attributes and forwards its ref to the root element.

```tsx
import { Note } from '@kevinzonda/design/extraComponents'

<Note title="React implementation">
  <p>State changes stay inside React.</p>
</Note>
```

The `Sidebar` component renders a labelled navigation list in the documentation sidebar style. Items can contain nested `children` at any depth. By default, nested links stay visible and the active branch has one left border. An item without `href` or `onClick` is a group heading. Set `collapsible` to add independent expand and collapse controls to items with children; the ancestors of `currentKey` open automatically. An item with a link or click action and `children` gets a separate expand button in this mode. It accepts a custom link renderer for client-side routing:

```tsx
import { Sidebar } from '@kevinzonda/design/extraComponents'

<Sidebar
  heading="Documentation"
  currentKey="buttons"
  items={[
    { key: 'overview', label: 'Overview', href: '/overview/' },
    { key: 'components', label: 'Components', children: [
      { key: 'buttons', label: 'Buttons', href: '/buttons/' },
      { key: 'forms', label: 'Forms', href: '/forms/', children: [
        { key: 'errors', label: 'Errors', href: '/forms/errors/' },
      ] },
    ] },
  ]}
/>
```

`TagBox` displays short, neutral metadata such as a version number in an outlined box. It accepts standard `span` attributes and an optional `className`.

```tsx
import { TagBox } from '@kevinzonda/design/extraComponents'

<TagBox>6.5.1</TagBox>
```

`Divider` wraps the GOV.UK section break style in a semantic `<hr>`. It uses medium spacing and a visible line by default; choose `size="l"` or `size="xl"` for more space, or `visible={false}` for spacing only.

```tsx
import { Divider } from '@kevinzonda/design/extraComponents'

<Divider size="l" />
```

`Form` validates registered `Form.Item` fields on submission. It keeps native form inputs and displays inline errors plus a GOV.UK error summary. Each child field should accept `name`, `id`, and `error` props.

```tsx
import { Button, Input } from '@kevinzonda/design/components'
import { Form } from '@kevinzonda/design/extraComponents'

<Form onFinish={(values) => console.log(values)}>
  <Form.Item name="fullName" rules={[{ required: true, message: 'Enter your full name' }]}>
    <Input label="Full name" />
  </Form.Item>
  <Button htmlType="submit">Continue</Button>
</Form>
```

Use `multiple` on `Form.Item` for checkbox groups and `focusId` to point error summary links to the first choice. Form-level `validate` handles checks involving more than one field. Validation runs on submit so entered answers stay in place when a user needs to correct them.
