import express from 'express';
import pool from '../config/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create booking (Farmer)
router.post('/', protect(['farmer']), async (req, res) => {
  const { equipmentId, startDate, endDate, notes } = req.body;
  try {
    if (!equipmentId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [eq] = await pool.query('SELECT id, pricePerDay FROM equipment WHERE id = ?', [equipmentId]);
    if (!eq?.length) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    // Calculate total amount based on days
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const totalAmount = diffDays * eq[0].pricePerDay;

    const [result] = await pool.query(
      'INSERT INTO bookings (equipment_id, farmer_id, startDate, endDate, totalAmount, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [equipmentId, req.user.id, startDate, endDate, totalAmount, notes]
    );

    const [created] = await pool.query(
      `SELECT b.*, e.name as equipmentName, e.category as equipmentCategory
       FROM bookings b
       JOIN equipment e ON b.equipment_id = e.id
       WHERE b.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Booking requested successfully',
      booking: created?.[0],
    });
  } catch (error) {
    res.status(400).json({ message: 'Booking failed' });
  }
});

// Get Farmer's own bookings
router.get('/my', protect(['farmer']), async (req, res) => {
  try {
    const [bookings] = await pool.query(`
      SELECT b.*, e.name as equipmentName, e.category as equipmentCategory 
      FROM bookings b
      JOIN equipment e ON b.equipment_id = e.id
      WHERE b.farmer_id = ?`, [req.user.id]);
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Get Owner's incoming requests
router.get('/owner', protect(['owner']), async (req, res) => {
  try {
    const [bookings] = await pool.query(`
      SELECT b.*, e.name as equipmentName, u.name as farmerName, u.phone as farmerPhone 
      FROM bookings b
      JOIN equipment e ON b.equipment_id = e.id
      JOIN users u ON b.farmer_id = u.id
      WHERE e.owner_id = ?`, [req.user.id]);
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

// Update booking status (Owner)
router.patch('/:id/status', protect(['owner']), async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: `Booking ${status}` });
  } catch (error) {
    res.status(400).json({ message: 'Status update failed' });
  }
});

export default router;