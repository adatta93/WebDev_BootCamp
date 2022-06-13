var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// NEW - Show form to add new comment
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCamp) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            res.render("comments/newComment", { camp: foundCamp });
        }
    });
});

// CREATE - Add a new comment to campground
router.post("/", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCamp) {
        if (err) {
            console.log(err);
            req.flash("error", "Uh-oh! Something went wrong");
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            Comment.create(req.body.comment, function (err, newComment) {
                if (err) {
                    console.log(err);
                } else {
                    // Add logged in username and id to comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    // Save new comment
                    newComment.save();
                    // Add new comment in the campground
                    foundCamp.comments.push(newComment);
                    // Save the campground
                    foundCamp.save();
                    req.flash("success", "Yay!! Comment added successfully");
                    res.redirect("/campgrounds/" + foundCamp._id);
                }
            });
        }
    });
});

// EDIT - show edit form for a comment
router.get("/:comment_id/edit", middleware.checkComentOwner, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComm) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/commentEdit", { camp_id: req.params.id, comm: foundComm });
        }
    });
});

// UPDATE - update a comment, then redirect
router.put("/:comment_id", middleware.checkComentOwner, function (req, res) {
    req.body.comm.text = req.sanitize(req.body.comm.text);
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comm, function (err) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE - delete a comment
router.delete("/:comment_id", middleware.checkComentOwner, function (req, res) {
    Comment.findByIdAndDelete(req.params.comment_id, function (err) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Yesss! Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;