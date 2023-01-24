const { ObjectId } = require('mongodb')

const { extractValidFields } = require('../lib/validation')
const { getDbReference } = require('../lib/mongo')

const UserSchema = {
    name: { required: true },
    email: { required: true },
    admin: { default: false },
    phone: { required: false },
    phone_carrier: { required: false },
    preferences: { required: false },
    homes: { default: [] }
}
exports.UserSchema = UserSchema

async function insertNewUser(user) {
    user = extractValidFields(user, UserSchema)
    const db = getDbReference()
    const collection = db.collection('users')
    const result = await collection.insertOne(user)
    return result.insertedId
}
exports.insertNewUser = insertNewUser

async function getAllUsers() {
    const db = getDbReference()
    const collection = db.collection('users')
    const users = await collection.find({}).toArray()
    console.log("==== users: ", users)
    return users
}
exports.getAllUsers = getAllUsers

async function getUserById(id) {
    const db = getDbReference()
    const collection = db.collection('users')
    const user = await collection.find({
        _id: id
    }).toArray()

    console.log("==== user: ", user)

    return user[0]
}
exports.getUserById = getUserById

async function updateUserById(id, user) {
    user = extractValidFields(user, UserSchema)
    const db = getDbReference()
    const collection = db.collection('users')
    const result = await collection.replaceOne(
        { _id: new ObjectId(id) },
        user
    )
    console.log("==== result: ", result)
    return result.matchedCount > 0;
}
exports.updateUserById = updateUserById

async function deleteUserById(id) {
    const db = getDbReference()
    const collection = db.collection('users')
    const result = await collection.deleteOne({
        _id: id
    })
    return result.deletedCount > 0;
}
exports.deleteUserById = deleteUserById