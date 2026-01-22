require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const User = require('../models/User');
const connectDB = require('../config/db');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdmin = async () => {
  try {
    await connectDB();
    
    // Get inputs from command line arguments or prompt
    const args = process.argv.slice(2);
    let name, email, password;
    
    if (args.length === 3) {
      [name, email, password] = args;
    } else {
      console.log('🔐 Create Admin User\n');
      name = await question('Admin Name: ');
      email = await question('Admin Email: ');
      password = await question('Admin Password (min 8 chars, must include: A-Z, a-z, 0-9, @$!%*?&#): ');
    }
    
    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      console.error('❌ Password does not meet requirements!');
      process.exit(1);
    }
    
    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      console.error('❌ User with this email already exists!');
      process.exit(1);
    }
    
    // Create admin
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });
    
    console.log('\n✅ Admin created successfully!');
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

createAdmin();