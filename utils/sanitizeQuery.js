const sanitizeQuery = (query) => {
    const regex = /^\$/g;
    const res = [...query.matchAll(regex)]
    if(res.length > 0) throw Error("Special characters are not allowed");
}

const checkNumeric = (otp) => {
    const regex = /\D/g;
    const res = otp.match(regex);
    if (res.length > 0) throw Error("Non-numeric characters are not allowed")
}

module.exports = {sanitizeQuery, checkNumeric};