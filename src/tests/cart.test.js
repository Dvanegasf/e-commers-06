require('../models')
const request = require('supertest')
const app = require('../app')
const Category = require('../models/Category');
const Product = require('../models/Product');

let TOKEN
let cartId
let cart
let product
let category
let user
let userlogginId

const BASE_URL = '/api/v1/cart'
const BASE_URL_LOGIN = '/api/v1/users/login'

beforeAll(async() => {
    user = {
        email:"david@gmail.com",
        password:"david123"
    }

    const res = await request(app)
        .post(BASE_URL_LOGIN)
        .send(user)
        
    TOKEN = res.body.token
    userlogginId = res.body.user.id
    //console.log(res.body.user.id)

    category = await Category.create
        ({
            name: 'electrodomestico'
    })
    //console.log(category)
    product = await Product.create
    ({
        title: "Lavadora Carga Superior 25 Kg 8MWTWLA41WJG Negro",
        description: "Lavadora Carga Superior 25 Kg 8MWTWLA41WJG Negro",
        price: 2249900,
        categoryId : category.id
    })
    //console.log(product)
    
    cart = {
        quantity: 1,
        productId : product.id
    }
})

afterAll(async() => {
    await category.destroy()
    await product.destroy()
});



test('POST -> BASE_URL, should return statusCode 201, and res.body.quantity=== cart.quantity', async() => {
    
    const res = await request(app)
    .post(BASE_URL)
    .send(cart)
    .set('Authorization', `Bearer ${TOKEN}`)
    
    
    cartId = res.body.id;
    
    expect(res.status).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.quantity).toBe(cart.quantity)
    expect(res.body.productId).toBe(product.id)
    expect(res.body.userId).toBe(userlogginId)
    /* console.log(userlogginId)
    console.log(res.body.userId) */
});

test('GET -> BASE_URL, should return statusCode 200, and res.body.length === 1', async() => {

    const res = await request(app)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${TOKEN}`)
   //console.log(res.body[0].product.category)    

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
    expect(res.body[0].quantity).toBe(cart.quantity)
    expect(res.body[0].product).toBeDefined()
    expect(res.body[0].product.id).toBe(product.id)
    expect(res.body[0].product.createdAt).toBeUndefined()
    expect(res.body[0].product.updatedAt).toBeUndefined()
    expect(res.body[0].product.category).toBeDefined()
    expect(res.body[0].product.category.id).toBe(category.id)
    expect(res.body[0].product.category.createdAt).toBeUndefined()
    expect(res.body[0].product.category.updatedAt).toBeUndefined()
});

test('GET -> BASE_URL, should return statusCode 200, and res.body."all" === ', async() => {

    const res = await request(app)
        .get(`${BASE_URL}/${cartId}`)
        .set('Authorization', `Bearer ${TOKEN}`)
   
    //console.log(res.body)    

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.quantity).toBe(cart.quantity)
    expect(res.body.product).toBeDefined()
    expect(res.body.product.id).toBe(product.id)
    expect(res.body.product.createdAt).toBeUndefined()
    expect(res.body.product.updatedAt).toBeUndefined()
    expect(res.body.product.category).toBeDefined()
    expect(res.body.product.category.id).toBe(category.id)
    expect(res.body.product.category.createdAt).toBeUndefined()
    expect(res.body.product.category.updatedAt).toBeUndefined()
});

test('PUT -> BASE_URL/cartId, should return statusCode === 200 and res.body.quantity === cartUp.quantity', async() => {

    const cartUp = {
        quantity : 2
    }

    const res = await request(app)
        .put(`${BASE_URL}/${cartId}`)
        .send(cartUp)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.quantity).toBe(cartUp.quantity)
});

test('DELETE-> BASE_URL/cartId, should return statusCode 204', async() => { 
    
    const res = await request(app)
        .delete(`${BASE_URL}/${cartId}`)
        .set('Authorization', `Bearer ${TOKEN}`)

    
    expect(res.status).toBe(204)
}); 