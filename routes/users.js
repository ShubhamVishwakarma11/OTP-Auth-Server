const express = require('express')
const { userLogin, userSignup, userVerify } = require('../controllers/userController')


const router = express.Router()

router.post('/login', userLogin)

router.post('/signup', userSignup)

router.post('/verify-otp', userVerify)

module.exports = router