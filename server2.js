var express = require("express");
var app = express();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
var nodemailer = require("nodemailer");
var http=require('http');
var server = http.Server(app);
app.use(express.static("static"));
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/" + "home.html");
});
app.get("/register", function (req, res) {
  console.log("register page");
  res.sendFile(__dirname + "/" + "reg.html");
});

app.get("/post_register", function (req, res) {
  console.log("post register function");
  let sql = `insert into student values("${req.query.name}","${req.query.usn}","${req.query.gender}","${req.query.email}","${req.query.dept}",${req.query.sem})`;
  let db = new sqlite3.Database("studentdb");
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row.name);
    });
  });
  console.log(req.query.usn + "has registered");

  let sql1 = `select * from student`;

  db.all(sql1, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row.Name + "\t\t" + row.USN);
    });
  });
  db.close();
  var transporter = nodemailer.createTransport({
    service: "yahoo",
    auth: {
      user: "niket247@yahoo.com",
      pass: "bgbotxaimqmufgmi",
    },
  });

  var mailOptions = {
    from: "niket247@yahoo.com",
    to: req.query.email,
    subject: "Registration",
    text: "you have successfullly registered\nstay tuned for updates",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.status(200).send("Registration Successful");

  //console.log(response);
});

app.get("/view", function (req, res) {
  let db = new sqlite3.Database("studentdb");
  let sql1 = `select * from student`;

  db.all(sql1, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      console.log(row.Name + "\t\t" + row.USN + "\t\t" + row.school);
    });
    res.send(rows);
  });
  db.close();
  //res.status(200).send("display Successful");

  //console.log(response);
});

app.get("/delete", function (req, res) {
  console.log("delete page");
  res.sendFile(__dirname + "/" + "delete.html");
});

app.get("/post_delete", function (req, res) {
  let db = new sqlite3.Database("studentdb");
  let sql_delete = `delete from student where usn = "${req.query.usn}"`;
  db.run(sql_delete, function (err) {
    if (err) {
      return res.sendFile(__dirname + "/" + "error.html");
    }
	console.log(`Row(s) updated: ${this.changes}`);
	res.status(200).send("USN " + req.query.usn + " Deleted");
  });
  db.close();
  
});

// app.listen(process.env.PORT,function(){
//     console.log("We have started our server on port 3000");
// 	//res.sendFile(__dirname+"/"+"home.html")
// 	//app.get('/', (req, res) => res.render('home.html'))
// });

 app.listen(3000,function(){
     console.log("We have started our server on port 3000");
 	//res.sendFile(__dirname+"/"+"home.html")
 	//app.get('/', (req, res) => res.render('home.html'))
 });

