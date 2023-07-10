const router = require("express").Router();
const controller = require("./reviews.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/").get(controller.list).all(methodNotAllowed);
router
  // the reviewId parameter is a number
  .route("/:reviewId([0-9]+)")
  .get(controller.read)
  .delete(controller.delete)
  .put(controller.update)
  .all(methodNotAllowed);

module.exports = router;
