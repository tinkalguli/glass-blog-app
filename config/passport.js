var passport = require("passport");
var githubStrategy = require("passport-github").Strategy;
var User = require("../models/user");

var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://my-glass-app.herokuapp.com/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, cb) {
      console.log(request, accessToken, refreshToken, profile);
      var email = profile._json.email;

      User.findOne({ email }, (err, user) => {
        if (err) return cb(err, false);
        if (!user) {
          var userInfo = {
            name: profile.displayName,
            email: profile._json.email,
          };

          User.create(userInfo, (err, user) => {
            if (err) return cb(err, false);
            cb(null, user);
          });
        }

        cb(null, user);
      });
    }
  )
);

passport.use(
  new githubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "https://my-glass-app.herokuapp.com/auth/github/callback",
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(accessToken, profile);
      var email = profile._json.email;

      User.findOne({ email }, (err, user) => {
        if (err) return cb(err, false);
        if (!user) {
          var userInfo = {
            name: profile.displayName,
            email: profile._json.email,
          };

          User.create(userInfo, (err, user) => {
            if (err) return cb(err, false);
            cb(null, user);
          });
        }

        cb(null, user);
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err) return done(err, false);
    done(null, user);
  });
});
