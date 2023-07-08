const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./movies.service");

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

async function list(req, res) {
  if (req.query.is_showing == "true") {
    return listIsShowing(req, res);
  }
  const reponse = await service.list();
  res.json({ data: reponse });
}

async function listIsShowing(req, res) {
  const reponse = await service.listIsShowing();
  res.json({ data: reponse });
}

module.exports = {
  list,
};
