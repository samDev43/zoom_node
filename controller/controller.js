// const express = require('express');
// const app = express();
const User = require("../models/user_auth")
const bcrypt = require("bcrypt")
const {createToken} = require("../middleware/jwt");
const is_email = (str) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(str);
}

const signUp = async (req, res) => {
   try{
     const {username, email, password, confirmPassword} = req.body;
     if(!username || !email || !password || !confirmPassword){
        return res.status(400).json({message: "all fields are required"});
     }
     if(password !== confirmPassword){
        return res.status(400).json({message: "password do not match"});
     }
     const userExist = await User.findOne({email});
     if(userExist){
         return res.status(410).json({message: "user already exist"});
        }
        if(!is_email(email)){
            return res.status(400).json({message: "use valid email address"});
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username,
            email,
            password: hashPassword,
        }
        if(email === "sooto@sooto.com"){
            newUser.role = "admin";
        }
        const user = await User.create(newUser)
        res.status(200).json({message: "user created successfully", user, status: "success"});
   }catch (error){
    res.status(500).json({message: error.message});
   }
}

const login = async (req, res) => {
    
   try{
      let {username_email, password} = req.body;
      if(!username_email || !password){
         return res.status(400).json({message: "all fields are required"});
      } 
      let user;
      if(is_email(username_email)){
         user = await User.findOne({email: username_email});
      }else{
            user = await User.findOne({username: username_email});
      }
      if(!user){
         return res.status(404).json({message: "invalid credentials"});
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if(!isMatch){
         return res.status(404).json({message: "invalid credentials"});
      }
      const token = createToken(user)
      const userInfo = {
         username: user.username,
         email: user.email,
         role: user.role
      }
      res.status(200).json({message: "login successfull", status: "success", token, userInfo});
   }catch(error){
      res.status(500).json({message: error.message})
   }
}

module.exports = {
    signUp,
    login
}