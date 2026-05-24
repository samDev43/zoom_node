const user = require("../models/user_auth")
const Post = require("../models/post_model")
const Comment = require("../models/comment_model")
const streamifier = require("streamifier")
const cloudinary = require("../config/cloudinary")
const bcrypt = require("bcrypt")
const { post } = require("../route/authRoute")


const getUser = async (req, res) => {
   const { id } = req.user;
   const checkUser = await user.findById(id)
    if(!checkUser){
        return res.status(404).json({message: "user not found"});
    }
    const userInfo = {
        id: checkUser._id,
        username: checkUser.username,
        email: checkUser.email,
        role: checkUser.role,
        profile_Picture: checkUser.profile_Picture
    }
    res.status(200).json({message: "user found", user: userInfo});
}

const createPost = async (req, res) => {
   try{
    const { title, content, excerpt } = req.body;
    const cover_image = req.file;
    const posterId = req.user.id;
    if(!title || !content || !excerpt){
        return res.status(400).json({message: "all fields are required"});
    }
    if(!cover_image){
        return res.status(400).json({message: "cover image is required"});
    }
    
    const uploadToCloudinary = () => new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {folder: "zoom_post"},
            (error, result) => {
                if (error){
                    reject(error);
                } else{
                     resolve(result);
                }
                
            }
        );
        streamifier.createReadStream(cover_image.buffer).pipe(stream);
    })
        
       const result  = await uploadToCloudinary();
       const newPost = {
        title,
        content,
        excerpt,
        posterId,
        image: result.secure_url
       }

       const createdPost = await Post.create(newPost);
        res.status(200).json({message: "post created successfully", post: createdPost, status: "success"});
   }catch (error){
    res.status(500).json({message: error.message});
   }

    
}

const getAllPost = async (req, res) => {
    try{

         const posts = await Post.find({}).populate("posterId", "username email")
         res.status(200).json({message: "posts found", posts: posts});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const getSinglePost = async (req, res) => {
    
    try{
        const { id } = req.params;
        const singlePost = await Post.findById(id).populate("posterId", "username email");
        if(!singlePost){
            return res.status(404).json({message: "post not found"});
        }        
        const comment = await Comment.find({postId: singlePost._id}).populate("commenterId", "username email");
        if(!comment){
            return res.status(404).json({message: "comment not found"});
        }

        res.status(200).json({message: "post found", post: singlePost, comment: comment, status: "success"});

    }catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

const getUserPosts = async (req, res) => {
    try{
       const { id } = req.user;       
       const userPosts = await Post.find({posterId: id}).populate("posterId", "username email");
       res.status(200).json({message: "user posts found", posts: userPosts, status: "success"});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const updatePost = async (req, res) => {
    try{
        const { id } = req.params;
        const { title, content, excerpt } = req.body;
        const cover_image = req.file;
        const posterId = req.user.id;
        if(!title || !content || !excerpt){
            return res.status(400).json({message: "all fields are required"});
        }
        if(!cover_image){
            return res.status(400).json({message: "cover image is required"});
        }
        
        const uploadToCloudinary = () => new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {folder: "zoom_post"},
                (error, result) => {
                    if (error){
                        reject(error);
                    } else{
                         resolve(result);
                    }
                    
                }
            );
            streamifier.createReadStream(cover_image.buffer).pipe(stream);
        })
            
           const result  = await uploadToCloudinary();
           const updatedPost = {
            title,
            content,
            excerpt,
            posterId,
            image: result.secure_url
           }

           const postToUpdate = await Post.findById(id);
           Object.assign(postToUpdate, updatedPost);
           const savedPost = await postToUpdate.save();
            res.status(200).json({message: "post updated successfully", post: savedPost, status: "success"});
    }catch (error){
     res.status(500).json({message: error.message});
    }
}

const postComment = async (req, res) => {
     try{
        const { comment, postId } = req.body;
        const commenterId =  req.user.id;
        
        if(!comment){
            return res.status(400).json({message: "comment is required"});
        }
        const commentData = {
            comment,
            postId,
            commenterId
        }
        const postToComment = await Comment.create(commentData);
        if(!postToComment){
            return res.status(400).json({message: "comment could not be added"});
        }
        const comments = await Comment.find({postId: postId}).populate("commenterId", "username email");        
        res.status(200).json({message: "comment added successfully", comment: comments, status: "success"});
     }catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
     }
}

const deletePost = async (req, res) => {
    // res.send("delete post");
    try{
        const { postId } = req.params;
        await Post.findByIdAndDelete(postId);
        res.status(200).json({message: "post deleted successfully", status: "success"});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const uploadProfilePicture = async (req, res) => {
      try{
        const profile_picture = req.file;
        const uploaderToCloudinary = () => new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {folder: "zoom_profile_picture"},
                (error, result) => {
                    if(error){
                        reject(error);
                    } else{
                        resolve(result);
                    }

                }
            )
            streamifier.createReadStream(profile_picture.buffer).pipe(stream);
        })
        const result = await uploaderToCloudinary();
        const userId = req.user.id;
        const userToUpDate = await user.findById(userId);
        userToUpDate.profile_Picture = result.secure_url;
        const img = await userToUpDate.save();
        res.status(200).json({message: "profile picture uploaded successfully", status: "success", img:img});

      }catch(error){
        console.log(error);
        
        res.status(500).json({message: error.message});
      }
}

const updateUserName = async (req, res) => {
    try{
        const { id } = req.user;
        const { username } = req.body;
        const userToUpDate = await user.findById(id);
        userToUpDate.username = username;
        const updatedUser = await userToUpDate.save();
        res.status(200).json({message: "username updated successfully", status: "success"});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const updateEmail = async (req, res) => {
   try{
     const { id } = req.user;
     const { email } = req.body;
     const userToUpdate = await user.findById(id);
     userToUpdate.email = email;
     await userToUpdate.save();
        res.status(200).json({message: "email updated successfully", status: "success"});

   }catch(error){
    res.status(500).json({message: error.message});
   }
}

const updatePassword = async (req, res) => {
    try{
        const { id } = req.user;
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const userToUpdate = await user.findById(id);
        userToUpdate.password = hashedPassword;
        await userToUpdate.save();
        res.status(200).json({message: "password updated successfully", status: "success"});

    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const deleteAccount = async (req, res) => {    
    try{ 
        const { role, id } = req.user;
        const { accountId } = req.params;
        
        const targetId = role === "admin" ? accountId : id;        
        
        const singleUser = await user.findById(targetId);
        if(!singleUser){
            return res.status(404).json({message: "user not found"});
        }

        if(singleUser.role === "admin"){
            return res.status(403).json(
                {
                message: "admin account cannot be deleted",
                status: "failed"
                });
        }
        const userPost = await Post.find({posterId: targetId});        
        
        const userPostId = userPost.map(post => post._id);
        await Comment.deleteMany({postId: {$in: userPostId}});
        await Post.deleteMany({posterId: targetId});
        await user.findByIdAndDelete(targetId);
        res.status(200).json({message: ` account deleted successfully`, status: "success"});
        
    }catch(error){
        res.status(500).json({message: error.message});
    }
}


const getAllUsers = async (req, res) => {
    try{
        const users = await user.find({});
        res.status(200).json({message: "users fetched successfully", status: "success", users});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const getSingleUser = async (req, res) => {
    try{
        const {  id } = req.user;
           
        const singleUser = await user.findById(id);
        if(!singleUser){
            return res.status(404).json({message: "user not found"});
        }
        res.status(200).json({message: "user found", user: singleUser, status: "success"});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}


module.exports = {
    getUser,
    createPost,
    getAllPost,
    getSinglePost,
    getUserPosts,
    deletePost,
     updatePost,
    postComment,
    uploadProfilePicture,
    updateUserName,
    updateEmail,
    updatePassword,
    deleteAccount,
    getAllUsers,
    getSingleUser
};  