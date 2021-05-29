const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const MONGODB_URI =
  "mongodb+srv://Steve:M2j9DCBGynRG7Clu@cluster0.u8ta3.mongodb.net/myFirstDatabase";
require("dotenv").config();
const csrf = require("csurf");

const port = process.env.PORT || 5000;
const User = require("./model/user");
const flash = require("connect-flash");
const cors = require("cors");

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const MONGODB_URL = process.env.MONGODB_URL;

const corsOptions = {
  origin: "https://<your_app_name>.herokuapp.com/",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4,
};

const csrfProctection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const booksData = require("./routes/add-book");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
//give user access to the public folder
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "a very long string what a thing",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProctection);
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedin;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

//routes
app.use(booksData.routes);
app.use(authRoutes);

//catch all routes for 404
app.use((req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "wrong",
    isAuthenticated: req.session.isLoggedin,
  });
});

mongoose
  .connect(MONGODB_URL, options)
  .then((result) => {
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
