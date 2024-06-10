const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const appPort = 4000;

const publicKey =
  "-----BEGIN PUBLIC KEY-----\n" +
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0nunxQUgq+V0QVcgkU2s\n" +
  "B6QW+cjfX7/58SLbTW1Iuq8izuTm4zY9DbjmXhJXGoqSOhBcFxjP9XWrp0J/qCmU\n" +
  "h4a32EbaGLt/fxbp2/q5JCybxJIXExzLaljIZUvqX93YYyLOOgDxautm7kdiJWq5\n" +
  "tFwo2zGhLacGaWz7mti7KM52nMh9HAcpx/aqqyF8oFFCCpST0HbK/XQnSrJGgT5G\n" +
  "qQc2o3uzS4hcv/a9V57XbjpiBDqckHzvcdmyao8aQ7YYm2OhPvtJ/yBuRWZZkOFV\n" +
  "MI/1jobGjbmSUlEteLDpTJf/8kRGJfnvy0f252BYFOMrGNSKrWEaNGjX5F1Kegit\n" +
  "jQIDAQAB\n" +
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
