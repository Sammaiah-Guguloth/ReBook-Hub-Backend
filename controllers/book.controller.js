const bookModel = require("../models/book.model");
const userModel = require("../models/user.model");
const uploadToImageKit = require("../utils/uploadToImageKit");
const deleteImageFromImageKit = require("../utils/deleteImageFromImageKit");

// adding a book
const addBook = async (req, res) => {
  try {
    const { title, genre, language, description, price, author, rating } =
      req.body;

    console.log("req.body : ", req.body);
    const publication = {
      date: req.body["publication.date"],
      publisher: req.body["publication.publisher"],
    };

    const coverImageFile = req.files.coverImage;
    let trueImagesFiles = req.files.trueImages || [];
    if (!Array.isArray(trueImagesFiles)) {
      trueImagesFiles = [trueImagesFiles];
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!coverImageFile || !trueImagesFiles) {
      return res
        .status(400)
        .json({ message: "Cover image and true(real) images are required" });
    }
    if (!allowedTypes.includes(coverImageFile.mimetype)) {
      return res
        .status(400)
        .json({ message: "Cover image must be of type jpeg, jpg or png" });
    }
    if (trueImagesFiles.length > 5) {
      return res
        .status(400)
        .json({ message: "Maximum 5 true images are allowed" });
    }
    for (trueImage of trueImagesFiles) {
      if (!allowedTypes.includes(trueImage.mimetype)) {
        return res
          .status(400)
          .json({ message: "True images must be of type jpeg, jpg or png" });
      }
    }

    console.log("title2 : ", title);
    let coverImageUploadInfo = await uploadToImageKit(
      coverImageFile,
      title,
      "ReBookHub/CoverImages"
    );
    const trueImagesUrls = [];
    for (trueImage of trueImagesFiles) {
      const trueImageUploadInfo = await uploadToImageKit(
        trueImage,
        trueImage.original,
        "ReBookHub/TrueImages"
      );
      trueImagesUrls.push({
        imageUrl: trueImageUploadInfo.imageUrl,
        fileId: trueImageUploadInfo.fileId,
      });
    }

    const newBook = await bookModel.create({
      title,
      genre,
      language,
      description,
      coverImage: {
        imageUrl: coverImageUploadInfo.imageUrl,
        fileId: coverImageUploadInfo.fileId,
      },
      trueImages: trueImagesUrls,
      price,
      author,
      rating,
      publication,
      owner: req.user._id,
    });

    const user = await userModel.findById(req.user._id);
    user.myBooks.push(newBook._id);
    await user.save();

    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    console.log("Error while adding the book : ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// getting the book details by id
const getBookById = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const book = await bookModel.findById(bookId).populate("owner");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json({ message: "Book found", book });
  } catch (error) {
    console.log("Error while getting the book by id : ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//getting all books
const getAllBooks = async (req, res) => {
  try {
    const books = await bookModel.find();
    if (!books) {
      return res.status(404).json({ message: "No books found" });
    }
    return res.status(200).json({ message: "Books found", books });
  } catch (error) {
    console.log("Error while getting all books : ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//deleting a book
const deleteBookById = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const userId = req.user._id;
    const book = await bookModel.findOne({ _id: bookId, owner: userId });

    if (!book) {
      return res
        .status(404)
        .json({ message: "Book not found or unauthorized" });
    }

    await bookModel.findByIdAndDelete(bookId);
    await userModel.findByIdAndUpdate(userId, { $pull: { myBooks: bookId } });
    await deleteImageFromImageKit(book.coverImage.fileId);
    for (trueImage of book.trueImages) {
      await deleteImageFromImageKit(trueImage.fileId);
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.log("Error while deleting the book by id : ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// getting the books by genre
const getBooksByGenre = async (req, res) => {
  try {
    const genre = req.params.genre;
    const books = await bookModel
      .find({ genre })
      .populate("owner", "-password");
    if (!books || books.length == 0) {
      return res.status(404).json({
        message: "No books found for the genre",
      });
    }
    return res.status(200).json({
      message: "Books found for the genre",
      books,
    });
  } catch (error) {
    console.log("Error while getting books by genre : ", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// getting books by Author
const getBooksByAuthor = async (req, res) => {
  try {
    const author = req.params.author;
    const books = await bookModel.find({ author }).populate({
      path: "owner",
      select: "-password -coverImage.fileId",
    });

    if (!books || books.length == 0) {
      return res.status(404).json({
        message: "No books found for the author",
      });
    }
    return res.status(200).json({
      message: "Books found for the author",
      books,
    });
  } catch (error) {
    console.log("Error while getting books by author : ", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//get books by title
const getBooksByTitle = async (req, res) => {
  try {
    const title = req.params.title;
    const books = await bookModel.find({ title }).populate({
      path: "owner",
      select: "-password -coverImage.fileId",
    });
    if (!books || books.length == 0) {
      return res.status(404).json({
        message: "No books found for the title",
      });
    }
    return res.status(200).json({
      message: "Books found for the title",
      books,
    });
  } catch (error) {
    console.log("Error while getting books by title : ", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  addBook,
  getBookById,
  getAllBooks,
  deleteBookById,
  getBooksByGenre,
  getBooksByAuthor,
  getBooksByTitle,
};
