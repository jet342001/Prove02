const Book = require("../model/booksmodel");

const User = require("../model/user");
const { validationResult } = require("express-validator/check");

exports.getAddBook = (req, res, next) => {
  res.render("edit-book", {
    pageTitle: "Add Book",
    path: "add-books",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddBook = (req, res, next) => {
  console.log("checking errors");
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const errors = validationResult(req);
  console.log("checking errors");
  if (!errors.isEmpty) {
    res.status(422).render("edit-book", {
      pageTitle: "Add Book",
      path: "/edit-book",
      editing: false,
      hasError: true,
      book: book,
      errorMessage: message,
      oldInput: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: [],
    });
  }

  const book = new Book({
    title: title,
    author: null,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user,
  });
  book
    .save()
    .then((result) => {
      // console.log(result);
      console.log("Created New book");
      res.redirect("/books");
    })
    .catch((err) => {
      error.httpStatusCode = 500;
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
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
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
        hasError: false,
        errorMessage: message,
        oldInput: {
          Title: "",
          imageUrl: "",
          price: "",
          description: "",
        },
        validationErrors: [],
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

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("Edit-Book", {
      pageTitle: "Edit Book",
      path: "/Edit-Book",
      editing: true,
      hasError: true,
      book: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

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
  console.log(req.session.user);
  req.user
    .populate("cart.items.bookId")
    .execPopulate()
    .then((user) => {
      const books = user.cart.items;
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
  Book.findById(prodId)
    .then((book) => {
      console.log(book.id);
      return req.user.addToCart(book);
    })
    .then((result) => {
      console.log(result);
      res.redirect("cart");
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

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.bookId")
    .execPopulate()
    .then((user) => {
      const books = user.cart.items.map((i) => {
        return { quantity: i.quantity, book: { ...i.bookId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        books: books,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};
