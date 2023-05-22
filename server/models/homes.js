const { ObjectId } = require('mongodb')

const _ = require('lodash');

const { extractValidFields } = require('../lib/validation')
const { getDbReference } = require('../lib/mongo')
const { getUserById, updateUserById } = require('./users')

const HomeSchema = {
    name: { required: true },
    zip_code: { required: true },
    users: { required: true },
    home_admins: { required: true },
    sensors: { default: [] },
    preferences: { required: true },
    windows: { default: [] },
    recommendations: { default: {} }
}
exports.HomeSchema = HomeSchema

const WindowSchema = {
    name: { required: true },
    direction: { required: true },
    sensorid: { required: false }
}
exports.WindowSchema = WindowSchema

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
    // console.log("==== homes: ", homes)
    return homes
}
exports.getAllHomes = getAllHomes

async function getHomeById(id) {
    const db = getDbReference()
    const collection = db.collection('homes')
    const home = await collection.find({
        _id: id
    }).toArray()

    // console.log("==== home: ", home)

    return home[0]
}
exports.getHomeById = getHomeById

async function updateHomeById(id, home) {
    home = extractValidFields(home, HomeSchema)
    const db = getDbReference()
    const collection = db.collection('homes')
    const result = await collection.replaceOne(
        { _id: new ObjectId(id) },
        home
    )
    // console.log("==== result: ", result)
    return result.matchedCount > 0;
}
exports.updateHomeById = updateHomeById

async function deleteHomeById(id) {
    const home = await getHomeById()
    for(let i = 0; home.users && i < home.users.length; i++) {
        let user = await getUserById(home.users[i], true)
        user.homes = user.homes.filter(home => !home.equals(id))
        await updateUserById(id, user, true)
    }
    const db = getDbReference()
    const collection = db.collection('homes')
    const result = await collection.deleteOne({
        _id: id
    })
    return result.deletedCount > 0;
}
exports.deleteHomeById = deleteHomeById

async function addWindowToHome(id, window) {
    const windowToAdd = extractValidFields(window, WindowSchema)
    let home = await getHomeById(id)
    if(!home.windows) {
        home.windows = []
    }
    home.windows.push(windowToAdd)
    const result = await updateHomeById(id, home)
    return result
}
exports.addWindowToHome = addWindowToHome

async function removeWindowFromHome(id, windowToRemove) {
    let home = await getHomeById(id)
    if(home && home.windows && home.windows.length > 0) {
        home.windows = home.windows.filter(window => !_.isEqual(window, windowToRemove))

        const result = await updateHomeById(id, home)
        return result
    }
    return false
}
exports.removeWindowFromHome = removeWindowFromHome
