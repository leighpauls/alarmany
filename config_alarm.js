//gets socket requests from the configure page, and updates the db accordingly
// TODO: should this be able to deploy an alarm signal outwards???

function init_config(app) {
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
	    run_config_server(app, alarms);
	});

    });
    
}


function run_config_server(server, alarms) {
    var trigger_alarm = require('./trigger_alarm');
    var trigger_qr_nodes = require('./trigger_qr_nodes');

    trigger_alarm.config_trigger_alarm(alarms, trigger_qr_nodes.trigger_qr_nodes);
    trigger_qr_nodes.config_trigger_qr_nodes(trigger_alarm.dismiss_user_alarms);


    var io = require('socket.io').listen(server)
    var config_nodes = [];

    // TODO: do this with a proper http request
    var setup_config_node = function(soc) {
	soc.on('add_alarm', function(data) {
	    if (data.time_stamp && data.alarm_name && data.user) {
		alarms.insert({
		    time: data.time_stamp, 
		    name: data.alarm_name,
		    user: data.user
		});

		console.log('alarm added');
	    } else {
		console.log("tried to create alarm without time, name, or user");
		console.log(data);
	    }
	});

	config_nodes.push(soc);
	soc.on('disconnect', function() {
	    console.log('config node disconnected');
	    var index = config_nodes.indexOf(soc);
	    config_nodes.splice(index, 1);
	});

	soc.emit('ready', {});
    };

    
    io.sockets.on('connection', function (socket) {
	
	socket.on('identify_type', function(data) {
	    if (data.qr_node) {
		trigger_qr_nodes.add_qr_node_connection(socket);
	    }
	    if (data.config_node) {
		setup_config_node(socket);
	    }
	    if (data.alarm_node) {
		trigger_alarm.add_alarm_connection(socket);
	    }
	});
	
    });

}

module.exports.init_config = init_config;