'use strict';

const express = require('express');

const env = require('dotenv');

const app = express();

env.config();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(express.static('./public'));

const superagent = require('superagent');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err=> console.error(err));

const PORT = process.env.PORT || 3000;

app.get('/hello', (req, res) => {
  res.render('pages/index');
});

app.get('/', (req, res) => {
  let SQL = 'SELECT * FROM book;';
  return client.query(SQL)
    .then(data => {
      if (data.rows.count === 0) {
        res.render('pages/searches/new');
      } else {
        console.log('===========');
        res.render('pages/index', ({ result: data.rows }));
      }
    })
    .catch(err => console.log('error', err));
});

app.get('/searches', (req, res) => {
  res.render('pages/searches/show', {
    booksArray: booksArray
  });
});

app.get('/searches/new', (req, res) => {
  res.render('pages/searches/new');
});
app.post('/searches', createSearch);

app.get('*', (req, res) => {
  res.render('pages/error', { error: new Error('Page not found') });
});

var booksArray = [];

function createSearch(req, res) {
  let url = 'https://www.googleapis.com/books/v1/volumes?maxResults=10&projection=full&q=';
  if (req.body.search[1] === 'title') {
    url += `+intitle:${req.body.search[0]}`;
  }
  if (req.body.search[1] === 'author') {
    url += `+inauthor:${req.body.search[0]}`;
  }
  superagent.get(url)
    .then(data => {
      data.body.items.map((item) => booksArray.push(new Book(item)));
      res.render('pages/searches/show', { booksArray: booksArray });
    })
    .catch(err => {
      console.error(err);
      res.render('pages/error', { error: err });
    });
}

app.listen(PORT, () => {
  console.log('server is up at ' + PORT);
});

function Book(bookData) {
  console.log(bookData);
  if (bookData.volumeInfo.imageLinks && bookData.volumeInfo.imageLinks.thumbnail) {

    if (!bookData.volumeInfo.imageLinks.thumbnail.startsWith('https')) {
      this.img = bookData.volumeInfo.imageLinks.thumbnail.replace('http', 'https');
    }
    else {
      this.img = bookData.volumeInfo.imageLinks.thumbnail;
    }
  }
  else {
    this.img = `https://i.imgur.com/J5LVHEL.jpg`;
  }
  this.title = bookData.volumeInfo.title ? bookData.volumeInfo.title : `Book Title (Unknown)`;
  this.author = bookData.volumeInfo.authors ? bookData.volumeInfo.authors : `Book Authors Unknown`;
  this.description = bookData.volumeInfo.description ? bookData.volumeInfo.description : `Book description unavailable`;
}

