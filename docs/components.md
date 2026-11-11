# Component trees

Rule used everywhere: props go down, events go up. The view owns the state; child components only display it and emit events.

Shared helpers: `src/utils/orderStatus.ts` (`nextStatus`, `canCancel`, `formatPrice`). Types are in `src/types.ts`, sample data in `src/data/`.

## Screen 1: Menu (`/menu`, wireframe 01)

```
MenuView
├── CategoryFilter
├── MenuItemCard (one per visible item)
└── CartSummary
```

| Component | Props | Events | State it owns |
|---|---|---|---|
| MenuView | none | none | `selectedCategoryId` (number or null), `cart` (CartLine[]), `confirmation` (string). Computed: `visibleItems` (available + matching category) |
| CategoryFilter | `categories: Category[]`, `selectedId: number \| null` | `select(categoryId: number \| null)` | none |
| MenuItemCard | `item: MenuItem` | `add(item: MenuItem)` | none |
| CartSummary | `lines: CartLine[]` | `remove(menuItemId: number)`, `place()` | none. Computed `total` is display only; the server calculates the real total |

## Screen 2: My orders (`/my-orders`, wireframe 02)

```
MyOrdersView
└── OrderCard (one per order)
    └── StatusBadge
```

| Component | Props | Events | State it owns |
|---|---|---|---|
| MyOrdersView | none | none | `orders` (Order[]). Computed `myOrders` (only the signed-in customer's orders) |
| OrderCard | `order: Order`, `menuItems: MenuItem[]`, `mode: 'customer' \| 'chef'` | `cancel(orderId)`, `advance(orderId)` | none |
| StatusBadge | `status: OrderStatus` | none | none |

In customer mode the Cancel button only shows while the status is `pending` (story 7).

## Screen 3: Chef queue (`/chef`, wireframe 03)

```
ChefQueueView
└── OrderCard (mode = "chef")
    └── StatusBadge
```

| Component | Props | Events | State it owns |
|---|---|---|---|
| ChefQueueView | none | none | `orders` (Order[]). Computed `activeOrders` (pending, preparing, ready) |
| OrderCard | same as above | `advance(orderId)` | none |

`advance` moves the status one step: pending, preparing, ready, completed (story 5). Ready orders stay in the queue so the chef can mark them completed.

## Screens 4 and 5 (wireframes only for now)

- **Login / register** (wireframe 04): will have `LoginView` owning the form state (`email`, `password`, `error`).
- **Admin menu** (wireframe 05): will have `AdminMenuView` owning the item list and the edit form, with `MenuItemRow` (props: `item`, `category`; events: `edit`, `delete`).

## M1 changes

Data now comes from json-server through `src/api/` and is kept in Pinia stores (`auth`, `menu`, `orders`). The views own only UI state (selected category, cart, form fields). Every page that loads data uses `StatePanel` for the loading, error, empty and success states.

New and changed pieces:

| Component | Props | Events | State it owns |
|---|---|---|---|
| StatePanel | `status: LoadStatus`, `error: string`, `isEmpty: boolean`, `emptyText: string` | `retry()` | none |
| CartSummary | `lines: CartLine[]`, `busy?: boolean` | `remove(menuItemId)`, `place()` | none |
| MenuItemCard | `item: MenuItem` | `add(item)` | none. Has a Details link to `/menu/:id` |
| MenuItemDetailView (`/menu/:id`) | `id: string` (route param) | none | `item`, `status`, `error` |
| LoginView (`/login`) | none | none | `email`, `password`, `touched`, `submitted`, `formError`, `busy` |
| NotFoundView (catch-all) | none | none | none |

Stores: `auth` (`user`, `login`, `logout`), `menu` (`items`, `categories`, `status`, `error`, `load`), `orders` (`orders`, `status`, `error`, `actionError`, `busy`, `load`, `place`, `cancel`, `advance`).

Router guard: `/my-orders` needs a logged-in user; `/chef` needs the chef or admin role.
