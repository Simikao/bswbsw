const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const appPort = 4000;

// Middleware to protect resources
app.use("/protected", (req, res, next) => {
	const authHeader = req.headers["authorization"];
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		jwt.verify(token, "YOUR_PUBLIC_KEY", (err, user) => {
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
