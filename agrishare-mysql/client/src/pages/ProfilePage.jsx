import { useState } from 'react';
import { Save, User, Phone, MapPin, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp as useAuth } from '../hooks/useAuth.js'; // Corrected path
import { updateProfile, changePassword } from '../services/authService.js';
import { INDIAN_STATES } from '../utils/constants.js';
import { getInitials, isValidPhone } from '../utils/helpers.js';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name:     user?.name     || '',
    phone:    user?.phone    || '',
    location: user?.location || '',
  });
  const [pwForm, setPwForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });
  const [saving,   setSaving  ] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [errors,   setErrors  ] = useState({});
  const [pwErrors, setPwErrors] = useState({});

  const set   = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setPw = (k) => (e) => setPwForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim())        errs.name  = 'Name required.';
    if (!isValidPhone(form.phone)) errs.phone = 'Valid 10-digit phone.';
    if (!form.location)            errs.location = 'Select a state.';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const data = await updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally { setSaving(false); }
  };

  const handleChangePw = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!pwForm.currentPassword)              errs.currentPassword = 'Required.';
    if (pwForm.newPassword.length < 6)        errs.newPassword     = 'Min 6 characters.';
    if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirmPassword = 'Does not match.';
    if (Object.keys(errs).length) { setPwErrors(errs); return; }

    setPwSaving(true);
    try {
      await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally { setPwSaving(false); }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account information</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, maxWidth: 900 }}>
        {/* Avatar card */}
        <div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{
              width: 90, height: 90,
              background: 'linear-gradient(135deg, var(--green-600), var(--green-800))',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 32, fontWeight: 700, color: 'white',
              fontFamily: 'var(--font-display)',
            }}>
              {getInitials(user?.name)}
            </div>
            <h3 style={{ fontSize: 18, color: 'var(--green-900)' }}>{user?.name}</h3>
            <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4, textTransform: 'capitalize' }}>
              {user?.role}
            </p>
            <div style={{ marginTop: 16 }}>
              <span className={`badge ${user?.role === 'farmer' ? 'badge-green' : user?.role === 'owner' ? 'badge-blue' : 'badge-dark'}`}>
                {user?.role === 'farmer' ? '👨‍🌾 Farmer' : user?.role === 'owner' ? '🏭 Equipment Owner' : '🛡️ Admin'}
              </span>
            </div>

            <div style={{ marginTop: 20, fontSize: 13, color: 'var(--gray-500)', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <Mail size={14} color="var(--green-600)" />
                <span style={{ wordBreak: 'break-all' }}>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <Phone size={14} color="var(--green-600)" />
                <span>{user?.phone || '—'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
                <MapPin size={14} color="var(--green-600)" />
                <span>{user?.location || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Profile form */}
          <div className="card">
            <h3 style={{ fontSize: 17, color: 'var(--green-900)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={18} color="var(--green-600)" /> Personal Information
            </h3>
            <form onSubmit={handleSave} noValidate>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className={`form-input ${errors.name ? 'error' : ''}`} value={form.name} onChange={set('name')} />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={user?.email} disabled style={{ background: 'var(--gray-50)', color: 'var(--gray-400)' }} />
                <p className="form-hint">Email cannot be changed.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className={`form-input ${errors.phone ? 'error' : ''}`} value={form.phone} onChange={set('phone')} maxLength={10} />
                  {errors.phone && <p className="form-error">{errors.phone}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <select className={`form-select ${errors.location ? 'error' : ''}`} value={form.location} onChange={set('location')}>
                    <option value="">— Select —</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.location && <p className="form-error">{errors.location}</p>}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving
                    ? <span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    : <><Save size={15} /> Save Changes</>
                  }
                </button>
              </div>
            </form>
          </div>

          {/* Change password */}
          <div className="card">
            <h3 style={{ fontSize: 17, color: 'var(--green-900)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Lock size={18} color="var(--green-600)" /> Change Password
            </h3>
            <form onSubmit={handleChangePw} noValidate>
              {['currentPassword', 'newPassword', 'confirmPassword'].map((key) => (
                <div className="form-group" key={key}>
                  <label className="form-label">
                    {key === 'currentPassword' ? 'Current Password' : key === 'newPassword' ? 'New Password' : 'Confirm New Password'}
                  </label>
                  <input
                    type="password"
                    className={`form-input ${pwErrors[key] ? 'error' : ''}`}
                    value={pwForm[key]}
                    onChange={setPw(key)}
                    placeholder="••••••••"
                  />
                  {pwErrors[key] && <p className="form-error">{pwErrors[key]}</p>}
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-outline" disabled={pwSaving}>
                  {pwSaving
                    ? <span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    : <><Lock size={15} /> Update Password</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
