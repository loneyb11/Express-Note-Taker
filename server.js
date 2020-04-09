var express = require("express");
var path = require("path");
var fs = require('fs');

// Set up Express App
var app = express();
var PORT = process.env.PORT || 3000;  

// for parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const db = require('./db.json');

  app.get("/", function(req, res) {
    res.json(path.join(__dirname, "/public/index.html"));
  });

  app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });
  
  app.get("/api/notes", function(req, res) {
    return res.json(db);
  });
  
app.post("/api/notes", function(req, res) {
    var newNote = req.body;
    newNote.id = parseInt(db[db.length-1].id)+1;
    console.log(newNote);
    db.push(newNote);
   
    fs.writeFile('db.json', JSON.stringify(db), (suc, err) => {
      if (err) { 
        return console.log(err);
      }
    });
  
    res.json(newNote);
  });
  
  app.delete('/api/notes/:id',(req, res) => {
    const id = req.params.id;
    console.log(id);
    const noteDelete = db.findIndex(element => parseInt(element.id)=== parseInt(id));
    db.splice(noteDelete, 1);
    fs.writeFile('db.json', JSON.stringify(db), (suc, err) => {
      if (err) { 
        return console.log(err);
      }
      res.sendStatus(200);
    });
  });

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
