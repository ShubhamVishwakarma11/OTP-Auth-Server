const Limiter = require('../models/limiterModel');

const rateLimiter = ({allowedMinutes, allowedHits}) => {
    return async (req,res,next) => {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const data = await Limiter.findOne({ip});

        if (!data) {
            await Limiter.create({ip, expiry: Date.now() + 60 * 1000 * allowedMinutes, hits:1})
            console.log("no ip record");
            next();
        }

        if (data) {
            if (Date.now() > data.expiry) {
                await Limiter.updateOne({_id: data._id}, {ip, expiry: Date.now() + 60*1000*allowedMinutes, hits:1}, {upsert: true});
                console.log("window expired", 1);
                next();
            }
            else if (data.hits < allowedHits) {
                await Limiter.updateOne({_id: data._id}, {ip, expiry: Date.now() + 60*1000*allowedMinutes, hits: data.hits + 1}, {upsert: true});
                console.log("hits number", data.hits + 1);
                next();
            }
            else {
                console.log("too many requests", data.hits)
                return res.status(429).json({error: "Too many requests"});
            }
        }
    }
}

module.exports = rateLimiter;