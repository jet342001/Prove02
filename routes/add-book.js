const path = require('path');
const express = require('express');
const rootDir = require('../util/path');

const booksController = require('../controllers/books');
const router = express.Router();

router.get('/add-books', booksController.getAddBook);

router.post('/add-books', booksController.postAddBook);

router.get('/books', booksController.getDisplayBooks);
router.get('/books/:bookId', booksController.getDisplayBook);

exports.routes = router;