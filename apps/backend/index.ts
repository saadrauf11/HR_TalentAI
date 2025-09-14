import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import candidateRoutes from './routes/candidates';
import matchRoutes from './routes/matches';
import { sequelize } from './models'; // Sequelize instance
import bcrypt from 'bcryptjs';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/matches', matchRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/db-test', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({ status: 'Database connection failed', error: (error as any).message });
  }
});

app.post('/api/create-user', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user, created] = await sequelize.models.User.findOrCreate({
      where: { email },
      defaults: { password: hashedPassword, tenantId: 'default-tenant', role: 'USER' },
    });

    if (created) {
      res.status(201).json({ message: 'User created successfully', user });
    } else {
      res.status(409).json({ message: 'User already exists' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: (error as any).message });
  }
});

const PORT = process.env.PORT || 4000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend API running on port ${PORT}`);
  });
});

// Add TypeScript declaration for models
/** @typedef {import('./models').sequelize} SequelizeInstance */
/** @typedef {import('./models').Sequelize} SequelizeType */
