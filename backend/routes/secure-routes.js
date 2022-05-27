const express = require('express');
const router = express.Router();

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
	(req, res, next) => {
		res.json({
			message: 'User info retrieved',
            user: req.user,
			token: req.query.secret_token
		})
	}
);

router.post(
	'/create-group',
	async (req, res, next) => {
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
);

router.get(
	'/list-groups',
	async (req, res, next) => {
        const groups = await GroupModel.find({users: req.user._id});
        
        res.json({
            message: "Groups found",
            groups: groups,
            token: req.query.secret_token
        })
	}
)

router.get(
    '/group-info',
    async (req, res, next) => {
        const group = await GroupModel.findById(req.query.group_id);

        res.json({
            message: "found group",
            group: group
        });
    }
);

module.exports = router;
