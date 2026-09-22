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

## GitHub Pages

The [deployment workflow](.github/workflows/deploy-pages.yml) builds `gov-uk-pages` and publishes its `dist` directory on pushes to `main` or when run manually. In the repository's **Settings → Pages**, select **GitHub Actions** as the build and deployment source. The workflow uses the Pages base path, so project URLs such as `https://kevinzonda.github.io/design-system/` and custom domains both work.

To check the project-site build locally:

```bash
pnpm install --frozen-lockfile
SITE_BASE_PATH=/design-system pnpm build:pages
SITE_BASE_PATH=/design-system pnpm --filter @kvzd-design/gov-uk-pages preview
```
