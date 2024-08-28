const { getAll, create, getOne, remove, update, login, logged } = require('../controllers/users.controllers');
const express = require('express');
const { verifyJwt } = require('../utils/verify.JWT');

const routerUser = express.Router();

routerUser.route('/')
    .get(verifyJwt,getAll)
    .post(create);

    
routerUser.route('/login')
    .post(login)

routerUser.route('/me')
    .get(verifyJwt, logged)

routerUser.route('/:id')
    .get(verifyJwt, getOne)
    .delete(verifyJwt, remove)
    .put(verifyJwt, update);

module.exports = routerUser;