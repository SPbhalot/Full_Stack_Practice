const mongoos = require('mongoose')
const userSchema = mongoos.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

module.exports=mongoos.model('User', userSchema);