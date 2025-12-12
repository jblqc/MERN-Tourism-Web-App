// scripts/seedPackages.js
require('dotenv').config({ path: './config.env' });

const mongoose = require('mongoose');

// IMPORTANT: Load all schemas used in population BEFORE any queries
require('../models/userModel');
const Tour = require('../models/tourModel');
const Package = require('../models/packageModel');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

(async function() {
  try {
    await mongoose.connect(DB);
    console.log('DB connected');

    // Remove all existing packages (optional)
    // await Package.deleteMany();

    const tours = await Tour.find();

    // 1) Create one package per country with top 2-3 tours
    const byCountry = tours.reduce((acc, t) => {
      const c = t.country || 'Others';
      acc[c] = acc[c] || [];
      acc[c].push(t);
      return acc;
    }, {});

    const packagesToCreate = [];

    for (const country of Object.keys(byCountry)) {
      const list = byCountry[country].sort((a,b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0));
      const included = list.slice(0,3);
      if (included.length === 0) continue;

      packagesToCreate.push({
        title: `${country} Essentials`,
        subtitle: `Top ${country} experiences`,
        description: `Curated selection of the best ${country} tours.`,
        country,
        imageCover: included[0].imageCover || '/img/tours/default.jpg',
        includedTours: included.map(t => t._id),
        totalPrice: included.reduce((s,t) => s + (t.price || 0),0),
        totalDays: included.reduce((s,t) => s + (t.duration || 0),0),
        ratingAverage: Number((included.reduce((s,t) => s + (t.ratingsAverage || 4.5), 0)/included.length).toFixed(2)),
        ratingQuantity: included.reduce((s,t) => s + (t.ratingsQuantity || 0),0),
        theme: 'custom',
        tags: [country],
        isFeatured: false
      });
    }

    // 2) Add a few mixed curated packages (example: top-rated + mix)
    const topTours = tours.slice().sort((a,b) => (b.ratingsAverage||0) - (a.ratingsAverage||0)).slice(0,6);
    packagesToCreate.push({
      title: 'Top Rated Escape',
      subtitle: 'Best of our top-rated tours',
      description: 'A handpicked selection of highest-rated tours across destinations.',
      country: 'Mixed',
      imageCover: topTours[0]?.imageCover || '/img/tours/default.jpg',
      includedTours: topTours.map(t => t._id),
      totalPrice: topTours.reduce((s,t)=>s+(t.price||0),0),
      totalDays: topTours.reduce((s,t)=>s+(t.duration||0),0),
      ratingAverage: Number((topTours.reduce((s,t)=>s+(t.ratingsAverage||4.5),0)/topTours.length).toFixed(2)),
      ratingQuantity: topTours.reduce((s,t)=>s+(t.ratingsQuantity||0),0),
      theme: 'custom',
      tags: ['top-rated', 'editor-pick'],
      isFeatured: true
    });

    // persist
    const created = await Package.insertMany(packagesToCreate);
    console.log(`Created ${created.length} packages`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
