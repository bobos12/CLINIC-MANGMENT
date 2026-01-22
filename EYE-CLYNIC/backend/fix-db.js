const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    // Drop patients collection
    await mongoose.connection.collection('patients').drop();
    console.log('✅ Patients collection dropped');
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Connection closed');
    process.exit(0);
  } catch (error) {
    console.log('⚠️ Error:', error.message);
    process.exit(0);
  }
}).catch(err => {
  console.error('Connection error:', err.message);
  process.exit(1);
});
