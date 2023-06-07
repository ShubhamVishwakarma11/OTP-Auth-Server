const express = require('express')
const { userLogin, userSignup, userVerify } = require('../controllers/userController')
const rateLimiter = require('../middlewares/rateLimiter')


const router = express.Router()
router.use(rateLimiter({allowedHits: 2, allowedMinutes: 2}));

router.post('/login', userLogin)

router.post('/signup', userSignup)

router.post('/verify-otp', userVerify)

module.exports = router