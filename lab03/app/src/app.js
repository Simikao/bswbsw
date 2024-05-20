const express = require("express");
const axios = require("axios");
const { param } = require("express/lib/request");

const app = express();

const appPort = 3000;

const authEndpoint = "https://dev-8awfxgwdtajxa8v5.eu.auth0.com/authorize";
const tokenEndpoint = "https://dev-8awfxgwdtajxa8v5.eu.auth0.com/oauth/token";

const clientId = "testuser";
const clientSecret = "et3uvIRxhPE5VNQWreOYZEqU1gfIO6zr";

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