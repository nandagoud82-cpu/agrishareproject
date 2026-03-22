import { useState } from 'react';
import { useEquipmentList } from '../../hooks/useEquipment';
import { useFarmerBookings } from '../../hooks/useBookings';
import EquipmentList from '../../components/equipment/EquipmentList';
import BookingForm from '../../components/bookings/BookingForm';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';

export default function BrowseEquipment() {
  const { equipment, loading, error } = useEquipmentList();
  const { handleCreate, loading: bookLoading } = useFarmerBookings();

  const [selected, setSelected] = useState(null);   // equipment to book
  const [success,  setSuccess ] = useState(false);

  const handleBook = (eq) => {
    setSelected(eq);
    setSuccess(false);
  };

  const handleSubmit = async (payload) => {
    const ok = await handleCreate(payload);
    if (ok) {
      setSuccess(true);
      setTimeout(() => { setSelected(null); setSuccess(false); }, 1800);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Browse Equipment</h1>
        <p className="page-subtitle">Find and rent agricultural equipment near you</p>
      </div>

      {loading ? (
        <Spinner fullPage />
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <EquipmentList
          equipment={equipment}
          mode="browse"
          onBook={handleBook}
        />
      )}

      {/* Booking modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Book Equipment"
        size="lg"
      >
        {success ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h3 style={{ fontSize: 20, color: 'var(--green-800)', marginBottom: 6 }}>
              Request Sent!
            </h3>
            <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>
              Your booking request has been sent to the owner for approval.
            </p>
          </div>
        ) : (
          <BookingForm
            equipment={selected}
            onSubmit={handleSubmit}
            onCancel={() => setSelected(null)}
            loading={bookLoading}
          />
        )}
      </Modal>
    </div>
  );
}
