# KVZD Design System

This repository is a pnpm workspace containing the `@kevinzonda/design` React component library and its documentation website.

## Packages

- `kvzd-design` — publishable `@kevinzonda/design` package. Its `src/components` and `src/extraComponents` directories provide the two component groups.
- `kvzd-design-page` — private Vite documentation website that consumes the library through the workspace.
- `kvzd-kss` — publishable `@kevinzonda/kss` package: typed shorthand for React inline styles (`kss('mb0', 'fs19')` → `{ marginBottom: 0, fontSize: 19 }`).

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

## GitHub Pages

The [deployment workflow](.github/workflows/deploy-pages.yml) builds `kvzd-design-page` and publishes its `dist` directory on pushes to `main` or when run manually. In the repository's **Settings → Pages**, select **GitHub Actions** as the build and deployment source and set the custom domain to `design.kevinzonda.com`. This domain serves the site at `/`, so the workflow builds with a root base path.

To check the custom-domain build locally:

```bash
pnpm install --frozen-lockfile
pnpm build:pages
pnpm --filter @kevinzonda/design-page preview
```

## npm releases

The npm package is published from version tags through the `publish-npm.yml`
GitHub Actions workflow. Its Trusted Publisher is configured for
`KevinZonda/design`. The tag must match `kvzd-design/package.json`, for example
`v0.1.1` for version `0.1.1`.
