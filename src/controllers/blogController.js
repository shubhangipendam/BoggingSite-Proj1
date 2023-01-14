const blogModel = require("../models/blogModel")
const Valid = require("../validator/validator")
const { isValidObjectId } = require("mongoose")
const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")



const createBlog = async function (req, res) {

    try {
        const requestBody = req.body
        const Id = req.body.authorId

        const { title, authorId, body, tags, category, subcategory } = requestBody


        if (!Valid.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, msg: " Pls Provide requestBody" })
        }
        if (!Valid.isValid(title)) {
            return res.status(400).send({ status: false, msg: " Pls Provide title for blog" })
        }
        if (!isValidObjectId(Id)) {
            return res.status(400).send({ status: false, msg: " Pls provide Valid author Id" })
        }
        if (!Valid.isValid(body)) {
            return res.status(400).send({ status: false, msg: " Pls Provide body" })
        }

        if (!Valid.isValid(tags)) {
            return res.status(400).send({ status: false, msg: "Pls provide tags" })
        }
        if (!Valid.isValid(category)) {
            return res.status(400).send({ status: false, msg: "pls provide category of Blog" })
        }
        if (!Valid.isValid(subcategory)) {
            return res.status(400).send({ status: false, msg: "pls provide subcategory of Blog" })
        }

        if (!Valid.isValid(authorId)) {
            return res.status(400).send({ status: false, msg: " Pls provide author Id" })
        }

        const validId = await authorModel.findById(Id)
        if (validId) {
            const blogCreated = await blogModel.create(requestBody)
            return res.status(201).send({ status: true, msg: 'blog created succesfully ', data: blogCreated })

        } else { res.status(400).send({ statusbar: false, msg: 'invalid authorid' }) }
    }

    catch (err) {

        return res.status(500).send({ status: false, msg: err.message })

    }

}





// ****fetch*****

const blogDetails = async function (req, res) {
    try {
        
        if(!req.query){
            const blogsData = await blogModel.find({ isDeleted: false }, { isPublished: true })
            return res.status(200).send({ status: true, data: blogsData })
        }
        if (req.query) {
            let { authorId, tags, category, subCategory } = req.query
            let obj = {}
            if (authorId) {
                obj.authorId = authorId
            }
            if (tags) {
                obj.tags = tags
            }
            if (category) {
                obj.category = category
            }
            if (subCategory) {
                obj.subCategory = subCategory
            }

            obj.isDeleted = false
            obj.isPublished = true

            const getDetail = await blogModel.find(obj)
            if (!getDetail) { return res.status(400).send({ status: false, msg: "given data is invalid " }) }
            else { return res.status(200).send({ status: true, data: getDetail }) }
        }
        

    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}







// **********************************put***************************
const updateBlog = async function (req, res) {

    try {
        const blogId = req.params.blogId
        if (!isValidObjectId(blogId)) return res.status(400).send({ status: false, msg: "blog Id is incurrct" })

        const requestBody = req.body

        if (Object.keys(requestBody).length == 0) return res.status(400).send({ status: false, msg: "Enter a felds to update" })

        const { title, body, tags, subcategory, category, isPublished } = requestBody

        let savedData = await blogModel.findOneAndUpdate({ _id: blogId }, {
            $set: { title: title, body: body, category: category, isPublished: isPublished },
            $push: { tags: tags, subcategory: subcategory }
        }, { new: true })

        return res.status(200).send({ status: true, msg: "blog updated successfuly", data: savedData })


    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })

    }
}









// deleteBlog by ID path Parem

const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId.trim();
        const result = await blogModel.findOneAndUpdate({ _id: blogId, isDeleted: false }, { isDeleted: true, deletedAt: new Date() }, { new: true })

        // console.log(result, "deleted")
        return res.status(200).send({ msg: "Deleted sussfully", deletedBlog: result })
    }
    catch (err) {
        return res.status(500).send({ status: true, msg: err.message })
    }
}










const deleteByQuery = async function (req, res) {
    try {

        // console.log(req.query)

        let { authorId, tags, category, subCategory, isPublished } = req.query
        let obj = {}
        // ---------Authorisation
        if (authorId) {
            obj.authorId = authorId
        }
        else {
            return res.status(400).send({ status: false, msg: "authorId is must be required for authorasition" })
        }
        let token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(token, "nasa");
        if (authorId != decodedToken.authorId) {
            return res.status(403).send({ status: false, msg: 'User is not allowed to modify the blog data' });
        }

        //------------- 
        if (tags) {
            obj.tags = tags
        }

        if (category) {
            obj.category = category
        }

        if (subCategory) {
            obj.subCategory = subCategory
        }
        if (isPublished) {
            obj.isPublished = isPublished
        }

        if (Object.keys(obj) == 0) {

            return res.status(400).send({ status: true, msg: "bad request/ No Data found in queryParams" })
        }

        const getDetail = await blogModel.updateMany({ $and: [obj] }, { $set: { isDeleted: true, deletedAt: new Date() } })
        if (!getDetail) {
            return res.status(400).send({ status: false, msg: "given data is invalid " })
        }
        else {
            return res.status(200).send({ status: true, data: getDetail })
        }

    }

    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}




module.exports = { createBlog, blogDetails, updateBlog, deleteBlog, deleteByQuery }