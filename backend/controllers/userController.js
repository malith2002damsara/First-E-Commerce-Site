import userModel from '../models/userModel.js';
import validator from "validator";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"




const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)

}


// Route for user login
const loginUser = async (req, res) => {

  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User does not exist" })
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id)
      res.json({ success: true, token })
    }
    else {
      return res.status(400).json({ success: false, message: "Invalid password" })
    }


  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" })


  }
}

// Route for user registration
const registerUser = async (req, res) => {
  // res.json({message:"Registration API working"})

  try {
    const { name, email, password } = req.body

    //check already user exist or not
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.status(400).json({ success: false, message: "User already exists" })
    }

    //validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" })
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" })
    }

    //hashing user password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //creating user in db
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    })

    const user = await newUser.save()

    const token = createToken(user._id)
    res.json({ success: true, token })



  }
  catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

// Route for admin login
const adminLogin = async (req, res) => {

  try{
    const { email, password } = req.body;

    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
      const token = jwt.sign(email+password, process.env.JWT_SECRET);
      res.json({success:true, token})
  }else{
    return res.status(400).json({success:false, message:"Invalid credentials"});
  }
}catch(error){
    console.log(error);
    res.status(500).json({success:false, message:"Internal server error"})
  }
}

export { loginUser, registerUser, adminLogin };