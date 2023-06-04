const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const sendOTPMail = async (email, otp) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: "gmail.com",
            auth: {
                type: "OAuth2",
                user: "shubhamkvish@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: "OTP AUTH <shubhamkvish@gmail.com>",
            to: email,
            subject: "OTP for OTP Auth App",
            text: `The verification code is ${otp}`,
            html: `<p>The verification code is <b>${otp}</b></p>`
        }

        const result = await transport.sendMail(mailOptions);

        return result;
    } catch (error) {
        return error;
    }
}

module.exports = sendOTPMail;