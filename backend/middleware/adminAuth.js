import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {


try{
  const {token} = req.headers
  if(!token){
    return res.status(401).json({success:false, message:"Not Authorized Login First"})
  }
  const token_decode = jwt.verify(token, process.env.JWT_SECRET);
  if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
    return res.status(401).json({success:false, message:"Unauthorized access"})
  }
  next()

}catch(error){
  console.log(error);
  res.status(500).json({success:false, message:"Internal server error"})

}
}

export default adminAuth