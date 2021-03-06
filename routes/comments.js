var express = require("express");
var router  = express.Router({mergeParams:true});
var campgrounds = require("../models/campground");
var Comment = require("../models/comments");
var middleware = require("../middleware");

// =========================
// COMMENTS
// ==========================

router.get("/new",middleware.isLoggedIn,(req,res) => {
	campgrounds.findById(req.params.id,(err,campground) => {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new",{campground:campground});
		}
	});
});

router.post("/",middleware.isLoggedIn,(req,res) => {
	campgrounds.findById(req.params.id,(err,campground) => {
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comments,(err,comment) => {
				if(err) {
					req.flash("error","Something went wrong");
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	});
});

router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req,res) => {
	Comment.findById(req.params.comment_id,(err,foundComment) => {
		if(err) {
			res.redirect("back");
		} else {
			res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
		}
	})
});

router.put("/:comment_id",middleware.checkCommentOwnership,(req,res) => {
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comments,(err,updatedComment) => {
		if(err) {
			res.redirect("back");
		} else {
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	})
});

router.delete("/:comment_id",middleware.checkCommentOwnership,(req,res) => {
	Comment.findByIdAndRemove(req.params.comment_id,(err) => {
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success","Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

module.exports = router;