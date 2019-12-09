'use strict';

require('dotenv').config();

//Dependencies and setup
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const PORT = process.env.PORT;
const app = express();
app.use(cors());

//Configure Database
const client = new pg.Client(process.env.DATABASE_URL);
client.on('err', err => console.error(err));

//HOMEPAGE 
function getHome(request,response) {
  response.status(200).send('Welcome to the Home Page')
}

//Errors
function notFoundHandler(request,response) {
  response.status(404).send('huh?');
};
function errorHandler(error,request,response) {
  response.status(500).send(error);
};

//REQUIRE API MODULES
const getWeather = require('./routes/weather');
const Location = require('./routes/location');
const getMovies = require('./routes/movies.js');
// const getYelp = require('./routes/reviews.js');

// API ROUTES 
app.get('/', getHome);
app.get('/location', Location);
app.get('/weather', getWeather);
app.get('/movies', getMovies);
// app.get('/reviews', getYelp);



//MIDDLEWARE
app.use('*', notFoundHandler);
app.use(errorHandler);

// Make sure the server is listening for requests
client.connect();
app.listen(PORT, ()=> {
  console.log('Listening on port ', PORT);
});