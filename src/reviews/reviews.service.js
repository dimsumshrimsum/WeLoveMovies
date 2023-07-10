const knex = require("../db/connection");

function list() {
  return knex("reviews").select("*");
}

function read(review_id) {
  return knex("reviews").select("*").where({ review_id }).first();
}

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

async function update(updatedReview) {
  await knex("reviews")
    // the update() method updates the review record with the updatedReview object
    .where({ review_id: updatedReview.review_id })
    // the returning() method returns the updated review record

    .update(updatedReview);
  // a second query is necessary to return the critic information
  const updatedRecord = await knex("reviews")
    .join("critics", "reviews.critic_id", "critics.critic_id")
    .select("reviews.*", "critics.*")
    .where({ "reviews.review_id": updatedReview.review_id })
    .first();
  // the critic property is set to an object containing the critic_id, preferred_name, surname, and organization_name of the critic who wrote the review
  const critic = {
    critic_id: updatedRecord.critic_id,
    preferred_name: updatedRecord.preferred_name,
    surname: updatedRecord.surname,
    organization_name: updatedRecord.organization_name,
  };
  return { ...updatedRecord, critic };
}

module.exports = { list, read, destroy, update };
