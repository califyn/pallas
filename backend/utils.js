const fs = require('fs');
const Python = require('python-shell');
const bcrypt = require('bcrypt');

const nouns = fs.readFileSync('../secrets/common-nouns.txt').toString().split("\n");

const access_level_str = ["applicant", "student", "staff", "admin"];
const gaccess_level_str = ["nonmember", "member", "admin"]

function random_str (num) {
    if (num == 1) {
        return nouns[Math.floor(Math.random() * nouns.length)];
    } else { 
        var ret = [];
        for (var i = 0; i < num; i++) {
            ret.push(nouns[Math.floor(Math.random() * nouns.length)]);
        }
        return ret;
    }
}

function mail(address, msg) {
    var filename = random_str(4).join("-") + ".txt";
    while (fs.existsSync("email/messages/" + filename)) {
        filename = random_str(4).join("-") + ".txt";
    }
    fs.writeFileSync("email/messages/" + filename, msg); 

    let options = {
        args: ['--address=' + address, '--msg_path=email/messages/' + filename]
    }
    Python.PythonShell.run("email/mailer.py", options, function (err, results) {
        if (err) throw err;
    });
}

async function hash_pw(pw) {
    return await bcrypt.hash(pw, 10);
}

function accessMap(s) {
    if (s.access_level !== undefined) {
        s = s.access_level;
    }
    if (Number.isInteger(s)) {
        return s;
    }
    if (access_level_str.includes(s)) {
        return access_level_str.indexOf(s);
    } else {
        throw new Error("unrecognized access level");
    }
}

function reverseAccessMap(s) {
    return access_level_str[s];
}

function accessAtLeast(level1, level2) {
    level1 = accessMap(level1);
    level2 = accessMap(level2);

    return level1 >= level2;
}

function accessLessThan(level1, level2) {
    level1 = accessMap(level1);
    level2 = accessMap(level2);

    return level1 < level2;
}

function authBad(res) {
    return res.status(401).send('You are not authorized to perform this operation');
}

function GaccessMap(group, s) {
    if (s.username !== undefined) {
        if (group.admins.includes(s._id)) {
            return gaccess_level_str[2];
        } else if (group.users.includes(s._id)) {
            return gaccess_level_str[1];
        } else {
            return gaccess_level_str[0];
        }
    } else if (gaccess_level_str.includes(s)) {
        return gaccess_level_str.indexOf(s);
    } else {
        throw new Error("unrecognized access level");
    }
}

function GaccessAtLeast(group, level1, level2) {
    level1 = GaccessMap(group, level1);
    level2 = GaccessMap(group, level2);

    return level1 >= level2;
}

function GaccessLessThan(group, level1, level2) {
    level1 = GaccessMap(group, level1);
    level2 = GaccessMap(group, level2);

    return level1 < level2;
}
module.exports = {
    random_str: random_str,
    mail: mail,
    hash_pw: hash_pw,
    reverseAccessMap: reverseAccessMap,
    accessAtLeast: accessAtLeast,
    accessLessThan: accessLessThan,
    authBad: authBad,
    GaccessAtLeast: GaccessAtLeast,
    GaccessLessThan: GaccessLessThan
}
