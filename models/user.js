const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    avatar:{
        type: String,
        default:"https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ec139461-0935-4be4-b16e-e2456582bbf2/d47czgi-1f628ae8-e301-4187-8b8f-a8b35bbb9a30.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvZWMxMzk0NjEtMDkzNS00YmU0LWIxNmUtZTI0NTY1ODJiYmYyXC9kNDdjemdpLTFmNjI4YWU4LWUzMDEtNDE4Ny04YjhmLWE4YjM1YmJiOWEzMC5qcGcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.N5xaTgUXnrdNGv5Cv9xIDXH6oX27hABK-49V-4AxL5U"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following: [{type:ObjectId,ref:"User"}],
      
})

const User = mongoose.model("User",userSchema);



module.exports = User;