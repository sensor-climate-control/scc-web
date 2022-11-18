const express = require('express')

const api = require('./server/api')

const hostname = '127.0.0.1';
const port = 3001;

var app = express();

app.use(express.json());
app.use(express.static('build'));

app.use('/', api);

app.use('*', function (req, res, next) {
	res.status(404).json({
	  error: "Requested resource " + req.originalUrl + " does not exist"
	});
});

app.listen(port, function() {
	console.log(`Server running at http://${hostname}:${port}/`);
});
