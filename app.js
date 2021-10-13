const feedRoutes = require("./routes/feed");

const express = require("express");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
	res.setHeader("ACCESS-CONTROL-ALLOW-ORIGIN", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use("/feed", feedRoutes);

app.listen(8080);
