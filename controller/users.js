const User = require("../models/user");

module.exports.signupForm = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req,res) => {
    try{
        let newUser = new User(req.body.user);
        // console.log(newUser);
        let registeredUser = await User.register(newUser, req.body.user.password);
        console.log(registeredUser);
        req.login(registeredUser, (error) => {
            if(error) {return next(error)}
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        })
    }    
    catch(err){
        req.flash("error", "User already Exists!");
        res.redirect("/signup");
    }
}

module.exports.loginForm = (req,res) => {
    res.render("users/login.ejs");
}


module.exports.login = async (req,res) => {
    // console.log(req.user);
    req.flash("success", "Welcome to Wanderlust");
    // console.log(req.session.redirectedUrl); // Here session reset becasue of success authentication or success of middleware
    let redirectedUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectedUrl);
}


module.exports.logout = (req,res) => {
    req.logout((err) => {
        if(err) {return next(err)}
        req.flash("success","You are successfully logout!");
        res.redirect("/listings");
    })
    
}
