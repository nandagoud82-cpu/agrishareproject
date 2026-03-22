import { useState, useEffect, useMemo } from 'react';
import { Search, Trash2, UserX } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { RoleBadge } from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import { formatDate, getInitials } from '../../utils/helpers';

export default function ManageUsers() {
  const [users,    setUsers   ] = useState([]);
  const [loading,  setLoading ] = useState(true);
  const [search,   setSearch  ] = useState('');
  const [roleFilter, setRole  ] = useState('');
  const [confirm,  setConfirm ] = useState(null);  // user to delete

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/admin/users');
        setUsers(data.users);
      } catch { toast.error('Failed to load users.'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch = !search
        || u.name.toLowerCase().includes(q)
        || u.email.toLowerCase().includes(q)
        || (u.phone || '').includes(q);
      const matchRole = !roleFilter || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/users/${confirm._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== confirm._id));
      toast.success('User removed.');
      setConfirm(null);
    } catch {
      toast.error('Failed to delete user.');
    }
  };

  const counts = useMemo(() => ({
    all:    users.length,
    farmer: users.filter((u) => u.role === 'farmer').length,
    owner:  users.filter((u) => u.role === 'owner').length,
    admin:  users.filter((u) => u.role === 'admin').length,
  }), [users]);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Manage Users</h1>
        <p className="page-subtitle">{users.length} registered users on the platform</p>
      </div>

      {/* Summary pills */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { key: '',       label: `All (${counts.all})`,       bg: 'var(--gray-100)',   color: 'var(--gray-700)' },
          { key: 'farmer', label: `👨‍🌾 Farmers (${counts.farmer})`, bg: 'var(--green-100)', color: 'var(--green-800)' },
          { key: 'owner',  label: `🏭 Owners (${counts.owner})`,  bg: 'var(--blue-100)',  color: '#1e40af' },
          { key: 'admin',  label: `🛡️ Admins (${counts.admin})`,  bg: 'var(--green-900)', color: 'var(--green-300)' },
        ].map(({ key, label, bg, color }) => (
          <button
            key={key}
            onClick={() => setRole(key)}
            style={{
              padding: '7px 18px',
              borderRadius: 'var(--radius-full)',
              border: roleFilter === key ? 'none' : '1.5px solid var(--gray-200)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: roleFilter === key ? bg : 'white',
              color: roleFilter === key ? color : 'var(--gray-600)',
              transition: 'var(--transition)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="search-bar" style={{ marginBottom: 20 }}>
        <div className="search-input-wrap">
          <span className="search-icon"><Search size={15} /></span>
          <input
            placeholder="Search by name, email or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card fade-in">
        {loading ? (
          <Spinner fullPage />
        ) : filtered.length === 0 ? (
          <EmptyState icon="👤" title="No users found" description="Try adjusting your search or filter." />
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: u.role === 'farmer' ? 'var(--green-100)' : u.role === 'owner' ? 'var(--blue-100)' : 'var(--green-900)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 700, flexShrink: 0,
                          color: u.role === 'admin' ? 'var(--green-300)' : u.role === 'owner' ? '#1e40af' : 'var(--green-800)',
                        }}>
                          {getInitials(u.name)}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--gray-900)' }}>{u.name}</p>
                          <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><RoleBadge role={u.role} /></td>
                    <td style={{ fontSize: 13 }}>{u.phone || '—'}</td>
                    <td style={{ fontSize: 13 }}>{u.location || '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{formatDate(u.createdAt)}</td>
                    <td>
                      {u.role !== 'admin' && (
                        <button
                          className="btn btn-danger btn-xs"
                          onClick={() => setConfirm(u)}
                          title="Delete user"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm delete modal */}
      <Modal
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        title="Remove User"
        size="sm"
      >
        {confirm && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--red-50)', border: '1.5px solid var(--red-100)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 16 }}>
              <UserX size={24} color="var(--red-500)" />
              <div>
                <p style={{ fontWeight: 700, color: 'var(--gray-800)', fontSize: 14 }}>{confirm.name}</p>
                <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>{confirm.email}</p>
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'var(--gray-600)' }}>
              This will permanently remove the user and all their data. This action cannot be undone.
            </p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>
                <Trash2 size={14} /> Delete User
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
