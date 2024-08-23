const request = require('supertest')
const app = require('../app')
const Category = require('../models/Category')
require('../models')

let productId
let TOKEN
let product
let category

const BASE_URL = '/api/v1/products'
const BASE_URL_LOGIN = '/api/v1/users/login'

beforeAll(async() => {    
    const user = {
        email:"david@gmail.com",
        password:"david123"
    }
    const res = await request(app)
    .post(BASE_URL_LOGIN)
    .send(user)
    
    TOKEN = res.body.token
    
    category = await Category.create({name: 'cell'})
    
     product = {
        title: "CELULAR",
        description: "...",
        price: 1200,
        categoryId : category.id
    }
}); 

/* beforeEach( () => {
    console.log('ejecutar antes del test')
}); */

afterAll(async() => {
    await category.destroy()
});


test('POST -> BASE_URL, should return statusCode 201, and res.body.title=== product.title', async() => {
    
    const res = await request(app)
    .post(BASE_URL)
    .send(product)
    .set('Authorization', `Bearer ${TOKEN}`)
    
    productId = res.body.id;
    const columns = ['title','description','price']
    // console.log(res.body)

    expect(res.body).toBeDefined()
    expect(res.status).toBe(201)
    columns.forEach((colum) => {
        expect(res.body[colum]).toBe(product[colum])
    }); 
    expect(res.body.categoryId).toBe(category.id)

});

test('GET -> BASE_URL, should return statusCode 200, and res.body.length === 1', async() => {

    const res = await request(app)
        .get(BASE_URL)

        //console.log(res.body)
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
    expect(res.body[0].category.id).toBeDefined()
    expect(res.body[0].category.id).toBe(category.id)


});

test('GET -> BASE_URL/:id, should return statusCode 200, and res.body.title === product.title', async() => {

    const res = await request(app)
        .get(`${BASE_URL}/${productId}`)

        //console.log(res.body)
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.category.id).toBeDefined()
    expect(res.body.category.id).toBe(category.id)


});

test('PUT-> URL_BASE/productId, should return statusCode 200 and res.body.title === productUp.title', async() => { 
    
    const productUp = {
        title: "TV",
        description: "....",
        price: 120
    }
    const colums = ['title','description', 'price']

    const res = await request(app)
        .put(`${BASE_URL}/${productId}`)
        .send(productUp) 
        .set('Authorization', `Bearer ${TOKEN}`)
    
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    colums.forEach((colum) => {
        expect(res.body[colum]).toBe(productUp[colum])
    });
    
});


test('DELETE-> BASE_URL/productId, should return statusCode 204', async() => { 
    
    const res = await request(app)
        .delete(`${BASE_URL}/${productId}`)
        .set('Authorization', `Bearer ${TOKEN}`)

    
    expect(res.status).toBe(204)
});