require("dotenv").config();

const MONGO_CONNECT_URL = process.env.MONGO_CONNECT_URL;

const feedRoutes = require("./routes/feed");

const path = require("path");

const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("ACCESS-CONTROL-ALLOW-ORIGIN", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message;
    
    res.status(statusCode).json({
        message: message
      })
});

mongoose
  .connect(MONGO_CONNECT_URL)
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
