const { query } = require("express");
const listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapAccessToken = process.env.MAP_ACCESS_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapAccessToken });

module.exports.index = async (req,res) =>{
    const {category} = req.query;
    let query = {};
    if(category) query.category = category;
    const allListings = await listing.find({});
    const selectedListings = await listing.find(query)
    // console.log(allListings)
    // console.log(query)
    // console.log(selectedListings)
    res.render("listings/index.ejs",  {allListings, selectedListings});
}

module.exports.newForm = (req,res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
}

module.exports.showListings = async (req,res)=> {
    let {id} = req.params;
    const list = await listing.findById(id)
    .populate({
        path: "reviews", populate: {
            path: "author"
        }
    })
    .populate("owner");
    if(!list){
        req.flash("error", "You requested for listing not existed!");
        // console.log("mission successfull");
        res.redirect("/listings");
    }
    // console .log(list.location);
    let response = await geocodingClient.forwardGeocode({
        query: list.location,
        limit: 1,
      })
        .send()
        
    // console.log(response.body.features[0].geometry);
    let cordinates = response.body.features[0].geometry
    // console.log(list);
    res.render("listings/show.ejs",{list, cordinates});
}

module.exports.createNewListing = async (req,res,next) => {
    // if(!req.body.listing)
    //     {
    //         throw new expressError(400, "Please Enter the valid Data for listings in Wanderlust")
    //     }

    // let result = listingSchema.validate(req.body);        
    // console.log(result);
    // if(result.error)
    //     {
    //         console.log(result.error);
    //         throw new expressError(400, result.error);
            
    //     }
    // else {
    //     next();
    // }

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
    console.log(response.body.features[0].geometry);
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url);
    // console.log(filename);
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success","New Listing was successfully created!");
    res.redirect("/listings");
}

module.exports.editListing = async (req,res) => {
    let {id} = req.params;
    const list = await listing.findById(id);
    if(!list){
        req.flash("error", "You requested for listing not existed!");
        res.redirect("/listings");
    }
    let originalImageUrl = list.image.url.replace("/upload", "/upload/h_250,w_250");
    console.log(originalImageUrl);
    res.render("listings/edit.ejs",{list, originalImageUrl},);
}

module.exports.updateListing = async (req,res) => {
    // if(!req.body.listing)
    //     {
    //         throw new expressError(400, "Please Enter the valid Data for listings in Wanderlust")
    //     }
    
    let {id} = req.params;
    
    const updatedList = await listing.findByIdAndUpdate(id, {...req.body.listing}, {runValidators: true, new: true});
    // console.log(updatedList);
    
    if(typeof req.file != "undefined")      
        {
            let url = req.file.path;
            let filename = req.file.filename;
            updatedList.image = {url, filename};
            await updatedList.save();
        }
    req.flash("success","Listing was successfully updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
    const deletedList = await listing.findByIdAndDelete(id);
    console.log(deletedList);

    req.flash("success","Listing was successfully deleted");
    res.redirect("/listings");
}