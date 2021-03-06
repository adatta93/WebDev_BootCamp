var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function (req, res) {
    res.render("landing");
});

router.get("/register", function (req, res) {
    res.render("register");
});

router.post("/register", function (req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log("Register Error::", err);
            req.flash("error", err.message);
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login", function (req, res) {
    req.session.returnTo = req.query.redirect || req.header('Referer');
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login"
}), function (req, res) {
    req.flash("success", "Welcome Back - " + req.user.username);
    let returnTo = "/campgrounds";
    if (req.session.returnTo) {
        returnTo = req.session.returnTo;
        delete req.session.returnTo;
    }
    res.redirect(returnTo);
});

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged you out. Please visit soon!");
    res.redirect("/campgrounds")
});

module.exports = router;