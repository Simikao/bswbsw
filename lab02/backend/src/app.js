const express = require('express');
const app = express();
const port = 3000;

// Parse JSON requests
app.use(express.json());

// Register routes

app.get("/", (req, res) => {
	// ... kod dla obszaru publicznego ...
	res.send('HELLO WORLD');
});


// Start the server
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
