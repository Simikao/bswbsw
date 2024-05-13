**Zadanie 1**\
Celem zadania jest przeprowadzenie procesu pozyskania tokenu autoryzacyjnego wg [Authoriation Code Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow) (w uproszczeniu: zamiana `code` na `token`) i wyświetleniu go w API w `Resource Server`\
\
Zadanie należ wykonać dla dwóch instancji `Authorization Server`, których setup został wykonany na poprzednich zajęciach:

- Keycloak - środowisko lokalne oparte o Docker Compose
- Okta for developers - środowisko lokalne (może być lokalne oparte o Docker Compose) z serverem autoryzacyjnym w postaciu usługi online
  \
  Składowe:

1. `Client` - aplikacja webowa typu Server Side Rendering (NodeJS + Express + template engine)
1. `Resource Server` - aplikacja webowa wystawiająca HTTP API (NodeJS + Express)
1. `Authorization Server` - Keycloak w środowisku lokalnym i Okta w postaci usługi online

Proponowane kroki:

1. zdefiniować klienta w Serwerze Autoryzacyjnym. Należ szukać opcji związanych z `Authorization Code Grant/Flow` lub dla aplikacji webowej (w Okta jest to klasyczna aplikacja webowa). Pozyskać `ClientID` oraz `Client Password`. Dalej należ ustalić dwa endpointy serwera autoryzacyjnego:

- auth endpoint
- token endpoint

1. dodać użytkownika (login i hasło)
1. zapimplementować flow wg przykładowego kodu
1. sprawdzić poprawność otrzymanego tokenu w serwisie online [JWT](https://jwt.io)

Wymagania:\

- należy zapewnić właściwą obsługę kodu PKCE tj. generować go za każdym rozpoczęciem nowego flow i przechowywać do czasu pozyskania tokenu. Pomocne materiały [PKCE](https://curity.io/resources/learn/oauth-pkce/) lub [PKCE](https://medium.com/identity-beyond-borders/what-the-heck-is-pkce-40662e801a76)
- nie wolno korzystać z zewnętrznych bibliotek poza prostym do liczenia hash lub base64

Przykładowy kod klienta

```javascript
const express = require("express");
const axios = require("axios");
const { param } = require("express/lib/request");

const app = express();

const appPort = 3000;

const authEndpoint = "https://dev-8awfxgwdtajxa8v5.eu.auth0.com/authorize";
const tokenEndpoint = "https://dev-8awfxgwdtajxa8v5.eu.auth0.com/oauth/token";

const clientId = "qj2RtiiN6Umfo2OZIYoFbvo3yiG7CPZj";
const clientSecret =
  "ar3LXmI_1dOdJ06y-VhxbzfbB-touODUjIeCvPMyslktrqi0ixVekj9M5msjhypB";

const redirectUrl = "http://localhost:3000/myredirect";

const apiProtectedEnpoint = "http://localhost:4000/protected/data";

// Only for demonstration - PKCE must be random at each request for auth code - never ever do like that with production code!
const codeVerifier = "23a8acb0cd92f7756649dfb32f7bcfd19f1ac5a8c2b56b1cfac70724";
const codeChallenge = "yK4QBx3RIdvqQcQvjtYLFV-iTa7cBZkKQAadOsNRm40";

const authRequest = `${authEndpoint}?
response_type=code&
client_id=${clientId}&
state=1234&
redirect_uri=${redirectUrl}&
code_challenge=${codeChallenge}&
code_challenge_method=S256&
scope=offline_access`;

app.get("/", (req, res) => {
  res.set("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
    <body>
    <h2>Welcome to my app</h2>
    <div>
    <a href="${authRequest}">Please Login</a>
    </div>
    </body>
    </html>
    `);
});

app.get("/myredirect", (req, res) => {
  const params = new URLSearchParams();

  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", redirectUrl);
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("code_verifier", codeVerifier);
  params.append("code", req.query.code);

  return axios
    .post(tokenEndpoint, params)
    .then((result) => {
      accessToken = result.data.access_token || "";

      console.log("Rezultat zapytania o token");
      console.log(result.data.data);
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
      return axios.get(apiProtectedEnpoint, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
    })
    .then((result) => {
      let success = true;
      if (result.status !== 200) {
        success = false;
      }
      res.set("Content-Type", "text/html");
      res.send(`
        <!DOCTYPE html>
        <body>
        <h2>Success? ${success}</h2>
        <p>Protected resources: ${result.data.data}</p>
        </body>
        </html>
        `);
    })
    .catch((error) => {
      console.log(error);
      res.set("Content-Type", "text/html");
      res.send(`
        <!DOCTYPE html>
        <body>
        <h2>Error</h2>
        </body>
        </html>
        `);
    });
});

app.listen(appPort, (err) => {
  console.log(`App listening on port ${appPort}`);
});
```
