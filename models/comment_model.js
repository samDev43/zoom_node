const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
      comment: {
        type: String,
        required: true
     },
     postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        required: true
     },
     commenterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
     }
},{
    timestamps: true
})

module.exports = mongoose.model("comment", commentSchema);