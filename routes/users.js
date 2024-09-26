const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {toSaveRedirectUrl} = require("../middlware.js");
const usersController = require("../controller/users.js");

router
    .route("/signup")
    .get(usersController.signupForm)
    .post(usersController.signup);

router
    .route("/login")
    .get(usersController.loginForm)
    .post(toSaveRedirectUrl, 
    passport.authenticate("local", {failureRedirect:'/login', failureFlash: true}), 
    usersController.login
);

router.get("/logout", usersController.logout);

module.exports = router;