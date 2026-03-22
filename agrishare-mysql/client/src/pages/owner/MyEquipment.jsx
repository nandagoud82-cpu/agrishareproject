import { useState } from 'react';
import { Plus, Tractor } from 'lucide-react';
import { useMyEquipment } from '../../hooks/useEquipment';
import EquipmentList from '../../components/equipment/EquipmentList';
import EquipmentForm from '../../components/equipment/EquipmentForm';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';

export default function MyEquipment() {
  const { equipment, loading, handleCreate, handleUpdate, handleDelete, handleToggle } = useMyEquipment();

  const [showAdd,  setShowAdd ] = useState(false);
  const [editing,  setEditing ] = useState(null);    // equipment object
  const [formLoad, setFormLoad] = useState(false);
  const [confirm,  setConfirm ] = useState(null);    // id to delete

  const onAdd = async (data) => {
    setFormLoad(true);
    const ok = await handleCreate(data);
    setFormLoad(false);
    if (ok) setShowAdd(false);
  };

  const onEdit = async (data) => {
    setFormLoad(true);
    const ok = await handleUpdate(editing._id, data);
    setFormLoad(false);
    if (ok) setEditing(null);
  };

  const onDelete = async () => {
    await handleDelete(confirm);
    setConfirm(null);
  };

  return (
    <div className="page-content">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="page-title">My Equipment</h1>
          <p className="page-subtitle">{equipment.length} item{equipment.length !== 1 ? 's' : ''} listed</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Equipment
        </button>
      </div>

      {loading ? (
        <Spinner fullPage />
      ) : (
        <EquipmentList
          equipment={equipment}
          mode="manage"
          onEdit={setEditing}
          onDelete={(id) => setConfirm(id)}
          onToggle={handleToggle}
        />
      )}

      {/* Add modal */}
      <Modal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="List New Equipment"
        size="lg"
      >
        <EquipmentForm
          onSubmit={onAdd}
          onCancel={() => setShowAdd(false)}
          loading={formLoad}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Equipment"
        size="lg"
      >
        <EquipmentForm
          initial={editing}
          onSubmit={onEdit}
          onCancel={() => setEditing(null)}
          loading={formLoad}
        />
      </Modal>

      {/* Confirm delete */}
      <Modal
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        title="Delete Equipment"
        size="sm"
      >
        <p style={{ color: 'var(--gray-600)', fontSize: 14, marginBottom: 4 }}>
          Are you sure you want to remove this equipment? This action cannot be undone.
        </p>
        <div className="modal-footer" style={{ paddingTop: 16 }}>
          <button className="btn btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={onDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}
