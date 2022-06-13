var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX - show all campgrounds
router.get("/", function (req, res) {
    // Get all campground from DB
    Campground.find({}, function (err, allCamps) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/campgrounds", { campgrounds: allCamps });
        }
    });
});

// CREATE - add new campground
router.post("/", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = { name: name, image: image, description: description, author: author }
    // Save new campground to DB
    Campground.create(newCampground, function (err, newCamp) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// NEW - show form to add new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/newCamp");
});

// SHOW - show details for a campground
router.get("/:id", function (req, res) {
    console.log("SHOW ROUTE",req.originalUrl);
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCamp) {
        console.log("ID ",req.params.id);
        if (err) {
            console.log("SHOW ERR ",err);
            res.redirect("/campgrounds");
        } else {
            console.log("Found Camp is, ", foundCamp);
            if (!foundCamp) {
                res.redirect("/campgrounds");
            } else {
                console.log("Render Details Page");
                res.render("campgrounds/campgroundDetails", { camp: foundCamp });
            }
        }
    });
});

// EDIT - show edit form for a campground
router.get("/:id/edit", middleware.checkCampOwner, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCamp) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/campgroundEdit", { camp: foundCamp });
        }
    });
});

// UPDATE - update a campground, then redirect
router.put("/:id", middleware.checkCampOwner, function (req, res) {
    req.body.camp.title = req.sanitize(req.body.camp.title);
    req.body.camp.image = req.sanitize(req.body.camp.image);
    req.body.camp.description = req.sanitize(req.body.camp.description);
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function (err, editedCamp) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE - delete a campground
router.delete("/:id", middleware.checkCampOwner, function (req, res) {
    Campground.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;