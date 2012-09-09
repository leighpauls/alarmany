(function() {

    function dispatch(app_server) {
	var mongo = require('mongodb')
	, Server = mongo.Server
	, Db = mongo.Db;

	var server = new Server('localhost', 27017, {auto_reconnect: true});
	var db = new Db('exampleDb', server);

	db.open(function(err, db) {
	    if(err) {
		console.log(err);
		return
	    }

	    db.collection('alarms', function(err, alarms) {
		if (err) {
		    console.log(err);
		    return;

		}
		console.log('running config server');
		run_server(app_server, alarms);
	    });

	});

    }

    var qr_scan_func = null

    function run_server(server, alarms) {
	var trigger_alarm = require('./trigger_alarm');
	var trigger_qr_nodes = require('./trigger_qr_nodes');
	var config_alarm = require('./config_alarm');

	qr_scan_func = trigger_qr_nodes.attempt_qr_scan;

	trigger_alarm.config_trigger_alarm(alarms, trigger_qr_nodes.trigger_qr_nodes);
	trigger_qr_nodes.config_trigger_qr_nodes(trigger_alarm.dismiss_user_alarms);

	var io = require('socket.io').listen(server);

	io.set('log level', 1);

	io.sockets.on('connection', function (socket) {
	    
	    socket.on('identify_type', function(data) {
		if (data.qr_node) {
		    trigger_qr_nodes.add_qr_node_connection(socket);
		}
		if (data.config_node) {
		    config_alarm.setup_config_node(socket, alarms);
		}
		if (data.alarm_node) {
		    trigger_alarm.add_alarm_connection(socket);
		}
	    });
	    
	});

	
    }

    function scan(seq_id, elem_id) {
	qr_scan_func(seq_id, elem_id);
    }

    module.exports.scan = scan;
    module.exports.dispatch = dispatch;
})();