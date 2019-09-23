var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    CampGround = require("./models/campground");
// seedDB = require("./seeds");

// requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
// mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
 mongoose.connect('mongodb+srv://Roshansapkota123:S@r@sw0ti@cluster0-7h2ch.mongodb.net/test?retryWrites=true&w=majority', {
     useNewUrlParser: true,
     useCreateIndex: true
    }).then(() =>{
        console.log("Connected!");
    }).catch(err => {
        console.log("ERR:", err.message);
    });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed the database

app.use(require("express-session")({
    secret: "this can be anything",
    resave: false,
    saveUninitialized: false
}));
app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT|| 5000, function() {
    console.log("The YelpCamp Server Has Started!!!");
});

// app.listen("5000");
