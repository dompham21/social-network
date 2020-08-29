if(process.env.NODE_ENV==='production'){
    module.exports = require('./props')
}else{
    module.exports = require('./dev')
}