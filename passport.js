var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var FaceBookStrategy = require("passport-facebook").Strategy;

// serializing user -->> storing the user ID in the session
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

// passport.deserializeUser(function (id, done) {
//   User.findOne({_id: id}, function (err, user) {
//     done(err, user);
//   })
// });
// retreiving the user by ID from the database
passport.deserializeUser(async function (id, done) {
  try {
    // use async/await to fetch the user by id
    const user = await User.findById(id);
    if (!user) {
      return done(new Error("User not found"));
    }
    // pass the user object to the done callback
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// passport.use(new LocalStrategy({
//     usernameField: 'email'
//   },
//   async (username, password, done) {
//     User.findOne({email: username}, function (err, user) {
//       if (err) return done(err);
//       if (!user) {
//         return done(null, false, {
//           message: 'Incorrect username or password'
//         });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, {
//           message: 'Incorrect username or password'
//         });
//       }

//       return done(null, user);
//     })
//   }
// ));
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (username, password, done) => {
      try {
        // Use async/await to find the user
        const user = await User.findOne({ email: username });

        // Check if user exists
        if (!user) {
          return done(null, false, {
            message: "Incorrect username or password",
          });
        }

        // Validate the password (make sure you have a validPassword method in your User model)
        if (!user.validPassword(password)) {
          return done(null, false, {
            message: "Incorrect username or password",
          });
        }

        // If everything is fine, pass the user object to done()
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
passport.use(
  new FaceBookStrategy(
    {
      clientID: "452939444112071",
      clientSecret: "d4584cd54feae40a2071e05ed9345166",
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ facebookId: profile.id });
        if (user) {
          return done(null, user);
        }
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.facebookId = profile.id;
          await user.save();
          return done(null, user);
        }
        const newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          facebookId: profile.id,
        });
        await newUser.save();
        return done(null, newUser);  // null--> no erro
      } catch (error) {
        console.error("Error in facebook strategy:", error);
        return done(err, false, {
          message: "An error occured whilre processing the login",
        });
      }
    }
  )
);
