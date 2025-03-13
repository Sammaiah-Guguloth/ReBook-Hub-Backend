const bookModel = require("../models/book.model");
const userModel = require("../models/user.model");
const uploadToImageKit = require("../utils/uploadToImageKit");

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

    console.log("title1 : ", title);
    console.log("req.files : ", req.files);

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
    const coverImageUrl = await uploadToImageKit(
      coverImageFile,
      title,
      "ReBookHub/CoverImages"
    );
    const trueImagesUrls = [];
    for (trueImage of trueImagesFiles) {
      const trueImageUrl = await uploadToImageKit(
        trueImage,
        trueImage.original,
        "ReBookHub/TrueImages"
      );
      trueImagesUrls.push(trueImageUrl);
    }

    const newBook = await bookModel.create({
      title,
      genre,
      language,
      description,
      coverImage: coverImageUrl,
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

module.exports = {
  addBook,
};
