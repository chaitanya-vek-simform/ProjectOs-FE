# ProjectOS — Frontend

Enterprise-grade React frontend for ProjectOS. This package currently contains the
**Design System foundation** — the shared tokens, primitives and layout standards
that every feature module builds on. Architecture and conventions mirror the
`SimERP-frontend-reactjs` reference project.

## Tech stack

- **React 19** + **TypeScript** (strict)
- **Vite 7**
- **Tailwind CSS v4** (CSS-first config via `@theme inline`)
- **shadcn/ui** (new-york style, Radix primitives)
- **React Router v7**, **Redux Toolkit**, **React Query v5**, **Axios**
- **Sentry** for error monitoring
- **ESLint** (flat config) + **Prettier**

## Scripts

```bash
yarn dev          # start the dev server
yarn build        # type-check + production build
yarn lint         # lint
yarn prettier     # format check
```

## Design system

All design decisions live as tokens in [`src/index.css`](src/index.css). **No
component or page should hardcode a hex, rgb, oklch, font size, radius or shadow** —
consume them through Tailwind utilities (`bg-primary`, `text-muted-foreground`,
`rounded-xl`, `shadow-sm`) or `var(--token)`.

| Layer              | Location                                           |
| ------------------ | -------------------------------------------------- |
| Design tokens      | `src/index.css`                                    |
| shadcn config      | `components.json`                                  |
| UI primitives      | `src/components/ui/`                               |
| Typography         | `src/components/common/typography/`                |
| Layout wrappers    | `src/components/common/layout/`                    |
| App shell          | `src/layouts/MainLayout.tsx`                       |
| Utility helpers    | `src/lib/utils.ts`                                 |
| Living style guide | `src/components/common/design-system-showcase.tsx` |

### Token groups

- **Colors** — semantic (`--primary`, `--muted`, …) + brand red/violet scales + status badge palette
- **Typography** — Inter font family, `--text-xs`…`--text-5xl` scale, weight tokens
- **Radius** — `--radius` base drives `rounded-sm`…`rounded-4xl`
- **Shadows** — `--shadow-card` → `shadow-sm`
- **Chrome** — sidebar gradient, overlay, tooltip, alert surface tokens

### Adding a shadcn component

```bash
npx shadcn@latest add <component>
```

It reads `components.json` and drops the component into `src/components/ui/`.
