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

The `Sidebar` component renders a labelled navigation list in the documentation sidebar style. Items can contain nested `children` at any depth. By default, nested links stay visible and the active branch has one left border. An item without `href` or `onClick` is a group heading. Set `collapsible` to add independent expand and collapse controls to items with children; the ancestors of `activeKey` open automatically. An item with a link or click action and `children` gets a separate expand button in this mode. It accepts a custom link renderer for client-side routing:

```tsx
import { Sidebar } from '@kevinzonda/design/extraComponents'

<Sidebar
  heading="Documentation"
  activeKey="buttons"
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

`Divider` wraps the GOV.UK section break style in a semantic `<hr>`. It uses medium spacing and a visible line by default; choose `size="s"` for tighter spacing or `size="l"` / `size="xl"` for more space, or `visible={false}` for spacing only.

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

Use `multiple` on `Form.Item` for checkbox groups and `focusTargetId` to point error summary links to the first choice. Form-level `validate` handles checks involving more than one field. Validation runs on submit so entered answers stay in place when a user needs to correct them.

`Switch` is a binary toggle. It supports controlled (`checked`) and uncontrolled (`defaultChecked`) usage with `onChange`, plus `disabled`, `loading` (shows a spinner and blocks toggling), and `size` (`'s' | 'm' | 'l'`). The track can show text beside the knob via `checkedChildren` and `unCheckedChildren`. Give it an accessible name with the `label` prop, an `aria-label`, or string `children` (children are visually hidden).

```tsx
import { Switch } from '@kevinzonda/design/extraComponents'

<Switch defaultChecked onChange={(checked) => console.log(checked)}>
  Enable notifications
</Switch>
```

`Tooltip` shows a popup next to a single child element. It supports `placement` (`'top' | 'bottom' | 'left' | 'right'`, default `'top'`), `trigger` (`'hover' | 'focus' | 'click'`, default `'hover'`), and controlled (`open`) or uncontrolled (`defaultOpen`) usage with `onOpenChange`. When the title is plain text, the trigger element receives `aria-describedby` pointing at the popup while it is open.

```tsx
import { Tooltip } from '@kevinzonda/design/extraComponents'

<Tooltip title="Copy to clipboard" placement="bottom">
  <button type="button">Copy</button>
</Tooltip>
```


`Alert` is an antd-style inline alert with GOV.UK styling. It supports `type` (`'success' | 'info' | 'warning' | 'error'`, default `'info'`), an optional bold `title`, `children` as the message body, a secondary `description`, and `showIcon` (default `true`). Override the built-in type icon with `icon`. Error and warning alerts use `role="alert"`; success and info use `role="status"`. Set `closable` to show a close button (customise its content with `closeText` and its accessible label with `closeLabel`) and handle it with `onClose`.

```tsx
import { Alert } from '@kevinzonda/design/extraComponents'

<Alert type="success" title="Application submitted" closable onClose={() => console.log('closed')}>
  Your reference number is HDJ2123F.
</Alert>
```

`Steps` is an antd-style step bar. Pass `items` with `key`, `title`, optional `description`, `status`, `disabled` and `icon`. It supports controlled (`current`) and uncontrolled (`defaultCurrent`, default `0`) usage; clicking a step calls `onChange` with its index and disabled steps are not clickable. Steps before the current one render as finished unless they set an explicit `status`. The current step carries `aria-current="step"`. Use `direction` (`'horizontal' | 'vertical'`) and `size` (`'s' | 'm' | 'l'`) to change the layout.

```tsx
import { Steps } from '@kevinzonda/design/extraComponents'

<Steps
  current={1}
  onChange={(index) => console.log(index)}
  items={[
    { key: 'account', title: 'Account' },
    { key: 'details', title: 'Details', description: 'Enter your address' },
    { key: 'confirm', title: 'Confirm', disabled: true },
  ]}
/>
```

`Progress` is an antd-style progress bar. It takes `percent` (0-100, clamped automatically), `type` (`'line' | 'circle' | 'dashboard' | 'steps'`, default `'line'`), `status` (`'normal' | 'active' | 'success' | 'exception'`), `showInfo` (default `true`, renders the percentage), `size` (`'s' | 'm' | 'l'`) and `color` to override the bar or ring colour, plus `trailColor` and `strokeWidth` for the track and stroke. A full bar automatically becomes `success`. The bar exposes `role="progressbar"` with matching `aria-valuenow`; the `active` status animates a moving stripe unless the user prefers reduced motion.

```tsx
import { Progress } from '@kevinzonda/design/extraComponents'

<Progress percent={45} status="active" />
```

`Result` presents the outcome of a page-level operation such as a submitted application or a failed payment. Pass a `status` (`'success' | 'error' | 'info' | 'warning' | '403' | '404' | '500'`), a required `title`, `extra` actions and any supporting `children`. Each status renders a matching icon unless you override it with `icon`. Error and warning results use the alert role so they are announced immediately.

```tsx
import { Result } from '@kevinzonda/design/extraComponents'

<Result
  status="success"
  title="Application submitted"
  extra={<Button onClick={viewStatus}>View status</Button>}
>
  Reference KZ-2026-0917
</Result>
```
```

`Avatar` displays a user or entity as an image, initials or a fallback icon. Pass `src` for an image (if it fails to load the fallback shows instead), text `children` for initials, or nothing for a generic person icon. Use `shape` (`'circle' | 'square'`), `size` (a named `'s' | 'm' | 'l' | 'xl'`, a pixel number, or a CSS size such as `'2rem'`) and `bgColor` / `color` to match your context.

```tsx
import { Avatar } from '@kevinzonda/design/extraComponents'

<Avatar src="/team/ada.png" alt="Ada Lovelace" size="l" />
<Avatar shape="square" bgColor="#000000">AK</Avatar>
```

`CodeBox` renders a bordered code block with syntax highlighting. Pass raw
`code` (and optionally `lang`) and the component highlights it on demand with
Shiki; or pass `highlightedHtml` produced at build time to skip the runtime
highlighter entirely. Use `theme` to pick a Shiki theme (default
`'github-light'`), `showLineNumbers` to add a line-number gutter, and `title`
to render a heading above the block. The default uses a white background and
GitHub Light token colours, so it fits GOV.UK pages without a dark panel.

```tsx
import { CodeBox } from '@kevinzonda/design/extraComponents'

<CodeBox code={`<Button onClick={save}>Save and continue</Button>`} lang="tsx" />
```

`Grid` lays out page content in columns and is a thin wrapper over the GOV.UK
grid. `Row` renders the `govuk-grid-row` class; `Col` renders
`govuk-grid-column-<width>` for one of six fractions (`'full'`, `'one-half'`,
`'one-third'`, `'two-thirds'`, `'one-quarter'`, `'three-quarters'`). Set
`fromDesktop` on a column to use the `-from-desktop` variant, which spans the
full row below the desktop breakpoint.

```tsx
import { Col, Row } from '@kevinzonda/design/extraComponents'

<Row>
  <Col width="one-third">Sidebar</Col>
  <Col width="two-thirds">Main content</Col>
</Row>
```

`Card` groups related content in a container with an optional header, body and
footer. Pass `title` for the header heading and `extra` for right-aligned
header content; `children` render in the body and `actions` render in a footer
separated by a top border. Set `hoverable` to highlight the border with the
brand colour on hover. Use `Panel` instead when showing the confirmed result of
a transaction.

```tsx
import { Card } from '@kevinzonda/design/extraComponents'

<Card title="Application overview" extra={<Tag>Active</Tag>} hoverable actions={<a href="#">Attach a file</a>}>
  Reference KZ-2026-0917 was submitted on 12 September 2026.
</Card>
```

`Calendar` picks a single day from a month view. The selected day and the
visible month can each be controlled (`value`, `month`) or left internal
(`defaultValue`, `defaultMonth`). Arrow keys move by day or week, Home/End jump
to the ends of the week, and PageUp/PageDown move by month or, with Shift, by
year. `min` and `max` disable out-of-range days, `dateCellRender` adds a marker
in the corner of a day cell, and `locale` controls the weekday and month names.
Pair it with `DateInput` when the user already knows the date.

```tsx
import { Calendar } from '@kevinzonda/design/extraComponents'

const [selected, setSelected] = useState<Date | null>(null)
return <Calendar value={selected} onChange={setSelected} />
```

`Transfer` moves items between a source and a target list. Items carry a `key`
with optional `label`, `description` and `disabled`; disabled items cannot be
checked or moved. `targetKeys` and `selectedKeys` support controlled usage, and
`onChange` reports the next target keys, the direction and the moved keys. Set
`showSearch` to filter both lists with `filterOption` (default: case-insensitive
label match). The move buttons are a green Add (▶) that moves checked items to
the target and a red Remove (◀) that moves them back; `operations` only changes
their labels, not the direction triangles. A one-way mode is not supported yet.

```tsx
import { Transfer } from '@kevinzonda/design/extraComponents'

<Transfer
  dataSource={[
    { key: 'passport', label: 'Passport', description: 'Certified copy of the photo page' },
    { key: 'dbs', label: 'DBS check', description: 'Basic disclosure certificate', disabled: true },
  ]}
  titles={['Available documents', 'Documents to upload']}
  showSearch
/>
```

`Slider` picks a single value or a `[lower, upper]` range from a track. Set
`range` for two handles that cannot pass each other, `marks` for labelled tick
marks under the track, and `tooltip` to control when the current value bubble
shows. Values can be controlled (`value`) or left internal (`defaultValue`).
Give the native inputs a `name` to include the slider in form submissions; in
`range` mode the handles submit as `<name>-lower` and `<name>-upper`.
GOV.UK advises sliders only for approximate values; when the user must enter a
precise value, use `Input` or `Select` instead.

```tsx
import { Slider } from '@kevinzonda/design/extraComponents'

const [budget, setBudget] = useState<[number, number]>([20, 80])
return <Slider
  ariaLabel="Budget"
  range
  min={0}
  max={100}
  marks={[{ value: 0, label: '£0' }, { value: 50, label: '£50' }, { value: 100, label: '£100' }]}
  value={budget}
  onChange={(value) => setBudget(value as [number, number])}
/>
```

`TimePicker` enters or picks a time of day in 24-hour `HH:mm` format. The
input accepts loose `H:mm` text and normalises it when uncontrolled; focusing
the input or pressing the clock toggle opens a two-column hour and minute
panel trimmed by `hourStep` and `minuteStep`. Arrow keys move between options
and Escape closes the panel. Use separate hour and minute `Select` components
when users must enter a memorable or approximate time, or a 12-hour AM/PM
format.

```tsx
import { TimePicker } from '@kevinzonda/design/extraComponents'

const [time, setTime] = useState('09:30')
return <TimePicker label="Appointment time" hint="For example, 09:30" value={time} onChange={setTime} minuteStep={15} allowClear />
```
