import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import candidateRoutes from './routes/candidates';
import matchRoutes from './routes/matches';
import { sequelize } from './apps/backend/models'; // Sequelize instance

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/matches', matchRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;

sequelize.sync().then(() => {
	app.listen(PORT, () => {
		console.log(`Backend API running on port ${PORT}`);
	});
});
