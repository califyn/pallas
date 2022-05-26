const fs = require('fs');
const Python = require('python-shell');

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

function mail(address, msg_path) {
    let options = {
        args: ['--address=' + address, '--msg_path=email/messages/' + msg_path]
    }
    Python.PythonShell.run("email/mailer.py", options, function (err, results) {
        if (err) throw err;
    });
}

module.exports = {
    random_str: random_str,
    mail: mail
}
