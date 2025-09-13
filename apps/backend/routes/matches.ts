import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const matches = await prisma.match.findMany();
  res.json(matches);
});

export default router;
