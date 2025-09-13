import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const candidates = await prisma.candidate.findMany();
  res.json(candidates);
});

router.post('/', async (req, res) => {
  const { tenantId, name, email, phone } = req.body;
  const candidate = await prisma.candidate.create({
    data: { tenantId, name, email, phone }
  });
  res.status(201).json(candidate);
});

export default router;
