const User = require("../models/User");
const bcrypt = require('bcrypt')

const getUsers = async (req,res) =>{
    try{
        const users = await User.find()
        if(!users) return res.status(400).json({msg:'no users'})
        res.status(200).json(users)
    }catch(err){
        res.status(500).json({msg:err})
    }
}
const  getUserbyId = async(req,res) =>{
  try{
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ name: user.name });
  }catch(err){
    res.status(500).json({msg:err})
  }
}

const getUserbyName = async(req,res) =>{
  try{
    const {name} = req.query;

    if(!name) return res.status(400).json({msg:'User dont exist'})

    const user = await User.find({name: new RegExp(name,"i")})
    // console.log(user)
    if(user.length === 0) return res.status(404).json({msg:'User Not Found'})

    res.status(200).json(user)
  }catch(err){
    res.status(500).json({msg:`Something went wrong`,err})
  }
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password,salt)
    const newUser = new User({ name, email, password: hashPassword });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    return res.status(200).json({msg:'Login Successful', userId: user._id})
  } catch (err) {
    res.status(500).json({ error: "Failed to login user" });
  }
};

module.exports = { register, login, getUsers, getUserbyId, getUserbyName };
