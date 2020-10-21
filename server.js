'use strict';

//pull in dependencies
const express = require('express');
const env = require('dotenv');
const app = express();
const pg = require('pg');
const superagent = require('superagent');

//server side configuration
env.config();
const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);

//front end configuration
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

//connect to the database
client.connect();
//if there are any errors, log them
client.on('error', error => console.error(error));

//handle application routes
app.get('/', getAllBooks);
app.get('/books/:id', getBookDetails);

app.get('/searches', (req, res) => {
  res.render('pages/searches/show', {
    booksArray: booksArray
  });
});

app.get('/searches/new', (req, res) => {
  res.render('pages/searches/new');
});

app.post('/searches', createSearch);

app.post('/books', saveBook);

app.get('*', (req, res) => {
  res.render('pages/error', handleErrors(res, new Error('Page not found')));
});

var booksArray = [];

function getBookDetails(req, res) {
  let SQL = `SELECT * FROM books WHERE id=$1`;
  let values = [req.params.id];
  client.query(SQL, values)
    .then(result => {
      res.render('pages/books/show', { book: result.rows[0], page: 'oneBookDetails' })
    })
    .catch(error => handleErrors(res, error));
}
function getAllBooks(req, res) {
  let SQL = 'SELECT * FROM books ORDER BY id DESC';
  client.query(SQL)
    .then(results => {
      res.render('pages/index', { books: results.rows, page: 'allBooks' });
    })
    .catch(error => handleErrors(res, error));
}

function saveBook(req, res) {
  let {index} = req.body;
  let currentBook=booksArray[index];
  let SQL = 'INSERT INTO books (image_url,title,author,description,isbn,shelf) VALUES ($1,$2,$3,$4,$5,$6)'
  let values = [currentBook.image_url,currentBook.title,currentBook.author,currentBook.description,currentBook.isbn, 'fantasy'];
  client.query(SQL, values)
    .then(() => {
      getAllBooks(req, res);
    })
    .catch(error => handleErrors(res, error));
}

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
      var i=0;
      data.body.items.map((item) => {
        booksArray.push(new Book(item,i));
        i++;
      });
      res.render('pages/searches/show', { booksArray: booksArray, page: 'search' });
    })
    .catch(error => handleErrors(res, error));
}

function handleErrors(res, error) {
  console.error(error);
  res.render('pages/error', { error: error });
}
app.listen(PORT, () => {
  console.log('server is up at ' + PORT);
});

function Book(bookData,index) {
  //check if the volume has imagelinks, and if it does, check if it has a thumbnail before we try to string manipulate
  if (bookData.volumeInfo.imageLinks && bookData.volumeInfo.imageLinks.thumbnail) {
    if (!bookData.volumeInfo.imageLinks.thumbnail.startsWith('https')) {
      this.image_url = bookData.volumeInfo.imageLinks.thumbnail.replace('http', 'https');
    }
    else {
      this.image_url = bookData.volumeInfo.imageLinks.thumbnail;
    }
  } //no image provided for this book, so use the default image
  else {
    this.image_url = `https://i.imgur.com/J5LVHEL.jpg`;
  }
  this.title = bookData.volumeInfo.title ? bookData.volumeInfo.title : `Book Title Unknown`;

  this.author = bookData.volumeInfo.authors ? bookData.volumeInfo.authors.reduce((acc,curr) => {
    acc += curr +', ';
    return acc;
  },'' ) : `Book Authors Unknown  `;
  //removing the trailing comma and space
  this.author = this.author.substring(0,this.author.length - 2);

  this.description = bookData.volumeInfo.description ? bookData.volumeInfo.description : `Book Description Unknown`;
  this.isbn = bookData.volumeInfo.isbn ? bookData.volumeInfo.isbn : `ISBN Unknown`;
  this.shelf = 'fantasy';
  this.index = index;
}

