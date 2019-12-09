'use strict';

// DEPENDENCIES
const superagent = require('superagent');
const pg = require('pg');

// Connects to PSQL
const client = new pg.Client(process.env.DATABASE_URL);
client.connect()
client.on('err', err => console.error(err));

//YELP CONSTRUCTOR FUNCTION 
function Yelp(review) {
  this.name = review.name;
  this.rating = review.rating;
  this.price = review.price;
  this.url = review.url;
  this.image_url = review.image_url;
  this.created_at = Date.now();
};

//GET YELP API
Yelp.prototype.fetchYelp = function(query) {
  const url = `https://api.yelp.com/v3/businesses/search?location=${location.search_query}`;
  return superagent
    .get(url)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
    .then(result => {
     if(!result.body.businesses.length){throw 'no data for you!';}
     let yelpData = result.body.businesses.map(data => {
      let yelpReviews = new Yelp(data);
      yelpReviews.save(query.id);
      return yelpReviews;
    });
    return yelpData;
  })
}

//DAVE DATA
Yelp.prototype.save = function(id){
  let SQL = `INSERT INTO yelp (name, image_url, price, rating, url, location_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  let values = Object.values(this);
  values.push(id);

  return client.query(SQL, values);
}

//CHECK DATABASE
Yelp.prototype.lookup = function(handler){
const SQL = `SELECT * FROM yelp WHERE location_id=$1`;
  const value = [handler.query.id];

  return client.query(SQL, value)
    .then(result => {
      if(result.rowCount > 0){
        return handler.cacheHit(result);
      } else {
        return handler.cacheMiss(result);
      }
    })
    .catch(error => console.error(error));
}

//CALLBACK FUNCTION
function getYelp(request, response){
  const yelpHandler = {
    query: request.query.data,
    cacheHit: result => {
      response.send(result.rows);
    },
    cacheMiss: () => {
      Yelp.prototype.fetchYelp(request.query.data)
        .then(result => response.send(result));
    }
  }
  Yelp.prototype.lookup(yelpHandler);
} 




// Export API fetch
module.exports = getYelp;