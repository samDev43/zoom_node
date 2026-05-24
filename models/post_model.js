const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
   posterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
   },
   image: {
    type: String,
    default: "img"
   },
   title: {
    type: String,
    required: [true, "Title is required"]
   },
   content: {
    type: String,
    required: [true, "COntent is required"]
   }
},

{
    timestamps: true
}
);
module.exports = mongoose.model("post", postSchema);