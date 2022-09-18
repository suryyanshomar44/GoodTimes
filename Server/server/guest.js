const Express = require('express');
const router = Express.Router();
const blogController = require('./controller/blogController');
const commentController = require('./controller/commentController');
const messageController = require('./controller/messageController');
const couponController = require('./controller/couponController');

router.post('/blog', blogController.createOne);
router.post('/comment', commentController.createOne);
router.post('/message', messageController.createOne);
router.get('/promotedblogs', blogController.getPromotedBlogs);
router.get('/mostviewedblogs', blogController.getMostViewed);
router.get('/recentblogs', blogController.getMostRecents);
router.post('/categoryblogs', blogController.getCategoryblogs);
router.get('/searchblogs', blogController.SearchBlog);
router.post('/share_count', blogController.ShareCount);
router.get('/getAllCoupons', couponController.getAllCoupons);
router.post('/couponsviacountry', couponController.getCouponsViaCountry);
router.post('/couponsfiltered', couponController.getCouponsWithFilter);
router.get('/searchcoupon', couponController.getSearchCoupons);
router.get('/searchStore', couponController.searchStore);
router.get('/searchunexpiredcoupon', couponController.getUnexpiredCoupons);
router.get('/publicimages', couponController.getImages);
// router.get('/getsharecount', );

module.exports = router;
