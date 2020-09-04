const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
const User = require('../models/user');
const Post = require('../models/post');
const requireLogin = require('../middlewares/requireLogin');
const { Router } = require('express');


router.get('/user/:id',requireLogin,(req,res)=>{
    User.findById({_id:req.params.id})
    .select("-password")
    .then(user=>{     
        Post.find({postBy:req.params.id})
        .populate("comment.postBy","_id name avatar")
        .populate("postBy","_id name avatar")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            console.log(user)
            res.json({user,posts})
        })
    })
    .catch(err=>{
        console.error(err);
    })
})

router.get('/myinfouser',requireLogin,(req,res)=>{
    User.findById({_id:req.user._id})
    .then(user=>{
        res.json(user);
    })
    .catch(err=>{
        return res.status(422).json({error:err})
    })
})

router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
            
        },{new:true})
        .select("-password")
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
    
})

router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,reuslt)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{
            new:true
        })
        .select("-password")
        .then(result=>{
            res.json(result)
        })
        .catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put('/avatar',requireLogin,(req,res)=>{
    const {imageUrl} = req.body;
    if(!imageUrl){
        return res.status(422).json({err:"Please add all the fields"});
    }
    User.findByIdAndUpdate(req.user._id,{
        $set:{avatar:req.body.imageUrl}
    },{
        new:true
    })
    .select("-password")
    .then(result=>{
        res.json(result)
    })
    .catch(err=>{
        return res.status(422).json({error:err})
    })
})
module.exports = router;
