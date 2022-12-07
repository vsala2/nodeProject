const path = require("path");

const http = require('http');

const fs = require('fs');

const PORT = 8080;

const { MongoClient } = require('mongodb');

const server = http.createServer(function (req, res) {
  console.log("Request for demo file received.", req.url);
  
   const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
      "Access-Control-Max-Age": 2592000, // 30 days
      /** add other headers as per requirement */
    };

  if (req.url === "/") {
    fs.readFile("./public/index.html", "UTF-8", function (err, html) {
      res.writeHead(200, { "Content-Type": "text/html" }, headers);
      res.end(html);
    });
  } 
  else if (req.url.match("\.css$")) {
    var cssPath = path.join(__dirname, 'public', req.url);
    var fileStream = fs.createReadStream(cssPath, "UTF-8");
    res.writeHead(200, { "Content-Type": "text/css" }, headers);
    fileStream.pipe(res);

  } 
  else if (req.url.match("\.png$")) {
    var imagePath = path.join(__dirname, 'public', req.url);
    var fileStream = fs.createReadStream(imagePath);
    res.writeHead(200, { "Content-Type": "image/png" });
    fileStream.pipe(res);
  }
  else if (req.url.match("\.jpg$")) {
    var imagePath = path.join(__dirname, 'public', req.url);
    var fileStream = fs.createReadStream(imagePath);
    res.writeHead(200, { "Content-Type": "image/jpg" });
    fileStream.pipe(res);
  }
  else if (req.url === '/api') {

    const url = 'mongodb+srv://vsala2:Vaishu123@webcluster.esu6am2.mongodb.net/?retryWrites=true&w=majority';
    const databasename = "db01"; // Database name
    MongoClient.connect(url).then((client) => {
      const connect = client.db(databasename);
      const collection = connect
        .collection("web");
      collection.find({}).toArray().then((ans) => {
        res.write(JSON.stringify(ans, null, 2), headers);
        res.end();
      });
    }).catch((err) => {
      console.log(err.Message);
    })
  }
  else{
    
    res.end(" 404: Nothing is Here");
  }
});


server.listen(PORT);
console.log('Server running at {{PORT}}');

