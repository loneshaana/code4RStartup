// var express = require('express');
// var router = express.Router();
// var passport = require('passport');

// router.get('/login', function(req, res, next) {
//   res.render('login', { title: 'Login your account'});
// });

// router.route('/register')
//   .get(function(req, res, next) {
//     res.render('register', { title: 'Register a new account'});
//   })
//   .post(function(req, res, next) {
//     req.checkBody('name', 'Empty Name').notEmpty();
//     req.checkBody('email', 'Invalid Email').isEmail();
//     req.checkBody('password', 'Empty Password').notEmpty();
//     req.checkBody('password', 'Password do not match').equals(req.body.confirmPassword).notEmpty();

//     var errors = req.validationErrors();
//     if (errors) {
//       res.render('register', {
//         name: req.body.name,
//         email: req.body.email,
//         errorMessages: errors
//       });
//     } else {
//       var user = new User();
//       user.name = req.body.name;
//       user.email = req.body.email;
//       user.setPassword(req.body.password);
//       user.save(function (err) {
//         if (err) {
//           res.render('register', {errorMessages: err});
//         } else {
//           res.redirect('/login');
//         }
//       })
//     }
//   });

//   module.exports = router;
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/user"); // Ensure path is correct

router.get('/login', function(req, res, next){
    res.render('login', {title: "Login your account"})
})

router
  .route("/register")
  .get(function (req, res, next) {
    res.render("register", { title: "Register a new account" });
  })
  .post(
    [
      body("name", "Empty Name").notEmpty(),
      body("email", "Invalid Email").isEmail(),
      body("password", "Empty Password").notEmpty(),
      body("confirmPassword")
        .notEmpty()
        .withMessage("Empty Confirm Password")
        .custom((value, { req }) => value === req.body.password)
        .withMessage("Passwords do not match"),
    ],
    async function (req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render("register", {
          title: "Register a new account",
          name: req.body.name,
          email: req.body.email,
          errorMessages: errors.array(),
        });
      }

      try {
        const user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.setPassword(req.body.password); // Ensure `setPassword` is implemented in User model

        await user.save(); // to pause the execution of the function, until a promise is resolverd or rejected  

        res.redirect("/login");
      } catch (err) {
        res.render("register", {
          title: "Register a new account",
          errorMessages: [{ msg: err.message }],
        });
      }
    }
  );

module.exports = router;
