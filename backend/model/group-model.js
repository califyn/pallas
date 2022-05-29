const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    users: [{ type: String }],
    admins: [{ type: String }],
    name: { 
        type: String,
        unique: true
    }
});

const GroupModel = mongoose.model('group', GroupSchema);

module.exports = GroupModel;
