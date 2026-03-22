import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMyEquipment } from '../../hooks/useEquipment';
import EquipmentForm from '../../components/equipment/EquipmentForm';

export default function AddEquipment() {
  const { handleCreate } = useMyEquipment();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    const ok = await handleCreate(data);
    setLoading(false);
    if (ok) navigate('/owner/equipment');
  };

  return (
    <div className="page-content">
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 20 }}
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div className="page-header">
        <h1 className="page-title">List New Equipment</h1>
        <p className="page-subtitle">Fill in the details to list your equipment for rent</p>
      </div>

      <div style={{ maxWidth: 640 }}>
        {/* Tips card */}
        <div style={{
          background: 'var(--green-50)',
          border: '1.5px solid var(--green-200)',
          borderRadius: 'var(--radius)',
          padding: '16px 20px',
          marginBottom: 24,
        }}>
          <p style={{ fontWeight: 700, color: 'var(--green-800)', marginBottom: 8, fontSize: 14 }}>
            💡 Tips for a great listing
          </p>
          <ul style={{ fontSize: 13, color: 'var(--green-700)', paddingLeft: 18, lineHeight: 1.8 }}>
            <li>Use a clear, descriptive name including the brand and model</li>
            <li>Set a competitive price — check similar equipment in your area</li>
            <li>Include specs like HP, capacity, and model year</li>
            <li>Write a detailed description mentioning condition and best use</li>
          </ul>
        </div>

        <div className="card">
          <EquipmentForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/owner/equipment')}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
