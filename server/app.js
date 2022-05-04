const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/users");
const businessRoutes = require("./routes/business");
const appointmentRoutes = require("./routes/appointments");
const commentsRoutes = require("./routes/comments");
require("dotenv").config();
const path = require("path");
const cors = require("cors");

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());
app.use(express.static(path.join("build")));

app.use("/api/user", usersRoutes);
app.use("/api", businessRoutes);
app.use("/api", appointmentRoutes);
app.use("/api/", commentsRoutes);

app.use((req, res, next) => {
  return res.status(404).send({ message: "Could not find this route" });
});

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.m00dk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )

  .then(() => {
    app.listen(process.env.PORT || 5000);
    console.log("Listening...");
  })
  .catch((err) => {
    console.log(err);
    return new Error("Could not connect to database");
  });
