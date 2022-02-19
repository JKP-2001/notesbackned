require('dotenv').config()
const express = require('express');
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRETKEY;
const fetchUser = require("../MiddleWare/fetchuser");
const bcrypt = require("bcryptjs");


// POST request for creatig a user at /api/auth/createuser

router.post ("/createuser", [
    body('name', "Name Min. Length be 3 ").isLength({ min: 3 }),
    body("email", "Enter Valid Email").isEmail(),
    body("password", "Password Min. Length be 5 ").isLength({ min: 5 })
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const UserEmail = req.body.email;
    const x = await User.findOne({email:UserEmail});
    if(x){
        res.json("UserEmail Already Exist");
    }
    else{
        const user = await User.create({
            name: req.body.name,
            password: bcrypt.hashSync(req.body.password,10),
            email: req.body.email
        });    
        const data = {user:{
            id:user.id
        }}
        const token = jwt.sign(data, secret);
        console.log(token);
        res.json(token);
    }
});




// POST request for authentication at /api/auth/loginuser

router.post ("/loginuser", [
    body("email", "Enter Valid Email").isEmail(),
    body("password", "Must Required Field").exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}  =req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            res.status(401).json("Please Enter Valid Credentials.");
        }
        else{
            if(bcrypt.compareSync(password, user.password)===false){
                res.status(401).json("Please Enter Valid Credentials.");
            }
            else{
                const data = {user:{
                    id:user.id
                }}
                const token = jwt.sign(data, secret);
                res.json({token}); 
            }
        }
        
    } catch (error) {
        res.status(500).json("Internal Server Error");
    }
});

// post request from token at /api/auth/getuser
router.post("/getuser",fetchUser,async (req,res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).json("Internal Server Error");
    }
})


module.exports = router;