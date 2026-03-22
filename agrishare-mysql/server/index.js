import 'dotenv/config'; // FIXED: This must be at the very top to load JWT_SECRET
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import equipmentRoutes from './routes/equipment.js';
import bookingRoutes from './routes/bookings.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));