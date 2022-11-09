const { ObjectId } = require('mongodb')

const { extractValidFields } = require('../lib/validation')
const { getDBReference } = require('../lib/mongo')

const UserSchema = {
    name: { required: true },
    email: { required: true },
    password: { required: true },
    admin: { default: false },
    phone: { required: false },
    phone_carrier: { required: false },
}
exports.UserSchema = UserSchema
