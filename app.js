const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGOURI } = require('./config/keys');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
console.log(MONGOURI)
mongoose.connect(MONGOURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

mongoose.connection.on('connected',()=>{
    console.log('MongoDb is connecting!')
})
mongoose.connection.on('error',(err)=>{
    console.log('MongoDb connection error!',err)
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('./routers/auth'));
app.use(require('./routers/post'));
app.use(require('./routers/user'));


if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}
       



app.listen(PORT,()=>{
    console.log("server is running on",PORT)
})