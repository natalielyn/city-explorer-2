'use strict';
// DEPENDENCIES ------------------------------------
const superagent = require('superagent');
const pg = require('pg');

//LOCATION CONSTRUCTOR FUNCTION ---------------------
function Location(query, data){
  this.search_query = query;
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
};
