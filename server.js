'use strict'

//Application dependencies
require('dotenv').config();
const cors = require('cors');
const superagent = require('superagent');
const express = require('express');
const app = express();
const pg = require('pg')

app.use(cors());

//Configure Database
const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);

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

//API Routes

//Constructors


//Server listening
app.listen(PORT, () => console.log('Server is up and listening on PORT ${PORT}'));