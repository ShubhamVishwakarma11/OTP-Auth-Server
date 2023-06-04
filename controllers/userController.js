const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '1d'})
}

const userLogin = async (req,res) => {
    const {email} = req.body

    try {
        const user = await User.login(email)
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
}

const userSignup = async (req,res) => {
    const {email} = req.body;
    try {
        const user = await User.signup(email)
        res.status(200).json({user})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

const userVerify = async (req,res) => {
    const {email, otp} = req.body;

    try {
        const user = await User.verify(email, otp)
        const token = createToken(user._id)
        res.status(200).json({user,email, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {userSignup, userLogin, userVerify}