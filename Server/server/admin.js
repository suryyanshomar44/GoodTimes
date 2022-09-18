const Express = require('express');
const router = Express.Router();
const commentController = require("./controller/commentController");
const blogController = require("./controller/blogController");
const verificationRequestController = require("./controller/verificationRequestController")
const messageController = require("./controller/messageController");
const couponController = require("./controller/couponController")
const blogCategoryController = require("./controller/blogCategoryController");
const seoController = require("./controller/seoController");
const Interceptor = require("../Utils/Interceptor");

router.delete("/comment/:_commentId", Interceptor.authUser, Interceptor.adminAuth, commentController.deleteOne);
router.put("/comment/:_commentId", Interceptor.authUser, Interceptor.adminAuth, commentController.updateOne);
router.get("/comment/:commentIndex", Interceptor.authUser, Interceptor.adminAuth, commentController.getComments);

router.get("/blog", Interceptor.authUser, Interceptor.adminAuth, blogController.getBlogs);
router.put("/blog/:_blogId", Interceptor.authUser, Interceptor.adminAuth, blogController.approveBlog)

router.get("/requestVerification", Interceptor.authUser, Interceptor.adminAuth, verificationRequestController.getAll)
router.delete("/requestVerification/:_verificationRequestId", Interceptor.authUser, Interceptor.adminAuth, verificationRequestController.deleteOne)
router.put("/requestVerification/:_verificationRequestId", Interceptor.authUser, Interceptor.adminAuth, verificationRequestController.approveOne)

router.delete("/message/:_messageId", Interceptor.authUser, Interceptor.adminAuth, messageController.deleteOne);
router.get("/message", Interceptor.authUser, Interceptor.adminAuth, messageController.getMessages);

router.post("/coupon", Interceptor.authUser, Interceptor.adminAuth, couponController.createOne);
router.put("/coupon", Interceptor.authUser, Interceptor.adminAuth, couponController.updateOne);
router.delete("/coupon/:_couponId", Interceptor.authUser, Interceptor.adminAuth, couponController.deleteOne);
router.get("/coupon", Interceptor.authUser, Interceptor.adminAuth, couponController.getAll)

router.get("/blogCategory", blogCategoryController.getAll);
router.post("/blogCategory",  blogCategoryController.update);
router.post("/addblogsubcategory", Interceptor.authUser, Interceptor.adminAuth, blogCategoryController.addSubcategory);

router.post('/setstate', Interceptor.authUser, Interceptor.adminAuth, blogController.updateState)

router.post('/createstore', Interceptor.authUser, Interceptor.adminAuth, blogController.CreateStore)
router.get('/getstores', blogController.getStores)

router.post('/publicimages',couponController.addImage);

router.post("/promoteblogs", Interceptor.authUser, Interceptor.adminAuth, blogCategoryController.promoteblogs);
router.post("/rejectblog", Interceptor.authUser, Interceptor.adminAuth, blogController.rejectblog);

router.put('/seo', Interceptor.authUser, Interceptor.adminAuth,seoController.editSeo)
router.get('/seo', seoController.getSeo)

module.exports = router;