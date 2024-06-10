const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const app = express();

const appPort = 3000;

const authEndpoint =
  "http://localhost:8080/realms/master/protocol/openid-connect/auth";
const tokenEndpoint =
  "http://keycloak:8080/realms/master/protocol/openid-connect/token";

const clientId = "testuser";
const clientSecret = "et3uvIRxhPE5VNQWreOYZEqU1gfIO6zr";

const backendId = "backendClient";
const backendSecret = "ve61XyxPPUMZ0rSIRhauMb977uYiIaA9";

const redirectUrl = "http://localhost:3000/myredirect";

const apiProtectedEnpoint = "http://resource-server:4000/protected/data";

// Only for demonstration - PKCE must be random at each request for auth code - never ever do like that with production code!
const codeVerifier = "23a8acb0cd92f7756649dfb32f7bcfd19f1ac5a8c2b56b1cfac70724";
const codeChallenge = "yK4QBx3RIdvqQcQvjtYLFV-iTa7cBZkKQAadOsNRm40";

// // PKCE code generation
// function base64URLEncode(str) {
// 	return str
// 		.toString("base64")
// 		.replace(/\+/g, "-")
// 		.replace(/\//g, "_")
// 		.replace(/=+$/, "");
// }
//
// function sha256(buffer) {
// 	return crypto.createHash("sha256").update(buffer).digest();
// }

// const codeVerifier = base64URLEncode(crypto.randomBytes(32));
// const codeChallenge = base64URLEncode(sha256(codeVerifier));

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
  console.log("am here 1");

  console.log(params);

  params.append("grant_type", "authorization_code");
  console.log("am here 2");
  console.log(params);
  params.append("redirect_uri", redirectUrl);
  console.log("am here 3");
  console.log(params);
  params.append("client_id", clientId);
  console.log("am here 4");
  console.log(params);
  params.append("client_secret", clientSecret);
  console.log("am here 5");
  console.log(params);
  params.append("code_verifier", codeVerifier);
  console.log("am here 6");
  console.log(params);
  params.append("code", req.query.code);
  console.log("am here 8");
  console.log(params);

  return axios
    .post(tokenEndpoint, params)
    .then((result) => {
      accessToken = result.data.access_token || "";

      console.log("Rezultat zapytania o token");
      console.log(result.data);
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

app.get("/data", (req, res) => {
  const params = new URLSearchParams();

  params.append("grant_type", "client_credentials");
  console.log("am here 2");
  console.log(params);
  params.append("client_id", backendId);
  console.log("am here 3");
  console.log(params);
  params.append("client_secret", backendSecret);
  console.log("am here 4");
  console.log(params);

  return axios
    .post(tokenEndpoint, params)
    .then((result) => {
      accessToken = result.data.access_token || "";

      console.log("Rezultat zapytania o token");
      console.log(result.data);
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
      res.send(result.data);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

app.listen(appPort, (err) => {
  console.log(`App listening on port ${appPort}`);
});
