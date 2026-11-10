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
