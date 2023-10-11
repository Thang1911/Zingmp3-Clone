const db = require("./index");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const router = require("./router");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/", router);

router.use((request, response, next) => {
  console.log("middleware next");
  next();
});


const port = process.env.PORT || 8090;
app.listen(port);
console.log("ZingMp3 API listening on port " + port);
