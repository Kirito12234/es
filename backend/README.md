# E-Commerce Store Backend

Express, MongoDB and Mongoose backend with JWT authentication, roles, products, cart, wishlist, orders, reviews, contact messages and admin routes.

## Setup

```bash
npm install
npm run dev
```

The API runs on port `5000` by default.

## Environment

Use one local `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_store
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
```

## Seed Data

```bash
npm run seed
```

Demo accounts:

- Admin: `admin@example.com` / `password123`
- Seller: `seller@example.com` / `password123`
- Customer: `customer@example.com` / `password123`

## API Groups

- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/profile`
- Products: `/api/products`, `/api/products/search?keyword=`, `/api/products/category/:category`
- Cart: `/api/cart`
- Wishlist: `/api/wishlist`
- Orders: `/api/orders`
- Reviews: `/api/reviews/:productId`
- Contact: `/api/contact`
- Admin: `/api/admin/users`, `/api/admin/products`, `/api/admin/orders`

Use `Authorization: Bearer <token>` for protected routes. Product creation and updates support either image URLs in `images` or multipart uploads using the `images` field.
