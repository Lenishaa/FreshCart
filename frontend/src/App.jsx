import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All', 'Fruit', 'Vegetables', 'Dairy', 'Bakery', 'Pantry', 'Beverages', 'Meat']);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
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
  };

  const updateCartQuantity = (productId, qty) => {
    setCart(prev => prev.map(item => item.product._id === productId ? { ...item, quantity: Math.max(1, qty) } : item));
  };

  const removeFromCart = productId => {
    setCart(prev => prev.filter(item => item.product._id !== productId));
  };

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email: form.email, password: form.password });
      setUser(res.data.user);
      localStorage.setItem('ecom_user', JSON.stringify(res.data.user));
      localStorage.setItem('ecom_token', res.data.token);
      setForm({ email: '', password: '', name: '' });
      navigate(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed: ' + error.message);
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, { name: form.name, email: form.email, password: form.password });
      setUser(res.data.user);
      localStorage.setItem('ecom_user', JSON.stringify(res.data.user));
      localStorage.setItem('ecom_token', res.data.token);
      setForm({ email: '', password: '', name: '' });
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
      <header>
        <div>
          <Link to="/" onClick={() => setSelectedCategory('All')}><h1>🛒 GroceryHub</h1></Link>
        </div>
        <nav>
          {user?.role === 'admin' && <Link to="/admin" className="nav-admin">📊 Admin</Link>}
          {user?.role !== 'admin' && <Link to="/">Products</Link>}
          {user?.role !== 'admin' && <Link to="/cart">Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</Link>}
          {user ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span>👤 {user.name} ({user.role})</span>
              <button onClick={handleLogout} style={{ background: '#ef4444', marginLeft: '0.5rem' }}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="nav-button">Login</Link>
              <Link to="/register" className="nav-button" style={{ background: '#10b981' }}>Register</Link>
            </div>
          )}
        </nav>
      </header>
      <main>
        {user?.role !== 'admin' && (
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ marginRight: '0.5rem' }}>Category:</label>
            <select value={selectedCategory} onChange={e => { setSelectedCategory(e.target.value); }}>
              {categories.map(c => (<option key={c} value={c}>{c}</option>))}
            </select>
            <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginLeft: '0.5rem', padding: '0.5rem', flex: 1, minWidth: '200px' }} />
            <button style={{ marginLeft: '0.5rem' }} onClick={fetchProducts}>Search</button>
          </div>
        )}
        <Routes>
          <Route path="/" element={<ProductList products={products} addToCart={addToCart} />} />
          <Route path="/login" element={<AuthForm form={form} setForm={setForm} onSubmit={handleLogin} title="Login" />} />
          <Route path="/register" element={<AuthForm form={form} setForm={setForm} onSubmit={handleRegister} title="Register" />} />
          <Route path="/cart" element={<Cart cart={cart} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} onCheckout={handleCheckout} />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard products={products} fetchProducts={fetchProducts} /> : <Redirect />} />
          <Route path="/admin/orders" element={user?.role === 'admin' ? <AdminOrders /> : <Redirect />} />
        </Routes>
      </main>
    </div>
  );
}

function ProductList({ products, addToCart }) {
  return (
    <section>
      <h2>🏪 Fresh Groceries</h2>
      {products.length === 0 && <p>No products found.</p>}
      <div className="product-grid">
        {products.map(product => (
          <article key={product._id} className="product-card">
            <img src={product.image || 'https://via.placeholder.com/200'} alt={product.title} />
            <h3>{product.title} <small>({product.category})</small></h3>
            <p>{product.description}</p>
            <div className="product-meta">
              <span className="price">${product.price.toFixed(2)}</span>
              <span className="unit">/ {product.unit}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: product.perishable ? '#dc2626' : '#047857' }}>
                {product.perishable ? '🔴 Perishable' : '✓ Non-perishable'}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Stock: {product.stock}</span>
            </div>
            <button onClick={() => addToCart(product)} disabled={product.stock <= 0} className="btn-add">
              {product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function AuthForm({ form, setForm, onSubmit, title }) {
  return (
    <section className="auth-panel">
      <h2>{title}</h2>
      <form onSubmit={onSubmit}>
        {title === 'Register' && (
          <label>
            Full Name
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </label>
        )}
        <label>
          Email
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        </label>
        <button type="submit">{title}</button>
      </form>
      <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#6b7280', marginTop: '1rem' }}>
        💡 <strong>Demo</strong>: admin@example.com / admin123 (admin) or create a new account (user)
      </p>
    </section>
  );
}

function Cart({ cart, updateCartQuantity, removeFromCart, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  return (
    <section>
      <h2>🛒 Your Cart</h2>
      {cart.length === 0 && <p>Your cart is empty. <Link to="/">Browse products</Link></p>}
      {cart.length > 0 && (
        <>
          <div className="cart-list">
            {cart.map(item => (
              <div key={item.product._id} className="cart-item">
                <div className="cart-item-info">
                  <strong>{item.product.title}</strong>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>{item.product.unit} · ${item.product.price.toFixed(2)}</div>
                </div>
                <div className="cart-item-controls">
                  <button onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}>−</button>
                  <div className="qty">{item.quantity}</div>
                  <button onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}>+</button>
                  <div className="subtotal">${(item.quantity * item.product.price).toFixed(2)}</div>
                  <button onClick={() => removeFromCart(item.product._id)} style={{ background: '#ef4444' }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total: ${total.toFixed(2)}</div>
            <button onClick={onCheckout} className="btn-checkout">Place Order</button>
          </div>
        </>
      )}
    </section>
  );
}

function AdminDashboard({ products, fetchProducts }) {
  const [formData, setFormData] = useState({ title: '', description: '', category: '', unit: 'unit', perishable: true, price: 0, stock: 100, image: '' });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem('ecom_token');

  const handleSave = async e => {
    e.preventDefault();
    try {
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
      if (editingId) {
        await axios.put(`${apiBase}/products/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Product updated');
      } else {
        await axios.post(`${apiBase}/products`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Product created');
      }
      setFormData({ title: '', description: '', category: '', unit: 'unit', perishable: true, price: 0, stock: 100, image: '' });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async id => {
    if (window.confirm('Delete product?')) {
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
    <section className="admin-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>📊 Admin Dashboard</h2>
        <Link to="/admin/orders" className="btn-secondary">View Orders</Link>
      </div>
      <div className="admin-form-section">
        <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={handleSave} className="admin-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
            <input type="text" placeholder="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
            <input type="text" placeholder="Unit (kg, unit, pack, etc)" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} required />
            <input type="number" placeholder="Price" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} required />
            <input type="number" placeholder="Stock" value={formData.stock} onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })} required />
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" checked={formData.perishable} onChange={e => setFormData({ ...formData, perishable: e.target.checked })} />
              Perishable?
            </label>
            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ gridColumn: '1 / -1' }} />
            <input type="text" placeholder="Image URL" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} style={{ gridColumn: '1 / -1' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit">{editingId ? 'Update' : 'Add'} Product</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ title: '', description: '', category: '', unit: 'unit', perishable: true, price: 0, stock: 100, image: '' }); }}>Cancel</button>}
          </div>
        </form>
      </div>

      <h3 style={{ marginTop: '2rem' }}>📦 All Products ({products.length})</h3>
      <div className="admin-table">
        {products.map(product => (
          <div key={product._id} className="admin-row">
            <div>
              <strong>{product.title}</strong>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{product.category} · ${product.price}</div>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Stock: {product.stock}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleEdit(product)} style={{ background: '#2563eb' }}>Edit</button>
              <button onClick={() => handleDelete(product._id)} style={{ background: '#ef4444' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AdminOrders() {
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
    <section className="admin-panel">
      <h2>📋 Order Monitoring</h2>
      <Link to="/admin" className="btn-secondary" style={{ marginBottom: '1rem' }}>Back to Dashboard</Link>
      
      {orders.length === 0 && <p>No orders yet.</p>}
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div>
              <strong>Order #{order._id.slice(-6)}</strong>
              <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                Customer: {order.user?.name || 'Unknown'} | Total: ${order.total.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>
                {order.items?.map(item => `${item.product?.title} x${item.quantity}`).join(', ')}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Redirect() {
  return <p>Access denied. Admin only.</p>;
}

export default App;
