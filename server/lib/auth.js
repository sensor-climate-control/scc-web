const jwt = require('jsonwebtoken')
require('dotenv').config();

const secret = process.env.OWM_API_KEY

function generateAuthToken(userId, duration = '24h') {
    const payload = { sub: userId }
    return jwt.sign(payload, secret, { expiresIn: duration })
}
exports.generateAuthToken = generateAuthToken

function getTokenExpiration(token) {
    const payload = jwt.decode(token)
    return payload.exp * 1000
}
exports.getTokenExpiration = getTokenExpiration

function requireAuthentication(req, res, next) {
    const authHeader = req.get('authorization') || ''
    const authParts = authHeader.split(' ')
    const token = authParts[0] === 'Bearer' ? authParts[1] : null

    try {
        const payload = jwt.verify(token, secret)
        console.log("== payload:", payload)
        req.user = payload.sub
        next()
    } catch (err) {
        res.status(401).send({
            err: "Invalid authentication token"
        })
    }
}
exports.requireAuthentication = requireAuthentication