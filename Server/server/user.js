const Express = require('express');
const router = Express.Router();
const userController = require('./controller/userController');
const verificationRequestController = require('./controller/verificationRequestController');
const blogController = require('./controller/blogController');
const commentController = require('./controller/commentController');
const statController = require('./controller/statController');
const messageController = require('./controller/messageController');
const couponController = require('./controller/couponController');
const Interceptor = require('../Utils/Interceptor');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
// router.put('/updateuser', Interceptor.authUser, userController.updateOne);
router.put('/updateuser/:id', userController.updateUser);
router.get('/isLoggedIn', Interceptor.authUser, userController.isLoggedIn);
router.get('/logout', userController.logout);

router.post('/blog', Interceptor.authUser, blogController.createOne);
router.get('/blog', Interceptor.authUser, blogController.getBlogs);
router.put('/blog/:id', Interceptor.authUser, blogController.updateBlogById);
router.get('/blog/filtered', blogController.filteredBlog);
router.post('/blog/subcategory', blogController.getBlogsFromSubcategory);
router.get('/blog/:_blogId', blogController.getOne);
router.get('/blog/url/:url', blogController.getOneBylink);

router.get('/homepageBlogs', blogController.getHomepageBlogs);
router.post('/comment', Interceptor.authUser, commentController.createOne);
router.get('/comment/:_blogId/:commentIndex', commentController.getComments);

router.get(
  '/requestVerification',
  Interceptor.authUser,
  verificationRequestController.createOne
);

router.get('/stat', Interceptor.authUser, statController.getStat);

router.put('/stat/:_blogId', statController.updateOne);

router.post('/message', Interceptor.authUser, messageController.createOne);

router.post('/ratings', userController.starRating);
router.post('/blogratings', userController.blogRating);
router.post('/getblogratings', userController.getBlograting);
router.get('/getblogsviarating', userController.getBlogsviarating);
router.get('/getcomments', Interceptor.authUser, userController.getComments);

router.get('/coupon', couponController.getAll);
router.get('/coupon/:_couponId', couponController.getOne);

module.exports = router;
