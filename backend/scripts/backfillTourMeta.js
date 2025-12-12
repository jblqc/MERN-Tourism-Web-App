// scripts/backfillTourMeta.js
// run with: node scripts/backfillTourMeta.js
const mongoose = require('mongoose');
const Tour = require('../models/tourModel');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

(async function() {
  try {
    await mongoose.connect(DB);
    console.log('DB connected');

    const tours = await Tour.find();

    for (const t of tours) {
      const updates = {};
      // simple heuristics to assign category based on name/summary
      const name = (t.name || '').toLowerCase();
      const summary = (t.summary || '').toLowerCase();
      if (['island', 'beach', 'island', 'sea', 'coast'].some(w => name.includes(w) || summary.includes(w))) {
        updates.category = 'beach';
      } else if (['hike', 'climb', 'mountain', 'trek', 'adventure'].some(w => name.includes(w) || summary.includes(w))) {
        updates.category = 'adventure';
      } else if (['city', 'museum', 'gallery', 'walking'].some(w => name.includes(w) || summary.includes(w))) {
        updates.category = 'city';
      } else {
        updates.category = 'custom';
      }

      // simple tags: add country as tag
      updates.tags = Array.from(new Set([ ...(t.tags || []), t.country ].filter(Boolean)));

      await Tour.findByIdAndUpdate(t._id, updates, { new: true });
      console.log(`Updated ${t.name}`);
    }

    console.log('Backfill done');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
