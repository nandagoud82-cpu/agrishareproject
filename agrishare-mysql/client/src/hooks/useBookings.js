import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  createBooking, getMyBookings, getOwnerBookings,
  updateBookingStatus, cancelBooking, completeBooking, getAllBookings,
} from '../services/bookingService';

/**
 * Hook for farmer's bookings
 */
export const useFarmerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading ] = useState(true);
  const [error,    setError   ] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await getMyBookings();
      setBookings(data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleCreate = async (payload) => {
    try {
      const data = await createBooking(payload);
      if (data?.booking) setBookings(prev => [data.booking, ...prev]);
      toast.success('Booking request sent!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed.');
      return false;
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled.');
    } catch (err) {
      toast.error('Failed to cancel booking.');
    }
  };

  return { bookings, loading, error, handleCreate, handleCancel, refetch: fetch };
};

/**
 * Hook for owner's booking requests
 */
export const useOwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading ] = useState(true);
  const [error,    setError   ] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await getOwnerBookings();
      setBookings(data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load requests.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleStatus = async (id, status) => {
    try {
      const data = await updateBookingStatus(id, status);
      if (data?.booking) setBookings(prev => prev.map(b => b.id === id ? data.booking : b));
      toast.success(`Booking ${status}!`);
    } catch (err) {
      toast.error('Status update failed.');
    }
  };

  const handleComplete = async (id) => {
    try {
      const data = await completeBooking(id);
      if (data?.booking) setBookings(prev => prev.map(b => b.id === id ? data.booking : b));
      toast.success('Booking marked as completed!');
    } catch (err) {
      toast.error('Failed to complete booking.');
    }
  };

  return { bookings, loading, error, handleStatus, handleComplete, refetch: fetch };
};

/**
 * Hook for admin — all bookings
 */
export const useAdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading ] = useState(true);
  const [total,    setTotal   ] = useState(0);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllBookings();
      setBookings(data.bookings);
      setTotal(data.total);
    } catch { /* handled globally */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { bookings, loading, total, refetch: fetch };
};
