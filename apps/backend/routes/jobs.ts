import { Router } from 'express';
import { Job } from '../models'; // Sequelize model

const router = Router();

router.get('/', async (req, res) => {
  const jobs = await Job.findAll();
  res.json(jobs);
});

router.post('/', async (req, res) => {
  const { tenantId, title, description, createdById } = req.body;
  const job = await Job.create({ tenantId, title, description, createdById });
  res.status(201).json(job);
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, companyId } = req.body;
    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    await job.update({ title, description, companyId });
    res.json(job);
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to update job', details: error.message });
  }
});

export default router;
