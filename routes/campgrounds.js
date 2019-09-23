var express = require("express"),
    router = express.Router(),
    CampGround = require("../models/campground"),
    middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res) {
    var noMatch = null;
    if (req.query.search) {
        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
        CampGround.find({ name: regex }, function(err, allCampgrounds) {
            if (err) {
                console.log(err);
            }
            else {
                if (allCampgrounds.length < 1) {
                    var noMatch = "No campgrounds match your search, Please search with different name!!!"
                }
                res.render("campgrounds/index", { campgrounds: allCampgrounds, noMatch: noMatch, page: 'campgrounds' });
            }
        });
    }
    else {
        // Get all campgrounds from DB
        CampGround.find({}, function(err, allCampgrounds) {
            if (err) {
                console.log(err);
            }
            else {
                res.render("campgrounds/index", { campgrounds: allCampgrounds, noMatch: noMatch, page: 'campgrounds' });
            }
        });
    }
});

// create new campground
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var price = req.body.price
    var image = req.body.image;
    var dsc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampGround = { name: name, price: price, image: image, description: dsc, author: author }
    CampGround.create(newCampGround,
        function(err, newlyCreated) {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect("/campgrounds");
            }
        });
});
// new campground form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});
router.get("/:id", function(req, res) {
    CampGround.findById(req.params.id).populate("comments likes").exec(function(err, foundCampGround) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/show", { campground: foundCampGround });
        }
    });
});

// Edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    CampGround.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

//update campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    CampGround.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        res.redirect("/campgrounds/" + req.params.id);
    });
});

// destroy campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    CampGround.findById(req.params.id, function(err, campground) {
        campground.remove();
        res.redirect("/campgrounds");

    });
});

// Campground Like Route
router.post("/:id/like", middleware.isLoggedIn, function(req, res) {
    CampGround.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
            return res.redirect("/campgrounds");
        }

        // check if req.user._id exists in foundCampground.likes
        var foundUserLike = foundCampground.likes.some(function(like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundCampground.likes.pull(req.user._id);
        }
        else {
            // adding the new user like
            foundCampground.likes.push(req.user);
        }

        foundCampground.save(function(err) {
            if (err) {
                console.log(err);
                return res.redirect("/campgrounds");
            }
            return res.redirect("/campgrounds/" + foundCampground._id);
        });
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
