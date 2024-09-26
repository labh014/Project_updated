const Review = require("../models/review");
const listing = require("../models/listing");


module.exports.createReview = async(req,res) => {
    // let {id} = req.params;
    let list = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = res.locals.currentUser._id; // also use req.user directly
    console.log(newReview);
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    console.log(list);
    req.flash("success", "New Review was successfully Created!");
    res.redirect(`/listings/${list.id}`)
}

module.exports.deleteReview = async(req,res) => {
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review was successfully Deleted!");
    res.redirect(`/listings/${id}`);
}