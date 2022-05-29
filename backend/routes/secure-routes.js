const express = require('express');
const router = express.Router();

const UserModel = require('../model/user-model');
const GroupModel = require('../model/group-model');
const fs = require('fs');

const bcrypt = require('bcrypt');
const utils = require("../utils");

router.post(
    '/initiate-email-reset',
    async (req, res, next) => {
        var email = req.body.email;
        var key = utils.random_str(3).join("-");

        const hash = await utils.hash_pw(key);
        req.user.email_reset_to = email;
        req.user.email_reset_key = hash;
        req.user.save();

        var msg = "Email verification key";
        msg += "\nHere is the key to verify your email:";
        msg += "\n\t Key: " + key;
        msg += "\nUse this key to verify your ownership of this email."; 
        msg += "\n\n If you were not expecting this email, please contact the webmaster (email below).";

        utils.mail(email, msg);
        
        res.json({
            message: 'Email reset initiated',
        });
    }
);

router.post(
    '/verify-email-reset',
    async (req, res, next) => {
        var key = req.body.key;

        var validate = await bcrypt.compare(key, req.user.email_reset_key);

        if (validate) {
            req.user.email = req.user.email_reset_to;
            req.user.save();
        }

        res.json({
            message: "Email verification key checked",
            match: validate,
        });
    }
);

router.post(
    '/change-password',
    async (req, res, next) => {
        var password = req.body.password;
        
        req.user.password = await utils.hash_pw(password);
        req.user.save();

        res.json({
            message: 'Change password successful',
        });
    }
);

router.get(
	'/user-info',
	async (req, res, next) => {
        if (req.query.word !== undefined) {
            console.log(Date.now() + req.query.word + ' query');
        }
        var ret = null;
        if (utils.accessAtLeast(req.user, 'admin')) {
            var username = req.query.username != undefined ? req.query.username : req.user.username;
            found_user = await UserModel.findOne({username: username}); 
            ret = found_user.toObject();
        } else if (utils.accessAtLeast(req.user, 'student') || req.query.username == undefined) {
            var username = req.query.username != undefined ? req.query.username : req.user.username;
            ret = {}
            found_user = await UserModel.findOne({username: username}); 
            if (utils.accessAtLeast(req.user, 'staff')) {
                var props = ["_id", "username", "email", "access_level"];
            } else if (utils.accessAtLeast(req.user, 'student')) {
                var props = ["_id", "username", "email"];
            } else if (req.query.username == undefined) {
                var props = ["_id", "username", "email"];
            }
            if (username == req.user.username) {
                props = [...new Set(props.concat(["_id", "username", "email"]))]; 
            }
            for (var i = 0; i < props.length; i++) {
                ret[props[i]] = found_user[props[i]];
            }
        }
        if (ret != null && ret.access_level !== undefined) {
            ret.access_level = utils.reverseAccessMap(ret.access_level);
        }
		res.json({
			message: 'User info retrieved',
            user: ret,
			token: req.query.secret_token
		})
	}
);

router.post(
	'/create-group',
	async (req, res, next) => {
        if (utils.accessLessThan(req.user, "student")) {
            utils.authBad(res);
        } else {
            const group = await GroupModel.create({users: [req.user._id], admins: [req.user._id], name: req.body.name}, (err) => {
                if (err === null) {
                    res.json({
                        message: "Group created successfully",
                        group: group
                    });
                } else { 
                    return next(err);
                }
            });
        }
	}
);

router.get(
	'/list-groups',
	async (req, res, next) => {
        if (utils.accessLessThan(req.user, "student")) {
            utils.authBad(res);
        } else {
            var groups = undefined;
            if (req.query.username == "undefined" || req.query.username == "null") {
                groups = await GroupModel.find({users: req.user._id});
            } else {
                const selected_user = await UserModel.findOne({username: req.query.username });
                groups = await GroupModel.find({users: selected_user._id});
            }
            if (groups === undefined) {
                groups = [];
            }

            res.json({
                message: "Groups found",
                groups: groups.map(g => g._id),
                can_add_group: utils.accessAtLeast(req.user, "student"),
                token: req.query.secret_token
            })
        }
	}
)

router.get(
    '/group-info',
    async (req, res, next) => {
        if (utils.accessLessThan(req.user, "student")) {
            utils.authBad(res);
        } else {
            const group = await GroupModel.findById(req.query.group_id);
            var ret = null;

            if (utils.GaccessAtLeast(group, req.user, "admin")) {
                ret = group.toObject();
            } else {
                ret = {};
                
                if (utils.GaccessAtLeast(group, req.user, "member")) {
                    var props = ["users", "admins", "name"];
                } else {
                    var props = ["users", "admins", "name"];
                }
                
                for (var i = 0; i < props.length; i++) {
                    ret[props[i]] = group[props[i]];
                }
            } 

            res.json({
                message: "found group",
                group: ret
            });
        }
    }
);

module.exports = router;
