const service = require("./reviews.service");

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
// this the middleware function that checks if the review exists
async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function read(req, res) {
  const data = await service.read(res.locals.review.review_id);
  res.json({ data });
}

async function destroy(req, res) {
  await service.destroy(res.locals.review.review_id);
  res.sendStatus(204);
}

async function update(req, res) {
  // the updatedReview object is created by spreading the data property from the request body into a new object and adding the review_id property from the request parameters
  const updatedReview = {
    ...req.body.data,
    review_id: req.params.reviewId,
  };
  const data = await service.update(updatedReview);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(read)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
};
