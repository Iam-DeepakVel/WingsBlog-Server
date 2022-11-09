const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res, next) => {
  const users = await User.find({});

  if (!users) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No Users Found" });
  }

  return res.status(StatusCodes.OK).json({ users, count: users.length });
};

const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter your credentials!!" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "User already Exists! Login Instead" });
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({ name, email, password: hashedPassword,blogs:[] });
  return res
    .status(StatusCodes.CREATED)
    .json({ user, msg: "Registered Successfully",user:existingUser });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter your credentials!!" });
  }
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res
      .status(StatusCodes.NOT_FOUND) 
      .json({ msg: "User not found" });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if(!isPasswordCorrect){
    return res.status(StatusCodes.UNAUTHORIZED).json({msg:"Invalid Credentials"})
  }
  return res.status(StatusCodes.OK).json({msg: "Login Successfull", user:existingUser})
};

module.exports = { getAllUsers, signUp, login };
