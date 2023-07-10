const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./movies.service");

// this is the middleware function that checks if the movie exists
async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);
  // if the movie exists, then we set the movie property on res.locals
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

// this is the middleware function that lists all the movies
async function list(req, res) {
  // it has a conditional that checks if the query string is_showing is true
  if (req.query.is_showing == "true") {
    return listIsShowing(req, res);
  }
  const reponse = await service.list();
  res.json({ data: reponse });
}
// this is the middleware function that lists all the movies that are showing
async function listIsShowing(req, res) {
  const reponse = await service.listIsShowing();
  res.json({ data: reponse });
}

function read(req, res) {
  res.json({ data: res.locals.movie });
}

// middleware to read the theaters for a movie
async function readTheaters(req, res) {
  const response = await service.readTheaters(res.locals.movie.movie_id);
  res.json({ data: response });
}

//middleware to read the reviews for a movie
async function readReviews(req, res) {
  const response = await service.readReviews(res.locals.movie.movie_id);
  res.json({ data: response });
}

module.exports = {
  list,
  read: [asyncErrorBoundary(movieExists), read],
  readTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readTheaters),
  ],
  readReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readReviews),
  ],
};
