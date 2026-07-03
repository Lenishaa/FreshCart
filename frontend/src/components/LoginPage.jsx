import { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginPage({ onSubmit }) {
  const [activeTab, setActiveTab] = useState('user');
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleAdminLogin = () => {
    setForm({ email: 'admin@example.com', password: 'admin123' });
    onSubmit({ email: 'admin@example.com', password: 'admin123' });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account</p>
          </div>

          {/* Tab Navigation */}
          <div className="login-tabs">
            <button
              type="button"
              className={`tab-button ${activeTab === 'user' ? 'active' : ''}`}
              onClick={() => setActiveTab('user')}
            >
              👤 User Login
            </button>
            <button
              type="button"
              className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              ⚙️ Admin Login
            </button>
          </div>

          {activeTab === 'user' ? (
            <>
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📧</span>
                    <input
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-full">
                  Sign In
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  Don't have an account? <Link to="/register" className="link-primary">Create one</Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="admin-login-info">
                <div className="admin-badge">
                  <span className="admin-icon">🔐</span>
                  <div className="admin-info-text">
                    <h3>Administrator Access</h3>
                    <p>Use the following credentials to access the admin dashboard</p>
                  </div>
                </div>

                <div className="admin-credentials-box">
                  <div className="credential-item">
                    <span className="credential-label">Email:</span>
                    <code className="credential-value">admin@example.com</code>
                  </div>
                  <div className="credential-item">
                    <span className="credential-label">Password:</span>
                    <code className="credential-value">admin123</code>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn btn-admin btn-full"
                  onClick={handleAdminLogin}
                >
                  🔑 Login as Admin
                </button>

                <div className="admin-notice">
                  <p>⚠️ This area is restricted to authorized administrators only.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
