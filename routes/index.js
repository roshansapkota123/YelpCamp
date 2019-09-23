var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

// root route
router.get("/", function(req, res) {
    res.render("landing");
});

// signup form
// show register form
router.get("/register", function(req, res) {
    res.render("register", { page: 'register' });
});

// create user
router.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            return res.render("register", { "error": err.message });
            // req.flash("error", err.message);
            // return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Successfully Signed Up! Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login", function(req, res) {
    res.render("login", { page: 'login' });
});
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"

}), function(req, res) {});


// logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("error", "Logged You Out")
    res.redirect("/campgrounds");
});

module.exports = router;
