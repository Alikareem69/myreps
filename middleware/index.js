var campgrounds = require("../models/campground");
var Comment = require("../models/comments");
var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = (req,res,next) => {
	if(req.isAuthenticated()) {
		campgrounds.findById(req.params.id,(err,foundCampground) => {
			if(err) {
				req.flash("error","campground not found");
				res.redirect("back");
			} else {
				if(foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
	})
	} else {
		req.flash("error","You don't have permission to do that!");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = (req,res,next) => {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id,(err,foundComment) => {
			if(err) {
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error","You don't have permission to do that!");
					res.redirect("back");
				}
			}
	})
	} else {
		req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req,res,next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash("error","You need to login first!!");
	res.redirect("/login");
}

module.exports = middlewareObj;