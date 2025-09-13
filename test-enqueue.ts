import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis('redis://localhost:6379', { maxRetriesPerRequest: null });
const cvQueue = new Queue('cv-processing', { connection });

async function main() {
  await cvQueue.add('parse-cv', { filename: 'test_cv.pdf' });
  console.log('Test job enqueued!');
  await cvQueue.close();
  await connection.quit();
}

main();
