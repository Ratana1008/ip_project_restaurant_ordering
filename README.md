# Restaurant Ordering System

Vue 3 + TypeScript + Vue Router + Pinia + Vitest + ESLint + Prettier.

## Repository layout

```
docs/proposal.md        revised proposal (M0 feedback applied)
docs/wireframes/        5 wireframes (SVG)
docs/components.md      component trees: props, events, state owners
frontend/               the Vue app
  db.json               fake API data (json-server)
  src/types.ts          entities
  src/api/              http.ts + one file per resource
  src/stores/           auth, menu, orders (Pinia)
  src/views/            MenuView, MyOrdersView, ChefQueueView
  src/components/       CategoryFilter, MenuItemCard, CartSummary, OrderCard, StatusBadge
```

## How to run it

You need two terminals, both inside `frontend/`.

```
npm install
npm run api      # terminal 1: json-server on http://localhost:3000 (reads db.json)
npm run dev      # terminal 2: the Vue app on http://localhost:5173
```

Other commands: `npm run test:unit`, `npm run lint`, `npm run type-check`.

The API URL can be changed with `VITE_API_URL` (see `frontend/.env.example`).

Demo accounts (any password of 8+ characters): `sokha@example.com` (customer), `vanna@example.com` (chef), `ratana@example.com` (admin).

To reset the data, restore it with `git checkout frontend/db.json`.

## API (json-server)

`db.json` has one array per entity: `users`, `categories`, `menuItems`, `orders`, `orderItems`. They link by ids (`menuItems.categoryId`, `orders.userId`, `orderItems.orderId`, `orderItems.menuItemId`). Orders are read with `?_embed=orderItems`. One file per resource is in `src/api/`, all built on `src/api/http.ts`.

## Git steps for M1

```
git checkout main
git pull
git checkout -b api-routing-stores
# commit in small steps, then:
git push -u origin api-routing-stores
```

Open a pull request on GitHub and merge it. Then tag the merged result:

```
git checkout main
git pull
git tag -a m1 -m "M1"
git push --follow-tags
```

Use `-a` (an annotated tag): `--follow-tags` only pushes annotated tags. If you already made a plain `git tag m1`, run `git push origin m1` instead.
