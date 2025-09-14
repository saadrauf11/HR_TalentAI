import { Router } from 'express';
import { sequelize } from '../models';
import { DataTypes } from 'sequelize';

const Candidate = sequelize.define('Candidate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenantId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

const router = Router();

router.get('/', async (req, res) => {
  const candidates = await Candidate.findAll();
  res.json(candidates);
});

router.post('/', async (req, res) => {
  const { tenantId, name, email, phone } = req.body;
  const candidate = await Candidate.create({
    tenantId, name, email, phone
  });
  res.status(201).json(candidate);
});

export default router;
