var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to logged in to do that");
    res.redirect("/login?redirect=" + req.originalUrl);
}

middlewareObj.checkCampOwner = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCamp) {
            if (err) {
                req.flash("error", "Uh-oh! Campground not found");
                res.redirect("back");
            } else {
                if (foundCamp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Sorry! You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkComentOwner = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComm) {
            if (err) {
                req.flash("error", "Uh-oh! Comment not found");
                res.redirect("back");
            } else {
                if (foundComm.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Sorry! You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to logged in to do that");
        res.redirect("back");
    }
}

module.exports = middlewareObj;