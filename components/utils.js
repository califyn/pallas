import { fetchP } from './login'

var idx = 0;
const words = ["apple", "berry", "coconut", "danish", "eerie"]

var debug = false;

export function getUser(setCurrentUser) {
    const word = words[idx % words.length];
    idx++;
    const params = new URLSearchParams({
        "secret_token": localStorage.getItem("token"),
        "word": debug ? undefined : word
    });
    if (debug) console.log(Date.now() + word + ' params found');
    fetch("/api/priv/user-info?" + params).then(res => {
        if (debug) console.log(Date.now() + word + ' received');
        if (res.ok) {
            res.json().then(res => { 
                setCurrentUser(res.user);
                if (debug) console.log(res.user.username);
            });
        } else {
            throw new Error(res.status)
        };
    });
}

