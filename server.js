(function() {

    require('./mongo_wrapper').get_mongo_server(function(collections) {

	var express = require('express');
	var app = express();
	var server = require('http').createServer(app);
	var io = require('socket.io').listen(server);

	// database controllers
	var user_database = require('./db_controllers/user_database')
	    .user_database(collections.users);
	var alarm_database = require('./db_controllers/alarm_database')
	    .alarm_database(collections.alarms);


	// Load IO handlers
	var time_alarm = require('./iohandlers/time_alarm');

	var sign_up = require('./iohandlers/sign_up');
	var login = require('./iohandlers/login');

	var connected = require('./iohandlers/connected');

	io.set('log level', 2);

	// configure
	io.of('/io_login')
	    .on('connection', function(soc) {
		login.handle_login(soc, user_database);
	    });

	io.of('/io_connected')
	    .on('connection', connected.handle_connected);

	io.of('/io_time_alarm')
	    .on('connection', function(soc) {
		time_alarm.handle_time_alarm(soc, alarm_database);
	    });

	io.of('/io_sign_up')
	    .on('connection', function(soc) {
		sign_up.handle_sign_up(soc, user_database);
	    });

	// bind static files
	app.use('/p', express.static(__dirname + '/public'));
	app.use('/c', express.static(__dirname + '/common'));

	app.get('/', function(req, res) {
	    res.redirect('/p/index.html');
	});

	// launch the server
	if (process.env.app_port) {
	    server.listen(process.env.app_port);
	    console.log('listening on port ' + process.env.app_port);
	} else {
	    server.listen(8080);
	    console.log('listening on port 8080');
	}

    });
})();