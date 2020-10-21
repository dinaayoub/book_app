# Book App

**Author**: Dina Ayoub
**Version**: 1.0.0 

## Overview
<!-- Provide a high level overview of what this application is and why you are building it, beyond the fact that it's an assignment for a Code 301 class. (i.e. What's your problem domain?) -->

## Getting Started
<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->

## Architecture
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. -->
### Dependencies
* express
* pg
* dotenv
* ejs
* cors


### Database Architecture
Database name: book_app
Database schema:
    table: books
    columns:
        id SERIAL PRIMARY KEY,
        author VARCHAR(255),
        title VARCHAR(255),
        isbn  VARCHAR(255),
        image_url  VARCHAR(255),
        description TEXT

## Change Log

10/20/2020 5:42pm - App now retrieves saved books from the database.
<!-- Use this area to document the iterative changes made to your application as each feature is successfully implemented. Use time stamps. Here's an examples:

01-01-2001 4:59pm - Application now has a fully-functional express server, with GET and POST routes for the book resource.
-->

## Credits and Collaborations

Collaboration with Ryan Pilon for lab 11. 
<!-- Give credit (and a link) to other people or resources that helped you build this application. -->

Links:
[Used to build navigation bar](https://www.w3schools.com/howto/howto_js_mobile_navbar.asp)

## Features

Number and name of feature: Lab 11 - #1 Setup

Estimate of time needed to complete: 1 hr

Start time: 1:00

Finish time: 2:00

Actual time needed to complete: 1hr

-----------------------------------------------------------------------------------------

Number and name of feature: Lab 11 - #2 - Search

Estimate of time needed to complete: 30min

Start time: 2:05

Finish time: 2:25

Actual time needed to complete: 20 min

-----------------------------------------------------------------------------------------

Number and name of feature: Lab 11 - #3 to 6- Get Results

Estimate of time needed to complete:

Start time: 2:35

Finish time: 9 pm

Actual time needed to complete: 4 hours with a 2.5 hour break

-----------------------------------------------------------------------------------------

Number and name of feature: Lab 12 - #1 Index shows saved books

Estimate of time needed to complete: 30min

Start time: 5:09 pm

Finish time: 5:41 pm

Actual time needed to complete: 32 min

-----------------------------------------------------------------------------------------

Number and name of feature: Lab 12 - #2 View Details

Estimate of time needed to complete: 60min

Start time: 6:00 pm

Finish time: 7:15 pm

Actual time needed to complete: 75 min

-----------------------------------------------------------------------------------------

Number and name of feature: Lab 13 - #1 Update book

Estimate of time needed to complete: 60 min

Start time: 11:45

Finish time: _____

Actual time needed to complete: _____