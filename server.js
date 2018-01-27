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
const conString = 'postgres://localhost:5432/books_app';
//const connectionString = process.env.DATABASE_URL;
console.log('connectionString: ',conString);
const client = new pg.Client(conString);

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

app.get('/v1/books', function(req, res) {
  // console.log('app.get /v1/books');
  client.query('SELECT * FROM books;')
    .then(function(data) {
      res.send(data.rows);
    })
    .catch(function(err) {
      console.error(err);
    });
});

app.get('/v1/books/:book_id', function (req,res) {
  // console.log(req);
  client.query(`SELECT * FROM books WHERE book_id = ${req.params.book_id};`)
    .then(function(data){
      res.send(data.rows);
    })
    .catch(function(err) { 
      console.log(err);
    });
});

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
      res.redirect('/books');
    })
    .catch(function(err) {
      console.error(err)
    })
})

// DELETE
app.delete('/v1/books/:book_id', function(req, res) {
  console.log(req.params.book_id);
  client.query(`DELETE FROM books WHERE book_id=$1`,
    [req.params.book_id]
  )
    .then(() => res.send('Delete complete'))
    .catch(console.error);
});

// UPDATE/PUT
app.put('/v1/books/:book_id/edit', function(req, res) {
  console.log(req.body);
  client.query(`UPDATE * FROM books WHERE book_id = ${req.params.book_id};`)
    .then(() => {
      client.query(`
      UPDATE books
      SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5
      WHERE book_id = $6
      `,
        [
          req.body.title,
          req.body.author,
          req.body.isbn,
          req.body.image_url,
          req.body.description,
          req.params.book_id
        ]
      )
    })
    .then(() => res.send('Update complete'))
    .catch(console.error);
});

createTable();

app.listen(PORT, () => {
  console.log('SERVER started on port:', PORT);
});

function createTable() {
  client.query(`
    CREATE TABLE IF NOT EXISTS books(
      book_id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      author VARCHAR(255),
      isbn VARCHAR(255),
      image_url VARCHAR(255),
      description TEXT NOT NULL
    );`
  )
}