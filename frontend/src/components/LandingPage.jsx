import { Link } from 'react-router-dom';

function LandingPage({ user, onLogout }) {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="brand">Welcome to FreshCart</span>
          </h1>
          <p className="hero-subtitle">
            Your one-stop destination for quality products at unbeatable prices

          </p>
          <div className="hero-buttons">
            {!user ? (
              <>
                <Link to="/register" className="btn btn-primary btn-large">
                  Register
                </Link>
                <Link to="/login" className="btn btn-secondary btn-large">
                  Login
                </Link>
              </>
            ) : (
              <Link to="/" className="btn btn-primary btn-large">
                Browse Products
              </Link>
            )}
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop" 
            alt="Fresh groceries" 
            className="hero-img card-1"
          />
          <img 
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop" 
            alt="Online shopping" 
            className="hero-img card-2"
          />
          <img 
            src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop" 
            alt="Fast delivery" 
            className="hero-img card-3"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Delivery</h3>
            <p>Quick delivery service</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>Quality Products</h3>
            <p>Wide range of products</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Shopping</h3>
            <p>Safe and secure platform</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💝</div>
            <h3>Best Prices</h3>
            <p>Affordable pricing</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Get Started</h2>
          <p>Create an account to start shopping</p>
          {!user ? (
            <Link to="/register" className="btn btn-primary btn-large">
              Create Account
            </Link>
          ) : (
            <Link to="/" className="btn btn-primary btn-large">
              Browse Products
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 FreshCart. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;