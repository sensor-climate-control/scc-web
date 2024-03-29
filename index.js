const express = require('express');
const api = require('./server/api');
const cors = require('cors');
const { connectToDb } = require('./server/lib/mongo');
const RateLimit = require('express-rate-limit');
const cron = require('node-cron');
const { checkSensorStatus } = require('./server/lib/sensorStatus');
const { updateWeatherInfo } = require('./server/lib/weather');
const { checkForRecommendationUpdates } = require('./server/lib/recommendations');
const { connectToSMTP } = require('./server/lib/mail');
const dns = require('node:dns');
require('dotenv').config();

const limiter = RateLimit({
	windowMs: 1*60*1000,
	max: 50000
})

dns.setDefaultResultOrder('ipv4first')

const hostname = '127.0.0.1';
const port = process.env.PORT || 80;

var app = express();

app.use(express.json());
app.use(express.static('build'));
app.use('/login', express.static('build'));
app.use('/user', express.static('build'));
app.use('/home', express.static('build'));
app.use(cors());
app.use(limiter)


app.use('/api', function (req, res, next) {
	console.log("============ START API REQUEST LOG ===========")
	console.log(`Incoming API request: ${req.method} ${req.originalUrl} from ${req.ip}`)
	console.log(`HEADERS: ${JSON.stringify(req.headers)}`)
	console.log(`QUERY: ${JSON.stringify(req.query)}`)
	console.log(`BODY: ${JSON.stringify(req.body)}`)
	console.log("============= END API REQUEST LOG ============")
	next();
})
app.use('/api', api);

app.use('*', function (req, res, next) {
	res.status(404).json({
	  error: "Requested resource " + req.originalUrl + " does not exist"
	});
});

connectToDb(function ()  {
	connectToSMTP(function () {
		app.listen(port, function() {
			console.log(`Server running at http://${hostname}:${port}/`);
		});

		cron.schedule("*/15 * * * *", async () => {
			console.log("======== Updating weather information ========")
			try {
				await updateWeatherInfo();
			} catch (e) {
				console.log("==== scheduled task encountered an error: ", e)
			}
		});
		cron.schedule("*/15 * * * *", async () => {
			console.log("======== Updating recommendation information ========")
			try {
				await checkForRecommendationUpdates();
			} catch (e) {
				console.log("==== scheduled task encountered an error: ", e)
			}
		});
		cron.schedule("*/15 * * * *", async () => {
			console.log("======== Checking if sensors are online ========")
			try {
				await checkSensorStatus();
			} catch (e) {
				console.log("==== scheduled task encountered an error: ", e)
			}
		})
	});
});
