const jwt= require('jsonwebtoken');
const express= require('express');
const auth=express.Router()
const secretKey="sandeep@12bhalot"
const verify = require('./middleware/verifyToken');
const user= require('./models/userModel')
const validation= require('./validator/validation')

auth.post('/registration',async (req,res)=>{
   const isExist=await user.findOne({email:req.body.email}).exec()

   if( !isExist ){
      if(!validation.emailValidation(req.body.email)){
         res.send({
            "Status":0,
            "Msg":"email id is not valid"
         })
         return ;
      }
      if(!validation.passValidation(req.body.password)){
         res.send({
            "Status":0,
            "Msg":"password should be at least one numeric,one latter and special character "
         })
         return ;
      }
   let newUser=new user({
      name:req.body.name,
      email:req.body.email,
      password:req.body.password
    })
    newUser.save().then(()=>{
      res.send({
         "Status":1,
         "Msg":"user save Successfully",
      })
    }).catch((err)=>{
       res.send(err)
    })
   }else{
      res.send({
         "Status":0,
         "Msg":"email is registred"
      })
   }
})

auth.post('/login',async (req,res)=>{
   const {email,password}=req.body
   let token=jwt.sign(req.body,secretKey, {expiresIn: '500s'})
   const Exist = await user.findOne({"email":email,'password':password});
   if(Exist){
   res.send({
      "Status":1,
      "Token":token,
      "Msg":"Welcome back",
   })
}else{
   res.status(401).send({
      "Status":0,
      "Error":"User credential wrong"
   })
}
})

module.exports=auth