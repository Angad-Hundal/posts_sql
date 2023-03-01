// load package
const express = require('express');
const mysql = require('mysql');
const bodyParser = require("body-parser");

const PORT = 3000;
const HOST = '0.0.0.0';
const app = express();
app.use( bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




//Database Connection
const connection = mysql.createConnection({
    // host: '0.0.0.0'/localhost: Used to  locally run app
    host: "mysql1",
    user: "root",
    password: "admin"
  });

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
  }); 



// direct it to given page
app.get('/', (req, res) => {
    res.redirect("/posting.html");
})



// make a database and table if they already not exists
app.get('/init', (req, res) => {
    connection.query(`CREATE DATABASE IF NOT EXISTS postdb`,function (error,result) {
        if (error) console.log(error) });
    //Create Table
    connection.query(`USE postdb`,function (error, results) {
        if (error) console.log(error);
    });
    connection.query(`CREATE TABLE IF NOT EXISTS posts 
    ( id int unsigned NOT NULL auto_increment, 
    topic varchar(100)NOT NULL,
    data varchar(100) NOT NULL,
    PRIMARY KEY (id))`, function (error,result) {
        if (error) console.log(error)});
        res.send('Database and Table created!')
}); 




// add a post to posts table
app.post('/addPost', (req,res) => {
    var topic = req.body.topic;
    var data = req.body.data;
    var query = `INSERT INTO posts (topic, data) VALUES ("${topic}", "${data}")`;
    connection.query(query, function (error,result) {
        if (error) console.log(error);
        res.send('New post inserted');
    });
});





// get all posts from table
app.get('/getPosts', (req, res) => {
    const sqlQuery = 'SELECT * FROM posts';
    connection.query(sqlQuery, function (error,result) {
        if (error) console.log(error);
        res.json({ 'posts': result});
    });
});




 //serves the static files in the public folder
app.use('/', express.static('public'));
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);