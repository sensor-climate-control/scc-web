/*
 * Module for working with a MongoDB connection.
 */

const { MongoClient } = require('mongodb');

require('dotenv').config();

const mongoDbName = process.env.MONGO_DB_NAME || 'prod'

const mongoUrl = (process.env.MONGO_URL) ? (process.env.MONGO_URL) : 
	(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}?directConnection=true`)
console.log("==== mongoUrl: ", mongoUrl)

let db = null
let _closeDbConnection = null
exports.connectToDb = async function (callback) {
	const client = new MongoClient(mongoUrl)
	try {
		await client.connect();

		db = client.db(mongoDbName)
		_closeDbConnection = async function () {
			await client.close()
		}
		callback()
	} catch (e) {
		throw(new Error(e))
	}
}

exports.getDbReference = function () {
  	return db
}

exports.closeDbConnection = async function (callback) {
  	await _closeDbConnection(callback)
}
