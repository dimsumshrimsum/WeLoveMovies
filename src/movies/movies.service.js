const knex = require("../db/connection");

function list() {
  return knex("movies").select("*");
}

// the listIsShowing() function returns a list of movies that are currently showing in any theater.
function listIsShowing() {
  return (
    knex("movies as m")
      // the join() method joins the movies table with the movies_theaters table on the movie_id column
      .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
      // the distinct() method returns only the unique rows from the query
      .distinct("m.*")
      // the where() method filters the query to only include rows where the is_showing column is true
      .where({ "mt.is_showing": true })
  );
}

function read(movie_id) {
  return knex("movies").select("*").where({ movie_id }).first();
}

// the readTheaters() function returns a list of theaters for a given movie.
function readTheaters(movie_id) {
  return (
    knex("movies_theaters as mt")
      // the join() method joins the movies_theaters table with the theaters table on the theater_id column
      .join("theaters as t", "mt.theater_id", "t.theater_id")
      // the select() method selects all columns from the theaters table and the is_showing and movie_id columns from the movies_theaters table
      .select("t.*", "mt.is_showing", "mt.movie_id")
      // the where() method filters the query to only include rows where the movie_id column matches the movie_id parameter
      .where({ "mt.movie_id": movie_id })
  );
}

// the readReviews() function returns a list of reviews for a given movie.
async function readReviews(movie_id) {
  const reviews = await knex("reviews as r")
    // the join() method joins the reviews table with the movies table on the movie_id column
    .join("movies as m", "r.movie_id", "m.movie_id")
    // the join() method joins the reviews table with the critics table on the critic_id column
    .join("critics as c", "r.critic_id", "c.critic_id")

    .select("r.*", "c.*")
    .where({ "r.movie_id": movie_id });
  return reviews.map((review) => {
    // the map() method returns a new array of reviews with the critic property set to an object containing the critic_id, preferred_name, surname, and organization_name of the critic who wrote the review.
    return {
      // the spread operator (...) copies all properties from the review object into a new object
      ...review,
      // the critic property is set to an object containing the critic_id, preferred_name, surname, and organization_name of the critic who wrote the review
      critic: {
        critic_id: review.critic_id,
        preferred_name: review.preferred_name,
        surname: review.surname,
        organization_name: review.organization_name,
      },
    };
  });
}

module.exports = {
  list,
  listIsShowing,
  read,
  readTheaters,
  readReviews,
};
