# @kvzd-design/gov-uk-extends

Optional React components for KVZD GOV.UK applications.

```bash
pnpm add @kvzd-design/gov-uk @kvzd-design/gov-uk-extends
```

Import the base GOV.UK stylesheet first, followed by the extension stylesheet:

```ts
import '@kvzd-design/gov-uk/style.css'
import '@kvzd-design/gov-uk-extends/style.css'
```

```tsx
import { FancyTabs } from '@kvzd-design/gov-uk-extends'

<FancyTabs items={[
  { key: 'preview', label: 'Preview', children: <Preview /> },
  { key: 'react', label: 'React', children: <Code /> },
]} />
```

`FancyTabs` has the same props as `Tabs` from `@kvzd-design/gov-uk`.

`Note` highlights supporting content with an optional title. It accepts normal `div` attributes and forwards its ref to the root element.

```tsx
import { Note } from '@kvzd-design/gov-uk-extends'

<Note title="React implementation">
  <p>State changes stay inside React.</p>
</Note>
```

The `Sidebar` component renders a labelled navigation list in the documentation sidebar style. Items can contain nested `children` at any depth. By default, nested links stay visible and the active branch has one left border. An item without `href` or `onClick` is a group heading. Set `collapsible` to add independent expand and collapse controls to items with children; the ancestors of `currentKey` open automatically. An item with a link or click action and `children` gets a separate expand button in this mode. It accepts a custom link renderer for client-side routing:

```tsx
import { Sidebar } from '@kvzd-design/gov-uk-extends'

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
import { TagBox } from '@kvzd-design/gov-uk-extends'

<TagBox>6.5.1</TagBox>
```
