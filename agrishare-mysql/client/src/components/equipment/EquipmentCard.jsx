import { MapPin, IndianRupee, Calendar } from 'lucide-react';
import { AvailBadge } from '../common/Badge';
import { getEquipmentEmoji, getEquipmentBg, formatCurrency } from '../../utils/helpers';

export default function EquipmentCard({
  equipment,
  onBook,          // farmer action
  onEdit,          // owner action
  onDelete,        // owner action
  onToggle,        // owner: toggle availability
  mode = 'browse', // 'browse' | 'manage'
}) {
  const { name, category, pricePerDay, location, available, description, specs } = equipment;
  const emoji = getEquipmentEmoji(category);
  const bg    = getEquipmentBg(category);

  return (
    <div className="equip-card">
      {/* Image area */}
      <div className="equip-card-image" style={{ background: bg }}>
        <span style={{ fontSize: 72, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }}>
          {emoji}
        </span>
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <AvailBadge available={available} />
        </div>
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: 'rgba(5,46,22,0.75)',
          borderRadius: 'var(--radius-full)',
          padding: '2px 10px',
          fontSize: 11, fontWeight: 600, color: 'white',
        }}>
          {category}
        </div>
      </div>

      {/* Body */}
      <div className="equip-card-body">
        <h3 className="equip-card-name">{name}</h3>

        <div className="equip-card-meta">
          <MapPin size={12} />
          {location}
        </div>

        {specs && (
          <p style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 10, lineHeight: 1.4 }}>
            {specs}
          </p>
        )}

        <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 12, lineHeight: 1.5 }}>
          {description?.length > 70 ? description.slice(0, 70) + '…' : description}
        </p>

        <div style={{ marginTop: 'auto' }}>
          <p className="equip-card-price">
            {formatCurrency(pricePerDay)}
            <span> / day</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="equip-card-footer">
        {mode === 'browse' && (
          <>
            <button
              className="btn btn-outline btn-sm"
              style={{ flex: 1 }}
              onClick={() => onBook?.(equipment)}
              disabled={!available}
            >
              <Calendar size={14} />
              {available ? 'Book Now' : 'Unavailable'}
            </button>
          </>
        )}

        {mode === 'manage' && (
          <>
            <button
              className={`btn btn-sm ${available ? 'btn-warning' : 'btn-secondary'}`}
              onClick={() => onToggle?.(equipment._id)}
              title={available ? 'Mark unavailable' : 'Mark available'}
              style={{ flex: 1 }}
            >
              {available ? '⏸ Pause' : '▶ Activate'}
            </button>
            <button
              className="btn btn-outline btn-sm btn-icon"
              onClick={() => onEdit?.(equipment)}
              title="Edit"
            >
              ✏️
            </button>
            <button
              className="btn btn-danger btn-sm btn-icon"
              onClick={() => onDelete?.(equipment._id)}
              title="Delete"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
}
