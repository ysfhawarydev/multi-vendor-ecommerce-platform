interface UserDetails {
  id: string;
  name: string;
  email: string;
  accountStatus: AccountStatus;
}

enum AccountStatus {
  Active,
  Pending,
  Suspended,
  Closed,
}

abstract class User {
  private readonly id: string;
  private name: string;
  private email: string;
  private accountStatus: AccountStatus;

  protected constructor(id: string, name: string, email: string) {
    this.validateId(id);

    this.validateName(name);

    this.validateEmail(email);

    this.id = id.trim();
    this.name = name.trim();
    this.email = email.trim();
    this.accountStatus = AccountStatus.Pending;
  }

  getDetails(): UserDetails {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      accountStatus: this.accountStatus,
    };
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getAccountStatus(): AccountStatus {
    return this.accountStatus;
  }

  private validateId(id: string): void {
    if (id.trim() === "") throw new Error("Id cannot be empty");
  }

  private validateEmail(email: string): void {
    if (
      email.trim() === "" ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())
    )
      throw new Error(
        "Email cannot be empty and must be like user@example.com",
      );
  }

  private validateName(name: string): void {
    if (name.trim() === "") throw new Error("Name cannot be empty");
  }

  private ensureAccountIsNotClosed(): void {
    if (this.accountStatus === AccountStatus.Closed)
      throw new Error("Cannot update for closed accounts");
  }

  updateName(name: string): void {
    this.validateName(name);

    this.ensureAccountIsNotClosed();

    this.name = name.trim();
  }

  updateEmail(email: string): void {
    this.validateEmail(email);

    this.ensureAccountIsNotClosed();

    this.email = email.trim();
  }

  activate(): void {
    if (this.accountStatus !== AccountStatus.Pending)
      throw new Error("Account must be pending to activate it");

    this.accountStatus = AccountStatus.Active;
  }

  suspend(): void {
    if (this.accountStatus !== AccountStatus.Active)
      throw new Error("Account must be active to suspend it");

    this.accountStatus = AccountStatus.Suspended;
  }

  reactivate(): void {
    if (this.accountStatus !== AccountStatus.Suspended)
      throw new Error("Account must be suspended to reactivate it");

    this.accountStatus = AccountStatus.Active;
  }

  close(): void {
    if (
      this.accountStatus !== AccountStatus.Active &&
      this.accountStatus !== AccountStatus.Pending &&
      this.accountStatus !== AccountStatus.Suspended
    )
      throw new Error(
        "Account must be active or pending or suspended to close it",
      );

    this.accountStatus = AccountStatus.Closed;
  }
}

class Customer extends User {
  private loyaltyPoints: number;

  constructor(id: string, name: string, email: string) {
    super(id, name, email);
    this.loyaltyPoints = 0;
  }

  readLoyaltyPoints(): number {
    return this.loyaltyPoints;
  }

  private ensureCustomerIsActive(): void {
    if (this.getAccountStatus() !== AccountStatus.Active)
      throw new Error("Customer Account must be active");
  }

  earnLoyaltyPoints(loyaltyPoints: number): void {
    this.ensureCustomerIsActive();

    if (
      !Number.isFinite(loyaltyPoints) ||
      loyaltyPoints <= 0 ||
      !Number.isInteger(loyaltyPoints)
    )
      throw new Error("Loyalty points must be number and greater than zero");

    this.loyaltyPoints += loyaltyPoints;
  }

  redeemLoyaltyPoints(loyaltyPoints: number): void {
    this.ensureCustomerIsActive();

    if (
      !Number.isFinite(loyaltyPoints) ||
      loyaltyPoints <= 0 ||
      !Number.isInteger(loyaltyPoints) ||
      loyaltyPoints > this.loyaltyPoints
    )
      throw new Error(
        "Loyalty points must be number and greater than zero and not greater than the customer's points",
      );

    this.loyaltyPoints -= loyaltyPoints;
  }
}

interface StoreDetails {
  storeName: string;
  storeDescription: string;
}

class Seller extends User {
  private storeName: string;
  private storeDescription: string;
  private salesCount: number;

  constructor(
    id: string,
    name: string,
    email: string,
    storeName: string,
    storeDescription: string,
  ) {
    super(id, name, email);

    this.validateStoreName(storeName);

    this.storeName = storeName.trim();
    this.storeDescription = storeDescription.trim();
    this.salesCount = 0;
  }

  storeDetails(): StoreDetails {
    return {
      storeName: this.storeName,
      storeDescription: this.storeDescription,
    };
  }

  readSalesCount(): number {
    return this.salesCount;
  }

  private validateStoreName(storeName: string): void {
    if (storeName.trim() === "") throw new Error("Store name cannot be empty");
  }

  private ensureSellerIsActive(): void {
    if (this.getAccountStatus() !== AccountStatus.Active)
      throw new Error("Seller account must be active");
  }

  updateStoreName(storeName: string): void {
    this.ensureSellerIsActive();

    this.validateStoreName(storeName);

    this.storeName = storeName.trim();
  }

  updateStoreDescription(storeDescription: string): void {
    this.ensureSellerIsActive();

    this.storeDescription = storeDescription.trim();
  }
}

enum AdminLevel {
  Support,
  Manager,
  SuperAdmin,
}

class Admin extends User {
  private adminLevel: AdminLevel;

  constructor(id: string, name: string, email: string, adminLevel: AdminLevel) {
    super(id, name, email);

    if (
      adminLevel !== AdminLevel.Manager &&
      adminLevel !== AdminLevel.SuperAdmin &&
      adminLevel !== AdminLevel.Support
    )
      throw new Error("Access denied!");

    this.adminLevel = adminLevel;
  }

  readAdminLevel(): AdminLevel {
    return this.adminLevel;
  }

  private ensureAdminIsActive(): boolean {
    if (this.getAccountStatus() !== AccountStatus.Active) return false;

    return true;
  }

  canAdminManageUserAccounts(): boolean {
    if (!this.ensureAdminIsActive()) return false;

    if (
      this.adminLevel !== AdminLevel.Manager &&
      this.adminLevel !== AdminLevel.SuperAdmin
    )
      return false;

    return true;
  }
}

interface ProductDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
}

abstract class Product {
  private readonly id: string;
  private name: string;
  private description: string;
  private price: number;
  private readonly sellerId: string;

  protected constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    sellerId: string,
  ) {
    this.validateProductId(id);
    this.validateProductName(name);
    this.validatePrice(price);
    this.validateSellerId(sellerId);

    this.id = id.trim();
    this.name = name.trim();
    this.description = description.trim();
    this.price = price;
    this.sellerId = sellerId.trim();
  }

  getProductDetails(): ProductDetails {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      sellerId: this.sellerId,
    };
  }

  private validateProductId(id: string): void {
    if (id.trim() == "") throw new Error("Id cannot be empty");
  }

  private validateProductName(name: string): void {
    if (name.trim() === "") throw new Error("Product name Cannot be empty");
  }

  private validateSellerId(sellerId: string): void {
    if (sellerId.trim() === "") throw new Error("Seller id cannot be empty");
  }

  private validatePrice(price: number): void {
    if (!Number.isFinite(price) || price <= 0)
      throw new Error("Price must be finite and greater than zero");
  }

  updateProductName(name: string): void {
    this.validateProductName(name);

    this.name = name.trim();
  }

  updateProductDescription(description: string): void {
    this.description = description.trim();
  }

  updatePrice(price: number): void {
    this.validatePrice(price);

    this.price = price;
  }

  abstract calculateDeliveryCost(): number;
}

class PhysicalProduct extends Product {
  private weightKg: number;

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    sellerId: string,
    weightKg: number,
  ) {
    super(id, name, description, price, sellerId);

    this.validateWeightKg(weightKg);

    this.weightKg = weightKg;
  }

  getWeightKg(): number {
    return this.weightKg;
  }

  private validateWeightKg(weightKg: number): void {
    if (!Number.isFinite(weightKg) || weightKg <= 0)
      throw new Error("Weight must be finite and greater than zero");
  }

  calculateDeliveryCost(): number {
    return 5 + this.weightKg * 2;
  }
}

class DigitalProduct extends Product {
  private downloadUrl: string;

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    sellerId: string,
    downloadUrl: string,
  ) {
    super(id, name, description, price, sellerId);

    this.validateDownloadUrl(downloadUrl);

    this.downloadUrl = downloadUrl.trim();
  }

  getDownloadUrl(): string {
    return this.downloadUrl;
  }

  private validateDownloadUrl(downloadUrl: string): void {
    if (downloadUrl.trim() === "")
      throw new Error("Download url cannot be empty");
  }

  calculateDeliveryCost(): number {
    return 0;
  }
}

const physicalProduct1 = new PhysicalProduct(
  "1",
  "Headphones",
  "good quality",
  100,
  "1",
  1,
);

const physicalProduct2 = new PhysicalProduct(
  "2",
  "Laptop",
  "great quality",
  1000,
  "2",
  10,
);

const digitalProduct1 = new DigitalProduct(
  "3",
  "E-book",
  "high quality",
  20,
  "3",
  "ebook.com",
);

const digitalProduct2 = new DigitalProduct(
  "4",
  "Software license",
  "very good quality",
  50,
  "4",
  "softwarelicence.com",
);

let products: Product[] = [];

products.push(
  physicalProduct1,
  physicalProduct2,
  digitalProduct1,
  digitalProduct2,
);

for (let i = 0; i < products.length; i++) {
  const product = products[i];

  const details = product.getProductDetails();
  const deliveryCost = product.calculateDeliveryCost();

  const totalPrice = details.price + deliveryCost;

  console.log(
    `${details.name} | Price: $${details.price} | Delivery: $${deliveryCost} | Total: $${totalPrice}`,
  );
}

class Inventory {
  private readonly product: PhysicalProduct;
  private quantity: number;

  constructor(product: PhysicalProduct, quantity: number) {
    this.validateQuantity(quantity);

    this.product = product;
    this.quantity = quantity;
  }

  getProduct(): PhysicalProduct {
    return this.product;
  }

  getQuantity(): number {
    return this.quantity;
  }

  private validateQuantity(quantity: number): void {
    if (!Number.isSafeInteger(quantity) || quantity < 0)
      throw new Error("Initial quantity must be a non-negative safe integer");
  }

  private validateStockAmount(amount: number): void {
    if (!Number.isSafeInteger(amount) || amount <= 0)
      throw new Error("Stock amount must be a positive safe integer");
  }

  addStock(amount: number): void {
    this.validateStockAmount(amount);

    const newQuantity = this.quantity + amount;

    if (!Number.isSafeInteger(newQuantity))
      throw new Error("Stock quantity exceeds the safe integer limit");

    this.quantity = newQuantity;
  }

  removeStock(amount: number): void {
    this.validateStockAmount(amount);

    if (amount > this.quantity) throw new Error("Cannot remove this amount");

    this.quantity -= amount;
  }
}

const inventory = new Inventory(physicalProduct1, 10);

console.log("Initial stock:", inventory.getQuantity());

inventory.addStock(5);
console.log("After adding 5:", inventory.getQuantity());

inventory.removeStock(3);
console.log("After removing 3:", inventory.getQuantity());

inventory.removeStock(12);
console.log("After removing 12:", inventory.getQuantity());

try {
  inventory.removeStock(1);
} catch (error) {
  if (error instanceof Error) {
    console.log("Expected error:", error.message);
  }
}

class CartItem {
  private readonly product: Product;
  private quantity: number;

  constructor(product: Product, quantity: number) {
    this.validateQuantity(quantity);

    this.product = product;
    this.quantity = quantity;
  }

  getProduct(): Product {
    return this.product;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getSubtotal(): number {
    return this.product.getProductDetails().price * this.quantity;
  }

  private validateQuantity(quantity: number): void {
    if (!Number.isSafeInteger(quantity) || quantity <= 0)
      throw new Error("Cart item quantity must be a positive safe integer");
  }

  updateQuantity(quantity: number): void {
    this.validateQuantity(quantity);

    this.quantity = quantity;
  }
}

const cartItem = new CartItem(physicalProduct1, 3);

console.log("Product:", cartItem.getProduct().getProductDetails().name);
console.log("Quantity:", cartItem.getQuantity());
console.log("Subtotal:", cartItem.getSubtotal());

cartItem.updateQuantity(5);

console.log("Updated quantity:", cartItem.getQuantity());
console.log("Updated subtotal:", cartItem.getSubtotal());

try {
  cartItem.updateQuantity(0);
} catch (error) {
  if (error instanceof Error) {
    console.log("Expected error:", error.message);
  }
}

class ShoppingCart {
  private readonly customer: Customer;
  private items: CartItem[];

  constructor(customer: Customer) {
    this.customer = customer;
    this.items = [];
  }

  getCustomer(): Customer {
    return this.customer;
  }

  getItems(): CartItem[] {
    return this.items.map((item) => {
      return new CartItem(item.getProduct(), item.getQuantity());
    });
  }

  private ensureCustomerIsActive(): void {
    if (this.customer.getAccountStatus() !== AccountStatus.Active) {
      throw new Error("Customer account must be active");
    }
  }

  addProduct(product: Product, quantity: number): void {
    this.ensureCustomerIsActive();

    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
      throw new Error("Quantity must be a positive safe integer");
    }

    const productId = product.getProductDetails().id;

    const existingItem = this.items.find((item) => {
      return item.getProduct().getProductDetails().id === productId;
    });

    if (existingItem) {
      const newQuantity = existingItem.getQuantity() + quantity;

      if (!Number.isSafeInteger(newQuantity)) {
        throw new Error("Cart quantity exceeds the safe integer limit");
      }

      existingItem.updateQuantity(newQuantity);
      return;
    }

    this.items.push(new CartItem(product, quantity));
  }

  removeProduct(productId: string): void {
    this.ensureCustomerIsActive();

    const index = this.items.findIndex((item) => {
      return item.getProduct().getProductDetails().id === productId;
    });

    if (index === -1) {
      throw new Error("Product not found in cart");
    }

    this.items.splice(index, 1);
  }

  getTotal(): number {
    return this.items.reduce((total, item) => {
      return total + item.getSubtotal();
    }, 0);
  }

  clearCart(): void {
    this.ensureCustomerIsActive();
    this.items = [];
  }
}

const customer = new Customer("customer-1", "John", "john@example.com");

customer.activate();

const cart = new ShoppingCart(customer);

cart.addProduct(physicalProduct1, 2);
cart.addProduct(physicalProduct1, 3);
cart.addProduct(digitalProduct1, 1);
``;
console.log("Items:", cart.getItems().length);
console.log("Total:", cart.getTotal());

const copiedItems = cart.getItems();
copiedItems[0].updateQuantity(100);

console.log("Original quantity:", cart.getItems()[0].getQuantity());

cart.removeProduct("1");

console.log("After removal:", cart.getItems().length);
console.log("Total after removal:", cart.getTotal());

cart.clearCart();

console.log("After clearing:", cart.getItems().length);
console.log("Final total:", cart.getTotal());

type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

type Money = number;

function assertMoney(value: number, label = "Amount"): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative safe integer of cents`);
  }
}

function safeAdd(a: number, b: number): number {
  const result = a + b;

  if (!Number.isSafeInteger(result)) {
    throw new Error("Money/quantity overflow");
  }

  return result;
}

function safeMultiply(a: number, b: number): number {
  const result = a * b;

  if (!Number.isSafeInteger(result)) {
    throw new Error("Money overflow");
  }

  return result;
}

function toCents(dollars: number): Money {
  if (!Number.isFinite(dollars) || dollars < 0) {
    throw new Error("Invalid dollar amount");
  }

  const cents = Math.round(dollars * 100);
  assertMoney(cents);

  if (Math.abs(cents / 100 - dollars) > 1e-9) {
    throw new Error("Amount must have at most two decimal places");
  }

  return cents;
}

function formatMoney(cents: Money): string {
  assertMoney(cents);
  return `$${(cents / 100).toFixed(2)}`;
}

class OrderItem {
  private readonly productId: string;
  private readonly productName: string;
  private readonly sellerId: string;
  private readonly unitPriceCents: Money;
  private readonly quantity: number;
  private readonly productType: "physical" | "digital";
  private readonly deliveryFeeCents: Money;

  constructor(product: Product, quantity: number) {
    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
      throw new Error("Order quantity must be a positive safe integer");
    }

    const details = product.getProductDetails();

    this.productId = details.id;
    this.productName = details.name;
    this.sellerId = details.sellerId;
    this.unitPriceCents = toCents(details.price);
    this.quantity = quantity;

    this.productType =
      product instanceof PhysicalProduct ? "physical" : "digital";

    this.deliveryFeeCents = toCents(product.calculateDeliveryCost());

    safeMultiply(this.unitPriceCents, quantity);
    safeMultiply(this.deliveryFeeCents, quantity);
  }

  getProductId(): string {
    return this.productId;
  }

  getProductName(): string {
    return this.productName;
  }

  getSellerId(): string {
    return this.sellerId;
  }

  getUnitPrice(): number {
    return this.unitPriceCents / 100;
  }

  getUnitPriceCents(): Money {
    return this.unitPriceCents;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getProductType(): "physical" | "digital" {
    return this.productType;
  }

  getSubtotalCents(): Money {
    return safeMultiply(this.unitPriceCents, this.quantity);
  }

  getSubtotal(): number {
    return this.getSubtotalCents() / 100;
  }

  getDeliveryTotalCents(): Money {
    return safeMultiply(this.deliveryFeeCents, this.quantity);
  }

  getDetails() {
    return Object.freeze({
      productId: this.productId,
      productName: this.productName,
      sellerId: this.sellerId,
      unitPriceCents: this.unitPriceCents,
      quantity: this.quantity,
      productType: this.productType,
      subtotalCents: this.getSubtotalCents(),
      deliveryCents: this.getDeliveryTotalCents(),
    });
  }
}

class Coupon {
  readonly code: string;
  readonly discountPercent: number;
  readonly expiresAt: Date;

  private usesRemaining: number;

  constructor(
    code: string,
    discountPercent: number,
    expiresAt: Date,
    usesRemaining: number,
  ) {
    if (!code.trim()) {
      throw new Error("Coupon code required");
    }

    if (
      !Number.isInteger(discountPercent) ||
      discountPercent < 1 ||
      discountPercent > 100
    ) {
      throw new Error("Discount must be 1–100 percent");
    }

    if (!Number.isFinite(expiresAt.getTime())) {
      throw new Error("Invalid expiry date");
    }

    if (!Number.isSafeInteger(usesRemaining) || usesRemaining < 0) {
      throw new Error("Invalid coupon uses");
    }

    this.code = code.trim().toUpperCase();
    this.discountPercent = discountPercent;
    this.expiresAt = new Date(expiresAt);
    this.usesRemaining = usesRemaining;
  }

  isAvailable(now = new Date()): boolean {
    return now.getTime() < this.expiresAt.getTime() && this.usesRemaining > 0;
  }

  calculateDiscount(subtotalCents: Money): Money {
    assertMoney(subtotalCents);

    if (!this.isAvailable()) {
      throw new Error("Coupon is expired or exhausted");
    }

    return Math.round(subtotalCents * (this.discountPercent / 100));
  }

  redeem(): void {
    if (!this.isAvailable()) {
      throw new Error("Coupon is unavailable");
    }

    this.usesRemaining--;
  }

  getUsesRemaining(): number {
    return this.usesRemaining;
  }
}

class Order {
  readonly id: string;
  readonly customerId: string;
  readonly createdAt: Date;

  private readonly items: readonly OrderItem[];
  private readonly discountCents: Money;
  private status: OrderStatus = "pending_payment";
  private readonly events: string[] = [];

  constructor(
    id: string,
    customer: Customer,
    items: readonly OrderItem[],
    discountCents: Money = 0,
  ) {
    if (!id.trim()) {
      throw new Error("Order ID required");
    }

    if (customer.getAccountStatus() !== AccountStatus.Active) {
      throw new Error("Customer must be active");
    }

    if (items.length === 0) {
      throw new Error("Cannot create an empty order");
    }

    this.id = id.trim();
    this.customerId = customer.getDetails().id;
    this.items = [...items];
    this.createdAt = new Date();

    assertMoney(discountCents, "Discount");

    if (discountCents > this.getSubtotalCents()) {
      throw new Error("Discount exceeds subtotal");
    }

    this.discountCents = discountCents;
    this.events.push("Order created");
  }

  getItems(): readonly ReturnType<OrderItem["getDetails"]>[] {
    return this.items.map((item) => item.getDetails());
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  getSubtotalCents(): Money {
    return this.items.reduce(
      (sum, item) => safeAdd(sum, item.getSubtotalCents()),
      0,
    );
  }

  getDeliveryCents(): Money {
    return this.items.reduce(
      (sum, item) => safeAdd(sum, item.getDeliveryTotalCents()),
      0,
    );
  }

  getDiscountCents(): Money {
    return this.discountCents;
  }

  getTotalCents(): Money {
    return safeAdd(
      this.getSubtotalCents() - this.discountCents,
      this.getDeliveryCents(),
    );
  }

  getTotal(): number {
    return this.getTotalCents() / 100;
  }

  getHistory(): readonly string[] {
    return [...this.events];
  }

  private transition(expected: OrderStatus, next: OrderStatus): void {
    if (this.status !== expected) {
      throw new Error(`Cannot change order from ${this.status} to ${next}`);
    }

    this.status = next;
    this.events.push(`Status: ${next}`);
  }

  markPaid(): void {
    this.transition("pending_payment", "paid");
  }

  startProcessing(): void {
    this.transition("paid", "processing");
  }

  ship(): void {
    this.transition("processing", "shipped");
  }

  deliver(): void {
    this.transition("shipped", "delivered");
  }

  cancel(): void {
    if (this.status !== "pending_payment") {
      throw new Error("Only unpaid orders can be cancelled directly");
    }

    this.transition("pending_payment", "cancelled");
  }

  markRefunded(): void {
    if (
      this.status !== "paid" &&
      this.status !== "processing" &&
      this.status !== "delivered"
    ) {
      throw new Error("Order is not eligible for this simplified refund flow");
    }

    this.status = "refunded";
    this.events.push("Status: refunded");
  }

  getSellerSummaries(): readonly {
    sellerId: string;
    subtotalCents: Money;
    itemCount: number;
  }[] {
    const bySeller = new Map<
      string,
      {
        sellerId: string;
        subtotalCents: Money;
        itemCount: number;
      }
    >();

    for (const item of this.items) {
      const sellerId = item.getSellerId();

      const previous = bySeller.get(sellerId) ?? {
        sellerId,
        subtotalCents: 0,
        itemCount: 0,
      };

      previous.subtotalCents = safeAdd(
        previous.subtotalCents,
        item.getSubtotalCents(),
      );

      previous.itemCount = safeAdd(previous.itemCount, item.getQuantity());

      bySeller.set(sellerId, previous);
    }

    return [...bySeller.values()].map((value) => Object.freeze({ ...value }));
  }
}

interface PaymentGateway {
  charge(
    orderId: string,
    amountCents: Money,
  ): Promise<{
    success: boolean;
    transactionId?: string;
    message?: string;
  }>;

  refund(transactionId: string, amountCents: Money): Promise<boolean>;
}

class FakePaymentGateway implements PaymentGateway {
  private nextId = 1;

  async charge(_orderId: string, amountCents: Money) {
    assertMoney(amountCents);

    return {
      success: true,
      transactionId: `fake-txn-${this.nextId++}`,
    };
  }

  async refund(_transactionId: string, amountCents: Money): Promise<boolean> {
    assertMoney(amountCents);
    return true;
  }
}

class Payment {
  readonly orderId: string;
  readonly amountCents: Money;

  private status: PaymentStatus = "pending";
  private transactionId?: string;

  constructor(order: Order) {
    this.orderId = order.id;
    this.amountCents = order.getTotalCents();
  }

  getStatus(): PaymentStatus {
    return this.status;
  }

  getTransactionId(): string | undefined {
    return this.transactionId;
  }

  async process(gateway: PaymentGateway): Promise<void> {
    if (this.status !== "pending") {
      throw new Error("Payment has already been attempted");
    }

    this.status = "failed";

    const result = await gateway.charge(this.orderId, this.amountCents);

    if (!result.success || !result.transactionId) {
      throw new Error(result.message ?? "Payment failed");
    }

    this.transactionId = result.transactionId;
    this.status = "succeeded";
  }

  async refund(gateway: PaymentGateway): Promise<void> {
    if (this.status !== "succeeded" || !this.transactionId) {
      throw new Error("Payment is not refundable");
    }

    const success = await gateway.refund(this.transactionId, this.amountCents);

    if (!success) {
      throw new Error("Refund failed");
    }

    this.status = "refunded";
  }
}

class InventoryCatalog {
  private readonly stocks = new Map<string, Inventory>();

  register(inventory: Inventory): void {
    const id = inventory.getProduct().getProductDetails().id;

    if (this.stocks.has(id)) {
      throw new Error("Inventory already registered");
    }

    this.stocks.set(id, inventory);
  }

  getAvailable(productId: string): number {
    return this.stocks.get(productId)?.getQuantity() ?? 0;
  }

  reserve(items: readonly OrderItem[]): void {
    const required = new Map<string, number>();

    for (const item of items) {
      if (item.getProductType() === "digital") {
        continue;
      }

      const id = item.getProductId();

      required.set(id, safeAdd(required.get(id) ?? 0, item.getQuantity()));
    }

    for (const [id, quantity] of required) {
      const stock = this.stocks.get(id);

      if (!stock || stock.getQuantity() < quantity) {
        throw new Error(`Insufficient stock for product ${id}`);
      }
    }

    for (const [id, quantity] of required) {
      this.stocks.get(id)!.removeStock(quantity);
    }
  }

  restore(items: readonly OrderItem[]): void {
    for (const item of items) {
      if (item.getProductType() === "physical") {
        const stock = this.stocks.get(item.getProductId());

        if (!stock) {
          throw new Error("Inventory record missing during restore");
        }

        stock.addStock(item.getQuantity());
      }
    }
  }
}

class CheckoutService {
  private nextOrderId = 1;

  private readonly inventory: InventoryCatalog;
  private readonly gateway: PaymentGateway;

  constructor(inventory: InventoryCatalog, gateway: PaymentGateway) {
    this.inventory = inventory;
    this.gateway = gateway;
  }

  async checkout(
    cart: ShoppingCart,
    coupon?: Coupon,
  ): Promise<{ order: Order; payment: Payment }> {
    const customer = cart.getCustomer();

    if (customer.getAccountStatus() !== AccountStatus.Active) {
      throw new Error("Customer must be active");
    }

    const cartItems = cart.getItems();

    if (!cartItems.length) {
      throw new Error("Cannot checkout an empty cart");
    }

    const orderItems = cartItems.map(
      (item) => new OrderItem(item.getProduct(), item.getQuantity()),
    );

    const subtotal = orderItems.reduce(
      (sum, item) => safeAdd(sum, item.getSubtotalCents()),
      0,
    );

    const discount = coupon ? coupon.calculateDiscount(subtotal) : 0;

    const order = new Order(
      `order-${this.nextOrderId++}`,
      customer,
      orderItems,
      discount,
    );

    this.inventory.reserve(orderItems);

    const payment = new Payment(order);

    try {
      await payment.process(this.gateway);

      order.markPaid();

      if (coupon) {
        coupon.redeem();
      }

      cart.clearCart();

      return { order, payment };
    } catch (error) {
      this.inventory.restore(orderItems);
      order.cancel();
      throw error;
    }
  }
}

class Review {
  readonly productId: string;
  readonly customerId: string;
  readonly rating: number;
  readonly comment: string;
  readonly createdAt: Date;

  constructor(
    product: Product,
    customer: Customer,
    rating: number,
    comment: string,
  ) {
    if (customer.getAccountStatus() !== AccountStatus.Active) {
      throw new Error("Only active customers can review");
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error("Rating must be 1–5");
    }

    if (!comment.trim()) {
      throw new Error("Review comment is required");
    }

    this.productId = product.getProductDetails().id;
    this.customerId = customer.getDetails().id;
    this.rating = rating;
    this.comment = comment.trim();
    this.createdAt = new Date();
  }
}

class ReviewService {
  private readonly reviews: Review[] = [];

  add(review: Review, orders: readonly Order[]): void {
    const hasPurchased = orders.some(
      (order) =>
        order.customerId === review.customerId &&
        (
          ["paid", "processing", "shipped", "delivered"] as OrderStatus[]
        ).includes(order.getStatus()) &&
        order.getItems().some((item) => item.productId === review.productId),
    );

    if (!hasPurchased) {
      throw new Error("Verified purchase required");
    }

    if (
      this.reviews.some(
        (item) =>
          item.customerId === review.customerId &&
          item.productId === review.productId,
      )
    ) {
      throw new Error("Customer already reviewed this product");
    }

    this.reviews.push(review);
  }

  getAverageRating(productId: string): number | null {
    const ratings = this.reviews.filter((item) => item.productId === productId);

    if (!ratings.length) {
      return null;
    }

    return ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length;
  }
}

async function demo(): Promise<void> {
  const customer = new Customer(
    "demo-customer",
    "Demo Customer",
    "demo@example.com",
  );

  customer.activate();

  const physical = new PhysicalProduct(
    "demo-p1",
    "Headphones",
    "Wireless",
    100,
    "seller-a",
    1,
  );

  const digital = new DigitalProduct(
    "demo-p2",
    "E-book",
    "PDF",
    20,
    "seller-b",
    "https://example.com/book",
  );

  const catalog = new InventoryCatalog();

  catalog.register(new Inventory(physical, 10));

  const cart = new ShoppingCart(customer);

  cart.addProduct(physical, 2);
  cart.addProduct(digital, 1);

  const coupon = new Coupon("SAVE10", 10, new Date("2030-01-01"), 10);

  const checkout = new CheckoutService(catalog, new FakePaymentGateway());

  const { order, payment } = await checkout.checkout(cart, coupon);

  console.log(
    "Order:",
    order.id,
    order.getStatus(),
    formatMoney(order.getTotalCents()),
  );

  console.log("Payment:", payment.getStatus());

  console.log("Stock remaining:", catalog.getAvailable("demo-p1"));

  console.log("Seller summaries:", order.getSellerSummaries());

  physical.updatePrice(150);

  console.log(
    "Original order item price:",
    order.getItems()[0].unitPriceCents / 100,
  );

  order.startProcessing();
  order.ship();
  order.deliver();

  const reviews = new ReviewService();

  reviews.add(new Review(physical, customer, 5, "Excellent!"), [order]);

  console.log(
    "Average rating:",
    reviews.getAverageRating(physical.getProductDetails().id),
  );
}

void demo().catch(console.error);
