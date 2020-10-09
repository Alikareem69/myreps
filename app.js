var express          = require("express"),
	app              = express(),
	parser           = require("body-parser"),
	mongoose         = require("mongoose"),
	flash			 = require("connect-flash"),
	passport         = require("passport"),
	LocalStrategy    = require("passport-local"),
	methodOverride   = require("method-override"),
	campgrounds      = require("./models/campground"),
	Comment          = require("./models/comments"),
	User             = require("./models/user");

var commentRoutes          = require("./routes/comments"),
	campgroundRoutes       = require("./routes/campgrounds"),
	authRoutes             = require("./routes/index");
	
mongoose.connect("mongodb+srv://vega:usernamechecksout@cluster0.b2f37.mongodb.net/test?retryWrites=true&w=majority",{
	useUnifiedTopology:true,
	useFindAndModify:false,
	useCreateIndex:true,
	useNewUrlParser:true
});

app.use(require("express-session")({
	secret: "Some useless info here.",
	resave: false,
	saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(parser.urlencoded({extended:true}));
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.set("view engine","ejs");


// seedDB();

app.use((req,res,next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

	
app.use("/",authRoutes);
app.use("/campgrounds/",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(process.env.PORT || 3000,process.env.IP,() => {
	console.log("App is listening!!");
});