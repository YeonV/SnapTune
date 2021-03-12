const express = require("express");
const request = require("request");
const path = require("path");

const fetch = require("node-fetch");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = 8000;
app.use(bodyParser.json());
app.use(cors());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

app.get("/get", (req, res, next) => {
  request.get(
    `http://${process.env.REACT_APP_TUNEBLADE_ENDPOINT}/v2`,
    (err, response, body) => {
      if (err) {
        return next(err);
      }
      res.send(body);
    }
  );
});
app.get("/vol/:id/:vol", (req, res, next) => {
  request.get(
    `http://${process.env.REACT_APP_TUNEBLADE_ENDPOINT}/v2/${req.params.id}/Volume/${req.params.vol}`,
    (err, response, body) => {
      if (err) {
        return next(err);
      }
      res.send(body);
    }
  );
});
app.get("/stat/:id/:stat", (req, res, next) => {
  console.log(req.params.id, req.params.stat);
  request.get(
    `http://${process.env.REACT_APP_TUNEBLADE_ENDPOINT}/v2/${req.params.id}/Status/${req.params.stat}`,
    (err, response, body) => {
      if (err) {
        return next(err);
      }
      res.send(body);
    }
  );
});
app.get("/api/config", (req, res, next) => {
  res.json({ snap: process.env.REACT_APP_SNAPCAST_ENDPOINT });
});
app.get("/api/get", (req, res, next) => {
  request.get(
    `http://${process.env.REACT_APP_TUNEBLADE_ENDPOINT}/v2`,
    (err, response, body) => {
      if (err) {
        return next(err);
      }
      res.send(body);
    }
  );
});
app.get("/api/vol/:id/:vol", (req, res, next) => {
  request.get(
    `http://${process.env.REACT_APP_TUNEBLADE_ENDPOINT}/v2/${req.params.id}/Volume/${req.params.vol}`,
    (err, response, body) => {
      if (err) {
        return next(err);
      }
      res.send(body);
    }
  );
});
app.get("/api/stat/:id/:stat", (req, res, next) => {
  console.log(req.params.id, req.params.stat);
  request.get(
    `http://${process.env.REACT_APP_TUNEBLADE_ENDPOINT}/v2/${req.params.id}/Status/${req.params.stat}`,
    (err, response, body) => {
      if (err) {
        return next(err);
      }
      res.send(body);
    }
  );
});

app.listen(port, "0.0.0.0", () =>
  console.log(
    `http://localhost:${port} calling to ${process.env.REACT_APP_TUNEBLADE_ENDPOINT}`
  )
);
