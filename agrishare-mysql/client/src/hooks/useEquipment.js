import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  getAllEquipment, getMyEquipment, createEquipment,
  updateEquipment, deleteEquipment, toggleAvailability,
} from '../services/equipmentService';

/**
 * Hook for browsing all equipment (farmer view)
 */
export const useEquipmentList = (filters = {}) => {
  const [equipment, setEquipment] = useState([]);
  const [loading,   setLoading  ] = useState(true);
  const [error,     setError    ] = useState(null);
  const [total,     setTotal    ] = useState(0);

  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllEquipment(filters);
      setEquipment(data.equipment);
      setTotal(data.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load equipment.');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchEquipment(); }, [fetchEquipment]);

  return { equipment, loading, error, total, refetch: fetchEquipment };
};

/**
 * Hook for owner's own equipment management
 */
export const useMyEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading,   setLoading  ] = useState(true);
  const [error,     setError    ] = useState(null);

  const fetchMyEquipment = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyEquipment();
      setEquipment(data.equipment);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your equipment.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMyEquipment(); }, [fetchMyEquipment]);

  const handleCreate = async (payload) => {
    try {
      const data = await createEquipment(payload);
      setEquipment(prev => [data.equipment, ...prev]);
      toast.success('Equipment listed successfully!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing.');
      return false;
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const data = await updateEquipment(id, updates);
      setEquipment(prev => prev.map(e => e._id === id ? data.equipment : e));
      toast.success('Equipment updated!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEquipment(id);
      setEquipment(prev => prev.filter(e => e._id !== id));
      toast.success('Equipment removed.');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
      return false;
    }
  };

  const handleToggle = async (id) => {
    try {
      const data = await toggleAvailability(id);
      setEquipment(prev => prev.map(e => e._id === id ? data.equipment : e));
      toast.success('Availability updated!');
    } catch (err) {
      toast.error('Failed to update availability.');
    }
  };

  return {
    equipment, loading, error,
    handleCreate, handleUpdate, handleDelete, handleToggle,
    refetch: fetchMyEquipment,
  };
};
