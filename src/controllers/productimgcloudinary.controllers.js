const catchError = require('../utils/catchError');
const ProductImg = require('../models/Productimg');
const path = require('path');
const fs = require('fs');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

const create = catchError(async(req, res) => {
    const { path , filename} = req.file
    const { url, public_id } = await uploadToCloudinary(path, filename)
    const body ={url, filename: public_id}
    const result = ProductImg.create(body)
    return res.status(201).json(result)
});


const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const images= await ProductImg.findByPk(id)
    if (!images) return res.sendStatus(404)
    await deleteFromCloudinary(image.filename)
    await image.destroy()
    return res.sendStatus(204)
});


module.exports = {
    create,
    remove,
}