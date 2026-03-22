import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { EQUIPMENT_CATEGORIES, INDIAN_STATES } from '../../utils/constants';

const EMPTY = {
  name: '', category: 'Tractor', pricePerDay: '',
  location: '', description: '', specs: '',
};

export default function EquipmentForm({ initial = null, onSubmit, onCancel, loading = false }) {
  const [form,   setForm  ] = useState(initial || EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())                     errs.name        = 'Equipment name is required.';
    if (!form.category)                         errs.category    = 'Select a category.';
    if (!form.pricePerDay || form.pricePerDay <= 0) errs.pricePerDay = 'Valid price required.';
    if (!form.location)                         errs.location    = 'Select a location.';
    if (!form.description.trim())               errs.description = 'Description is required.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ ...form, pricePerDay: Number(form.pricePerDay) });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Name */}
      <div className="form-group">
        <label className="form-label">Equipment Name *</label>
        <input
          className={`form-input ${errors.name ? 'error' : ''}`}
          placeholder="e.g. John Deere 5075E Tractor"
          value={form.name}
          onChange={set('name')}
        />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      {/* Category + Price row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="form-group">
          <label className="form-label">Category *</label>
          <select
            className={`form-select ${errors.category ? 'error' : ''}`}
            value={form.category}
            onChange={set('category')}
          >
            {EQUIPMENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <p className="form-error">{errors.category}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Price per Day (₹) *</label>
          <input
            type="number"
            className={`form-input ${errors.pricePerDay ? 'error' : ''}`}
            placeholder="e.g. 3500"
            value={form.pricePerDay}
            onChange={set('pricePerDay')}
            min={1}
          />
          {errors.pricePerDay && <p className="form-error">{errors.pricePerDay}</p>}
        </div>
      </div>

      {/* Location */}
      <div className="form-group">
        <label className="form-label">Location *</label>
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

      {/* Specs */}
      <div className="form-group">
        <label className="form-label">Specifications</label>
        <input
          className="form-input"
          placeholder="e.g. 75 HP | 4WD | 2023 Model"
          value={form.specs}
          onChange={set('specs')}
        />
        <p className="form-hint">Brief technical specs shown on the card.</p>
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">Description *</label>
        <textarea
          className={`form-textarea ${errors.description ? 'error' : ''}`}
          placeholder="Describe the equipment, its condition and best use cases…"
          value={form.description}
          onChange={set('description')}
          rows={3}
        />
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>

      {/* Footer buttons */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            <X size={15} /> Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading
            ? <span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
            : <><Save size={15} /> {initial ? 'Update' : 'List Equipment'}</>
          }
        </button>
      </div>
    </form>
  );
}
