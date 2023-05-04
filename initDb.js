const { connectToDb, getDbReference, closeDbConnection } = require('./server/lib/mongo')

connectToDb(async function () {
    const db = getDbReference()
    await db.createCollection('homes')
    await db.createCollection('sensors')
    await db.createCollection('users')
  
    closeDbConnection(function () {
      console.log("== DB connection closed")
    })
  })