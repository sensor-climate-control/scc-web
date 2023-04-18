const jwt = require('jsonwebtoken');
const { getHomeById } = require('../models/homes');
const { getUserById } = require('../models/users');
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

async function authorizedToAccessUserEndpoint(tokenUserid, methodUserid = null) {
    // check if the userid of the token is the same as the userid of the request
    if (tokenUserid === methodUserid) {
        return true
    }
    // check if user is admin
    const user = await getUserById(tokenUserid)
    if (user.admin) {
        return true
    }
    return false
}
exports.authorizedToAccessUserEndpoint = authorizedToAccessUserEndpoint

async function authorizedToAccessHomeEndpoint(tokenUserid, homeid = null) {
    if(homeid) {
        // check if userid is in home's list of users
        const home = await getHomeById(homeid)
        // console.log("==== home: ", home)
        if(home.users.includes(tokenUserid)) {
            return true
        }
    }
    // check if user is admin
    const user = await getUserById(tokenUserid)
    if(user.admin) {
        return true
    }
    return false
}
exports.authorizedToAccessHomeEndpoint = authorizedToAccessHomeEndpoint

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