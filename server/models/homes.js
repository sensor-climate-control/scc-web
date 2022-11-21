// const { ObjectId } = require('mongodb')

const { extractValidFields } = require('../lib/validation')
const { getDbReference } = require('../lib/mongo')

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

async function insertNewHome(home) {
    home = extractValidFields(home, HomeSchema)
    const db = getDbReference()
    const collection = db.collection('homes')
    const result = await collection.insertOne(home)
    return result.insertedId
}
exports.insertNewHome = insertNewHome

async function getAllHomes() {
    const db = getDbReference()
    const collection = db.collection('homes')
    const homes = await collection.find({}).toArray()
    console.log("==== homes: ", homes)
    return homes
}
exports.getAllHomes = getAllHomes

async function getHomeById(id) {
    const db = getDbReference()
    const collection = db.collection('homes')
    const home = await collection.find({
        _id: id
    }).toArray()

    console.log("==== home: ", home)

    return home[0]
}
exports.getHomeById = getHomeById

async function deleteHomeById(id) {
    const db = getDbReference()
    const collection = db.collection('homes')
    const result = await collection.deleteOne({
        _id: id
    })
    return result.deletedCount > 0;
}
exports.deleteHomeById = deleteHomeById