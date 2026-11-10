# Restaurant Ordering System (revised after M0 feedback)

## Problem
Small restaurants often take orders on paper or by shouting to the kitchen, so orders get lost, mixed up or delayed. Customers do not know the status of their food, and chefs do not have one clear list of what to cook next.

## Users and roles
- Customer: browses the menu, places orders, tracks order status, and cancels an order that is still pending.
- Chef: sees incoming orders and updates their status (preparing, ready, completed).
- Admin: manages categories and menu items (add, edit, delete), owns the `isAvailable` flag, and sees all orders.

## User stories
1. As a customer, I want to register and log in so that I have my own account.
   Accepted when: email is unique; password is at least 8 characters and stored hashed; wrong credentials show a clear error.
2. As a customer, I want to browse the menu by category so that I can choose what to eat.
   Accepted when: only available items are shown; items can be filtered by category; an empty category shows a "no items" message.
3. As a customer, I want to place an order with several items so that I can get my meal in one go.
   Accepted when: an order has at least 1 item and each quantity is 1 or more; unavailable items are rejected with a 400; the server calculates the total from current prices; the new order starts as pending.
4. As a customer, I want to see my own orders and their status so that I know when my food is ready.
   Accepted when: I only see my own orders; each order shows items, total and status.
5. As a chef, I want to see incoming orders and update their status so that I know what to cook next.
   Accepted when: the chef sees active orders (pending, preparing, ready); status moves only in this order: pending, preparing, ready, completed; customers get 403 on this action.
6. As an admin, I want to add, edit and delete categories and menu items so that the menu stays up to date.
   Accepted when: invalid data returns a 400 with a clear message; a menu item used in past orders is hidden instead of deleted; customers and chefs get 403.
7. As a customer, I want to cancel my order while it is still pending so that I can fix a mistake.
   Accepted when: only the owner can cancel; an order that is already preparing cannot be cancelled (409).
8. As an admin, I want to see all orders and a simple daily summary so that I can follow sales.

## Which story did you cut, and why?
Story 9 ("chef marks a menu item as sold out") is cut. It overlaps with story 6, where the admin already manages `isAvailable`, and two roles editing the same flag adds permission rules (and more 403 cases to test) for little value. The admin is the single owner of `isAvailable`. If time allows after the MVP, it can come back as a small extra.

## MVP scope
Must have: stories 1, 2, 3, 4, 5, 6, 7
Nice to have: story 8

## Entities
| Entity | Main attributes | Relations |
|---|---|---|
| User | name, email, passwordHash, role (customer, chef or admin) | has many Orders |
| Category | name | has many MenuItems |
| MenuItem | name, description, price, isAvailable | belongs to one Category; has many OrderItems |
| Order | status, total, createdAt | belongs to one User; has many OrderItems |
| OrderItem | quantity, unitPrice | belongs to one Order; belongs to one MenuItem |

Ownership of `isAvailable`: admin only (story 6).

## Stretch feature
Chosen: real-time.
Build order: first build the whole order flow with plain REST and polling (the customer and chef screens re-fetch every few seconds). In week 12, replace polling with WebSockets so that a status change reaches the customer immediately and new orders appear on the chef screen without refreshing.

## Repository
https://github.com/Ratana1008/ip_project_restaurant_ordering
