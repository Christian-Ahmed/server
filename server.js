'use strict';

const cors = require('cors');
const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT;

const connectionString = process.env.DATABASE_URL;
const client = new pg.Client(connectionString);
client.connect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/db/person', function(request, response) {
  client.query('SELECT * FROM persons;')
  .then(function(data) {
    response.send(data);
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.post('/db/person', function(request, response) {
  client.query(`
    INSERT INTO persons(name, age, ninja)
    VALUES($1, $2, $3);
    `,
    [
      request.body.name,
      request.body.age,
      request.body.ninja
    ]
  )
  .then(function(data) {
    response.redirect('/');
  })
  .catch(function(err) {
    console.error(err);
  });
});

app.listen(PORT, () => {
  console.log('Listening on PORT: ', PORT);
})