const express = require("express");
const router = express.Router();
const {verifyToken} = require("../middleware/jwt");
const {getUser,
      createPost,
      getAllPost,
      getSinglePost, 
      getUserPosts, 
      postComment, 
      deletePost, 
      uploadProfilePicture,
      updateUserName,
      updateEmail,
      updatePassword,
      deleteAccount,
      getAllUsers,
      getSingleUser
} = require("../controller/actionController")
const { upload } = require("../middleware/multer")
const { validatePostDeleteAction, validateAccountDeleteAction, isAdmin } = require("../middleware/middleActions")



router.get("/getuser", verifyToken, getUser)
router.post("/addpost", verifyToken, upload.single("cover_image"), createPost)
router.get("/getallpost", getAllPost)
router.get("/getpost/:id", getSinglePost)
router.get("/getuserposts", verifyToken, getUserPosts)
router.post("/postcomment", verifyToken, postComment)
router.delete("/deletepost/:postId", verifyToken, validatePostDeleteAction, deletePost)
router.post("/uploadprofilepicture", verifyToken, upload.single("image"), uploadProfilePicture)
router.put("/updateusername", verifyToken, updateUserName)
router.put("/updateemail", verifyToken, updateEmail)
router.put("/updatepassword", verifyToken, updatePassword)
router.delete("/deleteAccount/:accountId", verifyToken, validateAccountDeleteAction, deleteAccount)
router.get("/getAllUsers", verifyToken, isAdmin, getAllUsers)
router.get("/getsingleUser", verifyToken, isAdmin, getSingleUser)


module.exports = router;