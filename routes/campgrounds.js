var express = require("express");
var router  = express.Router();
var campgrounds = require("../models/campground");
var middleware = require("../middleware");

router.get("/",(req,res) => {
	campgrounds.find({},(err,camp)=> {
		if(err) {
			console.log("You got an error!");
			console.log(err);
		} else {
			console.log("You found interesting sites!!");
			res.render("campgrounds/index",{campgrounds: camp});
		}
})
});

router.post("/",middleware.isLoggedIn,(req,res) => {
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name:name,price:price,image:image,description:desc,author: author};
	campgrounds.create(newCampground,(err,newlyCreated) => {
		if(err) {
			req.flash("error",err);	
		} else {
			req.flash("success","logged you in");
			res.redirect("/campgrounds");
		}
	})
	// campgrounds.push(newCampground);
	
});

router.get("/new",(req,res) => {
	res.render("campgrounds/new");
});

router.get("/:id",(req,res)=> {
	campgrounds.findById(req.params.id).populate("comments").exec((err,foundCampground) =>{
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/show",{campground:foundCampground});

		}
	})
});

// Edit campground route.

router.get("/:id/edit",middleware.checkCampgroundOwnership,(req,res) => {
		campgrounds.findById(req.params.id,(err,foundCampground) => {;
			res.render("campgrounds/edit",{campground:foundCampground});
	})	
});

// Update Route

router.put("/:id",middleware.checkCampgroundOwnership,(req,res) => {
	campgrounds.findByIdAndUpdate(req.params.id,req.body.campground,(err,updated) => {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

// Destroy Route
router.delete("/:id",middleware.checkCampgroundOwnership,(req,res) => {
	campgrounds.findByIdAndRemove(req.params.id,(err) => {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	})
})


module.exports = router;