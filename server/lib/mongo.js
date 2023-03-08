/*
 * Module for working with a MongoDB connection.
 */

const { MongoClient } = require('mongodb')

require('dotenv').config();

const mongoDbName = process.env.MONGO_DB_NAME || 'prod'

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