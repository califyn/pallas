const express = require('express');
const router = express.Router();

const GroupModel = require('../model/group-model');
const fs = require('fs');

const nouns = fs.readFileSync('../assets/common-nouns.txt').toString().split("\n");

function random_noun () {
	return nouns[Math.floor(Math.random() * nouns.length)];
}

router.get(
	'/profile',
	(req, res, next) => {
		res.json({
			message: 'You made it to the secure route',
			user: req.user,
			token: req.query.secret_token
		})
	}
);

router.post(
	'/create-group',
	async (req, res, next) => {
        const group = await GroupModel.create({users: [req.user._id], admins: [req.user._id], name: req.body.name});

        res.json({
            message: "Group created successfully",
            group: group
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
