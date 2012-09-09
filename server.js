

(function() {
    var express = require('express');
    var app = express();
    var server = require('http').createServer(app);

    var dispatch = require('./dispatch');

    dispatch.dispatch(server)

    app.use('/p', express.static(__dirname + '/public'));

    app.get('/', function(req, res) {
	res.redirect('/p/html/index.html');
    });

    app.get('/scan/:sequence/:element', function (req, res) {
	dispatch.scan(parseInt(req.params.sequence, 10), parseInt(req.params.element));
	res.send(200, 'Scanned!');
    });

    if (process.env.app_port) {
	server.listen(process.env.app_port);
	console.log('listening on port ' + process.env.app_port);
    } else {
	server.listen(8080);
	console.log('listening on port 8080');
    }

})();