const Book = require("../model/booksmodel");

exports.getAddBook = (req, res, next) => {
  res.render("edit-book", {
    editing: false,
    pageTitle: "Add Book",
    path: "add-books",
  });
};

exports.postAddBook = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const book = new Book({
    title: title,
    author: null,
    price: price,
    imageUrl: imageUrl,
    description: description,
  });
  book
    .save()
    .then((result) => {
      // console.log(result);
      console.log("Created New book");
      res.redirect("/books");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getDisplayBooks = (req, res, next) => {
  Book.find().then((books) => {
    res.render("books", {
      pageTitle: "Books view",
      bookInventory: books,
      path: "books",
      hasBooks: books.length > 0,
    });
  });
};

exports.getDisplayBook = (req, res, next) => {
  const bookId = req.params.bookId;
  Book.findById(bookId).then((book) => {
    res.render("bookview", {
      book: book,
      pageTitle: book.title,
      path: "book",
    });
  });
};

exports.getEditBook = (req, res, next) => {
  const editMode = true;
  const prodId = req.params.bookId;
  Book.findById(prodId)
    .then((book) => {
      // if (!book) {
      //   return res.redirect("/");
      // }
      res.render("edit-book", {
        pageTitle: "Edit Book",
        path: "/edit-book",
        editing: editMode,
        book: book,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditBook = (req, res, next) => {
  const prodId = req.body.bookId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  console.log("posting an edit");

  Book.findById(prodId)
    .then((book) => {
      book.tite = updatedTitle;
      book.price = updatedPrice;
      book.description = updatedDesc;
      book.imageUrl = updatedImageUrl;
      return book.save();
    })
    .then((result) => {
      console.log("UPDATED BOOK!");
      res.redirect("/books");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteBook = (req, res, next) => {
  const prodId = req.body.bookId;
  Book.findByIdAndDelete(prodId).then((result) => {
    console.log("Book Deleted");
    res.redirect("/books");
  });
};

//Shopping cart operations
exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.bookId")
    .execPopulate()
    .then((books) => {
      res.render("cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        books: books,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.bookId;
  console.log(req.user);
  Book.findById(prodId)
    .then((book) => {
      console.log(prodId, book);
      return req.user.addToCart(book);
    })
    .then((result) => {
      console.log(result);
      res.redirect("books");
    });
};

exports.postCartDeleteBook = (req, res, next) => {
  const prodId = req.body.bookId;
  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};
