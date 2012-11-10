(function() {

    require('./mongo_wrapper').get_mongo_server(function(alarms) {

	var express = require('express');
	var app = express();
	var server = require('http').createServer(app);

	var io = require('socket.io').listen(server);

	io.set('log level', 2);

	io.of('/io_login')
	    .on('connection', require('./iohandlers/login').handle_login);
	io.of('/io_connected')
	    .on('connection', require('./iohandlers/connected').handle_connected);
	io.of('/io_time_alarm')
	    .on('connection', function(soc) {
		require('./iohandlers/time_alarm').handle_time_alarm(soc, alarms)
	    });

	app.use('/p', express.static(__dirname + '/public'));

	app.get('/', function(req, res) {
	    res.redirect('/p/index.html');
	});

	if (process.env.app_port) {
	    server.listen(process.env.app_port);
	    console.log('listening on port ' + process.env.app_port);
	} else {
	    server.listen(8080);
	    console.log('listening on port 8080');
	}

    });
})();