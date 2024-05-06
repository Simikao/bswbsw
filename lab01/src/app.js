const express = require('express');
const app = express();
const cred = require('./users.js');
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(4);
console.log(cred);
// console.log(bcrypt.compareSync('secret', cred.pass))

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', './views'); // Set the directory for EJS templates

app.use((req, res, next) => {
    console.log('----HEADERS--');
    console.log(req.headers);
    console.log('----PARAMS--');
    console.log(req.query);
    next();
});

function findUser(login) {
    for (const admin of cred.admins) {
        if (admin.login === username) {
            return { login: admin.login, pass: admin.pass };
        }
    }

    // Sprawdź zwykłych użytkowników
    for (const user of cred.users) {
        if (user.login === username) {
            return { login: admin.login, pass: admin.pass };
        }
    }

    // Jeśli nie znaleziono użytkownika
    return null;
}

function findUserByLogin(login) {
    const foundUser = cred.admins.find(admin => admin.login === login) ||
        cred.users.find(user => user.login === login);
    console.log("found User", foundUser)
    return foundUser;
}

app.use((req, res, next) => {
    if (req.path === "/") {
        return next();
    }
    console.log("Authentication middleware");

    if (!req.headers.authorization) {
        res.set('WWW-Authenticate', 'Basic realm="my realm"');
        res.status(401).send('Access denied: Authentication required');
        return;
    }

    const base64auth = (req.headers.authorization || '').split(' ')[1] || '';

    const [login, pass] = Buffer.from(base64auth, 'base64').toString().split(':');
    // const user = 
    //
    // if (login && pass && login === cred.login && bcrypt.compareSync(pass, cred.pass)) {
    //     // OK
    //     return next();
    // }
    console.log("login: ", login);
    const foundUser = findUserByLogin(login);

    // console.log(foundUser);
    if (!bcrypt.compareSync(pass, foundUser.pass)) {
        return res.status(401).send('Access denied: Authentication required');
    }
    req.user = foundUser;
    next();
});


app.get("/admin", (req, res) => {
    if (req.user.role !== 'admin') {
        res.status(403).send('access denied: insufficient privileges');
        return;
    }
    // ... kod dla obszaru administracyjnego ...
    res.render('admin', { username: req.user.login, cred });
});

app.get("/user", (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'user') {
        res.status(403).send('access denied: insufficient privileges');
        return;
    }
    // ... kod dla obszaru użytkownika ...
    res.render('user', { username: req.user.login });
});

app.get("/", (req, res) => {
    // ... kod dla obszaru publicznego ...
    res.render('index');
});


const PORT = 4000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

