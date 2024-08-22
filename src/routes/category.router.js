const { getAll, create, getOne, remove } = require('../controllers/category.controllers');
const express = require('express');
const { verifyJwt } = require('../utils/verify.JWT');

const routerCategory = express.Router();

routerCategory.route('/')
    .get(getAll)
    .post(verifyJwt, create);

routerCategory.route('/:id')
    .get(getOne)
    .delete(verifyJwt, remove)

module.exports = routerCategory;