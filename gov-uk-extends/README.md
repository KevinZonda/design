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

The `Sidebar` component renders a labelled navigation list in the documentation sidebar style. It accepts a custom link renderer for client-side routing:

```tsx
import { Sidebar } from '@kvzd-design/gov-uk-extends'

<Sidebar
  heading="Documentation"
  currentKey="buttons"
  items={[
    { key: 'overview', label: 'Overview', href: '/overview/' },
    { key: 'buttons', label: 'Buttons', href: '/buttons/' },
  ]}
/>
```
