'use strict';

//pull in 3rd party dependancies
require('dotenv').config();

const methodOverride = require('method-override');//this will "fake" a PUT/DELETE request on the browser
const express = require('express')
const pg = require('pg');

//setup server constants
const client = new pg.Client(process.env.DATABASE_URL);
//database config
client.connect();
client.on('error', err => console.log(err));

app.get('/', getTasks)//this is homepage shows all tasks
app.get('/tasks/:task_id', getOneTask);//this is the individual task detil page
//req.params.task_id is path for above
app.post('/add', addTask);//this is meant to handle our post request for a new task
app.get('/add', showForm);

//TODO create a route to put(update) a task
app.put('/update/:task_id', updateTask);
app.use(methodOverride('_method'))
//functions are hoisted to top at runtime
function updateTask(req, res) {
  let { title, description, category, contact, status } = req.body;
  let sql = `UPDATE tasks SET title=$1, description =$2, category=$3, contact=$4, status=$5 WHERE task_id=$6`;
  let values = [title, description, category, contact, status, req.params.task_id];

  client.query(sql, values)
    .then(res.redirect(`/tasks/${req.params.task_id}`))
    .catch(err => console.error(err));
}

