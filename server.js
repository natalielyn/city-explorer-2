'use strict'

//Application dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const PORT = process.env.PORT;
const app = express();
app.use(cors());

//Configure Database
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('err', err => console.error(err));

//Homepage route
function getHome(request, response) {
  response.status(200).send('Welcome to the home page!')
}
//Error handler
function notFoundHandler(request,response) {
  response.status(404).send('huh?');
};
function errorHandler(error,request,response) {
  response.status(500).send(error);
};
//MIDDLEWARE
app.use('*', notFoundHandler);
app.use(errorHandler);

//REQUIRE API ROUTES
const getLocation = require('./routes/location.js');

//API ROUTES
app.get('/', getHome);
app.get('/location', getLocation);
// app.get('/weather', getWeather);
// app.get('/movies', getMovies);
// app.get('/reviews', getYelp);




//Server listening
app.listen(PORT, ()=> {
  console.log('server and db are up, listening on port ', PORT);
});