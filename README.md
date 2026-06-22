# 🛒 GroceryHub - Full-Stack E-Commerce Application

A complete online grocery store with user authentication, product management, shopping cart, and order tracking. Built with React, Node.js, Express, and MongoDB.

## ✨ Key Features

### For Customers (Users)
- 🔐 User Registration & Login
- 🛍️ Browse grocery products with images and descriptions
- 🔍 Search products and filter by category (Fruit, Vegetables, Dairy, Bakery, Pantry, Beverages, Meat)
- 🛒 Add products to cart with quantity controls
- 💳 Checkout to place orders
- 📦 Track order status

### For Store Admins
- 👨‍💼 Admin login with role-based access
- ➕ Add new products (title, price, category, image, stock, perishable flag)
- ✏️ Edit existing products
- 🗑️ Delete products
- 📊 Monitor all customer orders
- 🚚 Update order status (pending → confirmed → shipped → delivered)

## 🚀 Quick Start

**See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed installation & setup instructions**

### TL;DR

```bash
# 1. Install MongoDB locally and start service
# 2. Update backend/.env with local MongoDB URI

# 3. Start backend
cd backend
npm install
npm run dev

# 4. In another terminal, start frontend
cd frontend
npm install
npm run dev
```

Open browser: http://localhost:5173

**Demo Credentials:**
- Admin: admin@example.com / admin123
- User: Create account on registration page

## 📦 Project Structure

```
E_Com/
├── backend/
│   ├── server.js           # Express server with MongoDB
│   ├── models/
│   │   ├── User.js         # User schema (name, email, password, role)
│   │   ├── Product.js      # Product schema (title, category, price, stock, etc)
│   │   └── Order.js        # Order schema (user, items, total, status)
│   ├── routes/
│   │   ├── auth.js         # Register & Login endpoints
│   │   ├── products.js     # Product CRUD (admin protected)
│   │   └── orders.js       # Order endpoints
│   ├── middleware/
│   │   └── auth.js         # JWT auth & role-based access
│   ├── seed.js             # Database seeding script
│   ├── package.json
│   └── .env                # Environment config (local MongoDB)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main app with routing
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── README.md               # This file
├── SETUP_GUIDE.md          # Detailed setup instructions
└── docker-compose.yml      # Optional: Local MongoDB via Docker
```

## 🗄️ Database Models

### User
```javascript
{ name, email, password (hashed), role (user/admin), timestamps }
```

### Product
```javascript
{ 
  title, description, category, unit, perishable, 
  price, image, stock, expiryDays, timestamps 
}
```

### Order
```javascript
{
  user (ref: User), 
  items (product ref, quantity, price),
  total,
  status (pending/confirmed/shipped/delivered),
  timestamps
}
```

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication (7-day expiration)
- ✅ Role-based access control (middleware checks)
- ✅ Admin-only endpoints for product & order management
- ✅ CORS enabled for frontend access

## 🌐 API Routes

| Method | Endpoint | Auth | Role | Purpose |
|--------|----------|------|------|---------|
| POST | `/api/auth/register` | ❌ | Any | Create new user account |
| POST | `/api/auth/login` | ❌ | Any | Login, get JWT token |
| GET | `/api/products` | ❌ | Any | List products (search/filter supported) |
| POST | `/api/products` | ✅ | Admin | Create product |
| PUT | `/api/products/:id` | ✅ | Admin | Update product |
| DELETE | `/api/products/:id` | ✅ | Admin | Delete product |
| POST | `/api/orders` | ✅ | User | Place order |
| GET | `/api/orders` | ✅ | Both* | Get orders (*admins see all) |
| PUT | `/api/orders/:id/status` | ✅ | Admin | Update order status |

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- CORS enabled

**Frontend:**
- React 18
- React Router (v6)
- Axios (HTTP client)
- Vite (build tool)
- CSS (responsive design)

## 📝 Available Sample Products

12 grocery items across 7 categories, including:
- Bananas, Apples (Fruit)
- Tomatoes (Vegetables)
- Milk, Eggs, Cheese (Dairy)
- Bread (Bakery)
- Rice, Pasta, Olive Oil (Pantry)
- Orange Juice (Beverages)
- Chicken Breast (Meat)

All products auto-populate on first backend start.

## 🔧 Environment Variables

### Backend `.env`
```
MONGO_URI=mongodb://127.0.0.1:27017/e_com
JWT_SECRET=your_jwt_secret_key
PORT=5000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### Frontend
API base URL in `src/App.jsx`:
```javascript
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'
```

## 📚 User Workflows

### Customer Workflow
1. Register with name, email, password
2. Login to get JWT token (stored in localStorage)
3. Browse all products or search/filter
4. Add items to cart with quantity
5. View cart summary (total price)
6. Checkout → order created
7. Logout

### Admin Workflow
1. Login with admin@example.com
2. Access Admin Dashboard
3. **Product Management**:
   - Click "Add Product" → fill form → submit
   - Click "Edit" to modify existing product
   - Click "Delete" to remove product
4. **Order Monitoring**:
   - Click "View Orders"
   - See all customer orders with details
   - Change status dropdown to update order progress
5. Logout

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Ensure MongoDB service is running locally |
| Port 5000 in use | Kill existing process or change PORT in `.env` |
| Products not loading | Check browser console for API errors, verify backend is running |
| Login fails | Confirm backend running, check admin credentials |
| CORS errors | Backend already has CORS enabled, check API_BASE URL |

## 🚀 Deployment (Future)

To deploy to production:
1. Backend: Deploy to Heroku, Railway, or AWS
2. Frontend: Deploy to Vercel, Netlify, or GitHub Pages
3. Database: Use MongoDB Atlas (update MONGO_URI with production cluster)
4. Environment: Set all `.env` variables on hosting platform

## 📖 References

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [JWT Authentication](https://jwt.io/)

---

**Start with [SETUP_GUIDE.md](SETUP_GUIDE.md) for step-by-step setup instructions!**
