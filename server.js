'use strict';

// Require dependancies
const cors = require('cors');
const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');

// Initialize express, constring
const app = express();
const PORT = process.env.PORT || 3000;
process.env.DATABASE_URL = 'postgres://postgres:1234@localhost:5432/books_app';
const connectionString = process.env.DATABASE_URL;
console.log('connectionString: ',connectionString);
const client = new pg.Client(connectionString);

// connect to database
client.connect();

app.use(cors());
app.use(function(req, res, next) {
  res.header("Acess-Control-Allow_Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/v1/books', (req, res) => {
  client.query('SELECT book_id, author, title, img_url FROM books;')
    .then(result => res.send(result.rows));
})

// app.get('DATABASE_URL', function(request, response) {
//   client.query('SELECT * FROM DATABASE_URL;')
//     .then(function(data) {
//       response.send(data);
//     })
//     .catch(function(err) {
//       console.error(err);
//     });
// });

app.post('/books', (req, res) => {
  client.query(`INSERT INTO books (author, title, img_url, isbn, description) VALUES ($1, $2, $3, $4, $5);`, 
    [
      req.body.author,
      req.body.title,
      req.body.img_url,
      req.body.isbn,
      req.body.description,
    ])
    .then(function(data) {
      res.redirect('/books');
    })
    .catch(function(err) {
      console.error(err)
    })
})

app.listen(PORT, () => {
  console.log('Listening on PORT: ', PORT);
})