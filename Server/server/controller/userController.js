'use strict'

const userHelper = require("../helpers/userHelper");
const verificationRequestHelper = require("../helpers/verificationRequestHelper")
const To = require("../../Utils/To");
const Error = require("../../Utils/Error");
const Validations = require("../../Utils/Validations");
const Blog = require("../models/Blog");
const User =require("../models/User")
const mongoose = require('mongoose');
const Comment = require('../models/Comment');

module.exports = {
    signup: signup,
    signin: signin,
    updateOne: updateOne,
    updateUser: updateUser,
    logout: logout,
    isLoggedIn: isLoggedIn,
    starRating: starRating,
    getBlograting,
    blogRating,
    getBlogsviarating,
    getComments
}


async function signup(req, res) {
    try {
        let error, result, accessToken;
        if (!req.body) {
            throw new Error("Signup data missing", 400, null)
        }
        if (!req.body.signupType) {
            throw new Error("Signup type missing", 400, null);
        }
        if (req.body.signupType !== 'gmail' && req.body.signupType !== 'facebook' && req.body.signupType !== 'email') {
            throw new Error(`Invalid signup type`, 400, null);
        }
        if ((!req.body.userId) && (req.body.signupType === 'email')) {
            throw new Error(`${req.body.signupType} id missing`, 400, null);
        }

        if (req.body.signupType === 'email') {
            if (!req.body.password) {
                throw new Error(`Password is either missing or invalid`, 400, null);
            }
            if (req.body.password.length < 8) {
                throw new Error(`Password must be atleat 8 characters long`, 400, null);
            }
            // TODO : regex to validate password pattern
        }

        if (req.body.signupType === 'gmail' || req.body.signupType === 'facebook') {
            if (!req.body.firebaseToken) {
                throw new Error("Firebase token missing", 400, null);
            }
        }

        [error, result] = await To(userHelper.signup(req.authUser, req.body, req.params, req.flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        accessToken = result.accessToken;
        delete result.accessToken;

        res.cookie("accessToken", accessToken, {
            expires: new Date(Date.now() + 86400 * 1000),
            sameSite: "none",
            secure: process.env.NODE_ENV !== "development",
            // secure: false,
            httpOnly: true,
        })
            .cookie("authSession", true, {
                expires: new Date(Date.now() + 86400 * 1000),
                sameSite: "none",
                secure: process.env.NODE_ENV !== "development"
                // secure: false,
            })
            .send(result);

    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
            console.log(error.message)
        } else {
            res.send({ code: 500, message: "Error while signing up: " + error, data: null });
        }
    }
}

async function signin(req, res) {
    try {
        let error, result, accessToken;
        if (!req.body) {
            throw new Error("signin data missing", 400, null)
        }
        if (!req.body.signinType) {
            throw new Error("signin type missing", 400, null);
        }
        if (req.body.signinType !== 'gmail' && req.body.signinType !== 'facebook' && req.body.signinType !== 'email') {
            throw new Error(`Invalid signin type`, 400, null);
        }
        if ((!req.body.userId) && (req.body.signinType === 'email')) {
            throw new Error(`${req.body.signinType} id missing`, 400, null);
        }
        if ((!req.body.password) && (req.body.signinType === 'email')) {
            throw new Error(`Password is either missing or invalid`, 400, null);
        }
        if ((req.body.signinType === 'gmail' || req.body.signinType === 'facebook') && (!req.body.firebaseToken)) {
            throw new Error(`Firebase token is either missing or invalid`, 400, null);
        }

        [error, result] = await To(userHelper.signin(req.authUser, req.body, req.params, req.flags))
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        accessToken = result.accessToken;
        delete result.accessToken;

        res.cookie("accessToken", accessToken, {
            expires: new Date(Date.now() + 86400 * 1000),
            sameSite: "none",
            secure: process.env.NODE_ENV !== "development",
            // secure: false,
            httpOnly: true,
        })
            .cookie("authSession", true, {
                expires: new Date(Date.now() + 86400 * 1000),
                sameSite: "none",
                secure: process.env.NODE_ENV !== "development",
                // secure: false,
            })
            .send(result);
    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while signing in: " + error, data: null });
        }
    }
}

async function isLoggedIn(req, res) {
    try {
        let error, result;

        [error, result] = await To(userHelper.search(req.authUser, { '_id': req.authUser.id }, null, null));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        res.send({ code: 200, message: "User has logged in", data: result.data[0] });
    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while checking whether the user is logged in: " + error, data: null });
        }
    }
}

async function updateOne(req, res) {
    try {
        let error, result, flags;
        console.log(req.body)
        if (!req.body) {
            throw new Error("Required fileds missing", 400, null);
        }

        if (!req.body.username) {
            throw new Error("Username is either missing or invalid", 400, null);
        }
        if (!req.body.about) {
            throw new Error("About the auther is missing", 400, null);
        }
        if (!req.body.profile) {
            throw new Error("Profile pic is missing", 400, null);
        }
        
        [error, result] = await To(userHelper.updateOne(req.authUser, req.body, { _userId: req.authUser.id }, flags));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        res.send(result)

    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while signing in: " + error, data: null });
        }
    }
}

async function updateUser(req, res) {
    const userId = req.params.id;
  console.log(userId)
        let error, result, flags;
        console.log(req.body)
        if (!req.body) {
            throw new Error("Required fileds missing", 400, null);
        }

        if (!req.body.username) {
            throw new Error("Username is either missing or invalid", 400, null);
        }
        if (!req.body.about) {
            throw new Error("About the auther is missing", 400, null);
        }
        if (!req.body.profile) {
            throw new Error("Profile pic is missing", 400, null);
        
        }   
        else{ 
    User.findByIdAndUpdate(
            userId,
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
                message: 'UPDATED SUCCESSFULLY!',
              });
            }
          );
        }
    }





async function logout(req, res) {
    try {
        res
            .clearCookie("accessToken", {
                sameSite: "none",
                secure: process.env.NODE_ENV !== "development",
                httpOnly: true,
            })
            .clearCookie("authSession", {
                sameSite: "none",
                secure: process.env.NODE_ENV !== "development"
            });

        res.send({ code: 200, message: "User signed out successfully", data: {} });
    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while logging out user" + error, data: null });
        }
    }
};

async function starRating(req, res) {
    try {
        let error, result;

        if (!Validations.isValidMongoObjectId(req.body.userId)) {
            throw new Error("User id is either missign or invalid", 400, null);
        }
        if (!req.body.ratings) {
            throw new Error("Rating is missing", 400, null);
        } else if (req.body.ratings > 5 || req.body.ratings <= 0) {
            throw new Error("Invalid Ratings", 400, null);
        }

        [error, result] = await To(userHelper.updateOne(req.authUser, { 'ratings': req.body.ratings }, { '_userId': req.body.userId }, { 'isRatings': true }));
        if (error) {
            throw new Error(error.message, error.code, error.data);
        }

        res.send({ code: 200, message: "User rated successfully", data: null });
    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while rating" + error, data: null });
        }
    }
}

async function blogRating(req, res) {
    try {
        let { blogid, rating } = req.body;
        if (!blogid) {
            return res.status(400).json({ error: "All fields should be present!" });
        }
        rating = parseInt(rating);
        if (rating > 5 || rating <= 0) {
            return res.status(400).json({ error: "Invalid rating!" })
        }

        let updates = {
            $inc: { 'ratings.rating': rating, 'ratings.count': 1 }
        }

        let updatedblog = await Blog.findOneAndUpdate({ _id: mongoose.Types.ObjectId(blogid) }, updates, { new: true });
        res.status(200).json({ message: "Successfuly Rated!", data: updatedblog });


    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while rating" + error, data: null });
        }
    }
}

async function getBlograting(req, res) {
    try {
        let { blogid } = req.body;
        if (!blogid) {
            return res.status(400).json({ error: "All fields should be present!" });
        }

        let blog = await Blog.findOne({ _id: mongoose.Types.ObjectId(blogid) });
        if (!blog) {
            return res.status(404).json({ message: "Blog Not Found!" });
        }
        let ratings = blog.ratings.rating;
        let count = blog.ratings.count===0?1:blog.ratings.count  ;
        let avgrating = Math.round(ratings / count);
        res.status(200).json({ message: "Blog rating", avgrating });

    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while rating" + error, data: null });
        }
    }
}

async function getBlogsviarating(req, res) {
    try {
        let { blogid } = req.body;
        // if(!blogid){
        //     return res.status(400).json({error:"All fields should be present!"});
        // }
        let {page}=req.query;
        let perpage=page?5:20;
        // if(!page||!parseInt(page)){
        //     return res.status(400).json(errormessage("Page no should be present or should not be zero!"))
        // }

        page = page?parseInt(page):0;
        

        let start = page? (page - 1) * perpage:0;
        let blogs = await Blog.aggregate([
            {$match:{isApproved:true}},
            { $addFields: { 'avgrating': { $cond: [{ $eq: ["$ratings.count", 0] }, "$ratings.rating", { $divide: ["$ratings.rating", "$ratings.count"] }] } } },
            { $sort: { 'avgrating': -1 } },
            { $skip: start },
            { $limit: perpage },
        ])
        res.status(200).json({ message: "Blog rating", blogs });

    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while rating" + error, data: null });
        }
    }
}

async function getComments(req, res) {
    try {
        let { id } = req.authUser;
        id = mongoose.Types.ObjectId(id);

        let {page}=req.body;
        let perpage=page?5:20;
        // if(!page||!parseInt(page)){
        //     return res.status(400).json(errormessage("Page no should be present or should not be zero!"))
        // }

        page = page?parseInt(page):0;
        let start = page? (page - 1) * perpage:0;

        let comments = await Comment.aggregate([
            { $match: { isApproved: true } },
            {
                $lookup: {
                    from: 'blogs',
                    localField: 'blogId',
                    foreignField: '_id',
                    as: 'blogdetails'
                }
            },  
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userdetails'
                }
            },
            {
                $project: {
                    user:{$first:"$userdetails"},
                    blogId: 1,
                    userId: 1,
                    username: 1,
                    comment: 1,
                    isApproved:1,
                    isGuest:1,
                    targetuser: { $first: "$blogdetails" }
                }
            },
            { $addFields: { user2: "$targetuser.userId" } },
            { $match: { user2: id } },
            {$skip:start},
            {$limit:perpage}
        ]).allowDiskUse(true);
        res.status(200).json({ message: "Blog rating", comments });

    } catch (error) {
        if (error && error.code && error.message) {
            res.send({ code: error.code, message: error.message, data: error.data });
        } else {
            res.send({ code: 500, message: "Error while rating" + error, data: null });
        }
    }
}
