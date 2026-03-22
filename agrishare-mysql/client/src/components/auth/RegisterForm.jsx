import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import RoleSelector from './RoleSelector';
import { INDIAN_STATES } from '../../utils/constants';
import { isValidEmail, isValidPhone } from '../../utils/helpers';

export default function RegisterForm() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'farmer', phone: '', location: '',
  });
  const [show,   setShow  ] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())           errs.name     = 'Name is required.';
    if (!isValidEmail(form.email))   errs.email    = 'Valid email required.';
    if (form.password.length < 6)    errs.password = 'Min 6 characters.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    if (!isValidPhone(form.phone))   errs.phone    = 'Valid 10-digit phone required.';
    if (!form.location)              errs.location = 'Please select your state.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const { confirmPassword, ...payload } = form;
    const result = await register(payload);
    if (result.success) {
      const map = { farmer: '/farmer/dashboard', owner: '/owner/dashboard' };
      navigate(map[result.role] || '/farmer/dashboard');
    }
  };

  const field = (key, label, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className={`form-input ${errors[key] ? 'error' : ''}`}
        placeholder={placeholder}
        value={form[key]}
        onChange={set(key)}
      />
      {errors[key] && <p className="form-error">{errors[key]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      <RoleSelector value={form.role} onChange={(v) => setForm((f) => ({ ...f, role: v }))} />

      {field('name',  'Full Name',  'text',  'Ravi Kumar')}
      {field('email', 'Email',      'email', 'you@example.com')}
      {field('phone', 'Phone',      'tel',   '9876543210')}

      <div className="form-group">
        <label className="form-label">State</label>
        <select
          className={`form-select ${errors.location ? 'error' : ''}`}
          value={form.location}
          onChange={set('location')}
        >
          <option value="">— Select State —</option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.location && <p className="form-error">{errors.location}</p>}
      </div>

      {/* Password */}
      <div className="form-group">
        <label className="form-label">Password</label>
        <div style={{ position: 'relative' }}>
          <input
            type={show ? 'text' : 'password'}
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="Min 6 characters"
            value={form.password}
            onChange={set('password')}
            style={{ paddingRight: 44 }}
          />
          <button type="button" onClick={() => setShow((s) => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="form-error">{errors.password}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Confirm Password</label>
        <input
          type="password"
          className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
          placeholder="Repeat password"
          value={form.confirmPassword}
          onChange={set('confirmPassword')}
        />
        {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full btn-lg"
        disabled={loading}
        style={{ marginTop: 8 }}
      >
        {loading
          ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              Creating account…
            </span>
          : <><UserPlus size={16} /> Create Account</>
        }
      </button>
    </form>
  );
}
