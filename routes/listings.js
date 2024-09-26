const express = require("express");
const router = express.Router();
const multer  = require('multer');
const {storage} = require("../cloudinary.js");
const upload = multer({storage});


const wrapASync = require("../utility/wrapSync.js");
const expressError = require("../utility/expressError.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isOwner, listingValidate } = require("../middlware.js");
const listingsController = require("../controller/listings.js");
// const passport = require("passport");

router
    .route("/")
    .get(wrapASync(listingsController.index))
    .post(isLoggedIn, upload.single('listing[image]'), listingValidate, wrapASync(listingsController.createNewListing));

router.get("/new", isLoggedIn, listingsController.newForm);

// show routes
router
    .route("/:id")
    .get(wrapASync(listingsController.showListings))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), listingValidate, wrapASync(listingsController.updateListing))
    .delete(isLoggedIn, isOwner, wrapASync(listingsController.deleteListing));

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapASync(listingsController.editListing));

module.exports = router;
