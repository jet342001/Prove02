const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        bookId: {
          type: Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (book) {
  const cartBookIndex = this.cart.items.findIndex((cp) => {
    return cp.bookId.toString() === book._id.toString();
  });
  console.log(book);
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartBookIndex >= 0) {
    newQuantity = this.cart.items[cartBookIndex].quantity + 1;
    updatedCartItems[cartBookIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      BookId: book._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.getCart = function () {
  const bookIds = this.cart.items.map((i) => {
    return i.bookId;
  });
  return this.user.cart;
};

module.exports = mongoose.model("User", userSchema);
