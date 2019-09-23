var mongoose = require("mongoose");
var Comment = require("./comment");
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

campgroundSchema.pre('remove', function() {
    Comment.remove({
        _id: {
            $in: this.comments
        }
    });
});


var CampGround = mongoose.model("CampGround", campgroundSchema);
module.exports = CampGround;
