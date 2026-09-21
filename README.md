# KVZD Design System

This repository is a pnpm workspace containing the GOV.UK React component library and its documentation website.

## Packages

- `gov-uk` — publishable `@kvzd-design/gov-uk` React component library.
- `gov-uk-pages` — private Vite documentation website that consumes the library through the workspace.

- `gov-uk-extends` — optional components published as `@kvzd-design/gov-uk-extends`.

## Development

```bash
pnpm install
pnpm dev
```

Build and lint the complete workspace with:

```bash
pnpm build
pnpm lint
```
