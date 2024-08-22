const request = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt');

const BASE_URL = '/api/v1/users'

let userId
let TOKEN

beforeAll(async() => {
    const user = {
        email:"david@gmail.com",
        password:"david123"
    }

    const res = await request(app)
        .post(`${BASE_URL}/login`)
        .send(user)

    TOKEN = res.body.token
})

const user = {
    firstName:"daniel",
    lastName:"vanegas",
    email:"daniel@gmail.com",
    password:"daniel123",
    phone:"+573002000300"
}



test('POST -> BASE_URL, should return statusCode 201, and res.body."all colums" === user."all colums"', async() => {
    
    const res = await request(app)
        .post(BASE_URL)
        .send(user)
    
    userId = res.body.id;

    const colums = ['firstName','lastName','email', 'phone']

    expect(res.status).toBe(201)
    expect(res.body).toBeDefined()

    colums.forEach((colum) => {
        expect(res.body[colum]).toBe(user[colum])
    });
});

test('GET -> BASE_URL, should return statusCode 200, and res.body.length === 2', async() => {

    const res = await request(app)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${TOKEN}`)
        
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(2)
});

test('POST -> BASE_URL/login, should retun statusCode 200, and res.body.user.email === hits.email', async() =>{
    const hits = {
        email:"daniel@gmail.com",
        password:"daniel123",
    }

    const  res = await request(app)
        .post(`${BASE_URL}/login`)
        .send(hits)
        
    const isValid = await bcrypt.compare(hits.password, res.body.user.password)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.user.email).toBe(hits.email)
    expect(isValid).toBe(true) 
}) 
test('POST -> BASE_URL/login, should retun statusCode 200, and res.body.user.email === hits.email', async() =>{
    const hits = {
        email:"daniel@gmail.com",
        password:"daniel1234",
    }

    const  res = await request(app)
        .post(`${BASE_URL}/login`)
        .send(hits)


    expect(res.status).toBe(401)
})

test('PUT-> URL_BASE/userId, should return statusCode 200 and res.body.firstName === user.name', async() => { 
    
    const userUp = {
        firstName: "Jhon",
        lastName:"fonseca"
    } 
    const colums = ['firstName','lastName']

    const res = await request(app)
        .put(`${BASE_URL}/${userId}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(userUp) 
    
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    colums.forEach((colum) => {
        expect(res.body[colum]).toBe(userUp[colum])
    });
    
});

test('DELETE-> BASE_URL/userId, should return statusCode 204', async() => { 
    
    const res = await request(app)
        .delete(`${BASE_URL}/${userId}`)
        .set('Authorization', `Bearer ${TOKEN}`)

    
    expect(res.status).toBe(204)
});

