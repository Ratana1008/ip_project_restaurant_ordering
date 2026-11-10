# Restaurant Ordering System

Vue 3 + TypeScript + Vue Router + Pinia + Vitest + ESLint + Prettier.

## Repository layout
```
docs/proposal.md        revised proposal (M0 feedback applied)
docs/wireframes/        5 wireframes (SVG)
docs/components.md      component trees: props, events, state owners
frontend/               the Vue app
  src/types.ts          entities
  src/data/             hard-coded sample data
  src/views/            MenuView, MyOrdersView, ChefQueueView
  src/components/       CategoryFilter, MenuItemCard, CartSummary, OrderCard, StatusBadge
```

## Run it
```
cd frontend
npm install
npm run dev
npm run test:unit
npm run lint
npm run type-check
```

## Git steps for this milestone
```
git checkout -b frontend-setup
git add docs README.md && git commit -m "Add revised proposal, wireframes and component docs"
git add frontend && git commit -m "Scaffold Vue app and add types and sample data"
git push -u origin frontend-setup
```
Then open a pull request on GitHub and merge it. Tip: make more, smaller commits (for example one per component) so your history shows the work in steps.
