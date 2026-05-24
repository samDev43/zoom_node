const Post = require("../models/post_model");
const user = require("../models/user_auth")

const validatePostDeleteAction = async (req, res, next) => {
    try{
       const { role, id } = req.user;
       const { postId } = req.params;
       
       const postToDelete = await Post.findById(postId);       
       if(!postToDelete){
           return res.status(404).json({message: "post not found"});
       }
       
       if(postToDelete.posterId.toString() !== id && role !== "admin"){
            return res.status(403).json({message: "you are not the owner of this post"});
       }
         next();
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

const validateAccountDeleteAction = async (req, res, next) => {
    try{
         const { role, id } = req.user;
         const { accountId } = req.params;

         if(role === "admin"){
            return next();
         }
         const account = await user.findById(id);
         if(!account){
            return res.status(404).json({message: "account not found"});
         }
         next();         

    }catch(error){
       return res.status(500).json({message: error.message});
    }
}

const isAdmin = (req, res, next) => {
    try{
        const { role } = req.user;
        if(role !== "admin"){
            return res.status(403).json({message: "you are not authorized to perform this action"});
        }
        next();
    }catch(error){
        return res.status(500).json({message: error.message});
    }
}


module.exports = { validatePostDeleteAction, validateAccountDeleteAction, isAdmin }