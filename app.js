if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}
// console.log(process.env.CLOUD_NAME);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
// const { rmSync } = require("fs");
const ejsMate = require("ejs-mate");
const wrapASync = require("./utility/wrapSync.js");
const expressError = require("./utility/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const userRouters = require("./routes/users.js");
const { error } = require('console');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// const mongodbUrl = "mongodb://127.0.0.1:27017/Wanderlust";
// const mongodbUrl = "mongodb+srv://labh551:JhkLePLfww5Nws1C@wanderlust-cluster.bmufi.mongodb.net/?retryWrites=true&w=majority&appName=wanderlust-cluster";
const atlasDbUrl = process.env.ATLAS_DATABASE_URL;
console.log(atlasDbUrl)
main()
    .then(() => { console.log("Connection to Database is succesfull ") })
    .catch((err) => { console.log(err) });

async function main() {
    await mongoose.connect(atlasDbUrl);
}

const store =
    MongoStore.create({
        mongoUrl: atlasDbUrl,
        crypto: {
            secret: process.env.SECRET,
        },
        touchAfter: 24 * 60 * 60,
    })

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}


store.on("error", (error) => {
    console.log("Error in mongo session store", error)
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currentUser = req.user;
    // console.log(res.locals.successMsg);
    next();
});

// app.get("/getrandomuser",async (req,res) => {
//     let user = new User({
//         email: "randomstudent.gmail.com",
//         username: "apnacollegestudent",
//     });
//     let registeredUser = await User.register(user, "hellomoto");
//     res.send(registeredUser);
// });

app.get("/", (req, res) => {
    res.send("Welcome to root path");
});

// app.get("/testlisting", async (req,res) => {
//     const sampleListing = new listing ({
//         title: "Banglow",
//         description: "By the ocean..",
//         price: 3000,
//         location: "Andheri, Mumbai",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("testing successfull");
// });

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRouters);

app.all("*", (req, res, next) => {
    next(new expressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    // res.status(status).send(message);
    res.status(status).render("listings/error.ejs", { message });
});


app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});     