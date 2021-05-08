const Book = require('../model/booksmodel');

exports.getAddBook = (req, res, next) => {
    res.render("add-books", {
        pageTitle: 'Add Book',
        path: 'add-books'
    });
};

exports.postAddBook = (req, res, next) => {
    const title = req.body.title;
    const description = req.body.description;
    const price = 0;
    const imageUrl = req.body.imageUrl;
    const book = new Book(null, title, imageUrl, description);
    book.save();
    res.redirect('/books');
};

exports.getDisplayBooks = (req, res, next) => {
    Book.fetchAll(books => {
        res.render("books", {
            pageTitle: 'Books view',
            bookInventory: books,
            path: 'books',
            hasBooks: books.length > 0
        });
    });
};

exports.getDisplayBook = (req, res, next) => {
    const bookId = req.params.bookId;
    Book.findById(bookId, book => {
        res.render('bookview', {
            book: book,
            pageTitle: book.title,
            path: "book"
        });
    });
};