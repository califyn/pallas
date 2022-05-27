const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const router = express.Router();
const UserModel = require('../model/user-model');

const utils = require('../utils');

const login_secret = fs.readFileSync('../secrets/login_secret.txt', 'utf8');

router.post(
  '/signup',
  async (req, res, next) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = utils.random_str(3).join("-");
    var hash_password = await utils.hash_pw(password);

    const user = await UserModel.create({ username: username, password: hash_password, email: email });

    var msg = "Pallas account info";
    msg += "\nHere are the credentials for your newly registerd Pallas account:";
    msg += "\n\t Username: " + username;
    msg += "\n\t Password: " + password;
    msg += "\nPlease use these credentials to log in and then you will be able to change your password in the settings panel.";
    msg += "\n\n If you were not expecting this email, please contact the webmaster (email below).";

    utils.mail(email, msg); 

    res.json({
      message: 'Signup successful',
      username: user.username,
      email: user.email
    });
  }
);

router.post(
    '/reset-password',
    async (req, res, next) => {
        var user = await UserModel.findOne({username: req.body.username, email: req.body.email});

        if (user === null) {
            const error = new Error('no matching users were found');

            next(error);
        } else {
            const password = utils.random_str(3).join("-");

            var msg = "Pallas password reset";
            msg += "\nHere are your reset login credentials:";
            msg += "\n\t Username: " + req.body.username;
            msg += "\n\t Password: " + password;
            msg += "\nPlease use these credentials to log in and then you will be able to change your password in the settings panel.";
            msg += "\n\n If you were not expecting this email, please contact the webmaster (email below).";

            user.password = await utils.hash_pw(password);
            user.save();

            utils.mail(user.email, msg);
            res.json({
                message: 'Reset successful',
                username: user.username,
                email: user.email
            });
        }
    }
);

router.post(
  '/login',
  async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err, user, info) => {
        try {
          if (err) {
            const error = new Error('An error occurred.');

            return next(error);
          } else if (!user) {
            const error = new Error('login was incorrect');
            
            return next(error);
          }

          req.login(
            user,
            { session: false },
            async (error) => {
              if (error) return next(error);

              const body = { _id: user._id, username: user.username };
              const token = jwt.sign({ user: body }, login_secret, { expiresIn: "24h" });

              return res.json({ token });
            }
          );
        } catch (error) {
          console.log('error');
          return next(error);
        }
      }
    )(req, res, next);
  }
);

module.exports = router;
