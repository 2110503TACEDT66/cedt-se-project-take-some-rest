// Import controller
const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' })
const mongoose = require('mongoose')

const { reportReview } = require('./controllers/reviews')
const { login, logout } = require('./controllers/auth')

const Review = require('./models/Review')

let JSONlogin
let reviewId

const mockRequestLogin = (userEmail, userPassword) => {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      email: userEmail,
      password: userPassword,
    },
  }
}

const mockResponseLogin = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.cookie = jest.fn().mockReturnValue(res)
  return res
}

describe('Not Login', () => {
  beforeAll(async () => {
    //database
    mongoose.set('strictQuery', true)
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`)
  });

  it('cannot report review', async () => {
    const mockRequest = (rid, token) => {
      return {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          rvid: rid,
        },
        user: {
          id: '662f14ad3245db1a68cbe84c',
        },
      }
    }

    const mockResponse = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }

    //review id
    reviewId = '662f501fb143cf39b8ed2724'

    const req = mockRequest(reviewId, )
    const res = mockResponse()

    await reportReview(req, res)
    reportJson = res.json.mock.calls[0][0]
    reportStatus = res.status.mock.calls[0][0]

    expect(reportJson.success).toBe(false)
    expect(reportStatus).toBe(403)
  })
})

describe('Admin Login', () => {
  beforeAll(async () => {
    //database
    mongoose.set('strictQuery', true)
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`)

    //login as Admin
    const reqLogin = mockRequestLogin('admin@gmail.com', 'root123')
    const resLogin = mockResponseLogin()
    const next = jest.fn()

    await login(reqLogin, resLogin, next)

    JSONlogin = resLogin.json.mock.calls[0][0]
  });

  afterAll(async () => {
    const req = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${JSONlogin.token}`,
      },
    }
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    res.cookie = jest.fn().mockReturnValue(res)

    await logout(req, res)
  })

  it('Admin cannot report review', async () => {
    const mockRequest = (rid, token) => {
      return {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          rvid: rid,
        },
        user: {
          id: '662f14ad3245db1a68cbe84c',
        },
      }
    }

    const mockResponse = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }

    //review id
    reviewId = '662f501fb143cf39b8ed2724'

    const req = mockRequest(reviewId, JSONlogin.token)
    const res = mockResponse()

    await reportReview(req, res)
    reportJson = res.json.mock.calls[0][0]
    reportStatus = res.status.mock.calls[0][0]

    expect(reportJson.success).toBe(false)
    expect(reportStatus).toBe(403)
  })
})

describe('Customer Login', () => {
  beforeAll(async () => {
    //database
    mongoose.set('strictQuery', true)
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`)

    //login as customer
    const reqLogin = mockRequestLogin('customer@gmail.com', 'root123')
    const resLogin = mockResponseLogin()
    const next = jest.fn()

    await login(reqLogin, resLogin, next)

    JSONlogin = resLogin.json.mock.calls[0][0]
  })

  afterAll(async () => {
    const req = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${JSONlogin.token}`,
      },
    }
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    res.cookie = jest.fn().mockReturnValue(res)

    await logout(req, res)
  })

  it('Customer cannot report review', async () => {
    const mockRequest = (rid, token) => {
      return {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          rvid: rid,
        },
        user: {
          id: '662f14ad3245db1a68cbe84c',
        },
      }
    }

    const mockResponse = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }

    //review id
    reviewId = '662f501fb143cf39b8ed2724'

    const req = mockRequest(reviewId, JSONlogin.token)
    const res = mockResponse()

    await reportReview(req, res)
    reportJson = res.json.mock.calls[0][0]
    reportStatus = res.status.mock.calls[0][0]

    expect(reportJson.success).toBe(false)
    expect(reportStatus).toBe(403)
  })
})

describe('CampgroundOwner Login', () => {
  beforeAll(async () => {
    //database
    mongoose.set('strictQuery', true)
    const conn = await mongoose.connect(`${process.env.MONGO_URI}`)

    //login as campgroundOwner
    const reqLogin = mockRequestLogin('doicafe@gmail.com', 'doicafe')
    const resLogin = mockResponseLogin()

    const next = jest.fn()

    await login(reqLogin, resLogin, next)

    JSONlogin = resLogin.json.mock.calls[0][0]
  })

  afterAll(async () => {
    const req = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${JSONlogin.token}`,
      },
    }
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    res.cookie = jest.fn().mockReturnValue(res)

    await logout(req, res)
  })

  it('CampgroundOwner report other caampground review', async () => {
    const mockRequest = (rid, token) => {
      return {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          rvid: rid,
        },
        user: {
          id: '662f18fe3245db1a68cbe950',
        },
      }
    }

    const mockResponse = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }

    //review id that is not belong to campground that this user own
    reviewId = '6630b7c979577e2dc8d08983'

    const req = mockRequest(reviewId, JSONlogin.token)
    const res = mockResponse()

    await reportReview(req, res)
    reportJson = res.json.mock.calls[0][0]
    reportStatus = res.status.mock.calls[0][0]

    expect(reportJson.success).toBe(false)
    expect(reportStatus).toBe(403)
  })

  it('CampgroundOwner report review that is not exist', async () => {
    const mockRequest = (rid, token) => {
      return {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          rvid: rid,
        },
        user: {
          id: '662f18fe3245db1a68cbe950',
        },
      }
    }

    const mockResponse = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }

    //review id that is not exist
    reviewId = '111f14ad3245db1a68cbe84c'

    const req = mockRequest(reviewId, JSONlogin.token)
    const res = mockResponse()

    await reportReview(req, res)
    reportJson = res.json.mock.calls[0][0]
    reportStatus = res.status.mock.calls[0][0]

    expect(reportJson.success).toBe(false)
    expect(reportStatus).toBe(404)
  })

  it('CampgroundOwner report review that is in their campground', async () => {
    const mockRequest = (rid, token) => {
      return {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          rvid: rid,
        },
        user: {
          id: '662f18fe3245db1a68cbe950',
        },
      }
    }

    const mockResponse = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }

    //review id that is not report yet
    reviewId = '662f501fb143cf39b8ed2724'
    await Review.findByIdAndUpdate(
      reviewId,
      { isReport: false },
      {
        new: true,
        runValidators: true,
      }
    )

    const req = mockRequest(reviewId, JSONlogin.token)
    const res = mockResponse()

    await reportReview(req, res)
    reportJson = res.json.mock.calls[0][0]
    reportStatus = res.status.mock.calls[0][0]

    expect(reportJson.success).toBe(true)
    expect(reportStatus).toBe(200)
  })

  it('CampgroundOwner report review that already reported', async () => {
    const mockRequest = (rid, token) => {
      return {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          rvid: rid,
        },
        user: {
          id: '662f18fe3245db1a68cbe950',
        },
      }
    }

    const mockResponse = () => {
      const res = {}
      res.status = jest.fn().mockReturnValue(res)
      res.json = jest.fn().mockReturnValue(res)
      return res
    }

    //review id that is already reported
    reviewId = '662f5030b143cf39b8ed2737'
    await Review.findByIdAndUpdate(
      reviewId,
      { isReport: true },
      {
        new: true,
        runValidators: true,
      }
    )

    const req = mockRequest(reviewId, JSONlogin.token)
    const res = mockResponse()

    await reportReview(req, res)
    reportJson = res.json.mock.calls[0][0]
    reportStatus = res.status.mock.calls[0][0]

    expect(reportJson.success).toBe(false)
    expect(reportStatus).toBe(400)
  })
})