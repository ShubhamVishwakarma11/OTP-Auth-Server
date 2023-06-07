const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const otpGenerator = require('otp-generator');
const sendOTPMail = require('../utils/sendOTP');
const { sanitizeQuery, checkNumeric } = require('../utils/sanitizeQuery');

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true,
    },
    expiry: {
        type: Date
    },
    name: {
        type: String
    },
    phone: {
        type:String
    }
});

// static signup function
userSchema.statics.signup = async function(email) {
    //validations
    if (!email) {
        throw Error('All fields are required')
    }

    sanitizeQuery(email);

    if (!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }

    const exists = await this.findOne({email})

    if (exists) {
        throw Error("Email already in use")
    }

    const code = otpGenerator.generate(6, { upperCaseAlphabets:false, lowerCaseAlphabets:false, specialChars: false, digits: true});
    
    const mailRes = await sendOTPMail(email, code);
    console.log(mailRes);

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(code, salt)

    const user = await this.create({email, otp: hash, expiry: Date.now() + 180000})

    return user;    
}

// static login function
userSchema.statics.login = async function(email) {
    if (!email) {
        throw Error("All fields are required")
    }

    sanitizeQuery(email);

    if (!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }

    const user = await this.findOne({email})

    if (!user) {
        throw Error("Incorrect email")
    }

    const code = otpGenerator.generate(6, { upperCaseAlphabets:false, lowerCaseAlphabets:false, specialChars: false, digits: true});
    
    await sendOTPMail(email, code);

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(code, salt)

    const newUser = await this.updateOne({_id: user._id},{ otp: hash, expiry: Date.now() + 180000}, {upsert: true})

    return newUser
}

userSchema.statics.verify = async function(email, otp) {
    if (!email || !otp) {
        throw Error("All fields are required")
    }

    checkNumeric(otp);

    sanitizeQuery(email);

    if (!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }

    const user = await this.findOne({email})

    if (!user) {
        throw Error("Incorrect email")
    }

    
    const match = await bcrypt.compare(otp, user.otp)
    // const match = otp === user.otp ? true : false;

    if (!match) {
        throw Error("Incorrect OTP")
    }

    if (Date.now() > user.expiry) {
        throw Error("Verification Code expired!");
    }

    return user
}

module.exports = new mongoose.model('User', userSchema);