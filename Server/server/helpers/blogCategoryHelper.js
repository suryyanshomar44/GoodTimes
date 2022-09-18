const To = require("../../Utils/To");
const Error = require("../../Utils/Error");
const fs = require('fs').promises;

const Category = require('../models/category');


module.exports = {
    getAll: getAll,
    update: update
}

async function getAll(authUser, blogCategory, query, flags) {
    try {
        let result;

        if (!query) {
            query = {};
        } 


        let {istravel}=query;

        if (!flags) {
            flags = {};
        }

        let categorydata = await Category.find({istravel});
        return Promise.resolve({ code: 200, message: 'Blog Category data fetched Successfuly!', data: categorydata });
        // result = await fs.readFile("Utils/blogCategory.txt", "utf8");
        // return Promise.resolve({ code: 200, message: "Blog category fetched successfully", data: result.split(",") });
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while fetching blog category: " + error, data: null });
        }
    }
}

async function update(authUser, body, params, flags) {
    try {
        let result;

        if (!params) {
            params = {};
        }
        if (!flags) {
            flags = {};
        }

        await Category.deleteMany({istravel:body.istravel});
        let results = await Promise.all(body.blogCategory.map(async cat => {
            let category = new Category({
                category: cat,
                subcategory: [],
                istravel: body.istravel ? body.istravel : false
            })

            await category.save();
            return category
        }));

        return Promise.resolve({ code: 200, message: "Blog category updated successfully", data: results });
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 500, message: "Error while updating blog category: " + error, data: null });
        }
    }
}