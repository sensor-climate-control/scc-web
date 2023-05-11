const { connectToDb, getDbReference, closeDbConnection } = require('./server/lib/mongo');
const { insertNewUser } = require('./server/models/users');
require('dotenv').config();

const adminEmail = process.env.WEB_ADMIN_EMAIL
const adminPass = process.env.WEB_ADMIN_PASS

connectToDb(async function () {    
  console.log("== DB connection open")

  const db = getDbReference()

  const collections = await db.listCollections().toArray()
  let collectionNames = []
  collections.forEach(collection => {
    collectionNames.push(collection.name)
  });
  console.log("==== collections: ", collectionNames)

  const collectionsToCreate = ['homes', 'sensors', 'users', 'weather']

  collectionsToCreate.forEach(async (collectionToCreate) => {
    console.log("==== collectionToCreate: ", collectionToCreate)
    if(collectionNames.includes(collectionToCreate)) {
      console.log(`'${collectionToCreate}' collection already exists, skipping`)
    } else {
      console.log(`Creating '${collectionToCreate}' collection`)
      await db.createCollection(collectionToCreate)
    }
  })

  console.log("==== admin userid: ", await insertNewUser({
    name: "admin",
    email: adminEmail,
    password: adminPass,
    admin: true,
    homes: [],
    api_keys: []
  }))

  closeDbConnection(function () {
    console.log("== DB connection closed")
  })
})
