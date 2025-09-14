import { Router } from 'express';
import { Match } from '../models'; // Sequelize model

const router = Router();

router.get('/', async (req, res) => {
  const matches = await Match.findAll();
  res.json(matches);
});

export default router;
