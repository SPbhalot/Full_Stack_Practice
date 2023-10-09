const jwt= require('jsonwebtoken');
const nodemailer = require("nodemailer");
const express= require('express');
const handlebars= require('handlebars');
const fs = require('fs');
const auth=express.Router()
const secretKey="sandeep@12bhalot"
const verify = require('./middleware/verifyToken');
const user= require('./models/userModel')
const otpStore= require('./models/optModel')
const validation= require('./validator/validation')


let expirationTime=null;
let currentTime=null;
let otp=null
const transporter = nodemailer.createTransport({
   service: 'gmail',
   port: 465,
   type: "SMTP",
   host: "smtp.gmail.com",
   secure: true,
   auth: {
     user: "bhalotKk@gmail.com",
     pass: "iwaw nqsq doem pqdi",
   },
 });

 async  function SentMailService(email){
   const source = fs.readFileSync('./html/otpEmail.html', 'utf-8');
   const template = handlebars.compile(source);
   otp= Math.floor(Math.pow(10, 6-1) + Math.random() * (Math.pow(10, 6) - Math.pow(10, 6-1) - 1));
   currentTime = new Date().getTime();
   expirationTime = currentTime + 3 * 60 * 1000; 
   const htmlTemplate = template({otp});
   const info = await transporter.sendMail({
      from: 'bhalotKk@gmail.com', // sender address
      to: email, // list of receivers
      subject: "no-reply-OTP", // Subject line
      text: "", // plain text body
      html: htmlTemplate // html body
    },(err,data)=>{
      if(err) {
         console.log(err);
     } else {
         console.log('Email sent successfully');
     }
    });
    
    let OptCreation=new otpStore({
      email:email,
      Otp:otp
    })
    OptCreation.save()
    setTimeout(async() => {
       await otpStore.deleteOne({"email":email});
    }, 2 * 60 * 1000);
 }

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
      SentMailService(req.body.email)
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
   let token=jwt.sign(req.body,secretKey, {expiresIn: '24h'})
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



auth.post('/verifyOtp',async (req, res)=>{
   console.log(req.body.otp,otp,currentTime,expirationTime)
   if (req.body.otp == otp  && currentTime <= expirationTime) {
      otp = null;
      currentTime=null
      expirationTime = null;
      return res.status(200).send({
         "Status":1,
         "Error":"otp is verified"
      });
    }else{
      return res.status(200).send({
         "Status":0,
         "Error":"otp is invalid"
      });
    }
}
)

module.exports=auth