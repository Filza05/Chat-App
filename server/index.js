const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Router } = require("./routes/Routes");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = 4000;
const CONNECTION_URL = process.env.CONNECTION_URL;

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000"
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(Router);

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
