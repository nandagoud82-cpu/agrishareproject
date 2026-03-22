import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { protect } from '../middleware/auth.js'; // Ensure this middleware is imported

const router = express.Router();

// --- Existing Auth Routes ---

router.post('/register', async (req, res) => {
  const { name, email, password, role, phone, location } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, phone, location) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, phone, location]
    );
    const token = jwt.sign({ id: result.insertId, role }, process.env.JWT_SECRET);
    res.status(201).json({ token, user: { id: result.insertId, name, email, role, phone, location } });
  } catch (error) {
    res.status(400).json({ message: 'Email already exists' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0 || !(await bcrypt.compare(password, users[0].password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: users[0].id, role: users[0].role }, process.env.JWT_SECRET);
    
    // Remove password from the user object before sending
    const { password: _, ...userWithoutPassword } = users[0];
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// --- New Profile Management Routes ---

// Get current user profile (used by AppContext for verification)
router.get('/profile', protect(), async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, phone, location FROM users WHERE id = ?', 
      [req.user.id]
    );
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ user: users[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update personal information
router.put('/profile', protect(), async (req, res) => {
  const { name, phone, location } = req.body;
  try {
    await pool.query(
      'UPDATE users SET name = ?, phone = ?, location = ? WHERE id = ?',
      [name, phone, location, req.user.id]
    );
    // Fetch and return the updated user data
    const [updated] = await pool.query(
      'SELECT id, name, email, role, phone, location FROM users WHERE id = ?', 
      [req.user.id]
    );
    res.json({ user: updated[0] });
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
});

// Change password
router.put('/change-password', protect(), async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    
    // Verify the current password first
    const isMatch = await bcrypt.compare(currentPassword, users[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password incorrect' });
    }

    // Hash and update the new password
    const hashedPw = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPw, req.user.id]);
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Password update failed' });
  }
});

export default router;