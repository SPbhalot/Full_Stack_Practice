const mongoos = require('mongoose')
const otpStore = mongoos.Schema({
    email:{
        type:String
    },
    Otp:{
        type:Number
    }
})

module.exports=mongoos.model('otpStore', otpStore);