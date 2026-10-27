# Multi-Vendor E-Commerce Platform

A TypeScript-based multi-vendor e-commerce system built to demonstrate **Object-Oriented Programming (OOP)** principles through practical e-commerce business logic.

The project models customers, sellers, administrators, products, inventory, shopping carts, orders, checkout, simulated payments, discount coupons, and product reviews.

It focuses on clean class design, encapsulation, inheritance, polymorphism, abstraction, composition, and business-rule validation.

## Features

### User Management
- Abstract `User` class with shared account functionality.
- Specialized `Customer`, `Seller`, and `Admin` classes.
- Account lifecycle management: pending, active, suspended, and closed.
- Customer loyalty points.
- Seller store management.
- Administrator permission levels.

### Product Management
- Abstract `Product` class.
- Physical and digital product types.
- Product information and price management.
- Polymorphic delivery-cost calculations.
- Product ownership through seller IDs.

### Inventory Management
- Stock tracking for physical products.
- Stock addition and removal.
- Quantity validation.
- Stock availability checks during checkout.
- Stock restoration when checkout fails.

### Shopping Cart
- Customer-specific shopping carts.
- Add and remove products.
- Update quantities when adding existing products.
- Prevent duplicate product entries.
- Calculate cart totals.
- Clear shopping carts.
- Defensive copying to protect cart item state.

### Order Management
- Immutable purchase-item snapshots.
- Historical product prices preserved after purchase.
- Order subtotal, delivery fees, discounts, and final total.
- Order status lifecycle.
- Order history tracking.
- Seller-specific order summaries.

### Checkout and Payments
- Cart-to-order conversion.
- Inventory validation and reservation.
- Payment processing through a `PaymentGateway` interface.
- Simulated payment gateway for development.
- Payment status tracking.
- Simplified refund support.

### Discount Coupons
- Percentage-based discounts.
- Coupon expiration dates.
- Limited coupon usage.
- Discount validation and calculation.

### Product Reviews
- Product ratings from 1 to 5.
- Written customer reviews.
- Verified-purchase checks.
- Duplicate review prevention.
- Average product rating calculation.

## Tech Stack

| Technology | Purpose |
|---|---|
| TypeScript | Primary programming language |
| Node.js | JavaScript runtime |
| tsx | Execute TypeScript directly |
| Git | Version control |
| GitHub | Source code hosting |

## Object-Oriented Programming Concepts

The project demonstrates the four main pillars of OOP and additional software design techniques.

| Concept | Implementation |
|---|---|
| Encapsulation | Private properties, controlled methods, and validation |
| Inheritance | `Customer`, `Seller`, and `Admin` extend `User` |
| Abstraction | Abstract `User` and `Product` classes |
| Polymorphism | Different delivery calculations for physical and digital products |
| Composition | Shopping carts contain cart items; orders contain order items |
| Interfaces | `PaymentGateway` defines a payment-processing contract |
| Immutability | Order items preserve purchase-time product details |
| Dependency Injection | `CheckoutService` receives inventory and payment dependencies |

## Project Structure

The current implementation is organized in a single TypeScript file for learning and experimentation.

```text
multi-vendor-ecommerce-platform/
├── multi-vendor-e-commerce-platform.ts
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm

### Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/multi-vendor-ecommerce-platform.git
cd multi-vendor-ecommerce-platform
```

Replace `YOUR_USERNAME` with your GitHub username.

### Run the Project

Using `tsx`:

```bash
npx tsx multi-vendor-e-commerce-platform.ts
```

For automatic execution when files change:

```bash
npx tsx watch multi-vendor-e-commerce-platform.ts
```

The demonstration creates sample customers and products, processes a simulated checkout, updates order statuses, and submits a product review.

## Example Workflow

```text
Customer Registration
        |
        v
Account Activation
        |
        v
Browse Products
        |
        v
Add Products to Cart
        |
        v
Apply Discount Coupon
        |
        v
Checkout
        |
        v
Validate and Reserve Stock
        |
        v
Simulated Payment
        |
        v
Order Created and Paid
        |
        v
Order Processing
        |
        v
Shipping and Delivery
        |
        v
Product Review
```

## Example: Shopping Cart

```typescript
const cart = new ShoppingCart(customer);

cart.addProduct(physicalProduct, 2);
cart.addProduct(digitalProduct, 1);

console.log(cart.getTotal());

cart.removeProduct(physicalProduct.getProductDetails().id);
cart.clearCart();
```

## Example: Checkout

```typescript
const inventory = new InventoryCatalog();

inventory.register(new Inventory(physicalProduct, 10));

const gateway = new FakePaymentGateway();

const checkoutService = new CheckoutService(
  inventory,
  gateway,
);

const { order, payment } = await checkoutService.checkout(cart);

console.log(order.getStatus());
console.log(payment.getStatus());
console.log(order.getTotal());
```

The examples assume the referenced customer, products, and cart have already been created and validated.

## Design Decisions

### Immutable Order Items

Shopping cart items reference current product information, while order items preserve product details at purchase time.

This prevents historical order prices from changing when sellers update product prices.

### Payment Abstraction

Payment processing is defined through the `PaymentGateway` interface.

The current implementation uses `FakePaymentGateway`, allowing payment behavior to be demonstrated without integrating a real payment provider.

### Inventory Validation

Physical product stock is validated before checkout proceeds. The implementation reserves stock during checkout and attempts to restore it when checkout fails.

### Multi-Vendor Support

Products are associated with sellers through seller IDs. Orders can group purchased items by seller, providing a foundation for seller-specific order management.

## Current Limitations

This project is an **educational OOP implementation**, not a production-ready e-commerce backend.

- Data is stored in memory and is lost when the application exits.
- Payments and refunds are simulated.
- No database or HTTP API is implemented.
- No real authentication or authorization system is integrated.
- Inventory reservations are not protected by database transactions.
- Concurrent checkout and payment failure recovery require additional safeguards.
- Coupon redemption and refund workflows are simplified.
- Monetary calculations use integer cents for core order calculations, but the surrounding product and cart models still use regular JavaScript numbers.

## Future Improvements

- PostgreSQL database integration.
- REST API using NestJS.
- Persistent authentication and role-based authorization.
- Automated unit and integration tests.
- Database transactions for inventory and orders.
- Payment provider integration with webhooks and idempotency.
- Seller dashboards and order fulfillment workflows.
- Shipping and delivery tracking.
- More robust refunds, returns, and discount allocation.
- Frontend application using React.

## Learning Objectives

This project was created to strengthen practical TypeScript and software engineering skills, including:

- Designing reusable classes and interfaces.
- Modeling real-world business entities.
- Applying OOP principles to business logic.
- Enforcing validation and state transitions.
- Separating responsibilities between classes and services.
- Building extensible application architecture.
- Understanding the differences between educational implementations and production systems.

## License

No license has been specified for this repository.

---

**Built with TypeScript to practice Object-Oriented Programming through a real-world e-commerce domain.**
