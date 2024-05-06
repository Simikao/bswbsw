**Zadanie 1.**\
Przeanalizuj poniższy bardzo uproszczony przykład serwera realizującego `HTTP Basic Authentication`

```javascript
const express = require('express');
const app = express();

app.use((req, res, next) => {
    console.log('----HEADERS--');
    console.log(req.headers);
    console.log('----PARAMS--');
    console.log(req.query);
    next();
});

app.use((req, res, next) => {

    console.log("Authentication middleware");
    
    const cred = {
        login: 'admin',
        pass: 'secret'
    };
    const base64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, pass] = Buffer.from(base64auth, 'base64').toString().split(':');

    if (login && pass && login === cred.login && pass === cred.pass) {
        // OK
        return next();
    }

    // Access denied
    res.set('WWW-Authenticate', 'Basic realm="my realm"');
    res.status(401).send('Access denied: Authentication required');
});


app.get("/hello", (req, res) => {
    res.send('Hello World!');
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
```

Wykorzystując podane, bardzo uproszczone rozwiązanie (używające techniki `middleware` z `express`) i *bez wykorzystania dedykowanych bibliotek* zaimplementuj prostą aplikację która posiada obszary chronione dla dwóch ról `admin` i `user` oraz publicznie dostępne. Hasła przechowujemy w aplikacji w formie zahashowanej (można użyć odpowiedniej biblioteki). Implementujemy rozwiązanie zgodnie ze specyfikacją [Http Basic Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication) i realizujące ten schemat [Schemat](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes). 

Do generowania HTML można wykorzystać dowolny silnik np. [Template engine EJS](https://ejs.co) lub [Handlebars](https://handlebarsjs.com/)

Przykładowe podzadania do przemyślenia/zaprojektowania i zrealizowania w ramach tego projektu:
- Mapowanie użytkowników na role (po 2 użytkowników na rolę), odpowiednia struktura danych
- Przechowywanie i wyszukiwanie zahashowanych haseł użytkowników
