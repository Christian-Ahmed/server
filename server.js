'use strict';

const cors = require('cors');
const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

const connectionString = 'postgres://jwgwshirxcmdod:e69125df1cf81cc7e55e9ec8782829e58c32114b3e01ba99645b01029c53c79c@ec2-54-163-237-249.compute-1.amazonaws.com:5432/d9ur96v0cd5qio';
const client = new pg.Client(connectionString);
client.connect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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