require("dotenv").config();

const MONGO_CONNECT_URL = process.env.MONGO_CONNECT_URL;

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const imageFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const app = express();

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({ storage: fileStorage, fileFilter: imageFilter }).single("image")
);

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
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(statusCode).json({
    message: message,
    data: data,
  });
});

mongoose
  .connect(MONGO_CONNECT_URL)
  .then((result) => {
    console.log("CONNECTED TO MONGODB");
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
