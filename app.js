const path = require("path");
const mongoose = require("mongoose");

const port = "5000"; //process.env.PORT ||

const http = require("http");
const User = require("./model/user");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

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
  .connect(
    "mongodb+srv://Steve:M2j9DCBGynRG7Clu@cluster0.u8ta3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
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
