const Blog = require("../models/Blog");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const customErr = require("../errors");
const { default: mongoose } = require("mongoose");

const getAllBlogs = async (req, res, next) => {
  const blogs = await Blog.find({}).populate('user');
  if (!blogs) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "No blogs found!!" });
  }
  return res.status(StatusCodes.OK).json({ blogs, count: blogs.length });
};

const getSingleBlog = async (req, res, next) => {
  const blog = await Blog.findOne({ _id: req.params.id });
  if (!blog) {
    throw new customErr.NotFoundError(
      `No blog is found with id${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({ blog });
};

const addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;
  const existingUser = await User.findById(user);
  if (!existingUser) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `Unable to find User with id ${user}` });
  }

  const blog = new Blog({
    title,
    description,
    image,
    user,
  });
  const session = await mongoose.startSession();
  session.startTransaction();
  await blog.save({ session });
  existingUser.blogs.push(blog);
  await existingUser.save({ session });
  await session.commitTransaction();
  return res.status(StatusCodes.CREATED).json({ blog });
};

const updateBlog = async (req, res, next) => {
  const { title, description,image } = req.body;

  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    {
      title,
      description,
      image
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!blog) {
    throw new customErr.NotFoundError(`No blog found with id ${req.params.id}`);
  }
  return res.status(StatusCodes.OK).json({ blog });
};

const deleteBlog = async (req, res, next) => {
  const blog = await Blog.findByIdAndRemove(req.params.id).populate("user");
  await blog.user.blogs.pull(blog);
  await blog.user.save();
  if (!blog) {
    throw new customErr.NotFoundError(`No blog found with id ${req.params.id}`);
  }
  return res.status(StatusCodes.OK).json({ msg: "Deleted Successfully!!" });
};

const getByUserId = async (req, res, next) => {
  const userId = req.params.id;
  const userBlogs = await User.findById(userId).populate("blogs");
  if (!userBlogs) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: `No blogs found` });
  }
  return res.status(StatusCodes.OK).json({user:userBlogs})
};

module.exports = {
  getAllBlogs,
  getSingleBlog,
  addBlog,
  updateBlog,
  deleteBlog,
  getByUserId
};
