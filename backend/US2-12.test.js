const { requestCampgroundOwner, getMe, rejectUpdateUserRole } = require('./controllers/users.js');
const { login, logout } = require('./controllers/auth.js')
const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' })
const mongoose = require("mongoose");
const User = require('./models/User.js');


const mockRequestLogin = (userEmail, userPassword) => {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      "email" : userEmail,
      "password" : userPassword,
    },
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (method, token, userId) => {
  return {
    method: method,
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    user: { id : userId },
    params: { uid : userId }
  }
}

let responseData;
let token;

describe('Customer Login', () => {
  beforeAll(async () => {
      mongoose.set('strictQuery', true)
      const conn = await mongoose.connect(`${process.env.MONGO_URI}`)
      responseData = ''
      token = ''
  });

  beforeEach(async () => {
    //login
    const userEmail = "tester1@gmail.com"
    const userPassword = "root123"
    let req = mockRequestLogin(userEmail, userPassword)
    const res = mockResponse()
    await login(req, res);
    responseData = res.json.mock.calls[0][0]
    token = responseData.token
  });

  afterAll(async () => {
    req = mockRequest('PUT', token, "662f2a40f8c8beac78f0a651")
    const res = mockResponse()

    await rejectUpdateUserRole(req, res)

    req = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },}
    const res2 = mockResponse()

    await logout(req, res2)

  });

  it('request to be campground by customer', async () => {

    //request to be campgroundowner by customer
    req = mockRequest('PUT', token, "662f2a40f8c8beac78f0a651")
    const res2 = mockResponse()
    await requestCampgroundOwner(req,res2)
    responseData = res2.json.mock.calls[0][0]

    expect(res2.status).toHaveBeenCalledWith(200)
    expect(res2.json).toHaveBeenCalledWith({ success: true, data: responseData.data })

  });

  it('request to be campground by customer but has requested', async () => {

    //request to be campgroundowner by customer
    req = mockRequest('PUT', token, "662f2a40f8c8beac78f0a651")
    const res2 = mockResponse()
    await requestCampgroundOwner(req,res2)
    responseData = res2.json.mock.calls[0][0]

    expect(res2.status).toHaveBeenCalledWith(400)
    expect(res2.json).toHaveBeenCalledWith({ success: false, message: 'User already requested to be a campground owner' })

  });
});

describe('Admin Login', () => {
  beforeAll(async () => {
      mongoose.set('strictQuery', true)
      const conn = await mongoose.connect(`${process.env.MONGO_URI}`)
      responseData = ''
      token = ''
  });

  beforeEach(async () => {
    //login
    const userEmail = "admin@gmail.com"
    const userPassword = "root123"
    let req = mockRequestLogin(userEmail, userPassword)
    const res = mockResponse()
    await login(req, res);
    responseData = res.json.mock.calls[0][0]
    token = responseData.token
  });

  afterAll(async () => {

    req = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },}
    const res2 = mockResponse()

    await logout(req, res2)

  });

  it('request to be campground by admin', async () => {

    //request to be campgroundowner by admin
    req = mockRequest('PUT', token, "662f14ad3245db1a68cbe84c")
    const res2 = mockResponse()
    await requestCampgroundOwner(req,res2)
    responseData = res2.json.mock.calls[0][0]

    expect(res2.status).toHaveBeenCalledWith(403)
    expect(res2.json).toHaveBeenCalledWith({ success: false, message: 'Only customers can request to be campground owners' })

  });
});

describe('Campground Owner Login', () => {
  beforeAll(async () => {
      mongoose.set('strictQuery', true)
      const conn = await mongoose.connect(`${process.env.MONGO_URI}`)
      responseData = ''
      token = ''
  });

  beforeEach(async () => {
    //login
    const userEmail = "campgroundOwner1@gmail.com"
    const userPassword = "root123"
    let req = mockRequestLogin(userEmail, userPassword)
    const res = mockResponse()
    await login(req, res);
    responseData = res.json.mock.calls[0][0]
    token = responseData.token
  });

  afterAll(async () => {

    req = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },}
    const res2 = mockResponse()

    await logout(req, res2)

  });

  it('request to be campground by campgroundowner', async () => {

    //request to be campgroundowner by campgroundowner
    req = mockRequest('PUT', token, "662f2562f8c8beac78f0a5c0")
    const res2 = mockResponse()
    await requestCampgroundOwner(req,res2)
    responseData = res2.json.mock.calls[0][0]

    expect(res2.status).toHaveBeenCalledWith(403)
    expect(res2.json).toHaveBeenCalledWith({ success: false, message: 'Only customers can request to be campground owners' })

  });
});