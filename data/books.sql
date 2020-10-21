DROP TABLE IF EXISTS book;

CREATE TABLE book(
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  description TEXT,
  img VARCHAR(255),
  isbn VARCHAR(255)
);

INSERT INTO book(author, title, description, img, isbn)
  VALUES('author', 'title', 'description', 'https://i.imgur.com/J5LVHEL.jpg', 9999123456);

INSERT INTO book(author, title, description, img, isbn)
  VALUES('Dune', 'Frank Herbert', 'Follows the adventures of Paul Atreides, the son of a betrayed duke given up for dead on a treacherous desert planet and adopted by its fierce, nomadic people, who help him unravel his most unexpected destiny.', 'http://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api', 'ISBN_13 9780441013593');