var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User      = require("../models/user");

router.get("/",(req,res) => {
	res.render("landing");
});





// ====================
//      Autherization Routes
// ====================

// Show register form

router.get("/register",(req,res) => {
	res.render("register");
});

router.post("/register",(req,res) => {
	let newuser = new User({username: req.body.username});
	User.register(newuser,req.body.password,(err,user)=> {
		if(err) {
			return res.render("register", {"error": err.message});
		} passport.authenticate("local")(req,res,() => {
			req.flash("success",`Welcome to reservation portal ${user.username}`);
			res.redirect("/campgrounds");
		})
	});
});

// Login Routes

router.get("/login",(req,res) => {
	res.render("login",{message:req.flash("error")});
});

router.post("/login",passport.authenticate("local",{successRedirect:"/campgrounds",failureRedirect:"/login"}),(req,res) => {	
});

router.get("/logout",(req,res) => {
	req.logout();
	req.flash("success","Logged you out");
	res.redirect("/campgrounds");
});


module.exports = router;