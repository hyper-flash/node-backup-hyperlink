require("dotenv").config();
var express = require('express');
app = express();

// Api document routers
//var apidoc 	= require('./modules/v1/api_document/index')
var app_v1 = require('./modules/v1/route_manager');

// Setting up express for text parser
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

//app.use('/v1/api_document/', apidoc);
app.use('/api/v1', app_v1);

// Listen to port for TrainingSession app
try {
	server = app.listen(process.env.PORT);
	console.log("Connected to TrainingSession app On PORT : "+process.env.PORT);
} catch (err) {
	console.log("Failed to connect");
}