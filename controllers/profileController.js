const User = require("../models/userModel");

const getProfile = async (req,res) => {
    const email = req.user.email;
    const {phone, name} = await User.findOne({email});

    return res.status(200).json({email, phone, name})

}

const createProfile = async (req,res) => {
    const {name, phone} = req.body;

    if (!name || !phone) {
        return res.status(400).json({error: "Fill all the fields"})
    }

    try {
        const email = req.user.email;
        const user = await User.updateOne({email}, {name, phone}, {upsert: true});
        return res.status(200).json({email, user});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

module.exports = {getProfile, createProfile}