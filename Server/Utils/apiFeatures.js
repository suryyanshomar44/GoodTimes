class APIFeatures {
  constructor(query, queryString) {
    // mongoose query
    this.query = query;
    // req.query string
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(queryObj, excludedFields);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // query = query.select('-__v');
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

  keyword() {
    const keyword = this.queryString.keyword
      ? {
          $or: [
            { title: { $regex: this.queryString.keyword, $options: 'i' } },
            {
              description: { $regex: this.queryString.keyword, $options: 'i' },
            },
          ],
        }
      : {};

    this.query = this.query.find(keyword);
    return this;
  }
}

module.exports = APIFeatures;
