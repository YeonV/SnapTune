const express = require('express');
const request = require('request');
const fetch = require("node-fetch");
const bodyParser = require('body-parser');

const app = express();
const port = 3001;
app.use(bodyParser.json());

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

app.get("/get", (req, res, next) => {  
  request.get("http://192.168.1.56:1337/v2", (err, response, body) => {
    if (err) {
        return next(err);
    }
    res.send(body);
  });
});
app.get("/vol/:id/:vol", (req, res, next) => {  
  request.get(`http://192.168.1.56:1337/v2/${req.params.id}/Volume/${req.params.vol}`, (err, response, body) => {
    if (err) {
        return next(err);
    }
    res.send(body);
  });
});
app.get("/stat/:id/:stat", (req, res, next) => {  
  console.log(req.params.id, req.params.stat)
  request.get(`http://192.168.1.56:1337/v2/${req.params.id}/Status/${req.params.stat}`, (err, response, body) => {
    if (err) {
        return next(err);
    }
    res.send(body);
  });
});

app.post("/snap/get", (req, res, err) => {  
  console.dir(req.body)
  request.post("http://192.168.1.204:1780/jsonrpc", {headers: req.headers, body:JSON.stringify(req.body)},(err, response, body) => {
    if (err) {
        return next(err);
    }
    console.log("YZ", body)
    if (body) {
      res.json(body)
    }
  });
});
app.listen(port, () => console.log(`http://localhost:${port}`));