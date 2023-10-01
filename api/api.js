var Book = require("./models");
const db = require("./index");

const { ZingMp3 } = require("zingmp3-api-full");
const { Nuxtify } = require("nuxtify-api");

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);

router.use((request, response, next) => {
  console.log("middleware");
  next();
});

router.route("/zing").get((request, response) => {
  ZingMp3.getTop100().then((result) => response.json(result.data[3].items));
});

router.route("/album").get((request, response) => {
  ZingMp3.getHome().then((result) => response.json(result.data));
});

router.route("/podcast").get((request, response) => {
  Nuxtify.song
    .getSongUrl("Z6FU0CA9")
    .then((result) => response.json(result.data));
});

router.route("/home").get((request, response) => {
  Nuxtify.getHome().then((result) => response.json(result.data));
});

router.route("/artist/:name").get((request, response) => {
  const name = request.params.name;
  Nuxtify.getArtist(name).then((result) => response.json(result));
});

router.route("/books").get((request, response) => {
  db.getBooks().then((result) => {
    response.json(result[0]);
  });
});

router.route("/books/:id").get((request, response) => {
  db.getBook(request.params.id).then((result) => {
    response.json(result[0]);
  });
});

router.route("/books").post((request, response) => {
  let book = { ...request.body };
  db.addBook(book).then((result) => {
    response.status(201).json(result);
  });
});

router.route("/users").get((request, response) => {
  const res = db.getUsers().then((result) => {
    response.json(result[0]);
  });
  return res;
});

router.route("/users/:email/:pass").get((request, response) => {
  const email = request.params.email;
  const pass = request.params.pass;

  db.getUser(email, pass).then((result) => {
    response.json(result[0]);
  });
});

router.route("/users").post((request, response) => {
  let user = { ...request.body };
  db.addUser(user).then((result) => {
    response.status(201).json(result);
  });
});

var port = process.env.PORT || 8090;
app.listen(port);
console.log("Book API listening on port " + port);
