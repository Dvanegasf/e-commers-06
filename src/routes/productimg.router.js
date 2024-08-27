const { getAll, create, getOne, remove, update } = require('../controllers/productimg.controllers');
const express = require('express');
const upload = require('../utils/multer');

const routerProductimg = express.Router();

routerProductimg.route('/')
    .get(getAll)
    .post(upload.single('image'), create);

routerProductimg.route('/:id')
    .delete(remove)

module.exports = routerProductimg;