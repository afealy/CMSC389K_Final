function verifyRegistration(pw1, pw2) {
    return pw1 == pw2;
}

module.exports = {
    verifyRegistration: verifyRegistration
}