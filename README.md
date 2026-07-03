# 🛒 FreshCart - Modern E-Commerce Platform

A full-featured e-commerce web application with an impressive landing page, user authentication, product catalog, shopping cart, and comprehensive admin dashboard. Built with React, Node.js, Express, and MongoDB.

## ✨ Key Features

### 🎯 Landing Page & User Experience
- **Stunning Landing Page** with hero section, features, stats, and CTAs
- **Fully Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Modern UI/UX** with smooth animations and transitions
- **Interactive Elements** - Hover effects, floating cards, and engaging visuals

### For Customers (Users)
- 🔐 User Registration & Login with password visibility toggle
- 🛍️ Browse products with beautiful product cards and images
- 🔍 Real-time search and category filtering
- 🛒 Shopping cart with quantity controls and live total calculation
- 💳 Secure checkout process
- 📦 Order confirmation and tracking
- 👤 User profile with logout functionality

### For Store Admins
- 👨‍💼 Admin login with role-based access control
- ➕ Add new products with comprehensive form (title, description, price, category, image, stock, perishable flag)
- ✏️ Edit existing products with pre-filled forms
- 🗑️ Delete products with confirmation
- 📊 Comprehensive admin dashboard with product management
- 📋 Order monitoring and management system
- 🚚 Update order status (pending → confirmed → shipped → delivered)

## 🚀 Quick Start

**See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed installation & setup instructions**

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### TL;DR

```bash
# 1. Install MongoDB locally and start service
# 2. Backend .env is already configured with local MongoDB

# 3. Start backend server
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
- **Admin:** admin@example.com / admin123
- **User:** Register a new account on the registration page

**Note:** The backend will automatically create an admin user and populate 12 sample grocery products on first run.

## 📦 Project Structure

```
E_Com/
├── backend/
│   ├── server.js                # Express server with MongoDB
│   ├── models/
│   │   ├── User.js              # User schema (name, email, password, role)
│   │   ├── Product.js           # Product schema (title, category, price, stock, etc)
│   │   └── Order.js             # Order schema (user, items, total, status)
│   ├── routes/
│   │   ├── auth.js              # Register & Login endpoints
│   │   ├── products.js          # Product CRUD (admin protected)
│   │   └── orders.js            # Order endpoints
│   ├── middleware/
│   │   └── auth.js              # JWT auth & role-based access
│   ├── seed.js                  # Database seeding script
│   ├── package.json
│   └── .env                     # Environment configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.jsx    # Modern landing page with hero section
│   │   │   ├── LoginPage.jsx      # Enhanced login with password toggle
│   │   │   └── RegisterPage.jsx   # Enhanced registration page
│   │   ├── App.jsx                # Main app with routing & state management
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Comprehensive modern CSS (700+ lines)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── README.md                    # This file
├── SETUP_GUIDE.md               # Detailed setup instructions
└── .gitignore
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

## 🎨 Frontend Features

### Landing Page Components
- **Hero Section** - Gradient background with floating animated cards
- **Features Section** - 4 feature cards with icons (Fast Delivery, Quality Products, Secure Shopping, Best Prices)
- **Stats Section** - Animated statistics (10K+ Customers, 500+ Products, 50+ Categories, 24/7 Support)
- **CTA Section** - Call-to-action with gradient background
- **Footer** - Professional footer with copyright

### Authentication Pages
- **Login Page** - Clean design with email/password fields, password visibility toggle, demo credentials display
- **Register Page** - Full name, email, password with validation hints, password toggle

### Product Catalog
- **Product Cards** - Image, title, category, description, price, stock status, perishable badge
- **Category Filter** - Dropdown to filter by category
- **Search** - Real-time product search
- **Add to Cart** - One-click add with stock validation

### Shopping Cart
- **Cart Items** - Product image, details, quantity controls (+/-), subtotal
- **Quantity Management** - Increase/decrease quantities with min/max validation
- **Remove Items** - One-click removal
- **Order Summary** - Subtotal and total with prominent checkout button

### Admin Dashboard
- **Product Management Form** - Add/edit products with all fields
- **Products List** - View all products with edit/delete actions
- **Order Management** - View all orders with customer details and status updates

## 📝 Available Sample Products

12 grocery items across 7 categories, including:
- **Fruit:** Bananas, Apples
- **Vegetables:** Tomatoes
- **Dairy:** Milk, Eggs, Cheddar Cheese
- **Bakery:** Bread - Whole Wheat
- **Pantry:** Rice, Pasta, Olive Oil
- **Beverages:** Orange Juice
- **Meat:** Chicken Breast

All products auto-populate on first backend start with high-quality images from Unsplash.

## 🔧 Environment Variables

### Backend `.env`
```env
MONGO_URI=mongodb://127.0.0.1:27017/e_com
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
PORT=5000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

**Note:** Change `JWT_SECRET` in production for security.

### Frontend
API base URL in `src/App.jsx`:
```javascript
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'
```

**For Local Development:**
Create a `.env` file in the frontend directory (already created):
```env
VITE_API_BASE=http://localhost:5000/api
```

**For Production Deployment:**
Update the `frontend/.env` file with your backend URL:
```env
VITE_API_BASE=https://your-backend-url.com/api
```

Then rebuild the frontend:
```bash
cd frontend
npm run build
```

**Important:** After changing `VITE_API_BASE`, you must restart the frontend dev server or rebuild for production.

## 📚 User Workflows

### Customer Workflow
1. **Landing Page** - Visit homepage, explore features, click "Get Started"
2. **Registration** - Create account with name, email, password
3. **Login** - Sign in with credentials (or use demo admin account)
4. **Browse Products** - View product catalog with images and descriptions
5. **Search & Filter** - Use search bar and category dropdown to find products
6. **Add to Cart** - Click "Add to Cart" button on desired products
7. **View Cart** - Navigate to cart, adjust quantities, see subtotals
8. **Checkout** - Click "Proceed to Checkout" to place order
9. **Logout** - Click logout button in header

### Admin Workflow
1. **Login** - Sign in with admin@example.com / admin123
2. **Admin Dashboard** - Automatically redirected to /admin
3. **Product Management**:
   - Fill form on the left side (title, category, price, stock, etc.)
   - Click "Add Product" to create new product
   - Click "Edit" on any product to modify it
   - Click "Delete" to remove products
4. **Order Monitoring**:
   - Click "View Orders" button
   - See all customer orders with full details
   - Use status dropdown to update order progress
   - Track pending → confirmed → shipped → delivered
5. **Logout** - Return to landing page

## 🎯 Design & UX Highlights

### Visual Design
- **Modern Color Palette** - Professional blues and purples with semantic colors
- **Gradient Backgrounds** - Beautiful hero section and stats area
- **Card-Based Layout** - Clean, organized content presentation
- **Typography** - Inter font family for excellent readability

### Animations & Interactions
- **Fade-in Effects** - Smooth page and component transitions
- **Hover Effects** - Cards lift on hover with shadow enhancement
- **Floating Animation** - Hero section cards with gentle floating motion
- **Button Interactions** - Scale and shadow changes on hover/active
- **Image Zoom** - Product images scale on card hover

### Responsive Breakpoints
- **Desktop:** 1024px+ - Full multi-column layouts
- **Tablet:** 768px - 1023px - Adjusted grids and spacing
- **Mobile:** < 768px - Single column, stacked layouts
- **Small Mobile:** < 480px - Optimized touch targets and typography

### Accessibility
- Semantic HTML elements
- Proper label associations
- Focus states for keyboard navigation
- Color contrast compliance
- Touch-friendly button sizes

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Ensure MongoDB service is running locally (`mongod` command) |
| Port 5000 in use | Kill existing process or change PORT in `backend/.env` |
| Products not loading | Check browser console for API errors, verify backend is running on port 5000 |
| Login fails | Confirm backend is running, check credentials (admin@example.com / admin123) |
| CORS errors | Backend has CORS enabled, verify API_BASE URL in frontend/src/App.jsx |
| Images not loading | Check internet connection (images loaded from Unsplash CDN) |
| Cart not persisting | Cart is in-memory only, refreshes on page reload (by design) |

## 🔒 Security Considerations

- **Production Deployment:**
  - Change `JWT_SECRET` to a strong, random string
  - Use environment variables (never commit `.env` to version control)
  - Enable HTTPS for all communications
  - Implement rate limiting on authentication endpoints
  - Add input validation and sanitization
  - Use MongoDB Atlas or secured database connection
  - Implement CORS with specific origins (not wildcard)

- **Current Implementation:**
  - Passwords hashed with bcryptjs (10 salt rounds)
  - JWT tokens with 7-day expiration
  - Role-based access control middleware
  - Admin-only routes protected with middleware

## 🚀 Deployment Guide

### Backend Deployment
1. **Platform Options:** Heroku, Railway, Render, AWS EC2, DigitalOcean
2. **Steps:**
   - Push code to GitHub
   - Connect repository to hosting platform
   - Set environment variables (MONGO_URI, JWT_SECRET, etc.)
   - Deploy and note the backend URL

### Frontend Deployment
1. **Platform Options:** Vercel, Netlify, GitHub Pages, Cloudflare Pages
2. **Steps:**
   - Build the frontend: `npm run build` in frontend directory
   - Deploy the `dist` folder
   - Set `VITE_API_BASE` environment variable to backend URL
   - Configure redirects for React Router (SPA)

### Database
- Use **MongoDB Atlas** for production (free tier available)
- Update `MONGO_URI` in backend `.env` with Atlas connection string
- Configure IP whitelist and database user credentials

### Environment Variables (Production)
```env
# Backend
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/e_com
JWT_SECRET=complex_random_string_here
PORT=5000
ADMIN_EMAIL=admin@yourshop.com
ADMIN_PASSWORD=secure_password

# Frontend
VITE_API_BASE=https://your-backend-api.com/api
```

## 📖 References & Learning Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [JWT Authentication](https://jwt.io/)
- [Mongoose ODM](https://mongoosejs.com/)
- [Vite Build Tool](https://vitejs.dev/)

## 🤝 Contributing

This is a learning project. Feel free to:
- Report bugs or issues
- Suggest new features
- Improve documentation
- Refactor code for better performance

## 📄 License

This project is open source and available for educational purposes.

---

**Start with [SETUP_GUIDE.md](SETUP_GUIDE.md) for step-by-step setup instructions!**

**Built with ❤️ for learning full-stack development**
