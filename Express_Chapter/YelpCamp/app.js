var express = require("express");
var app = express();
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");
var parser = require("body-parser");
var mongoose = require("mongoose");
var expSession = require("express-session");
var passport = require("passport");
var localStrategy = require("passport-local");
var flash = require("connect-flash");

var User = require("./models/user");
var seedDB = require("./seed");

var indexRoutes = require("./routes/index");
var campgroundRoutes = require("./routes/campground");
var commentRoutes = require("./routes/comment");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

// Specify the folder for static files - css, img, vendor js
app.use(express.static(__dirname + "/public"));
// Set the body parser to use in POST methods
app.use(parser.urlencoded({ extended: true }));
// Set View Engine as ejs
app.set("view engine", "ejs");
// Use express-sanitizer to sanitize user input
app.use(expressSanitizer());
// Use method-override for PUT and DELETE
app.use(methodOverride("_method"));
// Initialize connect-flash
app.use(flash());

// Set secret key for express-session
app.use(expSession({
    secret: "I am making website with Node",
    resave: false,
    saveUninitialized: false
}));
// initialize passport
app.use(passport.initialize());
// start passport session
app.use(passport.session());

// Use passport local strategy
passport.use(new localStrategy(User.authenticate()));
// Passport serialization and deserialization
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// App level middleware to get the currentUser in all pages
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Routing
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//seedDB();

app.listen(3000, function () {
    console.log("YelpCamp Server Started");
})