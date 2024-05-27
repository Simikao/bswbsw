const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const appPort = 4000;

const publicKey =
  "-----BEGIN PUBLIC KEY-----\n" +
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApSg5VQeVmswXUXNOq+F8\n" +
  "AfctE4aZACcMyjUvpAG+wabB9ZWfyjl3BbgOTpYK/jpp68bK2+iGdie10aGVYGPH\n" +
  "Pg9f8HyYRLADSY/re3UIM/uiNdRdr19JfeQnU1PcwH7w3NcT0V81xM7X8GOOihdm\n" +
  "EZq6RnyJZSGTrQsDByCjHciUUGAjMdegds+7JuoZOAXuysqsvYapXHvQir01oW+P\n" +
  "5fqfjYzbXcsJDDd24WKXyEJcvLDbqlC7Vd6kXexgMYjAogtZjUl49xU71wk4z2DY\n" +
  "J+t33v1Khy7DUMSmWDGtpFELD1W8wda+GS8A8tbxXEPUzPko0CR39OGPa8O2JLZk\n" +
  "jwIDAQAB\n" +
  "-----END PUBLIC KEY-----\n";

app.get("/", (req, res) => {
  res.set("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
    <body>
    <h2>Welcome to my app</h2>
    <div>
<p>"Hello world"</p>
    </div>
    </body>
    </html>
    `);
});
// Middleware to protect resources
app.use("/protected", (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("AuthHeader: ", authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    console.log("Token: ", token);
    jwt.verify(token, publicKey, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
});

app.get("/protected/data", (req, res) => {
  res.json({ data: "This is protected data" });
});

app.listen(appPort, () => {
  console.log(`Resource server listening on port ${appPort}`);
});
