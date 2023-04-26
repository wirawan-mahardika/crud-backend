import app from "./app.js";
import supertest from "supertest";
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()
const req = supertest(app);


jest.mock('./database/model/animesModel.js')
describe('Admin testing', () => {

  test('POST /api/admin', async () => {
    const body = {name: 'wirawan', email: "wirawanmahardika10@gmail.com", goal: 'technical architect',language: "golang"}
    const res = await req.post('/api/admin').send(body)
    
    const token = res.headers['set-cookie'].find(child => child.includes('token'))
    const refreshToken = res.headers['set-cookie'].find(child => child.includes('refreshToken'))
    
    expect(token).toBeDefined()
    expect(refreshToken).toBeDefined()
    expect(res.body).toEqual({code: 200, message: "Welcome admin"})
    expect(res.get('content-type')).toContain('application/json')
    expect(res.status).toBe(200)
  })
  
  test('GET /api/admin/refreshToken', async () => {
    const body = {name: 'wirawan', email: "wirawanmahardika10@gmail.com", goal: 'technical architect',language: "golang"}
    const res1 = await req.post('/api/admin').send(body)

    let refreshToken = res1.headers['set-cookie'].find(child => child.includes('refreshToken'))
    refreshToken = refreshToken.split(";")[0]
    const res = await req.get('/api/admin/refreshToken').set('Cookie', refreshToken)
    expect(res.status).toBe(200)
  })
  
})

