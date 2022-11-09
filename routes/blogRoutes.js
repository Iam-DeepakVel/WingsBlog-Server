const express = require("express");
const router = express.Router();
const {getAllBlogs, getSingleBlog ,addBlog , updateBlog , deleteBlog,getByUserId} = require('../controllers/blogController')

router.route('/').get(getAllBlogs)
router.route('/add').post(addBlog)
router.route('/update/:id').patch(updateBlog)
router.route('/delete/:id').delete(deleteBlog)
router.route('/user/:id').get(getByUserId)

router.route('/:id').get(getSingleBlog)


module.exports = router;
