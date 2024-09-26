const express = require("express");
const router = express.Router({mergeParams: true});

const wrapASync = require("../utility/wrapSync.js");
const expressError = require("../utility/expressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const listing = require("../models/listing.js");
const {reviewValidate, isLoggedIn, isAuthor} = require("../middlware.js");
const reviewController = require("../controller/reviews.js")


// REVIEWS
router.post("/", isLoggedIn, reviewValidate, wrapASync(reviewController.createReview) );

// DELETE REVIEWS
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapASync(reviewController.deleteReview));

module.exports = router;

