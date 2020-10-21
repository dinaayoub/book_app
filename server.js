'use strict';

//pull in dependencies
const express = require('express');
const env = require('dotenv');
const app = express();
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');

//server side configuration
env.config();
const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);

//front end configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

//connect to the database
client.connect();
//if there are any errors, log them
client.on('error', error => handleErrors(error));

//handle application routes
app.get('/', getAllBooks);
app.get('/books/:id', getBookDetails);
app.put('/books/:id', updateBook);
app.get('/books/edit/:id', getBookDetailsForEditing);
app.delete('/books/:id', deleteBook);

app.get('/searches', (req, res) => {
  res.render('pages/searches/show', { booksArray: booksArray });
});

app.get('/searches/new', (req, res) => {
  res.render('pages/searches/new');
});

app.post('/searches', createSearch);

app.post('/books', saveBook);



var booksArray = [];

function getBookDetails(req, res) {
  let SQL = `SELECT * FROM books WHERE id=$1`;
  let values = [req.params.id];
  client.query(SQL, values)
    .then(result => {
      res.render('pages/books/show', { book: result.rows[0], page: 'oneBookDetails' })
    })
    .catch(error => handleErrors(error,res));
}

function getBookDetailsForEditing(req, res) {
  let SQL = `SELECT * FROM books WHERE id=$1`;
  let values = [req.params.id];
  client.query(SQL, values)
    .then(result => {
      res.render('pages/books/edit', { book: result.rows[0], page: 'updateBook' })
    })
    .catch(error => handleErrors(error,res));
}

function getAllBooks(req, res) {
  let SQL = 'SELECT * FROM books ORDER BY id DESC';
  client.query(SQL)
    .then(results => {
      res.render('pages/index', { books: results.rows, page: 'allBooks' });
    })
    .catch(error => handleErrors(error));
}

function saveBook(req, res) {
  let { index } = req.body;
  let currentBook = booksArray[index];
  let SQL = 'INSERT INTO books (image_url,title,author,description,isbn,shelf) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id;';
  let values = [currentBook.image_url, currentBook.title, currentBook.author, currentBook.description, currentBook.isbn, 'fantasy'];
  client.query(SQL, values)
    .then(data => {
      req.params.id = data.rows[0].id;
      getBookDetails(req, res);
    })
    .catch(error => handleErrors(error,res));
}

function updateBook(req, res) {
  let { title, author, description, isbn, shelf } = req.body;
  let id = req.params.id;
  let values = [title, author, description, isbn, shelf, id];
  let SQL = `UPDATE books SET title = $1, author = $2, description = $3, isbn = $4, shelf = $5  WHERE id=$6`;
  client.query(SQL, values)
    .then(() => {
      getBookDetails(req, res);
    })
    .catch(error => handleErrors(error));
}

function deleteBook(req, res) {
  let id = req.params.id;
  let values = [id];
  let SQL = `DELETE FROM books WHERE id=$1`
  client.query(SQL, values)
    .then(() => {
      res.redirect('/');
    })
    .catch(error => handleErrors(error,res));
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
      if (data.body.items) {
        booksArray=data.body.items.map((item,i) => new Book(item, i));
        res.render('pages/searches/show', { booksArray: booksArray, page: 'search' });
      }
      else handleErrors(new Error('No results found'),res);
    })
    .catch(error => handleErrors(error, res));
}

function handleErrors(error, res) {
  if (!error.message) error = new Error('page not found');
  console.error(error);
  res.render('pages/error', { error: error });
}

app.get('*', handleErrors);

app.listen(PORT, () => {
  console.log('server is up at ' + PORT);
});

function Book(bookData, index) {
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

  this.author = bookData.volumeInfo.authors ? bookData.volumeInfo.authors.reduce((acc, curr) => {
    acc += curr + ', ';
    return acc;
  }, '') : `Book Authors Unknown  `;
  //removing the trailing comma and space
  this.author = this.author.substring(0, this.author.length - 2);

  this.description = bookData.volumeInfo.description ? bookData.volumeInfo.description : `Book Description Unknown`;
  this.isbn = bookData.volumeInfo.isbn ? bookData.volumeInfo.isbn : `ISBN Unknown`;
  this.shelf = 'fantasy';
  this.index = index;
}

