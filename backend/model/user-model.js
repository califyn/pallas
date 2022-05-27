const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const utils = require('../utils.js');

const Schema = mongoose.Schema;

const fs = require('fs');
const admin_email = fs.readFileSync('../secrets/admin_email.txt');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: admin_email
  },
  email_reset_to: {
    type: String,
    default: admin_email
  },
  email_reset_key: {
    type: String,
    default: ""
  },
  access_level: {
    type: Number,
    default: 0
  }
});

UserSchema.pre(
  'save',
  async function(next) {
    const user = this;
    const hash = utils.hash_pw(this.password);

    this.password = hash;
    next();
  }
);

UserSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
}

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
