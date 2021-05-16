const path = require("path");
const mongoose = require("mongoose");

const port = "process.env.PORT || 5000 ";

const http = require("http");
const User = require("./model/user");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const cors = require("cors"); // Place this with other requires (like 'path' and 'express')

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

const MONGODB_URL =
  process.env.MONGODB_URL ||
  "mongodb+srv://<username>:<username>@cse341cluster-3dwlw.mongodb.net/test?retryWrites=true&w=majority";

const booksData = require("./routes/add-book");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
//give user access to the public folder
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use(booksData.routes);

//catch all routes for 404
app.use((req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "wrong",
  });
});

mongoose
  .connect(MONGODB_URL, options)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Stephen",
          email: "test@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
