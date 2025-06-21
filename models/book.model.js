const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
    enum: [
      "Fiction",
      "Romance",
      "Thriller",
      "Science Fiction",
      "Fantasy",
      "Mystery",
      "Horror",
      "Non-fiction",
      "Biography",
      "Self-help",
      "Historical",
      "Adventure",
      "Comics",
      "Poetry",
      "Drama",
      "Philosophy",
      "Technology",
      "Art",
      "Business",
      "Education",
      "Spirituality",
      "Health & Fitness",
      "Politics",
      "Travel",
      "Cookbooks",
      "Children",
      "Religious",
      "Sports",
      "Other",
    ],
  },
  language: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverImage: {
    imageUrl: { type: String, required: true },
    fileId: { type: String, required: true },
  },
  trueImages: [
    {
      imageUrl: { type: String, required: true },
      fileId: { type: String, required: true },
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
  },
  publication: {
    date: {
      type: Date,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const bookModel = mongoose.model("book", bookSchema);

module.exports = bookModel;
