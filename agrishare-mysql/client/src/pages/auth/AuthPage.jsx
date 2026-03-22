import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';

export default function AuthPage() {
  const { isLoggedIn, user, authChecked } = useAuth();
  const [tab, setTab] = useState('login');

  // Redirect if already logged in
  if (authChecked && isLoggedIn) {
    const map = { farmer: '/farmer/dashboard', owner: '/owner/dashboard', admin: '/admin/dashboard' };
    return <Navigate to={map[user.role] || '/farmer/dashboard'} replace />;
  }

  return (
    <div className="auth-page">
      {/* ── Left hero panel ── */}
      <div className="auth-left">
        <div className="auth-hero fade-in-left">
          <span className="auth-hero-icon">🌾</span>
          <h1>
            Rent Farm<br />
            <em>Equipment</em><br />
            Easily
          </h1>
          <p>
            AgriShare connects farmers with equipment owners across India.
            Book tractors, harvesters, sprayers and more — at fair prices,
            with zero middlemen.
          </p>

          <div className="auth-stats">
            {[
              { val: '500+', lbl: 'Equipment Listed' },
              { val: '1,200+', lbl: 'Active Farmers' },
              { val: '4.8★', lbl: 'Avg. Rating' },
            ].map(({ val, lbl }) => (
              <div className="auth-stat" key={lbl}>
                <p className="val">{val}</p>
                <p className="lbl">{lbl}</p>
              </div>
            ))}
          </div>

          {/* Feature pills */}
          <div style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {['✅ No Advance Payment', '📍 Location Based', '🔒 Secure Booking', '📱 Mobile Friendly'].map((f) => (
              <span key={f} style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 'var(--radius-full)',
                padding: '5px 14px',
                fontSize: 12,
                color: 'rgba(255,255,255,0.9)',
              }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-right">
        <div className="auth-form-wrap fade-in">
          <div className="auth-brand">
            <div className="auth-brand-icon">🌿</div>
            <span>AgriShare</span>
          </div>

          <h2 className="auth-title">
            {tab === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="auth-sub">
            {tab === 'login'
              ? 'Sign in to access your dashboard'
              : 'Join thousands of farmers & owners'}
          </p>

          {/* Tab switcher */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => setTab('login')}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => setTab('register')}
            >
              Register
            </button>
          </div>

          {tab === 'login' ? <LoginForm /> : <RegisterForm />}

          <p style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--gray-400)' }}>
            {tab === 'login' ? (
              <>No account?{' '}
                <button
                  onClick={() => setTab('register')}
                  style={{ background: 'none', border: 'none', color: 'var(--green-600)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
                >
                  Register free
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button
                  onClick={() => setTab('login')}
                  style={{ background: 'none', border: 'none', color: 'var(--green-600)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
