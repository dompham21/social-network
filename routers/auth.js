const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../config/keys');
const requireLogin = require('../middlewares/requireLogin');
const salt = bcrypt.genSaltSync(10);



router.post('/signup',(req,res) => {
    const { name,email,password }  = req.body;
    if(!email || !password || !name) {
        res.status(400).json({error:"Please add all the fields!"});
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
           return res.status(400).json({error:"User already exists with that email!"});
        }
        bcrypt.hash(password, salt)
        .then(hash=>{
            const newUser = new User({
                name: name,
                email: email,
                password: hash
            })

            newUser.save()
            .then((user)=>{
                res.status(200).json({massage:"Saved user successfully "});
            })
            .catch(err=>{
                console.error(err);
            })
        }) 
    })
    .catch(err=>{
        console.error(err);
    })
    res.json({massage:"Successfully posted!"});

})

router.post('/signin',(req,res)=>{
    console.log(req.body);
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({loginSuccess: false,error:"Please provide email or password!"});
    }
    User.findOne({email:email})
    .then(savedUser=>{
        console.log(savedUser);
        if(!savedUser){
            return res.status(400).json({loginSuccess: false,error:"Invalid email or password!"});
        }
        bcrypt.compare(password, savedUser.password)
        .then((match) => {
            if(match){
                const token = jwt.sign({_id: savedUser._id},JWT_SECRET)
                const {_id,name,email,avatar} = savedUser
                console.log(token);
                
                res.status(200).json({loginSuccess: true,massage:"Login successfully!",token:token,user:{_id,email,name,avatar}});
            }
            else{
                return res.status(400).json({loginSuccess: false,error:"Invalid email or password!"});
            }
        })
        .catch(err=>{
            console.error(err);
        })
    })
    .catch(err=>{
        console.error(err);
    })
})

module.exports = router;

