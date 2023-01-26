const jwt = require('jsonwebtoken');
const { getUserById } = require("../models/users")

const secret = process.env.MICROSOFT_PROVIDER_AUTHENTICATION_SECRET

async function requireAuthentication(req, res, next) {
    const authHeader = req.get('authorization') || ''
    const authParts = authHeader.split(' ')
    const token = authParts[0] === 'Bearer' ? authParts[1] : null
    let payload = null;
    try {
        payload = jwt.verify(token, secret)
        req.userId = payload.sub
        
        const user = await getUserById(req.userId)

        if (!user) {
            res.status(404).send({
                err: 'No user found'
            })
        }

        req.user = user

        next()
    } catch (err) {
        res.status(401).send({
            err: 'Invalid auth token',
            payload: payload
        })
    }
}
exports.requireAuthentication = requireAuthentication
