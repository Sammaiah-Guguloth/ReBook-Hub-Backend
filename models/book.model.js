const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  trueImages: [String],
  price: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

const bookModel = mongoose.model("book", bookSchema);

module.exports = bookModel;
