const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  blogs:[
    {
      type:mongoose.Types.ObjectId,
      ref:'Blog',
      required:true
    }
  ]
},{timestamps:true});

module.exports = mongoose.model("User", userSchema);
//By default mongodb will store the documents as users i.e it store User(A word with capital letter in singular) --> users(A word with small letter in plural)
