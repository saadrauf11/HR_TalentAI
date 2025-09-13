import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
});

// Example queue for CV processing
const cvQueue = new Queue('cv-processing', { connection });

// Example worker
const worker = new Worker('cv-processing', async job => {
  // Simulate processing
  console.log('Processing CV:', job.data);
  // ...actual parsing, embedding, etc. would go here...
  return { status: 'done' };
}, { connection });

worker.on('completed', job => {
  console.log(`Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

console.log('Worker is running.');
