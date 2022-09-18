'use strict';

const blogHelper = require('../helpers/blogHelper');
const To = require('../../Utils/To');
const Error = require('../../Utils/Error');
const Validations = require('../../Utils/Validations');
const Blog = require('../models/Blog');
const mongoose = require('mongoose');
const { search } = require('../services/userService');
const Store = require('../models/store');
const APIFeatures = require('../../Utils/apiFeatures');

module.exports = {
  createOne: createOne,
  getBlogs: getBlogs,
  getOne: getOne,
  getOneBylink: getOneBylink,
  approveBlog: approveBlog,
  getHomepageBlogs: getHomepageBlogs,
  getPromotedBlogs,
  getMostViewed,
  getMostRecents,
  getCategoryblogs,
  rejectblog,
  SearchBlog,
  ShareCount,
  updateState,
  getStores,
  CreateStore,
  filteredBlog,
  getBlogsFromSubcategory,
  updateBlogById,
};

async function updateBlogById(req, res) {
  const blogId = req.params.id;
  const blogURLExist = await Blog.findOne({ dynamicUrl: req.body.dynamicUrl });
  console.log(blogURLExist);
  if (blogURLExist) {
    return res.status(400).json({
      status: 'FAILURE',
      message: 'ERROR LINK Already Taken',
    });
  } else {
    Blog.findByIdAndUpdate(
      blogId,
      req.body,
      { returnOriginal: 'after' },
      (err, doc) => {
        if (err)
          return res.status(400).json({
            status: 'FAILURE',
            message: 'INTERNAL SERVER ERROR!',
          });

        return res.status(200).json({
          status: 'SUCCESS',
          data: doc,
          message: 'BLOG UPDATED SUCCESSFULLY!',
        });
      }
    );
  }
}

async function filteredBlog(req, res) {
  try {
    const features = new APIFeatures(Blog.find().populate('userId'), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    return res.status(200).json({
      message: 'Successfuly Fetched!',
      results: doc.length,
      data: doc,
    });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while creating a blog: ' + error,
        data: null,
      });
    }
  }
}

async function createOne(req, res) {
  try {
    let error, result, flags;
    // console.log('req.user', req.authUser);
    // console.log('req.body', req.body);
    // console.log('req.params', req.params, flags);
    if (!req.body.title) {
      throw new Error('Title is either missing or invalid', 400, null);
    }
    if (!req.body.category) {
      throw new Error('Category is either missing or invalid', 400, null);
    }
    if (!req.body.content) {
      throw new Error('Content is either missing or invalid', 400, null);
    }
    if (!req.body.thumbnail) {
      throw new Error('Thumbnail is either missing or invalid', 400, null);
    }
    if (!req.body.blogText) {
      throw new Error('Blog text is either missing or invalid', 400, null);
    }
    console.log(req.originalUrl)
    if (req.originalUrl === '/api/guest/blog') {
      if (!req.body.username) {
        throw new Error('Name is either missing or invalid', 400, null);
      }
      if (!req.body.about) {
        throw new Error('About author is either missing or invalid', 400, null);
      }
      req.body.isGuest = true;
    } else {
      req.body.userId = req.authUser.id;
      req.body.isGuest = false;
    }
    //console.log(req.authUser,req.body)
    [error, result] = await To(
      blogHelper.createOne(req.authUser,req.body, req.params, flags)
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    if (result.data.isDraft) {
      res.send({
        code: 200,
        message: 'Blog saved to draft successfully',
        data: result.data,
      });
    } else {
      res.send(result);
    }
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while creating a blog: ' + error,
        data: null,
      });
    }
  }
}

async function getBlogs(req, res) {
  try {
    let error, result, flags;
    let body = {};

    if (
      (req.query.blogIndex !== 0 && !req.query.blogIndex) ||
      req.query.blogIndex < 0
    ) {
      throw new Error('Blog index is either missing or invalid', 400, null);
    }

    if (req.originalUrl.includes('user')) {
      if (req.query.isDraft === 'true') {
        body = {
          isDraft: 1,
          isApproved: 0,
        };
      } else if (req.query.isDraft === 'false') {
        body = {
          isDraft: 0,
          isApproved: 1,
        };
      } else if (req.query.isPendingApproval === 'true') {
        body = {
          isDraft: 0,
          isApproved: 0,
        };
      } else {
        throw new Error('Query params either missing or invalid', 400, null);
      }
      (body.userId = req.authUser.id), (body.blogIndex = req.query.blogIndex);
    } else if (req.originalUrl.includes('admin')) {
      body = {
        blogIndex: req.query.blogIndex,
        isApproved: 0,
        isDraft: 0,
      };

      if (req.query.isGuestBlogs === 'true') {
        body.isGuest = 1;
      } else if (req.query.isGuestBlogs === 'false') {
        body.isGuest = 0;
      } else {
        throw new Error('Query params either missing or invalid', 400, null);
      }
    }

    [error, result] = await To(
      blogHelper.search(req.authUser, body, req.params, flags)
    );

    if (error) {
      throw new Error(error.message, error.code, error.data);
    }
    console.log(result);
    if (body.isGuest) {
      return res.send({
        code: 200,
        message: 'Guest blogs fetched successfully',
        data: result.data,
      });
    } else {
      return res.send({
        code: 200,
        message: 'User blogs fetched successfully',
        data: result.data,
      });
    }
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching blogs: ' + error,
        data: null,
      });
    }
  }
}

async function getOne(req, res) {
  try {
    let result, error;
    let flags = {};

    if (!Validations.isValidMongoObjectId(req.params._blogId)) {
      throw new Error('Invalid blogId', 400, null);
    }

    [error, result] = await To(
      blogHelper.getOne(req.authUser, {}, req.params, flags)
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    res.send(result);
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching one blog: ' + error,
        data: null,
      });
    }
  }
}
async function getOneBylink(req, res) {
  try {
    let result, error;
    let flags = {};
    let dynamicUrl = req.params.url;
    // if (!Validations.isValidMongoObjectId(req.params._blogId)) {
    //   throw new Error('Invalid blogId', 400, null);
    // }
    [error, result] = await To(
      blogHelper.getOne(req.authUser, {}, req.params, flags, dynamicUrl)
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }
    res.send(result);
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching one blog: ' + error,
        data: null,
      });
    }
  }
}

async function approveBlog(req, res) {
  try {
    let error, result, flags;

    if (!Validations.isValidMongoObjectId(req.params._blogId)) {
      throw new Error('Blog id is either missing or invalid', 400, null);
    }

    [error, result] = await To(
      blogHelper.updateOne(
        req.authUser,
        { _id: req.params._blogId },
        req.params,
        { isApproveBlog: true }
      )
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    res.send({ code: 200, message: 'Blog approved successfully', data: null });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while approving one blog: ' + error,
        data: null,
      });
    }
  }
}

async function getHomepageBlogs(req, res) {
  try {
    let error, result, flags;

    [error, result] = await To(
      blogHelper.getHomepageBlogs(req.authUser, req.body, req.params, flags)
    );
    if (error) {
      throw new Error(error.message, error.code, error.data);
    }

    res.send({
      code: 200,
      message: 'Homepage blogs fetched successfully',
      data: result.data,
    });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching homepage blogs: ' + error,
        data: null,
      });
    }
  }
}

async function getPromotedBlogs(req, res) {
  try {
    let { page } = req.query;
    let perpage = page ? 5 : 20;
    // if(!page||!parseInt(page)){
    //     return res.status(400).json(errormessage("Page no should be present or should not be zero!"))
    // }

    page = page ? parseInt(page) : 0;

    let start = page ? (page - 1) * perpage : 0;

    let blogs = await Blog.find({ isPromoted: true, isApproved: true })
      .skip(start)
      .limit(perpage);
    res
      .status(200)
      .json({ message: 'Promoted blogs fetched successfully', data: blogs });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching homepage blogs: ' + error,
        data: null,
      });
    }
  }
}

async function getMostViewed(req, res) {
  try {
    let { page } = req.query;
    let perpage = page ? 5 : 20;
    // if(!page||!parseInt(page)){
    //     return res.status(400).json(errormessage("Page no should be present or should not be zero!"))
    // }

    page = page ? parseInt(page) : 0;

    let start = page ? (page - 1) * perpage : 0;
    let blogs = await Blog.find({ isApproved: true })
      .sort({ viewCount: -1 })
      .skip(start)
      .limit(perpage);
    console.log(page, blogs.length);
    res
      .status(200)
      .json({ message: 'Most Viewed blogs fetched successfully', data: blogs });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching homepage blogs: ' + error,
        data: null,
      });
    }
  }
}

async function getMostRecents(req, res) {
  try {
    let { page } = req.query;
    let perpage = page ? 5 : 20;
    // if(!page||!parseInt(page)){
    //     return res.status(400).json(errormessage("Page no should be present or should not be zero!"))
    // }

    page = page ? parseInt(page) : 0;

    let start = page ? (page - 1) * perpage : 0;
    let blogs = await Blog.find({ isApproved: true })
      .sort({ createdOn: -1 })
      .skip(start)
      .limit(perpage);
    res
      .status(200)
      .json({ message: 'Most Recent blogs fetched successfully', data: blogs });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching homepage blogs: ' + error,
        data: null,
      });
    }
  }
}

async function getCategoryblogs(req, res) {
  try {
    let { category } = req.query;
    let { page } = req.body;
    let perpage = page ? 5 : 20;
    // if(!page||!parseInt(page)){
    //     return res.status(400).json(errormessage("Page no should be present or should not be zero!"))
    // }

    page = page ? parseInt(page) : 0;

    let start = page ? (page - 1) * perpage : 0;
    let findConditions = {};
    if (category) {
      findConditions['category'] = category;
      findConditions['isApproved'] = true;
    }

    let blogs = await Blog.find(findConditions)
      .sort({ viewCount: -1 })
      .skip(start)
      .limit(perpage);
    res
      .status(200)
      .json({ message: 'Most Recent blogs fetched successfully', data: blogs });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching homepage blogs: ' + error,
        data: null,
      });
    }
  }
}

async function rejectblog(req, res) {
  try {
    let { blogid } = req.body;

    if (!blogid) {
      return res.status(400).json({ error: 'Blog id should be given!' });
    }

    let blogs = await Blog.findOneAndDelete({
      _id: mongoose.Types.ObjectId(blogid),
    });
    res
      .status(200)
      .json({ message: 'Blog rejected Successfuly!', data: blogs });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching homepage blogs: ' + error,
        data: null,
      });
    }
  }
}

async function SearchBlog(req, res) {
  try {
    let { search_text } = req.query;

    let findConditions = {};
    if (search_text) {
      findConditions.title = new RegExp(search_text, 'ig');
      findConditions.blogText = new RegExp(search_text, 'ig');
      findConditions['isApproved'] = true;
    }
    console.log(findConditions);

    let blogs = await Blog.find(findConditions).sort({ viewCount: -1 });
    res.status(200).json({ message: 'All Blogs', data: blogs });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching homepage blogs: ' + error,
        data: null,
      });
    }
  }
}

async function ShareCount(req, res) {
  try {
    let { blogid } = req.body;
    if (!blogid) {
      return res.status(400).json({ error: 'Blogid should be present!' });
    }
    blogid = mongoose.Types.ObjectId(blogid);
    let updates = {
      $inc: { shareCount: 1 },
    };
    let updatedBlog = await Blog.findOneAndUpdate({ _id: blogid }, updates, {
      new: true,
    });
    if (!updatedBlog) {
      return res.status(400).json({ error: "Couldn't Update!" });
    }

    res.status(200).json({ message: 'Successfuly Updated!' });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching homepage blogs: ' + error,
        data: null,
      });
    }
  }
}

async function updateState(req, res) {
  try {
    let { blogid, status } = req.body;
    if (!blogid) {
      return res
        .status(400)
        .json({ error: 'Blogid or status should be present!' });
    }
    blogid = mongoose.Types.ObjectId(blogid);

    let updatedblog = await Blog.findOneAndUpdate(
      { _id: blogid },
      { $set: { status } },
      { new: true }
    );

    res.status(200).json({ message: 'Successfuly Updated!', updatedblog });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching homepage blogs: ' + error,
        data: null,
      });
    }
  }
}

async function CreateStore(req, res) {
  try {
    let store = new Store({ ...req.body, coupons: [] });
    await store.save();
    res.status(200).json({ message: 'SUccessfully created !', data: store });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching homepage blogs: ' + error,
        data: null,
      });
    }
  }
}

async function getStores(req, res) {
  try {
    let { page } = req.query;
    let perpage = page ? 5 : 20;
    // if(!page||!parseInt(page)){
    //     return res.status(400).json(errormessage("Page no should be present or should not be zero!"))
    // }

    page = page ? parseInt(page) : 0;

    let start = page ? (page - 1) * perpage : 0;
    let stores = await Store.find({})
      .populate('coupon')
      .sort({ name: 1 })
      .skip(start)
      .limit(perpage);
    res.status(200).json({ message: 'Successfuly Fetched!', data: stores });
  } catch (error) {
    if (error && error.code && error.message) {
      res.send({ code: error.code, message: error.message, data: error.data });
    } else {
      res.send({
        code: 500,
        message: 'Error while fetching homepage blogs: ' + error,
        data: null,
      });
    }
  }
}

// async function getSharecounts(req,res){
//     try{
//         let {blogid}=req.body;
//         if(!blogid){
//             return res.status(400).json({error:"Blogid should be present!"});
//         }
//         blogid=mongoose.Types.ObjectId(blogid);
//         let updatedBlog= await Blog.findOneAndUpdate({_id:blogid},updates,{new:true});
//         if(!updatedBlog){
//             return res.status(400).json({error:"Couldn't Update!"});
//         }

//         res.status(200).json({message:"Successfuly Updated!"});
//     }catch(error){
//         if (error && error.code && error.message) {
//             res.send({ code: error.code, message: error.message, data: error.data });
//         } else {
//             res.send({ code: 500, message: "Error while fetching homepage blogs: " + error, data: null });
//         }
//     }
// }

async function getBlogsFromSubcategory(req, res) {
  const { category, subcategory } = req.body;
  console.log(category, subcategory);
  if (!subcategory || !category) {
    return res.status(400).json({ error: 'All fields should be given!' });
  }

  let blogs = await Blog.find({ category: category, subcategory: subcategory });
  console.log(blogs);
  if (!blogs) {
    return res.status(400).json({ error: 'Category does not exist!' });
  }
  return res.status(200).json({
    data: blogs,
    message: `ALL BLOGS OF CATEGORY:${category} and SUB-CATEGORY: ${subcategory}`,
  });
}
