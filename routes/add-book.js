const path = require("path");
const express = require("express");
const rootDir = require("../util/path");
const isAuth = require("../middleware/is-auth");

const booksController = require("../controllers/books");
const router = express.Router();

router.get("/", booksController.getDisplayBooks);
router.get("/add-books", isAuth, booksController.getAddBook);
router.post("/add-books", isAuth, booksController.postAddBook);

router.get("/edit-book/:bookId", isAuth, booksController.getEditBook);
router.post("/edit-book", isAuth, booksController.postEditBook);
router.post("/deleteBook", isAuth, booksController.postDeleteBook);

router.get("/books", booksController.getDisplayBooks);
router.get("/books/:bookId", booksController.getDisplayBook);

//Cart functions
router.get("/cart", isAuth, booksController.getCart);
router.post("/cart", isAuth, booksController.postCart);

exports.routes = router;
