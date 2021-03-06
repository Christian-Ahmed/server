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
// const conString = 'postgres://localhost:5432/books_app';
const connectionString = process.env.DATABASE_URL;
console.log('connectionString: ',connectionString);
const client = new pg.Client(connectionString);

// connect to database
client.connect();

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// get books
app.get('/api/v1/books', (req, res) => {
  console.log('getting books')
  client.query('SELECT book_id, author, title, isbn, description FROM books;')
    .then(result => res.send(result.rows));
})

// get singular book
app.get('/api/v1/books/:id', (req, res) => {
  client.query(
    `SELECT * FROM books WHERE book_id = ${req.params.book_id};`)
    .then(function(data){
      res.send(data.rows);
    })
    .catch(function(err){
      console.error(err);
    })
})

// create book record
app.post('/v1/books', (req, res) => {
  client.query(`INSERT INTO books (author, title, img_url, isbn, description) VALUES ($1, $2, $3, $4, $5);`, 
    [
      req.body.author,
      req.body.title,
      req.body.img_url,
      req.body.isbn,
      req.body.description,
    ])
    .then(function(data) {
      res.send('Book added');
    })
    .catch(function(err) {
      console.error(err)
    })
})

// delete a book record
app.delete('/v1/books/:book_id', (req, res) => {
  console.log(req.params.book_id);
  client.query(`DELETE FROM books WHERE book_id=$1`,
    [req.params.book_id])
    .then(() => res.send('Successfully deleted'))
    .catch(function(err){
      console.error(err)
    })
})

app.put('/v1/books/:book_id', (req, res) => {
  client.query(`UPDATE * FROM books WHERE book_id = ${req.params.book_id};`)
    .then(() => {
      client.query(`
      UPDATE books
      SET author=$1, title=$2, isbn=$3, image_url=$4, description=$5
      WHERE book_id = $6
      `,
        [
          req.body.author,
          req.body.title,
          req.body.isbn,
          req.body.image_url,
          req.body.description,
          req.params.book_id
        ]
      )
    })
    .then(() => {
      res.send('Update successful')
    })
    .catch(function(err){
      console.error(err);
    })
})

app.listen(PORT, () => {
  console.log('Listening on PORT: ', PORT);
}) 