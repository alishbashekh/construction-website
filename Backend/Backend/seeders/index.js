import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log('Database connected for seeding...');

    const existingAdmin = await User.findOne({ role: 'system_admin', deletedAt: null });

    if (existingAdmin) {
      console.log('System Administrator already exists:');
      console.log(`  Email: ${existingAdmin.email}`);
      console.log(`  Name: ${existingAdmin.fullName}`);
      console.log(`  User ID: ${existingAdmin.userId}`);
      console.log('\nSkipping seed. If you need to reset, delete the existing admin first.');
    } else {
      const adminData = {
        email: 'alishbashabbir890@gmail.com',
        password: 'Alishba##12',
        fullName: 'Alishba shabbir',
        phoneNumber: '+92456873654',
        role: 'system_admin',
        status: true,
      };

      const admin = await User.create(adminData);

      console.log('\n========================================');
      console.log('  Default System Administrator Created');
      console.log('========================================');
      console.log(`  User ID  : ${admin.userId}`);
      console.log(`  Email    : ${adminData.email}`);
      console.log(`  Password : ${adminData.password}`);
      console.log(`  Name     : ${admin.fullName}`);
      console.log(`  Role     : ${admin.role}`);
      console.log('========================================');
      console.log('  IMPORTANT: Change this password after first login!');
      console.log('========================================\n');
    }

    await mongoose.disconnect();
    console.log('Database disconnected. Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedAdmin();
