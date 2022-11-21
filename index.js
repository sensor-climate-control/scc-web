const express = require('express')
const api = require('./server/api')
const cors = require('cors');
const { connectToDb } = require('./server/lib/mongo');

// pull in environment variables from .env in non-production env
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const hostname = '127.0.0.1';
const port = process.env.PORT || 80;

var app = express();

app.use(express.json());
app.use(express.static('build'));
app.use(cors());

app.use('/api', api);

app.use('*', function (req, res, next) {
	res.status(404).json({
	  error: "Requested resource " + req.originalUrl + " does not exist"
	});
});

connectToDb(function ()  {
	app.listen(port, function() {
		console.log(`Server running at http://${hostname}:${port}/`);
	});
})