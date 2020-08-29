const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    body:{
        type: String,
        required: true
    },
    photo:{
        type: String,
        default: "no photo"
    },
    like:[{type:ObjectId,ref:"User"}],
    comment:[{
        text: String,   
        postBy:{type:ObjectId,ref:"User"}
    }],
    postBy:{
        type: ObjectId,
        ref: "User"
    },
    date: { type: Date, default: Date.now }
})

const Post = mongoose.model("Post",postSchema);



module.exports = Post;