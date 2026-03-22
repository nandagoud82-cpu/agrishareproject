import { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import EquipmentCard from './EquipmentCard';
import EmptyState from '../common/EmptyState';
import { EQUIPMENT_CATEGORIES } from '../../utils/constants';
import { filterEquipment, sortEquipment } from '../../utils/helpers';

export default function EquipmentList({
  equipment = [],
  mode = 'browse',
  onBook,
  onEdit,
  onDelete,
  onToggle,
}) {
  const [search,   setSearch  ] = useState('');
  const [category, setCategory] = useState('');
  const [avail,    setAvail   ] = useState('');
  const [sortBy,   setSortBy  ] = useState('');

  const filtered = useMemo(() => {
    const f = filterEquipment(equipment, {
      search,
      category,
      available: avail === 'true' ? true : avail === 'false' ? false : undefined,
    });
    return sortEquipment(f, sortBy);
  }, [equipment, search, category, avail, sortBy]);

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="search-bar">
        {/* Search */}
        <div className="search-input-wrap">
          <span className="search-icon"><Search size={15} /></span>
          <input
            placeholder="Search equipment, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category */}
        <select
          className="form-select"
          style={{ width: 'auto', minWidth: 150, height: 40, padding: '0 12px' }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {EQUIPMENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Availability */}
        <select
          className="form-select"
          style={{ width: 'auto', minWidth: 140, height: 40, padding: '0 12px' }}
          value={avail}
          onChange={(e) => setAvail(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>

        {/* Sort */}
        <select
          className="form-select"
          style={{ width: 'auto', minWidth: 150, height: 40, padding: '0 12px' }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* Results count */}
      {search || category || avail ? (
        <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 16 }}>
          Showing <strong>{filtered.length}</strong> of <strong>{equipment.length}</strong> results
          {search && <> for "<strong>{search}</strong>"</>}
        </p>
      ) : null}

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="🚜"
          title="No equipment found"
          description={
            search
              ? `No results for "${search}". Try a different search.`
              : 'No equipment matches your filters.'
          }
        />
      ) : (
        <div className="grid-3 stagger">
          {filtered.map((eq) => (
            <EquipmentCard
              key={eq._id}
              equipment={eq}
              mode={mode}
              onBook={onBook}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
