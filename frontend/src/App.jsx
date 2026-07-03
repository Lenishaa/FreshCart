import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

function App() {
  const [products, setProducts] = useState([]);
  const [categories] = useState(['All', 'Fruit', 'Vegetables', 'Dairy', 'Bakery', 'Pantry', 'Beverages', 'Meat']);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    const session = localStorage.getItem('ecom_user');
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
      if (search) params.set('search', search);
      const q = params.toString() ? `?${params.toString()}` : '';
      const res = await axios.get(`${API_BASE}/products${q}`);
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };

  const addToCart = product => {
    setCart(prev => {
      const existing = prev.find(item => item.product._id === product._id);
      if (existing) {
        return prev.map(item => item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    
    // Reduce stock by 1
    setProducts(prev => prev.map(p => {
      if (p._id === product._id) {
        return { ...p, stock: Math.max(0, p.stock - 1) };
      }
      return p;
    }));
  };

  const updateCartQuantity = (productId, newQty) => {
    setCart(prev => {
      const item = prev.find(item => item.product._id === productId);
      if (!item) return prev;
      
      const qtyDiff = newQty - item.quantity;
      
      // Update cart
      const updatedCart = prev.map(item => item.product._id === productId ? { ...item, quantity: Math.max(1, newQty) } : item);
      
      // Adjust stock based on quantity change
      if (qtyDiff !== 0) {
        setProducts(products => products.map(p => {
          if (p._id === productId) {
            const newStock = p.stock - qtyDiff;
            return { ...p, stock: Math.max(0, newStock) };
          }
          return p;
        }));
      }
      
      return updatedCart;
    });
  };

  const removeFromCart = productId => {
    setCart(prev => {
      const item = prev.find(item => item.product._id === productId);
      if (item) {
        // Restore stock when item is removed from cart
        setProducts(products => products.map(p => {
          if (p._id === productId) {
            return { ...p, stock: p.stock + item.quantity };
          }
          return p;
        }));
      }
      return prev.filter(item => item.product._id !== productId);
    });
  };

  const handleLogin = async (formData) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email: formData.email, password: formData.password });
      setUser(res.data.user);
      localStorage.setItem('ecom_user', JSON.stringify(res.data.user));
      localStorage.setItem('ecom_token', res.data.token);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed: ' + error.message);
    }
  };

  const handleRegister = async (formData) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, { name: formData.name, email: formData.email, password: formData.password });
      setUser(res.data.user);
      localStorage.setItem('ecom_user', JSON.stringify(res.data.user));
      localStorage.setItem('ecom_token', res.data.token);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed: ' + error.message);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to place an order');
      return;
    }
    try {
      const orderItems = cart.map(item => ({ product: item.product._id, quantity: item.quantity }));
      await axios.post(`${API_BASE}/orders`, { items: orderItems }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('ecom_token')}` }
      });
      setCart([]);
      alert('Order placed successfully!');
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Checkout failed: ' + error.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('ecom_user');
    localStorage.removeItem('ecom_token');
    navigate('/');
  };

  return (
    <div className="app-shell">
      {user?.role !== 'admin' && (
        <header className="main-header">
          <div className="header-left">
            <Link to="/" className="logo">
              <span className="logo-icon">🛒</span>
              <span className="logo-text">FreshCart</span>
            </Link>
          </div>
          <nav className="main-nav">
            {user ? (
              <>
                <Link to="/" className="nav-link">Products</Link>
                <Link to="/cart" className="nav-link cart-link">
                  🛒 Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </Link>
                <Link to="/orders" className="nav-link">My Orders</Link>
                <div className="user-menu">
                  <span className="user-name">👤 {user.name}</span>
                  <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
              </>
            ) : (
              <div className="nav-brand">
                <span>FreshCart - Your One-Stop Shop</span>
              </div>
            )}
          </nav>
        </header>
      )}

      <main>
      <Routes>
          <Route path="/" element={
            user ? (
              <ProductList products={products} addToCart={addToCart} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} search={search} setSearch={setSearch} categories={categories} onSearch={fetchProducts} />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          <Route path="/login" element={<LoginPage onSubmit={handleLogin} />} />
          <Route path="/register" element={<RegisterPage onSubmit={handleRegister} />} />
          <Route path="/cart" element={<Cart cart={cart} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} onCheckout={handleCheckout} />} />
          <Route path="/orders" element={user ? <UserOrders /> : <LandingPage user={user} />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard products={products} fetchProducts={fetchProducts} onLogout={handleLogout} /> : <LandingPage user={user} />} />
          <Route path="/admin/orders" element={user?.role === 'admin' ? <AdminOrders onLogout={handleLogout} /> : <LandingPage user={user} />} />
        </Routes>
      </main>
    </div>
  );
}

function ProductList({ products, addToCart, selectedCategory, setSelectedCategory, search, setSearch, categories, onSearch }) {
  const handleSearchClick = () => {
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <div className="products-page">
      <div className="filters-bar">
        <div className="category-filter">
          <label htmlFor="category-select">Category:</label>
          <select 
            id="category-select"
            value={selectedCategory} 
            onChange={e => setSelectedCategory(e.target.value)}
          >
            {categories.map(c => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
            aria-label="Search products"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearchClick();
              }
            }}
          />
          <button onClick={handleSearchClick} className="btn btn-primary">
            Search
          </button>
        </div>
      </div>

      <section className="products-section">
        <h2 className="section-heading">🛍️ Fresh Products</h2>
        {products.length === 0 && <p className="no-products">No products found.</p>}
        <div className="product-grid">
          {products.map(product => (
            <article key={product._id} className="product-card">
              <div className="product-image-wrapper">
                <img src={product.image || 'https://placehold.co/200x200?text=No+Image'} alt={product.title} />
                {product.perishable && <span className="badge badge-perishable">Perishable</span>}
              </div>
              <div className="product-content">
                <h3>{product.title}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-description">{product.description}</p>
              <div className="product-meta">
                  <span className="price">₹{product.price.toFixed(2)}</span>
                  <span className="unit">/ {product.unit}</span>
                </div>
                <div className="product-stock">
                  <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                    {product.stock > 0 ? `✓ In Stock (${product.stock})` : 'Out of Stock'}
                  </span>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  className="btn btn-add-to-cart"
                >
                  {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Cart({ cart, updateCartQuantity, removeFromCart, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  return (
    <div className="cart-page">
      <h2 className="page-title">🛒 Your Shopping Cart</h2>
      {cart.length === 0 && (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/" className="btn btn-primary">Browse Products</Link>
        </div>
      )}
      {cart.length > 0 && (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.product._id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.product.image || 'https://placehold.co/100x100?text=No+Image'} alt={item.product.title} />
                </div>
                <div className="cart-item-details">
                  <h3>{item.product.title}</h3>
                  <p className="cart-item-price">₹{item.product.price.toFixed(2)} / {item.product.unit}</p>
                </div>
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)} className="btn-qty">−</button>
                    <span className="quantity">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)} className="btn-qty">+</button>
                  </div>
                  <div className="cart-item-subtotal">
                    ₹{(item.quantity * item.product.price).toFixed(2)}
                  </div>
                  <button onClick={() => removeFromCart(item.product._id)} className="btn btn-remove">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button onClick={onCheckout} className="btn btn-checkout">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function AdminDashboard({ products, fetchProducts, onLogout }) {
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Fruit', unit: 'kg', perishable: true, price: 0, stock: 100, image: '' });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem('ecom_token');
  
  const categories = ['Fruit', 'Vegetables', 'Dairy', 'Bakery', 'Pantry', 'Beverages', 'Meat'];
  const unitTypes = ['kg', 'liter', 'piece', 'pack', 'bunch', 'dozen', 'box', 'bottle', 'can', 'bag'];

  const handleSave = async e => {
    e.preventDefault();
    try {
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
      if (editingId) {
        await axios.put(`${apiBase}/products/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Product updated successfully');
      } else {
        await axios.post(`${apiBase}/products`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Product created successfully');
      }
      setFormData({ title: '', description: '', category: 'Fruit', unit: 'unit', perishable: true, price: 0, stock: 100, image: '' });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
        await axios.delete(`${apiBase}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Product deleted');
        fetchProducts();
      } catch (error) {
        alert('Error: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleEdit = product => {
    setFormData(product);
    setEditingId(product._id);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>📊 Admin Dashboard</h1>
        <div className="admin-header-actions">
          <Link to="/admin/orders" className="btn btn-secondary">View Orders</Link>
          <button onClick={onLogout} className="btn btn-danger">Logout</button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-form-card">
          <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSave} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="e.g., Organic Apples"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="form-input"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Unit Type</label>
                <select
                  value={formData.unit}
                  onChange={e => setFormData({ ...formData, unit: e.target.value })}
                  required
                  className="form-input"
                >
                  {unitTypes.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  required
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  placeholder="e.g., 100"
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.perishable}
                    onChange={e => setFormData({ ...formData, perishable: e.target.checked })}
                  />
                  <span>Perishable Item (needs refrigeration)</span>
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Product Description</label>
              <textarea
                placeholder="Describe the product features, quality, and details..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
                className="form-textarea"
              />
            </div>
            <div className="form-group">
              <label>Product Image URL</label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg (optional)"
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setFormData({ title: '', description: '', category: 'Fruit', unit: 'unit', perishable: true, price: 0, stock: 100, image: '' }); }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="products-list-card">
          <h2>📦 All Products ({products.length})</h2>
          <div className="products-table">
            {products.map(product => (
              <div key={product._id} className="product-row">
                <div className="product-info">
                  <strong>{product.title}</strong>
                  <div className="product-details">{product.category} · ₹{product.price.toFixed(2)}</div>
                  <div className="product-stock-info">Stock: {product.stock}</div>
                </div>
                <div className="product-actions">
                  <button onClick={() => handleEdit(product)} className="btn btn-edit">Edit</button>
                  <button onClick={() => handleDelete(product._id)} className="btn btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminOrders({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('ecom_token');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
      const res = await axios.get(`${apiBase}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
      await axios.put(`${apiBase}/orders/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Order status updated');
      fetchOrders();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="admin-orders">
      <div className="admin-header">
        <h1>📋 Order Management</h1>
        <div className="admin-header-actions">
          <Link to="/admin" className="btn btn-secondary">Back to Dashboard</Link>
          <button onClick={onLogout} className="btn btn-danger">Logout</button>
        </div>
      </div>

      {orders.length === 0 && <p className="no-orders">No orders yet.</p>}
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-header-content">
                <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                <div className="order-customer">
                  Customer: {order.user?.name || 'Unknown'} | {order.user?.email}
                </div>
              </div>
            </div>

            <div className="order-body">
              <div className="order-items-section">
                <h4>Order Items:</h4>
                <div className="order-items">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span>{item.product?.title} x{item.quantity}</span>
                      <strong>₹{(item.quantity * item.price).toFixed(2)}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-total-section">
                <span>Total Amount:</span>
                <strong>₹{order.total.toFixed(2)}</strong>
              </div>

              <div className="order-footer">
                <div className="order-status-section">
                  <label>Update Status:</label>
                  <select
                    value={order.status}
                    onChange={e => updateStatus(order._id, e.target.value)}
                    className={`status-select status-${order.status}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('ecom_token');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
      const res = await axios.get(`${apiBase}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
  };

  return (
    <div className="user-orders-page">
      <h2 className="page-title">📦 My Order History</h2>
      {orders.length === 0 && (
        <div className="empty-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="btn btn-primary">Start Shopping</Link>
        </div>
      )}
      {orders.length > 0 && (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header-section">
                <div className="order-header">
                  <div>
                    <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="order-items-section">
                <h4>Order Items:</h4>
                <div className="order-items">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <div className="item-info">
                        <span className="item-name">{item.product?.title || 'Product'}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                      </div>
                      <span className="item-price">₹{(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="order-total-row">
                    <span>Total:</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="order-footer">
                <div className="order-status-info">
                  {order.status === 'pending' && '⏳ Your order is being processed'}
                  {order.status === 'confirmed' && '✅ Your order has been confirmed'}
                  {order.status === 'shipped' && '🚚 Your order is on the way'}
                  {order.status === 'delivered' && '📦 Your order has been delivered'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;