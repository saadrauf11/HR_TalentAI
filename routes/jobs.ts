import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
	const jobs = await prisma.job.findMany();
	res.json(jobs);
});

router.post('/', async (req, res) => {
	const { tenantId, title, description, createdById } = req.body;
	const job = await prisma.job.create({
		data: { tenantId, title, description, createdById }
	});
	res.status(201).json(job);
});

export default router;
