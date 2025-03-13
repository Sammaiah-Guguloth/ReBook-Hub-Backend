const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const bookController = require("../controllers/book.controller");
const authMiddleware = require("../middlewares/auth.middleware");

//adding a book
router.post(
  "/add",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("genre").notEmpty().withMessage("Genre is required"),
    body("language").notEmpty().withMessage("Language is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").notEmpty().withMessage("Price is required"),
    body("author").notEmpty().withMessage("Author is required"),
    body("publication.date")
      .notEmpty()
      .withMessage("Publication date is required"),
    body("publication.publisher")
      .notEmpty()
      .withMessage("Publisher is required"),
  ],
  authMiddleware.authUser,
  bookController.addBook
);

// getting the book details
router.get("/book-by-id/:bookId", bookController.getBookById);

// getting all the books
router.get("/all-books", bookController.getAllBooks);

//deleting a book
router.delete(
  "/delete/:bookId",
  authMiddleware.authUser,
  bookController.deleteBookById
);

// updating the book details

// getting the books by genre

// getting the books by author

// getting the books by price range

// getting the books by title

// getting the books by rating

// getting the books by publication date

// getting the books by language

// getting the books by owner

module.exports = router;
