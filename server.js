'use strict';

const cors = require('cors');
const fs = require('fs');
const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

const connectionString = process.env.DATABASE_URL;
const client = new pg.Client(connectionString);
client.connect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('DATABASE_URL', function(request, response) {
  client.query('SELECT * FROM DATABASE_URL;')
    .then(function(data) {
      response.send(data);
    })
    .catch(function(err) {
      console.error(err);
    });
});

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

function seedBooks() {
  fs.readFile('./book-list-client/data/book.json', function(err, fd) {
    JSON.parse(fd.toString()).forEach(function(ele) {
      client.query(
        'INSERT INTO books(title, author, isbn, image_url, description) VALUES($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        [ele.title, ele.author, ele.isbn, ele.image_url, ele.description]
      )
    })
  })
}


app.get('/', (req, res) => {
  res.send('Test');
})


app.listen(PORT, () => {
  console.log('Listening on PORT: ', PORT);
})

seedBooks();