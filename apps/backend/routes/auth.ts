import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models'; // Sequelize model

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request received:', { email }); // Log the incoming request

  const user = await User.findOne({ where: { email } });
  console.log('User found:', user); // Log the user fetched from the database

  if (!user) {
    console.log('Invalid credentials: User not found');
    return res.status(401).json({ error: 'Invalid email' });
  }

  const valid = await bcrypt.compare(password, user.password);
  console.log('Password match:', valid); // Log the result of password comparison

  if (!valid) {
    console.log('Invalid credentials: Password mismatch');
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id, tenantId: user.tenantId, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  console.log('Token generated:', token); // Log the generated token

  res.json({ token });
});

export default router;
