# Merch/Shop Development Guide

## Overview

Building a full e-commerce shop is indeed a complex task. This guide outlines the recommended approach and architecture for developing the merch section.

## Recommended Approach: Hybrid Solution

**Best Practice:** Use existing payment/e-commerce services rather than building everything from scratch. This saves time, reduces security risks, and handles complex edge cases.

---

## Option 1: Stripe + Custom Frontend (Recommended for Small/Medium Scale)

### Why Stripe?
- ✅ Industry standard, secure, reliable
- ✅ Handles payment processing, taxes, compliance
- ✅ Great documentation and developer tools
- ✅ Supports one-time payments and subscriptions
- ✅ Built-in checkout pages (Stripe Checkout) or custom integration
- ✅ Payment methods: cards, Apple Pay, Google Pay, etc.

### Architecture

#### Database Schema

You'll need these MySQL tables:

```sql
-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_slug VARCHAR(255), -- matches image file name
    category VARCHAR(100),
    stock_quantity INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stripe_session_id VARCHAR(255) UNIQUE, -- Stripe checkout session ID
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Order items table (many-to-many relationship)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- price at time of purchase
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Shopping cart table (for persistent carts)
CREATE TABLE shopping_carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE, -- browser session ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES shopping_carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Implementation Steps

1. **Setup Stripe Account**
   - Create account at stripe.com
   - Get API keys (test and live)
   - Install: `npm install stripe`

2. **Backend API Endpoints Needed**

```
GET    /merch                    - Get all products (current placeholder)
GET    /merch/products           - Get all active products
GET    /merch/products/:id       - Get single product
POST   /merch/cart/add           - Add item to cart
GET    /merch/cart               - Get current cart
DELETE /merch/cart/item/:id      - Remove item from cart
POST   /merch/checkout/create    - Create Stripe checkout session
GET    /merch/checkout/success   - Handle successful payment
POST   /merch/webhook/stripe     - Stripe webhook handler (order updates)
```

3. **Key Files to Create**

```
backend/
├── controllers/
│   └── merchController.js (already exists - update it)
├── models/
│   ├── productModel.js
│   ├── orderModel.js
│   └── cartModel.js (optional)
├── routes/
│   └── merchRoutes.js (already exists - expand it)
└── services/
    └── stripeService.js (Stripe integration)
```

4. **Payment Flow**

```
User Flow:
1. Browse products → GET /merch/products
2. Add to cart → POST /merch/cart/add
3. View cart → GET /merch/cart
4. Checkout → POST /merch/checkout/create
   → Redirects to Stripe Checkout (hosted by Stripe)
5. Payment complete → Redirect to /merch/checkout/success
6. Stripe webhook → POST /merch/webhook/stripe (updates order status)
```

5. **Basic Stripe Integration Example**

```javascript
// backend/services/stripeService.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(cartItems, customerEmail) {
    const lineItems = cartItems.map(item => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.name,
                description: item.description,
                images: [item.imageUrl],
            },
            unit_amount: Math.round(item.price * 100), // Stripe uses cents
        },
        quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/merch/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/merch/cart`,
        customer_email: customerEmail,
    });

    return session;
}
```

---

## Option 2: Shopify Storefront API (For Larger Scale)

If you want even less backend work:

- Create products in Shopify admin panel (no database needed)
- Use Shopify Storefront API to fetch products
- Use Shopify Checkout for payments
- Pros: No inventory management code, built-in admin, shipping integration
- Cons: Monthly fees, less customization

---

## Option 3: Third-Party E-commerce Platform

Integrate with platforms like:
- **Snipcart** - Add shopping cart with HTML data attributes
- **Ecwid** - Embeddable shopping cart
- **Square Online** - Full e-commerce solution

These are easiest but offer less control.

---

## Recommended Development Phases

### Phase 1: Product Display (Easy)
- [ ] Create `products` table
- [ ] Create product model/controller
- [ ] Update `/merch` endpoint to return products
- [ ] Frontend: Display product grid/list

### Phase 2: Shopping Cart (Medium)
- [ ] Implement cart in frontend (localStorage or backend)
- [ ] Cart API endpoints
- [ ] Cart UI components

### Phase 3: Checkout & Payment (Complex)
- [ ] Setup Stripe account
- [ ] Implement Stripe Checkout
- [ ] Create orders table
- [ ] Handle payment success/failure
- [ ] Stripe webhook for order status

### Phase 4: Order Management (Medium)
- [ ] Admin view of orders
- [ ] Order status updates
- [ ] Email notifications (optional)
- [ ] Shipping tracking (optional)

### Phase 5: Advanced Features (Optional)
- [ ] User accounts
- [ ] Order history
- [ ] Product reviews
- [ ] Inventory alerts
- [ ] Discount codes
- [ ] Analytics

---

## Key Considerations

### Security
- ⚠️ **Never store credit card data** - Let Stripe handle it
- ⚠️ Validate all inputs server-side
- ⚠️ Use environment variables for API keys
- ⚠️ Verify Stripe webhook signatures

### Legal/Compliance
- Privacy policy
- Terms of service
- Return/refund policy
- Tax calculation (Stripe Tax can handle this)

### Shipping
- Calculate shipping costs (flat rate or weight-based)
- Integrate with shipping carriers (USPS, FedEx APIs)
- Or use Stripe Shipping Rate API

### Testing
- Use Stripe test mode for development
- Test card: `4242 4242 4242 4242` (any future expiry, any CVC)

---

## Recommended Tech Stack Summary

**Backend:**
- Express.js (already using)
- MySQL (already using)
- Stripe SDK (`npm install stripe`)
- Optional: Nodemailer for emails

**Frontend:**
- Your chosen framework (React/Vue/etc.)
- Stripe.js for payment elements (if custom checkout)
- Or redirect to Stripe Checkout (easier)

**Services:**
- Stripe (payments)
- Optional: SendGrid/Mailgun (emails)
- Optional: Cloudinary (image hosting)

---

## Quick Start Checklist (When Ready)

1. [ ] Design product database schema
2. [ ] Create migration scripts
3. [ ] Setup Stripe account
4. [ ] Install Stripe SDK
5. [ ] Create product management endpoints
6. [ ] Build product display frontend
7. [ ] Implement shopping cart
8. [ ] Integrate Stripe Checkout
9. [ ] Handle order creation and webhooks
10. [ ] Test thoroughly with Stripe test mode
11. [ ] Deploy to production with live Stripe keys

---

## Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Checkout**: https://stripe.com/docs/payments/checkout
- **Stripe Webhooks**: https://stripe.com/docs/webhooks
- **Stripe Testing**: https://stripe.com/docs/testing
- **E-commerce Best Practices**: https://stripe.com/docs/payments/checkout/best-practices

---

## Estimated Timeline

- **Phase 1 (Products)**: 1-2 days
- **Phase 2 (Cart)**: 2-3 days
- **Phase 3 (Payment)**: 3-5 days
- **Phase 4 (Orders)**: 2-3 days
- **Total**: ~2 weeks of focused development

Remember: Start simple, iterate, and add features as needed!

