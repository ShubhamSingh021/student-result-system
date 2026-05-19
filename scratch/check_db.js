const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../backend/.env')});

const Student = require('../backend/models/Student');
const Result = require('../backend/models/Result');

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const studentCount = await Student.countDocuments();
    const resultCount = await Result.countDocuments();
    console.log(`Total Students: ${studentCount}`);
    console.log(`Total Results: ${resultCount}`);

    const sections = await Student.aggregate([
      { $group: { _id: '$section', count: { $sum: 1 } } }
    ]);
    console.log('Students per Section:', sections);

    const sessions = await Result.distinct('examSession');
    console.log('Exam Sessions in DB:', sessions);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
