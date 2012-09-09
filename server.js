

(function() {
    var express = require('express');
    var alarm_config = require('./config_alarm');
    var app = express();
    var server = require('http').createServer(app);

    alarm_config.init_config(server);

    app.use('/p', express.static(__dirname + '/public'));


    app.get('/', function(req, res) {
	res.redirect('/p/html/index.html');
    });

    server.listen(8080);
    console.log('listening on port 8080');
})();