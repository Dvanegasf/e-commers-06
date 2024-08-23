const request = require('supertest')
const app = require('../app')

let TOKEN
let categoryId

const BASE_URL = '/api/v1/categories'
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
})


const category = {
    name:"tv",
}


test('POST -> BASE_URL, should return statusCode 201, and res.body.name=== category.name', async() => {
    
    const res = await request(app)
    .post(BASE_URL)
    .send(category)
    .set('Authorization', `Bearer ${TOKEN}`)
    
        categoryId = res.body.id;

    expect(res.status).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(category.name)

});

test('GET -> BASE_URL, should return statusCode 200, and res.body.length === 1', async() => {

    const res = await request(app)
        .get(BASE_URL)
        
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
});

test('DELETE-> BASE_URL/categoryId, should return statusCode 204', async() => { 
    
    const res = await request(app)
        .delete(`${BASE_URL}/${categoryId}`)
        .set('Authorization', `Bearer ${TOKEN}`)

    
    expect(res.status).toBe(204)
});