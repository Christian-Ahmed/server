'use strict';

const cors = require('cors');
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

function loadBooks() {
  fs.readFile('../book-list-client/data/books.json', function(err, fd) {
    JSON.parse(fd.toString()).forEach(function(ele) {
      client.query(
        'INSERT INTO books(title, author, isbn, image_url, description) VALUES($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        [ele.title, ele.author, ele.isbn, ele.image_url, ele.description]
      )
    })
  })
}


app.listen(PORT, () => {
  console.log('Listening on PORT: ', PORT);
})