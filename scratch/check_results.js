
const mongoose = require('mongoose');
const Result = require('./backend/models/Result');

async function checkData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/student-result');
    const results = await Result.find({ name: /SAHIL SINGH RAWAT/i }).sort({ fetchedAt: 1 }).lean();
    console.log('Results found:', results.length);
    results.forEach(r => {
      console.log(`Sem: ${r.semester}, Type: ${r.examCategory}, Subs: ${r.subjects?.length}`);
      if (r.subjects) {
        r.subjects.forEach(s => {
          if (!s.grade) console.log(`  [MISSING GRADE] ${s.title}`);
          if (!s.code) console.log(`  [MISSING CODE] ${s.title}`);
        });
      }
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
