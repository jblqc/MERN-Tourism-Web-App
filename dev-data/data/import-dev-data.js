// dev-data/data/import-dev-data.js

const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');

// Load environment variables
dotenv.config({ path: `${__dirname}/../../config.env` });

// Safety check
if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
  console.error('❌ DATABASE or DATABASE_PASSWORD missing in config.env');
  process.exit(1);
}

// Replace password placeholder
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  encodeURIComponent(process.env.DATABASE_PASSWORD)
);

// Connect to MongoDB
mongoose
  .connect(DB)
  .then(() => console.log('✅ DB connection successful!'))
  .catch((err) => {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  });

// Read JSON files
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
// const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// Import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    // await User.create(users, { validateBeforeSave: false });
    // await Review.create(reviews);
    console.log('✅ Data successfully loaded!');
  } catch (err) {
    console.error('❌ Error loading data:', err.message);
  } finally {
    process.exit();
  }
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('🗑️ Data successfully deleted!');
  } catch (err) {
    console.error('❌ Error deleting data:', err.message);
  } finally {
    process.exit();
  }
};

// CLI control
const command = process.argv[2];
if (command === '--import') importData();
else if (command === '--delete') deleteData();
else {
  console.log('⚙️ Use --import or --delete');
  process.exit();
}
