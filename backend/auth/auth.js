const fs = require('fs');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const utils = require('../utils');

const UserModel = require('../model/user-model');

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    async (username, password, done) => {
      try {
        const user = await UserModel.findOne({ username });

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const login_secret = fs.readFileSync('../secrets/login_secret.txt', 'utf8');

passport.use(
  new JWTstrategy(
    {
      secretOrKey: login_secret,
      jwtFromRequest: ExtractJWT.fromExtractors([ExtractJWT.fromHeader('authentication'), ExtractJWT.fromUrlQueryParameter('secret_token')])
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
