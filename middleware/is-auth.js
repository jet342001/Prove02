module.exports = (req, res, next) => {
  if (!req.session.isLoggedin) {
    console.log("not logged in", req.session.isLoggedin);
    return res.redirect("/login");
  }
  next();
};
