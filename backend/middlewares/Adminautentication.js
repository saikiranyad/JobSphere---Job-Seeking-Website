import jwt from 'jsonwebtoken'

const adminAuth = async(req,res,next)=>{
    try{
        const {token} = req.headers
        if(!token){
            return res.json({success:false,mesage:"Not Authorized"})

        }
        const token_decode = jwt.verify(token,'SAI');
        if(token_decode !== process.env.ADMINEMAIL+process.env.ADMINPASSWORD){
            return res.json({success:false,message:"Not Authorized"})
        }
        next()

    }catch(err){
        console.log(err)
        res.json({success:false,message:'error occurs in admin auth middleware api',err})

    }
}


export default adminAuth;