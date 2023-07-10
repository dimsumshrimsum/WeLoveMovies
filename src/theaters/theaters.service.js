const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

// this is the configuration array for the reduceProperties() function
// the first argument is the key to group by
// the second argument is an object of arrays
// each array is assigned to a key which is used to rename the property
// within each array the first element is the table name, the second element is set to null, and the third element is the property name
const reduceMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  isShowing: ["movies", null, "is_showing"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
});

function listTheatersWithMovies() {
  return (
    knex("theaters as t")
      // the join() method joins the theaters table with the movies_theaters table on the theater_id column
      .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
      // the join() method joins the movies table with the movies_theaters table on the movie_id column
      .join("movies as m", "mt.movie_id", "m.movie_id")
      .select("*")
      .then(reduceMovies)
  );
}

module.exports = {
  listTheatersWithMovies,
};
