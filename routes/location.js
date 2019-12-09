'use strict';
//Application dependencies
require('dotenv').config();
const pg = require('pg');

//Configure Database
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('err', err => console.error(err));

//LOCATION CONSTRUCTOR FUNCTION 
function Location(query, data){
  this.search_query = query;
  this.formatted_query = data.formatted_address;
  this.latitude = data.geometry.location.lat;
  this.longitude = data.geometry.location.lng;
  this.created_at = Date.now();
};



//GET LOCATION FROM API 
Location.fetchLocation = function (query){
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`;

  return superagent.get(url)
    .then( result=> {
      if(!result.body.results.length) {throw 'No data';}
      let location = new Location(query, result.body.results[0]);
      return location.save()
        .then( result => {
          location.id = result.rows[0].id; 
          return location;
        });
    });
};
//SAVE DATA TO DATABASE
Location.prototype.save = function(){
  const SQL = `INSERT INTO locations
  (search_query, formatted_query, latitude, longitude, created_at)
  VALUES ($1, $2, $3, $4)
  RETURNING *`;

  let values = Object.values(this);
  return client.query(SQL, values);
};

// LOCATION SQL LOOKUP (checking database)
Location.lookup = (handler) => {
  const SQL = `SELECT * FROM locations WHERE search_query=$1`;
  const values = [handler.query];

  return client.query(SQL, values)
    .then( results => {
      if (results.rowCount > 0){
        console.log('got location data from DB')
        handler.cacheHit(results);
      }else {
        console.log('no data, fetching..')
        handler.cacheMiss(results);
      }
    })
    .catch(console.error);
};

//FUNCTION TO QUERY DB / FETCH FROM API ------------

  Location.getLocation = (request, response) => {
    const locationHandler = {
      query: request.query.data,
      cacheHit: (results) => {
        response.send(results.rows[0]);
      },
      cacheMiss: () => {
        Location.fetchLocation(request, response)
          .then( data => response.send(data));
      }
    };
    Location.lookup(locationHandler);
  }




// EXPORT LOCATION API -----------------------------------
module.exports = Location;