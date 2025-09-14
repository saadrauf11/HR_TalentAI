import { Router } from 'express';
import { Job } from '../models'; // Sequelize model

const router = Router();

router.get('/', async (req, res) => {
  const jobs = await Job.findAll();
  res.json(jobs);
});

router.post('/', async (req, res) => {
  try {
    const { tenantId, title, description, createdById } = req.body;
    console.log('Add Job Request Body:', req.body); // Log request body
    const companyId = 1; // Fixed company ID for the system
    const job = await Job.create({ tenantId, title, description, createdById, companyId });
    res.status(201).json(job);
  } catch (error: any) {
    console.error('Error adding job:', error.message); // Log error details
    res.status(400).json({ error: 'Failed to add job', details: error.message });
  }
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

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);
    if (!job) {
      console.log(`Job with ID ${id} not found`); // Log missing job
      return res.status(404).json({ error: `Job with ID ${id} not found` });
    }
    await job.destroy();
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: 'Failed to delete job', details: error.message });
  }
});

export default router;
