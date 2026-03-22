import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

// REMOVED: The DEMOS array is no longer needed

export default function LoginForm() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]   = useState({ email: '', password: '' });
  const [show, setShow]   = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // This now sends the entered credentials to your MySQL database via the API
    const result = await login(form); 
    if (result.success) {
      const map = { farmer: '/farmer/dashboard', owner: '/owner/dashboard', admin: '/admin/dashboard' };
      navigate(map[result.role] || '/farmer/dashboard');
    } else {
      setError(result.message || 'Login failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="alert alert-error mb-4">{error}</div>}

      {/* REMOVED: The Demo quick-fill <div> section */}

      <div className="form-group">
        <label className="form-label">Email address</label>
        <input
          type="email"
          className="form-input"
          placeholder="Enter your registered email"
          value={form.email}
          onChange={set('email')}
          autoComplete="email"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <div style={{ position: 'relative' }}>
          <input
            type={show ? 'text' : 'password'}
            className="form-input"
            placeholder="••••••••"
            value={form.password}
            onChange={set('password')}
            autoComplete="current-password"
            style={{ paddingRight: 44 }}
            required
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            style={{
              position: 'absolute', right: 12, top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--gray-400)',
              display: 'flex', alignItems: 'center',
            }}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full btn-lg"
        disabled={loading}
        style={{ marginTop: 8 }}
      >
        {loading ? 'Signing in...' : <><LogIn size={16} /> Sign In</>}
      </button>
    </form>
  );
}