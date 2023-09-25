const jwt = require('jsonwebtoken')
const secretKey="sandeep@12bhalot"
async function verify  (req,res,next){
    if(!req.headers['authorization']){
    res.json({
        "Status":0,
        "Error":"Token is Missing"
    })
    }else{
        if( await jwt.verify(req.headers['authorization'],secretKey)){
            next()
        }else{
            res.json({
                "Status":0,
                "Error":"Token is expaird"
            })
        }
    }

}
module.exports=verify;