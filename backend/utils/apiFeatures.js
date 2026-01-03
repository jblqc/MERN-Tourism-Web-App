class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryObj = { ...this.queryString };

    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "search",
      "startDateFrom",
      "startDateTo"
    ];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    /* -----------------------------------------------
     * TEXT SEARCH (name, summary, description, country)
     * ----------------------------------------------- */
    if (this.queryString.search) {
      const regex = new RegExp(this.queryString.search, "i");

      this.query = this.query.find({
        $or: [
          { name: regex },
          { summary: regex },
          { description: regex },
          { country: regex }
        ]
      });
    }

    /* -----------------------------------------------
     * COUNTRY FILTER
     * ----------------------------------------------- */
    if (this.queryString.country) {
      this.query = this.query.find({
        country: { $regex: this.queryString.country, $options: "i" }
      });
    }

    /* -----------------------------------------------
     * DIFFICULTY MULTIPLE
     * difficulty=easy,medium
     * ----------------------------------------------- */
    if (this.queryString.difficulty) {
      const difficulties = this.queryString.difficulty.split(",");
      this.query = this.query.find({ difficulty: { $in: difficulties } });
    }

    /* -----------------------------------------------
     * START DATE RANGE (startDates array)
     * ----------------------------------------------- */
    const from = this.queryString.startDateFrom;
    const to = this.queryString.startDateTo;

    if (from || to) {
      const dateFilter = {};
      if (from) dateFilter.$gte = new Date(from);
      if (to) dateFilter.$lte = new Date(to);

      this.query = this.query.find({ startDates: dateFilter });
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(
        this.queryString.sort.split(",").join(" ")
      );
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      this.query = this.query.select(
        this.queryString.fields.split(",").join(" ")
      );
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;


// 🔎 Search

// ✓ name
// ✓ summary
// ✓ description
// ✓ country

// 💰 Price range

// ✓ price[gte]
// ✓ price[lte]

// 🌍 Country

// ✓ country (regex)

// ⭐ Ratings

// ✓ ratingsAverage[gte]

// 🧭 Difficulty (multi)

// ✓ difficulty=easy,medium

// 📅 Date Range

// ✓ startDateFrom
// ✓ startDateTo

// 📊 Sorting

// ✓ sort=price
// ✓ sort=-ratingsAverage

// 📄 Pagination

// ✓ page
// ✓ limit