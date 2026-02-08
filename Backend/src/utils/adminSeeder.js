const mongoose = require('mongoose');
const User = require('../models/Admin.model.js'); // Adjust path to your User model
const bcrypt = require('bcrypt');

const seedAdmin = async () => {
  try {
    // 1. Check if an admin already exists
    // Adjust 'isAdmin: true' based on your schema (e.g. might be role: 'admin')
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (existingAdmin) {
      console.log('--- Admin already exists. Skipping seed. ---');
      return;
    }

    // 2. If no admin, and we have the Env Variables, create one
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      
      console.log('--- No Admin found. Creating Default Admin... ---');

      // Hash password (if your User model doesn't do it automatically in pre-save)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

      await User.create({
        username: process.env.ADMIN_EMAIL,
        password: hashedPassword,
      });

      console.log(`--- ADMIN CREATED: ${process.env.ADMIN_EMAIL} ---`);
    } else {
      console.log('--- No ADMIN_EMAIL/PASSWORD in .env. Skipping seed. ---');
    }

  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

module.exports = seedAdmin;