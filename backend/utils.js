const fs = require('fs');
const Python = require('python-shell');
const bcrypt = require('bcrypt');

const nouns = fs.readFileSync('../secrets/common-nouns.txt').toString().split("\n");

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

module.exports = {
    random_str: random_str,
    mail: mail,
    hash_pw: hash_pw
}
