/* commented out to appease ESLint */
// const { ObjectId } = require('mongodb')

// const { extractValidFields } = require('../lib/validation')
// const { getDbReference } = require('../lib/mongo')

const UserSchema = {
    name: { required: true },
    email: { required: true },
    password: { required: true },
    admin: { default: false },
    phone: { required: false },
    phone_carrier: { required: false },
    preferences: { required: false },
    homes: { default: [] }
}
exports.UserSchema = UserSchema
