import app from "./app.js"
import supertest from "supertest"
import ANIMES from "./database/model/animesModel.js"

const req  = supertest(app)
jest.mock('./database/model/animesModel.js') 
let token = ''
let refreshToken = ''

afterAll(() => jest.resetModules())

describe('Admin Testing', () => {
  describe('POST /api/admin', () => {
    const admin = {name: "wirawan",email: "wirawanmahardika10@gmail.com",goal: "technical architect",language: "golang"}

    test('success', async () => {
      const res = await req.post('/api/admin').send(admin)
      
      token = (res.headers['set-cookie'].find(item => item.includes('token'))).split(';')[0]
      refreshToken = (res.headers['set-cookie'].find(item => item.includes('refreshToken'))).split(';')[0]
      
      expect(token).toBeDefined()
      expect(refreshToken).toBeDefined()
      expect(res.body).toMatchObject({code: 200, message: "Welcome admin"})
      expect(res.body).toHaveProperty('tokenExp')
      expect(res.status).toBe(200)
    })
    
    
    test('error', async () => {
      const res = await req.post('/api/admin').send(!admin)
      
      expect(res.status).toBe(401)
      expect(res.body).toEqual({code: 401, message: "Anda tidak teridentifikasi sebagai admin"})
    })
    
  })
  
  describe('GET /api/admin/auth', () => {
    
    test('success', async () => {
      const res = await req.get('/api/admin/auth').set('Cookie', token)
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('code', 200)
      expect(res.body).toHaveProperty('serverData')
    })
    
    test('success (redirect)', async () => {
      const res = await req.get('/api/admin/auth').set('Cookie', `${refreshToken}`)
      expect(res.status).toBe(301)
      expect(res.get('Set-Cookie').find(cookie => cookie.includes('token'))).toBeTruthy()
    })

    test('error (jwt)', async () => {
      const res = await req.get('/api/admin/auth')
      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty('code', 401)
      expect(res.body).toHaveProperty('message')
    })
    
  })
  
  
})


describe('Animes Testing', () => {
  
  describe('GET /api/animes', () => {
    
    test('success', async () => {
      ANIMES.findAll.mockResolvedValueOnce(allAnimes)
      const res = await req.get('/api/animes')
      expect(res.status).toBe(200)
      expect(res.get('content-type')).toContain('application/json')
      expect(res.body).toEqual({status: 'success',code: 200, message: 'OK', data: allAnimes})
    })
    
    
    test('error', async () => {
      const rejectValue = 'cannot get data'
      jest.spyOn(ANIMES, 'findAll').mockRejectedValue(new Error(rejectValue))
      try {
        await ANIMES.findAll()
      } catch (error) {
        expect(error.message).toBe(rejectValue)
      }
    })
    
    
  })
  
  
  describe('POST /api/animes', () => {
    const newAnime = {
      id: '1324',
      title: "anime3",
      poster: "anime3.poster.io",
      genre: "romance, comedy",
    }
    test('success', async () => {
      ANIMES.create.mockResolvedValueOnce(newAnime)
      const res = await req.post('/api/animes').set('Cookie', token).send(newAnime)
      expect(res.status).toBe(200)
      expect(res.body).toEqual({status: "success", code: 200, message: "berhasil menyimpan data"})
    })

    test('error (jwt)', async () => {
      const rejectValue = {message: "berhasil login"}
      ANIMES.findAll.mockImplementationOnce(() => Promise.resolve(rejectValue))
      const res = await req.post('/api/animes')
      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty('code', 401)
      expect(res.body).toHaveProperty('message')
    })
    
    
    test('error', async () => {
      const rejectValue = 'tidak berhasil membuat data anime baru'
      jest.spyOn(ANIMES, 'create').mockRejectedValueOnce(new Error(rejectValue))
      try {
        await ANIMES.create(newAnime)
      } catch (error) {
        expect(error.message).toBe(rejectValue)
      }
    })
    
    
  })
  
  describe('PUT /api/animes', () => {
    
    test('success', async () => {
      ANIMES.update.mockImplementationOnce(() => {
        return {title: "updated anime title", lain_lain: '...alldata'}
      })
      const res = await req.put('/api/animes').set('Cookie', token).send({title: "anime title"})
      expect(res.status).toBe(200)
      expect(res.body).toEqual({status: "success", code: 200, message: "berhasil mengupdate data"})
    })
    
    
    test('error (body empty)', async () => {
      ANIMES.update.mockImplementationOnce(() => true)
      const res = await req.put('/api/animes').set('Cookie', token)
      expect(res.status).toBe(403)
      expect(res.body).toEqual({status: "failed", code: 403, message: "proses query membutuhkan title"})
    })
    
    test('error (jwt)', async () => {
      ANIMES.update.mockImplementationOnce(() => true)
      const res = await req.put('/api/animes')
      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty('message')
      expect(res.body).toHaveProperty('code', 401)
    })
    
    
    test('error', async () => {
      const rejectedValue = 'gagal update'
      jest.spyOn(ANIMES, 'update').mockRejectedValueOnce(new Error(rejectedValue))
      const res = await req.put('/api/animes').set('Cookie', token).send({title: "anime title"})
      try {
        await ANIMES.update()
      } catch (error) {
        expect(error.message).toBe(rejectedValue)
        expect(res.status).toBe(403)
        expect(res.body).toEqual({status: "failed", code: 403, message: "gagal mengupdate data", description: "terjadi kesalahan, coba lagi nanti"})
      }
    })
    
    
  })
  
  describe('DELETE /api/animes/{animesId}', () => {
    test('success', async () => {
      const id = '1234'
      ANIMES.destroy.mockImplementation(() => {
        return allAnimes.filter(anime => anime.id !== id)
      })
      const res = await req.delete('/api/animes/'+id).set('Cookie', token)
      expect(res.status).toBe(200)
      expect(res.body).toEqual({status: "success", code: 200, message: "berhasil melakukan delete anime"})
    })
    
    
    test('error (jwt)', async () => {
      ANIMES.destroy.mockImplementationOnce(() => true)
      const res = await req.put('/api/animes')
      expect(res.status).toBe(401)
      expect(res.body).toHaveProperty('message')
      expect(res.body).toHaveProperty('code', 401)
    })
    
    
    test('error', async () => {
      const rejectedValue = 'gagal delete'
      const id = '1234'
      jest.spyOn(ANIMES, 'destroy').mockRejectedValueOnce(new Error(rejectedValue))
      const res = await req.put('/api/animes/'+id).set('Cookie', token)
      try {
        await ANIMES.destroy()
      } catch (error) {
        expect(error.message).toBe(rejectedValue)
        expect(res.status).toBe(403)
        expect(res.body).toEqual({status: "failed", code: 403, message: "gagal melakukan delete", description: "terjadi kesalahan, coba lagi nanti"})
      }
    })
    
    
    
    
  })
  
  describe('GET /api/animes/search/:title', () => {
    
    test('success', async () => {
      const title = 'anime'
      ANIMES.findAll.mockImplementation(() => {
        const dataReturn = allAnimes.filter(anime => {
          return anime.title.includes(title)
        })
        return dataReturn
      })
      const res = await req.get('/api/animes/search/'+title).set('Cookie', token)
      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({status: "success", code: 200, message: "hasil query dengan title "+title})
      expect(res.body).toHaveProperty('animes')
    })

    
    test('error', async () => {
      const title = 'anime'
      jest.spyOn(ANIMES, 'findAll').mockRejectedValueOnce('gagal mendapatkan data')
      const res = await req.get('/api/animes/search/'+title).set('Cookie', token)
      try {
        await ANIMES.findAll({where: {title: 'anime1'}})
      } catch (error) {
        expect(error.message).toBe('gagal mendapatkan data')
        expect(res.status).toBe(403)
        expect(res.body).toEqual({status: "failed", code: 403, message: error.message })
      }
    })
    
          
  })
  
})

const allAnimes = [
  {
    id: '1234',
    title: "anime1",
    poster: "anime1.poster.io",
    genre: "shounen, comedy",
  },
  {
    id: '4321',
    title: "anime2",
    poster: "anime2.poster.io",
    genre: "supranatural, comedy",
  },
  {
    id: '1324',
    title: "anime3",
    poster: "anime3.poster.io",
    genre: "romance, comedy",
  }
]
// describe('GET /api/admin/refreshToken', () => {
//   test('success', async () => {
//     const res = await req.get('/api/admin/refreshToken').set('Cookie', refreshToken)
//     expect(res.status).toBe(200)
//     expect(res.body).toEqual({code: 200, message: "berhasil perbarui"})
//     expect(res.get('Set-Cookie').find(cookie => cookie.includes('token'))).toBeDefined()
//   })
  
  
//   test('error',async () => {
//     const res = await req.get('/api/admin/refreshToken').set('Cookie', 'refreshToken=null;')
//     expect(res.status).toBe(401)
//     expect(res.body).toHaveProperty('message')
//     expect(res.body).toHaveProperty('code', 401)
//   })
  
// })