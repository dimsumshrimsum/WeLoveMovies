const router = require("express").Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/").get(controller.list).all(methodNotAllowed);

router.route("/:movieId([0-9]+)").get(controller.read).all(methodNotAllowed);
router
  .route("/:movieId([0-9]+)/theaters")
  .get(controller.readTheaters)
  .all(methodNotAllowed);
router
  .route("/:movieId([0-9]+)/reviews")
  .get(controller.readReviews)
  .all(methodNotAllowed);
module.exports = router;
