let listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const expressError = require("./utility/expressError");

module.exports.isLoggedIn = (req,res,next) => {
    // console.log(req.path, req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.toSaveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        console.log(req.session.redirectUrl); // For knowing  what next path will be...
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let list = await listing.findById(id);
    if(!list.owner._id.equals(res.locals.currentUser._id) ){
        req.flash("error", "You are not owner of this listing..")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currentUser._id)){
        req.flash("error", "You are not author of this review");
        return res.redirect(`/listings/${reviewId}`);
    }
    next();
}

// VALIDATE SCHEMA BY JOI
module.exports.listingValidate = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error)
        {
            throw new expressError(400, error);
        }
    else next();
}

module.exports.reviewValidate = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error)
        {
            throw new expressError(400, error);
        }
    else next();
}
