const path = require("path");
const express = require("express");
const rootDir = require("../util/path");

const booksController = require("../controllers/books");
const router = express.Router();

router.get("/", booksController.getDisplayBooks);
router.get("/add-books", booksController.getAddBook);
router.post("/add-books", booksController.postAddBook);

router.get("/edit-book/:bookId", booksController.getEditBook);
router.post("/edit-book", booksController.postEditBook);
router.post("/deleteBook", booksController.postDeleteBook);

router.get("/books", booksController.getDisplayBooks);
router.get("/books/:bookId", booksController.getDisplayBook);

//Cart functions
router.get("/cart", booksController.getCart);
router.post("/cart", booksController.postCart);

exports.routes = router;
