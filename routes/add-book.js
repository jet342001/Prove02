const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const { Console } = require('node:console');

const router = express.Router();

const booksInv = [];

router.get('/add-books', (req, res, next) => {
    res.render("add-books", {
        pageTitle: 'addbook',
        path: 'add-books',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
});

router.post('/add-books', (req, res, next) => {
    booksInv.push({book: {title: req.body.title, description: req.body.description} });
    console.log(booksInv.length);
    res.redirect('/books');
});

router.get('/books', (req, res, next) => {
    res.render("books", {
        pageTitle: 'Books view',
        bookInventory: booksInv, 
        path: 'books',
        hasBooks: booksInv.length > 0,
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
});

exports.routes = router;
exports.books = booksInv;