const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
const Post = require('../models/post');
const requireLogin = require('../middlewares/requireLogin');

router.post('/createpost',requireLogin,(req,res) => {
    const { body,pic } = req.body;
    if(!body){
        return res.status(422).json({err:"Please add all the fields"});
    }
    const post = new Post({
        photo:pic,
        body,
        postBy: req.user
    });   
    post.save()
    .then(result=>{
        res.status(200).json({post:result});
    })
    .catch(err=>{
        console.error(err);
    })
    console.log(req.user);
})

router.get('/allpost',requireLogin,(req,res) => {
    Post.find()
    .populate("comment.postBy","_id name avatar")
    .populate("postBy","_id name avatar")
    .sort({date: 'descending'})
    .then(posts=>{
        res.json({posts:posts});
    })
    .catch(err=>{
        console.error(err);
    })
})

router.get('/mypost',requireLogin,(req,res) => {
    Post.find({ postBy: req.user._id })
    .populate("comment.postBy","_id name avatar")
    .populate("postBy","_id name avatar")
    .sort({date: 'descending'})
    .then(mypost=>{
        res.json({mypost:mypost})
    })
    .catch(err=>{
        console.error(err);
    })
})

router.put('/like',requireLogin,(req,res) => {
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{like: req.user._id}
    },{
        new: true
    })    
    .populate("comment.postBy","_id name avatar")
    .populate("postBy","_id name avatar")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else {
            res.json(result);

        }
    });
})

router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{like:req.user._id}
    },{
        new:true
    })
    .populate("comment.postBy","_id name avatar")
    .populate("postBy","_id name avatar")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res) => {
    const comment = {
        text : req.body.text,
        postBy:  req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comment:comment}
    },{
        new: true
    })
    .populate("comment.postBy","_id name avatar")
    .populate("postBy","_id name avatar")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else {
            res.json(result);
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    // .populate("postBy","_id name avatar")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }

        if(post.postBy._id.toString()===req.user._id.toString()){
            post.remove()
            .then(result=>{
                console.log(result);
                res.json(result)
            })
            .catch(err=>{
                console.error(err);
            })
        }
    
    })
})




module.exports = router;
