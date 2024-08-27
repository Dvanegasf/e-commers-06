require('../models')
const request = require('supertest')
const app = require('../app')
const Category = require('../models/Category');
const Product = require('../models/Product');
const Cart = require('../models/Cart');


let TOKEN
let cart
let product
let category
let user
let userId
let purchaseId

const BASE_URL = '/api/v1/purchase'
const BASE_URL_CART = '/api/v1/cart'
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
    userId = res.body.user.id
    //console.log(res.body.user)

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
        quantity: 2,
        productId: product.id,
    }

    const res_cart = await request(app)
        .post(BASE_URL_CART)
        .send(cart)
        .set('Authorization', `Bearer ${TOKEN}`)
        //console.log(res_cart.body)
})

afterAll(async() => {
    await category.destroy()
    await product.destroy()
});



test('POST -> BASE_URL, should return statusCode 201, res.body.quantity === cart.quantity, and res_cart.body.length === 0', async() => {
    
    const res = await request(app)
    .post(BASE_URL)
    .set('Authorization', `Bearer ${TOKEN}`)
    
    purchaseId = res.body.id;
    //console.log(res.body)
    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body.length).toBe(1);
    expect(res.body[0].quantity).toBe(cart.quantity);
    expect(res.body[0].productId).toBe(product.id)
    expect(res.body[0].userId).toBe(userId)

    const res_cart = await request(app)
        .get(BASE_URL_CART)
        .set('Authorization', `Bearer ${TOKEN}`)

    //console.log(res_cart.body)
    expect(res_cart.body).toHaveLength(0)
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
