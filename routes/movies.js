'using strict';

// DEPENDENCIES 
require('dotenv').config();
const superagent = require('superagent');
const pg = require('pg');

// Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.on('err', err => console.error(err));

//MOVIE CONSTRUCTOR FUNCTION
function Movie(data) {
  this.title = data.title;
  this.overview = data.overview
  this.released_on = data.release_date;
  this.total_votes = data.vote_count;
  this.average_votes = data.vote_average;
  this.popularity = data.popularity;
  this.image_url = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
  this.created_at = Date.now();
};


//MOVIES API FETCH 
function getMovies(request, response) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&include_adult=false&query=${request.query.data.search_query}`;
  superagent
    .get(url)
    .then(data => {
      const movies = data.body.results.map(movie => {
        return new Movie(movie);
      });
      response.status(200).json(movies);
    })
    .catch(() => {
      errorHandler(
        'Uh-Oh! Something went wrong!',
        request,
        response
      );
    });
}

// MOVIES EXPORT API
module.exports = getMovies;