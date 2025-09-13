import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { name: 'DemoCorp' },
    update: {},
    create: { name: 'DemoCorp' }
  });


  // Create admin user
  const passwordHash = await bcrypt.hash('admin1234', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@democorp.local' },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@democorp.local',
      password: passwordHash,
      role: 'ADMIN',
      name: 'Demo Admin'
    }
  });

  // Create user azky@saad.com
  const azkyPasswordHash = await bcrypt.hash('azky1234', 10);
  await prisma.user.upsert({
    where: { email: 'azky@saad.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'azky@saad.com',
      password: azkyPasswordHash,
      role: 'RECRUITER',
      name: 'Azky Saad'
    }
  });

  // Create sample job
  const job = await prisma.job.create({
    data: {
      tenantId: tenant.id,
      title: 'Software Engineer',
      description: 'Develop and maintain web applications.',
      createdById: user.id
    }
  });

  // Create sample candidate
  const candidate = await prisma.candidate.create({
    data: {
      tenantId: tenant.id,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '+1234567890'
    }
  });

  // Create sample CV file
  await prisma.cvFile.create({
    data: {
      candidateId: candidate.id,
      s3_key: 'demo/jane_doe_cv.pdf',
      file_name: 'Jane_Doe_CV.pdf',
      content_type: 'application/pdf',
      size: 123456,
  status: 'PARSED'
    }
  });

  // Create sample candidate text
  await prisma.candidateText.create({
    data: {
      candidateId: candidate.id,
      text: 'Jane Doe is a software engineer with 5 years of experience in full-stack development.'
    }
  });

  console.log('Demo data seeded successfully.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
