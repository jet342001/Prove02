const path = require("path");
const express = require("express");
const rootDir = require("../util/path");
const isAuth = require("../middleware/is-auth");
const { check, body } = require("express-validator/check");

const booksController = require("../controllers/books");
const router = express.Router();

router.get("/", booksController.getDisplayBooks);
router.get("/add-books", isAuth, booksController.getAddBook);
router.post(
  "/add-books",
  [
    body("title", "Title is too Short").isString().isLength({ min: 3 }).trim(),
    //body("imageUrl", "Make sure URL is valid").isURL(),
    body("price", "must have 2 decimal places (example 12.00)").isFloat(),
    body(
      "description",
      "Minimum description length is 5 Characters, you can do it!"
    )
      .isLength({ min: 5 })
      .trim(),
  ],
  isAuth,
  booksController.postAddBook
);

router.get("/edit-book/:bookId", isAuth, booksController.getEditBook);
router.post(
  "/edit-book",
  [
    body("title", "Title is too Short").isString().isLength({ min: 3 }).trim(),
    //body("imageUrl", "Make sure URL is valid").isURL(),
    body("price", "must have 2 decimal places (example 12.00)").isFloat(),
    body(
      "description",
      "Minimum description length is 5 Characters, you can do it!"
    )
      .isLength({ min: 5 })
      .trim(),
  ],
  isAuth,
  booksController.postEditBook
);
router.post("/deleteBook", isAuth, booksController.postDeleteBook);

router.get("/books", booksController.getDisplayBooks);
router.get("/books/:bookId", booksController.getDisplayBook);

//Cart functions
router.get("/cart", isAuth, booksController.getCart);
router.post("/cart", isAuth, booksController.postCart);

exports.routes = router;
