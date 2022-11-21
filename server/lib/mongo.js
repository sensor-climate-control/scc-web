/*
 * Module for working with a MongoDB connection.
 */

const { MongoClient } = require('mongodb')

// pull in environment variables from .env in non-production env
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

// const mongoHost = process.env.MONGO_HOST || 'localhost'
// const mongoPort = process.env.MONGO_PORT || 27017
// const mongoUser = process.env.MONGO_USER
// const mongoPassword = process.env.MONGO_PASSWORD
const mongoDbName = process.env.MONGO_DB_NAME || 'prod'
// const mongoAuthDbName = process.env.MONGO_AUTH_DB_NAME || mongoDbName

const mongoUrl = process.env.MONGO_URL
console.log("==== mongoUrl: ", mongoUrl)

let db = null
let _closeDbConnection = null
exports.connectToDb = function (callback) {
  	MongoClient.connect(mongoUrl, function (err, client) {
    	if (err) {
      		throw err
    	}
    	db = client.db(mongoDbName)
    	_closeDbConnection = function () {
      		client.close()
    	}
    	callback()
  	})
}

exports.getDbReference = function () {
  	return db
}

exports.closeDbConnection = function (callback) {
  	_closeDbConnection(callback)
}