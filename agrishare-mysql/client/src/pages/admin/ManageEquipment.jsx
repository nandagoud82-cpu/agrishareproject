import { useState, useEffect, useMemo } from 'react';
import { Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { AvailBadge } from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency, getEquipmentEmoji } from '../../utils/helpers';
import { EQUIPMENT_CATEGORIES } from '../../utils/constants';

export default function ManageEquipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading,   setLoading  ] = useState(true);
  const [search,    setSearch   ] = useState('');
  const [category,  setCategory ] = useState('');
  const [confirm,   setConfirm  ] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/equipment');
        setEquipment(data.equipment);
      } catch { toast.error('Failed to load equipment.'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = useMemo(() => {
    return equipment.filter((e) => {
      const q = search.toLowerCase();
      const matchSearch = !search
        || e.name.toLowerCase().includes(q)
        || e.location.toLowerCase().includes(q);
      const matchCat = !category || e.category === category;
      return matchSearch && matchCat;
    });
  }, [equipment, search, category]);

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/equipment/${confirm._id}`);
      setEquipment((prev) => prev.filter((e) => e._id !== confirm._id));
      toast.success('Equipment removed.');
      setConfirm(null);
    } catch {
      toast.error('Failed to delete equipment.');
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Manage Equipment</h1>
        <p className="page-subtitle">{equipment.length} items listed across the platform</p>
      </div>

      {/* Filters */}
      <div className="search-bar" style={{ marginBottom: 20 }}>
        <div className="search-input-wrap">
          <span className="search-icon"><Search size={15} /></span>
          <input
            placeholder="Search by name or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          style={{ width: 'auto', minWidth: 150, height: 40, padding: '0 12px' }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {EQUIPMENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card fade-in">
        {loading ? (
          <Spinner fullPage />
        ) : filtered.length === 0 ? (
          <EmptyState icon="🚜" title="No equipment found" description="Try adjusting your filters." />
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Owner</th>
                  <th>Category</th>
                  <th>Price/Day</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((eq) => (
                  <tr key={eq._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 40, height: 40,
                          background: 'var(--green-100)',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 20, flexShrink: 0,
                        }}>
                          {getEquipmentEmoji(eq.category)}
                        </div>
                        <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--gray-900)' }}>
                          {eq.name}
                        </p>
                      </div>
                    </td>
                    <td>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{eq.owner?.name || '—'}</p>
                      <p style={{ fontSize: 11, color: 'var(--gray-400)' }}>{eq.owner?.email}</p>
                    </td>
                    <td>
                      <span className="badge badge-gray">{eq.category}</span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--green-700)', fontSize: 14 }}>
                        {formatCurrency(eq.pricePerDay)}
                      </span>
                    </td>
                    <td style={{ fontSize: 13 }}>{eq.location}</td>
                    <td><AvailBadge available={eq.available} /></td>
                    <td>
                      <button
                        className="btn btn-danger btn-xs"
                        onClick={() => setConfirm(eq)}
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm delete */}
      <Modal
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        title="Remove Equipment"
        size="sm"
      >
        {confirm && (
          <>
            <p style={{ fontSize: 14, color: 'var(--gray-600)', marginBottom: 6 }}>
              Are you sure you want to remove{' '}
              <strong>"{confirm.name}"</strong>?
              All associated bookings will also be affected.
            </p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
