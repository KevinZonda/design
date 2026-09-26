# @kevinzonda/kss

Typed shorthand for React inline styles.

```tsx
import { kss } from '@kevinzonda/kss'

<Text style={kss('mb0')}>Small</Text>
// → { marginBottom: 0 }

<Button style={kss('mb0', loading && 'fs19')}>Save</Button>
// → { marginBottom: 0, fontSize: 19 } while loading,
//    { marginBottom: 0 } otherwise
```

`kss()` returns a plain `CSSProperties` object, so it works anywhere a React
`style` object is accepted — including the `styles` slots of
`@kevinzonda/design` components (`styles={{ root: kss('mb0') }}`).

## Tokens

Numbers are pixel values.

| Token | Property |
| --- | --- |
| `m15` | `margin: 15` |
| `mt20` / `mb0` / `ml8` / `mr8` | `marginTop` / `marginBottom` / `marginLeft` / `marginRight` |
| `mx12` / `my16` | left+right / top+bottom |
| `p24` / `pt12` / `pb0` / `pl8` / `pr8` / `px20` / `py16` | padding equivalents |
| `mt-20` | negative margins are allowed |
| `fs19` | `fontSize: 19` |
| `w370` / `h40` | `width` / `height` |

Falsy arguments are skipped, which enables conditional tokens:
`kss('mb0', loading && 'fs19')`.

Results are cached by token list; identical calls return the same object.
Unknown tokens throw at runtime (the TypeScript types reject them at compile
time).

## Development

From the repository root:

```bash
pnpm install
pnpm --filter @kevinzonda/kss build
pnpm --filter @kevinzonda/kss test
```
