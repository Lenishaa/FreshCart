# 🛒 GroceryHub - Full-Stack E-Commerce Setup & Features

## ✅ What's Been Built

### Backend Features
- **Sample Data**: 12 grocery products auto-loaded on startup (Fruit, Vegetables, Dairy, Bakery, Pantry, Beverages, Meat)
- **User Authentication**: Register & Login with JWT tokens
- **Role-Based Access Control**: 
  - **Admin**: Add/edit/delete products, monitor all orders, update order status
  - **User**: Browse products, search by category, add to cart, checkout
- **Product API**: CRUD operations with admin protection
- **Order API**: Place orders, track status, admin monitoring

### Frontend Features
- **User Dashboard**: Browse products, search, filter by category, add to cart, checkout
- **Admin Dashboard**: 
  - Create, edit, delete products
  - Manage inventory
  - Monitor orders with status updates (pending → confirmed → shipped → delivered)
- **Authentication UI**: Register & Login pages
- **Role-Based Navigation**: Different menus for users vs admins
- **Cart Management**: Add, remove, adjust quantities, checkout

## 🚀 Quick Start Guide

### Step 1: Install MongoDB Locally

**Windows - Option A (Download installer)**
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer, select "Install MongoDB as a Service"
3. Service should auto-start

**Windows - Option B (Chocolatey - if installed)**
```powershell
choco install mongodb -y
net start MongoDB
```

**Verify MongoDB is running:**
```powershell
mongosh
> exit()
```

### Step 2: Update Backend `.env` for Local MongoDB

Edit `backend/.env`:
```
MONGO_URI=mongodb://127.0.0.1:27017/e_com
JWT_SECRET=your_jwt_secret_here
PORT=5000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### Step 3: Start Backend

```bash
cd backend
npm install
npm run dev
```

**Expected output:**
```
Connected to MongoDB
✓ Default admin user created: admin@example.com
✓ Loaded 12 sample grocery products
Server listening on port 5000
```

### Step 4: Start Frontend

**In a new terminal:**
```bash
cd frontend
npm install
npm run dev
```

Open browser: **http://localhost:5173**

## 🔐 Demo Credentials

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123
- **Access**: Dashboard to manage products & orders

### User Account
- **Create new account** on /register page
- Browse products, add to cart, place orders

## 📝 Sample Products Included

| Category | Items |
|----------|-------|
| **Fruit** | Bananas, Apples |
| **Vegetables** | Tomatoes |
| **Dairy** | Milk, Eggs, Cheddar Cheese |
| **Bakery** | Bread |
| **Pantry** | Rice, Olive Oil, Pasta |
| **Beverages** | Orange Juice |
| **Meat** | Chicken Breast |

## 🔑 Key Features Overview

### User Flow
1. Register or Login
2. Browse products (search, filter by category)
3. View perishable/non-perishable status
4. Add to cart with quantity control
5. Checkout (creates order)
6. Order confirmed

### Admin Flow
1. Login with admin credentials
2. **Dashboard Tab**:
   - Add new products (fill form with title, price, category, image URL, etc.)
   - Edit existing products
   - Delete products
   - View all products in table
3. **Orders Tab**:
   - View all customer orders
   - Update order status (pending → confirmed → shipped → delivered)
   - See order details (customer, items, total)

## 🛠 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user, get JWT token

### Products
- `GET /api/products` - List all products (supports ?category=X&search=Y)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders` - Create order (user must be logged in)
- `GET /api/orders` - Get orders (admins see all, users see their own)
- `PUT /api/orders/:id/status` - Update order status (admin only)

## ❓ Troubleshooting

### "Could not connect to MongoDB"
- Ensure MongoDB service is running: `net start MongoDB` (Windows)
- Check `.env` has correct `MONGO_URI`
- Default is: `mongodb://127.0.0.1:27017/e_com`

### "Port 5000 already in use"
- Kill existing process: `netstat -ano | findstr :5000`
- Or change PORT in `.env`

### "Products not loading"
- Check backend console for errors
- Verify MongoDB is running
- Try refreshing the page

### Login fails
- Confirm backend is running (`npm run dev`)
- Check frontend API_BASE in `App.jsx` (should be `http://localhost:5000/api`)
- Try admin@example.com / admin123

## 🎯 Next Steps (Optional Enhancements)

- Add payment gateway (Stripe/PayPal)
- Email notifications for orders
- User profile and order history page
- Product ratings/reviews
- Wishlist feature
- Advanced filters (price range, ratings)

---

**Built with**: React + Vite | Express + Node.js | MongoDB | JWT Authentication
