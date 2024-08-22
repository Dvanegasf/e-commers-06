const request = require('supertest')
const app = require('../app')

let TOKEN
const BASE_URL2 = '/api/v1/users'
const BASE_URL = '/api/v1/categories'

beforeAll(async() => {
    const user = {
        email:"david@gmail.com",
        password:"david123"
    }

    const res = await request(app)
        .post(`${BASE_URL2}/login`)
        .send(user)
        

    TOKEN = res.body.token
})


const category = {
    name:"tv",
}


test('POST -> BASE_URL, should return statusCode 201, and res.body.name=== user.name', async() => {
    
    const res = await request(app)
    .post(BASE_URL)
    .send(category)
    .set('Authorization', `Bearer ${TOKEN}`)
    
        //categoryId = res.body.id;

    expect(res.status).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(category.name)

});
