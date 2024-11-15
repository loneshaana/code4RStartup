var express = require("express");
var router = express.Router();
// var { body, validationResult } = require("express-validator");
var nodemailer = require("nodemailer");
var config = require("../config");
const { route } = require(".");
var transporter = nodemailer.createTransport(config.mailer);
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Code4Share -a platform for sharing code." });
});
// routes the page to the views, and renders the data from their
router.get("/about", function (req, res, next) {
  res.render("about", { title: "Code4Share - a platform for sharing code." }); // render the about page from the views
});
// / for get and post forms
router
  .route("/contact")
  .get(function (req, res, next) {
    res.render("contact", { title: "Code4Share- A platform for sharing code" });
  })
  .post(function (req, res, next) {
    // we will here first take the  data before rendering it to the thankYou page
    //checkBody is a function that allows you to validate and sanitize the body of the incoming HTTP requests
    // it takes 2 parameters field and message, field is the body that you want to validate, and message will be returned
    // if the validation fails
    req.checkBody("name", "Empty name").notEmpty();
    req.checkBody("email", "Invalid Email").isEmail();
    req.checkBody("message", "Empty message").notEmpty();
    var errors = req.validationErrors();
    // now check for errors if any
    if (errors) {
      // then send the following response
      res.render("contact", {
        title: "Code4Share- A platform for sharing code",
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        errorMessages: errors,
      });
    } else {
      const mailOptions = {
        from: "Code4Share<no-reply@code4share.com",
        to: "ahsaanul21@gmail.com",
        subject: "Code for share",
        text: req.body.message,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.error("Error", error.message);
        }
        res.render("thank", {
          title: "Code4Share - a platform for sharing code",
        });
      });
    }
  });
// router for login and register
router.get("/login", function (req, res, next) {
  res.render("login", { title: "Login" });
});
router.get("/register", function (req, res, next) {
  res.render("register", { title: "Register a new account" });
});
module.exports = router;
