const { ObjectId } = require('mongodb')

const { extractValidFields } = require('../lib/validation')
const { getDBReference } = require('../lib/mongo')

const HomeSchema = {
    name: { required: true },
    zip_code: { required: true },
    users: { required: true },
    home_admins: { required: true },
    sensors: { default: [] },
    preferences: { required: true },
    windows: { default: [] }
}
exports.HomeSchema = HomeSchema
