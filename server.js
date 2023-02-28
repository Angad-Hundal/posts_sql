const express = require('express')
const bodyParser = require('body-parser');
const mysql = require("mysql");
var path = require("path");


const PORT = 4000
const app = express()
const HOST = '127.0.0.1';



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// create connection with mysql
const connection = mysql.createPool({
    host: 'localhost', 
    user: 'root',
    password: '12345'
});



app.get('/', (req, res) => {
    res.redirect("/posting.html");
})


app.get('/init', (req, res) => {

    // create a databse named postdb
    connection.query('CREATE DATABASE postdb', (error, results, fields) => {
        if (error) {
            console.log(error);
        } 
        else {
            console.log('Database created successfully');}
    });


    const sql = `
        CREATE TABLE IF NOT EXISTS postdb.posts (
        id INT(11) NOT NULL AUTO_INCREMENT,
        data VARCHAR(255) NOT NULL,
        topic VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `;

    connection.query(sql, (error, results, fields) => {
        if (error) {
            console.log(error);
        } 
        else {
            console.log('Table created successfully');
        }
    });

})



// handle the request for adding post to mysql
app.post('/addPost', (req, res) => {
    
    var data = req.body.data;
    var topic = req.body.topic;
    var timestamp = req.body.timestamp;

  
    connection.getConnection((err, connection) => {
      if (err) throw err;
      console.log("CONNECTION ESTABLISHED")
  
      connection.query(`INSERT INTO postdb.posts (data, topic) VALUES ('${data}','${topic}')`, (err, rows) => {
        connection.release();
  
        if (err) {
          console.log(err);
        }
      })
    })
})



// get all the values from table
app.get('/getPosts', (req, res) => {

    console.log("CONNECTED GET POSTS");
  
    connection.getConnection((err, connection) => {
  
      if (err) throw err;
      console.log("CONNECTION ESTABLISHED");
  
      connection.query('SELECT * FROM postdb.posts', (err, rows) => {
        connection.release();
  
        if (!err) {
          res.send({ rows });
        }
        else {
          console.log(err);
        }
      })
    })
})



app.use('/', express.static(__dirname));

app.listen(PORT, () => { console.log(`Server running on port: ${PORT}`) });