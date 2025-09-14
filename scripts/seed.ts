import bcrypt from 'bcryptjs';
import { sequelize } from '../apps/backend/models';

async function main() {
  // Create demo tenant
  const [tenant] = await sequelize.models.Tenant.findOrCreate({
    where: { name: 'DemoCorp' },
    defaults: { name: 'DemoCorp' },
  });

  const tenantId = tenant.getDataValue('id');

  // Create admin user
  const passwordHash = await bcrypt.hash('admin1234', 10);
  const [user] = await sequelize.models.User.findOrCreate({
    where: { email: 'admin@democorp.local' },
    defaults: {
      tenantId,
      email: 'admin@democorp.local',
      password: passwordHash,
      role: 'ADMIN',
      name: 'Demo Admin',
    },
  });

  const userId = user.getDataValue('id');

  // Create user azky@saad.com
  const azkyPasswordHash = await bcrypt.hash('azky1234', 10);
  await sequelize.models.User.findOrCreate({
    where: { email: 'azky@saad.com' },
    defaults: {
      tenantId,
      email: 'azky@saad.com',
      password: azkyPasswordHash,
      role: 'RECRUITER',
      name: 'Azky Saad',
    },
  });

  // Create user sara@azky.com
  const saraPasswordHash = await bcrypt.hash('azky1234', 10);
  await sequelize.models.User.findOrCreate({
    where: { email: 'sara@azky.com' },
    defaults: {
      tenantId,
      email: 'sara@azky.com',
      password: saraPasswordHash,
      role: 'USER',
      name: 'Sara Azky',
    },
  });

  // Create sample job
  const [job] = await sequelize.models.Job.findOrCreate({
    where: { title: 'Software Engineer' },
    defaults: {
      tenantId,
      title: 'Software Engineer',
      description: 'Develop and maintain web applications.',
      createdById: userId,
      companyId: tenantId, // Added companyId to satisfy the NOT NULL constraint
    },
  });

  // Create sample candidate
  const [candidate] = await sequelize.models.Candidate.findOrCreate({
    where: { email: 'jane.doe@example.com' },
    defaults: {
      tenantId,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '+1234567890',
    },
  });

  console.log('Demo data seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await sequelize.close();
  });
