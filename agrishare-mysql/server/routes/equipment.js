import express from 'express';
import pool from '../config/db.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all equipment (Farmer view)
router.get('/', async (req, res) => {
  try {
    const [equipment] = await pool.query(`
      SELECT e.*, u.name as ownerName, u.email as ownerEmail 
      FROM equipment e 
      JOIN users u ON e.owner_id = u.id
    `);
    res.json({ equipment, total: equipment.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching equipment' });
  }
});

// Get owner's own equipment
router.get('/my', protect(['owner']), async (req, res) => {
  try {
    // req.user.id is populated by the protect middleware
    const [equipment] = await pool.query('SELECT * FROM equipment WHERE owner_id = ?', [req.user.id]);
    res.json({ equipment });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your equipment' });
  }
});

// Create new equipment
router.post('/', protect(['owner']), async (req, res) => {
  const { name, category, pricePerDay, location, description, specs } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO equipment (owner_id, name, category, pricePerDay, location, description, specs) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, name, category, pricePerDay, location, description, specs]
    );
    const [newEq] = await pool.query('SELECT * FROM equipment WHERE id = ?', [result.insertId]);
    res.status(201).json({ equipment: newEq[0] });
  } catch (error) {
    console.error('Create equipment error:', error);
    res.status(400).json({ message: 'Error creating equipment. Ensure all fields are valid.' });
  }
});

// Update equipment details
router.put('/:id', protect(['owner']), async (req, res) => {
  const { name, category, pricePerDay, location, description, specs } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE equipment SET name = ?, category = ?, pricePerDay = ?, location = ?, description = ?, specs = ? WHERE id = ? AND owner_id = ?',
      [name, category, pricePerDay, location, description, specs, req.params.id, req.user.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Equipment not found or unauthorized' });
    }
    
    res.json({ message: 'Equipment updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
});

// Delete equipment
router.delete('/:id', protect(['owner']), async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM equipment WHERE id = ? AND owner_id = ?', [req.params.id, req.user.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Equipment not found or unauthorized' });
    }
    
    res.json({ message: 'Equipment deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Delete failed' });
  }
});

// Toggle availability
router.patch('/:id/toggle', protect(['owner']), async (req, res) => {
  try {
    await pool.query('UPDATE equipment SET available = NOT available WHERE id = ? AND owner_id = ?', [req.params.id, req.user.id]);
    const [updated] = await pool.query('SELECT * FROM equipment WHERE id = ?', [req.params.id]);
    res.json({ equipment: updated[0] });
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
});

export default router;